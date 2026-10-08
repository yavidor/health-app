import { Lightbulb } from 'lucide-react';

export interface CorrelationInsightProps {
  insight: string;
  correlation: string;
  title?: string;
}

export function CorrelationInsight({
  insight,
  correlation,
  title = 'Strong negative correlation',
}: CorrelationInsightProps) {
  return (
    <div className="rounded-tile bg-leaf-bright mt-3 flex gap-2 p-3">
      <Lightbulb className="text-forest-bright shrink-0" size={18} />
      <div>
        <p className="text-forest-dark text-sm font-semibold">{title}</p>
        <p className="text-sea-text mt-0.5 text-xs">
          {insight} Correlation: <span className="font-semibold">{correlation}</span>
        </p>
      </div>
    </div>
  );
}
