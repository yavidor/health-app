# Screens own their data; nothing is injected

A Screen fetches its own data and reshapes it for display. Its interface is the
component itself: `<FoodScreen />`, zero props. The loader is an internal detail,
never a parameter, and callers and tests cross the same seam — the rendered output.

## Consequences

- **No `data?` prop and no `initialData`.** There is one way for data to reach a
  Screen: it fetches. A second entry point added "for testability" is a regression,
  not a shortcut — tests stub `fetch` (or run `mockApiPlugin`) instead.
- **Tests render the Screen.** If a test needs to reach past the rendered output to
  assert on a reshaping function, that function wants its own module; adding a prop
  to get at it is not the answer.
- **`useApiData` is an internal seam, not a caller-facing module.** Callers must not
  learn the fetcher's contract — that it takes an `AbortSignal`, that it must honour
  it, or that it must be referentially stable to avoid refetching. A Screen builds
  its own fetcher internally, where those rules are private.
- **The header renders only in the success branch.** Loading, error, and empty
  states belong to the Screen, so no caller reads partially-loaded data to fill in a
  header. All five Screens behave the same way; a Screen whose header renders during
  loading is a bug, not a variant.

## Unresolved

- **Who owns ring percentages.** The Dashboard's rings arrive from the server already
  expressed as percentages. The Food Screen derives its own percentage against a hardcoded
  protein target in grams per day. One of the two is wrong, and this record deliberately does
  not guess: it is a question about what the server sends, not about module shape. Fixing it
  locally in the Screen would make the inconsistency permanent. Tracked in #16.
- **Derived numbers have no single owner yet.** The macro share percentage is computed twice
  over the same triple, and its divide-by-zero guard is written twice in two different forms.
  That is a separate piece of work, not this one.