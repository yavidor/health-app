import { Flame } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ProgressRing } from '../../components/ui/Progress';
import { cn } from '../../lib/cn';

export interface DailyTotalRing {
  label: string;
  value: number;
  max: number;
  /** Center content, e.g. `450` or `65g`. */
  display: string;
  accent: 'sea' | 'forest';
}

export interface DailyTotalCardProps {
  heading: string;
  /** Primary figure, e.g. `450`. */
  value: string;
  unit: string;
  /** Secondary figure, e.g. `2,200 kcal`. */
  target: string;
  rings: readonly DailyTotalRing[];
  onLog?: () => void;
  className?: string;
}

/** Gradient hero card summarising the day's totals. Shared by Dashboard and Food. */
export function DailyTotalCard({
  heading,
  value,
  unit,
  target,
  rings,
  onLog,
  className,
}: DailyTotalCardProps) {
  return (
    <Card
      className={cn(
        'from-sea-text to-forest-text bg-gradient-to-r p-6 text-white',
        'ring-1 ring-white/10 [&_h2]:text-white [&_span]:text-white',
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sea-bright mb-1 text-sm font-medium">{heading}</p>
          <h2 className="text-4xl font-bold">
            {value} <span className="text-sea-bright text-sm font-normal">{target}</span>
          </h2>
        </div>
        <span className="text-xs text-white/70">{unit}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {rings.map((ring) => (
          <div key={ring.label} className="flex flex-col items-center gap-2">
            <ProgressRing
              value={ring.value}
              max={ring.max}
              accent={ring.accent}
              label={ring.label}
              className="[&_circle:first-of-type]:stroke-white/25"
            >
              {ring.display}
            </ProgressRing>
            <span className="text-xs text-white/90">{ring.label}</span>
          </div>
        ))}
      </div>
      {onLog ? (
        <button
          onClick={onLog}
          className="rounded-tile mt-4 flex w-full items-center justify-center gap-2 bg-white/15 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
        >
          <Flame size={16} /> Log intake
        </button>
      ) : null}
    </Card>
  );
}
