# AccidentBanner — Design

**Ticket:** ATS-044 · Epic 4 – Sections · Track: Dev A · Est: S · Depends on: ATS-032
**Source:** ticket text + screenshot (pasted directly). References condition-page-spec §B4, §C (not present in this repo — same gap noted by every prior spec in this repo). A Figma link was provided (node-id 149-4) but `get_design_context` hit the same Professional-seat MCP tool-call limit the 2026-07-23 understanding-condition ticket hit; this design is built from the ticket text and screenshot alone.

## Summary

`AccidentBanner`: a full-width, rounded navy card that wraps the existing `PipCalculator` (ATS-032). Left column carries condition-driven narrative copy ("was this from an accident?" framing); right column hosts the calculator. `PipCalculator`'s own doc comment (`components/ui/pip-calculator.tsx:19`) already names this exact component and ticket, confirming the pairing.

Like `UnderstandingCondition` (2026-07-23), this is built and verified in isolation — no condition-page route exists yet (that's a separate, not-yet-built ticket) — via a temporary, reverted mount on Home.

## Resolved open decisions

- **Copy source:** this repo has one real `Condition` entry (`neckPainCondition`) standing in for the not-yet-built ATS-060 data feed. The ticket's screenshot shows sciatica-specific copy ("Sciatic pain after an accident…"), which doesn't exist as a condition here. Per user decision, the headline/body are adapted to neck pain/whiplash instead of copied verbatim, reusing the "Whiplash from a car accident" cause already listed in `neckPainCondition.understanding.causes`.
- **Mount strategy:** per user decision, follows the `UnderstandingCondition` precedent exactly — temporary, uncommitted mount on Home for visual QA, reverted before the work is done. `app/page.tsx` ends with no net change.
- **Background treatment:** the ticket text specifies a flat `#253067` navy card; the screenshot shows a moody background photo tinted navy. Per user decision, built as flat `bg-navy-900` (no photo) — matches the ticket's literal spec, matches `StillHaveQuestions`' existing flat-navy band treatment, and avoids introducing an unconfirmed image asset (no exact match exists in `public/figma-exports/`).
- **What varies per condition vs. what's static:** the ticket says only "headline copy varies per condition." The eyebrow ("WAS THIS FROM AN ACCIDENT?") and the small-print warning line are structural/legal boilerplate identical across every condition page, so they're static constants inside the component — the same pattern `PipCalculator` itself already uses for its own copy (`PROMPT`/`INVALID` constants in `components/ui/pip-calculator.tsx`). Only `headline` and `body` (both narrative and injury-dependent) come from `Condition.accidentBanner`.
- **No new design tokens beyond one:** `text-understanding-intro` (50px/62px/400) already matches "Newsreader Regular 50/62" exactly — reused for the headline instead of adding a duplicate token. `text-body-lg` (25px/40px/400) + `text-mute-300` (#cdcdcd) already matches "Poppins 25/40 #cdcdcd" exactly — reused for the body paragraph. Only the small-print size (18px/30px) has no existing match (`stat-label` is 18/28/500) — one new fontSize token, `small-print`.
- **Warning-pill styling:** the screenshot's small-print line renders as a pill with a circular teal "!" badge, not plain text. Built as a `rounded-full bg-overlay-white-15` pill (reusing the exact translucent fill `PipCalculator`'s own card already uses, for visual consistency between the two elements sharing this card) containing a plain `bg-teal-500` circular span with a white "!" glyph — matching this repo's existing convention of plain colored `<span>` dots instead of new icon assets (`RedFlagCard`'s bullet dot, `UnderstandingCondition`'s Common-Causes dot).
- **Layout:** "full-width navy card" + "r30" together mean full container width (not full viewport bleed) with visible rounded corners on all sides — matching the screenshot's white margin around the card. Two-column grid inside the card mirrors `ContactSection`'s existing `grid grid-cols-1 gap-10 md:grid-cols-2` copy-left/component-right pattern.

## Architecture

```
content/conditions/types.ts        — add ConditionAccidentBanner, Condition.accidentBanner
content/conditions/conditions.ts   — add accidentBanner to neckPainCondition
tailwind.config.ts                 — add "small-print" fontSize token
components/sections/accident-banner.tsx — new: <AccidentBanner condition />
app/page.tsx                       — temporary mount for QA only, reverted before done
```

- Server component (no `"use client"`) — `PipCalculator` is already its own client component; `AccidentBanner` just composes it.
- No new npm dependencies. No new icon asset (plain `<span>` badge, per above).

## `content/conditions/types.ts` change

```ts
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

## `content/conditions/conditions.ts` addition

Add to `neckPainCondition`:

```ts
accidentBanner: {
  headline: "If a collision triggered this, Florida gives you 14 days",
  body: "Neck pain after an accident usually traces back to whiplash — sudden strain on the muscles and ligaments supporting your cervical spine. If a collision is anywhere in this story, Florida law gives you 14 days to get evaluated and protect your PIP benefits.",
},
```

## `tailwind.config.ts` addition

In `fontSize`, alongside the other condition-page-spec §B tokens:

```ts
"small-print": ["18px", { lineHeight: "30px", fontWeight: "400" }],
```

## `AccidentBanner` props and markup

```ts
export interface AccidentBannerProps {
  condition: Condition;
  className?: string;
}
```

```tsx
const WARNING =
  "Missing this window means you may have to pay thousands for medical care out of your own pocket.";

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

            <div className="w-full md:ml-auto md:max-w-md">
              <PipCalculator />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

Notes:

- `Eyebrow` already renders uppercase via CSS (`uppercase` class) — passed as normal-case text, matching every other `Eyebrow` usage in this repo (e.g. "What we treat").
- `Eyebrow`'s default color is `text-teal-500`, which reads correctly against the navy card background without an override — no new variant needed.

## Acceptance criteria mapping

- [ ] Copy driven by condition data — `headline`/`body` come from `condition.accidentBanner`.
- [ ] Hosts PIPCalculator on the right — `<PipCalculator />` in the right grid column.
- [ ] Responsive stack — `grid-cols-1 md:grid-cols-2`, single column below `md`, matching `ContactSection`'s existing responsive pattern.

## Out of scope

- Any condition-page route — doesn't exist yet (separate ticket). Verified via temporary, reverted Home mount only, per the `UnderstandingCondition` precedent.
- Background photo treatment — flat navy only, per user decision above.
- Adding a second condition (e.g. sciatica) to match the screenshot's copy verbatim — out of scope; `neckPainCondition` is this repo's only real condition entry.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- No test framework configured for components in this repo. Manual, dev server: confirm the navy card renders full container width with visible rounded corners, headline/body come from `neckPainCondition.accidentBanner`, the warning pill shows the teal "!" badge, `PipCalculator` renders and functions on the right, and the layout stacks to one column at 375px and returns to two columns at 1728px.
