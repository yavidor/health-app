import { Clock, Plus, Zap } from 'lucide-react';
import { Page } from '../../components/layout/Page';
import { Badge, Card, IconButton, ProgressBar, StatCard } from '../../components/ui';
import { ACCENT_TEXT, ACCENT_TINT } from '../../components/ui/accents';
import { Feed } from '../../components/domain/Feed';
import { FITNESS_FIXTURE, type FitnessData } from './fitness.data';

export interface FitnessPageProps {
  data?: FitnessData;
}

export function FitnessPage({ data = FITNESS_FIXTURE }: FitnessPageProps) {
  const { active } = data;

  return (
    <Page
      title="🏋️ Fitness"
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

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-forest-dark text-lg font-semibold">Active Workout</h2>
          <Badge tone="live">LIVE</Badge>
        </div>
        <Card className="from-forest-text to-sea-text space-y-4 bg-gradient-to-br p-5 text-white [&_span]:text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{active.title}</h3>
              <p className="text-sm text-white/80">
                {active.location} • {active.remainingMinutes} min remaining
              </p>
            </div>
            <span className="rounded-tile flex h-12 w-12 items-center justify-center bg-white/20 text-2xl">
              ⏱️
            </span>
          </div>

          <ProgressBar
            value={active.progressPct}
            accent="leaf"
            className="[&>div:last-child]:bg-white [&>div>div]:bg-white"
          />

          <ul className="space-y-2">
            {active.exercises.map((exercise) => (
              <li key={exercise.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-white/90">
                  🏋️ {exercise.name}
                  <span className="rounded bg-white/30 px-1.5 py-0.5 text-xs">
                    {exercise.setsDone}/{exercise.setsTotal}
                  </span>
                </span>
                <span className="text-white/70">{exercise.load}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section>
        <h2 className="text-forest-dark mb-3 text-lg font-semibold">My Workouts</h2>
        <div className="grid grid-cols-4 gap-2">
          {data.categories.map((category) => (
            <button
              key={category.id}
              className={`rounded-tile shadow-card p-3 text-left transition-all hover:shadow-md ${ACCENT_TINT[category.accent]}`}
            >
              <div
                className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${ACCENT_TEXT[category.accent]}`}
              >
                {category.emoji}
              </div>
              <span className="text-forest-dark text-xs font-medium">{category.label}</span>
            </button>
          ))}
        </div>
      </section>

      <Feed
        title="Workout History"
        actionLabel="View all"
        onAction={() => {}}
        items={data.history.map((entry) => ({
          id: entry.id,
          icon: entry.emoji,
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
