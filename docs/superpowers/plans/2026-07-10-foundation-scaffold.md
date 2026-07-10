# Foundation Scaffold Implementation Plan (ATS-001)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the tooling foundation for the Align the Spine marketing site so every other ticket is unblocked: formatting/lint/import-sort, pre-commit hooks, folder scaffold, and CI + Vercel preview deploys.

**Architecture:** The Next.js App Router project already exists (`create-next-app` output, committed as `d0e84eb`). This plan layers tooling on top of it — it does not re-scaffold Next.js itself. Each task is additive: install a tool, wire its config, verify with a real command, commit.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5 (strict), Tailwind CSS 4, ESLint 9 (flat config), Prettier, `@ianvs/prettier-plugin-sort-imports`, Husky + lint-staged, npm, GitHub Actions.

## Global Constraints

- Package manager is **npm** (user explicitly chose to stay on npm rather than migrate to pnpm; treat `pnpm dev` in the ticket's acceptance criteria as `npm run dev`).
- Path alias is `@/*` → repo root (already configured in `tsconfig.json:21-23`) — this covers `@/components`, `@/content`, `@/lib` without changes.
- `next/font` is already wired in `app/layout.tsx` (Geist Sans/Mono) — no task needed, font _content_ lands in ATS-002.
- Do not modify `app/page.tsx` content beyond what's needed for verification — visual design is out of scope for this ticket.
- Vercel project connection is a manual, one-time dashboard action the user will do themselves (documented at the end of this plan, not a task).

---

### Task 1: Prettier + import sorting, wired into ESLint

**Files:**

- Modify: `package.json`
- Modify: `eslint.config.mjs`
- Create: `.prettierrc.json`
- Create: `.prettierignore`

**Interfaces:**

- Produces: `npm run format`, `npm run format:check` scripts used by Task 2's lint-staged config.

- [ ] **Step 1: Install dependencies**

```bash
npm install -D prettier eslint-config-prettier @ianvs/prettier-plugin-sort-imports
```

- [ ] **Step 2: Create `.prettierrc.json`**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["@ianvs/prettier-plugin-sort-imports"],
  "importOrder": [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$",
    "",
    "^[./]"
  ]
}
```

- [ ] **Step 3: Create `.prettierignore`**

```
node_modules
.next
out
build
package-lock.json
public
```

- [ ] **Step 4: Wire `eslint-config-prettier` into `eslint.config.mjs` (must be last so it can turn off conflicting stylistic rules)**

```javascript
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

- [ ] **Step 5: Add `format` / `format:check` scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

- [ ] **Step 6: Format the existing codebase and verify clean**

Run: `npm run format`
Then: `npm run format:check`
Expected: exits 0, "All matched files use Prettier code style!"

- [ ] **Step 7: Verify lint and typecheck still pass**

Run: `npm run lint`
Expected: exits 0, no errors

