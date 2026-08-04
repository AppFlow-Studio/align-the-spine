# /auto-accident page — Design

**Ticket:** Epic 5 – Condition engine · Track: Dev A · Est: M · Depends on: ATS-061, ATS-046

## Summary

The accident/PIP landing page — same `ConditionPage` composition every condition page renders, plus three accident-only extras: an extra "HOW WE HELP" steps band, two extra comparison rows (already data-driven and automatic), and a "$10,000 in PIP coverage" stat block.

## Resolved decisions (from user)

- **Route path:** `/auto-accident` (singular), matching the ticket text literally — not `/auto-accidents` (plural), even though `siteConfig.nav`, the `Condition.slug` field, and every prior design doc in this repo use the plural form.
- **Nav links:** `siteConfig.nav`'s "Auto Accidents" and footer's "Accident Care" links (currently `/auto-accidents`, already dead 404s) are updated to `/auto-accident` as part of this ticket, so they point at the real page.
- **PIP stat placement:** rendered inside `AccidentBanner`, gated on `condition.flags.pipStat`, rather than as a new standalone section.
- **Template reuse:** the JSX body of `app/conditions/[slug]/page.tsx` is extracted into a shared `components/templates/condition-page.tsx` component, used by both the existing `[slug]` route and this new route — matching the ticket's own phrasing ("using ConditionPage + isAccidentVariant").
- **Hero title:** `content/conditions/auto-accident.ts`'s `hero.h1` is overwritten from `"Injured In A Crash? You Have 14 Days."` to the ticket's literal `"Injured in an Accident?"`. The 14-day urgency framing remains in `AccidentBanner`'s headline (`accident.headline`), which is unchanged.
- **FAQ tail copy:** `faq.headerTail` is updated from `"car accident injuries"` to `"accident care and PIP"`, per the ticket's literal copy.

## Architecture

```
content/conditions/auto-accident.ts    — edit: hero.h1, faq.headerTail
components/templates/condition-page.tsx — new: <ConditionPage condition /> (extracted shared body)
app/conditions/[slug]/page.tsx          — refactor: delegates rendering to <ConditionPage />
components/sections/accident-banner.tsx — edit: conditional PIP stat chip
app/auto-accident/page.tsx              — new: static route rendering <ConditionPage condition={autoAccidentCondition} />
content/site.ts                         — edit: nav + footer hrefs /auto-accidents → /auto-accident
app/sitemap.ts                          — add /auto-accident route entry
```

No changes to `Hero`, `UnderstandingCondition`, `PointToWhereItHurts`, `ComparisonTable`, `DoctorProfile`, `PatientReviews`, `HowWeHelpSteps`, `WhatWeTreat`, `ConditionFaq`, `LocationIntro`, `LocationFooter`, `ContactSection`, `content/comparison-table.ts`, or `content/auto-accident.ts`'s `autoAccidentSteps`. No new npm dependencies.

## `components/templates/condition-page.tsx`

Extracted verbatim from the current `app/conditions/[slug]/page.tsx` body, with one addition: a `HowWeHelpSteps` band gated on `condition.flags.isAccidentVariant`, inserted between `PatientReviews` and `WhatWeTreat`.

```tsx
import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { PointToWhereItHurts } from "@/components/sections/point-to-where-it-hurts";
import { UnderstandingCondition } from "@/components/sections/understanding-condition";
import { WhatWeTreat } from "@/components/sections/what-we-treat";
import { Section } from "@/components/ui/section";
import { autoAccidentSteps } from "@/content/auto-accident";
import type { Condition } from "@/content/conditions/types";
import { doctorProfileContent } from "@/content/doctor-profile";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

export interface ConditionPageProps {
  condition: Condition;
}

/** Shared section composition every condition page renders, per
 * condition-page-spec §C — extracted from app/conditions/[slug]/page.tsx
 * (ATS-061) so /auto-accident can reuse it with the accident-only
 * HowWeHelpSteps band gated on condition.flags.isAccidentVariant. */
export function ConditionPage({ condition }: ConditionPageProps) {
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
      {condition.flags.isAccidentVariant && (
        <Section spacing="lg" className="container">
          <HowWeHelpSteps
            heading="Three steps, no waiting room for accident care"
            steps={autoAccidentSteps}
            cta={{ label: "Schedule My Car Accident Evaluation", href: siteConfig.bookingCta.href }}
          />
        </Section>
      )}
      <WhatWeTreat condition={condition} />
      <ConditionFaq condition={condition} />
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
```

## `app/conditions/[slug]/page.tsx` (refactor)

