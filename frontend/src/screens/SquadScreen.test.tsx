import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SquadScreen } from './SquadScreen';
import {
  failingNetwork,
  fixtures,
  jsonResponse,
  pendingNetwork,
  stubNetwork,
} from './screenTestUtils';

describe('SquadScreen', () => {
  it('shows a loading state while the request is in flight', async () => {
    pendingNetwork();
    render(<SquadScreen />);
    expect(await screen.findByText('Loading squad…')).toBeTruthy();
  });

  it('surfaces a failed request rather than falling back to fixture data', async () => {
    failingNetwork(404, 'Not found');
    render(<SquadScreen />);
    expect(await screen.findByText('Not found')).toBeTruthy();
    expect(screen.queryByText('Dana')).toBeNull();
  });

  it("shows the squad size, the leaderboard, and the User's own rank once data arrives", async () => {
    stubNetwork(() => jsonResponse(fixtures.squad));
    render(<SquadScreen />);

    expect(await screen.findByText('5 friends competing')).toBeTruthy();
    expect(screen.getByText('Dana')).toBeTruthy();
    expect(screen.getByText('#3')).toBeTruthy();
  });
});
