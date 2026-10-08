import { vi } from 'vitest';
import raw from '../lib/mockData.json';
import type { Accent } from '../components/ui/accents';
import type { IconName } from '../components/ui/AppIcon';
import type { DailyTotalRing } from '../components/domain';
import type {
  DashboardData,
  FitnessData,
  FoodData,
  MealSlot,
  RangeKey,
  SquadData,
  StatsData,
} from '../types';

type RingAccent = DailyTotalRing['accent'];

/**
 * Test support for the Screen tests.
 *
 * The seam is the rendered Screen: tests stub the network and assert on what a
 * User ends up seeing, reaching neither the loader contract nor the reshaping.
 */

export function stubNetwork(handler: () => Response | Promise<Response>) {
  vi.stubGlobal('fetch', vi.fn(handler));
}

/** A network that never resolves, for asserting the loading state. */
export function pendingNetwork() {
  stubNetwork(() => new Promise(() => {}));
}

/** A network that fails with the given status and message. */
export function failingNetwork(status: number, message: string) {
  stubNetwork(() => new Response(JSON.stringify({ message }), { status }));
}

export function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * The dev/QA fixtures, asserted against each Screen's data interface so drift
 * is a build error.
 *
 * JSON imports widen string unions — `icon` arrives as `string`, not
 * `IconName` — so each widened field is narrowed back to its domain type here.
 * Everything else is checked by `satisfies`: a renamed or newly-required field
 * fails the build rather than the browser.
 */
export const fixtures = {
  dashboard: {
    ...raw.dashboard,
    rings: raw.dashboard.rings.map((r) => ({ ...r, accent: r.accent as RingAccent })),
    quickActions: raw.dashboard.quickActions.map((a) => ({ ...a, icon: a.icon as IconName })),
    quests: raw.dashboard.quests.map((q) => ({
      ...q,
      icon: q.icon as IconName,
      accent: q.accent as Accent,
    })),
    activity: raw.dashboard.activity.map((a) => ({
      ...a,
      icon: a.icon as IconName,
      accent: a.accent as Accent,
    })),
    macros: raw.dashboard.macros.map((m) => ({ ...m, accent: m.accent as Accent })),
  } satisfies DashboardData,
  food: {
    ...raw.food,
    meals: raw.food.meals.map((meal) => ({ ...meal, slot: meal.slot as MealSlot })),
    quickAdd: raw.food.quickAdd.map((item) => ({ ...item, icon: item.icon as IconName })),
  } satisfies FoodData,
  fitness: {
    ...raw.fitness,
    active: { ...raw.fitness.active, exercises: raw.fitness.active.exercises },
    categories: raw.fitness.categories.map((c) => ({
      ...c,
      icon: c.icon as IconName,
      accent: c.accent as Accent,
    })),
    history: raw.fitness.history.map((h) => ({
      ...h,
      icon: h.icon as IconName,
      accent: h.accent as Accent,
    })),
  } satisfies FitnessData,
  squad: {
    ...raw.squad,
    leaderboard: raw.squad.leaderboard.map((m) => ({ ...m, accent: m.accent as Accent })),
    wins: raw.squad.wins.map((w) => ({
      ...w,
      icon: w.icon as IconName,
      accent: w.accent as Accent,
    })),
    quickActions: raw.squad.quickActions.map((a) => ({ ...a, icon: a.icon as IconName })),
  } satisfies SquadData,
  stats: {
    ...raw.stats,
    range: raw.stats.range as RangeKey,
    summary: raw.stats.summary.map((s) => ({
      ...s,
      icon: s.icon as IconName,
      direction: s.direction as 'up' | 'down',
    })),
    measurements: raw.stats.measurements.map((m) => ({ ...m, icon: m.icon as IconName })),
  } satisfies StatsData,
};
