import { Plus } from 'lucide-react';
import { Page } from '../components/layout/Page';
import { DataBoundary } from '../components/layout';
import { AppIcon, Button } from '../components/ui';
import {
  Feed,
  QuickAdd,
  SquadGoalsCard,
  SquadHeroCard,
  SquadLeaderboard,
} from '../components/domain';
import { useSquadData } from '../lib/hooks';
import type { SquadData } from '../types';

export interface SquadPageProps {
  data?: SquadData;
}

export function SquadPage({ data: propData }: SquadPageProps = {}) {
  const result = useSquadData({ initialData: propData });

  return (
    <Page
      title={
        <span className="flex items-center gap-2">
          <AppIcon name="gamepad" size={22} className="text-forest-bright" /> Squad
        </span>
      }
      subtitle={result.data ? `${result.data.members} friends competing` : 'Loading your squad…'}
      headerAction={
        <Button size="sm" variant="outline" leadingIcon={<Plus size={14} />}>
          Invite
        </Button>
      }
    >
      <DataBoundary {...result} loadingTitle="Loading squad…">
        {(data) => {
          const you = data.leaderboard.find((member) => member.isYou);

          return (
            <>
              <SquadHeroCard you={you} />

              <SquadGoalsCard goals={data.goals} />

              <SquadLeaderboard members={data.leaderboard} />

              <section>
                <h2 className="text-forest-dark mb-3 text-lg font-semibold">Log to Earn</h2>
                <QuickAdd items={data.quickActions.map((item) => ({ ...item, onAdd: () => {} }))} />
              </section>

              <Feed
                title="Recent Wins"
                items={data.wins.map((win) => ({
                  id: win.id,
                  icon: <AppIcon name={win.icon} size={20} />,
                  title: win.title,
                  subtitle: win.subtitle,
                  accent: win.accent,
                }))}
                emptyTitle="No wins yet"
                emptyDescription="Complete a squad goal to earn points."
              />
            </>
          );
        }}
      </DataBoundary>
    </Page>
  );
}
