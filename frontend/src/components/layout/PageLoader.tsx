export interface PageLoaderProps {
  /** Announced to screen readers and shown above the skeletons. */
  title?: string;
}

/** Skeleton shown while page content is loading. */
export function PageLoader({ title = 'Loading…' }: PageLoaderProps) {
  return (
    <div className="space-y-4 p-5" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{title}</span>
      <div className="bg-mist rounded-card h-20 animate-pulse" />
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-mist rounded-card h-24 animate-pulse" />
        <div className="bg-mist rounded-card h-24 animate-pulse" />
      </div>
      <div className="bg-mist rounded-card h-40 animate-pulse" />
    </div>
  );
}
