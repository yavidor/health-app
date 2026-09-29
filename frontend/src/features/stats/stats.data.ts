import type { IconName } from '../../components/ui/AppIcon';
import type { ChartDatum } from '../../components/charts';
import type { DonutSegment } from '../../components/charts/MacroDonut';

export type RangeKey = '7d' | '30d' | '3m' | '6m' | '1y';

export const RANGES: readonly { value: RangeKey; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
];

export interface SummaryStat {
  id: string;
  label: string;
  value: string;
  delta: string;
  /** `up` is good (e.g. more workouts); `down` is good (e.g. less weight). */
  direction: 'up' | 'down';
  positive: boolean;
  icon: IconName;
}

export interface Measurement {
  id: string;
  label: string;
  latest: string;
  change: string;
  icon: IconName;
}

export interface StatsData {
  range: RangeKey;
  weightTrend: {
    changeLabel: string;
    currentKg: number;
    startKg: number;
    series: readonly ChartDatum[];
  };
  summary: readonly SummaryStat[];
  correlation: {
    correlation: string;
    insight: string;
    series: readonly ChartDatum[];
  };
  measurements: readonly Measurement[];
  macroTotals: { kcal: number; protein: number; carbs: number; fat: number };
  storage: { entries: number; workouts: number };
}

export const STATS_FIXTURE: StatsData = {
  range: '30d',
  weightTrend: {
    changeLabel: '▼ 3.2 kg',
    currentKg: 75.2,
    startKg: 78.4,
    series: [
      { week: 'Aug 29', weight: 78.4 },
      { week: 'Sep 6', weight: 77.6 },
      { week: 'Sep 13', weight: 76.9 },
      { week: 'Sep 20', weight: 75.8 },
      { week: 'Today', weight: 75.2 },
    ],
  },
  summary: [
    {
      id: 'kcal',
      label: 'Avg kcal / day',
      value: '2,180',
      delta: '▼ 340 vs last month',
      direction: 'down',
      positive: true,
      icon: 'flame',
    },
    {
      id: 'workouts',
      label: 'Workouts logged',
      value: '14',
      delta: '▲ 3 vs last month',
      direction: 'up',
      positive: true,
      icon: 'dumbbell',
    },
    {
      id: 'fat',
      label: 'Body fat',
      value: '18.4%',
      delta: '▼ 1.8 pts',
      direction: 'down',
      positive: true,
      icon: 'beef',
    },
    {
      id: 'steps',
      label: 'Avg steps / day',
      value: '9,240',
      delta: '▲ 620 vs last month',
      direction: 'up',
      positive: true,
      icon: 'footsteps',
    },
  ],
  correlation: {
    correlation: 'r = −0.72',
    insight:
      'Weeks averaging under 2,200 kcal tracked with a 0.4–0.6 kg weekly drop. Weeks above 2,600 kcal held weight flat.',
    series: [
      { week: 'W1', calories: 2400, weight: 77.8 },
      { week: 'W2', calories: 2100, weight: 77.1 },
      { week: 'W3', calories: 1950, weight: 76.4 },
      { week: 'W4', calories: 2250, weight: 75.6 },
    ],
  },
  measurements: [
    { id: 'waist', label: 'Waist', latest: '82.0 cm', change: '−4.5', icon: 'ruler' },
    { id: 'chest', label: 'Chest', latest: '101.5 cm', change: '+1.0', icon: 'gauge' },
    { id: 'hips', label: 'Hips', latest: '96.0 cm', change: '−3.0', icon: 'wind' },
    { id: 'thigh', label: 'Thigh', latest: '58.5 cm', change: '−1.5', icon: 'chevronsUp' },
  ],
  macroTotals: { kcal: 2180, protein: 164, carbs: 246, fat: 61 },
  storage: { entries: 1284, workouts: 42 },
};

export function statsMacroSegments(totals: StatsData['macroTotals']): DonutSegment[] {
  return [
    {
      key: 'protein',
      label: 'Protein',
      value: totals.protein,
      accent: 'forest',
      detail: `${totals.protein} g`,
    },
    {
      key: 'carbs',
      label: 'Carbs',
      value: totals.carbs,
      accent: 'sea',
      detail: `${totals.carbs} g`,
    },
    { key: 'fats', label: 'Fats', value: totals.fat, accent: 'pinkish', detail: `${totals.fat} g` },
  ];
}
