# AccidentBanner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `AccidentBanner` — a full-width, rounded navy card that pairs condition-driven "was this from an accident?" copy on the left with the existing `PipCalculator` (ATS-032) on the right — fed by a new `accidentBanner` block on the `Condition` type.

**Architecture:** One new Tailwind fontSize token (`small-print`) lands first. `content/conditions/types.ts` gets a new `ConditionAccidentBanner` shape (`headline`, `body`) added to `Condition`. `content/conditions/conditions.ts`'s existing `neckPainCondition` entry gets that block populated (still the only real condition entry — no ATS-060 data feed exists yet). `AccidentBanner` (`components/sections/accident-banner.tsx`) is a server component taking a single `condition: Condition` prop, composing `Section`, `Container`, `Eyebrow`, and `PipCalculator`. The static eyebrow and small-print warning copy live as constants inside the component (matching `PipCalculator`'s own `PROMPT`/`INVALID` constant pattern), since only the headline/body vary per condition. The component is verified visually with a temporary, uncommitted mount on the Home page (no condition-page route exists yet — that's a separate ticket) — the mount is reverted before the work is done, so `app/page.tsx` has no net change.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No component-level test framework in active use in this repo (one `vitest` unit test exists, for a non-component util); verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- Reuse existing tokens/components exactly, do not reimplement: `Eyebrow` (`components/ui/eyebrow.tsx`), `Section`/`Container` (`components/ui/section.tsx`/`components/ui/container.tsx`), `PipCalculator` (`components/ui/pip-calculator.tsx`), the `understanding-intro` fontSize token (headline — 50px/62px/400, exact match for "Newsreader Regular 50/62"), the `body-lg` fontSize token paired with `text-mute-300` (body paragraph — 25px/40px/400, `#cdcdcd`, exact match), `navy-900` (`#253067`), `teal-500` (`#58a0a0`), `overlay-white-15` (translucent pill fill, same one `PipCalculator`'s own card uses).
- New token only: `small-print` (`18px`/`30px`/`400`) fontSize — no other new tokens, no hardcoded hex values in component code.
- The warning badge is a plain `bg-teal-500 rounded-full` `<span>` containing a white "!" text glyph — no new icon asset, matching this repo's existing convention of plain colored dot spans (`RedFlagCard`'s bullet dot, `UnderstandingCondition`'s Common-Causes dot) instead of new SVGs.
- `Condition.accidentBanner` is a flat `{ headline: string; body: string }` object — the eyebrow text and warning small-print are NOT part of this type; they are static strings inside `AccidentBanner` itself.
- Background is flat `bg-navy-900` — no background photo (per resolved design decision; see spec's "Background treatment" note).
- Do not add or modify any route under `app/` other than the temporary, reverted `app/page.tsx` edit in the final task — no condition-page route exists yet.
- No new image asset.

---

### Task 1: Design token — `small-print` fontSize

**Files:**

- Modify: `tailwind.config.ts`

**Interfaces:**

- Produces: Tailwind utility `text-small-print` (18px/30px/400). Consumed by Task 4's `AccidentBanner`.

- [ ] **Step 1: Add the `small-print` fontSize token**

In `tailwind.config.ts`, find the `"panel-body"` entry at the end of the `fontSize` block (currently line 115):

```ts
        "panel-body": ["22px", { lineHeight: "38px", fontWeight: "400" }],
      },
```

Replace with:

```ts
        "panel-body": ["22px", { lineHeight: "38px", fontWeight: "400" }],
        "small-print": ["18px", { lineHeight: "30px", fontWeight: "400" }],
      },
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: add small-print font token"
```

---

### Task 2: Extend `Condition` type with `accidentBanner`

**Files:**

- Modify: `content/conditions/types.ts`

**Interfaces:**

- Produces: `ConditionAccidentBanner` (`{ headline: string; body: string }`), and `Condition.accidentBanner: ConditionAccidentBanner`. Consumed by Task 3's `content/conditions/conditions.ts` and Task 4's `AccidentBanner`.

- [ ] **Step 1: Add `ConditionAccidentBanner` and extend `Condition`**

In `content/conditions/types.ts`, the current file is:

```ts
export interface ConditionType {
  name: string;
  description: string;
}

export interface ConditionRedFlags {
  title: string;
  bullets: string[];
}

export interface ConditionUnderstanding {
  intro: string;
  image: { src: string; alt: string };
  types: ConditionType[];
  causes: string[];
  redFlags: ConditionRedFlags;
}

export interface Condition {
  slug: string;
  name: string;
  summary: string;
  understanding: ConditionUnderstanding;
}
```

Replace with:

```ts
export interface ConditionType {
  name: string;
  description: string;
}

export interface ConditionRedFlags {
  title: string;
  bullets: string[];
}

export interface ConditionUnderstanding {
  intro: string;
  image: { src: string; alt: string };
  types: ConditionType[];
  causes: string[];
  redFlags: ConditionRedFlags;
}

export interface ConditionAccidentBanner {
  headline: string;
  body: string;
}

export interface Condition {
  slug: string;
  name: string;
  summary: string;
  understanding: ConditionUnderstanding;
  accidentBanner: ConditionAccidentBanner;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: FAIL — `content/conditions/conditions.ts`'s `neckPainCondition` is missing the now-required `accidentBanner` property. This confirms the type change took effect; Task 3 fixes it.

- [ ] **Step 3: Commit**

```bash
git add content/conditions/types.ts
git commit -m "feat: add accidentBanner block to Condition type"
```

---

### Task 3: `neckPainCondition` — accident banner content

**Files:**

- Modify: `content/conditions/conditions.ts`

**Interfaces:**

- Consumes: `ConditionAccidentBanner` (`@/content/conditions/types`, from Task 2).
- Produces: `neckPainCondition.accidentBanner: ConditionAccidentBanner`. Consumed by Task 5's temporary Home-page mount.

- [ ] **Step 1: Add `accidentBanner` to `neckPainCondition`**

In `content/conditions/conditions.ts`, the object currently ends with:

```ts
    redFlags: {
      title: "See a doctor promptly if you notice:",
      bullets: [
        "Numbness or tingling radiating into your arms or hands",
        "Neck pain following a fall, car accident, or direct blow",
        "Fever, unexplained weight loss, or night sweats alongside neck pain",
      ],
    },
  },
};
```

Replace with:

```ts
    redFlags: {
      title: "See a doctor promptly if you notice:",
      bullets: [
        "Numbness or tingling radiating into your arms or hands",
        "Neck pain following a fall, car accident, or direct blow",
        "Fever, unexplained weight loss, or night sweats alongside neck pain",
      ],
    },
  },
  accidentBanner: {
    headline: "If a collision triggered this, Florida gives you 14 days",
    body: "Neck pain after an accident usually traces back to whiplash — sudden strain on the muscles and ligaments supporting your cervical spine. If a collision is anywhere in this story, Florida law gives you 14 days to get evaluated and protect your PIP benefits.",
  },
};
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0 (the failure from Task 2 is now resolved).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add content/conditions/conditions.ts
git commit -m "feat: add accident banner content to neck pain condition"
```

---

### Task 4: `AccidentBanner` section component

**Files:**

- Create: `components/sections/accident-banner.tsx`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`, from Task 2); `Container` (`@/components/ui/container`, `{ children, className?, as? }`); `Eyebrow` (`@/components/ui/eyebrow`, `{ children, as?, className? }`); `PipCalculator` (`@/components/ui/pip-calculator`, `{ className? }`); `Section` (`@/components/ui/section`, `{ children, spacing?, className?, as? }`); `cn` (`@/lib/cn`); `understanding-intro`, `body-lg`, `small-print` fontSize tokens.
- Produces: `AccidentBanner` named export, props `{ condition: Condition; className?: string }`. Consumed by Task 5's temporary Home-page mount.

