# Clanker Documentation

LLM-generated documentation for the Health App project.

---

## Overview

| Document                                                       | Purpose                       | Key Content                                             |
| -------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------- |
| [`implementation-plan.md`](./implementation-plan.md)           | System architecture & roadmap | Tech stack, ER diagrams, component hierarchy            |
| [`raspberry-pi-hosting.md`](./raspberry-pi-hosting.md)         | $0 hosting solution           | Cloudflare Tunnel, systemd service, SQLite backup       |

---

## Source of Truth

The **primary documentation** lives in [`../humans/`](../humans/) — read-only for agents:

- [`colors.md`](../humans/design/colors.md) — Color palette & design system
- [`features.md`](../humans/features.md) — Feature requirements
- [`data.md`](../humans/data.md) — Data strategy
- [`free-form-ideas.md`](../humans/free-form-ideas.md) — Conceptual ideas

---

## UI Mockups

Visual wireframes in the [`../mockups/`](../mockups/) directory:

- [`dashboard.html`](../mockup/dashboard.html) — Daily progress overview with workout logging, food tracking, and quest checklist
- [`fitness.html`](../mockup/fitness.html) — Fitness routines and workout session logger

These mockups define the target UI for implementation.

---

## Actual Project Structure

```
health-app/
├── src/                    ← React source code (Vite + TypeScript)
│   └── assets/            ← Images, SVGs
├── data/                  ← SQLite database
├── docs/                  ← Documentation
│   ├── humans/            ← Source of truth (read-only)
│   └── clankers/          ← Agent documentation
├── public/                ← Static assets
├── index.html             ← HTML entry point
├── mockups/               ← Design mockups
```

---

## Quick Links

- [Project README](../README.md)
- [Human Documentation](../humans/)
- [Implementation Plan](./implementation-plan.md)
- [Host on Raspberry Pi](./raspberry-pi-hosting.md)
- [Source Code](../src/)
- [UI Mockups](../mockups/)
