import { Dumbbell, Timer } from 'lucide-react';
import { Badge, Card, ProgressBar } from '../ui';
import type { ActiveWorkout } from '../../types';

export interface ActiveWorkoutCardProps {
  active: ActiveWorkout;
}

export function ActiveWorkoutCard({ active }: ActiveWorkoutCardProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-forest-dark text-lg font-semibold">Active Workout</h2>
        <Badge tone="live">LIVE</Badge>
      </div>
      <Card className="from-forest-text to-sea-text space-y-4 bg-gradient-to-br p-5 text-white [&_span]:text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">{active.title}</h3>
            <p className="text-sm text-white/80">
              {active.location} • {active.remainingMinutes} min remaining
            </p>
          </div>
          <span className="rounded-tile flex h-12 w-12 items-center justify-center bg-white/20">
            <Timer size={24} />
          </span>
        </div>

        <ProgressBar
          value={active.progressPct}
          accent="leaf"
          className="[&>div:last-child]:bg-white [&>div>div]:bg-white"
        />

        <ul className="space-y-2">
          {active.exercises.map((exercise) => (
            <li key={exercise.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-white/90">
                <Dumbbell size={16} /> {exercise.name}
                <span className="rounded bg-white/30 px-1.5 py-0.5 text-xs">
                  {exercise.setsDone}/{exercise.setsTotal}
                </span>
              </span>
              <span className="text-white/70">{exercise.load}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
