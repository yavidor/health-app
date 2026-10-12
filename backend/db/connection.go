package db

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

// The pool is held to a single connection: SQLite has one writer, so a second
// concurrent write could only block on the first.
func Open(path string) (*sql.DB, error) {
	// sql.Open is lazy, so a path whose directory does not exist surfaces later
	// as an opaque "unable to open database file". Creating the directory here
	// means a first run against a fresh checkout just works.
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return nil, fmt.Errorf("create database directory for %q: %w", path, err)
	}

	conn, err := sql.Open("sqlite", "file:"+path+"?_pragma=foreign_keys(1)")
	if err != nil {
		return nil, fmt.Errorf("open database %q: %w", path, err)
	}
	conn.SetMaxOpenConns(1)
	return conn, nil
}
