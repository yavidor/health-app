#!/usr/bin/env node
// Reports TypeScript parse errors and stale references across the frontend.
//
// Useful after a bulk rename or a refactor: it parses every source file and
// names the things that should have gone with it. Parsing rather than
// grepping, so it does not report a match inside a comment or a string.
//
//   node scripts/audit-stale-references.mjs [--old DataBoundary] [--gone useFoodData]
//
// With no arguments it runs the default checks for this codebase.

import ts from '../frontend/node_modules/typescript/lib/typescript.js';
import fs from 'node:fs';
import path from 'node:path';

const FRONTEND_SRC = path.join(import.meta.dirname, '..', 'frontend', 'src');

const EXTENSIONS = new Set(['.ts', '.tsx']);

/** Recursively yields every .ts/.tsx file under dir. */
function* sourceFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(full);
    else if (EXTENSIONS.has(path.extname(entry.name))) yield full;
  }
}

function parse(file) {
  const text = fs.readFileSync(file, 'utf8');
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
}

/** Renders a finding with a path relative to the repo root, and 1-based position. */
function report(problems, file, position, kind, detail) {
  const { line, character } = file.getLineAndCharacterOfPosition(position);
  problems.push(
    `${kind} ${path.relative(process.cwd(), file.fileName)}:${line + 1}:${character + 1} ${detail}`
  );
}

/** Flags identifiers named `name`, ignoring positions and type nodes. */
function findIdentifiers(sourceFile, name, problems) {
  const visit = (node) => {
    if (ts.isIdentifier(node) && node.text === name) {
      report(problems, sourceFile, node.getStart(sourceFile), 'STALE', `identifier \`${name}\` still present`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

/** Flags calls to `name`, which catches renames that left the call behind. */
function findCalls(sourceFile, name, problems) {
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === name) {
      report(problems, sourceFile, node.getStart(sourceFile), 'STALE', `still calling \`${name}\``);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

function main() {
  const argv = process.argv.slice(2);
  const oldName = valueOf('--old') ?? 'DataBoundary';
  const goneCall = valueOf('--gone') ?? 'useFoodData';

  const files = [...sourceFiles(FRONTEND_SRC)];
  if (files.length === 0) {
    console.error(`no TypeScript sources found under ${FRONTEND_SRC}`);
    process.exit(1);
  }

  const problems = [];
  let parseErrors = 0;

  for (const file of files) {
    const sourceFile = parse(file);

    for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
      parseErrors++;
      report(
        problems,
        sourceFile,
        diagnostic.start,
        'PARSE',
        ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')
      );
    }

    findIdentifiers(sourceFile, oldName, problems);
    findCalls(sourceFile, goneCall, problems);
  }

  for (const problem of problems) console.log(problem);
  console.log(
    problems.length === 0
      ? `clean: ${files.length} files parsed, no parse errors, no stale references`
      : `${problems.length} problems in ${files.length} files (${parseErrors} parse errors)`
  );
  process.exit(problems.length === 0 ? 0 : 1);
}

function valueOf(flag) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

main();
