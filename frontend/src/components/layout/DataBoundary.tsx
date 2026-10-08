import type { ReactNode } from 'react';
import type { UseApiDataResult } from '../../lib/hooks/useApiData';
import { EmptyState, ErrorState } from '../ui';
import { PageLoader } from './PageLoader';

export interface DataBoundaryProps<T> extends UseApiDataResult<T> {
  /** Rendered once data is available. */
  children: (data: T) => ReactNode;
  loadingTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Renders the loading / error / success states for a `useApiData` result.
 *
 * While a request is in flight the previous data stays on screen, so retries and
 * range switches do not blank the page. The error state only replaces the
 * content when there is nothing to show.
 */
export function DataBoundary<T>({
  data,
  isLoading,
  isError,
  error,
  refetch,
  children,
  loadingTitle,
  emptyTitle = 'No data yet',
  emptyDescription,
}: DataBoundaryProps<T>) {
  if (data !== undefined) return <>{children(data)}</>;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (isLoading) return <PageLoader title={loadingTitle} />;

  return <EmptyState title={emptyTitle} description={emptyDescription} />;
}
