# ConditionPage template — Design

**Ticket:** ATS-061 · Epic 5 – Condition engine · Track: Dev A · Est: L · Depends on: ATS-040,042,043,044,045,047,048,049,060 · ⭐ highest leverage
**Source:** ticket text (references condition-page-spec §B/§C, not present in this repo — same gap noted by every prior condition-page spec in this repo). No new Figma read attempted; the referenced node (96-250) is the same single decorative layer the 2026-07-29 condition-engine plan already hit rate-limited on.

## Summary

Assemble the one template — `app/conditions/[slug]/page.tsx` — that renders all condition pages from the `Condition` data already built in `content/conditions/` (ATS-060). This is composition only: every section component the template needs already exists and, for the two condition-specific bands (`UnderstandingCondition`, `AccidentBanner`), already takes `condition: Condition` directly. Two small new adapter components are needed to bridge two components whose existing prop shape predates the `Condition` schema (`ServiceGrid`'s `ServiceCardItem`, `FaqAccordion`'s `FAQ`).

## Resolved open decisions

- **Which slugs get static params:** the ticket's scope bullet lists exactly 4 slugs (`neck-pain`, `whiplash`, `back-pain`, `sciatica`). A 5th `Condition` file already exists (`content/conditions/auto-accident.ts`, slug `auto-accidents`) with accident-variant flags clearly built for this same template, but `siteConfig.nav` already points "Auto Accidents" at a top-level `/auto-accidents`, not `/conditions/auto-accidents`. Per user decision, this route only covers the 4 listed slugs — `/auto-accidents` is left for a future ticket to build as its own top-level route, reusing the same section components and the existing `autoAccidentCondition` data.
- **StillHaveQuestions:** the ticket's section order names a `StillHaveQuestions` band between WhatWeTreat and FAQ. That component (and `CtaBand`) existed (`13701b6`, `c8fa68d`) but was deliberately deleted (`4425679`, "home page updates") during a teammate's design rework and isn't used anywhere in the current codebase. Per user decision, it's omitted here rather than resurrected — section order goes WhatWeTreat → FAQ directly.
- **Hero variant:** `Hero`'s `variant="condition"` branch already exists and is already used by `/about` with a call-pill, no lead form, no bilingual note requirement. Condition pages follow that exact precedent (`conditionChip`/`title`/`subhead`/`background` from `condition.hero`, plus a `callPill`) rather than inventing a 3rd hero variant or adding a lead form the ticket doesn't ask for.
- **ComparisonTable wiring:** `ComparisonTable` already takes a `variant?: "default" | "auto-accident"` prop that internally selects rows from `content/comparison-table.ts` — the same rows `Condition.comparisonRows` was already pre-resolved from (ATS-060 plan). Rather than adding a redundant `rows` prop, the template derives `variant` from `condition.flags.extraComparisonRows`. (Moot for the 4 in-scope slugs today, since none set that flag, but keeps the mapping correct if `/auto-accidents` is later routed through the same components.)
- **DoctorBio / Testimonial:** both consume global, non-condition-specific content (`doctorProfileContent`, `homeFeaturedTestimonial`/`homeReviews`) exactly as `/services` and `/` already do — `Condition` has no per-condition doctor/testimonial fields, so there's nothing to wire.
- **BodyRegionSelector:** the ticket names it generically; the actual component is `PointToWhereItHurts`, fed by one shared `pointToWhereItHurtsContent` (not per-condition — `Condition` has no body-region field). Reused unchanged, same as Home.
- **WhatWeTreat adapter:** `ServiceGrid`'s doc comment already anticipates this ("generic over ServiceCardItem so condition's 'What we treat' grid can reuse it once condition content gains images" — which it now has). `ServiceCardItem` needs `slug`/`duration` that `ConditionWhatWeTreatItem` doesn't have; both are unused inside `ServiceCard`'s actual render (confirmed by reading the component), so the new `WhatWeTreat` section maps `slug: slugify(title)`, `duration: ""`, `name: title`, `summary: desc`, `image`. `item.href` (always `/services` in current content) isn't separately wired — `ServiceCard`'s "Book now" button already hardcodes `siteConfig.bookingCta.href` for every caller, and that's left unchanged.
- **FAQ adapter:** `FaqSection` is keyed by a static `pageKey: keyof typeof faqsByPage` lookup with items shaped `{question, answer}`; `Condition.faq.items` is `{q, a}`. Rather than widening `FaqSection`'s prop union for one caller, a small dedicated `ConditionFaq` section (same markup as `FaqSection`) takes `condition: Condition` directly and maps fields inline — matching this repo's established pattern of small, purpose-built section components (`UnderstandingCondition`, `AccidentBanner`) over generalizing shared ones.
- **Footer bundle:** "footer" in the ticket's section order is the same `LocationIntro` → `LocationFooter` → `ContactSection` bundle every other full page (Home/Services/About) renders above the global `Footer` (which is already mounted once in `RootShell` and needs no per-page wiring).
- **Metadata/OG:** no per-page OpenGraph metadata exists anywhere in this repo yet. `generateMetadata` builds `title`/`description` from `condition.hero`/`condition.name` plus `openGraph.title/description/images` (from `hero.backgroundImage`, resolved against `metadataBase` already set in `app/layout.tsx`) and `alternates.canonical`.
- **Sitemap:** `app/sitemap.ts` already has a comment flagging condition routes as pending on this exact ticket ("Add condition-page routes here once they ship... see content/conditions"). Since it's explicitly called out as blocked on this work and is a low-risk, additive one-line-per-route change, the 4 routes are added here too, even though not itemized in the ticket's acceptance criteria.

