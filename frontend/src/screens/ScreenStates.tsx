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
 * Precedence is: data, then error, then loading, then empty. That order is
 * deliberate and means two different failures are handled differently.
 *
 * A *cold* failure — the first request, so there is nothing to show — replaces
 * the content with the error state. A User is never left looking at a skeleton
 * that will not resolve.
 *
 * A *warm* failure — a background refresh over data already on screen — leaves
 * that data in place and does not blank the Screen. The alternative throws away
 * a correct meal log because a retry failed, which is worse than showing
 * slightly stale data. This is a quiet failure, not a masked one: there is no
 * data on screen that the network did not actually send.
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
  if (data === undefined) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return null;
}
