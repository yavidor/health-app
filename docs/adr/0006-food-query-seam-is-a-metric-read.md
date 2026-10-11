# The food query seam is a Metric read, one source wide

Reading a User's food data for the Food Screen goes through a general "give me
this Metric, by date, over this range" interface, with calories as the only Metric
actually implemented. The interface is general from day one so the deferred
Stats correlation work can add sources without reshaping this seam; the
implementation is deliberately not, because the other sources have no writers yet
and building aggregation for them now would be speculative.

## Considered Options

- **Food-shaped query** — `dailyTotals(from, to) → {date, kcal, protein, carbs, fat}[]`.
  Cheapest and honest about what exists. Rejected: it bakes in this feature's
  guesses about which axes matter, and the Stats work inherits them.
- **A fully general Metric read, all sources built now.** Right shape, wrong size:
  body Measurement and Mood Score have no writers, so most of it would be
  untestable code written against imagined requirements.
- **General interface, calories only.** Chosen.

## Consequences

- Calories are derived from Foods at read time against the Calorie Target in force
  on that date (ADR-0004). No stored daily total row exists, so no stored number
  can drift out of agreement with the Foods it came from. This is the concrete
  answer to "keep things ready for correlation": correctness is structural, not a
  migration someone has to remember to run later.
- **A second source is a new implementation of the same interface, not a
  refactor.** Adding weight as a Metric must not require touching the food
  implementation or anything that reads it.
- Macros (protein, carbs, fat) are components of calories, not Metrics in their own
  right, and so sit outside this interface. That is a known asymmetry, not an
  oversight: macros are not independently correlatable against a body Measurement
  in the way calories are.
- **Correlation is deliberately not built here.** Nothing in this work should be
  read as a Stats design. The correlation Dashboard is a separate, larger effort,
  and when it is designed it may change storage more substantially than anything
  decided so far.
- Cycle phase is likewise out of scope. It is a pure function of a date and the
  User's cycle records, so it can be derived at read time later without changing
  anything recorded here.
