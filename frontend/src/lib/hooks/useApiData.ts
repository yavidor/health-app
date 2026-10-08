import { useCallback, useEffect, useState } from 'react';

export interface UseApiDataOptions<T> {
  /**
   * Data the caller already has (e.g. a `data` prop). Rendered immediately,
   * then replaced once the request resolves. Does not suppress errors.
   */
  initialData?: T;
  /** Skip fetching entirely when false. */
  enabled?: boolean;
}

export interface UseApiDataResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Minimal GET-with-lifecycle hook.
 *
 * The app is online-first: a failed request surfaces as `isError`/`error` and
 * is never masked with placeholder data. Use `DataBoundary` to render the
 * loading, error, and success states.
 *
 * `fetcher` must be referentially stable (wrap it in `useCallback`) — identity
 * changes retrigger the request, which is how `useStatsData` refetches when the
 * selected range changes.
 */
export function useApiData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  options: UseApiDataOptions<T> = {}
): UseApiDataResult<T> {
  const { initialData, enabled = true } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(
    (signal: AbortSignal) =>
      fetcher(signal).then(
        (result) => {
          if (signal.aborted) return;
          setData(result);
          setError(null);
        },
        (err: unknown) => {
          if (signal.aborted) return;
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      ),
    [fetcher]
  );

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [enabled, load]);

  const refetch = useCallback(() => {
    // Fresh controller: retries outlive the mount effect's scope.
    setError(null);
    void load(new AbortController().signal);
  }, [load]);

  // Derived rather than stored: a background refresh over existing data stays
  // quiet instead of flashing a spinner.
  const isError = error !== null;
  const isLoading = enabled && data === undefined && error === null;

  return { data, isLoading, isError, error, refetch };
}