Run: `npm run typecheck`
Expected: exits 0, no output

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json eslint.config.mjs .prettierrc.json .prettierignore app
git commit -m "chore: add prettier, import sorting, typecheck script"
```

---

### Task 2: Husky pre-commit hook + lint-staged

**Files:**

- Modify: `package.json`
- Create: `.husky/pre-commit`

**Interfaces:**

- Consumes: `npm run lint`, `.prettierrc.json` from Task 1.

- [ ] **Step 1: Install dependencies**

```bash
npm install -D husky lint-staged
```

- [ ] **Step 2: Initialize husky**

```bash
npx husky init
```

Expected: creates `.husky/pre-commit` (with a default `npm test` placeholder) and adds a `"prepare": "husky"` script to `package.json`.

- [ ] **Step 3: Replace `.husky/pre-commit` contents**

```
npx lint-staged
```

- [ ] **Step 4: Add `lint-staged` config to `package.json`**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

- [ ] **Step 5: Verify the hook fires**

```bash
echo "const   x=1" >> app/page.tsx
git add app/page.tsx
git commit -m "test: verify pre-commit hook"
```

Expected: commit output shows `lint-staged` running eslint/prettier on `app/page.tsx`. Then inspect the file — the bad formatting should be auto-fixed by the hook before the commit lands.

- [ ] **Step 6: Revert the throwaway change from Step 5**

```bash
git reset --soft HEAD~1
git checkout -- app/page.tsx
```

- [ ] **Step 7: Commit the real change**

```bash
git add package.json .husky
git commit -m "chore: add husky pre-commit hook with lint-staged"
```

---

### Task 3: Folder scaffold (components/ui, components/layout, components/sections, content, lib)

**Files:**

- Create: `components/ui/.gitkeep`
- Create: `components/layout/.gitkeep`
- Create: `components/sections/.gitkeep`
- Create: `content/.gitkeep`
- Create: `lib/.gitkeep`

**Interfaces:**

- Produces: the folder tree later tickets (ATS-002+) will populate. No exports yet — directories only.

- [ ] **Step 1: Create the directories with placeholder files (git does not track empty dirs)**

```bash
mkdir -p components/ui components/layout components/sections content lib
touch components/ui/.gitkeep components/layout/.gitkeep components/sections/.gitkeep content/.gitkeep lib/.gitkeep
```

- [ ] **Step 2: Verify the `@/*` alias resolves into the new folders**

Create a throwaway probe file to prove the alias works end-to-end, then delete it:

```bash
cat > lib/probe.ts << 'EOF'
export const probe = "ok";
EOF
```

Temporarily add `import { probe } from "@/lib/probe";` + `console.log(probe)` to `app/page.tsx`, run:

Run: `npm run typecheck`
Expected: exits 0 (no "Cannot find module '@/lib/probe'" error)

Then revert the temporary import from `app/page.tsx` and delete `lib/probe.ts`:

```bash
git checkout -- app/page.tsx
rm lib/probe.ts
```

- [ ] **Step 3: Commit**

```bash
git add components content lib
git commit -m "chore: scaffold components/content/lib folder structure"
```

---

### Task 4: CI workflow (typecheck, lint, build)

**Files:**

- Create: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: `npm run typecheck`, `npm run lint`, `npm run build` (all exist after Task 1).

- [ ] **Step 1: Create the workflow file**

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npm run typecheck

      - run: npm run lint

      - run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add typecheck/lint/build workflow"
```

---

### Task 5: README update

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Replace the create-next-app boilerplate README with project-accurate instructions**

````markdown
# Align the Spine

Marketing site for Align the Spine, built with Next.js (App Router) + TypeScript + Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```
````

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

````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README for project setup and scripts"
````

---

### Task 6: Open a test PR to validate CI end-to-end

**Files:** none (git/GitHub operations only)

**Interfaces:**

- Consumes: all prior tasks' commits, plus `gh` CLI (already installed via winget) authenticated by the user via `gh auth login`.

- [ ] **Step 1: Confirm `gh` is authenticated**

Run: `gh auth status`
Expected: shows logged in to github.com as the user. If not authenticated, stop and ask the user to run `gh auth login` interactively (requires a browser — cannot be done headlessly).

- [ ] **Step 2: Push the branch containing Tasks 1-5's commits**

```bash
git push -u origin main
```

(All prior tasks commit directly to `main` per current repo convention — no long-lived feature branch exists yet. For _this_ task specifically, create a throwaway branch off the now-updated `main` so there's something to open a PR against.)

```bash
git checkout -b chore/verify-ci-pipeline
echo "<!-- CI verification: safe to delete after merge -->" >> README.md
git add README.md
git commit -m "test: trigger CI on a PR to verify the pipeline"
git push -u origin chore/verify-ci-pipeline
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --title "test: verify CI pipeline" --body "Throwaway PR to confirm typecheck/lint/build CI and Vercel preview deploys are wired correctly. Safe to close/delete branch after verifying."
```

- [ ] **Step 4: Watch CI run to completion**

```bash
gh pr checks --watch
```

Expected: all checks (typecheck, lint, build) pass.

- [ ] **Step 5: Report the PR URL and Vercel preview URL (if the user has connected Vercel per the note below) back to the user, then let them decide whether to merge or close/delete the branch.**

---

## Manual step (not automatable from here): connect Vercel

The agent has no Vercel CLI/token in this environment, and Vercel project creation requires the user's account login. One-time setup:

1. Go to https://vercel.com/new
2. Import the `AppFlow-Studio/align-the-spine` GitHub repository.
3. Framework preset: Next.js (auto-detected). Leave build/output settings at defaults (`npm run build`, `.next`).
4. Deploy. Vercel will now automatically create a preview deployment for every PR and redeploy production on pushes to `main`.

Once this is done, Task 6's test PR will show a Vercel preview URL from the Vercel bot comment/check.
