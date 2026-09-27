# AGENTS.md

## Source of Truth

- **Human documentation**: `docs/humans/` — source of truth for design, features, data strategy
- **LLM documentation**: `docs/clankers/` — architectural plans, hosting guides, tooling practices
- **Design system**: `docs/humans/design/colors.md` — strict palette for UI elements and text
- **Architecture**: `docs/clankers/implementation-plan.md` — complete tech stack and implementation roadmap
- **RULE**: LLMs must NOT write/edit in `docs/humans/` — all documentation updates must go to `docs/clankers/`, `docs/humans/` is to be written only by humans (but read by agents as well)

## Key Facts

- **Local-first PWA** — Progressive Web App with offline support
- **Tech stack**: Vite + React + TypeScript + Tailwind CSS + IndexedDB + Recharts + Lucide React
- **Data**: SQLite-backed local storage, JSON export/import for backups
- **Features**: workout planner, meal/macro tracker, cross-metric analytics, squad game with points
- **Deployment target**: Raspberry Pi hosted via Cloudflare Tunnel (full HTTPS, no port forwarding)

## Project Structure

```
health-app/
├── docs/
│   ├── humans/      ← source of truth (design, features, data)
│   └── clankers/    ← LLM documentation (implementation plan, hosting)
├── app/             ← React SPA components
└── data/            ← SQLite database
```

## Important Notes

- Project scaffolded with Vite + React + TypeScript
- oxlint configured for linting, prettier configured for formatting
- oxlint and prettier passing on source files
- Follow color palette strictly: bright tones for UI elements, dark tones for text
- PWA manifest and service worker needed for home-screen installability
