# Plan: Cycle tracking and mood tracking

Split into two features. **Feature A first** — mood-by-cycle-day is worthless
without phase logic, so the order is forced. Settled during a `/grill-with-docs`
session; vocabulary in [`GLOSSARY.md`](./GLOSSARY.md), decisions in
[`docs/adr/`](../adr/).

## Why this was planned

`docs/humans/features.md` asks for cycle tracking and for seeing "how much food you
ate by stage of the cycle." Neither exists: no entities in the ER diagram, no code,
no roadmap entry. Mood tracking was added during planning and appears in no human
doc yet.

Two constraints shaped everything:

1. **There is no backend.** No DB is opened, no schema exists, no `/api/*`
   handlers. This work is therefore blocked on opening SQLite and writing
   migrations.
2. **There are no real dates in the data.** Series carry pre-formatted display
   strings (`"W1"`, `"Aug 29"`, and single weekday letters where `"T"` is
   ambiguous between Tuesday and Thursday). Cross-metric joins are impossible
   until dates become real. `src/lib/format.ts` is 19 lines with no date logic.

## Pre-flight, both features

| Item | Decision |
|---|---|
| SQLite + migrations | Required. Not yet started; gates everything. |
| `user_id` on every table | Required from migration 1 — see [ADR-0001](../adr/0001-multi-user-schema-single-user-runtime.md) |
| ISO `YYYY-MM-DD` storage and API | Required across existing metrics, not only new ones. Option (c) (new data dated, old data not) would leave new metrics uncrossable against old ones. |
| Auth | Out of scope. Implies single seeded User. See ADR-0001. |
| Existing `/api/dashboard`, `/api/fitness`, `/api/food`, `/api/squad`, `/api/stats` | Out of scope. Untouched by both features. |
| Mood seed tags | 12-tag seed set, editable by the User: `calm`, `irritable`, `energetic`, `tired`, `anxious`, `focused`, `sad`, `low`, `motivated`, `sensitive`, `confident`, `stressed` |

### Pre-existing bugs found while scoping

Not caused by this work, but Feature A's charts sit on top of them:

- `StatsPage.tsx` renders subtitle "Calories (left) · Weight (right)" while only
  one `<YAxis>` is drawn. The subtitle is false today.
- `CorrelationInsight` defaults `title` to `'Strong negative correlation'`, so it
  claims that about any pair, including a positive one.
- `CorrelationInsight` is passed as a child of `ChartCard`, so it renders inside
  the 240px chart div alongside the `ResponsiveContainer`.

---

## Feature A — Cycle tracking

### Starting point

The first thing to build is the persistence layer, because nothing else has
anywhere to put data. Order within the feature:

1. **Open SQLite and add a migration mechanism.** `main.go` blank-imports
   `go-sqlite3` but opens no DB. Migrations must be versioned and idempotent —
   a rerun on an existing file must not re-apply.
2. **Schema.** `user`, `period_start`, `cycle_settings`, `phase_override`.
   All carry `user_id`. `period_start` is unique per (user_id, date).
3. **Phase derivation behind one module.** Given a date and a User's
   `cycle_settings`, return Cycle Day and Cycle Phase. This is the seam that
   must absorb a future model change — see
   [ADR-0002](../adr/0002-cycle-phase-derived-with-override.md). It must be
   testable without a database.
4. **`GET /api/cycle`** — period starts in range, plus per-date cycle day and
   derived phase, honouring overrides.
5. **Logging UI** — record a Period Start, adjust Cycle Settings, override a
   date's phase.

### Data model

```
user           (id PK, name, created_at)
cycle_settings (user_id PK/FK, default_cycle_length, default_bleed_length,
                phase_boundaries JSON, uses_hormonal_medication NULL)
period_start   (id PK, user_id FK, date, UNIQUE(user_id, date))
phase_override (user_id FK, date, phase, UNIQUE(user_id, date))
```

`phase_boundaries` holds the phase cut points rather than hardcoding them, since
Q13 chose user-configurable boundaries. A sensible default is derived from the
clinical consensus: four phases — menstrual, follicular, ovulation, luteal — with
menstrual bleeding 3–7 days and cycle length 21–38 days.

