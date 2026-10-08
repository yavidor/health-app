# AGENTS.md

## Source of Truth & Documentation Boundaries

- **`docs/humans/` (READ-ONLY)**: Human-written requirements, design, and data strategy. Never edit files here. Always treat them as the ultimate source of truth.
- **`docs/agents/` (Agent Docs)**: Architecture decisions, implementation plans, and technical guides. All agent-created documentation belongs here.
- **Priority**: Human documentation always overrides agent documentation.

## Working Principles

- **Minimal Global Context**: Do not maintain directory trees, package scripts, or transient project status here, they rot quickly and waste tokens. Rely on just-in-time exploration of `package.json`, `go.mod`, and the filesystem.
- **On-Demand Context**: Read targeted documentation in `docs/humans/` or `docs/agents/` only when relevant to the current task.
- **Context Efficiency**: Keep tool calls surgical and protect context space. For detailed execution protocols, refer to `docs/agents/context-management.md`.
- **Language-aware tools over text edits**: To change the shape of existing code, reach for a tool that parses the language — ESLint's `--fix`, the TypeScript compiler API (already a devDependency), or `ast-grep` (`npm i -D @ast-grep/cli`). Regex, `sed`, and inline `python -c` rewrites of source files break on nested braces and the breakage is silent until something much later fails.
- **Scripts are reusable or absent**: when a script is genuinely warranted, put it in `scripts/` with a name saying what it does, and delete it once its one job is done. An inline throwaway script is the failure mode this replaces — see `scripts/README.md`.

## Agent skills

- **Issue tracker**: GitHub Issues via `gh` — see `docs/agents/issue-tracker.md`
- **Triage labels**: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix` — see `docs/agents/triage-labels.md`
- **Domain docs**: single-context (`docs/agents/GLOSSARY.md` + `docs/adr/`) — see `docs/agents/domain.md`
- **Frontend shape**: when adding a Screen, moving a module between folders, or changing test conventions, read `docs/agents/frontend-architecture.md` first, and update it in the same change — it goes stale silently otherwise
