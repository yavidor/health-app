import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ACCENT_HEX, ACCENT_TEXT, type Accent } from '../ui/accents';

export interface DonutSegment {
  key: string;
  label: string;
  value: number;
  accent: Accent;
  /** Optional detail shown in the legend, e.g. `164 g`. */
  detail?: string;
}

export interface MacroDonutProps {
  segments: readonly DonutSegment[];
  /** Rendered in the hole. Defaults to the sum of the segments. */
  centerLabel?: string;
  centerDetail?: string;
  size?: number;
}

export function MacroDonut({ segments, centerLabel, centerDetail, size = 160 }: MacroDonutProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments as unknown as Record<string, string | number>[]}
              dataKey="value"
              nameKey="label"
              innerRadius="60%"
              outerRadius="95%"
              paddingAngle={2}
              stroke="none"
            >
              {segments.map((segment) => (
                <Cell key={segment.key} fill={ACCENT_HEX[segment.accent]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(14,52,31,0.1)',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-forest-dark text-xl font-bold tabular-nums">
            {centerLabel ?? total}
          </span>
          {centerDetail ? <span className="text-sea-text text-xs">{centerDetail}</span> : null}
        </div>
      </div>

      <ul className="w-full space-y-2">
        {segments.map((segment) => {
          const pct = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <li key={segment.key} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENT_HEX[segment.accent] }}
              />
              <span className="text-sea-text flex-1">{segment.label}</span>
              <span className="text-sea-text/70 text-xs">{segment.detail ?? `${pct}%`}</span>
              <span
                className={`w-10 text-right font-semibold tabular-nums ${ACCENT_TEXT[segment.accent]}`}
              >
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
