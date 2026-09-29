import type { IconName } from '../../components/ui/AppIcon';
import type { Accent } from '../../components/ui/accents';
import type { DonutSegment } from '../../components/charts/MacroDonut';
import type { ChartDatum } from '../../components/charts';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

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

export interface Meal {
  id: string;
  slot: MealSlot;
  title: string;
  time: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodData {
  goal: { consumed: number; target: number };
  macroTotals: { protein: number; carbs: number; fat: number };
  meals: readonly Meal[];
  quickAdd: readonly { id: string; label: string; icon: IconName }[];
  weeklyCalories: readonly ChartDatum[];
}

function meal(entry: Omit<Meal, 'id'>): Meal {
  return { ...entry, id: `${entry.slot}-${entry.time}` };
}

export const FOOD_FIXTURE: FoodData = {
  goal: { consumed: 850, target: 2200 },
  macroTotals: { protein: 164, carbs: 246, fat: 61 },
  meals: [
    meal({
      slot: 'breakfast',
      title: 'Oatmeal & Berries',
      time: '7:30 AM',
      kcal: 250,
      protein: 12,
      carbs: 45,
      fat: 6,
    }),
    meal({
      slot: 'lunch',
      title: 'Grilled Chicken Salad',
      time: '12:45 PM',
      kcal: 550,
      protein: 42,
      carbs: 38,
      fat: 22,
    }),
    meal({
      slot: 'dinner',
      title: 'Salmon with Asparagus',
      time: '7:00 PM',
      kcal: 620,
      protein: 38,
      carbs: 42,
      fat: 28,
    }),
    meal({
      slot: 'snacks',
      title: 'Greek Yogurt & Nuts',
      time: '9:00 AM',
      kcal: 180,
      protein: 15,
      carbs: 12,
      fat: 10,
    }),
  ],
  quickAdd: [
    { id: 'water', label: 'Water', icon: 'droplet' },
    { id: 'protein', label: 'Protein', icon: 'water' },
    { id: 'fruit', label: 'Fruit', icon: 'apple' },
    { id: 'coffee', label: 'Coffee', icon: 'coffee' },
  ],
  weeklyCalories: [
    { day: 'M', kcal: 2180 },
    { day: 'T', kcal: 2240 },
    { day: 'W', kcal: 1980 },
    { day: 'T', kcal: 2410 },
    { day: 'F', kcal: 2105 },
    { day: 'S', kcal: 1850 },
  ],
};

export const MEAL_ICON: Record<MealSlot, IconName> = {
  breakfast: 'egg',
  lunch: 'sandwich',
  dinner: 'utensils',
  snacks: 'popcorn',
};

export function macroSegments(totals: FoodData['macroTotals']): DonutSegment[] {
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
    { key: 'fats', label: 'Fats', value: totals.fat, accent: 'pinkish', detail: `${totals.fat} g` },
  ];
}

export function mealSubtitle(meal: Meal): string {
  return `${meal.kcal} kcal • ${meal.protein}g protein • ${meal.carbs}g carbs • ${meal.fat}g fat`;
}
