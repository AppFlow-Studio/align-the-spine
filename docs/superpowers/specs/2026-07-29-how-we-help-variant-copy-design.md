# HOW WE HELP — Variant Copy Design

**Ticket:** Epic 4 · Track Dev A · Est M · Depends on ATS-022 (base UI primitives — already merged)

## Summary

Generalize the existing "HOW WE HELP" 3-step section so it's ready to serve both the Home-visits page (already live) and the not-yet-built `/auto-accidents` page, driven entirely by content props rather than hardcoded copy.

## Context

`components/sections/how-we-help-steps.tsx` already exists (built under ATS-110 for `/home-visits`) and already renders exactly what the ticket's reference screenshot shows: eyebrow, 3 photo-steps with a thin divider above each title, description, and a closing CTA button. Structurally it's already variant-agnostic — `HowWeHelpStepsProps` takes `heading`, `steps`, and `cta` as plain props; nothing about the component itself is Home-visits-specific except that its one `HowWeHelpStep` type currently lives inside `content/home-visits.ts`.

The Figma MCP tool hit its call-limit for this session, so the auto-accident-specific node specs (Frame 13/14/12, node-ids `1:1742`/`1:1754`/`1:1759`) referenced in the ticket could not be pulled. Per user decision, this gap is resolved by matching the already-confirmed, currently-live visual treatment (screenshot) rather than guessing at a numbered/connector-line variant.

`/auto-accidents` does not exist yet in this codebase (confirmed via grep — comments elsewhere call it "not-yet-built"). ATS-022, the ticket's stated dependency, turned out to be the base UI primitives (`Section`, `Container`, `Card`, `Badge`, `Divider`), already merged into `sardor-dev` — not the auto-accidents route itself.

## Decisions (from user)

1. **Connector/visual treatment:** match the current live design exactly (photo + thin divider line + title + copy, no numbered badges, no connector lines). No visual changes to the component.
2. **Verification:** since `/auto-accidents` doesn't exist, verify the new variant with a temporary mount on `app/page.tsx` (Home), confirmed in the dev server, then reverted — no net change to `app/page.tsx`. Matches this repo's existing convention (used for `understanding-condition.tsx` and `point-to-where-it-hurts.tsx`).
3. **ServiceAreas "slot":** the ticket's mention of "eligibility + ServiceAreas slot" for the Home-visits variant is background context, not a new requirement — `ServiceAreas` already renders as its own separate section elsewhere on `/home-visits` and is unrelated to this component. No slot/children prop added.

## Architecture

- `components/sections/how-we-help-steps.tsx` is unchanged behaviorally. The `HowWeHelpStep` interface moves from `content/home-visits.ts` into this file (co-located with the component that owns the contract) and is exported from there — the same pattern `ServiceCardItem` already uses (defined in `components/ui/service-card.tsx`, imported by two content files).
- `content/home-visits.ts` drops its own `HowWeHelpStep` definition and imports the type from the component instead. `homeVisitSteps` itself is unchanged.
- New `content/auto-accident.ts` is added — the first content seeded for the future `/auto-accidents` page — exporting:
  - `autoAccidentSteps: HowWeHelpStep[]`
  - `autoAccidentHowWeHelpHeading: string`
  - `autoAccidentHowWeHelpCta: { label: string; href: string }`
- No new props, no `variant` enum on the component — each page supplies its own content object, matching how the component already works today.

## Content

Auto-accident steps (claim/PIP framing, reusing the 3 existing images since they're thematically generic and no new Figma assets are available while the MCP tool is rate-limited):

1. **"Call or request your evaluation"** (`/figma-exports/home-visits-step-call.png`) — tell us about the accident and when it happened; same-day answer; PIP-covered framing.
2. **"Full accident evaluation"** (`/figma-exports/home-visits-step-eligibility.png`) — a complete exam, documented the way a claim (and attorney, if any) needs.
3. **"Your treatment plan, handled"** (`/figma-exports/home-visits-step-visit.png`) — PIP billed directly; no chasing paperwork.

CTA label reuses `"Schedule My Car Accident Evaluation"` — the exact copy already established in `content/lead-forms.ts`'s `carAccident` variant, for tone consistency.

Heading: a new line in the same voice as the existing `"Three steps, no waiting room"` (Home-visits), written for the auto-accident context.

## Acceptance Criteria Mapping

- [x] 3 steps render from data with variant copy — content-driven via `content/auto-accident.ts`, same component.
- [x] Connector treatment matches design — matches the confirmed live/screenshot treatment (thin divider), per user decision; numbered-badge treatment explicitly deferred pending real Figma dev-mode specs.
- [x] Responsive stack — already implemented (`grid sm:grid-cols-3`, single column below `sm`); no change needed.

## Known Gap (flagged, not blocking)

Frame 13/14/12 dev-mode specs for the actual auto-accident Figma frames were never pulled (Figma MCP rate-limited this session). If those specs later reveal a genuinely different visual treatment (e.g., real numbered connectors), that would be a follow-up ticket, not a redo of this one — the component's data-driven structure makes that a low-cost future change.

## Testing

No component-test framework in active use in this repo (consistent with every prior plan) — verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus a temporary manual dev-server mount to visually confirm the auto-accident copy renders correctly before removing the mount.
