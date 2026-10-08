# Cycle phase is derived and optionally overridden, never stored as truth

Cycle Phase is a function of Period Start and Cycle Settings, so we do not treat a
stored phase as authoritative. Each date's phase is derived on read; a nullable
per-date override, when present, replaces it for that date only. `NULL` means
"derive it", not "unknown".

## Consequences

- Correcting a Period Start re-derives every downstream phase automatically. There
  is no stored state to fall out of sync with the input.
- The stored value is deliberately **not** the source of truth. A Phase Override is
  a local exception, not a cached derivation. Do not "simplify" this by treating a
  non-null phase as authoritative, or by backfilling derived phases into the column.
- The derivation is an estimate. Clinical sources show follicular phase varies far
  more than cycle length alone predicts (a 600K-cycle cohort found mean follicular
  16.9 days, CI 10–30, driven mostly by ovulation timing). Presenting phase without
  that caveat would be overstating what the data supports.
- Phase derivation must live behind one module so the model can change without a
  data migration. It is expected to change.