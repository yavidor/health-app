import type { ReactNode } from 'react';
import type { UseApiDataResult } from '../lib/hooks/useApiData';
import { EmptyState, ErrorState } from '../components/ui';
import { PageLoader } from '../components/layout/PageLoader';

export interface ScreenStatesProps<T> extends UseApiDataResult<T> {
  /** Rendered once data is available. */
  children: (data: T) => ReactNode;
  loadingTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Renders the loading / error / success states for a Screen's request.
 *
 * While a request is in flight the previous data stays on screen, so retries and
 * range switches do not blank the page. The error state only replaces the
 * content when there is nothing to show.
 *
 * Internal to the Screens: a Screen renders its header inside the success
 * branch, so nothing outside a Screen reads partially-loaded data.
 */
export function ScreenStates<T>({
  data,
  isLoading,
  isError,
  error,
  refetch,
  children,
  loadingTitle,
  emptyTitle = 'No data yet',
  emptyDescription,
}: ScreenStatesProps<T>) {
  if (data !== undefined) return <>{children(data)}</>;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (isLoading) return <PageLoader title={loadingTitle} />;

  return <EmptyState title={emptyTitle} description={emptyDescription} />;
}
