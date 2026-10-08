# Context Management Guide

Guidelines for agents to minimize token consumption and protect context space.

---

## Core Principle: Minimize Big File I/O

Tool calls consume significant tokens. Avoid them when simple reads/writes suffice:

### Anti-Patterns
- Running `ls` or `cat` via bash when filenames or paths are already known
- Using grep when a file has already been read into context
- Making multiple redundant tool calls for a single logical operation

---

## File Reading Protocol

**Avoid reading entire large files blindly.** Use chunked reading:

| Do | Don't |
|---|---|
| Read targeted line chunks (e.g. up to 250 lines) | Read entire large files at once |
| Use `start_line` and `end_line` | Start from line 1 repeatedly |
| Use search/grep first to locate relevant sections | Read full file then search visually |

---

## Terminal & Bash Protocol

**Avoid dumping raw, verbose output.** Verbose commands consume context budget rapidly:

| Don't | Do |
|---|---|
| `npm install` (unbounded output) | `npm install > output.log 2>&1` |
| `tree` (full directory dump) | `tree -L 2 \| head -n 20` |
| `command` (unbounded logs) | `command \| head -n 50` |

If verbose commands must be run:
1. Pipe to `head` or `tail` to truncate output.
2. Redirect output to a log file, then read specific chunks as needed.

---

## Behavioral Protocol

1. **Concise execution** — Eliminate conversational filler and perform actions directly.
2. **Targeted edits** — Use surgical search/replace or patch tools rather than re-writing entire files.
3. **Preserve context** — Avoid pasting large code blocks into responses when file links suffice.

---

## Quick Reference: Token-Heavy Patterns to Avoid

| Pattern | Why It's Inefficient | Better Approach |
|---|---|---|
| `grep -r "pattern"` then read each match fully | High token churn | Targeted search, inspect matching lines first |
| Copying large diffs in messages | Wastes context | Edit directly with file editing tools |
| Chaining `cd dir && command` | Verbose output | Use working directory parameter directly |
