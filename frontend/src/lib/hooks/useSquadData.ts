import { useCallback } from 'react';
import { api } from '../api';
import type { SquadData } from '../../types';
import { useApiData, type UseApiDataOptions, type UseApiDataResult } from './useApiData';

export type UseSquadDataOptions = UseApiDataOptions<SquadData>;

export function useSquadData(options: UseSquadDataOptions = {}): UseApiDataResult<SquadData> {
  const fetcher = useCallback(
    (signal: AbortSignal) => api.get<SquadData>('/squad', { signal }),
    []
  );

  return useApiData(fetcher, options);
}
