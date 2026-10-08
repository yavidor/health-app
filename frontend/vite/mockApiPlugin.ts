import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

/**
 * Dev/preview-only mock API for QA, enabled with `npm run dev:mock`
 * (`vite --mode mock`).
 *
 * The app has no mock-mode branching of its own: hooks always call the real
 * `ApiClient` against `/api`, and this middleware answers those requests from
 * `src/lib/mockData.json`. That keeps the code path under test identical to
 * production, and keeps fixtures inspectable/mutable in devtools.
 *
 * This is a testing tool, not an offline cache. The production build never
 * includes it, and `/api` responses are never cached by the service worker.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = resolve(HERE, '../src/lib/mockData.json');

/** Valid `RangeKey` values the stats endpoint accepts. */
const RANGES = new Set(['7d', '30d', '3m', '6m', '1y']);

type Fixtures = Record<string, Record<string, unknown>>;

function loadFixtures(): Fixtures {
  return JSON.parse(readFileSync(FIXTURE_PATH, 'utf8')) as Fixtures;
}

function sendJSON(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(payload));
  res.end(payload);
}

/**
 * Resolve `/api/<resource>` to a fixture, or `undefined` when the resource is
 * unknown so the request can fall through.
 */
function resolveResource(
  url: string | undefined,
  fixtures: Fixtures
): { key: string; body: Record<string, unknown> } | undefined {
  const [pathname = '', search = ''] = (url ?? '').split('?');
  const key = pathname.replace(/^\/+|\/+$/g, '');

  if (!key || !(key in fixtures)) return undefined;

  // Echo the requested range so the response matches what the client asked for.
  if (key === 'stats') {
    const range = new URLSearchParams(search).get('range');
    if (range && RANGES.has(range)) return { key, body: { ...fixtures[key], range } };
  }

  return { key, body: fixtures[key] };
}

export interface MockApiPluginOptions {
  /** Artificial delay in ms, e.g. `VITE_MOCK_LATENCY_MS=800`. */
  latencyMs?: number;
}

export function mockApiPlugin(options: MockApiPluginOptions = {}): Plugin {
  const latencyMs = options.latencyMs ?? 0;

  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.method !== 'GET') {
      return next();
    }

    const match = resolveResource(req.url, loadFixtures());
    if (!match) {
      // Surface unknown endpoints loudly instead of falling through to an
      // HTML 404, so a mismatched route is obvious during QA.
      return sendJSON(res, 404, {
        message: `No mock fixture for "${req.url ?? '/'}".`,
      });
    }

    if (latencyMs > 0) {
      setTimeout(() => sendJSON(res, 200, match.body), latencyMs);
    } else {
      sendJSON(res, 200, match.body);
    }
  };

  return {
    name: 'mock-api',
    // Mounted in dev and preview; never part of the production bundle.
    configureServer(server) {
      server.middlewares.use('/api', middleware);
      server.config.logger.info(
        `  ➜  mock API:  /api/{${Object.keys(loadFixtures()).join(',')}} from mockData.json` +
          (latencyMs ? ` (+${latencyMs}ms)` : '')
      );
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', middleware);
    },
  };
}

export default mockApiPlugin;
