-- Queries against schema_migration, owned by Migrate in db/migrate.go.
-- name: AppliedVersions :many
SELECT version FROM schema_migration ORDER BY version;

-- name: RecordMigration :exec
INSERT INTO schema_migration (version, applied_at) VALUES (?, ?);
