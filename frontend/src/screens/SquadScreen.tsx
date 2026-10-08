import { useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Page } from '../components/layout/Page';
import { AppIcon, Button } from '../components/ui';
import {
  Feed,
  QuickAdd,
  SquadGoalsCard,
  SquadHeroCard,
  SquadLeaderboard,
} from '../components/domain';
import { api } from '../lib/api';
import { useApiData } from '../lib/hooks/useApiData';
import { ScreenStates } from './ScreenStates';
import type { SquadData } from '../types';

export function SquadScreen() {
  const fetcher = useCallback(
    (signal: AbortSignal) => api.get<SquadData>('/squad', { signal }),
    []
  );
  const result = useApiData(fetcher);

  return (
    <ScreenStates {...result} loadingTitle="Loading squad…">
      {(data) => <SquadScreenBody data={data} />}
    </ScreenStates>
  );
}

interface SquadScreenBodyProps {
  data: SquadData;
}

function SquadScreenBody({ data }: SquadScreenBodyProps) {
  const you = data.leaderboard.find((member) => member.isYou);

  return (
    <Page
      title={
        <span className="flex items-center gap-2">
          <AppIcon name="gamepad" size={22} className="text-forest-bright" /> Squad
        </span>
      }
      subtitle={`${data.members} friends competing`}
      headerAction={
        <Button size="sm" variant="outline" leadingIcon={<Plus size={14} />}>
          Invite
        </Button>
      }
    >
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
    </Page>
  );
}
