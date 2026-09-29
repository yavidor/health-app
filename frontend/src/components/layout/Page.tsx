import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { PageHeader } from './AppShell';

export interface PageProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-side slot in the header, e.g. a streak pill. */
  headerAside?: ReactNode;
  /** Icon button rendered at the far right of the header. */
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Standard page frame: sticky header plus an evenly spaced content stack.
 * Every route renders one of these, so pages differ only in their sections.
 */
export function Page({
  title,
  subtitle,
  headerAside,
  headerAction,
  children,
  className,
}: PageProps) {
  return (
    <div className={cn('flex min-h-full flex-col', className)}>
      <PageHeader title={title} subtitle={subtitle} aside={headerAside} action={headerAction} />
      <div className="flex-1 space-y-6 p-5 pb-24">{children}</div>
    </div>
  );
}

export interface SectionProps {
  title?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Section({ title, action, className, children }: SectionProps) {
  return (
    <section className={className}>
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-forest-dark text-lg font-semibold">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
