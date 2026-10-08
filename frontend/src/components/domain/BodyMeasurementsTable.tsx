import { Plus } from 'lucide-react';
import { AppIcon, Button, Card, CardHeader } from '../ui';
import type { Measurement } from '../../types';

export interface BodyMeasurementsTableProps {
  measurements: readonly Measurement[];
  onLog?: () => void;
}

export function BodyMeasurementsTable({ measurements, onLog }: BodyMeasurementsTableProps) {
  return (
    <Card className="space-y-3 p-4">
      <CardHeader
        title="Body Measurements"
        action={
          <Button size="sm" variant="outline" leadingIcon={<Plus size={14} />} onClick={onLog}>
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
          {measurements.map((row) => (
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
  );
}
