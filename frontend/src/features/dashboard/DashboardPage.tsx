import { useState } from 'react';
import { Check, Flame, Trophy } from 'lucide-react';
import { Page } from '../../components/layout/Page';
import {
  Badge,
  Card,
  CardHeader,
  IconButton,
  ProgressBar,
  AppIcon,
  QuickActionGrid,
  StatCard,
} from '../../components/ui';
import { DailyTotalCard } from '../../components/domain/DailyTotalCard';
import { Feed } from '../../components/domain/Feed';
import { DASHBOARD_FIXTURE, type DashboardData } from './dashboard.data';

export interface DashboardPageProps {
  /** Injected so the page can be driven by a store later without touching it. */
  data?: DashboardData;
}

export function DashboardPage({ data = DASHBOARD_FIXTURE }: DashboardPageProps) {
  const [completed, setCompleted] = useState<readonly string[]>([]);

  const toggleQuest = (id: string) =>
    setCompleted((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <Page
      title={
        <span className="flex items-center gap-2">
          <AppIcon name="heart" size={22} className="text-forest-bright" /> Health App
        </span>
      }
      subtitle={`Good morning, ${data.greeting.name}!`}
      headerAside={
        <span className="bg-leaf-text flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-white">
          <Flame size={14} /> {data.greeting.streakDays} day
        </span>
      }
    >
      <DailyTotalCard
        heading="Daily Total"
        value={`${data.dailyTotal.consumed}`}
        target={`/ ${data.dailyTotal.goal.toLocaleString()} kcal`}
        unit="kcal"
        rings={data.rings.map((ring) => ({
          label: ring.label,
          value: ring.pct,
          max: 100,
          display: ring.display,
          accent: ring.accent,
        }))}
      />

      <section>
        <h2 className="text-forest-dark mb-3 text-lg font-semibold">Quick Actions</h2>
        <QuickActionGrid
          items={data.quickActions.map((action) => ({
            value: action.id,
            label: action.label,
            icon: <AppIcon name={action.icon} size={20} />,
          }))}
          onSelect={() => {}}
        />
      </section>

      <Feed
        title="Today's Quests"
        actionLabel="View all"
        onAction={() => {}}
        bordered
        items={data.quests.map((quest) => ({
          ...quest,
          icon: <AppIcon name={quest.icon} size={20} />,
        }))}
        emptyTitle="No quests left"
        emptyDescription="Add goals to earn squad points."
        renderRowAction={(item) => {
          const isDone = completed.includes(item.id);
          return (
            <IconButton
              label={isDone ? `Undo ${item.title}` : `Complete ${item.title}`}
              accent={item.accent}
              onClick={() => toggleQuest(item.id)}
            >
              {isDone ? <Check size={20} /> : null}
            </IconButton>
          );
        }}
      />

      <Feed
        title="Recent Activity"
        actionLabel="See all"
        onAction={() => {}}
        items={data.activity.map((entry) => ({
          id: entry.id,
          icon: <AppIcon name={entry.icon} size={20} />,
          title: entry.title,
          subtitle: entry.subtitle,
          trailing: entry.time,
          accent: entry.accent,
        }))}
        emptyTitle="No activity logged"
      />

      <Card className="space-y-4 p-4">
        <CardHeader title="Macros" subtitle="Today's progress" />
        {data.macros.map((macro) => (
          <ProgressBar
            key={macro.label}
            label={macro.label}
            value={macro.value}
            max={macro.max}
            accent={macro.accent}
            caption={macro.label}
            showValue
          />
        ))}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Squad rank"
          value={`#${data.squadRank}`}
          icon={<Trophy size={16} />}
          accent="leaf"
        >
          <Badge tone="accent" accent="leaf">
            +{data.squadPoints} pts
          </Badge>
        </StatCard>
        <StatCard
          label="Quests done"
          value={`${completed.length}/${data.quests.length}`}
          accent="forest"
        />
      </div>
    </Page>
  );
}
