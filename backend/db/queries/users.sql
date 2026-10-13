-- name: GetUsers :many
SELECT *
from user
;

-- name: GetUserByDisplayName :one
select *
from user
where display_name = ?
limit 1
;

-- name: CreateUser :exec
INSERT INTO
  user (id, display_name, created_at)
VALUES
  (?, ?, CURRENT_TIMESTAMP);
