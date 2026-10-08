import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FoodScreen } from './FoodScreen';
import {
  failingNetwork,
  fixtures,
  jsonResponse,
  pendingNetwork,
  stubNetwork,
} from './screenTestUtils';

describe('FoodScreen', () => {
  it('shows a loading state while the request is in flight', async () => {
    pendingNetwork();
    render(<FoodScreen />);
    expect(await screen.findByText('Loading food…')).toBeTruthy();
  });

  it('surfaces a failed request rather than falling back to fixture data', async () => {
    failingNetwork(404, 'Not found');
    render(<FoodScreen />);
    expect(await screen.findByText('Not found')).toBeTruthy();
    expect(screen.queryByText('Oatmeal & Berries')).toBeNull();
  });

  it("shows the day's meals, the daily goal, and the header once data arrives", async () => {
    stubNetwork(() => jsonResponse(fixtures.food));
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
