import { Plus, Users } from 'lucide-react';
import { Page } from '../../components/layout/Page';
import { Button, Card, CardHeader, EmptyState, ProgressBar } from '../../components/ui';
import { ACCENT_TEXT } from '../../components/ui/accents';
import { Feed, QuickAdd } from '../../components/domain/Feed';
import { SQUAD_FIXTURE, type SquadData } from './squad.data';

export interface SquadPageProps {
  data?: SquadData;
}

export function SquadPage({ data = SQUAD_FIXTURE }: SquadPageProps) {
  const you = data.leaderboard.find((member) => member.isYou);
  const completedGoals = data.goals.filter((goal) => goal.completed).length;

  return (
    <Page
      title="🎮 Squad"
      subtitle={`${data.members} friends competing`}
      headerAction={
        <Button size="sm" variant="outline" leadingIcon={<Plus size={14} />}>
          Invite
        </Button>
      }
    >
      <Card className="from-leaf-bright to-leaf-text bg-gradient-to-br p-5">
        <div className="flex items-center gap-3">
          <span className="text-forest-dark rounded-full bg-white/60 px-3 py-1 text-sm font-bold">
            #{you?.rank ?? '—'}
          </span>
          <div className="flex-1">
            <p className="text-forest-dark text-xl font-bold">
              {you?.points.toLocaleString() ?? 0} pts
            </p>
            <p className="text-forest-dark/80 text-xs">This week • {you?.delta}</p>
          </div>
          <Users className="text-forest-dark/70" size={28} />
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <CardHeader
          title="Squad Goals"
          subtitle={`${completedGoals}/${data.goals.length} complete today`}
        />
        <ProgressBar
          value={completedGoals}
          max={data.goals.length}
          accent="leaf"
          showValue
          caption="Shared goals"
        />
        <div className="space-y-2 pt-1">
          {data.goals.map((goal) => (
            <div key={goal.id} className="flex items-center gap-2 text-sm">
              <span className="text-forest-dark font-medium">{goal.label}</span>
              <span className="text-sea-text/70 ml-auto text-xs">
                {goal.progress}/{goal.target} · {goal.points} pts
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <CardHeader title="Leaderboard" subtitle="Resets every Monday" />
        {data.leaderboard.length === 0 ? (
          <EmptyState title="No squad yet" description="Invite friends to start competing." />
        ) : (
          <ol className="space-y-2">
            {data.leaderboard.map((member) => (
              <li
                key={member.id}
                className={`rounded-tile flex items-center gap-3 p-2 ${member.isYou ? 'bg-leaf-bright' : ''}`}
              >
                <span className={`w-6 text-center text-sm font-bold ${ACCENT_TEXT[member.accent]}`}>
                  {member.rank}
                </span>
                <span className="text-forest-dark flex-1 text-sm font-medium">
                  {member.name}
                  {member.isYou ? ' (you)' : ''}
                </span>
                <span className="text-sea-text text-xs">{member.delta}</span>
                <span className="text-forest-dark w-16 text-right text-sm font-semibold tabular-nums">
                  {member.points.toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <section>
        <h2 className="text-forest-dark mb-3 text-lg font-semibold">Log to Earn</h2>
        <QuickAdd items={data.quickActions.map((item) => ({ ...item, onAdd: () => {} }))} />
      </section>

      <Feed
        title="Recent Wins"
        items={data.wins.map((win) => ({
          id: win.id,
          icon: win.emoji,
          title: win.title,
          subtitle: win.subtitle,
          accent: win.accent,
        }))}
        emptyTitle="No wins yet"
        emptyDescription="Complete a squad goal to earn points."
      />
    </Page>
  );
}
