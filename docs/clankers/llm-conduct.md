# Context Management Guide

Agents must protect context space. The system has a **STRICT 16,384 token limit** (~50,000 characters). Exceeding it crashes the session.

---

## Core Principle: Minimize Tool Calls

Tool calls consume significant tokens. Avoid them when simple reads/writes suffice:

### ❌ BAD — Using tools for trivial operations:
- Running `ls` or `cat` via bash when you already know filenames
- Using grep when you've already read the file
- Making multiple tool calls for one logical step

### ✅ GOOD — Direct text responses:
- Answer questions with 1-3 sentences
- Return single words or short phrases
- Explain reasoning internally, not in tool calls

---

## File Reading Protocol

**NEVER read whole files blindly.** Always use chunked reading:

| Do | Don't |
|---|---|
| Read max 250 lines per chunk | Read entire large files at once |
| Use `start_line` and `end_line` | Start from line 1 repeatedly |
| Use Grep first for search terms | Read file then search it |

**Example:**
```bash
# BAD — reads everything
read file.txt

# GOOD — read specific section
read file.txt with start_line=50, end_line=300

# Better — search first, then read
grep -n "function_name" file.txt
read file.txt with start_line=N, end_line=M
```

---

## Terminal & Bash Protocol

**NEVER dump raw output.** Verbose commands break context:

| Don't | Do |
|---|---|
| `npm install` (hundreds of lines) | `npm install > output.log 2>&1` |
| `tree` (full directory dump) | `tree -L 2 \| head -n 20` |
| `command` (hundreds of lines) | `command \| head -n 50` |

If you must run verbose commands:
1. Pipe to `head` or `tail` to truncate output
2. Redirect to file, then read chunks

---

## Behavioral Protocol

1. **No conversational filler** — Don't say "I will do X" or "Let me check"
2. **Immediate action** — Emit tool calls directly after thinking
3. **Minimal output** — Answer in 1-3 lines unless user asks for detail
4. **Preserve context** — Don't paste large code blocks unless necessary

---

## Quick Reference: Token-Heavy Patterns to Avoid

| Pattern | Why It's Bad | Fix |
|---|---|---|
| `bash ls -laR *` | Outputs entire directory tree | Use `glob` tool instead |
| `grep -r "pattern" *` then read matches | Double work | Read file once with grep first |
| Multiple `read` calls per file | Fragmented context | Read once with `start_line`/`end_line` |
| Copying large diffs in messages | Wastes tokens | Use `edit`/`apply_patch` directly |
| `cd dir && command` | Verbose, unnecessary | Use `workdir` parameter instead |

---

## Summary

**Protect your context:**
- ✅ Answer directly — 1-3 sentences is usually enough
- ✅ Use chunked file reads — never read entire files blindly
- ✅ Pipe/truncate bash output — never dump raw logs
- ✅ Use dedicated tools — `grep`, `glob`, `read` instead of bash for simple tasks
- ❌ Avoid tool calls when simple text responses suffice

**Remember:** Every unnecessary tool call reduces your available context for the actual work. Be surgical. Be concise.

---
