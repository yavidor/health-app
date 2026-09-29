import { lazy } from 'react';
import { Apple, BarChart3, Dumbbell, Home, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import type { NavItem } from '../components/layout';

/** Pages are code-split: each route's chunk loads on first navigation. */
const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const FitnessPage = lazy(() =>
  import('../features/fitness/FitnessPage').then((m) => ({ default: m.FitnessPage }))
);
const FoodPage = lazy(() =>
  import('../features/food/FoodPage').then((m) => ({ default: m.FoodPage }))
);
const StatsPage = lazy(() =>
  import('../features/stats/StatsPage').then((m) => ({ default: m.StatsPage }))
);
const SquadPage = lazy(() =>
  import('../features/squad/SquadPage').then((m) => ({ default: m.SquadPage }))
);

export interface RouteDefinition extends NavItem {
  /** The page component. Must render a `<Page>` so headers stay consistent. */
  component: ComponentType;
}

/**
 * Single source of truth for navigation. Adding a page:
 *   1. create `src/app/features/<name>/<Name>Page.tsx` rendering `<Page>`
 *   2. add an entry here
 * The tab bar, sidebar and router all read from this list.
 */
export const ROUTES: readonly RouteDefinition[] = [
  {
    id: 'dashboard',
    label: 'Home',
    sidebarLabel: 'Dashboard',
    icon: <Home size={20} />,
    component: DashboardPage,
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: <Dumbbell size={20} />,
    component: FitnessPage,
  },
  {
    id: 'food',
    label: 'Food',
    sidebarLabel: 'Food & Macros',
    icon: <Apple size={20} />,
    component: FoodPage,
  },
  {
    id: 'stats',
    label: 'Stats',
    sidebarLabel: 'Analytics',
    icon: <BarChart3 size={20} />,
    component: StatsPage,
  },
  {
    id: 'squad',
    label: 'Squad',
    sidebarLabel: 'Squad Game',
    icon: <Users size={20} />,
    component: SquadPage,
  },
];

export const DEFAULT_ROUTE_ID = ROUTES[0].id;

/** Navigation projection consumed by `AppShell`. */
export const NAV_ITEMS: readonly NavItem[] = ROUTES.map(({ id, label, sidebarLabel, icon }) => ({
  id,
  label,
  sidebarLabel,
  icon,
}));

export function findRoute(routeId: string): RouteDefinition | undefined {
  return ROUTES.find((route) => route.id === routeId);
}
