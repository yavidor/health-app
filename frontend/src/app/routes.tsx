import { lazy } from 'react';
import { Apple, BarChart3, Dumbbell, Home, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import type { NavItem } from '../components/layout';

/** Screens are code-split: each destination's chunk loads on first navigation. */
const DashboardScreen = lazy(() =>
  import('../screens/DashboardScreen').then((m) => ({ default: m.DashboardScreen }))
);
const FitnessScreen = lazy(() =>
  import('../screens/FitnessScreen').then((m) => ({ default: m.FitnessScreen }))
);
const FoodScreen = lazy(() =>
  import('../screens/FoodScreen').then((m) => ({ default: m.FoodScreen }))
);
const StatsScreen = lazy(() =>
  import('../screens/StatsScreen').then((m) => ({ default: m.StatsScreen }))
);
const SquadScreen = lazy(() =>
  import('../screens/SquadScreen').then((m) => ({ default: m.SquadScreen }))
);

export interface RouteDefinition extends NavItem {
  /** The Screen. Renders its whole destination, header included. */
  component: ComponentType;
}

/**
 * Single source of truth for navigation. Adding a Screen:
 *   1. create `src/screens/<Name>Screen.tsx`
 *   2. add an entry here
 * The tab bar, sidebar and router all read from this list.
 */
export const ROUTES: readonly RouteDefinition[] = [
  {
    id: 'dashboard',
    label: 'Home',
    sidebarLabel: 'Dashboard',
    icon: <Home size={20} />,
    component: DashboardScreen,
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: <Dumbbell size={20} />,
    component: FitnessScreen,
  },
  {
    id: 'food',
    label: 'Food',
    sidebarLabel: 'Food & Macros',
    icon: <Apple size={20} />,
    component: FoodScreen,
  },
  {
    id: 'stats',
    label: 'Stats',
    sidebarLabel: 'Analytics',
    icon: <BarChart3 size={20} />,
    component: StatsScreen,
  },
  {
    id: 'squad',
    label: 'Squad',
    sidebarLabel: 'Squad Game',
    icon: <Users size={20} />,
    component: SquadScreen,
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
