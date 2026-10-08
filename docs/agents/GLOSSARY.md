# Health

A personal health tracker for a small, self-hosted group: workouts, food, body
measurements, menstrual cycle, and mood — kept together so they can be read
against each other.

## Language

### Identity

**User**:
A person whose health data the app holds. Every measurement, workout, meal, cycle
record, and mood entry belongs to exactly one User.
_Avoid_: Profile, Member, Account

**Cycle Settings**:
A User's configured cycle shape — default cycle length, bleed length, and phase
boundaries — used to interpret that User's period starts.
_Avoid_: Cycle preferences, Cycle config, Preferences

### Cycle

**Period Start**:
A single day on which bleeding began, recorded by the User. The first Period Start
in a cycle is that cycle's Day One.
_Avoid_: Period, Cycle start, Period day

**Cycle**:
The span of days running from one Period Start to the day before the next Period
Start.
_Avoid_: Period, Month

**Cycle Length**:
The number of days in a Cycle. Varies between cycles for the same User, and is
derived from consecutive Period Starts rather than assumed.
_Avoid_: Period length, Cycle duration

**Cycle Day**:
The 1-based position of a date within its Cycle, counted from that Cycle's first
Period Start. Day One is always a Period Start day.
_Avoid_: Cycle position, Day of cycle

**Bleed Length**:
The number of consecutive days of bleeding in a Cycle, from its Period Start until
bleeding stops.
_Avoid_: Period length, Flow duration

**Cycle Phase**:
The named stage a date falls into within a Cycle — one of menstrual, follicular,
ovulation, luteal. A Cycle Phase is an **estimate** derived from Period Start and
Cycle Settings, unless the User has overridden it.
_Avoid_: Cycle stage, Phase, Cycle phase (capitalised)
Note: menstrual and follicular **overlap**; both begin on Day One. A date can be in
both, so phases are not mutually exclusive buckets.

**Phase Override**:
A Cycle Phase the User set by hand for a specific date, which replaces the derived
value for that date only. Absence of a Phase Override means "derive it", not
"unknown".
_Avoid_: Manual phase, Phase correction

**Derived Phase**:
The Cycle Phase computed from Period Start and Cycle Settings when no Phase Override
exists for that date.
_Avoid_: Calculated phase, Inferred phase

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
