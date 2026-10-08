import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FitnessScreen } from './FitnessScreen';
import {
  failingNetwork,
  fixtures,
  jsonResponse,
  pendingNetwork,
  stubNetwork,
} from './screenTestUtils';

describe('FitnessScreen', () => {
  it('shows a loading state while the request is in flight', async () => {
    pendingNetwork();
    render(<FitnessScreen />);
    expect(await screen.findByText('Loading fitness…')).toBeTruthy();
  });

  it('surfaces a failed request rather than falling back to fixture data', async () => {
    failingNetwork(404, 'Not found');
    render(<FitnessScreen />);
    expect(await screen.findByText('Not found')).toBeTruthy();
    expect(screen.queryByText('Upper Body')).toBeNull();
  });

  it('shows the weekly minutes and the active workout once data arrives', async () => {
    stubNetwork(() => jsonResponse(fixtures.fitness));
    render(<FitnessScreen />);

    expect(await screen.findByText('210 min')).toBeTruthy();
    expect(screen.getByText('1,245 min')).toBeTruthy();
    expect(screen.getAllByText('Upper Body').length).toBeGreaterThan(0);
  });
});
