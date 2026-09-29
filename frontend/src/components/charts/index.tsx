export { MacroDonut } from './MacroDonut';
export type { DonutSegment, MacroDonutProps } from './MacroDonut';

import type { ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardHeader } from '../ui/Card';
import { ACCENT_SOLID, type Accent } from '../ui/accents';

const AXIS = { stroke: '#0a3c45', fontSize: 11, opacity: 0.7 } as const;

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  /** Rendered instead of a chart, e.g. an EmptyState. */
  empty?: ReactNode;
  children: ReactNode;
  height?: number;
  className?: string;
}

/** Card + responsive sizing shared by every chart on the app. */
export function ChartCard({
  title,
  subtitle,
  action,
  empty,
  children,
  height = 240,
  className,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <div className="space-y-3 p-4">
        <CardHeader title={title} subtitle={subtitle} action={action} />
        {empty ?? <div style={{ height }}>{children}</div>}
      </div>
    </Card>
  );
}

export interface Series {
  key: string;
  label: string;
  accent: Accent;
}

export type ChartDatum = Record<string, string | number>;

interface BaseChartProps {
  data: readonly ChartDatum[];
  xKey: string;
  series: readonly Series[];
  showLegend?: boolean;
  yLabel?: string;
}

function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: '1px solid rgba(14,52,31,0.1)',
      fontSize: 12,
    },
  };
}

function axis(xKey: string) {
  return { dataKey: xKey, ...AXIS, tickLine: false, axisLine: false };
}

function valueAxis(yLabel?: string) {
  return {
    ...AXIS,
    tickLine: false,
    axisLine: false,
    label: yLabel ? { value: yLabel, fontSize: 11 } : undefined,
  };
}

export type TrendChartProps = BaseChartProps & { variant?: 'line' | 'area' };

export function TrendChart({
  data,
  xKey,
  series,
  variant = 'area',
  showLegend = true,
  yLabel,
}: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {variant === 'line' ? (
        <LineChart data={data as ChartDatum[]} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,52,31,0.08)" vertical={false} />
          <XAxis {...axis(xKey)} />
          <YAxis {...valueAxis(yLabel)} />
          <Tooltip {...tooltipStyle()} />
          {showLegend ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
          {series.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stroke={ACCENT_SOLID[s.accent]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      ) : (
        <AreaChart data={data as ChartDatum[]} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT_SOLID[s.accent]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={ACCENT_SOLID[s.accent]} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,52,31,0.08)" vertical={false} />
          <XAxis {...axis(xKey)} />
          <YAxis {...valueAxis(yLabel)} />
          <Tooltip {...tooltipStyle()} />
          {showLegend ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
          {series.map((s) => (
            <Area
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stroke={ACCENT_SOLID[s.accent]}
              strokeWidth={2}
              fill={`url(#fill-${s.key})`}
            />
          ))}
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}

export type GroupedBarChartProps = BaseChartProps;

export function GroupedBarChart({
  data,
  xKey,
  series,
  showLegend = true,
  yLabel,
}: GroupedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data as ChartDatum[]} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,52,31,0.08)" vertical={false} />
        <XAxis {...axis(xKey)} />
        <YAxis {...valueAxis(yLabel)} />
        <Tooltip {...tooltipStyle()} cursor={{ fill: 'rgba(14,52,31,0.04)' }} />
        {showLegend ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={ACCENT_SOLID[s.accent]}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
