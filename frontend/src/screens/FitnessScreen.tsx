import { useCallback } from 'react';
import { Clock, Plus, Zap } from 'lucide-react';
import { Page } from '../components/layout/Page';
import { AppIcon, IconButton, StatCard } from '../components/ui';
import { ActiveWorkoutCard, Feed, WorkoutCategoryGrid } from '../components/domain';
import { api } from '../lib/api';
import { useApiData } from '../lib/hooks/useApiData';
import { ScreenStates } from './ScreenStates';
import type { FitnessData } from '../types';

export function FitnessScreen() {
  const fetcher = useCallback(
    (signal: AbortSignal) => api.get<FitnessData>('/fitness', { signal }),
    []
  );
  const result = useApiData(fetcher);

  return (
    <ScreenStates {...result} loadingTitle="Loading fitness…">
      {(data) => <FitnessScreenBody data={data} />}
    </ScreenStates>
  );
}

interface FitnessScreenBodyProps {
  data: FitnessData;
}

function FitnessScreenBody({ data }: FitnessScreenBodyProps) {
  return (
    <Page
      title={
        <span className="flex items-center gap-2">
          <AppIcon name="dumbbell" size={22} className="text-forest-bright" /> Fitness
        </span>
      }
      subtitle="Workout planner & tracker"
      headerAction={
        <IconButton label="Add workout" accent="leaf">
          <Plus size={20} />
        </IconButton>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="This week"
          value={`${data.weekMinutes.value} min`}
          hint={data.weekMinutes.hint}
          icon={<Clock size={16} />}
          accent="sea"
        />
        <StatCard
          label="This month"
          value={`${data.monthMinutes.value.toLocaleString()} min`}
          hint={data.monthMinutes.hint}
          icon={<Zap size={16} />}
          accent="forest"
        />
      </div>

      <ActiveWorkoutCard active={data.active} />

      <WorkoutCategoryGrid categories={data.categories} />

      <Feed
        title="Workout History"
        actionLabel="View all"
        onAction={() => {}}
        items={data.history.map((entry) => ({
          id: entry.id,
          icon: <AppIcon name={entry.icon} size={20} />,
          title: entry.title,
          subtitle: entry.subtitle,
          trailing: `${entry.headline} · ${entry.detail}`,
          accent: entry.accent,
        }))}
        emptyTitle="No workouts logged"
        emptyDescription="Record a workout to start tracking progress."
      />
    </Page>
  );
}
