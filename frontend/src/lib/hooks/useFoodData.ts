import { useCallback } from 'react';
import { api } from '../api';
import type { FoodData } from '../../types';
import { useApiData, type UseApiDataOptions, type UseApiDataResult } from './useApiData';

export type UseFoodDataOptions = UseApiDataOptions<FoodData>;

export function useFoodData(options: UseFoodDataOptions = {}): UseApiDataResult<FoodData> {
  const fetcher = useCallback((signal: AbortSignal) => api.get<FoodData>('/food', { signal }), []);

  return useApiData(fetcher, options);
}
