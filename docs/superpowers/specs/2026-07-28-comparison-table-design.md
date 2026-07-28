# ComparisonTable — Design

**Ticket:** ATS-025 · Epic 4 – Sections · Track: Dev A · Est: M · Depends on: ATS-022, ATS-025
**Source:** ticket text (pasted directly, not re-fetched from a tracker). References condition-page-spec §B5, §C (not present in this repo — same gap noted by every prior spec in this repo). No Figma link provided for this ticket.

## Summary

`ComparisonTable`: the "Align the Spine vs Traditional Clinic" 3-column comparison — one rounded (r30) shell with a navy "Care Benefits" column of row labels, a white highlighted "Align the Spine" column, and a light-grey "Traditional Clinic" column, each row carrying a check/close icon plus cell copy. Rows are data-driven from a new standalone content file; an `auto-accident` variant appends 2 extra rows.

Both this ticket's own dependencies (ATS-022, the condition-page route) and ATS-025 (this component) don't exist elsewhere in the repo yet — same gap every prior Epic 4/Dev A ticket (`AccidentBanner`, `UnderstandingCondition`, `PointToWhereItHurts`) has hit. Built and verified in isolation via a temporary, reverted mount on Home, following that exact precedent.

Strong existing scaffolding confirms this component was anticipated: `Card` already has a `shadow="comparison"` option (`components/ui/card.tsx`) wired to a `--shadow-comparison` token that otherwise has no consumer, and every hex color the ticket names already has a matching Tailwind token (`navy-900` `#253067`, `teal-500` `#58a0a0`, `panel-100` `#f6f6f6`, `mute-350` `#ababb3`, `mute-400` `#8e9597`, `ink-900` `#1a1a1a`).

## Resolved open decisions

