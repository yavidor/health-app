# Foods under Meals; a Meal is not one row per slot

A Meal is an eating occasion holding zero or more Foods, and its calories and
macros are derived from those Foods rather than entered on the Meal itself. A Meal
Slot is an optional attribute of a Meal, not a uniqueness constraint. This
supersedes the `(user_id, date, slot)` uniqueness that ADR-0001 gave `MEAL`.

## Considered Options

- **One row per (user, date, slot).** Cheapest possible model, and what the ERD
  originally described. Rejected: it makes "what did I actually eat" unanswerable,
  because the row would only ever hold a rolled-up total. `docs/humans/data.md`
  wants Users to correlate what they ate against their body Measurements, and a
  total cannot support that.
- **A Meal is a single thing eaten.** Finer-grained and simpler to insert, but it
  loses the occasion, so "what did I have for breakfast" needs a time-window
  heuristic to answer.
- **Three concepts — Meal, Food, and an optional slot.** Chosen. It costs one extra
  entity and buys both questions: the occasion is the grouping, the Food is the
  fact.

## Consequences

- Totals are summed from Foods everywhere. Nothing in the app stores a day's
  calories as a single stored number, which also settles the "who derives the
  percentage" question left open in ADR-0003: the total is derived once server-side
  and both the Dashboard and the Food Screen read that same result, so they cannot
  disagree.
- A Meal Slot being optional means the day grid tolerates a missing occasion.
  Components that assumed all four slots were always present (`MealSlotGrid`)
  no longer fit the model.
- **A Meal exists only while it holds at least one Food.** Removing a Food's last
  sibling removes the Meal, and a Meal whose Foods are all gone is "not eaten" —
  it carries no calories, no Portion, and nothing a User could want to read back.
  An empty Meal is not a record of anything, so it is not kept. This resolves the
  "zero or more" wording above: _zero_ describes a Meal before its first Food is
  logged, never one after its last is removed.
- A Food carries a Portion (quantity plus named serving) rather than only a total.
  A stored total alone could not later be rescaled when a Portion changes, and
  could not absorb a per-100g row from an external food source.

## Saved Food is a separate table, deliberately

`SAVED_FOOD` and `FOOD` carry the same columns and are nonetheless two tables. They
are not two kinds of thing: a Saved Food is a Food that has not been eaten, and
logging one copies its numbers into a new Food row. They differ in _lifecycle_, and
that is worth the duplicated column list:

- **The queries are simple and disjoint.** "What did I eat on this date" and "what
  do I keep" share no rows, so neither needs a filter or a discriminator to get the
  right answer.
- **Inferring saved-ness from a null `meal_id`** would work, but it makes the
  distinction implicit in a nullable column, and a Saved Food gains two nullable
  fields (`meal_id`, and the date it comes from its Meal) rather than gaining
  clarity.
- SQLite has no table inheritance, so "same shape, different lifecycle" is either
  two tables or one table with nullable columns plus a `kind` discriminator. The
  single-table option was chosen against: it trades two clear tables for one that
  every query has to remember to filter, and the column list would still be the
  union of both lifecycles.

If a third source of saved things ever appears — a seeded library, say, or an
external food database — revisit this. Two tables chosen because the set is exactly
two becomes three for a different reason.

## Related

- Correction is by editing in place, with no history — ADR-0005.
- The Calorie Target is dated, so that a User changing their target does not
  silently re-rate every day they have already logged.

## Unresolved

- **No food database yet.** Foods are typed by hand and Saved Foods are the reuse
  mechanism. Whether an external source (OpenFoodFacts) is ever queried, and what
  happens offline if it is, is not decided. The Portion model was chosen partly
  to leave that door open, which is why this ADR does not close it.
- **Water tracking.** Whether water is a Food with zero calories, or its own thing,
  is undecided and out of scope for now.
