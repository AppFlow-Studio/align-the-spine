# /auto-accident page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `app/auto-accident/page.tsx` — the accident/PIP landing page — reusing the existing `/conditions/[slug]` template's section composition (extracted into a shared `ConditionPage` component) plus three accident-only extras: a `HowWeHelpSteps` band, a "$10,000 in PIP coverage" stat chip, and the already-data-driven extra comparison rows.

**Architecture:** The JSX body currently inline in `app/conditions/[slug]/page.tsx` is extracted into `components/templates/condition-page.tsx` as `ConditionPage({ condition })`, used by both the existing dynamic route and this new static route. The extracted template gains one new gated section (`HowWeHelpSteps`, on `condition.flags.isAccidentVariant`). `AccidentBanner` gains a small conditional stat chip (on `condition.flags.pipStat`). `content/conditions/auto-accident.ts`'s copy is updated to match the ticket's literal hero title and FAQ tail. `content/site.ts`'s nav/footer links and `app/sitemap.ts` are updated to point at the new route. Full rationale in `docs/superpowers/specs/2026-07-30-auto-accident-page-design.md`.

**Tech Stack:** Next.js 16.2.10 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No component-level test framework in active use in this repo (vitest exists but only covers pure `lib/` functions); verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server checks — same convention as every prior plan in `docs/superpowers/plans/`.
- The route is `/auto-accident` (singular) — a static page, not a dynamic `[slug]` segment. Do not add an `auto-accidents` (plural) entry anywhere, and do not add `autoAccidentCondition` to `content/conditions/index.ts`'s `conditionsBySlug` map.
- Do not modify `Hero`, `UnderstandingCondition`, `PointToWhereItHurts`, `ComparisonTable`, `DoctorProfile`, `PatientReviews`, `HowWeHelpSteps`, `WhatWeTreat`, `ConditionFaq`, `LocationIntro`, `LocationFooter`, `ContactSection`, or `content/comparison-table.ts` — all reused unchanged.
- Prettier's `@ianvs/prettier-plugin-sort-imports` runs on commit via lint-staged and will reorder/reformat imports automatically — don't hand-tune import order beyond writing correct, complete import statements.

---

### Task 1: `content/conditions/auto-accident.ts` — copy edits

**Files:**

- Modify: `content/conditions/auto-accident.ts`

**Interfaces:**

- Consumes: nothing new — this is a data-only edit to an existing exported const.
- Produces: `autoAccidentCondition.hero.h1` and `autoAccidentCondition.faq.headerTail` with new values, consumed by Task 4 (`app/auto-accident/page.tsx`).

- [ ] **Step 1: Update `hero.h1`**

In `content/conditions/auto-accident.ts`, change:

```ts
    h1: "Injured In A Crash? You Have 14 Days.",
```

to:

```ts
    h1: "Injured in an Accident?",
```

- [ ] **Step 2: Update `faq.headerTail`**

In the same file, change:

```ts
  faq: {
    headerTail: "car accident injuries",
```

to:

```ts
  faq: {
    headerTail: "accident care and PIP",
```

- [ ] **Step 3: Verify types check**

Run: `npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add content/conditions/auto-accident.ts
git commit -m "content: update auto-accident hero title and FAQ tail copy"
```

---

### Task 2: Extract `ConditionPage` template and add the accident-only HowWeHelpSteps band

**Files:**

