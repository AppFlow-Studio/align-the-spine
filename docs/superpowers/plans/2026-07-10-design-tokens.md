# Design Tokens & Fonts (ATS-002) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Encode the real design tokens (colors, radii, shadows, type scale, fluid grid) into `tailwind.config.ts` + CSS vars, and load the four brand font families via `next/font`, so every later UI ticket has a stable token surface to build against.

**Architecture:** `tailwind.config.ts` (new, loaded via Tailwind v4's `@config` directive) maps Tailwind utility names onto CSS custom properties. `app/globals.css` defines those custom properties in `:root` — the single source of truth for raw values — and a `.container` component class for the fluid grid. `app/layout.tsx` loads the three fonts via `next/font/google` and exposes them as CSS vars that `globals.css` aliases to `--font-display` / `--font-sans` / `--font-alt`. A new `ArrowRightIcon` component replaces the `→` glyph so Inter is never bundled.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS 4.3.2 (`@tailwindcss/postcss`, config loaded via `@config` — v4 bundles `jiti`, so a `.ts` config file works), TypeScript 5 (strict), `next/font/google`.

## Global Constraints

- Package manager is **npm**.
- Path alias is `@/*` → repo root (`tsconfig.json:21-23`).
- Do not redesign `app/page.tsx`. It is create-next-app boilerplate that will be replaced by real content in later tickets. Each task below temporarily adds a hidden probe element to `app/page.tsx` to force Tailwind to generate the utility classes under test, verifies, then reverts `app/page.tsx` to its original content — mirroring the pattern used in ATS-001.
- Design token values are sourced from the Figma file `7p8hHjzZVy6MgpP6RAnmU1`, node `1:884` ("neck-imagesfocused" / the Neck condition page), per `docs/superpowers/specs/2026-07-10-design-tokens-design.md`. Do not add colors, sizes, or weights beyond what that spec lists — gaps (rest of §A2 glass values, additional type-scale roles, exact breakpoint data) are explicitly out of scope for this ticket.
- The `prefers-color-scheme: dark` override for `--background` / `--foreground` is intentionally dropped (this design system has no dark palette). This causes a known, accepted cosmetic regression on `app/page.tsx`'s boilerplate "Deploy Now" button (`bg-foreground` / `text-background` / `dark:hover:` classes) in dark-mode browsers — acceptable since that button is disposable create-next-app scaffolding, not part of the design system, and will be replaced by real content in later tickets. (Corrected 2026-07-10 — the original draft of this constraint said the opposite; the human confirmed dropping the block is correct after Task 1's review flagged the contradiction.)

---

### Task 1: Color, radius, and shadow tokens

**Files:**

- Create: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify (temporarily, then revert): `app/page.tsx`

**Interfaces:**

- Produces: CSS custom properties `--color-navy-900`, `--color-navy-800`, `--color-navy-700`, `--color-teal-500`, `--color-ink-900`, `--color-ink-500`, `--color-mute-300`, `--color-mute-400`, `--color-mute-350`, `--color-panel-100`, `--overlay-navy-20`, `--radius-6`, `--radius-15`, `--radius-20`, `--radius-30`, `--radius-40`, `--radius-50`, `--radius-80`, `--shadow-card`, `--shadow-comparison`. Produces Tailwind utilities `bg-navy-900` (and siblings for every color/shade above), `rounded-6`...`rounded-80`, `shadow-card`, `shadow-comparison`. Task 2 and Task 3 both add more keys to the same `tailwind.config.ts` `theme.extend` object created here.

- [ ] **Step 1: Create `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "var(--color-navy-900)",
          800: "var(--color-navy-800)",
          700: "var(--color-navy-700)",
        },
        teal: {
          500: "var(--color-teal-500)",
        },
        ink: {
          900: "var(--color-ink-900)",
          500: "var(--color-ink-500)",
        },
        mute: {
          300: "var(--color-mute-300)",
          400: "var(--color-mute-400)",
          350: "var(--color-mute-350)",
        },
        panel: {
          100: "var(--color-panel-100)",
        },
      },
      borderRadius: {
        6: "var(--radius-6)",
        15: "var(--radius-15)",
        20: "var(--radius-20)",
        30: "var(--radius-30)",
        40: "var(--radius-40)",
        50: "var(--radius-50)",
        80: "var(--radius-80)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        comparison: "var(--shadow-comparison)",
      },
    },
  },
};

export default config;
```

- [ ] **Step 2: Replace `app/globals.css` with the token-aware version**

