# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the "Label in our tracker" column to match whatever vocabulary you actually use.

## Issue label vocabulary

Triage says **what state an issue is in**. These three groups say **what the work is**. They are
independent: every issue has exactly one triage role and may carry any number of the below.

### Component — which part of the codebase

| Label     | Meaning                                      |
| --------- | -------------------------------------------- |
| `backend` | Go backend                                  |
| `frontend`| React/TS frontend                            |
| `infra`   | Deploy, CI, tooling                          |

### Area — which concern

| Label  | Meaning                                     |
| ------ | ------------------------------------------- |
| `data` | Schema, migrations, persistence             |
| `api`  | HTTP/API surface                            |
| `ui`   | Screens, components, visual design          |

An issue touching only the API's aggregation logic is `backend` + `api`. An issue that needs a
new table, a migration, and a screen is `backend`, `frontend`, and `data`.

### Effort — rough size

| Label | Meaning    |
| ----- | ---------- |
| `xs`  | Hours      |
| `s`   | Half a day |
| `m`   | 1–2 days   |
| `l`   | Multi-day  |

Effort is a guess at agent session count, not a commitment. Prefer under-estimating: an `m`
that turns out to be `l` is cheap to re-label, a ticket that was really `l` and was labelled
`s` gets picked up AFK and abandoned.
