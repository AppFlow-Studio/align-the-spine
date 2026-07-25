# StillHaveQuestions + CTABand — Design

**Ticket:** Epic 4 – Sections · Track: Dev A · Est: S · Depends on: ATS-020
**Source:** ticket text (pasted directly). References condition-page-spec §B10 (not present in this repo — reconstructed from ticket text, same gap noted by prior specs for §B9/§B11/§C/§B2).

## Summary

Two recurring bands, both wired into the Home page (`app/page.tsx`) only for this ticket:

- **`StillHaveQuestions`**: full-bleed navy (`bg-navy-900` = `#253067`) band with a "Still have questions? Just Call" heading, the ATS-020 glass call-pill (`Button variant="glass"`), and a muted note line.
- **`CtaBand`**: light/neutral, button-focused closing band with a short heading and the existing "cta" button variant (arrow badge already built in), reusing `siteConfig.bookingCta.href`.

Both are config-driven via a new `content/cta-bands.ts`, following the same "page imports content, passes as props" convention `HowWeHelpSteps` already uses (rather than `FaqSection`'s internal `pageKey` lookup — this fits better since only one page uses this copy today, and each future page reusing the bands can supply its own object without a shared record needing every page baked in upfront).

## Resolved open decisions

- **Full-bleed layout**: `Section`/`Container` are already split (per `components/ui/section.tsx` / `container.tsx`) so the background can bleed edge-to-edge while inner content stays gutter-aligned — put `bg-navy-900` on the `Section`, keep `.container`'s max-width/padding on the nested `Container`. No new layout primitive needed.
- **No new design tokens**: `text-display` (clamp 36–65px / clamp 38–68px line-height / weight 500) already matches "Newsreader Medium 65/68" exactly; `text-body-lg` (25px/40px/400) matches "Poppins 25/40"; `mute-300` (`#cdcdcd`) matches the note color; `navy-900` (`#253067`) matches the band background. All reused as-is.
- **Call-pill reuse**: there is no standalone `CallPill` component (per ATS-020) — the glass call-pill is `Button variant="glass"` with an `eyebrow` prop. `StillHaveQuestions` reuses it identically to its existing usage in `Hero` and the home-visits inline band.
- **CTABand visual style**: no background color (transparent, letting the page's `panel-100` body background show through) — keeps it visually distinct from the navy `StillHaveQuestions` band directly above it on the Home page. Heading style matches `HowWeHelpSteps`' step-title treatment (`font-display text-h2 text-navy-800`); button is `Button variant="cta"`, which already renders the circular arrow badge — no new arrow markup needed.
- **CTABand copy**: not specified by the ticket beyond "Book an appointment →". Uses `"Ready to get started?"` as heading and `"Book an appointment"` as the button label (matching the exact label string already used for this href in `app/home-visits/page.tsx:113`), with `href: siteConfig.bookingCta.href` (`/book`).
- **home-visits page untouched**: its existing hand-rolled navy CTA card (`app/home-visits/page.tsx:90-107`) is a visually different treatment (rounded, inset, eligibility-specific copy) and is out of scope for this ticket — not refactored to use the new components.
- **Placement order on Home**: `Hero → ServicesSection → FaqSection → StillHaveQuestions → CtaBand`, matching the ticket's own framing (pre-FAQ "still have questions" band, then a closing generic booking CTA).

## Architecture

```
content/cta-bands.ts                    — new: StillHaveQuestionsContent, CtaBandContent + two config objects
components/sections/still-have-questions.tsx — new: <StillHaveQuestions content />
components/sections/cta-band.tsx        — new: <CtaBand content />
app/page.tsx                            — mount both after FaqSection
```

- Both are server components (no `"use client"`) — no interactivity beyond the existing `Button` component (which is itself already a server-renderable anchor/button, no client state).
- No new npm dependencies, no new icons (reuses `PhoneIcon` via `Button variant="glass"` and `ArrowRightIcon` via `Button variant="cta"`, both already wired into `components/ui/button.tsx`).

## `content/cta-bands.ts` (new)

```ts
import { siteConfig } from "@/content/site";

export interface StillHaveQuestionsContent {
  heading: string;
  eyebrow: string;
  phone: string;
  phoneHref: string;
  note: string;
}

export interface CtaBandContent {
  heading: string;
  cta: { label: string; href: string };
}

export const stillHaveQuestionsContent: StillHaveQuestionsContent = {
  heading: "Still have questions? Just Call",
  eyebrow: "Speak with us today",
  phone: `Call ${siteConfig.business.phone}`,
  phoneHref: siteConfig.business.phoneHref,
  note: "Dr. Abe Answers the phone. No call center, no hold music.",
};

export const ctaBandContent: CtaBandContent = {
  heading: "Ready to get started?",
  cta: { label: "Book an appointment", href: siteConfig.bookingCta.href },
};
```

## `StillHaveQuestions` props and markup

```ts
export interface StillHaveQuestionsProps {
  content: StillHaveQuestionsContent;
}
```

```tsx
export function StillHaveQuestions({ content }: StillHaveQuestionsProps) {
  return (
    <Section spacing="lg" className="bg-navy-900">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 className="font-display text-display text-white">{content.heading}</h2>
        <Button
          variant="glass"
          href={content.phoneHref}
          eyebrow={content.eyebrow}
          className="w-fit"
        >
          {content.phone}
        </Button>
        <p className="font-sans text-body-lg text-mute-300">{content.note}</p>
      </Container>
    </Section>
  );
}
```

## `CtaBand` props and markup

```ts
export interface CtaBandProps {
  content: CtaBandContent;
}
```

```tsx
export function CtaBand({ content }: CtaBandProps) {
  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-h2 text-navy-800">{content.heading}</h2>
        <Button variant="cta" href={content.cta.href}>
          {content.cta.label}
        </Button>
      </Container>
    </Section>
  );
}
```

## `app/page.tsx` change

- Import `StillHaveQuestions`, `CtaBand`, and `stillHaveQuestionsContent`, `ctaBandContent` from `content/cta-bands`.
- Render `<StillHaveQuestions content={stillHaveQuestionsContent} />` then `<CtaBand content={ctaBandContent} />` immediately after `<FaqSection pageKey="home" />`.

## Acceptance criteria mapping

- [x] Both bands implemented — `StillHaveQuestions` + `CtaBand`, mounted on Home.
- [x] Call-pill reused from ATS-020 — `Button variant="glass"`, same component/props shape as `Hero` and the home-visits band already use, not reimplemented.
- [x] Config-driven copy — `content/cta-bands.ts` is the single source of truth; components take `content` as a prop and render nothing hardcoded.
- [x] Responsive — `Section`/`Container` provide the existing fluid gutter behavior; `Button variant="glass"` already scales at `xl:`; both bands are single-column centered stacks at all widths (no layout that could overflow or misalign at 375px–1728px, matching the range other sections are built for).

## Out of scope

- Refactoring `app/home-visits/page.tsx`'s existing inline navy CTA card to use either new component — different visual treatment (rounded/inset vs. full-bleed), left alone per user decision.
- Wiring these bands into `app/book/page.tsx` or any other page — Home only, per user decision. Future pages can import the same components and supply their own `content/cta-bands.ts` object (or a page-keyed record, if/when the copy needs to vary per page — not needed yet, per YAGNI).
- Any animation/entrance treatment — `framer-motion` is installed but has no established usage pattern in `components/`; not introduced here.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- No test framework configured in this repo. Manual, dev server: confirm the navy band bleeds full viewport width with centered heading/pill/note, the call pill matches its appearance elsewhere (Hero, home-visits), the CTA band renders the arrow-badge button, and both look correct at mobile (375px), tablet, and desktop (1728px) widths.
