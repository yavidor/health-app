# Frontend Architecture

How the React app is organised, and how to add a Screen.

## Layers

```
frontend/
  src/
    app/            application wiring — routing, chrome config, route registry
      router.ts     hash router (useRouteId / navigate)
      routes.tsx    ROUTES: the single source of truth for navigation
      config.tsx    brand + sidebar footer, identical on every Screen
    screens/        one module per Screen — see below
    components/
      ui/           generic primitives — Button, Card, Progress, ListRow, Badge…
      layout/       app frame — AppShell, Page, PageHeader, TabBar, PageLoader
      domain/       reusable domain widgets — DailyTotalCard, Feed, QuickAdd
      charts/       Recharts wrappers with shared theming — ChartCard, TrendChart,
                    GroupedBarChart, MacroDonut
    lib/            ApiClient, the fetch lifecycle hook, macros, cn
```

Dependency direction: `app` → `screens` → `components` → `lib`. Nothing in
`components/` imports from `screens/`.

## Screens

A **Screen** is one destination — Food, Stats, Squad, Dashboard, Fitness. See
`docs/agents/GLOSSARY.md`. Each Screen is one module that owns everything a User
sees on arriving there:

- the header and page frame, so nothing outside wraps a Screen in one,
- fetching its own data,
- the loading, error, and empty states (`ScreenStates`),
- the reshaping of server data into the shapes the UI modules ask for,
- any local UI state, such as the selected range or which Quests are complete.

Its interface is the component itself: `<FoodScreen />`, zero props. Callers and
tests cross the same seam — the rendered output. There is no `data?` prop and no
injected loader; see ADR-0003 for why, and for the failure it is meant to prevent.

All Screens follow the same shape, so read one before writing another:

```
export function FoodScreen() {
  const [day, setDay] = useState<DayTab>('today');
  const fetcher = useCallback((signal: AbortSignal) => api.get<FoodData>('/food', { signal }), []);
  const result = useApiData(fetcher);

  return (
    <ScreenStates {...result} loadingTitle="Loading food…">
      {(data) => <FoodScreenBody data={data} selection={{ day, onDayChange: setDay }} />}
    </ScreenStates>
  );
}
```

Conventions every Screen follows:

- Local state lives in the Screen, above `ScreenStates`, and reaches the body as one
  `selection` object rather than a spread of related props.
- Reshaping lives in private functions at the bottom of the same file. Nothing
  exports them — a test that needs to reach them is telling you the reshaping
  wants its own module.
- The header renders only inside the success branch, so nothing reads
  partially-loaded data.
- `ScreenStates` prefers data over error: a cold failure shows the error, a failed
  background refresh keeps the data already on screen.

If a Screen passes roughly 250 lines, or two Screens need the same reshaping,
extract at that point. A failed extraction means the seam was in the wrong place.

## Adding a Screen

1. Create `frontend/src/screens/<Name>Screen.tsx`, following an existing Screen.
2. Add `<Name>Screen.test.tsx` beside it (see Testing).
3. Add one entry to `ROUTES` in `frontend/src/app/routes.tsx`:

    ```tsx
    const NameScreen = lazy(() =>
      import('../screens/NameScreen').then((m) => ({ default: m.NameScreen }))
    );

    { id: 'name', label: 'Name', icon: <Icon size={20} />, component: NameScreen },
    ```

That is the whole change. The tab bar, desktop sidebar and router all read
`ROUTES`, and the Screen is code-split automatically.

## Checks

`make check` runs typecheck, lint, and tests for both halves of the project. A
pre-commit hook runs the same set on whatever is staged; see
`setup-git-hooks.sh` to enable it after cloning.

## Testing

The seam is the rendered Screen: stub the network, render, assert on what a User
ends up seeing. Do not test the loader contract — `useApiData` is already covered
in `lib/hooks/hooks.test.ts` — and do not reach past the render to test a
reshaping function.

Vitest runs in the DOM environment by default. Shared helpers live in
`src/screens/screenTestUtils.ts`: `stubNetwork`, `pendingNetwork`,
`failingNetwork`, `jsonResponse`, and `fixtures` (the dev/QA fixture data, asserted
against each Screen's data interface so drift is a build error).

Cover three states per Screen: loading, error visible rather than silently
replaced, and success including the derived numbers a User actually reads.

## Conventions

- **No hardcoded colours.** Use the palette tokens from
  `docs/humans/design/colors.md`, exposed as Tailwind v4 `@theme` values in
  `src/index.css` (`bg-forest-text`, `text-sea-text`, `bg-mist`, …).
- **Colour is a prop.** Every visual component takes `accent?: Accent`
  (`'forest' | 'sea' | 'leaf' | 'pinkish'`) instead of baking a colour in.
- **`App.tsx` only resolves a route and renders it.** Everything else belongs to a
  Screen.
- **Lucide for icons, emoji for avatars/illustrations** only.
- **Both tsconfigs are `strict`.**
- **Fixtures reach Screen tests only through `screenTestUtils.ts`,** which asserts
  them against each Screen's data interface. A direct `mockData.json` import is an
  ESLint error.

## Known gaps

- `types/index.ts` imports `IconName`, `Accent` and `ChartDatum` from
  `components/`, so Tailwind accent names and Lucide icon names leak into the wire
  vocabulary the server and fixtures must speak.
- Derived numbers have no single owner: the macro share percentage is computed
  twice, and its divide-by-zero guard is written twice. `lib/format.ts` was deleted
  because nothing called it, which removes the duplication but not the problem.
- The hardcoded protein target in `FoodScreen.tsx` disagrees with the Dashboard's
  server-sent ring percentages. Recorded in ADR-0003 (Unresolved) and in a TODO at
  the site; one of the two is wrong and it is a data-shape question.
- Several `onSelect`/`onAdd` handlers are no-ops pending real mutations.
- Hash routing only (no history routing); fine for the static PWA deployment but
  URLs are not clean.