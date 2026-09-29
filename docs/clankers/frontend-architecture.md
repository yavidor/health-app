# Frontend Architecture

How the React app is organised, and how to add a page.

## Layers

```
frontend/
  src/
    app/            application wiring — routing, chrome config, route registry
      router.ts     hash router (useRouteId / navigate)
      routes.tsx    ROUTES: the single source of truth for navigation
      config.tsx    brand + sidebar footer, identical on every page
  components/
    ui/           generic primitives — Button, Card, Progress, ListRow, Badge…
    layout/       app frame — AppShell, Page, PageHeader, TabBar, PageLoader
    domain/       reusable domain widgets — DailyTotalCard, Feed, QuickAdd
    charts/       Recharts wrappers with shared theming — ChartCard, TrendChart,
                  GroupedBarChart, MacroDonut
  features/       one folder per page: <Name>Page.tsx + <name>.data.ts
  lib/cn.ts       classname joiner
```

Dependency direction: `app` → `features` → `components` → `lib`. Nothing in
`components/` imports from `features/`.

## Adding a page

1. Create `frontend/src/features/<name>/<Name>Page.tsx`, exporting a component that
   renders `<Page>`. Pass data in as a prop with a fixture default:

    ```tsx
    export function NamePage({ data = NAME_FIXTURE }: NamePageProps) {
      return <Page title="…" subtitle="…">…</Page>;
    }
    ```

2. Add `frontend/src/features/<name>/<name>.data.ts` with the types and a fixture.

3. Add one entry to `ROUTES` in `frontend/src/app/routes.tsx`:

    ```tsx
    const NamePage = lazy(() => import('../features/name/NamePage').then((m) => ({ default: m.NamePage })));

    { id: 'name', label: 'Name', icon: <Icon size={20} />, component: NamePage },
    ```

That is the whole change. The tab bar, desktop sidebar and router all read
`ROUTES`, and the page is code-split automatically.

## Conventions

- **No hardcoded colours.** Use the palette tokens from
  `docs/humans/design/colors.md`, exposed as Tailwind v4 `@theme` values in
  `src/index.css` (`bg-forest-text`, `text-sea-text`, `bg-mist`, …).
- **Colour is a prop.** Every visual component takes `accent?: Accent`
  (`'forest' | 'sea' | 'leaf' | 'pinkish'`) instead of baking a colour in.
- **Pages are dumb.** `App.tsx` only resolves a route and renders it. All
  fixtures are local; wiring them to a store means changing `*.data.ts`
  consumers, not the components.
- **Lucide for icons, emoji for avatars/illustrations** only.

## Known gaps

- No data layer yet — all pages render local fixtures. No API client, no
  JSON export/import, no persistence.
- Several `onSelect`/`onAdd` handlers are no-ops pending that data layer.
- No test runner configured.
- Hash routing only (no history routing); fine for the static PWA deployment
  but URLs are not clean.