- Create: `components/templates/condition-page.tsx`
- Modify: `app/conditions/[slug]/page.tsx`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`), `HowWeHelpSteps` + `HowWeHelpStep` (`@/components/sections/how-we-help-steps`, existing), `autoAccidentSteps` (`@/content/auto-accident`, existing), `Section` (`@/components/ui/section`, existing), plus every section component/content constant already used by `app/conditions/[slug]/page.tsx` today (`Hero`, `UnderstandingCondition`, `PointToWhereItHurts` + `pointToWhereItHurtsContent`, `AccidentBanner`, `ComparisonTable`, `DoctorProfile` + `doctorProfileContent`, `PatientReviews` + `homeFeaturedTestimonial`/`homeReviews`, `WhatWeTreat`, `ConditionFaq`, `LocationIntro`, `LocationFooter`, `ContactSection`, `siteConfig`).
- Produces: `ConditionPage({ condition }: { condition: Condition })`, exported from `@/components/templates/condition-page` — consumed by both `app/conditions/[slug]/page.tsx` (this task) and Task 4's `app/auto-accident/page.tsx`.

- [ ] **Step 1: Write `components/templates/condition-page.tsx`**

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
 * HowWeHelpSteps band gated on condition.flags.isAccidentVariant. Section
 * order: Hero → UnderstandingCondition → PointToWhereItHurts →
 * AccidentBanner → ComparisonTable → DoctorProfile → PatientReviews →
 * [HowWeHelpSteps, accident-variant only] → WhatWeTreat → ConditionFaq →
 * LocationIntro/LocationFooter/ContactSection. */
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

- [ ] **Step 2: Replace `app/conditions/[slug]/page.tsx`'s body with a call into the new template**

Replace the entire file with:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConditionPage } from "@/components/templates/condition-page";
import { conditionsBySlug } from "@/content/conditions";
import { siteConfig } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };

/** Static params for the 4 in-scope condition routes (ATS-061). auto-accident
 * intentionally excluded — it's the separate /auto-accident route. */
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

/** /conditions/[slug] route (ATS-061): resolves the slug against
 * conditionsBySlug and delegates rendering to the shared ConditionPage
 * template (components/templates/condition-page.tsx), which also backs
 * /auto-accident. */
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) notFound();

  return <ConditionPage condition={condition} />;
}
```

- [ ] **Step 3: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 4: Build and confirm the 4 existing condition routes still statically generate**

Run: `npm run build`
Expected: exits 0. Output still lists the 4 prerendered `/conditions/*` routes (`neck-pain`, `whiplash`, `back-pain`, `sciatica`) — same set as before this refactor.

- [ ] **Step 5: Manual regression check on one existing route**

