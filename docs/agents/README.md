# Agents-written Documentation

LLM-generated documentation for the Health App project.

---

## Overview

| Document                                                       | Purpose                       | Key Content                                             |
| -------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------- |
| [`implementation-plan.md`](./implementation-plan.md)           | System architecture & roadmap | Tech stack, ER diagrams, component hierarchy            |
| [`raspberry-pi-hosting.md`](./raspberry-pi-hosting.md)         | $0 hosting solution           | Cloudflare Tunnel, systemd service, SQLite backup       |
| [`frontend-architecture.md`](./frontend-architecture.md)         | Frontend layout & conventions | Screens, routing, the Screen test seam                 |
| [`design-system.md`](./design-system.md)                       | Design system reference       | Palette tokens, components, file structure              |
| [`color-using-guide.md`](./color-using-guide.md)               | Tailwind color usage          | Which token to use where                               |
| [`context-management.md`](./context-management.md)           | Token & context efficiency    | Chunked reading, output limits, anti-patterns          |
| [`issue-tracker.md`](./issue-tracker.md)                     | Where issues live            | GitHub Issues via `gh`, wayfinding operations          |
| [`triage-labels.md`](./triage-labels.md)                     | Triage label vocabulary       | Mapping of the five canonical roles to label strings   |
| [`domain.md`](./domain.md)                                   | Domain doc consumer rules     | Where `GLOSSARY.md` and ADRs live, how to read them    |
| [`GLOSSARY.md`](./GLOSSARY.md)                               | Domain vocabulary             | User, Cycle, Cycle Phase, Metric, Screen               |

---

## Source of Truth

The **primary documentation** lives in [`../humans/`](../humans/) — read-only for agents:

- [`colors.md`](../humans/design/colors.md) — Color palette & design system
- [`features.md`](../humans/features.md) — Feature requirements
- [`data.md`](../humans/data.md) — Data strategy
- [`free-form-ideas.md`](../humans/free-form-ideas.md) — Conceptual ideas

---

## UI Mockups

Visual wireframes in the [`../../frontend/mockups/`](../../frontend/mockups/) directory:

- [`dashboard.html`](../../frontend/mockups/dashboard.html) — Daily progress overview with workout logging, food tracking, and quest checklist
- [`fitness.html`](../../frontend/mockups/fitness.html) — Fitness routines and workout session logger
- [`food.html`](../../frontend/mockups/food.html) — Meal and macro tracking
- [`squad.html`](../../frontend/mockups/squad.html) — Squad game, quests, and leaderboard
- [`stats.html`](../../frontend/mockups/stats.html) — Cross-metric analytics: weight trend, dual-axis calories-vs-weight correlation, body measurements, macro balance

These mockups define the target UI for implementation.

---

## Actual Project Structure

```
health-app/
├── backend/                ← Go HTTP Server + SQLite API
├── deploy/                 ← Deployment scripts
├── frontend/               ← React PWA (Vite + TypeScript + Tailwind v4)
│   ├── src/
│   │   ├── app/            # Routing, config, router
│   │   ├── components/     # Shared UI, layout, domain, and chart components
│   │   ├── features/       # Feature modules (dashboard, fitness, food, squad, stats)
│   │   ├── lib/            # Utilities
│   │   └── index.css
│   ├── public/             # Static assets
│   ├── mockups/            # Design wireframes (dashboard, fitness, food, squad, stats)
│   ├── index.html          # HTML entry point
│   └── package.json
├── data/                   # SQLite database
└── docs/                   # Documentation
    ├── humans/             # Source of truth (read-only)
    └── agents/             # Agent documentation
```

---

## Quick Links

- [Docs Overview](../README.md)
- [Human Documentation](../humans/)
- [Implementation Plan](./implementation-plan.md)
- [Host on Raspberry Pi](./raspberry-pi-hosting.md)
- [Frontend Source Code](../../frontend/src/)
- [UI Mockups](../../frontend/mockups/)
