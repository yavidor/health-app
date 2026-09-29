import type { Accent } from '../../components/ui/accents';

export interface Quest {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  accent: Accent;
}

export interface ActivityEntry {
  id: string;
  emoji: string;
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
  quickActions: { id: string; label: string; emoji: string }[];
  quests: readonly Quest[];
  activity: readonly ActivityEntry[];
  macros: readonly MacroSnapshot[];
  squadRank: number;
  squadPoints: number;
}

export const DASHBOARD_FIXTURE: DashboardData = {
  greeting: { name: 'Alex', streakDays: 12 },
  dailyTotal: { consumed: 450, goal: 2500 },
  rings: [
    { label: 'Calories', pct: 72, display: '72%', accent: 'sea' },
    { label: 'Protein', pct: 65, display: '65g', accent: 'forest' },
  ],
  quickActions: [
    { id: 'workout', label: 'Workout', emoji: '🏋️' },
    { id: 'meal', label: 'Meal', emoji: '🥗' },
    { id: 'stats', label: 'Stats', emoji: '📊' },
    { id: 'squad', label: 'Squad', emoji: '🎮' },
  ],
  quests: [
    {
      id: 'vitamins',
      emoji: '💊',
      title: 'Daily Vitamins',
      subtitle: 'Vitamin C, D, B12',
      accent: 'leaf',
    },
    { id: 'steps', emoji: '🚶', title: '5k Steps', subtitle: 'Daily walk goal', accent: 'sea' },
    { id: 'run', emoji: '🏃', title: 'Morning Run', subtitle: '30 min cardio', accent: 'pinkish' },
  ],
  activity: [
    {
      id: 'a1',
      emoji: '🏃',
      title: 'Morning Run',
      subtitle: '5.2 km • 42 min • 320 kcal',
      time: '7:42 AM',
      accent: 'pinkish',
    },
    {
      id: 'a2',
      emoji: '🥗',
      title: 'Lunch',
      subtitle: 'Grilled chicken • 550 kcal',
      time: '1:30 PM',
      accent: 'sea',
    },
    {
      id: 'a3',
      emoji: '💪',
      title: 'Upper Body',
      subtitle: 'Gym • 60 min • 380 kcal',
      time: '6:00 PM',
      accent: 'forest',
    },
  ],
  macros: [
    { label: 'Carbs', value: 210, max: 250, accent: 'sea' },
    { label: 'Fats', value: 58, max: 70, accent: 'pinkish' },
    { label: 'Water', value: 1.8, max: 2.5, accent: 'leaf' },
  ],
  squadRank: 3,
  squadPoints: 120,
};