```css
@import "tailwindcss";
@config "../tailwind.config.ts";

:root {
  --background: #ffffff;
  --foreground: #171717;

  /* Design tokens: colors (condition-page-spec §A) */
  --color-navy-900: #253067;
  --color-navy-800: #2b3565;
  --color-navy-700: #374690; /* hero gradient end */
  --color-teal-500: #58a0a0;
  --color-ink-900: #1a1a1a;
  --color-ink-500: #777777;
  --color-mute-300: #cdcdcd;
  --color-mute-400: #8e9597;
  --color-mute-350: #ababb3;
  --color-panel-100: #f6f6f6;

  /* Design tokens: overlays (condition-page-spec §A2, partial) */
  --overlay-navy-20: rgba(37, 48, 103, 0.2);

  /* Design tokens: radius */
  --radius-6: 6px;
  --radius-15: 15px;
  --radius-20: 20px;
  --radius-30: 30px;
  --radius-40: 40px;
  --radius-50: 50px;
  --radius-80: 80px;

  /* Design tokens: shadow */
  --shadow-card: 0 4px 50px rgba(0, 0, 0, 0.15);
  --shadow-comparison: 0 10px 30px rgba(0, 0, 0, 0.04);

  /* Design tokens: grid (condition-page-spec §E) */
  --container-max: 1568px;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

body {
  background: var(--color-panel-100);
  color: var(--color-ink-900);
}
```

- [ ] **Step 3: Add a temporary probe to `app/page.tsx`**

Add this line as the first child inside the outer `<div>` in `app/page.tsx` (right after the opening `<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">` tag):

```tsx
<div
  className="hidden bg-navy-900 text-teal-500 rounded-6 rounded-30 shadow-card"
  data-token-probe="colors"
/>
```

- [ ] **Step 4: Build and verify the tokens compiled**

Run: `npm run build`
Expected: exits 0.

Run: `grep -r "color-navy-900" .next/static/css/`
Expected: at least one match (confirms the CSS var declaration reached the compiled output).

Run: `grep -r "253067" .next/static/css/`
Expected: at least one match (confirms the raw hex value is present).

Run: `grep -r "bg-navy-900" .next/static/css/`
Expected: at least one match (confirms Tailwind generated the utility class, proving `tailwind.config.ts` + `@config` wiring works end to end).

Run: `grep -r "shadow-card\|4px 50px" .next/static/css/`
Expected: at least one match.

Run: `grep -r "rounded-6\b" .next/static/css/`
Expected: at least one match (confirms a second radius scale entry, not just `rounded-30`).

Run: `grep -r "overlay-navy-20" .next/static/css/`
Expected: at least one match (confirms the glass overlay var reached compiled output, even though no utility consumes it yet).

- [ ] **Step 5: Revert the probe**

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 6: Verify typecheck and lint still pass**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add color, radius, and shadow design tokens"
```

---

### Task 2: Font loading (Newsreader, Poppins, Geist)

**Files:**

- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**

- Consumes: nothing from Task 1's code (independent CSS vars), but edits the same `app/globals.css` file.
- Produces: CSS vars `--font-newsreader`, `--font-poppins`, `--font-geist` (raw `next/font` vars, set on `<html>`), aliased to `--font-display`, `--font-sans`, `--font-alt` in `globals.css`. Task 3 adds `fontFamily` to `tailwind.config.ts` consuming these same three alias names.

- [ ] **Step 1: Replace the font imports in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Newsreader, Poppins } from "next/font/google";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${poppins.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Add the font aliases to `app/globals.css`**

In the `:root` block added in Task 1, add these three lines directly below the `--container-max: 1568px;` line:

```css
/* Design tokens: fonts (condition-page-spec §A) */
--font-display: var(--font-newsreader);
--font-sans: var(--font-poppins);
--font-alt: var(--font-geist);
```

- [ ] **Step 3: Build and verify the fonts loaded**

Run: `npm run build`
Expected: exits 0. (`next/font` fails the build at compile time if a requested weight isn't available for a font — a clean exit confirms the weight arrays from Step 1 are valid, which was already cross-checked against `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`.)

Run: `grep -ril "Newsreader" .next/static/css/`
Expected: at least one match.

Run: `grep -ril "Poppins" .next/static/css/`
Expected: at least one match.

Run: `grep -ril "Geist" .next/static/css/`
Expected: at least one match.

- [ ] **Step 4: Verify typecheck and lint still pass**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: load Newsreader, Poppins, and Geist via next/font"
```

---

### Task 3: Type scale utilities

**Files:**

- Modify: `tailwind.config.ts`
- Modify (temporarily, then revert): `app/page.tsx`

**Interfaces:**

- Consumes: `--font-display` / `--font-sans` / `--font-alt` (Task 2), `--color-*` vars (Task 1, used only in the probe, not in the config itself).
- Produces: Tailwind utilities `font-display`, `font-sans`, `font-alt`, and `text-hero`, `text-h2`, `text-eyebrow`, `text-body-lg`, `text-button`, `text-nav`, `text-faq-q`, `text-faq-a`, `text-alt-label` (each bundles font-size + line-height + letter-spacing + font-weight).

- [ ] **Step 1: Add `fontFamily` and `fontSize` to `tailwind.config.ts`**

Add these two keys inside the existing `theme.extend` object (alongside `colors`, `borderRadius`, `boxShadow` from Task 1):

