# AGENTS.md

> [NOTE]
> Read `llm-conduct` before making any interactions or tool calls

## Source of Truth & Agent Behavior

### HUMAN DOCUMENTATION — `docs/humans/` (READ-ONLY for agents)
- Source of truth for **design, features, data strategy, requirements**
- Written by humans, NEVER edited by agents
- Agents MUST refer to this for decisions about:
  - Feature requirements and user stories
  - Color palette and visual design
  - Data model and storage strategy
  - Core product decisions

| File | Purpose |
|------|---------|
| `features.md` | Feature requirements (Fitness, Food, Stats) |
| `data.md` | Data strategy and goals |
| `design/colors.md` | Strict color palette |
| `free-form-ideas.md` | Conceptual ideas (squad game) |

---

### AGENT/LLM DOCUMENTATION — `docs/clankers/` (WRITE-ONLY for agents)
- For **architectural decisions, implementation details, hosting guides**
- Agents should write ALL their documentation here
- Never write implementation details to `docs/humans/` even as notes

| File | Purpose |
|------|------|
| `implementation-plan.md` | Tech stack and implementation roadmap |
| `raspberry-pi-hosting.md` | $0 hosting with Cloudflare Tunnel |
| `color-using-guide.md` | Design system and Tailwind configuration |
| `llm-conduct.md` | Tool using and other rules|

---

### PRIORITY HIERARCHY

When resolving conflicts or making decisions:

1. **Human documentation wins** — Always prefer what's written in `docs/humans/`
2. **Human docs are source of truth** — If human docs say X, agents should implement X
3. **Clanker docs are agent work** — If agents disagree with human docs, they should update their own documentation in `docs/clankers/`, NOT the human docs

> **RULE**: Agents must NEVER write/edit in `docs/humans/`. All documentation updates must go to `docs/clankers/`. `docs/humans/` is to be written only by humans (but read by agents as well).

## Key Facts

- **Local-first PWA** — Progressive Web App with offline support
- **Current state**: Project scaffolded with Vite + React + TypeScript, **no health app features implemented yet**
- **Planned tech stack**: Tailwind CSS + IndexedDB + Recharts + Lucide React
- **Data**: SQLite-backed local storage, JSON export/import for backups
- **Features**: workout planner, meal/macro tracker, cross-metric analytics, squad game with points
- **Deployment target**: Raspberry Pi hosted via Cloudflare Tunnel (full HTTPS, no port forwarding)

## Project Structure

```
health-app/
├── docs/
│   ├── humans/      ← source of truth (design, features, data)
│   │   ├── design/
│   └── clankers/    ← LLM documentation (implementation plan, hosting)
├── mockups/         ← UI wireframes (visual targets)
├── app/             ← React SPA components (initially Vite template)
    └── assets/
```

## Important Notes

- Project scaffolded with Vite + React + TypeScript
- oxlint configured for linting, prettier configured for formatting
- oxlint and prettier passing on source files
- Follow color palette strictly: bright tones for UI elements, dark tones for text
- Tailwind CSS **needs to be installed and configured**
- PWA manifest and service worker **need to be created**
- **No features implemented yet** — this is a fresh project ready for development
- Read `llm-conduct` before making any interactions or tool calls

---