Unchanged: `generateStaticParams`, `generateMetadata`, the `notFound()` guard. Changed: the JSX body is replaced with a call into the new template, and the route's own default export is renamed `Page` to avoid a name collision with the imported `ConditionPage` component.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConditionPage } from "@/components/templates/condition-page";
import { conditionsBySlug } from "@/content/conditions";
import { siteConfig } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(conditionsBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
      images: [
        { url: condition.hero.backgroundImage.src, alt: condition.hero.backgroundImage.alt },
      ],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) notFound();

  return <ConditionPage condition={condition} />;
}
```

## `components/sections/accident-banner.tsx` (edit)

Add a PIP stat chip, gated on `condition.flags.pipStat`, rendered right after the "Was this from an accident?" eyebrow. Reuses `StatChipRow`'s exact chip markup/classes (`dt`/`dd`, `stat-label`/`stat-value`, `bg-overlay-white-15`) for visual consistency, without importing `StatChipRow` itself (that component sources `siteConfig.stats` globally; this is one condition-specific stat).

```tsx
export function AccidentBanner({ condition, className }: AccidentBannerProps) {
  const { accident, flags } = condition;

  return (
    <Section className={className}>
      <Container>
        <div className="rounded-30 bg-navy-900 p-10 md:p-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6">
              <Eyebrow variant="onDark">Was this from an accident?</Eyebrow>
              {flags.pipStat && (
                <dl className="flex w-fit flex-col gap-0.5 bg-overlay-white-15 px-4 py-2">
                  <dt className="font-sans text-stat-label uppercase text-mute-300">
                    {flags.pipStat.label}
                  </dt>
                  <dd className="font-sans text-stat-value text-white">{flags.pipStat.value}</dd>
                </dl>
              )}
              <h2 className="font-display text-h2 md:text-understanding-intro text-white">
                {accident.headline}
              </h2>
              {/* ...body/smallprint/PipCalculator unchanged... */}
```

## `app/auto-accident/page.tsx` (new)

```tsx
import type { Metadata } from "next";

import { ConditionPage } from "@/components/templates/condition-page";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { siteConfig } from "@/content/site";

const condition = autoAccidentCondition;

const title = `${condition.hero.h1} | ${siteConfig.business.name}`;
const description = condition.hero.subhead;
const url = `${siteConfig.siteUrl}/auto-accident`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    images: [{ url: condition.hero.backgroundImage.src, alt: condition.hero.backgroundImage.alt }],
  },
};

export default function AutoAccidentPage() {
  return <ConditionPage condition={condition} />;
}
```

## `content/conditions/auto-accident.ts` (edit)

- `hero.h1`: `"Injured In A Crash? You Have 14 Days."` → `"Injured in an Accident?"`
- `faq.headerTail`: `"car accident injuries"` → `"accident care and PIP"`

No other fields change — `flags.isAccidentVariant`, `flags.extraComparisonRows`, `flags.pipStat`, and `comparisonRows` are already correctly set for this page.

## `content/site.ts` (edit)

- `nav`: `{ label: "Auto Accidents", href: "/auto-accidents" }` → `href: "/auto-accident"`
- `footer.links`: `{ label: "Accident Care", href: "/auto-accidents" }` → `href: "/auto-accident"`

## `app/sitemap.ts` (edit)

Add one static entry alongside the other one-off pages (`/services`, `/book`, `/home-visits`, `/about`):

```ts
{ path: "/auto-accident", changeFrequency: "monthly", priority: 0.8 },
```

## Acceptance criteria mapping

- [ ] Renders from auto-accident.ts with extras enabled — `app/auto-accident/page.tsx` renders `<ConditionPage condition={autoAccidentCondition} />`; `flags.isAccidentVariant`/`flags.extraComparisonRows`/`flags.pipStat` are all already set on that data.
- [ ] $10k PIP stat + extra comparison rows show — PIP stat via the new `AccidentBanner` chip (gated on `flags.pipStat`); extra rows via `ComparisonTable`'s existing `variant="auto-accident"` branch (gated on `flags.extraComparisonRows`), already wired in the extracted template.
- [ ] HowWeHelp steps present — new gated `HowWeHelpSteps` band in `components/templates/condition-page.tsx`, gated on `flags.isAccidentVariant`.

## Out of scope

- `/conditions/auto-accidents` dynamic-route slug — `content/conditions/index.ts`'s `conditionsBySlug` map stays at its current 4 entries; this ticket's route is the separate top-level `/auto-accident`.
- Any visual/Figma-detail verification beyond what's already documented — node 96-250 is the same decorative phone-icon layer every prior ticket touching this file hit; re-confirmed this session, not re-attempted further.
- Changing `ComparisonTable`, `HowWeHelpSteps`, or any condition-page section component's internals — all reused as-is except the one additive `AccidentBanner` chip.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build` (confirms both `/conditions/[slug]` static generation and the new `/auto-accident` static page build cleanly).
- Manual, dev server: visit `/auto-accident` — confirm hero title "Injured in an Accident?", PIP stat chip and 2 extra comparison rows render, HowWeHelpSteps band appears with its 3 steps, and the FAQ heading reads "...accident care and PIP". Re-visit `/conditions/neck-pain` (or another existing slug) to confirm the refactor didn't change its rendered output.
- Confirm nav "Auto Accidents" / footer "Accident Care" links now resolve to `/auto-accident` instead of 404ing.
