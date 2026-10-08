import { Card, CardHeader, ProgressBar } from '../ui';
import type { SquadGoal } from '../../types';

export interface SquadGoalsCardProps {
  goals: readonly SquadGoal[];
}

export function SquadGoalsCard({ goals }: SquadGoalsCardProps) {
  const completedGoals = goals.filter((g) => g.completed).length;

  return (
    <Card className="space-y-3 p-4">
      <CardHeader
        title="Squad Goals"
        subtitle={`${completedGoals}/${goals.length} complete today`}
      />
      <ProgressBar
        value={completedGoals}
        max={goals.length}
        accent="leaf"
        showValue
        caption="Shared goals"
      />
      <div className="space-y-2 pt-1">
        {goals.map((goal) => (
          <div key={goal.id} className="flex items-center gap-2 text-sm">
            <span className="text-forest-dark font-medium">{goal.label}</span>
            <span className="text-sea-text/70 ml-auto text-xs">
              {goal.progress}/{goal.target} · {goal.points} pts
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
