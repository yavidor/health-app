# Health

A personal health tracker for a small, self-hosted group: workouts, food, body
measurements, and mood — kept together so they can be read
against each other.

## Language

### Identity

**User**:
A person whose health data the app holds. Every measurement, workout, meal, cycle
record, and mood entry belongs to exactly one User.
_Avoid_: Profile, Member, Account

### Mood

**Mood Entry**:
A User's record of their mood on one day: a 1–5 score plus any number of Mood Tags.
At most one Mood Entry exists per User per date.
_Avoid_: Mood log, Mood record, Journal entry

**Mood Score**:
The 1–5 rating within a Mood Entry, where higher means better.
_Avoid_: Mood rating, Mood level

**Mood Tag**:
A label attached to a Mood Entry, from a seed set shipped with the app plus any
Mood Tags the User has added themselves.
_Avoid_: Mood labels, Feelings, Symptoms

### Measurements

**Measurement**:
A dated body reading belonging to a User — weight, waist, body fat percentage.
_Avoid_: BodyMetric, Stats

**Metric**:
A single measurable quantity that can be read on a date, such as weight, calories,
or Mood Score. The unit of cross-data comparison.
_Avoid_: Measure, Stat, Data point

### Food

**Meal**:
One eating occasion on one date — breakfast, lunch, dinner, a snack. A Meal holds
zero or more Foods, and its totals are derived from them rather than entered.
_Avoid_: Entry, Log, Dish

**Food**:
A single thing a User ate, belonging to exactly one Meal, carrying its own
calories, macros, and Portion. A Food is logged once and does not recur on its own.
_Avoid_: Item, Entry, Record, Dish (implies a recipe)

**Saved Food**:
A named Food a User has deliberately kept to log again — "usual protein shake" —
holding its calories, macros, and Portion so that logging it costs one tap. A Saved
Food is never eaten and never dated; logging one copies its numbers into a new Food.
Saving is opt-in and off by default, so a Saved Food is not simply every Food ever
logged.
_Avoid_: Item, Template, Preset, Favourite, Recipe, Quick Add

**Portion**:
How much of a Food was eaten, as a quantity and a named serving. A whole portion
is a quantity of one.
_Avoid_: Serving, Amount, Size

**Meal Slot**:
Which occasion a Meal belongs to: breakfast, lunch, dinner, or snacks. Optional
in the model — the User never has to choose one — but set as a side effect of
where they chose to log from.
_Avoid_: Category, Type, Meal type

**Calorie Target**:
A dated daily calorie count a User aims at. Setting one starts a new Target from
that date onward; days already logged keep the Target that was in force, so
history never re-rates itself. Every User has one; a new User starts on the app's
default.
_Avoid_: Goal, Budget, TDEE (a formula's output, not the User's choice)

### App

**Screen**:
One destination in the app — Food, Stats, Squad, Dashboard, Fitness. A Screen owns
everything a User sees on arriving there, including its header and its loading,
error, and empty states. A Screen is the only place its own data is fetched and
shaped for display; nothing else prepares what it renders.
_Avoid_: Page, View, Route, Tab
