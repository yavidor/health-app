import { cn } from '../../lib/cn';
import { ACCENT_SOLID, type Accent } from './accents';

export interface ProgressBarProps {
  /** Current value. */
  value: number;
  /** Upper bound of the track. Defaults to 100. */
  max?: number;
  accent?: Accent;
  label?: string;
  /** Rendered above the track. */
  caption?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  accent = 'forest',
  label,
  caption,
  showValue = false,
  size = 'md',
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const barId = label ? `progress-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  return (
    <div className={cn('w-full', className)}>
      {(caption || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
          {caption ? <span className="text-sea-text/70">{caption}</span> : <span />}
          {showValue ? (
            <span className="text-forest-dark font-semibold tabular-nums">{Math.round(pct)}%</span>
          ) : null}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        id={barId}
        className={cn(
          'bg-forest-dark/10 w-full overflow-hidden rounded-full',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className={cn('h-full rounded-full transition-[width]', ACCENT_SOLID[accent])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  accent?: Accent;
  label?: string;
  /** Center content. Defaults to the percentage. */
  children?: string | number;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 64,
  thickness = 6,
  accent = 'forest',
  label,
  children,
  className,
}: ProgressRingProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const offset = circumference * (1 - pct / 100);

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-forest-dark/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset]', ACCENT_SOLID[accent])}
          role="progressbar"
          aria-label={label}
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </svg>
      <span className="text-forest-dark absolute text-xs font-bold tabular-nums">
        {children ?? `${Math.round(pct)}%`}
      </span>
    </div>
  );
}
