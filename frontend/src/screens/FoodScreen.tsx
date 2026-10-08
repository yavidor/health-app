import { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import { Page } from '../components/layout/Page';
import { AppIcon, Card, CardHeader, IconButton, SegmentedControl } from '../components/ui';
import { ChartCard, GroupedBarChart, MacroDonut } from '../components/charts';
import {
  DailyTotalCard,
  Feed,
  MealSlotGrid,
  MEAL_ICON,
  MEAL_SLOTS,
  QuickAdd,
  type DailyTotalRing,
} from '../components/domain';
import { macroSegments, mealSubtitle } from '../lib/macros';
import { api } from '../lib/api';
import { useApiData } from '../lib/hooks/useApiData';
import { ScreenStates } from './ScreenStates';
import type { FoodData } from '../types';

const DAY_TABS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
] as const;

type DayTab = (typeof DAY_TABS)[number]['value'];

export function FoodScreen() {
  const [day, setDay] = useState<DayTab>('today');
  const fetcher = useCallback((signal: AbortSignal) => api.get<FoodData>('/food', { signal }), []);
  const result = useApiData(fetcher);

  return (
    <ScreenStates {...result} loadingTitle="Loading food…">
      {(data) => <FoodScreenBody data={data} selection={{ day, onDayChange: setDay }} />}
    </ScreenStates>
  );
}

/** The selected Day and how to change it, as one value. */
interface DaySelection {
  day: DayTab;
  onDayChange: (day: DayTab) => void;
}

interface FoodScreenBodyProps {
  data: FoodData;
  selection: DaySelection;
}

function FoodScreenBody({ data, selection }: FoodScreenBodyProps) {
  const { day, onDayChange } = selection;
  const { goal, macroTotals } = data;
  const consumedKcal = data.meals.reduce((sum, entry) => sum + entry.kcal, 0);

  return (
    <Page
      title={
        <span className="flex items-center gap-2">
          <AppIcon name="salad" size={22} className="text-forest-bright" /> Food &amp; Macros
        </span>
      }
      subtitle="Track what you eat"
      headerAside={
        <div className="text-right">
          <p className="text-forest-dark text-sm font-semibold">{goal.target.toLocaleString()}</p>
          <p className="text-sea-text text-xs">Daily Goal</p>
        </div>
      }
      headerAction={
        <IconButton label="Add meal" accent="leaf">
          <Plus size={20} />
        </IconButton>
      }
    >
      <DailyTotalCard
        heading="Logged today"
        value={`${consumedKcal}`}
        target={`/ ${goal.target.toLocaleString()}`}
        unit="kcal"
        rings={foodRings(goal, macroTotals)}
      />

      <MealSlotGrid />

      <Card className="space-y-3 p-4">
        <CardHeader
          title="Today"
          action={<button className="text-leaf-dark text-sm font-medium">View all</button>}
        />
        <SegmentedControl options={DAY_TABS} value={day} onChange={onDayChange} />
      </Card>

      <Feed
        items={data.meals.map(mealFeedItem)}
        emptyTitle="No meals logged"
        emptyDescription="Log a meal to see your macro balance."
      />

      <section>
        <h2 className="text-forest-dark mb-3 text-lg font-semibold">Quick Add</h2>
        <QuickAdd items={data.quickAdd.map((item) => ({ ...item, onAdd: () => {} }))} />
      </section>

      <ChartCard title="Macro Balance" subtitle="Share of daily calories">
        <MacroDonut
          segments={macroSegments(macroTotals)}
          centerLabel={consumedKcal.toLocaleString()}
          centerDetail="kcal"
        />
      </ChartCard>

      <ChartCard title="Weekly Comparison" subtitle="Calories per day">
        <GroupedBarChart
          data={data.weeklyCalories}
          xKey="day"
          series={[{ key: 'kcal', label: 'Calories', accent: 'sea' }]}
          showLegend={false}
        />
      </ChartCard>
    </Page>
  );
}

function foodRings(goal: FoodData['goal'], macroTotals: FoodData['macroTotals']): DailyTotalRing[] {
  // TODO: the protein target below is hardcoded in grams per day, while the
  // Dashboard's rings arrive from the server already expressed as percentages.
  // Food derives its own percentage against this target; one of the two is
  // wrong. Tracked in ADR-0003 (Unresolved) and #17 — do not "fix" it locally.
  const PROTEIN_TARGET_G = 210;
  const caloriePct = Math.round((goal.consumed / goal.target) * 100);

  return [
    { label: 'Calories', value: caloriePct, max: 100, display: `${caloriePct}%`, accent: 'sea' },
    {
      label: 'Protein',
      value: macroTotals.protein,
      max: PROTEIN_TARGET_G,
      display: `${macroTotals.protein}g`,
      accent: 'forest',
    },
  ];
}

function mealFeedItem(entry: FoodData['meals'][number]) {
  return {
    id: entry.id,
    icon: MEAL_ICON[entry.slot],
    title: entry.title,
    subtitle: mealSubtitle(entry),
    trailing: entry.time,
    accent: MEAL_SLOTS.find((slot) => slot.id === entry.slot)?.accent,
  };
}
