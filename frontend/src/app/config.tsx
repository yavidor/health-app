import { Card } from '../components/ui';

/** Chrome that is identical on every page lives here, not in `App`. */
export const BRAND = {
  title: 'Health App',
  subtitle: 'Self-hosted',
  icon: '🏃',
} as const;

export const PROFILE = {
  name: 'Alex',
  plan: 'Free Plan',
  initial: 'A',
} as const;

export function SidebarFooter() {
  return (
    <Card className="flex items-center gap-3 px-4 py-3">
      <span className="from-sea-text to-forest-text flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white">
        {PROFILE.initial}
      </span>
      <div className="flex-1">
        <p className="text-forest-dark text-sm font-medium">{PROFILE.name}</p>
        <p className="text-sea-text text-xs">{PROFILE.plan}</p>
      </div>
    </Card>
  );
}
