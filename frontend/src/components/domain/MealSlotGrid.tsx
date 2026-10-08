import { AppIcon, type IconName } from '../ui/AppIcon';
import type { Accent } from '../ui/accents';
import type { MealSlot } from '../../types';

export const MEAL_SLOTS: readonly {
  id: MealSlot;
  label: string;
  icon: IconName;
  accent: Accent;
}[] = [
  { id: 'breakfast', label: 'Breakfast', icon: 'egg', accent: 'leaf' },
  { id: 'lunch', label: 'Lunch', icon: 'sandwich', accent: 'sea' },
  { id: 'dinner', label: 'Dinner', icon: 'utensils', accent: 'pinkish' },
  { id: 'snacks', label: 'Snacks', icon: 'popcorn', accent: 'forest' },
];

export const MEAL_ICON: Record<MealSlot, IconName> = {
  breakfast: 'egg',
  lunch: 'sandwich',
  dinner: 'utensils',
  snacks: 'popcorn',
};

export interface MealSlotGridProps {
  onSelectSlot?: (slot: MealSlot) => void;
}

export function MealSlotGrid({ onSelectSlot }: MealSlotGridProps) {
  return (
    <section>
      <h2 className="text-forest-dark mb-3 text-lg font-semibold">Today's Meals</h2>
      <div className="grid grid-cols-4 gap-2">
        {MEAL_SLOTS.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelectSlot?.(slot.id)}
            className="rounded-card bg-mist p-3 text-center transition-all hover:opacity-90"
          >
            <AppIcon name={slot.icon} size={20} className="text-forest-dark mx-auto" />
            <div className="text-forest-dark mt-1 text-xs font-medium">{slot.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
