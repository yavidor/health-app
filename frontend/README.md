# Frontend

Vite + React + TypeScript PWA for the health app.

## Commands

```sh
npm run dev          # start dev server
npm run dev:host     # dev server on the LAN
npm run build        # typecheck + production build
npm run lint         # eslint (flat config, eslint.config.js)
npm run format       # prettier
```

## Linting

ESLint flat config in `eslint.config.js` covers `src/**/*.{ts,tsx}`:
`@eslint/js` recommended, `@typescript-eslint`, `react-hooks` (rules-of-hooks as
error, exhaustive-deps as warn), `no-emoji` and `no-em-dash` (warn), with
`eslint-config-prettier` last to disable stylistic rules.