## Architecture

```
content/conditions/index.ts          — new: conditionsBySlug map (4 in-scope slugs)
components/sections/what-we-treat.tsx — new: <WhatWeTreat condition />
components/sections/condition-faq.tsx — new: <ConditionFaq condition />
app/conditions/[slug]/page.tsx        — new: generateStaticParams, generateMetadata, page
app/sitemap.ts                        — add 4 condition routes
```

No changes to any existing component (`Hero`, `UnderstandingCondition`, `AccidentBanner`, `ComparisonTable`, `DoctorProfile`, `PatientReviews`, `PointToWhereItHurts`, `ServiceGrid`, `ServiceCard`, `FaqAccordion`, `FaqJsonLd`, `LocationIntro`, `LocationFooter`, `ContactSection`). No new npm dependencies, no new design tokens.

## `content/conditions/index.ts`

```ts
import { backPainCondition } from "@/content/conditions/back-pain";
import { neckPainCondition } from "@/content/conditions/neck";
import { sciaticaCondition } from "@/content/conditions/sciatica";
import type { Condition } from "@/content/conditions/types";
import { whiplashCondition } from "@/content/conditions/whiplash";

/** The 4 condition-page routes this ticket covers (ATS-061). auto-accident.ts
 * is intentionally excluded — /auto-accidents is a separate top-level route
 * for a future ticket, not part of this dynamic [slug] group (see design doc). */
export const conditionsBySlug: Record<string, Condition> = {
  [neckPainCondition.slug]: neckPainCondition,
  [whiplashCondition.slug]: whiplashCondition,
  [backPainCondition.slug]: backPainCondition,
  [sciaticaCondition.slug]: sciaticaCondition,
};
```

## `components/sections/what-we-treat.tsx`

```tsx
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { ServiceGrid } from "@/components/ui/service-grid";
import type { Condition } from "@/content/conditions/types";

export interface WhatWeTreatProps {
  condition: Condition;
  className?: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Condition page's "What we treat" grid per condition-page-spec §B9:
 * reuses the existing ServiceGrid/ServiceCard pair (already built generic
 * for this reuse) via a field adapter — ConditionWhatWeTreatItem has no
 * slug/duration, and ServiceCard doesn't render either, so both are
 * synthesized here rather than widening ServiceCardItem for one caller. */
export function WhatWeTreat({ condition, className }: WhatWeTreatProps) {
  const items: ServiceCardItem[] = condition.whatWeTreat.map((item) => ({
    slug: slugify(item.title),
    name: item.title,
    duration: "",
    summary: item.desc,
    image: item.image,
  }));

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-14">
        <SectionHeading eyebrow="What we treat" className="items-center text-center">
          How we treat {condition.name}
        </SectionHeading>
        <ServiceGrid items={items} />
      </Container>
    </Section>
  );
}
```

## `components/sections/condition-faq.tsx`

```tsx
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Condition } from "@/content/conditions/types";
import type { FAQ } from "@/content/faqs";

export interface ConditionFaqProps {
  condition: Condition;
  className?: string;
}

/** FAQ section per condition-page-spec §B11/§C, condition-data-driven
 * variant of FaqSection: FaqSection is keyed by a static pageKey lookup
 * with {question, answer} items, while Condition.faq.items is {q, a} —
 * mapped inline here rather than widening FaqSection's prop union for one
 * caller. Ships its own FAQPage JSON-LD from the same items shown on screen. */
export function ConditionFaq({ condition, className }: ConditionFaqProps) {
  const items: FAQ[] = condition.faq.items.map(({ q, a }) => ({ question: q, answer: a }));

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Frequently asked questions"
          className="mx-auto max-w-2xl items-center text-center"
        >
          Everything you need to know about {condition.faq.headerTail}
        </SectionHeading>
        <div className="mx-auto w-full max-w-3xl">
          <FaqAccordion items={items} />
        </div>
        <FaqJsonLd items={items} />
      </Container>
    </Section>
  );
}
```

