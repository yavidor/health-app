import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Page } from '../components/layout/Page';
import { DataBoundary } from '../components/layout';
import { AppIcon, Card, CardHeader, IconButton, SegmentedControl } from '../components/ui';
import { ChartCard, GroupedBarChart, MacroDonut } from '../components/charts';
import {
  DailyTotalCard,
  Feed,
  MealSlotGrid,
  MEAL_ICON,
  MEAL_SLOTS,
  QuickAdd,
} from '../components/domain';
import { macroSegments, mealSubtitle } from '../lib/macros';
import { useFoodData } from '../lib/hooks';
import type { FoodData } from '../types';

const DAY_TABS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
] as const;

type DayTab = (typeof DAY_TABS)[number]['value'];

export interface FoodPageProps {
  data?: FoodData;
}

export function FoodPage({ data: propData }: FoodPageProps = {}) {
  const result = useFoodData({ initialData: propData });
  const [day, setDay] = useState<DayTab>('today');

  return (
    <Page
      title={
        <span className="flex items-center gap-2">
          <AppIcon name="salad" size={22} className="text-forest-bright" /> Food &amp; Macros
        </span>
      }
      subtitle="Track what you eat"
      headerAside={
        result.data ? (
          <div className="text-right">
            <p className="text-forest-dark text-sm font-semibold">
              {result.data.goal.target.toLocaleString()}
            </p>
            <p className="text-sea-text text-xs">Daily Goal</p>
          </div>
        ) : null
      }
      headerAction={
        <IconButton label="Add meal" accent="leaf">
          <Plus size={20} />
        </IconButton>
      }
    >
      <DataBoundary {...result} loadingTitle="Loading food…">
        {(data) => {
          const { goal, macroTotals } = data;
          const proteinPct = Math.round((goal.consumed / goal.target) * 100);
          const consumedKcal = data.meals.reduce((sum, entry) => sum + entry.kcal, 0);

          return (
            <>
              <DailyTotalCard
                heading="Logged today"
                value={`${consumedKcal}`}
                target={`/ ${goal.target.toLocaleString()}`}
                unit="kcal"
                rings={[
                  {
                    label: 'Calories',
                    value: proteinPct,
                    max: 100,
                    display: `${proteinPct}%`,
                    accent: 'sea',
                  },
                  {
                    label: 'Protein',
                    value: macroTotals.protein,
                    max: 210,
                    display: `${macroTotals.protein}g`,
                    accent: 'forest',
                  },
                ]}
              />

              <MealSlotGrid />

              <Card className="space-y-3 p-4">
                <CardHeader
                  title="Today"
                  action={<button className="text-leaf-dark text-sm font-medium">View all</button>}
                />
                <SegmentedControl options={DAY_TABS} value={day} onChange={setDay} />
              </Card>

              <Feed
                items={data.meals.map((entry) => ({
                  id: entry.id,
                  icon: MEAL_ICON[entry.slot],
                  title: entry.title,
                  subtitle: mealSubtitle(entry),
                  trailing: entry.time,
                  accent: MEAL_SLOTS.find((slot) => slot.id === entry.slot)?.accent,
                }))}
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
            </>
          );
        }}
      </DataBoundary>
    </Page>
  );
}
