# StatChipRow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `StatChipRow`, a reusable dark-surface stat-chip primitive that renders `siteConfig.stats` (the same 5 stats `TopStatsBar` renders) as a wrapping row of glass pills, and wire it into `Hero` for both variants.

**Architecture:** `StatChipRow` (`components/ui/stat-chip-row.tsx`, server component) is a self-contained primitive that reads `siteConfig.stats` directly — no props needed for data, matching how `TopStatsBar` itself sources data. `Hero` (`components/sections/hero.tsx`) then imports and renders it unconditionally at the bottom of its left-column content stack.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No test framework exists in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- Colors/radius/typography: existing tokens only — `bg-overlay-white-15` (glass fill, already used by `LeadForm`'s card and `Button variant="glass"`), `text-mute-300`, `text-white`, `text-stat-label`, `text-stat-value`, `rounded-40` (already used by `Badge`). No new tokens, no hardcoded hex colors.
- Data source is `siteConfig.stats` from `content/site.ts` (`Stat[]`, `{ label: string; value: string }[]`) — the same array `components/layout/top-stats-bar.tsx` already consumes. Do not modify `content/site.ts` or `top-stats-bar.tsx`.
- `components/sections/hero.tsx` currently renders both variants; `StatChipRow` must render for both, unconditionally, with no new `HeroProps` fields.

---

### Task 1: `StatChipRow` component

**Files:**

- Create: `components/ui/stat-chip-row.tsx`

**Interfaces:**

- Consumes: `siteConfig` (`@/content/site`, `siteConfig.stats: Stat[]` where `Stat = { label: string; value: string }`), `cn` (`@/lib/cn`).
- Produces: `StatChipRow` named export, props `{ className?: string }`. Consumed by Task 2's `Hero`.

- [ ] **Step 1: Write `components/ui/stat-chip-row.tsx`**

```tsx
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface StatChipRowProps {
  className?: string;
}

/** Inline stat-chip row sharing TopStatsBar's data (siteConfig.stats) with a
 * glass-pill treatment for dark hero backgrounds, per condition-page-spec §B2. */
export function StatChipRow({ className }: StatChipRowProps) {
  return (
    <dl className={cn("flex flex-wrap gap-3", className)}>
      {siteConfig.stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-0.5 rounded-40 bg-overlay-white-15 px-4 py-2"
        >
          <dt className="font-sans text-stat-label uppercase text-mute-300">{stat.label}</dt>
          <dd className="font-sans text-stat-value text-white">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/stat-chip-row.tsx
git commit -m "feat: add StatChipRow glass-pill stat component"
```

---

### Task 2: Wire `StatChipRow` into `Hero`

**Files:**

- Modify: `components/sections/hero.tsx`

**Interfaces:**

- Consumes: `StatChipRow` from Task 1 (`@/components/ui/stat-chip-row`, no props required).

- [ ] **Step 1: Add the import**

In `components/sections/hero.tsx`, add to the existing import block (after the `siteConfig` import at line 7):

```tsx
import { StatChipRow } from "@/components/ui/stat-chip-row";
```

- [ ] **Step 2: Render `StatChipRow` at the bottom of the left column**

In `components/sections/hero.tsx`, the left column currently ends with (lines 98–107):

```tsx
          {variant === "home" && (Boolean(badge) || Boolean(ctas?.length)) && (
            <div className="flex flex-wrap items-center gap-4 relative">
              {badge && <HeroChip>{badge}</HeroChip>}
              {ctas?.map((cta) => (
                <Button key={cta.label} href={cta.href} variant={cta.variant ?? "primary"}>
                  {cta.label}
                </Button>
              ))}
            </div>
          )}
        </div>
```

Change it to add `<StatChipRow />` as the last child of the column, after the home-variant block and before the column's closing `</div>`:

```tsx
          {variant === "home" && (Boolean(badge) || Boolean(ctas?.length)) && (
            <div className="flex flex-wrap items-center gap-4 relative">
              {badge && <HeroChip>{badge}</HeroChip>}
              {ctas?.map((cta) => (
                <Button key={cta.label} href={cta.href} variant={cta.variant ?? "primary"}>
                  {cta.label}
                </Button>
              ))}
            </div>
          )}

          <StatChipRow />
        </div>
```

- [ ] **Step 3: Typecheck, lint, build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

- [ ] **Step 4: Manual dev-server QA**

`Hero` is not currently mounted anywhere in `app/` (per the prior Hero plan, `app/page.tsx` is `export default function Home() { return <div></div>; }`). To visually verify:

1. Temporarily edit `app/page.tsx` to mount Hero:

```tsx
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <Hero
      variant="home"
      background={{ src: "/figma-exports/interior-reception.png", alt: "" }}
      title="Align the Spine"
      subhead="South Florida's Chiropractor"
      badge="Office visits are $50"
      ctas={[{ label: "Book Appointment", href: "/book" }]}
      form={{ heading: "Schedule Your Evaluation", submitLabel: "Submit" }}
    />
  );
}
```

2. Run `npm run dev`, open the homepage, and confirm:
   - The 5 stat chips render as rounded glass pills below the badge/CTA row, matching the LeadForm card's translucency against the dark background photo.
   - Resize to a narrow mobile width (e.g. 375px) and confirm the chips wrap onto multiple lines without clipping or horizontal overflow.
3. Revert `app/page.tsx` to its exact original content (`export default function Home() { return <div></div>; }`) via direct edit — **never** `git checkout -- app/page.tsx`, since other unrelated uncommitted edits may exist in the working tree.

- [ ] **Step 5: Commit**

```bash
git add components/sections/hero.tsx
git commit -m "feat: render StatChipRow in Hero for both variants"
```
