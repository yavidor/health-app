# Questions for Shiraz — cycle and mood tracking

Every question asked during the `/grill-with-docs` session that produced the cycle and mood
plan, with the answer given. Then the questions that were raised and **not** answered, which
are still open.

Three things worth knowing before reading:

- **Some answers were provisional.** Cycle phase modelling was answered twice and changed
  between answers. Where that happened, both answers are recorded with what superseded them.
- **Some questions I could not ask well.** One was badly worded and got a "I'm confused by
  your question" — it is reproduced here as originally asked, plus a cleaner rewrite.
- **The open list is not complete.** It contains what came up in the session. Reading the
  plan will likely raise more.

Glossary terms (Cycle Day, Cycle Phase, Period Start, Mood Entry, Mood Tag, Phase Override)
are used in their defined senses from the project glossary.

---

## Part 1 — Questions asked and answered

### 1. Which feature are we planning?

Offered: (a) backend for the existing UI, (b) cycle tracking, (c) the Squad game,
(d) something else.

**Answer: cycle and mood tracking.**

Worth noting: **mood tracking appears in none of the project's human-facing docs.** It came
up only in this conversation. If mood should be a committed feature, it is currently
unwritten in the feature docs.

---

### 2. Is this app single-user, or does it need real accounts?

**Answer: this is a multi-user platform.**

This turned out to be a much larger statement than it first appeared. The `USER` entity in
the existing data model has no fields at all, and **no existing table has a `user_id`**. So
"multi-user" means adding an ownership column to every table plus per-user uniqueness rules,
not just enabling a login screen.

---

### 3. What does multi-user require as the very first slice?

Offered: (a) real auth now (invite code, accounts, session tokens), (b) multi-user *schema*
now with single-user *runtime*, (c) single-user schema and retrofit later.

**Answer: (b)** — multi-user schema now, single-user runtime. `user_id` on every table from
the first migration, no login screen yet, auth as its own later ticket.

Recorded as ADR-0001.

---

### 4. What is a "mood" entry?

Offered: (a) a single 1–5 scale per day, (b) scale plus free-text note, (c) a set of tags,
(d) scale plus tags.

**Answer: (d)** — a 1–5 scale plus any number of tags.

---

### 5. How is the cycle itself represented?

Offered: (a) period starts plus a configured cycle length, deriving everything else;
(b) an explicit phase stored per day; (c) period starts as truth with a per-day override.

**Answer: (b)** — explicit phase per day. **Added: "but it will probably change later."**

This answer and the caveat were in tension, which was raised at the time. Storing phase per
day means storing derived state, which is a known way for a chart to silently disagree with
itself after an input correction.

---

### 6. Does the plan include the database and API layer?

**Answer: "We are just planning for now, so yeah I want to plan anything."**

Read as: plan the whole slice end to end, rather than only the schema.

---

### 7. Phase storage, revisited after question 5's caveat

Offered: (a) authoritative per-day phase value, (b) nullable — absent means "derive it", a
value means the user overrode it.

**Answer: (c)** in the labels as originally offered in question 5, which is the nullable
derived-or-overridden option. Confirmed as such when the answer was read back.

Recorded as ADR-0002.

Net effect: questions 5 and 7 together mean **period starts are the source of truth, phase is
derived on read, and an override is a local exception rather than a cached derivation.**

---

### 8. What does the plan actually include?

Offered: (a) migrations + endpoints + the new UI, (b) backend only, (c) backend plus a
correlation view but no dedicated pages.

**Answer: (a)** — full slice including UI.

---

### 9. Mood tags: fixed vocabulary or free-form?

Offered: (a) fixed set in code, (b) free-text each time, (c) fixed set plus user-added.

**Answer: (c)** — fixed plus user-added.

Rationale given: free-text alone makes tags uncountable later, because "calm", "Calm" and
"relaxed" would fragment any later comparison.

---

### 10. Which correlations ship?

Offered: (a) per-phase averages of mood and calories, (b) a full mood-vs-cycle-day
correlation chart, (c) storage only, no analysis.

**Answer: not (a) or (b) as framed.** The reply was that food-by-phase is only an example,
and that the user should be able to **see and cross data** generally.

This redirected the whole question, and produced question 11.

---

### 11. What does "cross data" mean concretely?

Offered: (a) a general metric-pairing view where the user picks any two metrics,
(b) a fixed set of pre-built comparison views the app decides, (c) (a) as the foundation with
(b) as named presets.

**Answer: (b)** — fixed pre-built comparison views.

This was the largest scope reduction of the session. It means no metric registry, no
client-side data alignment, and no dual-axis charting work.

---

### 12. Is fixing the missing date handling in scope?

Offered: (a) real ISO dates across existing metrics, (b) work around the display strings,
(c) only new cycle and mood data uses real dates.

This was the question answered with **"I'm not sure I understand the question."** Re-explained
concretely with the actual three date shapes in the app, then re-asked.

