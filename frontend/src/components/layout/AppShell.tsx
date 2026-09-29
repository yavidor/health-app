import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { ACCENT_TEXT } from '../ui/accents';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  /** Long label used in the desktop sidebar. Defaults to `label`. */
  sidebarLabel?: string;
}

export interface AppShellProps {
  nav: readonly NavItem[];
  activeNavId: string;
  onNavigate: (id: string) => void;
  children: ReactNode;
  /** Desktop sidebar footer, e.g. a user chip. */
  footer?: ReactNode;
  /** Brand block in the sidebar header. */
  brand?: { title: string; subtitle?: string; icon?: ReactNode };
  className?: string;
}

export function AppShell({
  nav,
  activeNavId,
  onNavigate,
  children,
  footer,
  brand,
  className,
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-screen', className)}>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col lg:max-w-2xl">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <TabBar nav={nav} activeNavId={activeNavId} onNavigate={onNavigate} />
      </div>

      <aside className="border-forest-dark/10 bg-mist sticky top-0 hidden h-screen w-64 flex-col border-r lg:flex">
        {brand ? (
          <div className="p-6">
            <div className="flex items-center gap-3">
              {brand.icon ? (
                <span className="rounded-tile from-leaf-text to-forest-text flex h-12 w-12 items-center justify-center bg-gradient-to-br text-2xl text-white">
                  {brand.icon}
                </span>
              ) : null}
              <div>
                <h1 className="text-forest-dark text-xl font-bold">{brand.title}</h1>
                {brand.subtitle ? <p className="text-sea-text text-xs">{brand.subtitle}</p> : null}
              </div>
            </div>
          </div>
        ) : null}

        <nav className="flex-1 space-y-2 p-4">
          {nav.map((item) => {
            const active = item.id === activeNavId;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-tile flex w-full items-center gap-3 px-4 py-3 text-left font-medium transition-colors',
                  active
                    ? cn('shadow-card bg-white', ACCENT_TEXT.forest)
                    : 'text-sea-text hover:bg-white/60'
                )}
              >
                <span className={cn('shrink-0', active && ACCENT_TEXT.forest)}>{item.icon}</span>
                {item.sidebarLabel ?? item.label}
              </button>
            );
          })}
        </nav>

        {footer ? <div className="border-forest-dark/10 border-t p-4">{footer}</div> : null}
      </aside>
    </div>
  );
}

export interface TabBarProps {
  nav: readonly NavItem[];
  activeNavId: string;
  onNavigate: (id: string) => void;
}

export function TabBar({ nav, activeNavId, onNavigate }: TabBarProps) {
  return (
    <nav className="border-forest-dark/10 fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {nav.map((item) => {
          const active = item.id === activeNavId;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-2 transition-colors',
                active ? ACCENT_TEXT.forest : 'text-sea-text/60'
              )}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-side slot, e.g. a streak pill. */
  aside?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, aside, action, className }: PageHeaderProps) {
  return (
    <header className={cn('bg-mist shadow-card sticky top-0 z-10 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-forest-dark truncate text-2xl font-bold">{title}</h1>
          {subtitle ? <p className="text-sea-text truncate text-sm">{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {aside}
          {action}
        </div>
      </div>
    </header>
  );
}
