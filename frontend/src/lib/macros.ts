import type { DonutSegment } from '../components/charts/MacroDonut';

export interface MacroTotals {
  protein: number;
  carbs: number;
  fat: number;
  kcal?: number;
}

export interface MacroMeal {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Format macro segments for the MacroDonut chart.
 */
export function macroSegments(totals: MacroTotals): DonutSegment[] {
  return [
    {
      key: 'protein',
      label: 'Protein',
      value: totals.protein,
      accent: 'forest',
      detail: `${totals.protein} g`,
    },
    {
      key: 'carbs',
      label: 'Carbs',
      value: totals.carbs,
      accent: 'sea',
      detail: `${totals.carbs} g`,
    },
    {
      key: 'fats',
      label: 'Fats',
      value: totals.fat,
      accent: 'pinkish',
      detail: `${totals.fat} g`,
    },
  ];
}

/**
 * Format stats macro segments with percentages.
 */
export function statsMacroSegments(totals: MacroTotals): DonutSegment[] {
  const sum = totals.protein + totals.carbs + totals.fat || 1;
  const pct = (n: number) => `${Math.round((n / sum) * 100)}%`;
  return [
    {
      key: 'protein',
      label: 'Protein',
      value: totals.protein,
      accent: 'forest',
      detail: `${totals.protein}g (${pct(totals.protein)})`,
    },
    {
      key: 'carbs',
      label: 'Carbs',
      value: totals.carbs,
      accent: 'sea',
      detail: `${totals.carbs}g (${pct(totals.carbs)})`,
    },
    {
      key: 'fats',
      label: 'Fats',
      value: totals.fat,
      accent: 'pinkish',
      detail: `${totals.fat}g (${pct(totals.fat)})`,
    },
  ];
}

/**
 * Formats a subtitle string detailing kcal and macronutrients.
 */
export function mealSubtitle(meal: MacroMeal): string {
  return `${meal.kcal} kcal • ${meal.protein}g protein • ${meal.carbs}g carbs • ${meal.fat}g fat`;
}