- **Row data source:** per user decision, a standalone `content/comparison-table.ts` (matching the `content/home-visits.ts` / `FitChecklist` pattern), not a field on `Condition`. The table's rows describe general practice benefits, not condition-specific narrative — the same table renders on every condition page and (once built) `/auto-accidents`.
- **Column 3 icon:** per user decision, a muted `CloseIcon` (mute-350) rather than a muted checkmark — mirrors `FitChecklist`'s existing check-vs-close convention (`components/sections/fit-checklist.tsx`) for a clear visual contrast against column 2's teal checks.
- **Mobile layout:** per user decision, a horizontal scroller (`overflow-x-auto snap-x snap-mandatory`) rather than stacked cards. The grid stays a single 3-column layout with real row alignment; stacked cards would either lose the row-to-row relationship or force row labels to repeat in every card.
- **Row copy:** per user decision, real placeholder marketing copy is authored now (no ATS-060 content feed exists, same gap `neckPainCondition`/`AccidentBanner` copy was written into) — not a "TODO" stub.
- **Auto-accident variant selection:** per user decision, a `variant?: "default" | "auto-accident"` prop, defaulting to `"default"` — matches `DoctorProfile`'s existing variant convention (`components/sections/doctor-profile.tsx`).
- **Attorney-referral row shape:** per user decision, a normal 3-column data row (label + 2 cell values + icons), not a distinct spanning-note format — keeps the row type uniform.
- **Heading above the card:** the ticket's Specs section jumps straight to column details with no eyebrow/heading called out, but every sibling section (`AccidentBanner`, `UnderstandingCondition`) has one. Adding a centered `Eyebrow` ("The Difference") + `h2` ("Align the Spine vs. Traditional Clinic") above the card for rhythm consistency with the rest of the page — flagged as an assumption, not a spec-confirmed requirement.
- **"Highlighted" middle column:** interpreted literally as the white background reading as visually distinct against its navy and `panel-100` neighbors — no added elevation/scale/overlap, since the ticket gives no further detail and no Figma reference exists to confirm one.
- **New fontSize tokens:** neither "Poppins Medium 30" nor "Poppins Medium 23" has an exact existing match. `type-name` (30px/40/**600**) and `redflag-bullet` (23px/36/**400**) are close but wrong weight (ticket calls for Medium/500 on both). Two new tokens, `comparison-label` and `comparison-cell`, rather than reusing a mismatched weight.

## Architecture

```
tailwind.config.ts                    — add "comparison-label", "comparison-cell" fontSize tokens
content/comparison-table.ts           — new: ComparisonRow type, base rows, auto-accident rows, footnote
components/sections/comparison-table.tsx — new: <ComparisonTable variant? />
app/page.tsx                          — temporary mount for QA only, reverted before done
```

- Server component (no `"use client"`) — no interactivity, just data → markup.
- No new npm dependencies. Reuses existing `CheckIcon`/`CloseIcon` (`components/ui/icons/`), `Card`, `Container`, `Eyebrow`, `Section`.

## `content/comparison-table.ts`

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

## `tailwind.config.ts` additions

In `fontSize`, alongside the other condition-page-spec tokens:

```ts
"comparison-label": ["30px", { lineHeight: "40px", fontWeight: "500" }],
"comparison-cell": ["23px", { lineHeight: "36px", fontWeight: "500" }],
```

## `ComparisonTable` props and markup

```ts
export interface ComparisonTableProps {
  variant?: "default" | "auto-accident";
  className?: string;
}
```

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

Notes:

- Fragments (`<>...</>`) inside the `grid` parent don't add a wrapping DOM node, so grid auto-placement still lays out each row's 3 cells directly as siblings of the header cells — this is what makes row heights sync automatically across columns (the tallest cell in a row sets that row's height for all 3 columns), unlike `FitChecklist`'s independently-stacked columns.
- `min-w-[720px]` on the grid + `overflow-x-auto` on its wrapper is what drives the horizontal scroller below the width where 3 columns of real copy would otherwise get cramped; above that width the grid simply fills the container (grid-cols-3 defaults to equal `1fr` tracks).
- `snap-start` only needs to sit on one cell per row-position (column 2, the one column most likely to need a full view) to give the scroller sensible snap points without every single cell needing the class.
- `overflow-hidden` on the `Card` clips the navy/panel column backgrounds and the inner scroll area to the r30 corners.
- Icons use `aria-hidden="true"` already baked into `CheckIcon`/`CloseIcon` themselves (`components/ui/icons/check.tsx`, `close.tsx`) — no extra work needed here.

## Acceptance criteria mapping

- [ ] Rows/labels from data; supports extra auto-accident rows — `comparisonTableRows` / `autoAccidentComparisonRows` in `content/comparison-table.ts`; `variant="auto-accident"` appends the extra 2.
- [ ] 3-col layout + icons per spec — navy/white/panel-100 columns, teal `CheckIcon` in column 2, muted `CloseIcon` in column 3.
- [ ] Mobile: stacked cards or horizontal scroller — horizontal scroller (`overflow-x-auto snap-x snap-mandatory`), per user decision above.

## Out of scope

- Any condition-page or `/auto-accidents` route — neither exists yet (ATS-022 gap, and this ticket itself is the only thing standing in for a real `/auto-accidents` route today). Verified via temporary, reverted Home mount only, per the `AccidentBanner`/`UnderstandingCondition` precedent.
- Wiring `variant="auto-accident"` to a real route — no such route exists; the prop and its extra rows are built and manually verified via a temporary variant swap during QA, then reverted.
- A real semantic `<table>` or ARIA table roles — no other data-grid-shaped component in this repo (`FitChecklist`) uses table semantics either; plain divs stay consistent with that precedent.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- No test framework configured for components in this repo. Manual, dev server:
  - Temporarily mount `<ComparisonTable />` on Home; confirm the 3-column layout, colors, icons, and footnote render per spec at 375px (horizontal scroll works, snaps to column 2), 768px, and 1728px (full-width, no scroll needed).
  - Temporarily swap to `<ComparisonTable variant="auto-accident" />` and confirm the 2 extra rows ("Your Doctor", "Attorney Referrals") appear at the end.
  - Revert the temporary mount before the work is done — `app/page.tsx` ends with no net change.
