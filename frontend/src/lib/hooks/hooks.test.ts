// @vitest-environment jsdom
import { useCallback } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import mockData from '../mockData.json';
import { ApiError } from '../api';
import { useApiData } from './useApiData';

describe('useApiData', () => {
  it('returns fetched data and clears the loading state', async () => {
    const { result } = renderHook(() => {
      const fetcher = useCallback(async () => 'value', []);
      return useApiData(fetcher);
    });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBe('value');
    expect(result.current.isError).toBe(false);
  });

  it('surfaces a rejected request instead of substituting fallback data', async () => {
    const { result } = renderHook(() => {
      const fetcher = useCallback(async () => {
        throw new ApiError('Not found', 404, 'Not Found');
      }, []);
      return useApiData(fetcher);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.message).toBe('Not found');
  });

  it('wraps non-Error rejections', async () => {
    const { result } = renderHook(() => {
      const fetcher = useCallback(async () => Promise.reject('boom'), []);
      return useApiData(fetcher);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('boom');
  });

  it('re-fetches on demand and can recover from an error', async () => {
    let attempt = 0;
    const { result } = renderHook(() => {
      const fetcher = useCallback(async () => {
        attempt += 1;
        if (attempt === 1) throw new Error('first attempt failed');
        return 'recovered';
      }, []);
      return useApiData(fetcher);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.data).toBe('recovered'));
    expect(result.current.isError).toBe(false);
  });

  it('does not fetch while disabled', async () => {
    const fetcher = vi.fn(async () => 'value');
    const { result } = renderHook(() => useApiData(fetcher, { enabled: false }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('exposes initialData immediately and still fetches', async () => {
    const { result } = renderHook(() => {
      const fetcher = useCallback(async () => 'fresh', []);
      return useApiData(fetcher, { initialData: 'seeded' });
    });

    expect(result.current.data).toBe('seeded');
    await waitFor(() => expect(result.current.data).toBe('fresh'));
  });

  it('refetches when the fetcher identity changes', async () => {
    const { result, rerender } = renderHook(
      ({ range }: { range: string }) => {
        const fetcher = useCallback(async () => `range=${range}`, [range]);
        return useApiData(fetcher);
      },
      { initialProps: { range: '30d' } }
    );

    await waitFor(() => expect(result.current.data).toBe('range=30d'));

    rerender({ range: '7d' });
    await waitFor(() => expect(result.current.data).toBe('range=7d'));
  });

  it('does not surface an error after unmount', async () => {
    let reject!: (reason: Error) => void;
    const { result, unmount } = renderHook(() => {
      const fetcher = useCallback(() => new Promise<string>((_, r) => (reject = r)), []);
      return useApiData(fetcher);
    });

    unmount();
    await act(async () => {
      reject(new Error('late failure'));
    });

    expect(result.current.isError).toBe(false);
  });
});

describe('mock fixtures', () => {
  it('match the domain schemas the pages render', () => {
    expect(mockData.dashboard.greeting.name).toBeDefined();
    expect(mockData.dashboard.quests.length).toBeGreaterThan(0);

    expect(mockData.food.meals.length).toBeGreaterThan(0);
    expect(mockData.food.macroTotals.protein).toBeGreaterThan(0);

    expect(mockData.fitness.categories.length).toBeGreaterThan(0);
    expect(mockData.fitness.active.title).toBeDefined();

    expect(mockData.squad.leaderboard.length).toBeGreaterThan(0);
    expect(mockData.squad.goals.length).toBeGreaterThan(0);

    expect(mockData.stats.weightTrend.series.length).toBeGreaterThan(0);
    expect(mockData.stats.summary.length).toBeGreaterThan(0);
  });
});
