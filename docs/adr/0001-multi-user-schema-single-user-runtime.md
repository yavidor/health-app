# Multi-user schema with single-user runtime

The app is a multi-user platform for a small self-hosted friend group, but the
current runtime authenticates implicitly as one seeded User with no login screen.
We add `user_id` to every table from the first migration anyway, so that real data
never has to be retrofitted with ownership later, and defer auth to its own ticket.

## Consequences

- Every table that holds user data carries `user_id` and is scoped by it. There is
  no "global" row that any User can see by default.
- Uniqueness constraints are per-User, not global: a `MEAL` is unique per
  (user_id, date, slot), not per (date, slot). Without this, one user's meals
  collide with another's.
- The running app resolves its User without credentials. When auth lands, that
  resolution is the only thing that changes; no query changes.
- `LEADERBOARD_PLAYER` in the ER diagram is currently a flat table with no FK to
  `USER`. It cannot become a real leaderboard until it references a User.