package db

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"io/fs"
	"sort"
	"strconv"
	"strings"
	"time"
)

//go:embed bootstrap/*.sql
var bootstrap embed.FS

//go:embed migrations/*.sql
var migrations embed.FS

func GetMigrations() ([]fs.DirEntry, error) {
	return migrations.ReadDir("migrations")
}

// migration is one file from db/migrations, parsed into its order and its body.
type migration struct {
	version int64
	name    string
	body    string
}

// parseVersion extracts the leading integer from a migration filename of the
// form NNNN_description.sql.
//
// A filename without a numeric prefix is a hard error rather than a skipped
// file: a silently ignored migration looks exactly like a successful one, and
// the disagreement only surfaces much later as a missing table.
func parseVersion(name string) (int64, error) {
	const wantFormat = "want NNNN_description.sql"
	if !strings.HasSuffix(name, ".sql") {
		return 0, fmt.Errorf("migration %q is not a .sql file: %s", name, wantFormat)
	}
	base := strings.TrimSuffix(name, ".sql")
	// The version is the leading run of digits, so that descriptions may contain
	// any punctuation, including the underscores that golang-migrate uses as the
	// separator. The description is whatever follows and must not be empty.
	end := 0
	for end < len(base) && base[end] >= '0' && base[end] <= '9' {
		end++
	}
	if end == 0 {
		return 0, fmt.Errorf("migration %q has no version prefix: %s", name, wantFormat)
	}
	if strings.Trim(base[end:], "_") == "" {
		return 0, fmt.Errorf("migration %q has no description: %s", name, wantFormat)
	}
	version, err := strconv.ParseInt(base[:end], 10, 64)
	if err != nil {
		return 0, fmt.Errorf("migration %q has an unreadable version prefix: %w", name, err)
	}
	return version, nil
}

// loadMigrations reads and orders every embedded migration. Ordering is computed
// from the parsed version rather than assumed from the filesystem listing.
func loadMigrations() ([]migration, error) {
	entries, err := migrations.ReadDir("migrations")
	if err != nil {
		return nil, fmt.Errorf("read migrations: %w", err)
	}
	loaded := make([]migration, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".sql") {
			continue
		}
		version, err := parseVersion(entry.Name())
		if err != nil {
			return nil, err
		}
		body, err := migrations.ReadFile("migrations/" + entry.Name())
		if err != nil {
			return nil, fmt.Errorf("read migration %q: %w", entry.Name(), err)
		}
		loaded = append(loaded, migration{version: version, name: entry.Name(), body: string(body)})
	}
	sort.Slice(loaded, func(i, j int) bool { return loaded[i].version < loaded[j].version })
	for i := 1; i < len(loaded); i++ {
		if loaded[i].version == loaded[i-1].version {
			return nil, fmt.Errorf("migrations %q and %q share version %d",
				loaded[i-1].name, loaded[i].name, loaded[i].version)
		}
	}
	return loaded, nil
}

// createSchemaMigrationTable creates the schema_migration table if it is
// missing. This is not a versioned migration: the runner needs this table in
// order to know which migrations have been applied, so it is bootstrapped before
// the migration stream runs.
func createSchemaMigrationTable(ctx context.Context, conn *sql.DB) error {
	schema, err := bootstrap.ReadFile("bootstrap/schema_migration.sql")
	if err != nil {
		return fmt.Errorf("read bootstrap schema: %w", err)
	}
	if _, err := conn.ExecContext(ctx, string(schema)); err != nil {
		return fmt.Errorf("create schema_migration: %w", err)
	}
	return nil
}

// Migrate applies every migration that has not been applied yet and reports how
// many it applied. Running it against an already-migrated database applies
// nothing and returns 0.
func Migrate(ctx context.Context, conn *sql.DB) (int, error) {
	if err := createSchemaMigrationTable(ctx, conn); err != nil {
		return 0, err
	}
	pending, err := loadMigrations()
	if err != nil {
		return 0, err
	}

	queries := New(conn)
	applied, err := queries.AppliedVersions(ctx)
	if err != nil {
		return 0, fmt.Errorf("read applied migrations: %w", err)
	}
	done := make(map[int64]bool, len(applied))
	for _, version := range applied {
		done[version] = true
	}

	count := 0
	for _, m := range pending {
		if done[m.version] {
			continue
		}
		if err := applyOne(ctx, conn, queries, m); err != nil {
			return count, err
		}
		count++
	}
	return count, nil
}

// applyOne runs a single migration and records it, both in one transaction, so
// a failure cannot leave schema_migration claiming a migration ran when it did not.
func applyOne(ctx context.Context, conn *sql.DB, queries *Queries, m migration) error {
	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin migration %q: %w", m.name, err)
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, m.body); err != nil {
		return fmt.Errorf("apply migration %q: %w", m.name, err)
	}
	record := RecordMigrationParams{Version: m.version, AppliedAt: time.Now().UTC()}
	if err := queries.WithTx(tx).RecordMigration(ctx, record); err != nil {
		return fmt.Errorf("record migration %q: %w", m.name, err)
	}
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit migration %q: %w", m.name, err)
	}
	return nil
}
