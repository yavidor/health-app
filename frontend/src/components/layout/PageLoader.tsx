/** Fallback shown while a lazily loaded page chunk is fetched. */
export function PageLoader() {
  return (
    <div className="space-y-4 p-5" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      <div className="bg-mist rounded-card h-20 animate-pulse" />
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-mist rounded-card h-24 animate-pulse" />
        <div className="bg-mist rounded-card h-24 animate-pulse" />
      </div>
      <div className="bg-mist rounded-card h-40 animate-pulse" />
    </div>
  );
}
