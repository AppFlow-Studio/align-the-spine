# ComparisonTable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `ComparisonTable` — the "Align the Spine vs Traditional Clinic" 3-column comparison (navy "Care Benefits" labels, white "Align the Spine" cells with teal checks, panel-100 "Traditional Clinic" cells with muted X's) — fed by a new standalone content file, with an `auto-accident` variant that appends 2 extra rows.

**Architecture:** Two new Tailwind fontSize tokens (`comparison-label`, `comparison-cell`) land first. `content/comparison-table.ts` exports a `ComparisonRow` type, the 5 base rows, the 2 auto-accident rows, and a footnote string — standalone rather than on `Condition`, since this table isn't condition-specific. `ComparisonTable` (`components/sections/comparison-table.tsx`) is a server component taking an optional `variant?: "default" | "auto-accident"` prop (defaults to `"default"`), rendering one CSS Grid (3 columns × header + N data rows) inside a `Card` (`radius={30}`, `shadow="comparison"`) so row heights sync automatically across columns. A horizontal-scroll wrapper (`overflow-x-auto snap-x snap-mandatory`) handles mobile. The component is verified visually with a temporary, uncommitted mount on the Home page (no condition-page route exists yet — ATS-022 gap) — the mount is reverted before the work is done, so `app/page.tsx` has no net change.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No component-level test framework in active use in this repo (one `vitest` unit test exists, for a non-component util); verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- Reuse existing tokens/components exactly, do not reimplement: `Card` (`components/ui/card.tsx`, use `radius={30}` and `shadow="comparison"` — the `comparison` shadow variant already exists and has no other consumer), `Section`/`Container` (`components/ui/section.tsx`/`components/ui/container.tsx`), `Eyebrow` (`components/ui/eyebrow.tsx`), `CheckIcon`/`CloseIcon` (`components/ui/icons/check.tsx`/`close.tsx`, both already render `aria-hidden="true"` internally), `navy-900` (`#253067`), `teal-500` (`#58a0a0`), `panel-100` (`#f6f6f6`), `mute-350` (`#ababb3`), `mute-400` (`#8e9597`), `ink-900` (`#1a1a1a`), `overlay-white-15`, the existing `small-print` fontSize token (footnote text).
- New tokens only: `comparison-label` (`30px`/`40px`/weight `500`) and `comparison-cell` (`23px`/`36px`/weight `500`) fontSize — no other new tokens, no hardcoded hex values in component code.
- Row data lives in `content/comparison-table.ts`, NOT on `Condition` — this table's copy doesn't vary per condition (per resolved design decision).
- `ComparisonTable` takes no `condition` prop. Its only prop besides `className` is `variant?: "default" | "auto-accident"`.
- Do not add or modify any route under `app/` other than the temporary, reverted `app/page.tsx` edit in the final task — no condition-page or `/auto-accidents` route exists yet.
- No real `<table>` element or ARIA table roles — plain `div`s, matching `FitChecklist`'s existing precedent for data-grid-shaped components in this repo.
- No new icon assets — reuse `CheckIcon`/`CloseIcon` exactly as they exist today.

---

### Task 1: Design tokens — `comparison-label` and `comparison-cell` fontSize

**Files:**

- Modify: `tailwind.config.ts`

**Interfaces:**

- Produces: Tailwind utilities `text-comparison-label` (30px/40px/weight 500) and `text-comparison-cell` (23px/36px/weight 500). Consumed by Task 3's `ComparisonTable`.

- [ ] **Step 1: Add the two fontSize tokens**

In `tailwind.config.ts`, find the last entry in the `fontSize` block (currently line 115):

```ts
        "small-print": ["18px", { lineHeight: "30px", fontWeight: "400" }],
      },
```

Replace with:

```ts
        "small-print": ["18px", { lineHeight: "30px", fontWeight: "400" }],
        "comparison-label": ["30px", { lineHeight: "40px", fontWeight: "500" }],
        "comparison-cell": ["23px", { lineHeight: "36px", fontWeight: "500" }],
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
git commit -m "feat: add comparison-label and comparison-cell font tokens"
```

---

### Task 2: `content/comparison-table.ts` — row data

**Files:**

- Create: `content/comparison-table.ts`

**Interfaces:**

- Produces: `ComparisonRow` (`{ label: string; alignTheSpine: string; traditionalClinic: string }`), `comparisonTableRows: ComparisonRow[]` (5 rows), `autoAccidentComparisonRows: ComparisonRow[]` (2 rows), `comparisonTableFootnote: string`. Consumed by Task 3's `ComparisonTable` and Task 4's temporary Home-page mount (indirectly, via the component).

- [ ] **Step 1: Write `content/comparison-table.ts`**