**Answer: (a)** — real ISO dates across everything, not only new data.

The reason this was non-negotiable: weekly calories currently encodes weekdays as single
letters where `"T"` appears twice, ambiguous between Tuesday and Thursday. Joining metrics on
those strings would produce charts that look correct and are wrong.

---

### 13. Phase boundaries: configured or hardcoded?

Offered: (a) fixed offsets as constants, (b) user-configurable boundaries, (c) derive from a
logged ovulation day, falling back to offsets.

**Answer: (b)** — configurable.

---

### 14. Who owns the mood tag seed list?

Offered: (a) I draft a seed set and Shiraz edits it, (b) Shiraz supplies it, (c) ship empty.

**Answer: (a)** — I draft it.

**Drafted, awaiting review and edits:** `calm`, `irritable`, `energetic`, `tired`, `anxious`,
`focused`, `sad`, `low`, `motivated`, `sensitive`, `confident`, `stressed`. Twelve tags,
intended to spread across valence, energy, and control so a comparison has something to find.

---

### 15. Which pre-built comparison views ship?

Offered: (a) mood by cycle phase only, (b) mood by phase plus keeping the existing
calories-vs-weight view, (c) three views including calories-by-phase and weight-vs-calories.

First answer: **"I want a bit more"** than (b). Then, on the named set: **(c)** — scoped to
exactly three views:

1. Mood by Cycle Phase (new)
2. Calories by Cycle Phase (new, the original feature-docs promise)
3. Calories vs. Weight (existing, **not** rebuilt)

---

### 16. One feature or two?

**Answer: split**, with cycle-phase logic first, and starting points written for both. Mood
cannot be meaningfully validated against cycle phase before phase logic exists.

---

### 17. Two questions, asked badly

**17a** was simply "here is a draft list of 12 mood tags, edit it if you want." It needed no
decision, only edits.

**17b** was: **should the app ask users whether they take hormonal contraception or
medication?** Because hormonal medication disrupts the cycle-phase model itself, and research
cohort definitions exclude such users. A real period tracker asks this upfront.

**17b is still unanswered.** It is recorded as an open question in the plan and is
ticket #14's responsibility. The column is in the schema; the answer is not.

---

### 18. Documentation for the decisions made

Asked whether to write the glossary and two ADRs, given that the derived-phase decision
exists specifically because phase modelling was expected to change.

**Answer: proceed** (session moved to build mode).

Written: the project glossary, ADR-0001 on multi-user schema with single-user runtime, and
ADR-0002 on phase being derived with an override.

---

### 19. Where does cycle and mood live in the UI?

Offered: (a) a new Cycle route alongside Dashboard, Fitness, Food, Stats, Squad, with its own
logging and calendar, plus a correlation section on Stats, (b) folded into Stats with no new
route, (c) a new Cycle route for logging and viewing, with the correlation views on Stats.

**Answer: (a)** — a new Cycle route with its own logging UI and calendar, plus correlation
views on Stats.

---

### 20. Ticket granularity

Asked whether to merge two of the proposed tickets and whether to push one through unchanged.

**Answer:** merge the two date-refactor tickets; keep the calendar and settings ticket as
proposed.

---

## Part 2 — Still open

### Health and domain questions

**O1. Should the app ask about hormonal contraception?** (question 17b, never answered.)

The one gap that changes stored data. Recommended: one yes/no question at setup, stored, and
where the answer is yes, label Cycle Phase as an estimate. Deciding before the migration lands
is cheaper than adding the column later.

**O2. When a date falls in overlapping phases, does it report one phase or several?**

Menstrual and follicular both begin on Day One, so early-cycle days are genuinely in both. A
single-value model mislabels the days people most care about. Flagged during planning as an
explicit decision that must be made and recorded; not yet made.

**O3. How should cycle-length uncertainty be shown to a user?**

Fixed offsets from Day One are the standard method but are a wide approximation: a
612,613-cycle cohort found mean follicular 16.9 days (range 10–30) and luteal 12.4 (range
7–17), and cycle length alone does not predict ovulation timing. The plan says phase must be
presented as an estimate. **What that looks like on screen was never decided** — a footnote, a
badge, an icon, or nothing.

**O4. Do we ask about pregnancy, or handle it at all?** Never raised. Out of scope as recorded,
but never confirmed as something to actively exclude.

**O5. Symptoms.** Period tracking in the wild commonly records flow intensity, cramps,
spotting between periods. Nothing in the current design captures any of it, and it was never
discussed. Mood tags are not a substitute and were not proposed as one.

**O6. Cycle Settings defaults — bleed length in particular.** The plan states defaults follow
the consensus (bleeding 3–7 days, cycle length 21–38 days) but the specific cut points for the
four phases were never fixed. This needs actual numbers before migration 1.

---

### Behaviour questions

**O7. Can a user log mood more than once per day?** The plan says at most one entry per user per
date, and a second entry updates the first. Never explicitly confirmed. If someone logs mood at
breakfast and again at bedtime, an average of the two might be better than an overwrite.

