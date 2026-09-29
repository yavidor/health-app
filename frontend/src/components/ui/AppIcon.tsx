import {
  Activity,
  Apple,
  Beef,
  ChartColumn,
  ChevronsUp,
  Coffee,
  Droplet,
  Dumbbell,
  Egg,
  Flame,
  Footprints,
  Gamepad2,
  Gauge,
  GlassWater,
  HeartPulse,
  Moon,
  Pill,
  Popcorn,
  Ruler,
  Salad,
  Sandwich,
  Sparkles,
  Trophy,
  Utensils,
  Wind,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Icon names allowed in data files. Keeping them as plain strings lets fixtures
 * stay serialisable while pages render the matching Lucide glyph.
 */
export const ICONS = {
  activity: Activity,
  apple: Apple,
  beef: Beef,
  chart: ChartColumn,
  chevronsUp: ChevronsUp,
  coffee: Coffee,
  droplet: Droplet,
  dumbbell: Dumbbell,
  egg: Egg,
  flame: Flame,
  footsteps: Footprints,
  gamepad: Gamepad2,
  gauge: Gauge,
  heart: HeartPulse,
  moon: Moon,
  pill: Pill,
  popcorn: Popcorn,
  ruler: Ruler,
  salad: Salad,
  sandwich: Sandwich,
  sparkles: Sparkles,
  trophy: Trophy,
  utensils: Utensils,
  water: GlassWater,
  wind: Wind,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export interface AppIconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** Single place mapping data-file icon names to Lucide components. */
export function AppIcon({ name, size = 20, className }: AppIconProps) {
  const Icon = ICONS[name];
  return <Icon size={size} className={className} aria-hidden="true" />;
}
