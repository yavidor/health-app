-- name: GetUsers :many
SELECT * FROM user;

-- name: GetUserByDisplayName :one
SELECT *
    FROM user
    WHERE display_name = ? LIMIT 1;
