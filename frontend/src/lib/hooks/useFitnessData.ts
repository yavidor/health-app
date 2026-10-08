import { useCallback } from 'react';
import { api } from '../api';
import type { FitnessData } from '../../types';
import { useApiData, type UseApiDataOptions, type UseApiDataResult } from './useApiData';

export type UseFitnessDataOptions = UseApiDataOptions<FitnessData>;

export function useFitnessData(options: UseFitnessDataOptions = {}): UseApiDataResult<FitnessData> {
  const fetcher = useCallback(
    (signal: AbortSignal) => api.get<FitnessData>('/fitness', { signal }),
    []
  );

  return useApiData(fetcher, options);
}
