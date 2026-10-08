import { Users } from 'lucide-react';
import { Card } from '../ui';
import type { SquadMember } from '../../types';

export interface SquadHeroCardProps {
  you?: SquadMember;
}

export function SquadHeroCard({ you }: SquadHeroCardProps) {
  return (
    <Card className="from-leaf-bright to-leaf-text bg-gradient-to-br p-5">
      <div className="flex items-center gap-3">
        <span className="text-forest-dark rounded-full bg-white/60 px-3 py-1 text-sm font-bold">
          {you?.rank ? `#${you.rank}` : 'Unranked'}
        </span>
        <div className="flex-1">
          <p className="text-forest-dark text-xl font-bold">
            {you?.points.toLocaleString() ?? 0} pts
          </p>
          <p className="text-forest-dark/80 text-xs">This week • {you?.delta}</p>
        </div>
        <Users className="text-forest-dark/70" size={28} />
      </div>
    </Card>
  );
}
