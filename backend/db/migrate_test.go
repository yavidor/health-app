package db

import (
	"context"
	"database/sql"
	"path/filepath"
	"strings"
	"testing"
)

// openTestDB opens a private on-disk database for one test. On-disk rather than
// :memory: so that the file outlives a single connection the way the real one does.
func openTestDB(t *testing.T) *sql.DB {
	t.Helper()
	conn, err := Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open: %v", err)
	}
	t.Cleanup(func() { conn.Close() })
	return conn
}

func TestMigrateAppliesToAFreshDatabase(t *testing.T) {
	ctx := context.Background()
	conn := openTestDB(t)

	applied, err := Migrate(ctx, conn)
	if err != nil {
		t.Fatalf("Migrate: %v", err)
	}
	if applied == 0 {
		t.Fatalf("applied %d migrations to a fresh database, want at least 1", applied)
	}

	var userTable string
	err = conn.QueryRowContext(ctx,
		`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'user'`).Scan(&userTable)
	if err != nil {
		t.Fatalf("user table was not created: %v", err)
	}

	versions, err := New(conn).AppliedVersions(ctx)
	if err != nil {
		t.Fatalf("AppliedVersions: %v", err)
	}
	if len(versions) != applied {
		t.Fatalf("recorded %d versions, but Migrate reported %d applied", len(versions), applied)
	}
}

// Migrate runs on every startup, so applying nothing on the second run is the
// property that keeps an existing database from being double-migrated.
func TestMigrateAgainstAnAlreadyMigratedDatabaseAppliesNothing(t *testing.T) {
	ctx := context.Background()
	conn := openTestDB(t)

	if _, err := Migrate(ctx, conn); err != nil {
		t.Fatalf("first Migrate: %v", err)
	}
	first, err := New(conn).AppliedVersions(ctx)
	if err != nil {
		t.Fatalf("AppliedVersions: %v", err)
	}

	applied, err := Migrate(ctx, conn)
	if err != nil {
		t.Fatalf("second Migrate: %v", err)
	}
	if applied != 0 {
		t.Errorf("second Migrate applied %d migrations, want 0", applied)
	}

	second, err := New(conn).AppliedVersions(ctx)
	if err != nil {
		t.Fatalf("AppliedVersions: %v", err)
	}
	if len(first) != len(second) {
		t.Errorf("version count went from %d to %d across a repeat run", len(first), len(second))
	}
}

func TestParseVersion(t *testing.T) {
	tests := []struct {
		name    string
		want    int64
		wantErr bool
	}{
		{name: "0001-create-users-table.sql", want: 1},
		{name: "0002_add-meals.sql", want: 2},
		{name: "0042_x.sql", want: 42},
		{name: "create-users.sql", wantErr: true},
		{name: "users.sql", wantErr: true},
		{name: "_leading.sql", wantErr: true},
		{name: "abc1_name.sql", wantErr: true},
		{name: "0001_.sql", wantErr: true},
		{name: "0001_bad-name.txt", wantErr: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parseVersion(tt.name)
			if tt.wantErr {
				if err == nil {
					t.Fatalf("parseVersion(%q) = %d, want an error", tt.name, got)
				}
				return
			}
			if err != nil {
				t.Fatalf("parseVersion(%q): %v", tt.name, err)
			}
			if got != tt.want {
				t.Errorf("parseVersion(%q) = %d, want %d", tt.name, got, tt.want)
			}
		})
	}
}

// A migration whose filename cannot be parsed must abort startup. Skipping it
// silently would look identical to success until a query failed much later on a
// missing table.
func TestParseVersionErrorNamesTheOffendingFile(t *testing.T) {
	_, err := parseVersion("create-users-table.sql")
	if err == nil {
		t.Fatal("want an error for an unversioned filename")
	}
	if got := err.Error(); !strings.Contains(got, "create-users-table.sql") {
		t.Errorf("error %q does not name the offending file", got)
	}
}

// SQLite leaves foreign keys off unless asked. If the pragma in the DSN is
// misspelled or dropped, every foreign key in the schema silently stops being
// enforced, so assert that one really bites.
func TestForeignKeysAreEnforced(t *testing.T) {
	ctx := context.Background()
	conn := openTestDB(t)

	if _, err := conn.ExecContext(ctx, `CREATE TABLE parent (id TEXT PRIMARY KEY);
		CREATE TABLE child (
			id        TEXT PRIMARY KEY,
			parent_id TEXT NOT NULL REFERENCES parent(id)
		);`); err != nil {
		t.Fatalf("create tables: %v", err)
	}

	_, err := conn.ExecContext(ctx, `INSERT INTO child (id, parent_id) VALUES ('c1', 'no-such-parent')`)
	if err == nil {
		t.Fatal("insert with a dangling foreign key succeeded, want it rejected")
	}
}
