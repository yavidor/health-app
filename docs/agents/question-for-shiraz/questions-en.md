# Questions for Shiraz — cycle and mood tracking

This document replaces all previous drafts. It contains only product, domain, design, and UI
questions — no code. Each question can be answered "keep" or "change:" with the new decision.
If there is no answer, the current decision stays.

---

## Product scope

**1. Does mood tracking stay in the product?**

Mood tracking does not appear in the existing product documents. Keep it as a committed part,
or drop it?

**2. Mood entry structure**

Current decision: a 1–5 score plus tags, with no limit on the number of tags. There is one
entry per date, and a second entry replaces the first.

Keep? Add a free-text note? Allow several entries per day, or an average of morning and evening?

**3. Tags: seed list and similar words**

Current decision: 12 suggested tags, and the user can add their own:

`calm`, `irritable`, `energetic`, `tired`, `anxious`, `focused`, `sad`, `low`,
`motivated`, `sensitive`, `confident`, `stressed`

Approve the list, delete, add, or replace words? And what should happen with similar words —
are they one tag or two? Does renaming or deleting a tag also apply to old entries?

**4. Pregnancy**

Undecided. Track it, or explicitly keep it out of scope?

**5. Symptoms**

For example flow intensity, cramps, or bleeding between periods. Include? Or leave out?

**6. Ovulation day**

Current decision: no ovulation day is collected, and the phase is an estimate only. Add
ovulation logging now, or defer it?

**7. Hormonal medication**

Ask the user once? Where — at setup or in cycle settings? If the answer is yes, should the
phase be labelled as a less reliable estimate?

**8. Reminders**

No reminders? A daily mood reminder? A period-start reminder? How often?

**9. Language**

English only, or Hebrew as well? Phase names, weekdays, and labels appear in daily use.

**10. Backup, export, and retention**

Should cycle and mood be included in export and backup? Keep them forever, or delete after
some time?

**11. Working offline**

If there is no network, can the user log and sync later, or is use online-only?

**12. Privacy, friends, and scale**

Do cycle and mood data always stay private? May they ever appear on a social or competitive
surface? How many people are expected to join, and does that change the urgency of login?

**13. What the app may say**

Only show information? Also suggest action? Also warn? And what must it never say?

---

## Domain and meaning

**14. Phases, overlap, and uncertainty**

Current decision: four phases — menstrual, follicular, ovulation, luteal. Boundaries are
configurable. Day 1 belongs to two phases.

Should an overlapping date be shown in both phases or in one? How should the estimate be
marked? Approve the names and the default ranges? Who sets the final numbers?

**15. Manual change versus calculation**

Current decision: period starts decide. A manual change applies to one date. Correcting an
old start recalculates later dates, but does not delete a manual change. Deleting a manual
change returns the calculation. There is no "unknown" state.

Keep? Add "unknown"? What happens to a manual change after its source is corrected?

**16. Cycle length and forecast**

Current decision: each cycle is measured from its own two starts, not from an overall
average. The current cycle is shown as "ongoing", with no end forecast.

Keep? Add an estimated forecast? Switch to a historical average?

**17. Date edge cases**

Two close starts: mistake, correction, or a new cycle? And what does the user see before the
first start?

---

## Comparison and charts

**18. Fixed views or free comparison**

Current decision: three fixed views:

1. Mood by cycle phase
2. Calories by cycle phase
3. Calories vs. weight, as it is today

Keep three? Drop one? Open an option for the user to build their own comparison?

**19. Numbers without exaggeration**

Current decision: average by phase and tag frequency, including the number of days behind
each number. No correlation coefficient.

Tag frequency: by days or by entries? Keep the ban on the correlation coefficient?

**20. Thin or empty phase**

Current decision: an empty phase is shown as "no data", not as zero, and the day count is
visible.

Below how many days should an average be hidden or warned about?

---

## Interface

**21. Page name and structure**

What is the page called? Tabs, sections, or one scroll? Keep cycle and mood together, or
split them?

**22. Calendar**

Month grid or timeline? How is a day in two phases marked?

**23. The charts themselves**

Grouped bars? Which order? Does the day count appear in the title? What is shown for an
empty phase? And while working there: fix the axis title, the correlation insight, and its
placement?

**24. Mood input**

What do 1 and 5 mean? A control with labels, drawn faces, or a slider?

**25. Tag picker**

Multi-select, chips, or inline adding? Twelve tags at once is a lot — should they be grouped?

---

## If there is time for only five

1. **Question 14** — one phase or two on an overlapping day.
2. **Question 18** — fixed views or free comparison.
3. **Question 15** — manual versus calculated after a correction.
4. **Question 12** — privacy from other users.
5. **Question 21** — page name and structure.
