import type { ReactNode } from 'react';
import { Button, EmptyState, ListRow } from '../ui';
import { cn } from '../../lib/cn';
import type { Accent } from '../ui/accents';

export interface FeedItem {
  id: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: string;
  accent?: Accent;
}

export interface FeedProps {
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  items: readonly FeedItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  /** Left border stripe, as used by the quest list. */
  bordered?: boolean;
  /** Trailing control per row, e.g. a completion toggle. */
  renderRowAction?: (item: FeedItem) => ReactNode;
  className?: string;
}

/** A titled vertical list of rows with built-in empty state. */
export function Feed({
  title,
  actionLabel,
  onAction,
  items,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  bordered = false,
  renderRowAction,
  className,
}: FeedProps) {
  return (
    <section className={className}>
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-forest-dark text-lg font-semibold">{title}</h2>
          {actionLabel && onAction ? (
            <Button variant="ghost" size="sm" accent="leaf" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}

      {items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ListRow
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              trailing={item.trailing}
              accent={item.accent}
              bordered={bordered}
              action={renderRowAction?.(item)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export interface QuickAddItem {
  id: string;
  label: string;
  emoji: string;
  onAdd: () => void;
}

export function QuickAdd({
  items,
  className,
}: {
  items: readonly QuickAddItem[];
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-2 sm:grid-cols-4', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onAdd}
          className="rounded-tile bg-mist text-forest-dark hover:bg-leaf-bright flex flex-col items-center gap-1 p-3 transition-colors active:scale-95"
        >
          <span className="text-xl leading-none">{item.emoji}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
