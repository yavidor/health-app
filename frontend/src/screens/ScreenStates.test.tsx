import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScreenStates } from './ScreenStates';

function result(over: Partial<Parameters<typeof ScreenStates<string>>[0]> = {}) {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    refetch: () => {},
    loadingTitle: 'Loading…',
    children: (data: string) => <div>{data}</div>,
    ...over,
  };
}

describe('ScreenStates', () => {
  it('shows the error state on a cold failure, where there is nothing else to show', () => {
    const props = result({
      isError: true,
      isLoading: false,
      error: new Error('Not found'),
    });
    render(<ScreenStates<string> {...props} />);
    expect(screen.getByText('Not found')).toBeTruthy();
  });

  it('keeps existing data on screen when a background refresh fails', () => {
    const props = result({
      data: 'last known good',
      isError: true,
      isLoading: false,
      error: new Error('Not found'),
    });
    render(<ScreenStates<string> {...props} />);
    expect(screen.getByText('last known good')).toBeTruthy();
  });

  it('shows the loading state only while there is no data and no error', () => {
    render(<ScreenStates<string> {...result({ isLoading: true })} />);
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('shows the empty state when no request is in flight and none failed', () => {
    render(<ScreenStates<string> {...result()} />);
    expect(screen.getByText('No data yet')).toBeTruthy();
  });
});
