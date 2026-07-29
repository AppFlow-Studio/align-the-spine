# HOW WE HELP Variant Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing "HOW WE HELP" 3-step section (`components/sections/how-we-help-steps.tsx`) genuinely shared between Home-visits (live) and the not-yet-built `/auto-accidents` page by relocating its content type to the component and adding auto-accident-flavored step content.

**Architecture:** The component (`HowWeHelpSteps`) already takes `heading`, `steps`, and `cta` as plain props and needs no behavioral change. Its `HowWeHelpStep` interface moves from `content/home-visits.ts` into the component file (co-located with the type it's the contract for — the same pattern `ServiceCardItem` already uses, defined in `components/ui/service-card.tsx` and imported by content files). A new `content/auto-accident.ts` seeds the first content for the future `/auto-accidents` page: `autoAccidentSteps: HowWeHelpStep[]`, claim/PIP-framed copy, reusing the existing three step images (no new Figma assets available this session — MCP tool is rate-limited). The variant is verified with a temporary, uncommitted mount on `app/page.tsx` (no `/auto-accidents` route exists yet), then reverted, matching this repo's established convention (see `docs/superpowers/plans/2026-07-23-understanding-condition.md` Task 7).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies, no new design tokens, no new images.

## Global Constraints

- No component-level test framework in active use in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- No visual/layout changes to `HowWeHelpSteps` itself — per user decision, the connector treatment matches the already-confirmed live design (thin divider above each title, no numbered badges) rather than guessing at Figma specs that couldn't be pulled this session.
- Reuse the three existing step images verbatim (`/figma-exports/home-visits-step-call.png`, `-eligibility.png`, `-visit.png`) — do not add new image assets.
- `content/home-visits.ts`'s `homeVisitSteps` export and its values are unchanged; only its `HowWeHelpStep` type definition moves.
- Do not add or modify any route under `app/` other than the temporary, reverted `app/page.tsx` edit in the final task — no `/auto-accidents` route exists yet.
- No new props, no `variant` enum on `HowWeHelpSteps` — each page continues to supply its own `heading`/`steps`/`cta`, exactly as `app/home-visits/page.tsx` already does.

---

### Task 1: Move `HowWeHelpStep` into the component file

**Files:**

- Modify: `components/sections/how-we-help-steps.tsx`
- Modify: `content/home-visits.ts`

**Interfaces:**

- Produces: `HowWeHelpStep` interface, now exported from `@/components/sections/how-we-help-steps` (`{ image: string; alt: string; title: string; description: string }`). Consumed by Task 2's `content/auto-accident.ts` and by the existing `content/home-visits.ts`.

- [ ] **Step 1: Add the `HowWeHelpStep` interface to `components/sections/how-we-help-steps.tsx` and update its doc comment**

Current file:

```tsx
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HowWeHelpStep } from "@/content/home-visits";

export interface HowWeHelpStepsProps {
  heading: string;
  steps: HowWeHelpStep[];
  cta: { label: string; href: string };
}

/** "HOW WE HELP" 3-step section per the Home-visits-v2 artboard (ATS-110):
 * photo + title + copy per step, plus a closing booking CTA. */
export function HowWeHelpSteps({ heading, steps, cta }: HowWeHelpStepsProps) {
```

Replace the top of the file (everything before the function body, which is unchanged) with:

```tsx
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export interface HowWeHelpStep {
  image: string;
  alt: string;
  title: string;
  description: string;
}

export interface HowWeHelpStepsProps {
  heading: string;
  steps: HowWeHelpStep[];
  cta: { label: string; href: string };
}

/** "HOW WE HELP" 3-step section, reused across pages with variant copy —
 * originally built for Home-visits (ATS-110), now also seeded for the
 * not-yet-built /auto-accidents page (Epic 4): photo + title + copy per
 * step, plus a closing booking CTA. */
export function HowWeHelpSteps({ heading, steps, cta }: HowWeHelpStepsProps) {
```

Leave the rest of the function body (the `return (...)` block) exactly as-is — no rendering changes.

- [ ] **Step 2: Update `content/home-visits.ts` to import the type instead of defining it**

Current top of file:

```ts
export interface HowWeHelpStep {
  image: string;
  alt: string;
  title: string;
  description: string;
}

/** "Three steps, no waiting room" on /home-visits (ATS-110), per the
 * Home-visits-v2 artboard. */
export const homeVisitSteps: HowWeHelpStep[] = [
```

Replace with:

```ts
import type { HowWeHelpStep } from "@/components/sections/how-we-help-steps";

/** "Three steps, no waiting room" on /home-visits (ATS-110), per the
 * Home-visits-v2 artboard. */
export const homeVisitSteps: HowWeHelpStep[] = [
```

The array contents below (`homeVisitSteps: HowWeHelpStep[] = [...]`) and everything after it (`FitChecklistRow`, `homeVisitFitChecklist`) are unchanged.

- [ ] **Step 3: Verify types still check**

Run: `npm run typecheck`
Expected: exits 0, no errors. This confirms `app/home-visits/page.tsx` (which imports `homeVisitSteps` and `HowWeHelpSteps` from their original module paths) still resolves correctly, since neither of those two exports moved or changed shape.

- [ ] **Step 4: Commit**

```bash
git add components/sections/how-we-help-steps.tsx content/home-visits.ts
git commit -m "refactor: co-locate HowWeHelpStep type with its component"
```

---

### Task 2: `content/auto-accident.ts` — auto-accident step content

**Files:**

- Create: `content/auto-accident.ts`

**Interfaces:**

- Consumes: `HowWeHelpStep` (`@/components/sections/how-we-help-steps`, from Task 1).
- Produces: `autoAccidentSteps: HowWeHelpStep[]` const export. Consumed by Task 3's temporary Home-page mount.

- [ ] **Step 1: Write `content/auto-accident.ts`**

```ts
import type { HowWeHelpStep } from "@/components/sections/how-we-help-steps";

/** "HOW WE HELP" steps for the not-yet-built /auto-accidents page (Epic 4),
 * claim/PIP-framed copy per the ticket's scope. Reuses the Home-visits step
 * images (call/clipboard/notebook) since no auto-accident-specific Figma
 * assets exist yet — the Figma MCP tool hit its call limit this session, so
 * Frame 13/14/12's dev-mode specs were never pulled. */
export const autoAccidentSteps: HowWeHelpStep[] = [
  {
    image: "/figma-exports/home-visits-step-call.png",
    alt: "Phone showing an incoming call",
    title: "Call or request your evaluation",
    description:
      "Tell us about your accident and when it happened. Most requests get a same-day answer, and we'll walk you through what a PIP-covered evaluation includes.",
  },
  {
    image: "/figma-exports/home-visits-step-eligibility.png",
    alt: "Clipboard with an evaluation form",
    title: "Full accident evaluation",
    description:
      "A complete exam that documents your injuries the way your claim — and your attorney, if you have one — needs.",
  },
  {
    image: "/figma-exports/home-visits-step-visit.png",
    alt: "Notebook and pen ready for a treatment plan",
    title: "Your treatment plan, handled",
    description:
      "We build and manage your care plan and bill PIP directly, so you're not stuck fronting costs or chasing paperwork.",
  },
];
```

- [ ] **Step 2: Verify types still check**

Run: `npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add content/auto-accident.ts
git commit -m "feat: add auto-accident HOW WE HELP step content"
```

---

### Task 3: Manual dev-server QA (temporary mount, not committed)

**Files:**

- Temporarily modify (do not commit): `app/page.tsx`

**Interfaces:**

- Consumes: `HowWeHelpSteps` (`@/components/sections/how-we-help-steps`, from Task 1), `autoAccidentSteps` (`@/content/auto-accident`, from Task 2).

This task verifies the auto-accident copy renders correctly through the existing, unmodified component. No permanent page exists for it yet, so the mount added here is reverted at the end — `app/page.tsx` must be back to its pre-task state before this plan is considered done.

- [ ] **Step 1: Temporarily add the import and render it after `<Hero />`**

In `app/page.tsx`, add to the top imports (alongside the existing `@/components/sections/...` imports):

```tsx
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
```

and (alongside the existing `@/content/...` imports):

```tsx
import { autoAccidentSteps } from "@/content/auto-accident";
```

Then render it directly after the closing `/>` of `<Hero ... />` (before `<HeroReviewsCarousel .../>`):

```tsx
      <HowWeHelpSteps
        heading="Three steps to get your claim moving"
        steps={autoAccidentSteps}
        cta={{ label: "Schedule My Car Accident Evaluation", href: siteConfig.bookingCta.href }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />
```

- [ ] **Step 2: Run the dev server and inspect the section**

1. Run `npm run dev`, open the homepage.
2. Confirm a teal uppercase eyebrow "HOW WE HELP" renders above the heading "Three steps to get your claim moving".
3. Confirm 3 columns: each with a photo, a thin divider line above the title, then title + description — reusing the phone/clipboard/notebook images — reading "Call or request your evaluation", "Full accident evaluation", "Your treatment plan, handled" with the claim/PIP-framed copy from Task 2.
4. Confirm the closing button reads "Schedule My Car Accident Evaluation" and links to the same href as `siteConfig.bookingCta.href`.
5. Resize to a narrow mobile width (e.g. 375px) and confirm the 3 columns stack into a single column with no overflow.
6. Resize to a wide desktop width (e.g. 1728px) and confirm the 3-column grid returns.

- [ ] **Step 3: Revert the temporary mount**

```bash
git checkout -- app/page.tsx
```

Run `git status` and confirm `app/page.tsx` shows no pending changes.

- [ ] **Step 4: Final verification**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

(No commit for this task — the mount was verification-only and has been reverted.)

## Acceptance criteria mapping

- 3 steps render from data with variant copy — Task 2's `autoAccidentSteps`, rendered through the unchanged `HowWeHelpSteps` component (Task 1), verified in Task 3.
- Connector treatment matches design — no change to the component's existing divider treatment (per user decision recorded in the design spec), verified visually in Task 3.
- Responsive stack — already implemented in the component (`grid sm:grid-cols-3`, single column below `sm`); verified in Task 3 Step 2.
