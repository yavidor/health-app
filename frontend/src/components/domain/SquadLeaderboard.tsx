import { Card, CardHeader, EmptyState } from '../ui';
import { ACCENT_TEXT } from '../ui/accents';
import type { SquadMember } from '../../types';

export interface SquadLeaderboardProps {
  members: readonly SquadMember[];
}

export function SquadLeaderboard({ members }: SquadLeaderboardProps) {
  return (
    <Card className="space-y-3 p-4">
      <CardHeader title="Leaderboard" subtitle="Resets every Monday" />
      {members.length === 0 ? (
        <EmptyState title="No squad yet" description="Invite friends to start competing." />
      ) : (
        <ol className="space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className={`rounded-tile flex items-center gap-3 p-2 ${member.isYou ? 'bg-leaf-bright' : ''}`}
            >
              <span className={`w-6 text-center text-sm font-bold ${ACCENT_TEXT[member.accent]}`}>
                {member.rank}
              </span>
              <span className="text-forest-dark flex-1 text-sm font-medium">
                {member.name}
                {member.isYou ? ' (you)' : ''}
              </span>
              <span className="text-sea-text text-xs">{member.delta}</span>
              <span className="text-forest-dark w-16 text-right text-sm font-semibold tabular-nums">
                {member.points.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
