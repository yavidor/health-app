import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import fixture from '../lib/mockData.json';
import type { FitnessData } from '../types';
import { FitnessScreen } from './FitnessScreen';

/**
 * Drift between the fixture and the Screen's data interface is a build error.
 *
 * The cast is needed because JSON imports widen string unions — `slot` arrives
 * as `string`, not `MealSlot`. It is a widening gap, not fixture drift, and it
 * lives in exactly one place per Screen test.
 */
const fitness = fixture.fitness as FitnessData;

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

describe('FitnessScreen', () => {
  it('shows a loading state while the request is in flight', async () => {
    stubNetwork(() => new Promise(() => {}));
    render(<FitnessScreen />);
    expect(await screen.findByText('Loading fitness…')).toBeTruthy();
  });

  it('surfaces a failed request rather than falling back to fixture data', async () => {
    stubNetwork(() => new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }));
    render(<FitnessScreen />);
    expect(await screen.findByText('Not found')).toBeTruthy();
    expect(screen.queryByText('Upper Body')).toBeNull();
  });

  it('shows the weekly minutes and the active workout once data arrives', async () => {
    stubNetwork(() => jsonResponse(fitness));
    render(<FitnessScreen />);

    expect(await screen.findByText('210 min')).toBeTruthy();
    expect(screen.getByText('1,245 min')).toBeTruthy();
    expect(screen.getAllByText('Upper Body').length).toBeGreaterThan(0);
  });
});
