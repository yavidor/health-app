# Scripts

Scripts live here when a task genuinely needs one. They are for **repeated or
structural** work, not for one-off lookups that a tool already answers.

## The rule

Before writing a script, check whether a tool does the job:

| You want to | Reach for |
| ----------- | --------- |
| Fix violations the linter knows about | `npx eslint --fix` |
| Rewrite or inspect TypeScript/JSX syntax | the TypeScript compiler API, already a devDependency |
| Match or rewrite code by syntax | `ast-grep` — `npm i -D @ast-grep/cli` |
| Rename or move files | `git mv`, the IDE, or the language server |
| Read or filter JSON | `jq` |

`typescript` is already installed, so a throwaway script that parses a file costs
nothing to run:

```js
import ts from 'typescript';
import fs from 'node:fs';

const file = ts.createSourceFile(path, fs.readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
// walk it with ts.forEachChild, then edit from node.getStart() to node.getEnd()
```

Note `import`, not `require` — `frontend/package.json` sets `"type": "module"`.

## Why not inline scripts

Editing source files as text breaks on the first nested brace, and the breakage
is silent. An inline `python -c` or `sed` rewrite that mangles a file looks
identical to one that worked, right up until `tsc` fails much later or a
subtle runtime bug appears. Parsing the file does not have that failure mode.

A script that reads, inspects, or queries is a different matter — those are safe.
The rule is about *rewriting code as text*.

## If you do add a script

- Name it for what it does, not what it is: `rename-symbol.mjs`, not `fix.js`.
- Take arguments; do not hardcode the paths you happened to be working on.
- Print what it changed, so the diff can be read rather than trusted.
- Delete it when its job is done. `git log` is the archive.

## Reference

- [`../docs/agents/frontend-architecture.md`](../docs/agents/frontend-architecture.md) — the frontend's shape and conventions
- [`../docs/agents/context-management.md`](../docs/agents/context-management.md) — keeping tool calls surgical
