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

### App

**Screen**:
One destination in the app — Food, Stats, Squad, Dashboard, Fitness. A Screen owns
everything a User sees on arriving there, including its header and its loading,
error, and empty states. A Screen is the only place its own data is fetched and
shaped for display; nothing else prepares what it renders.
_Avoid_: Page, View, Route, Tab
