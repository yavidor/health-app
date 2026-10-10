# A logged Food is corrected in place

Logging a Food writes one row, and correcting one edits that row: the User changes
the calories from 600 to 400 and the log now reads 400. There is no correction
history, no version, and no append-only audit trail.

## Considered Options

- **Edit in place.** Chosen.
- **Delete and re-log.** Cheaper to build, but a correction is a normal thing to do
  and punishing it teaches people to log less.
- **Edit with history retained.** Answers "what did I say at the time?" — a
  question worth asking in a medical or clinical record, and close to worthless in a
  self-hosted personal tracker of numbers the User typed themselves. It costs an
  audit trail on every field of every row.

## Consequences

- A Meal, a Meal Slot, and a Calorie Target are all freely editable after the fact.
  Nothing in the food model is immutable, and no Screen should present an edit as
  if it were a correction-of-record.
- Because a Saved Food is a copy-on-log, editing a logged Food never writes back to
  the Saved Food it came from. The template stays as the User last curated it, so
  fixing a typo in today's breakfast does not rewrite every future breakfast.
- This is the one place where the app deliberately does _not_ model provenance.
  If a User later wants to answer "did I know this when I logged it?", that is the
  moment to revisit it — and the absence should be recorded here so the omission
  reads as chosen rather than forgotten.
