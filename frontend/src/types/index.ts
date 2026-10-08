import type { Accent } from '../components/ui/accents';
import type { IconName } from '../components/ui/AppIcon';
import type { ChartDatum } from '../components/charts';

// --- Dashboard Types ---
export interface Quest {
  id: string;
  icon: IconName;
  title: string;
  subtitle: string;
  accent: Accent;
}

export interface ActivityEntry {
  id: string;
  icon: IconName;
  title: string;
  subtitle: string;
  time: string;
  accent: Accent;
}

export interface MacroSnapshot {
  label: string;
  value: number;
  max: number;
  accent: Accent;
}

export interface DashboardData {
  greeting: { name: string; streakDays: number };
  dailyTotal: { consumed: number; goal: number };
  rings: { label: string; pct: number; display: string; accent: 'sea' | 'forest' }[];
  quickActions: { id: string; label: string; icon: IconName }[];
  quests: readonly Quest[];
  activity: readonly ActivityEntry[];
  macros: readonly MacroSnapshot[];
  squadRank: number;
  squadPoints: number;
}

// --- Fitness Types ---
export interface ExerciseProgress {
  id: string;
  name: string;
  setsDone: number;
  setsTotal: number;
  load: string;
}

export interface ActiveWorkout {
  id: string;
  title: string;
  location: string;
  remainingMinutes: number;
  progressPct: number;
  exercises: readonly ExerciseProgress[];
}

export interface WorkoutCategory {
  id: string;
  label: string;
  icon: IconName;
  accent: Accent;
}

export interface WorkoutHistoryEntry {
  id: string;
  icon: IconName;
  title: string;
  subtitle: string;
  headline: string;
  detail: string;
  accent: Accent;
}

export interface FitnessData {
  weekMinutes: { value: number; hint: string };
  monthMinutes: { value: number; hint: string };
  active: ActiveWorkout;
  categories: readonly WorkoutCategory[];
  history: readonly WorkoutHistoryEntry[];
}

// --- Food Types ---
export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface Meal {
  id: string;
  slot: MealSlot;
  title: string;
  time: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodData {
  goal: { consumed: number; target: number };
  macroTotals: { protein: number; carbs: number; fat: number };
  meals: readonly Meal[];
  quickAdd: readonly { id: string; label: string; icon: IconName }[];
  weeklyCalories: readonly ChartDatum[];
}

// --- Squad Types ---
export interface SquadMember {
  id: string;
  name: string;
  rank: number;
  points: number;
  delta: string;
  isYou?: boolean;
  accent: Accent;
}

export interface SquadGoal {
  id: string;
  label: string;
  progress: number;
  target: number;
  points: number;
  completed?: boolean;
}

export interface SquadWin {
  id: string;
  icon: IconName;
  title: string;
  subtitle: string;
  accent: Accent;
}

export interface SquadData {
  members: number;
  leaderboard: readonly SquadMember[];
  goals: readonly SquadGoal[];
  quickActions: readonly { id: string; label: string; icon: IconName }[];
  wins: readonly SquadWin[];
}

// --- Stats Types ---
export type RangeKey = '7d' | '30d' | '3m' | '6m' | '1y';

export interface SummaryStat {
  id: string;
  label: string;
  value: string;
  delta: string;
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