Run: `npm run dev` (leave running), visit `http://localhost:3000/conditions/neck-pain`.
Expected: renders identically to before the refactor — hero, understanding, accident banner, comparison table, doctor profile, reviews, what-we-treat, FAQ, footer bundle all present. No `HowWeHelpSteps` band appears (neck-pain's `flags.isAccidentVariant` is `false`/unset).

- [ ] **Step 6: Commit**

```bash
git add components/templates/condition-page.tsx app/conditions/[slug]/page.tsx
git commit -m "refactor: extract ConditionPage template, add accident-variant HowWeHelpSteps band"
```

---

### Task 3: `components/sections/accident-banner.tsx` — PIP stat chip

**Files:**

- Modify: `components/sections/accident-banner.tsx`

**Interfaces:**

- Consumes: `condition.flags.pipStat` (`@/content/conditions/types`, existing field, shape `{ label: string; value: string } | undefined`).
- Produces: no new exports — `AccidentBanner`'s existing props/signature is unchanged, it just renders one more conditional element.

- [ ] **Step 1: Add the PIP stat chip**

In `components/sections/accident-banner.tsx`, change:

```tsx
export function AccidentBanner({ condition, className }: AccidentBannerProps) {
  const { accident } = condition;

  return (
    <Section className={className}>
      <Container>
        <div className="rounded-30 bg-navy-900 p-10 md:p-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6">
              <Eyebrow variant="onDark">Was this from an accident?</Eyebrow>
              <h2 className="font-display text-h2 md:text-understanding-intro text-white">
```

to:

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
```

(Everything below the `<h2>` — body paragraph, smallprint pill, `PipCalculator` column — is unchanged.)

- [ ] **Step 2: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 3: Manual regression check**

With `npm run dev` running, visit `http://localhost:3000/conditions/neck-pain` again.
Expected: no stat chip appears above the accident-banner headline (`neck-pain`'s `flags.pipStat` is unset) — banner looks identical to before this change.

- [ ] **Step 4: Commit**

```bash
git add components/sections/accident-banner.tsx
git commit -m "feat: render PIP stat chip in AccidentBanner when condition.flags.pipStat is set"
```

---

### Task 4: `app/auto-accident/page.tsx` — the new route

**Files:**

- Create: `app/auto-accident/page.tsx`

**Interfaces:**

- Consumes: `ConditionPage` (`@/components/templates/condition-page`, Task 2), `autoAccidentCondition` (`@/content/conditions/auto-accident`, Task 1's edited copy), `siteConfig` (`@/content/site`).
- Produces: default export page component + static `metadata` — this is the terminal task for the route itself; Task 5 depends on `content/site.ts`'s nav (separate file, no code dependency on this task), Task 6 depends on nothing from this task either (sitemap only needs the path string).

- [ ] **Step 1: Write `app/auto-accident/page.tsx`**

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

/** /auto-accident page: renders the shared ConditionPage template
 * (components/templates/condition-page.tsx) fed with autoAccidentCondition,
 * whose flags.isAccidentVariant/extraComparisonRows/pipStat gate the
 * accident-only extras (HowWeHelpSteps band, extra comparison rows, PIP
 * stat chip) automatically. */
export default function AutoAccidentPage() {
  return <ConditionPage condition={condition} />;
}
```

- [ ] **Step 2: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exits 0. Output now includes a prerendered `/auto-accident` route alongside the 4 `/conditions/*` routes.

- [ ] **Step 4: Manual dev-server check**

With `npm run dev` running, visit `http://localhost:3000/auto-accident`.

Expected, in order down the page:

- Hero title reads "Injured in an Accident?"
- `AccidentBanner` shows the "Florida PIP Coverage — $10,000" stat chip above its headline, and the `PipCalculator` on the right accepts input
- The comparison table includes 5 rows total — the 3 base rows (Travel, Availability, Comfort) plus "Your Doctor" (same doctor every visit) and "Attorney Referrals" (no referral needed)
- A "How We Help" 3-step band appears (Call/request evaluation → Full accident evaluation → Treatment plan handled) with a "Schedule My Car Accident Evaluation" CTA button
- FAQ section heading reads "Everything you need to know about accident care and PIP"

View-source and confirm a `<script type="application/ld+json">` FAQPage block is present, matching the visible FAQ accordion.

- [ ] **Step 5: Commit**

```bash
git add app/auto-accident/page.tsx
git commit -m "feat: add /auto-accident route rendering the accident-variant ConditionPage"
```

---

### Task 5: Fix nav/footer links to point at the new route

**Files:**

- Modify: `content/site.ts`

**Interfaces:**

- Consumes: nothing new.
- Produces: no new exports — `siteConfig.nav` and `siteConfig.footer.links` keep their existing shape, only two `href` values change.

- [ ] **Step 1: Update the nav link**

In `content/site.ts`, change:

```ts
    { label: "Auto Accidents", href: "/auto-accidents" },
```

to:

```ts
    { label: "Auto Accidents", href: "/auto-accident" },
```

- [ ] **Step 2: Update the footer link**

In the same file, change:

```ts
      { label: "Accident Care", href: "/auto-accidents" },
```

to:

```ts
      { label: "Accident Care", href: "/auto-accident" },
```

- [ ] **Step 3: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 4: Manual check**

With `npm run dev` running, load any page, click the navbar's "Auto Accidents" link and the footer's "Accident Care" link.
Expected: both navigate to `/auto-accident` and render the page built in Task 4 (no 404).

- [ ] **Step 5: Commit**

```bash
git add content/site.ts
git commit -m "fix: point nav/footer accident links at /auto-accident"
```

---

### Task 6: Add `/auto-accident` to the sitemap

**Files:**

- Modify: `app/sitemap.ts`

**Interfaces:**

- Consumes: nothing new — just one more literal `Route` entry in the existing `routes` array.
- Produces: no new exports — `sitemap()`'s return shape is unchanged, gains one more entry.

- [ ] **Step 1: Read the current file to confirm it matches what's below**

Run: `cat app/sitemap.ts` — confirm the `routes` array still looks like the version committed in the ConditionPage-template ticket (ATS-061), with `/home-visits`, `/about`, etc. as literal entries followed by the `conditionsBySlug`-derived spread. If it has diverged, adapt the edit to the actual current content rather than blindly pattern-matching this diff.

- [ ] **Step 2: Add the new route entry**

Change:

```ts
const routes: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/home-visits", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  ...Object.keys(conditionsBySlug).map((slug) => ({
    path: `/conditions/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];
```

to:

```ts
const routes: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/home-visits", changeFrequency: "monthly", priority: 0.8 },
  { path: "/auto-accident", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  ...Object.keys(conditionsBySlug).map((slug) => ({
    path: `/conditions/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];
```

- [ ] **Step 3: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 4: Manual check**

With `npm run dev` running, visit `http://localhost:3000/sitemap.xml` and confirm `/auto-accident` is listed alongside the existing routes.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add /auto-accident to the sitemap"
```

---

### Task 7: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full project verification**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors. Build output includes prerendered routes for `/auto-accident` and all 4 `/conditions/*` slugs.

- [ ] **Step 2: Confirm the acceptance criteria end to end**

With `npm run dev` running (or `npm run start` after the Step 1 build):

```bash
curl -s "http://localhost:3000/auto-accident" | grep -o "<title>[^<]*</title>"
```

Expected: title contains "Injured in an Accident?".

```bash
curl -s "http://localhost:3000/auto-accident" | grep -o "Florida PIP Coverage"
curl -s "http://localhost:3000/auto-accident" | grep -o "\$10,000"
curl -s "http://localhost:3000/auto-accident" | grep -o "Your Doctor"
curl -s "http://localhost:3000/auto-accident" | grep -o "Attorney Referrals"
curl -s "http://localhost:3000/auto-accident" | grep -o "How We Help"
```

Expected: every command returns a match.

- [ ] **Step 3: Confirm existing condition routes weren't regressed**

```bash
for slug in neck-pain whiplash back-pain sciatica; do
  curl -s "http://localhost:3000/conditions/$slug" | grep -o "<title>[^<]*</title>"
done
```

Expected: 4 distinct title strings, same as before this ticket's changes (unaffected by the `ConditionPage` extraction or the `AccidentBanner` chip, since none of those 4 conditions set `flags.isAccidentVariant`/`flags.pipStat`).

## Acceptance criteria mapping

- Renders from auto-accident.ts with extras enabled — Task 4 (`app/auto-accident/page.tsx` renders `<ConditionPage condition={autoAccidentCondition} />`), verified in Task 4 Step 4 and Task 7 Step 2.
- $10k PIP stat + extra comparison rows show — Task 3 (PIP chip, gated on `flags.pipStat`) + the pre-existing `ComparisonTable` `variant="auto-accident"` branch (gated on `flags.extraComparisonRows`, wired in Task 2's extracted template), verified in Task 4 Step 4 and Task 7 Step 2.
- HowWeHelp steps present — Task 2's gated `HowWeHelpSteps` band (on `flags.isAccidentVariant`), verified in Task 4 Step 4 and Task 7 Step 2.

## Known decisions (from brainstorming)

Full rationale in `docs/superpowers/specs/2026-07-30-auto-accident-page-design.md`. Summary: the route is `/auto-accident` (singular, per user decision) even though `siteConfig.nav`/`Condition.slug`/prior docs use the plural form — Task 5 updates the two nav/footer links so they aren't left pointing at a dead plural URL. `content/conditions/auto-accident.ts`'s `hero.h1` and `faq.headerTail` are overwritten to match the ticket's literal copy (Task 1), which changes previously-authored content (the 14-day urgency framing moves out of the H1 but remains in `AccidentBanner`'s headline, unchanged).