**O8. Is there a free-text note on a mood entry?** Scale plus tags was chosen; a note was
offered in an early option and not selected. Never revisited. This matters for the value of a
tag-only mood log over time.

**O9. What does mood scale 1 and 5 actually mean?** The glossary assumes higher is better and
the scale runs 1 (worst) to 5 (best). The anchors have never been written. A 1–5 scale with no
anchors is not comparable between people, and possibly not between days.

**O10. What happens when a phase has too few days to be meaningful?** The plan requires day
counts to be visible so thin phases read as thin. **The actual threshold was never decided** —
at what point does a phase get a warning, or get hidden?

**O11. What happens if two Period Starts are logged close together?** Logged a second time by
mistake, corrected, or genuinely a new period. The plan requires corrections to re-derive
downstream, but the disambiguation behaviour was never specified.

**O12. What happens for dates before the first Period Start?** The plan says "no cycle" is a
real state, not an error. What the person sees on those days was never decided.

---

### UI questions

**O13. What is the new page actually called?** "Cycle area" is a placeholder. The route name,
the navigation label, the page title, and the icon are all undecided. Note the page will also
carry mood logging.

**O14. How is cycle and mood organised on that one page?** It was decided to be one page
(answer 19a), but not whether they are tabs, stacked sections, or a single scroll. Mood logging
has a daily cadence; the cycle calendar is browsed. Those are different interactions.

**O15. What does the cycle calendar look like?** Explicitly listed as a ticket deliverable and
explicitly never designed. Month grid? Horizontal timeline with phase bands? How are overlapping
phases on one day shown — one colour, two?

**O16. What do the correlation charts look like exactly?** Grouped bars per phase was the plan.
Not designed: axis labels, whether day counts appear as a subtitle, bar ordering, what an empty
phase renders as, or whether two metrics ever share a chart.

**O17. What are the scale and anchors on the mood input?** A 1–5 control with visible labels, a
row of faces, or a slider? Emojis are banned by the project's lint rules, so faces would need
to be drawn rather than typed.

**O18. What does the mood tag picker look like?** Multi-select from twelve plus user tags, or
chips with an inline add? Twelve tags is a lot to show at once.

**O19. Where does the hormonal-medication question appear if we adopt it?** Once at setup, or
in Cycle Settings? Setup is a flow that does not exist yet.

**O20. Are the existing three defects fixed in view of the new screens?**
- The Stats page subtitle claims a left and right axis while only one is drawn.
- The correlation insight always says "Strong negative correlation" regardless of the data.
- The correlation insight renders inside the chart's fixed height.
These are in the plan as ticket #8. **No view has been taken on whether the current charts get
redesigned while they are being touched.**

**O21. How is the absence of data shown across these views generally?** "No data" versus zero is
called out repeatedly in the plan but the visual treatment was never decided.

---

### Product questions

**O22. Is cycle and mood data private from other users?**

This was never asked, and it is the largest untouched question. It is a shared app on a
shared Raspberry Pi. Mood and cycle data are among the most sensitive things a person records.
The plan says every table is scoped by `user_id`, which means the *mechanism* isolates it — but
it does not say whether cycle and mood data should ever appear in a shared or social surface.

**O23. Should the Squad feature ever see mood or cycle data?** The Squad page exists with a
leaderboard and shared goals. Whether cycle or mood data may ever flow into a social or
competitive surface is unasked and unimplied. Worth deciding before rather than after.

**O24. Are there reminders to log?** Period starts and mood are daily-ish. Whether the app
nudges, and how often, was never discussed.

**O25. Should cycle and mood data be included in JSON export and backup?** The existing stats
page has export and backup buttons. Both are recorded as out of scope, which means a user's
cycle history would be missing from their own backup. That may not be intended.

**O26. Is the language English only?** Worth raising plainly: the human-facing docs are
English, but if the users are not, cycle tracking is a daily-use surface where labels,
weekday names, and phase names all surface constantly.

**O27. Is data retention a concern?** Mood and cycle data accumulate indefinitely and are among
the most sensitive records the app holds.

**O28. Is the app's audience only the user, or will friends really join?** Multi-user was
confirmed, but no target user count exists anywhere. This shapes how much auth work is worth
doing and whether "single-user runtime" stays acceptable for long.

**O29. Does the PWA need to work offline for logging?** Currently recorded as out of scope,
online-first by existing design. For a daily log, being unable to record when the network is
down is a real friction point.

---

## What would unblock the most

In rough order:

1. **O22 and O23** — privacy between users, and whether cycle or mood may ever surface
   socially. These are cheap to decide now and expensive to reverse once Squad touches them.
2. **O2** — one phase or several. It is a schema and API shape decision, and it gates the
   migration.
3. **O1** — the hormonal medication question, also a schema column.
4. **O6** — actual phase boundary numbers, needed before migration 1.
5. **O13, O14** — the page's name and structure, which everything else on that page hangs off.