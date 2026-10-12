package db

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

// The pool is held to a single connection: SQLite has one writer, so a second
// concurrent write could only block on the first.
func Open(path string) (*sql.DB, error) {
	conn, err := sql.Open("sqlite", "file:"+path+"?_pragma=foreign_keys(1)")
	if err != nil {
		return nil, fmt.Errorf("open database %q: %w", path, err)
	}
	conn.SetMaxOpenConns(1)
	return conn, nil
}
