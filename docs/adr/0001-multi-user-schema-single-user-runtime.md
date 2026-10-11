---
status: superseded by ADR-0004
---

# Multi-user schema, single-user runtime

Add `user_id` to every table now, even though auth does not exist yet, so that
adding more Users later is a configuration change rather than a migration. Every
record is read and written in the context of one User, with no cross-User query
path in the runtime.

## Consequences

- Uniqueness constraints are per-User, not global: a `MEAL` is unique per
  (user_id, date, slot), not per (date, slot). Without this, one user's meals
  would collide with another's.
- `LEADERBOARD_PLAYER` has no foreign key to `USER`, because the Squad game is
  defined over a shared group rather than over individual records.

## Superseded in part

The `(user_id, date, slot)` uniqueness for `MEAL` no longer holds: a Meal is an
occasion holding many Foods, so a User has several Meals per slot per day. See
ADR-0004. The `user_id`-on-every-table decision stands.