- [ ] **Step 1: Write `components/sections/accident-banner.tsx`**

```tsx
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PipCalculator } from "@/components/ui/pip-calculator";
import { Section } from "@/components/ui/section";
import type { Condition } from "@/content/conditions/types";
import { cn } from "@/lib/cn";

export interface AccidentBannerProps {
  condition: Condition;
  className?: string;
}

const WARNING =
  "Missing this window means you may have to pay thousands for medical care out of your own pocket.";

/** "Was this from an accident?" band per condition-page-spec §B4, §C:
 * navy rounded card, condition-driven headline/body on the left, PIPCalculator
 * (ATS-032) on the right. Eyebrow and warning small-print are static —
 * only headline/body vary per condition. */
export function AccidentBanner({ condition, className }: AccidentBannerProps) {
  const { accidentBanner } = condition;

  return (
    <Section className={className}>
      <Container>
        <div className="rounded-30 bg-navy-900 p-10 md:p-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div className="flex flex-col gap-6">
              <Eyebrow>Was this from an accident?</Eyebrow>
              <h2 className="font-display text-understanding-intro text-white">
                {accidentBanner.headline}
              </h2>
              <p className="font-sans text-body-lg text-mute-300">{accidentBanner.body}</p>

              <div className="flex items-center gap-4 rounded-full bg-overlay-white-15 px-5 py-4">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500 font-sans text-sm font-bold text-white"
                >
                  !
                </span>
                <p className="font-sans text-small-print text-mute-300">{WARNING}</p>
              </div>
            </div>

            <div className={cn("w-full md:ml-auto md:max-w-md")}>
              <PipCalculator />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exit 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/accident-banner.tsx
git commit -m "feat: add AccidentBanner section"
```