```ts
export interface ComparisonRow {
  label: string;
  alignTheSpine: string;
  traditionalClinic: string;
}

/** Base "Align the Spine vs Traditional Clinic" rows per condition-page-spec
 * §B5, §C. Shared across every condition page (and /auto-accidents once
 * built) — not condition-specific, so this lives standalone rather than on
 * `Condition`. */
export const comparisonTableRows: ComparisonRow[] = [
  {
    label: "Travel",
    alignTheSpine: "We come to you — home, office, or hospital visits",
    traditionalClinic: "You drive to them, every appointment",
  },
  {
    label: "Availability",
    alignTheSpine: "Same-day and evening appointments, real flexibility",
    traditionalClinic: "Book weeks out, fixed clinic hours",
  },
  {
    label: "Comfort",
    alignTheSpine: "Treated in your own space, no waiting room",
    traditionalClinic: "Waiting rooms and rushed visit slots",
  },
  {
    label: "Continuity of Care",
    alignTheSpine: "One dedicated doctor who knows your case",
    traditionalClinic: "A different provider almost every visit",
  },
  {
    label: "Cost & Insurance",
    alignTheSpine: "Transparent pricing — PIP and insurance handled for you",
    traditionalClinic: "Surprise billing, you navigate insurance yourself",
  },
];

/** Extra rows for the "auto-accident" variant (/auto-accidents, once built)
 * per the ticket's ⚠️ Variant note. */
export const autoAccidentComparisonRows: ComparisonRow[] = [
  {
    label: "Your Doctor",
    alignTheSpine: "The same doctor treats you from first visit to last",
    traditionalClinic: "Rotating providers — retell your story every visit",
  },
  {
    label: "Attorney Referrals",
    alignTheSpine: "No referral needed — we work directly with your case",
    traditionalClinic: "Often requires an outside attorney referral to begin care",
  },
];

export const comparisonTableFootnote =
  "Care Benefits reflect typical patient experience and may vary by location, insurance, and individual case.";
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add content/comparison-table.ts
git commit -m "feat: add comparison table content"
```

---

### Task 3: `ComparisonTable` section component

**Files:**

- Create: `components/sections/comparison-table.tsx`

**Interfaces:**

- Consumes: `ComparisonRow`, `comparisonTableRows`, `autoAccidentComparisonRows`, `comparisonTableFootnote` (`@/content/comparison-table`, from Task 2); `Card` (`@/components/ui/card`, `{ children, as?, radius?, shadow?, className? }`); `Container` (`@/components/ui/container`, `{ children, className?, as? }`); `Eyebrow` (`@/components/ui/eyebrow`, `{ children, as?, className? }`); `Section` (`@/components/ui/section`, `{ children, spacing?, className?, as? }`); `CheckIcon`/`CloseIcon` (`@/components/ui/icons/check`, `@/components/ui/icons/close`, both `SVGProps<SVGSVGElement>`); `comparison-label`, `comparison-cell`, `small-print` fontSize tokens (from Task 1 and pre-existing).
- Produces: `ComparisonTable` named export, props `{ variant?: "default" | "auto-accident"; className?: string }`. Consumed by Task 4's temporary Home-page mount.

- [ ] **Step 1: Write `components/sections/comparison-table.tsx`**

```tsx
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckIcon } from "@/components/ui/icons/check";
import { CloseIcon } from "@/components/ui/icons/close";
import { Section } from "@/components/ui/section";
import {
  autoAccidentComparisonRows,
  comparisonTableFootnote,
  comparisonTableRows,
  type ComparisonRow,
} from "@/content/comparison-table";

export interface ComparisonTableProps {
  variant?: "default" | "auto-accident";
  className?: string;
}

/** "Align the Spine vs Traditional Clinic" 3-column comparison per
 * condition-page-spec §B5, §C. Rows are data-driven (content/comparison-table.ts);
 * the "auto-accident" variant appends 2 extra rows (continuity-of-doctor,
 * attorney-referral note) for the not-yet-built /auto-accidents page. */
export function ComparisonTable({ variant = "default", className }: ComparisonTableProps) {
  const rows =
    variant === "auto-accident"
      ? [...comparisonTableRows, ...autoAccidentComparisonRows]
      : comparisonTableRows;

  return (
    <Section className={className}>
      <Container>
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="flex flex-col gap-4 text-center">
            <Eyebrow>The Difference</Eyebrow>
            <h2 className="font-display text-h2 text-ink-900">
              Align the Spine vs. Traditional Clinic
            </h2>
          </div>

          <Card radius={30} shadow="comparison" className="overflow-hidden">
            <div className="snap-x snap-mandatory overflow-x-auto">
              <div className="grid min-w-[720px] grid-cols-3">
                <div className="bg-navy-900 px-6 py-8 md:px-8">
                  <p className="font-sans text-comparison-label text-white">Care Benefits</p>
                </div>
                <div className="snap-start bg-white px-6 py-8 md:px-8">
                  <p className="font-sans text-comparison-label text-navy-900">Align the Spine</p>
                </div>
                <div className="bg-panel-100 px-6 py-8 md:px-8">
                  <p className="font-sans text-comparison-label text-mute-350">
                    Traditional Clinic
                  </p>
                </div>

                {rows.map((row) => (
                  <ComparisonRowCells key={row.label} row={row} />
                ))}
              </div>
            </div>

            <p className="border-t border-mute-300 bg-white px-6 py-6 font-sans text-small-print text-mute-400 md:px-8">
              {comparisonTableFootnote}
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

function ComparisonRowCells({ row }: { row: ComparisonRow }) {
  return (
    <>
      <div className="border-t border-overlay-white-15 bg-navy-900 px-6 py-6 md:px-8">
        <p className="font-sans text-comparison-label text-white">{row.label}</p>
      </div>
      <div className="snap-start flex items-start gap-3 border-t border-mute-300 bg-white px-6 py-6 md:px-8">
        <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-teal-500" />
        <p className="font-sans text-comparison-cell text-teal-500">{row.alignTheSpine}</p>
      </div>
      <div className="flex items-start gap-3 border-t border-mute-300 bg-panel-100 px-6 py-6 md:px-8">
        <CloseIcon className="mt-1 h-5 w-5 shrink-0 text-mute-350" />
        <p className="font-sans text-comparison-cell text-ink-900">{row.traditionalClinic}</p>
      </div>
    </>
  );
}
```

