import { useState } from 'react';
import { Download, Lightbulb, Lock, Plus } from 'lucide-react';
import { Page } from '../../components/layout/Page';
import { AppIcon, Button, Card, CardHeader, SegmentedControl, StatCard } from '../../components/ui';
import { ChartCard, MacroDonut, TrendChart } from '../../components/charts';
import {
  STATS_FIXTURE,
  RANGES,
  statsMacroSegments,
  type RangeKey,
  type StatsData,
} from './stats.data';

export interface StatsPageProps {
  data?: StatsData;
}

export function StatsPage({ data = STATS_FIXTURE }: StatsPageProps) {
  const [range, setRange] = useState<RangeKey>(data.range);
  const { weightTrend, correlation, macroTotals } = data;

  return (
    <Page
      title={
        <span className="flex items-center gap-2">
          <AppIcon name="chart" size={22} className="text-forest-bright" /> Stats
        </span>
      }
      subtitle="Cross-metric trends"
      headerAside={
        <div className="w-48">
          <SegmentedControl options={RANGES} value={range} onChange={setRange} />
        </div>
      }
    >
      <ChartCard
        title="Weight Trend"
        subtitle={`${range.toUpperCase()} • daily weigh-ins`}
        action={
          <span className="text-forest-dark text-sm font-semibold">
            {weightTrend.changeLabel}
            <span className="text-sea-text ml-2 text-xs font-normal">now</span>
          </span>
        }
      >
        <TrendChart
          data={weightTrend.series}
          xKey="week"
          series={[{ key: 'weight', label: 'Weight (kg)', accent: 'sea' }]}
          yLabel="kg"
          showLegend={false}
        />
      </ChartCard>

      <div className="grid grid-cols-2 gap-3">
        {data.summary.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            icon={<AppIcon name={stat.icon} size={16} />}
            accent={stat.direction === 'up' ? 'forest' : 'sea'}
          >
            <span
              className={`text-xs font-medium ${stat.positive ? 'text-forest-bright' : 'text-pinkish-text'}`}
            >
              {stat.delta}
            </span>
          </StatCard>
        ))}
      </div>

      <ChartCard
        title="Calories vs. Weight"
        subtitle="Calories (left) · Weight (right)"
        action={
          <Button variant="ghost" size="sm" accent="leaf">
            Full screen
          </Button>
        }
      >
        <TrendChart
          data={correlation.series}
          xKey="week"
          series={[
            { key: 'calories', label: 'Calories', accent: 'pinkish' },
            { key: 'weight', label: 'Weight (kg)', accent: 'sea' },
          ]}
        />
        <div className="rounded-tile bg-leaf-bright mt-3 flex gap-2 p-3">
          <Lightbulb className="text-forest-bright shrink-0" size={18} />
          <div>
            <p className="text-forest-dark text-sm font-semibold">Strong negative correlation</p>
            <p className="text-sea-text mt-0.5 text-xs">
              {correlation.insight} Correlation:{' '}
              <span className="font-semibold">{correlation.correlation}</span>
            </p>
          </div>
        </div>
      </ChartCard>

      <Card className="space-y-3 p-4">
        <CardHeader
          title="Body Measurements"
          action={
            <Button size="sm" variant="outline" leadingIcon={<Plus size={14} />}>
              Log
            </Button>
          }
        />
        <table className="w-full text-sm">
          <thead>
            <tr className="text-sea-text/70 text-left text-xs">
              <th className="pb-2 font-medium">Metric</th>
              <th className="pb-2 font-medium">Latest</th>
              <th className="pb-2 text-right font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {data.measurements.map((row) => (
              <tr key={row.id} className="border-forest-dark/5 border-t">
                <td className="py-2">
                  <AppIcon
                    name={row.icon}
                    size={14}
                    className="text-sea-text mr-2 inline-block align-[-2px]"
                  />
                  <span className="text-forest-dark font-medium">{row.label}</span>
                </td>
                <td className="text-sea-text py-2 tabular-nums">{row.latest}</td>
                <td
                  className={`py-2 text-right font-semibold tabular-nums ${
                    row.change.startsWith('+') ? 'text-sea-text' : 'text-forest-bright'
                  }`}
                >
                  {row.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ChartCard title="Macro Balance" subtitle={`${macroTotals.kcal.toLocaleString()} kcal avg`}>
        <MacroDonut
          segments={statsMacroSegments(macroTotals)}
          centerLabel={`${macroTotals.kcal.toLocaleString()}`}
          centerDetail="kcal avg"
        />
      </ChartCard>

      <Card className="flex items-center gap-3 p-4">
        <span className="rounded-tile bg-leaf-bright text-forest-bright flex h-11 w-11 items-center justify-center">
          <Lock size={18} />
        </span>
        <div className="flex-1">
          <p className="text-forest-dark text-sm font-semibold">Your data stays local</p>
          <p className="text-sea-text text-xs">
            {data.storage.entries.toLocaleString()} entries • {data.storage.workouts} workouts
          </p>
        </div>
        <Button size="sm" variant="outline" leadingIcon={<Download size={14} />}>
          Export
        </Button>
      </Card>
    </Page>
  );
}
