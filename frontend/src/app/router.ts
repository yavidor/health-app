import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

function readHash(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hash.replace(/^#\/?/, '');
}

let current = readHash();

function handleHashChange() {
  current = readHash();
  listeners.forEach((listener) => listener());
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', handleHashChange);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current route id from the URL hash (empty string when none is set). */
export function useRouteId(): string {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => ''
  );
}

export function navigate(routeId: string): void {
  window.location.hash = `#/${routeId}`;
}

export function ensureHash(defaultRouteId: string): void {
  if (!readHash()) {
    window.history.replaceState(null, '', `#/${defaultRouteId}`);
    current = defaultRouteId;
  }
}
