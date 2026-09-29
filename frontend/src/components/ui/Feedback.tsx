import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { ACCENT_TINT, ACCENT_TEXT, type Accent } from './accents';

export type BadgeTone = 'accent' | 'neutral' | 'live';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  accent?: Accent;
  className?: string;
}

const TONES: Record<BadgeTone, string> = {
  accent: '',
  neutral: 'bg-forest-dark/10 text-sea-text',
  live: 'bg-pinkish-text text-white',
};

export function Badge({ children, tone = 'neutral', accent = 'forest', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        tone === 'accent' && ACCENT_TINT[accent],
        tone === 'accent' && ACCENT_TEXT[accent],
        className
      )}
    >
      {tone === 'live' ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
      {children}
    </span>
  );
}

export interface SectionHeaderProps {
  title: ReactNode;
  /** Right-side action, e.g. a "View all" button. */
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-3 flex items-center justify-between gap-3', className)}>
      <h2 className="text-forest-dark text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-card shadow-card flex flex-col items-center gap-2 bg-white p-8 text-center',
        className
      )}
    >
      {icon ? (
        <span
          className={cn(
            'rounded-tile mb-1 flex h-12 w-12 items-center justify-center text-2xl',
            ACCENT_TINT.forest,
            ACCENT_TEXT.forest
          )}
        >
          {icon}
        </span>
      ) : null}
      <p className="text-forest-dark font-semibold">{title}</p>
      {description ? <p className="text-sea-text/70 max-w-xs text-sm">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('rounded-tile bg-mist flex gap-1 p-1', className)} role="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active ? cn('shadow-card bg-white', ACCENT_TEXT.forest) : 'text-sea-text/70'
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export interface QuickActionGridProps<T extends string> {
  items: readonly { value: T; label: string; icon: ReactNode; accent?: Accent }[];
  onSelect: (value: T) => void;
  className?: string;
}

export function QuickActionGrid<T extends string>({
  items,
  onSelect,
  className,
}: QuickActionGridProps<T>) {
  return (
    <div className={cn('grid grid-cols-4 gap-3', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          className={cn(
            'rounded-card shadow-card flex flex-col items-center gap-1 p-3 transition-colors active:scale-95',
            ACCENT_TINT[item.accent ?? 'leaf'],
            ACCENT_TEXT[item.accent ?? 'leaf'],
            'hover:brightness-95'
          )}
        >
          <span className="text-xl leading-none">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
