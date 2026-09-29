import { Suspense } from 'react';
import { AppShell } from './components/layout/AppShell';
import { PageLoader } from './components/layout/PageLoader';
import { EmptyState } from './components/ui';
import { BRAND, SidebarFooter } from './app/config';
import { DEFAULT_ROUTE_ID, NAV_ITEMS, findRoute } from './app/routes';
import { ensureHash, navigate, useRouteId } from './app/router';

ensureHash(DEFAULT_ROUTE_ID);

export default function App() {
  const routeId = useRouteId() || DEFAULT_ROUTE_ID;
  const route = findRoute(routeId);
  const ActivePage = route?.component;

  return (
    <AppShell
      nav={NAV_ITEMS}
      activeNavId={route?.id ?? DEFAULT_ROUTE_ID}
      onNavigate={navigate}
      brand={BRAND}
      footer={<SidebarFooter />}
    >
      {ActivePage ? (
        <Suspense fallback={<PageLoader />}>
          <ActivePage />
        </Suspense>
      ) : (
        <EmptyState title="Page not found" description={`No route registered for "${routeId}".`} />
      )}
    </AppShell>
  );
}
