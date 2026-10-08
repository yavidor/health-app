import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import fixture from '../lib/mockData.json';
import type { DashboardData } from '../types';
import { DashboardScreen } from './DashboardScreen';

/**
 * Drift between the fixture and the Screen's data interface is a build error.
 *
 * The cast is needed because JSON imports widen string unions — `slot` arrives
 * as `string`, not `MealSlot`. It is a widening gap, not fixture drift, and it
 * lives in exactly one place per Screen test.
 */
const dashboard = fixture.dashboard as DashboardData;

/**
 * The seam: render the Screen against a stubbed network and assert on what a
 * User ends up seeing. Reaches neither the loader contract nor the reshaping.
 */
function stubNetwork(handler: () => Response | Promise<Response>) {
  vi.stubGlobal('fetch', vi.fn(handler));
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('DashboardScreen', () => {
  it('shows a loading state while the request is in flight', async () => {
    stubNetwork(() => new Promise(() => {}));
    render(<DashboardScreen />);
    expect(await screen.findByText('Loading dashboard…')).toBeTruthy();
  });

  it('surfaces a failed request rather than falling back to fixture data', async () => {
    stubNetwork(() => new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }));
    render(<DashboardScreen />);
    expect(await screen.findByText('Not found')).toBeTruthy();
    expect(screen.queryByText('Alex')).toBeNull();
  });

  it('shows the greeting, the daily total, and the server-sent rings once data arrives', async () => {
    stubNetwork(() => jsonResponse(dashboard));
    render(<DashboardScreen />);

    expect(await screen.findByText('Good morning, Alex!')).toBeTruthy();
    expect(screen.getByText('450')).toBeTruthy();
    expect(screen.getByText('/ 2,500 kcal')).toBeTruthy();
    // The rings arrive from the server as percentages, not derived here.
    expect(screen.getByText('72%')).toBeTruthy();
  });
});
