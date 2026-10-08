import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import fixture from '../lib/mockData.json';
import type { FoodData } from '../types';
import { FoodScreen } from './FoodScreen';

/**
 * Drift between the fixture and the Screen's data interface is a build error.
 *
 * The cast is needed because JSON imports widen string unions — `slot` arrives
 * as `string`, not `MealSlot`. It is a widening gap, not fixture drift, and it
 * lives in exactly one place per Screen test.
 */
const food = fixture.food as FoodData;

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

describe('FoodScreen', () => {
  it('shows a loading state while the request is in flight', async () => {
    stubNetwork(() => new Promise(() => {}));
    render(<FoodScreen />);
    expect(await screen.findByText('Loading food…')).toBeTruthy();
  });

  it('surfaces a failed request rather than falling back to fixture data', async () => {
    stubNetwork(() => new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }));
    render(<FoodScreen />);
    expect(await screen.findByText('Not found')).toBeTruthy();
    expect(screen.queryByText('Oatmeal & Berries')).toBeNull();
  });

  it("shows the day's meals, the daily goal, and the header once data arrives", async () => {
    stubNetwork(() => jsonResponse(food));
    render(<FoodScreen />);

    expect(await screen.findByText('Oatmeal & Berries')).toBeTruthy();
    expect(screen.getByText('Daily Goal')).toBeTruthy();
    expect(screen.getByText('2,200')).toBeTruthy();
    // 250 + 550 + 620 from the fixture's three meals.
    expect(screen.getByText('1,420')).toBeTruthy();
    // 850 consumed against a 2200 target.
    expect(screen.getByText('39%')).toBeTruthy();
  });
});