```ts
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        alt: ["var(--font-alt)", "sans-serif"],
      },
      fontSize: {
        hero: ["87px", { lineHeight: "90px", fontWeight: "300" }],
        h2: ["35px", { lineHeight: "66px", fontWeight: "600" }],
        eyebrow: ["25px", { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "500" }],
        "body-lg": ["25px", { lineHeight: "40px", fontWeight: "400" }],
        button: ["20px", { lineHeight: "40px", fontWeight: "400" }],
        nav: ["17px", { lineHeight: "40px", letterSpacing: "0.85px", fontWeight: "400" }],
        "faq-q": ["25px", { lineHeight: "40px", fontWeight: "600" }],
        "faq-a": ["25px", { lineHeight: "40px", fontWeight: "400" }],
        "alt-label": ["22px", { lineHeight: "40px", fontWeight: "400" }],
      },
```

- [ ] **Step 2: Add a temporary probe to `app/page.tsx`**

Add this line as the first child inside the outer `<div>` in `app/page.tsx` (same insertion point as Task 1's probe):

```tsx
<div
  className="hidden font-display font-sans font-alt text-hero text-h2 text-eyebrow text-body-lg text-button text-nav text-faq-q text-faq-a text-alt-label"
  data-token-probe="type-scale"
/>
```

- [ ] **Step 3: Build and verify the type scale compiled**

Run: `npm run build`
Expected: exits 0.

Run: `grep -r "text-hero" .next/static/css/`
Expected: at least one match.

Run: `grep -r "87px" .next/static/css/`
Expected: at least one match (hero font-size).

Run: `grep -r "90px" .next/static/css/`
Expected: at least one match (hero line-height).

Run: `grep -r "text-nav" .next/static/css/`
Expected: at least one match.

Run: `grep -r "0.85px" .next/static/css/`
Expected: at least one match (nav letter-spacing).

- [ ] **Step 4: Revert the probe**

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 5: Verify typecheck and lint still pass**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: add font-family and type-scale tokens"
```

---

### Task 4: Arrow icon component (Inter replacement)

**Files:**

- Create: `components/ui/icons/arrow-right.tsx`
- Modify (temporarily, then revert): `app/page.tsx`

**Interfaces:**

- Produces: `ArrowRightIcon`, a named export from `components/ui/icons/arrow-right.tsx`, signature `function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element`. Any later ticket rendering the `→` glyph imports this instead of loading Inter.

- [ ] **Step 1: Create `components/ui/icons/arrow-right.tsx`**

```tsx
import type { SVGProps } from "react";

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
```

- [ ] **Step 2: Add a temporary probe to `app/page.tsx`**

Add this import at the top of `app/page.tsx`:

```tsx
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
```

Add this line as the first child inside the outer `<div>` in `app/page.tsx` (same insertion point as prior probes):

```tsx
<ArrowRightIcon className="hidden size-5" data-token-probe="icon" />
```

- [ ] **Step 3: Verify it compiles and renders**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Revert the probe**

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 5: Verify lint still passes**

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 6: Commit**

```bash
git add components/ui/icons/arrow-right.tsx
git commit -m "feat: add ArrowRightIcon component"
```

---

### Task 5: Fluid grid container

**Files:**

- Modify: `app/globals.css`
- Modify (temporarily, then revert): `app/page.tsx`

**Interfaces:**

- Consumes: `--container-max` (Task 1).
- Produces: the `.container` CSS class — `max-width: 1568px`, centered, `padding-inline` fluidly scaling from 24px to 80px (exactly 80px at the 1728px canvas width).

- [ ] **Step 1: Add the `.container` component class to `app/globals.css`**

Add this block at the end of `app/globals.css`, after the `body { ... }` rule:

```css
@layer components {
  .container {
    width: 100%;
    max-width: var(--container-max);
    margin-inline: auto;
    padding-inline: clamp(24px, calc(4.14vw + 8.5px), 80px);
  }
}
```

- [ ] **Step 2: Add a temporary probe to `app/page.tsx`**

Add this line as the first child inside the outer `<div>` in `app/page.tsx` (same insertion point as prior probes):

```tsx
<div className="hidden container" data-token-probe="grid" />
```

- [ ] **Step 3: Build and verify the container compiled**

Run: `npm run build`
Expected: exits 0.

Run: `grep -r "container-max" .next/static/css/`
Expected: at least one match.

Run: `grep -r "clamp(24px" .next/static/css/`
Expected: at least one match.

Run: `grep -r "1568px" .next/static/css/`
Expected: at least one match.

- [ ] **Step 4: Revert the probe**

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 5: Verify typecheck and lint still pass**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "feat: add fluid grid container token"
```

---

## Manual step (not automatable from here): visual sanity check

After all 5 tasks land, run `npm run dev`, open `http://localhost:3000`, and confirm in devtools that `document.documentElement` carries the three `next/font` variable classes and that `getComputedStyle(document.body).backgroundColor` resolves to `rgb(246, 246, 246)` (panel-100). This is a quick human spot-check, not a blocking step — the automated grep-based verification in each task already confirms the tokens compiled correctly.
