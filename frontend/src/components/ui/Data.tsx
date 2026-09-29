import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { ACCENT_BORDER, ACCENT_TINT, ACCENT_TEXT, type Accent } from './accents';

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: Accent;
  /** Rendered instead of the plain value, e.g. a ProgressBar. */
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = 'forest',
  children,
  onClick,
  className,
}: StatCardProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'rounded-card shadow-card flex flex-col items-start gap-2 bg-white p-4 text-left',
        onClick && 'transition-shadow hover:shadow-md active:scale-[0.99]',
        className
      )}
    >
      <div className="flex w-full items-center gap-2">
        {icon ? (
          <span
            className={cn(
              'rounded-tile flex h-8 w-8 items-center justify-center',
              ACCENT_TINT[accent],
              ACCENT_TEXT[accent]
            )}
          >
            {icon}
          </span>
        ) : null}
        <span className="text-sea-text/70 truncate text-xs">{label}</span>
      </div>
      <div className="text-forest-dark text-2xl font-bold tabular-nums">{value}</div>
      {children}
      {hint ? <div className="text-sea-text/70 text-xs">{hint}</div> : null}
    </Tag>
  );
}

export interface ListRowProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned content, e.g. a time or a value. */
  trailing?: ReactNode;
  accent?: Accent;
  /** Left border colour accent. */
  bordered?: boolean;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListRow({
  icon,
  title,
  subtitle,
  trailing,
  accent = 'forest',
  bordered = false,
  action,
  onClick,
  className,
}: ListRowProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'rounded-card shadow-card flex w-full items-center gap-3 bg-white p-4 text-left',
        bordered && 'border-l-4',
        bordered && ACCENT_BORDER[accent],
        onClick && 'transition-shadow hover:shadow-md active:scale-[0.99]',
        className
      )}
    >
      {icon ? (
        <span
          className={cn(
            'rounded-tile flex h-11 w-11 shrink-0 items-center justify-center text-xl',
            ACCENT_TINT[accent],
            ACCENT_TEXT[accent]
          )}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="text-forest-dark truncate font-semibold">{title}</div>
        {subtitle ? <div className="text-sea-text/70 truncate text-xs">{subtitle}</div> : null}
      </div>
      {trailing ? (
        <div className="text-sea-text shrink-0 text-right text-sm">{trailing}</div>
      ) : null}
      {action ? <div className="shrink-0">{action}</div> : null}
    </Tag>
  );
}
