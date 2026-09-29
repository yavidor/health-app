import type { Accent } from '../../components/ui/accents';

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
  emoji: string;
  accent: Accent;
}

export interface WorkoutHistoryEntry {
  id: string;
  emoji: string;
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

export const FITNESS_FIXTURE: FitnessData = {
  weekMinutes: { value: 210, hint: '4 workouts' },
  monthMinutes: { value: 1245, hint: '18 workouts' },
  active: {
    id: 'w1',
    title: 'Upper Body',
    location: 'Gym',
    remainingMinutes: 45,
    progressPct: 65,
    exercises: [
      { id: 'e1', name: 'Bench Press', setsDone: 4, setsTotal: 5, load: '450 kg' },
      { id: 'e2', name: 'Overhead Press', setsDone: 3, setsTotal: 5, load: '80 kg' },
      { id: 'e3', name: 'Bicep Curls', setsDone: 2, setsTotal: 5, load: '45 kg' },
    ],
  },
  categories: [
    { id: 'upper', label: 'Upper', emoji: '💪', accent: 'pinkish' },
    { id: 'cardio', label: 'Cardio', emoji: '🏃', accent: 'sea' },
    { id: 'core', label: 'Core', emoji: '🧘', accent: 'forest' },
    { id: 'flex', label: 'Flex', emoji: '🤸', accent: 'leaf' },
  ],
  history: [
    {
      id: 'h1',
      emoji: '🏋️',
      title: 'Upper Body',
      subtitle: 'Gym • 3 hours ago',
      headline: '450 kg',
      detail: '4 sets',
      accent: 'pinkish',
    },
    {
      id: 'h2',
      emoji: '🏃',
      title: 'Morning Run',
      subtitle: 'Home • 1 day ago',
      headline: '5.2 km',
      detail: '42 min',
      accent: 'sea',
    },
    {
      id: 'h3',
      emoji: '💪',
      title: 'Lower Body',
      subtitle: 'Gym • 2 days ago',
      headline: '85 kg',
      detail: '6 sets',
      accent: 'forest',
    },
    {
      id: 'h4',
      emoji: '🧘',
      title: 'Core Workout',
      subtitle: 'Home • 3 days ago',
      headline: '35 min',
      detail: '5 rounds',
      accent: 'leaf',
    },
  ],
};
