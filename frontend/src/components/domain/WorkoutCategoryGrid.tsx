import { AppIcon } from '../ui/AppIcon';
import { ACCENT_TEXT, ACCENT_TINT } from '../ui/accents';
import type { WorkoutCategory } from '../../types';

export interface WorkoutCategoryGridProps {
  categories: readonly WorkoutCategory[];
  onSelectCategory?: (id: string) => void;
}

export function WorkoutCategoryGrid({ categories, onSelectCategory }: WorkoutCategoryGridProps) {
  return (
    <section>
      <h2 className="text-forest-dark mb-3 text-lg font-semibold">My Workouts</h2>
      <div className="grid grid-cols-4 gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory?.(category.id)}
            className={`rounded-tile shadow-card p-3 text-left transition-all hover:shadow-md ${ACCENT_TINT[category.accent]}`}
          >
            <div
              className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${ACCENT_TEXT[category.accent]}`}
            >
              <AppIcon name={category.icon} size={18} />
            </div>
            <span className="text-forest-dark text-xs font-medium">{category.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
