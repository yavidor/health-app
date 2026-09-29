import type { Accent } from '../../components/ui/accents';
import type { IconName } from '../../components/ui/AppIcon';

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

export const SQUAD_FIXTURE: SquadData = {
  members: 5,
  leaderboard: [
    { id: 'u1', name: 'Dana', rank: 1, points: 1840, delta: '▲ 120', accent: 'leaf' },
    { id: 'u2', name: 'Sam', rank: 2, points: 1520, delta: '▲ 40', accent: 'sea' },
    {
      id: 'u3',
      name: 'Alex',
      rank: 3,
      points: 1290,
      delta: '▲ 120',
      isYou: true,
      accent: 'forest',
    },
    { id: 'u4', name: 'Rin', rank: 4, points: 980, delta: '▼ 30', accent: 'pinkish' },
    { id: 'u5', name: 'Jo', rank: 5, points: 640, delta: '▲ 15', accent: 'sea' },
  ],
  goals: [
    { id: 'g1', label: 'Workout', progress: 1, target: 1, points: 50, completed: true },
    { id: 'g2', label: 'Daily vitamins', progress: 1, target: 1, points: 20, completed: true },
    { id: 'g3', label: '5,000 steps', progress: 3200, target: 5000, points: 40 },
    { id: 'g4', label: 'Sleep 8 hours', progress: 7, target: 8, points: 30 },
  ],
  quickActions: [
    { id: 'workout', label: 'Workout', icon: 'dumbbell' },
    { id: 'steps', label: 'Steps', icon: 'footsteps' },
    { id: 'pills', label: 'Vitamins', icon: 'pill' },
    { id: 'sleep', label: 'Sleep', icon: 'moon' },
  ],
  wins: [
    {
      id: 'w1',
      icon: 'trophy',
      title: 'Beat Sam for 2nd',
      subtitle: 'Overtook Sam by 40 points',
      accent: 'leaf',
    },
    {
      id: 'w2',
      icon: 'flame',
      title: '7-day streak',
      subtitle: 'Logged a goal every day',
      accent: 'pinkish',
    },
  ],
};
