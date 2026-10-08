import { useCallback } from 'react';
import { api } from '../api';
import type { RangeKey, StatsData } from '../../types';
import { useApiData, type UseApiDataOptions, type UseApiDataResult } from './useApiData';

export interface UseStatsDataOptions extends UseApiDataOptions<StatsData> {
  range?: RangeKey;
}

export function useStatsData(options: UseStatsDataOptions = {}): UseApiDataResult<StatsData> {
  const { range = '30d', ...rest } = options;

  // `range` is a dependency, so switching the range refetches.
  const fetcher = useCallback(
    (signal: AbortSignal) => api.get<StatsData>('/stats', { params: { range }, signal }),
    [range]
  );

  return useApiData(fetcher, rest);
}
