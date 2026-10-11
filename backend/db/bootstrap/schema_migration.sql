-- The record of which migrations have been applied. This is NOT a versioned
-- migration: the runner needs this table in order to know that, so it is
-- created unconditionally with IF NOT EXISTS before the migration stream runs.
--
-- sqlc reads this file as schema (see sqlc.yaml) so that the queries in
-- db/queries/migrations.sql type-check.
CREATE TABLE IF NOT EXISTS schema_migration (
  version    INTEGER PRIMARY KEY,
  applied_at DATETIME NOT NULL
);
