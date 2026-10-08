import { useCallback } from 'react';
import { api } from '../api';
import type { DashboardData } from '../../types';
import { useApiData, type UseApiDataOptions, type UseApiDataResult } from './useApiData';

export type UseDashboardDataOptions = UseApiDataOptions<DashboardData>;

export function useDashboardData(
  options: UseDashboardDataOptions = {}
): UseApiDataResult<DashboardData> {
  const fetcher = useCallback(
    (signal: AbortSignal) => api.get<DashboardData>('/dashboard', { signal }),
    []
  );

  return useApiData(fetcher, options);
}
