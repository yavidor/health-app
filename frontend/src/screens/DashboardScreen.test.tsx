import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardScreen } from './DashboardScreen';
import {
  failingNetwork,
  fixtures,
  jsonResponse,
  pendingNetwork,
  stubNetwork,
} from './screenTestUtils';

describe('DashboardScreen', () => {
  it('shows a loading state while the request is in flight', async () => {
    pendingNetwork();
    render(<DashboardScreen />);
    expect(await screen.findByText('Loading dashboard…')).toBeTruthy();
  });

  it('surfaces a failed request rather than falling back to fixture data', async () => {
    failingNetwork(404, 'Not found');
    render(<DashboardScreen />);
    expect(await screen.findByText('Not found')).toBeTruthy();
    expect(screen.queryByText('Alex')).toBeNull();
  });

  it('shows the greeting, the daily total, and the server-sent rings once data arrives', async () => {
    stubNetwork(() => jsonResponse(fixtures.dashboard));
    render(<DashboardScreen />);

    expect(await screen.findByText('Good morning, Alex!')).toBeTruthy();
    expect(screen.getByText('450')).toBeTruthy();
    expect(screen.getByText('/ 2,500 kcal')).toBeTruthy();
    // The rings arrive from the server as percentages, not derived here.
    expect(screen.getByText('72%')).toBeTruthy();
  });
});
