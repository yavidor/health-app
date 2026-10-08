# Cycle and mood tracking

## Problem Statement

A person using this app can record workouts, food, and body measurements, but nothing about their menstrual cycle or their mood. There is no way to answer questions like "how does my eating change in the week before my period" or "is my sleep — and therefore my mood — worse in the luteal phase". The app already collects several metrics across time but provides no way to see them against each other, and none of the data is stored with a real date, so comparisons are not even possible yet.

## Solution

Two new capabilities in a single self-hosted app for a small friend group:

1. **Cycle tracking.** The person records when a period starts, and the app derives where every date falls in that cycle — the Cycle Day and the Cycle Phase — using configurable boundaries derived from their own history. They can correct any individual day when the derivation is wrong. They can then see a chart of their intake by Cycle Phase.
2. **Mood tracking.** The person records a daily Mood Score and any number of Mood Tags, from a seed set they can extend. They can then see how their mood varies across Cycle Phase.

Both live in a new Cycle area of the app, and their comparison views sit alongside the existing charts.

Underneath, both rest on two foundational changes: a real database with migrations (there is none today), and real ISO dates on stored and served data (today's series carry display strings like `"W1"` and ambiguous single weekday letters).

## User Stories

### Cycle logging

1. As a person who menstruates, I want to record the day my period started, so that the app knows where my cycle begins.
2. As a person who menstruates, I want to correct a period start I logged on the wrong day, so that my Cycle Phases are not wrong because of a typo.
3. As a person who menstruates, I want to see my current Cycle Day, so that I know where I am in my cycle today.
4. As a person who menstruates, I want to see which Cycle Phase I am in right now, so that I can relate how I feel to the pattern I am in.
5. As a person who menstruates, I want to see a calendar of the current cycle with each day marked by its Cycle Phase, so that I can see the shape of the whole cycle rather than one day.
6. As a person who menstruates, I want to see my past period starts listed in order, so that I can check my own history and spot gaps.
7. As a person whose cycles are not 28 days, I want the app to derive Cycle Length from my own Period Starts rather than assume a fixed length, so that my Cycle Days are not systematically wrong.
8. As a person whose cycles vary month to month, I want each cycle's length derived from that cycle's own Period Starts, so that a single long cycle does not distort every cycle after it.
9. As a person with an unusually long or short cycle, I want the app to still show a sensible Cycle Day and Phase, so that I am not left with a blank screen.
10. As a person who has only just started tracking, I want to see sensible Cycle Days for days before my first Period Start, so that the app is not empty on day one.
11. As a person who wants a different model, I want to adjust my phase boundaries and default cycle and bleed lengths, so that the derived Cycle Phase matches how I actually experience my cycle.
12. As a person who finds a derived Cycle Phase wrong, I want to override the Cycle Phase for that specific date, so that the app reflects what actually happened.
13. As a person who overrides a Cycle Phase by mistake, I want to clear the override so the derived Cycle Phase comes back, so that I am not stuck with a wrong value.
14. As a person who overrides a Cycle Phase, I want my other dates to still show their derived Cycle Phase, so that an override is a local exception rather than a global change.
15. As a person who corrects an old Period Start, I want the Cycle Days and Cycle Phases after it to update automatically, so that my history is never internally inconsistent.
16. As a person who is new to the app, I want reasonable default Cycle Settings so that Cycle Phase works before I have configured anything.
17. As a person who takes hormonal medication, I want the app to ask me, so that it can tell me its Cycle Phase estimates are unreliable rather than presenting them as fact.

### Mood logging

18. As a person tracking my health, I want to record my Mood Score for today, so that I can see how it changes over time.
19. As a person tracking my health, I want to record a Mood Score for a past date I forgot to fill in, so that gaps in my history do not become permanent.
20. As a person tracking my health, I want to attach any number of Mood Tags to a Mood Score, so that I can describe a day more precisely than a single number allows.
21. As a person tracking my health, I want to pick from a set of suggested Mood Tags rather than typing from scratch, so that recording is quick.
22. As a person tracking my health, I want to add a Mood Tag of my own, so that I can describe my moods in words the seed set does not have.
23. As a person who has added my own Mood Tags, I want to see my own Mood Tags offered alongside the suggested ones, so that they are equally easy to pick.
24. As a person who mistyped a Mood Tag, I want to rename or remove it, so that my Mood Tags do not fragment into near-duplicates.
25. As a person who logged a Mood Score by mistake, I want to edit or delete today's entry, so that I am not stuck with it.
26. As a person with a normal day, I want to be able to log a Mood Score with no tags, so that a quick entry is still possible.
27. As a person who has not logged a Mood Score on some days, I want those days to be clearly missing rather than shown as zero, so that I am not misled by my own gaps.
28. As a person with an existing Mood Entry for a date, I want my second entry for that date to replace or update the first, so that a date never has two conflicting Mood Scores.
29. As a person with no history in a Cycle Phase, I want that phase shown as having no data rather than as zero, so that I am not misled.

### Cross-data

30. As a person tracking my health, I want to see my average calories by Cycle Phase, so that I can see how my intake changes across my cycle.
31. As a person tracking my health, I want to see my average Mood Score by Cycle Phase, so that I can see how my mood changes across my cycle.
32. As a person tracking my health, I want to see how often each Mood Tag appears in each Cycle Phase, so that I can spot patterns like "I feel anxious every luteal phase".
33. As a person tracking my health, I want to compare a range of days, so that I can see trends rather than a single week.
34. As a person tracking my health, I want to see a clear explanation of what a chart is showing when a phase has too few days to be meaningful, so that I am not misled by thin data.
35. As a person reading a correlation view, I want to be clear that it reflects my own reported experience and is not a medical finding, so that I do not over-read it.

### Foundations the above depend on

36. As a person using the app, I want my health data actually saved, so that it survives restarting the app.
37. As a person using the app, I want my cycle and mood data to be kept separate from anyone else's, so that a friend joining the group never sees my data.
38. As a person using the app, I want my period starts and Mood Entries to be mine alone, so that another User cannot record data as me.
39. As a person using the app, I want existing recorded metrics to be comparable with my new cycle and mood data, so that I can cross new against old.
40. As a person upgrading the app, I want my existing data preserved when the database schema changes, so that I do not lose history.

## Implementation Decisions

### Sequencing

Split into two features, cycle tracking first. Mood cannot be validated against Cycle Phase before Phase logic exists, so the order is forced. A single Cycle area carries both, and the correlation views sit on the Stats page with the existing charts.

### Foundational: database and migrations

- No database is currently opened, though the SQLite driver is already imported. Opening it and adding a versioned, idempotent migration mechanism is the first work and gates everything else. A rerun against an existing file must not re-apply anything.
- Migration mechanics are a genuine choice here rather than an obvious one. Given the size of this change, weigh a hand-rolled ordered migration list with a recorded applied-version table against adopting a migration library; the project currently has no third-party backend dependency other than the SQLite driver, and that is a preference worth respecting deliberately rather than by default.

### Foundational: real dates

- Stored and served dates become ISO `YYYY-MM-DD`. Existing series currently carry pre-formatted display strings (`"W1"`, `"Aug 29"`, and single weekday letters where `"T"` is ambiguous between Tuesday and Thursday). Cross-metric joins are impossible until dates are real, and joining on those strings would produce charts that look correct and are wrong.
- This applies to existing metrics too, not only new ones. If new metrics are dated correctly while old ones stay as display strings, the two cannot be crossed, which defeats the purpose.
- The frontend has no date library and no date logic at all today. Formatting real dates for display is new work, and display formatting moves to the client as a consequence.
- Formatting happens in exactly one place, so that a chart's axis labels and its underlying dates cannot drift apart.

### Data model

All tables that hold user data carry `user_id` and are scoped by it. Uniqueness is per-User, not global: a meal is unique per (user, date, slot), not per (date, slot), otherwise two users' entries collide.

- `user`: identity, created timestamp.
- `cycle_settings`: one row per user — default cycle length, default bleed length, phase boundaries, and the hormonal-medication answer.
- `period_start`: id, user, date, unique per (user, date).
- `phase_override`: user, date, phase, unique per (user, date).
- `mood_entry`: id, user, date, score 1–5, unique per (user, date).
- `mood_tag`: id, user, label, unique per (user, label).
- `mood_entry_tag`: join between mood entry and mood tag.

Schema follows [ADR-0001](../../docs/adr/0001-multi-user-schema-single-user-runtime.md): multi-user schema with single-user runtime. No login screen in this work.

### Phase derivation

- Cycle Phase is derived on read from Period Start and Cycle Settings, following [ADR-0002](../../docs/adr/0002-cycle-phase-derived-with-override.md). A stored phase value is never authoritative.
- An override, when present, replaces the derived Cycle Phase for that date only. Its absence means "derive it", not "unknown" — these are different states and must not be conflated.
- Derivation lives behind a single module with no database dependency, so the model can change without a data migration. It is expected to change.
- **Phases overlap and must not be modelled as disjoint buckets.** The follicular phase begins on Day One, the same day as menstrual, so a date in the first days of a cycle is in both. One-of-four labelling mislabels exactly the days people most care about. Decide explicitly whether a date reports one phase or a set.
- **Fixed offsets are an estimate, and the app should not overstate them.** Standard practice counts forward from Day One on a 28-day prototype, but a 612,613-cycle cohort found mean follicular 16.9 days (95% CI 10–30) and luteal 12.4 (95% CI 7–17), explicitly contradicting the "luteal is always 14" rule. Variation is driven mostly by ovulation timing, which cycle length alone does not predict. Cycle Length is derived from consecutive Period Starts per cycle, never assumed from a single global default.
- Phase boundaries are configurable per user and stored, not hardcoded. Defaults follow the clinical consensus of four phases with bleeding 3–7 days and cycle length 21–38 days.
- Days before a user's earliest Period Start have no cycle. This is a real state, not an error.
- Deriving from a logged ovulation day would be more accurate, but requires an input the app does not collect. Deferred.
- Deriving an average cycle length across a user's history is a tempting simplification and should be treated as such: a single atypical cycle should not shift every subsequent cycle's Cycle Day.

### API

- `GET /api/cycle` — period starts in range, plus per-date Cycle Day and effective Cycle Phase, honouring overrides.
- `POST /api/cycle/period-starts`, with correction and deletion of existing entries.
- `PUT`/`DELETE` for phase overrides; clearing an override returns that date to its derived value.
- `GET`/`PUT` for cycle settings.
- `GET`/`POST`/`PUT`/`DELETE /api/mood` — at most one Mood Entry per user per date; a second entry for a date updates rather than conflicts.
- Cycle phase aggregation and mood-by-phase aggregation endpoints returning averages and Mood Tag frequencies per phase.
- Aggregation must be able to distinguish "no data" from zero, and must report the number of days behind each figure so thin phases are visible as thin.
- The frontend mock plugin currently drops unknown query parameters. Any new parameters need mock support so QA can exercise the real UI, consistent with how mock mode already works.

### Correlation views

- Three views: **Mood by Cycle Phase**, **Calories by Cycle Phase**, and the **existing Calories vs. Weight** view kept as-is. The first is new with mood, the second is new and is the original ask, the third is not rebuilt.
- Both new views are grouped bars over a phase bucket. Neither needs a dual axis, a metric registry, or client-side alignment.
- **Do not display a correlation coefficient.** With one Mood Score per logged day, sparse logging, and four phase buckets, a coefficient is a number without meaning. The existing `-0.84` in the mock fixture is exactly the invented authority not to repeat. Report per-phase averages and tag frequencies, which are honestly interpretable.

### Pre-existing defects found while scoping

Not caused by this work, but the new views sit on top of them, and leaving them would mean shipping charts next to known-false labels:

- The Stats page renders the subtitle "Calories (left) · Weight (right)" while only one Y axis is drawn. The subtitle is currently false.
- `CorrelationInsight` defaults its title to "Strong negative correlation", so it asserts that about any pair, including a positive or absent one. Its title must be derived from the actual data, not defaulted.
- `CorrelationInsight` is rendered inside the fixed-height chart container, so it sits awkwardly within the chart area rather than below it.

### Frontend

- A new Cycle area in the app, alongside Dashboard, Fitness, Food, Stats, and Squad: logging for Period Starts and Mood, the current Cycle Day and Phase, a cycle calendar marked by phase, and Cycle Settings.
- Correlation views join the existing charts on the Stats page.
- The route list is a single source of truth driving both navigation and code-splitting; a new area joins it rather than being wired separately.
- New data follows the existing fetch pattern: a typed hook over the shared API client, rendered through the existing loading/error boundary so failure is visible rather than silently falling back to fixture data.
- Charts follow the existing design system. Only four accent colours exist, so two series must remain distinguishable by more than colour alone.
- Mock fixtures are extended so the new area is fully renderable in mock mode, matching how every other page is QA'd today.

## Testing Decisions

A good test asserts what the user or a caller can observe, not how the code is arranged internally. Three seams, chosen to be as high as possible:

1. **The HTTP API** — the highest existing seam. Tests drive real handlers against a real temporary SQLite file, covering routing, queries, `user_id` scoping, uniqueness rules, and JSON shape together. Ownership leakage between users is asserted here explicitly, because it is the failure mode that would be most damaging and least visible.
2. **Phase derivation as a pure function** — no database. Table-driven across: Day One overlap, phases spanning a period start, cycles shorter and longer than settings, override precedence, dates before the earliest Period Start, and per-cycle rather than average length. This seam exists specifically to keep the phase model cheap to change, as ADR-0002 requires; testing it only through HTTP would reintroduce the coupling that ADR exists to avoid.
3. **The page, rendered with a stubbed network** — the highest frontend seam. Render the real Cycle area and the real correlation views against fixture responses and assert what is shown. This covers the existing loading and error boundary states, which is where these features live.

Prior art and gaps: the frontend has a working pattern for rendering behaviour with a stubbed request in its hook tests, and jsdom plus Testing Library are already configured. What does **not** exist is any component or page test — the current tests cover only pure functions and hooks. This seam establishes that precedent; the dependencies are already present, so it is convention rather than new tooling that is missing.

Aggregation logic is exercised through the API seam rather than given its own seam, on the expectation that it is small enough for that to be sufficient. If it grows a subtlety that the API surface cannot express, give it a seam then.

## Out of Scope

- **Authentication and login.** No login screen, no session tokens, no invite codes. The app resolves a single seeded user implicitly. Schema supports many users; runtime does not yet.
- **Existing `/api/dashboard`, `/api/fitness`, `/api/food`, `/api/squad`, `/api/stats` endpoints.** Building these is separate work. Making existing metrics carry real dates is in scope; building their endpoints is not.
- **A general metric-pairing picker.** Letting a person choose any two metrics dynamically, with client-side alignment and dual axes, is deferred. Three fixed views first, then learn which comparisons actually matter — with cycle tracking newly available, today's assumptions about interesting pairings are unreliable. The charting library supports dual axes when this is picked up.
- **Deriving phase from a logged ovulation day.**
- **Pregnancy tracking, contraception adherence, or any other cycle-related clinical feature.**
- **Offline support.** The app is online-first, with no runtime caching and no mutation queue, by existing design.
- **Squad and leaderboard work**, including connecting `LEADERBOARD_PLAYER` to a real user.
- **JSON export/import**, despite existing export buttons.

## Further Notes

- Vocabulary for this domain is defined in the project glossary; the terms Cycle Day, Cycle Phase, Period Start, Cycle Length, Cycle Settings, Bleed Length, Phase Override, Derived Phase, Mood Entry, Mood Score, and Mood Tag are used above in their defined senses.
- Plan, including the reasoning behind these decisions and the clinical sources, is in the agent docs.
- **One open question is unresolved:** whether the app asks about hormonal contraception at setup. The column is in the schema; the answer is not. Cycle Phase is only meaningful when a user is not on hormonal medication, since it disrupts the phase model itself, and per-cycle cohort definitions exclude such users. Cheapest moment to decide is before the migration lands. If declined, the app should still not present Phase as certain.
- Phase-group mood research in the literature correlates phase with hormone assays, not self-reported tags. Anything this app surfaces is the user's subjective experience — legitimate to track, but not a clinical finding, and should be worded that way in the UI.
- Pre-flight check worth doing before the migration: the existing mock fixture contains a fabricated correlation value that the new views must not imitate.