## `app/conditions/[slug]/page.tsx`

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { PointToWhereItHurts } from "@/components/sections/point-to-where-it-hurts";
import { UnderstandingCondition } from "@/components/sections/understanding-condition";
import { WhatWeTreat } from "@/components/sections/what-we-treat";
import { conditionsBySlug } from "@/content/conditions/index";
import { doctorProfileContent } from "@/content/doctor-profile";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

type ConditionPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(conditionsBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ConditionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) return {};

  const title = `${condition.hero.h1} | ${siteConfig.business.name}`;
  const description = condition.hero.subhead;
  const url = `${siteConfig.siteUrl}/conditions/${condition.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: condition.hero.backgroundImage.src }],
    },
  };
}

/** /conditions/[slug] template (ATS-061) per condition-page-spec §B (full),
 * §C: the single data-driven template every condition page renders through.
 * Section order: Hero → UnderstandingCondition → PointToWhereItHurts →
 * AccidentBanner → ComparisonTable → DoctorBio → Testimonial → WhatWeTreat →
 * ConditionFaq → footer bundle. StillHaveQuestions intentionally omitted
 * (see design doc — retired from the design system, not part of this
 * ticket's approved section order). auto-accidents intentionally excluded
 * from generateStaticParams (see design doc — separate top-level route). */
export default async function ConditionPage({ params }: ConditionPageProps) {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) notFound();

  return (
    <>
      <Hero
        variant="condition"
        background={condition.hero.backgroundImage}
        conditionChip={condition.hero.eyebrowChip}
        title={condition.hero.h1}
        subhead={condition.hero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
      />
      <UnderstandingCondition condition={condition} />
      <PointToWhereItHurts content={pointToWhereItHurtsContent} />
      <AccidentBanner condition={condition} />
      <ComparisonTable
        variant={condition.flags.extraComparisonRows ? "auto-accident" : "default"}
      />
      <DoctorProfile variant="short" content={doctorProfileContent} />
      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews} />
      <WhatWeTreat condition={condition} />
      <ConditionFaq condition={condition} />
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
```

## `app/sitemap.ts` addition

```ts
import { conditionsBySlug } from "@/content/conditions/index";

// ...
const routes: Route[] = [
  // ...existing entries...
  ...Object.keys(conditionsBySlug).map((slug) => ({
    path: `/conditions/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];
```

## Acceptance criteria mapping

- [ ] 4 condition routes render from their data files — `generateStaticParams` over `conditionsBySlug` (neck-pain, whiplash, back-pain, sciatica).
- [ ] Section order + spacing match spec §B — Hero → Understanding → BodyRegionSelector → AccidentBanner/PIP → ComparisonTable → DoctorBio → Testimonial → WhatWeTreat → FAQ → footer, using each section's own existing `Section`/`spacing` defaults (no per-page overrides).
- [ ] Selector + accordion + PIP calc interactive & accessible — `PointToWhereItHurts` (roving-tabindex radiogroup), `FaqAccordion` (aria-expanded/aria-controls), `PipCalculator` (inside `AccidentBanner`) are all reused unchanged from their existing, already-accessible implementations.
- [ ] Static generation works; metadata + JSON-LD present — `generateStaticParams` + `generateMetadata` (title/description/OG/canonical) + `FaqJsonLd` inside `ConditionFaq`.

## Out of scope

- `/auto-accidents` route — separate top-level route, future ticket (per user decision).
- `StillHaveQuestions` band — omitted (per user decision).
- Any change to existing shared section/UI components — all reused as-is.
- Nav updates (no "Conditions" dropdown/menu entries) — not in ticket scope.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build` (build is the real test here — confirms static generation succeeds for all 4 params).
- Manual, dev server: visit `/conditions/neck-pain`, `/conditions/whiplash`, `/conditions/back-pain`, `/conditions/sciatica` — confirm each renders condition-specific hero/understanding/accident/comparison/FAQ copy, the body-region selector and FAQ accordion are keyboard-operable, the PIP calculator works, and view-source shows the FAQPage JSON-LD script with items matching the visible accordion.
- Visit `/conditions/nonexistent` — confirm 404.
