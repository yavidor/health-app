import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsScreen } from './StatsScreen';
import {
  failingNetwork,
  fixtures,
  jsonResponse,
  pendingNetwork,
  stubNetwork,
} from './screenTestUtils';

describe('StatsScreen', () => {
  it('shows a loading state while the request is in flight', async () => {
    pendingNetwork();
    render(<StatsScreen />);
    expect(await screen.findByText('Loading stats…')).toBeTruthy();
  });

  it('surfaces a failed request rather than falling back to fixture data', async () => {
    failingNetwork(404, 'Not found');
    render(<StatsScreen />);
    expect(await screen.findByText('Not found')).toBeTruthy();
    expect(screen.queryByText('Weight Trend')).toBeNull();
  });

  it('shows the weight trend and the correlation chart once data arrives', async () => {
    stubNetwork(() => jsonResponse(fixtures.stats));
    render(<StatsScreen />);

    expect(await screen.findByText('Weight Trend')).toBeTruthy();
    expect(screen.getByText('Calories vs. Weight')).toBeTruthy();
    expect(screen.getByText('Local Storage')).toBeTruthy();
  });
});