Note: the `<>...</>` fragments returned by `ComparisonRowCells` don't add a wrapping DOM node, so each row's 3 cells land as direct siblings of the header cells inside the single `grid grid-cols-3` parent. This is what makes CSS Grid auto-size every row's height to its tallest cell across all 3 columns — real row alignment, unlike `FitChecklist`'s independently-stacked columns.

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
git add components/sections/comparison-table.tsx
git commit -m "feat: add ComparisonTable section"
```

---

### Task 4: Manual dev-server QA (temporary mount, not committed)

**Files:**

- Temporarily modify (do not commit): `app/page.tsx`

**Interfaces:**

- Consumes: `ComparisonTable` (`@/components/sections/comparison-table`, from Task 3).

This task verifies the component renders correctly in both variants and at all three breakpoints. No permanent page exists for it yet (no condition-page or `/auto-accidents` route — ATS-022 gap), so the mount added here is reverted at the end — `app/page.tsx` must be back to its pre-task state before this plan is considered done.

- [ ] **Step 1: Temporarily add the import and render the default variant after `<AccidentInjuries />`**

In `app/page.tsx`, add to the top imports:

```tsx
import { ComparisonTable } from "@/components/sections/comparison-table";
```

And render it directly after `<AccidentInjuries />` (before `<PointToWhereItHurts ... />`):

```tsx
      <AccidentInjuries />
      <ComparisonTable />
      <PointToWhereItHurts content={pointToWhereItHurtsContent} />
```

- [ ] **Step 2: Run the dev server and inspect the default variant**

1. Run `npm run dev`, open the homepage.
2. Confirm one rounded card (visible corners on all sides, drop shadow) with 3 columns: navy (white "Care Benefits" heading + 5 row labels), white (navy "Align the Spine" heading + teal-colored cells, each with a teal checkmark), and light-grey (`#f6f6f6`, muted "Traditional Clinic" heading + dark cells, each with a muted X icon).
3. Confirm all 3 columns' row boundaries line up horizontally — i.e., "Travel"'s row is the same height across all 3 columns, even where cell text wraps to different numbers of lines.
4. Confirm a footnote line in small grey text spans the full card width below the 3 columns.
5. Resize to a narrow mobile width (e.g. 375px) and confirm the 3-column grid becomes horizontally scrollable (swipe/drag reveals all 3 columns) rather than overflowing the viewport, while the footnote stays fixed (does not scroll with the grid).
6. Resize to a wide desktop width (e.g. 1728px) and confirm the grid fills the container with no horizontal scrollbar.

- [ ] **Step 3: Temporarily swap to the `auto-accident` variant**

In `app/page.tsx`, change:

```tsx
<ComparisonTable />
```

to:

```tsx
<ComparisonTable variant="auto-accident" />
```

- [ ] **Step 4: Run the dev server and inspect the auto-accident variant**

1. Refresh the homepage.
2. Confirm the same 3-column layout now shows 7 rows total, ending with "Your Doctor" and "Attorney Referrals" after the original 5 base rows.
3. Confirm the 2 extra rows use the same styling (teal check / muted X, row height sync) as the base rows — no visual distinction needed since they're normal data rows.

- [ ] **Step 5: Revert the temporary mount**

```bash
git checkout -- app/page.tsx
```

Run `git status` and confirm `app/page.tsx` shows no pending changes.

- [ ] **Step 6: Final verification**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

(No commit for this task — the mount was verification-only and has been reverted.)

## Acceptance criteria mapping

- Rows/labels from data; supports extra auto-accident rows — Task 2's `comparisonTableRows`/`autoAccidentComparisonRows`; Task 3's `variant` prop appends the extra 2, verified in Task 4.
- 3-col layout + icons per spec — Task 3 (navy/white/panel-100 columns, teal `CheckIcon`, muted `CloseIcon`), verified in Task 4.
- Mobile: stacked cards or horizontal scroller — Task 3 (`overflow-x-auto snap-x snap-mandatory`), verified in Task 4 at 375px.
