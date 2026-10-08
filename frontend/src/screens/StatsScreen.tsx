import { useCallback, useState } from 'react';
import { Download, Lock } from 'lucide-react';
import { Page } from '../components/layout/Page';
import { AppIcon, Button, Card, SegmentedControl, StatCard } from '../components/ui';
import { ChartCard, MacroDonut, TrendChart } from '../components/charts';
import { BodyMeasurementsTable, CorrelationInsight } from '../components/domain';
import { statsMacroSegments } from '../lib/macros';
import { api } from '../lib/api';
import { useApiData } from '../lib/hooks/useApiData';
import { ScreenStates } from './ScreenStates';
import type { RangeKey, StatsData } from '../types';

const RANGES = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
] as const satisfies readonly { value: RangeKey; label: string }[];

const DEFAULT_RANGE: RangeKey = '30d';

export function StatsScreen() {
  const [range, setRange] = useState<RangeKey>(DEFAULT_RANGE);

  // `range` is a dependency, so switching the range refetches.
  const fetcher = useCallback(
    (signal: AbortSignal) => api.get<StatsData>('/stats', { params: { range }, signal }),
    [range]
  );
  const result = useApiData(fetcher);

  return (
    <ScreenStates {...result} loadingTitle="Loading stats…">
      {(data) => <StatsScreenBody data={data} selection={{ range, onRangeChange: setRange }} />}
    </ScreenStates>
  );
}

/** The selected Range and how to change it, as one value. */
interface RangeSelection {
  range: RangeKey;
  onRangeChange: (range: RangeKey) => void;
}

interface StatsScreenBodyProps {
  data: StatsData;
  selection: RangeSelection;
}

function StatsScreenBody({ data, selection }: StatsScreenBodyProps) {
  const { range, onRangeChange } = selection;
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
          <SegmentedControl options={RANGES} value={range} onChange={onRangeChange} />
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
        <CorrelationInsight insight={correlation.insight} correlation={correlation.correlation} />
      </ChartCard>
      <BodyMeasurementsTable measurements={data.measurements} />
      <ChartCard title="Macro Balance" subtitle={`${macroTotals.kcal.toLocaleString()} kcal avg`}>
        <MacroDonut
          segments={statsMacroSegments(macroTotals)}
          centerLabel={`${macroTotals.kcal.toLocaleString()}`}
          centerDetail="kcal/day"
        />
      </ChartCard>
      <Card className="flex items-center justify-between p-4">
        <div>
          <h3 className="text-forest-dark text-sm font-semibold">Local Storage</h3>
          <p className="text-sea-text mt-0.5 text-xs">
            {data.storage.entries} log entries • {data.storage.workouts} workouts
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" leadingIcon={<Download size={14} />}>
            Export JSON
          </Button>
          <Button size="sm" variant="ghost" leadingIcon={<Lock size={14} />} accent="leaf">
            Backup
          </Button>
        </div>
      </Card>{' '}
    </Page>
  );
}
