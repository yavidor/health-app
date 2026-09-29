import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cn('rounded-card shadow-card bg-white', className)} {...rest}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h3 className="text-forest-dark truncate text-base font-semibold">{title}</h3>
        {subtitle ? <p className="text-sea-text/70 truncate text-xs">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
