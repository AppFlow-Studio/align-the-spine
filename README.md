# Align the Spine

Marketing site for Align the Spine, built with Next.js (App Router) + TypeScript + Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript, no emit
- `npm run format` / `npm run format:check` — Prettier (with import sorting)

## Project structure

- `app/` — routes (App Router)
- `components/ui/` — low-level, unstyled-opinion UI primitives
- `components/layout/` — page chrome (header, footer, shells)
- `components/sections/` — page-section-level components
- `content/` — structured content consumed by pages/sections
- `lib/` — shared utilities

Import these via the `@/` path alias, e.g. `import { Button } from "@/components/ui/button"`.

## CI / Deployment

- GitHub Actions runs typecheck, lint, and build on every PR (`.github/workflows/ci.yml`).
- Vercel is connected to this repo for automatic preview deployments on PRs and production deploys on `main`.

## Git hooks

Husky runs `lint-staged` on `git commit`, which auto-fixes ESLint issues and formats staged files with Prettier.