---

### Task 5: Manual dev-server QA (temporary mount, not committed)

**Files:**

- Temporarily modify (do not commit): `app/page.tsx`

**Interfaces:**

- Consumes: `AccidentBanner` (`@/components/sections/accident-banner`, from Task 4), `neckPainCondition` (`@/content/conditions/conditions`, from Task 3).

This task verifies the component renders and collapses correctly. No permanent page exists for it yet, so the mount added here is reverted at the end — `app/page.tsx` must be back to its pre-task state before this plan is considered done.

- [ ] **Step 1: Temporarily add the import and render it after `<AccidentInjuries />`**

In `app/page.tsx`, add to the top imports:

```tsx
import { AccidentBanner } from "@/components/sections/accident-banner";
import { neckPainCondition } from "@/content/conditions/conditions";
```

And render it directly after `<AccidentInjuries />` (before `<PointToWhereItHurts ... />`):

```tsx
      <AccidentInjuries />
      <AccidentBanner condition={neckPainCondition} />
      <PointToWhereItHurts content={pointToWhereItHurtsContent} />
```

- [ ] **Step 2: Run the dev server and inspect the section**

1. Run `npm run dev`, open the homepage.
2. Confirm a full-container-width, rounded navy card renders with visible white margin and rounded corners on all four sides (not edge-to-edge full-bleed).
3. Confirm the left column shows, top to bottom: a teal uppercase eyebrow "WAS THIS FROM AN ACCIDENT?", a large white serif headline ("If a collision triggered this, Florida gives you 14 days"), a gray body paragraph about whiplash, and a translucent pill with a teal circular "!" badge and small warning text.
4. Confirm the right column renders the `PipCalculator` card ("When did the accident happen?", date field, helper text, Call button) — type a date into the field and confirm the helper text updates (existing ATS-032 behavior, unchanged).
5. Resize to a narrow mobile width (e.g. 375px) and confirm the two columns stack vertically (copy above, calculator below), and nothing overflows horizontally.
6. Resize to a wide desktop width (e.g. 1728px) and confirm the two-column layout returns, with the calculator card right-aligned rather than stretched full-width.

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

- Copy driven by condition data — Task 4's `AccidentBanner` reads `headline`/`body` from the `condition` prop; Task 3's `neckPainCondition.accidentBanner` is the stand-in real content.
- Hosts PIPCalculator on the right — Task 4, `<PipCalculator />` in the right grid column.
- Responsive stack — Task 4 (`grid-cols-1 md:grid-cols-2`), verified in Task 5.