### Phases overlap — do not model as a disjoint enum

The follicular phase **begins on Day One**, the same day as menstrual. Sources
agree on this (Cleveland Clinic, Kaiser Permanente, StatPearls). A date in the
first few days is in both. If phase is stored or computed as one-of-four, the
early-cycle days get mislabelled.

### Fixed offsets are an estimate

Standard practice counts forward from Day One on a 28-day prototype, but the
600K-cycle cohort (`npj Digital Medicine`, 2019) found mean follicular **16.9
days** (CI 10–30) and luteal **12.4** (CI 7–17) — explicitly contradicting the
"luteal is always 14" rule. Variation is driven mostly by **ovulation timing**,
which cycle length alone does not predict. This is exactly why phase is derived
and overridable rather than stored, and why the UI should not present it as
certain.

Deriving from a logged ovulation day is more accurate, but requires an input this
app does not collect. Deferred.

### Correlation views

Both are `GroupedBarChart` over a phase bucket; neither needs dual-axis or a
metric registry.

- **Calories by cycle phase** — the `features.md` promise.
- **Mood by cycle phase** — arrives with Feature B.

The existing **Calories vs. Weight** view is kept as-is, not rebuilt.

### Deferred deliberately

A general metric-pairing picker (arbitrary two metrics, client-side alignment,
dual-axis via Recharts `yAxisId`). Recharts 3.10.1 supports `yAxisId` and
`ScatterChart`; the current wrappers just do not expose them. Cheaper to build the
three fixed views first and learn which pairs matter — with cycle tracking newly
available, today's assumptions about interesting comparisons are unreliable.

### Open question

**Does the app ask about hormonal contraception?** Unresolved. Cycle phase is only
meaningful when a User is not on hormonal medication, which disrupts the phase
model itself; a per-cycle cohort definition excludes users on hormonal
contraceptives. One boolean on `cycle_settings` (`uses_hormonal_medication`, already
in the schema above), asked once at setup, with phases labelled as estimates when
yes. Unanswered so far — decide before the migration lands, since it is a column.

---

## Feature B — Mood tracking

Blocked by Feature A: mood is charted against cycle phase, so it cannot be
validated before phase logic exists.

### Starting point

1. **Schema.** `mood_entry`, `mood_tag`, `user_mood_tag`. `mood_entry` unique per
   (user_id, date). `mood_entry.tags` is many-to-many via a join table, since a
   Mood Entry carries any number of Mood Tags.
2. **`POST /api/mood`**, `GET /api/mood?from&to`, and per-phase aggregation
   returning average Mood Score and Mood Tag frequency per phase.
3. **Logging UI** — score 1–5 plus tag picker (seed tags plus any the User has
   added).
4. **Mood by cycle phase view** on Stats.

### Data model

```
mood_entry     (id PK, user_id FK, date, score 1-5, UNIQUE(user_id, date))
mood_tag       (id PK, user_id FK, label, UNIQUE(user_id, label))
mood_entry_tag (mood_entry_id FK, mood_tag_id FK)
```

### Why tags need a User-owned vocabulary

Free text alone makes tags uncountable — "calm", "Calm", and "relaxed" fragment any
later correlation. A shipped seed set gives an immediately usable chart; letting the
User add tags stops it becoming a straitjacket.

### On computing correlation coefficients

**Do not** show a Pearson coefficient over these data. With one Mood Score per
logged day, sparse logging, and four phase buckets, a coefficient would be a number
without meaning. The existing `-0.84` in `mockData.json` is precisely the invented
authority worth not repeating. Report per-phase averages and tag frequencies, which
are honestly interpretable.

### Modelling note, for anyone extending this

Phase-group mood research correlates phase with **hormone assays**, not
self-reported tags. So any strong relationship this app surfaces is the user's
subjective experience, which is a legitimate thing to track but is not a clinical
finding. Worth a line in the UI rather than an implied medical claim.

---

## Sources

Clinical facts from primary sources: StatPearls/NCBI `NBK500020`,
*npj Digital Medicine* 2019 (612,613 cycles), UpToDate, Cleveland Clinic, Kaiser
Permanente. Findings are the kind `/research` would capture as a cited file; that
file is not written yet.