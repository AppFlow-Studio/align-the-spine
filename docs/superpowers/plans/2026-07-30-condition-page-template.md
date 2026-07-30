# ConditionPage Template (ATS-061) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `app/conditions/[slug]/page.tsx` — the single data-driven template that renders all 4 in-scope condition pages (`neck-pain`, `whiplash`, `back-pain`, `sciatica`) from the `Condition` data already built in `content/conditions/` (ATS-060), by composing already-existing section components plus two small new adapter components.

**Architecture:** Every section this template needs already exists. `UnderstandingCondition` and `AccidentBanner` already take `condition: Condition` directly (built that way in the ATS-060 plan specifically for this ticket). `Hero`, `ComparisonTable`, `DoctorProfile`, `PatientReviews`, `PointToWhereItHurts`, `LocationIntro`, `LocationFooter`, `ContactSection` are reused exactly as `/about` and `/services` already use them, fed either by `condition.hero`/`condition.flags` or by the same global content those other pages already import. Two adapters are new because their target components' prop shapes predate the `Condition` schema: `WhatWeTreat` maps `Condition.whatWeTreat` into `ServiceGrid`'s existing `ServiceCardItem[]`, and `ConditionFaq` maps `Condition.faq` into `FaqAccordion`'s existing `FAQ[]`. Full design rationale, including two explicit scope decisions (auto-accidents excluded from this route; `StillHaveQuestions` band omitted), is in `docs/superpowers/specs/2026-07-30-condition-page-template-design.md`.

**Tech Stack:** Next.js 16.2.10 App Router (async `params`), React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies, no new design tokens, no new image assets.

## Global Constraints

- No component-level test framework in active use in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build` — same convention as every prior plan in `docs/superpowers/plans/`.
- Next.js 16's dynamic route `params` prop is `Promise<{ slug: string }>`, not a plain object — every function that receives it (`generateMetadata`, the page component) must be `async` and `await params` before use.
- `generateStaticParams` covers exactly 4 slugs: `neck-pain`, `whiplash`, `back-pain`, `sciatica`. Do not add `auto-accidents` — it's a separate top-level route left for a future ticket (see design doc's "Resolved open decisions").
- Do not recreate or reference `StillHaveQuestions`/`CtaBand` — deliberately omitted from this page's section order (see design doc).
- Do not modify any existing shared component (`Hero`, `UnderstandingCondition`, `AccidentBanner`, `ComparisonTable`, `DoctorProfile`, `PatientReviews`, `PointToWhereItHurts`, `ServiceGrid`, `ServiceCard`, `FaqAccordion`, `FaqJsonLd`, `LocationIntro`, `LocationFooter`, `ContactSection`) — this ticket is composition + two small new adapters only.
- Prettier's `@ianvs/prettier-plugin-sort-imports` runs on commit via lint-staged and will reorder/reformat imports automatically — don't hand-tune import order beyond writing correct, complete import statements.

---

### Task 1: `content/conditions/index.ts` — condition lookup map

**Files:**

- Create: `content/conditions/index.ts`

**Interfaces:**

- Consumes: `neckPainCondition` (`@/content/conditions/neck`), `whiplashCondition` (`@/content/conditions/whiplash`), `backPainCondition` (`@/content/conditions/back-pain`), `sciaticaCondition` (`@/content/conditions/sciatica`), `Condition` (`@/content/conditions/types`) — all already exist from ATS-060.
- Produces: `conditionsBySlug: Record<string, Condition>`, exported from `@/content/conditions` (barrel resolution) — consumed by Task 4 (`app/conditions/[slug]/page.tsx`) and Task 5 (`app/sitemap.ts`).

- [ ] **Step 1: Write `content/conditions/index.ts`**

```ts
import { backPainCondition } from "@/content/conditions/back-pain";
import { neckPainCondition } from "@/content/conditions/neck";
import { sciaticaCondition } from "@/content/conditions/sciatica";
import type { Condition } from "@/content/conditions/types";
import { whiplashCondition } from "@/content/conditions/whiplash";

/** The 4 condition-page routes this ticket covers (ATS-061). auto-accident.ts
 * is intentionally excluded — /auto-accidents is a separate top-level route
 * for a future ticket, not part of this dynamic [slug] group (see
 * docs/superpowers/specs/2026-07-30-condition-page-template-design.md). */
export const conditionsBySlug: Record<string, Condition> = {
  [neckPainCondition.slug]: neckPainCondition,
  [whiplashCondition.slug]: whiplashCondition,
  [backPainCondition.slug]: backPainCondition,
  [sciaticaCondition.slug]: sciaticaCondition,
};
```

- [ ] **Step 2: Verify types check**

Run: `npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 3: Verify the map has exactly the 4 expected keys and excludes auto-accidents**

Run: `grep -n "slug:" content/conditions/neck.ts content/conditions/whiplash.ts content/conditions/back-pain.ts content/conditions/sciatica.ts`
Expected: 4 lines, values `"neck-pain"`, `"whiplash"`, `"back-pain"`, `"sciatica"` — these are the exact keys `conditionsBySlug` will have (object keys are the `.slug` field of each imported const).

Run: `grep -n "auto-accident" content/conditions/index.ts`
Expected: no output (no match) — confirms `auto-accident.ts` was not imported.

- [ ] **Step 4: Commit**

```bash
git add content/conditions/index.ts
git commit -m "feat: add conditionsBySlug lookup map for the 4 in-scope condition routes"
```

---

### Task 2: `components/sections/what-we-treat.tsx` — WhatWeTreat grid adapter

**Files:**

- Create: `components/sections/what-we-treat.tsx`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`), `ServiceCardItem` (`@/components/ui/service-card`, existing — fields `slug`, `name`, `duration`, `summary`, `image`), `ServiceGrid` (`@/components/ui/service-grid`, existing, takes `items: ServiceCardItem[]`), `Section`/`Container`/`SectionHeading` (existing UI primitives).
- Produces: `WhatWeTreat({ condition, className? })` component, exported from `@/components/sections/what-we-treat` — consumed by Task 4.

- [ ] **Step 1: Write `components/sections/what-we-treat.tsx`**

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
 * for this exact reuse — see ServiceGrid's own doc comment) via a field
 * adapter. ConditionWhatWeTreatItem has no slug/duration and ServiceCard
 * doesn't render either (confirmed by reading the component), so both are
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

- [ ] **Step 2: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/what-we-treat.tsx
git commit -m "feat: add WhatWeTreat section adapting Condition data to ServiceGrid"
```

---

### Task 3: `components/sections/condition-faq.tsx` — condition-driven FAQ + JSON-LD

**Files:**

- Create: `components/sections/condition-faq.tsx`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`), `FAQ` (`@/content/faqs`, existing — fields `question`, `answer`), `FaqAccordion` (`@/components/ui/faq-accordion`, existing, takes `items: FAQ[]`), `FaqJsonLd` (`@/components/seo/faq-json-ld`, existing, takes `items: FAQ[]`), `Section`/`Container`/`SectionHeading` (existing UI primitives).
- Produces: `ConditionFaq({ condition, className? })` component, exported from `@/components/sections/condition-faq` — consumed by Task 4.

- [ ] **Step 1: Write `components/sections/condition-faq.tsx`**

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
 * counterpart to FaqSection: FaqSection is keyed by a static pageKey
 * lookup with {question, answer} items, while Condition.faq.items is
 * {q, a} — mapped inline here rather than widening FaqSection's prop union
 * for one caller. Ships its own FAQPage JSON-LD from the same items shown
 * on screen, per Google's requirement that structured data match visible
 * content (same pairing FaqSection already establishes). */
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

- [ ] **Step 2: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/condition-faq.tsx
git commit -m "feat: add ConditionFaq section with FAQPage JSON-LD"
```

---

### Task 4: `app/conditions/[slug]/page.tsx` — the template route

**Files:**

- Create: `app/conditions/[slug]/page.tsx`

**Interfaces:**

- Consumes: `conditionsBySlug` (`@/content/conditions`, Task 1), `WhatWeTreat` (`@/components/sections/what-we-treat`, Task 2), `ConditionFaq` (`@/components/sections/condition-faq`, Task 3), plus existing: `Hero` (`@/components/sections/hero`), `UnderstandingCondition` (`@/components/sections/understanding-condition`), `PointToWhereItHurts` (`@/components/sections/point-to-where-it-hurts`) + `pointToWhereItHurtsContent` (`@/content/point-to-where-it-hurts`), `AccidentBanner` (`@/components/sections/accident-banner`), `ComparisonTable` (`@/components/sections/comparison-table`), `DoctorProfile` (`@/components/sections/doctor-profile`) + `doctorProfileContent` (`@/content/doctor-profile`), `PatientReviews` (`@/components/sections/patient-reviews`) + `homeFeaturedTestimonial`/`homeReviews` (`@/content/testimonials`), `LocationIntro` (`@/components/layout/location-intro`), `LocationFooter` (`@/components/layout/location-footer`), `ContactSection` (`@/components/sections/contact-section`), `siteConfig` (`@/content/site`).
- Produces: default export `ConditionPage`, plus `generateStaticParams` and `generateMetadata` — this is the terminal task; nothing downstream in this plan consumes it.

- [ ] **Step 1: Write `app/conditions/[slug]/page.tsx`**

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
import { conditionsBySlug } from "@/content/conditions";
import { doctorProfileContent } from "@/content/doctor-profile";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

type ConditionPageProps = { params: Promise<{ slug: string }> };

/** Static params for the 4 in-scope condition routes (ATS-061). auto-accidents
 * intentionally excluded — see Global Constraints. */
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
 * AccidentBanner → ComparisonTable → DoctorProfile → PatientReviews →
 * WhatWeTreat → ConditionFaq → LocationIntro/LocationFooter/ContactSection.
 * StillHaveQuestions intentionally omitted and auto-accidents intentionally
 * excluded from generateStaticParams — both are explicit scope decisions,
 * see docs/superpowers/specs/2026-07-30-condition-page-template-design.md. */
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

- [ ] **Step 2: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 3: Build and confirm all 4 routes statically generate**

Run: `npm run build`
Expected: exits 0. Output includes 4 prerendered routes matching `/conditions/neck-pain`, `/conditions/whiplash`, `/conditions/back-pain`, `/conditions/sciatica` (Next prints a route table — look for `● /conditions/[slug]` with the 4 generated paths listed, or check `.next/server/app/conditions/` contains 4 subfolders after the build).

- [ ] **Step 4: Manual dev-server check**

Run: `npm run dev` (leave running), then visit each of:

- `http://localhost:3000/conditions/neck-pain`
- `http://localhost:3000/conditions/whiplash`
- `http://localhost:3000/conditions/back-pain`
- `http://localhost:3000/conditions/sciatica`
- `http://localhost:3000/conditions/nonexistent`

Expected: the first 4 each render condition-specific hero headline, understanding copy, accident-banner headline, FAQ questions, and "What we treat" cards distinct from one another (i.e., not showing the same condition's copy on every route). Confirm the body-region selector (arrow keys move focus + selection between hotspots) and FAQ accordion (click toggles open/closed, `+` rotates) are both operable, and the PIP calculator inside AccidentBanner accepts input. The 5th URL renders Next's standard 404 page. View-source (or the Elements/Network panel) on one condition route and confirm a `<script type="application/ld+json">` tag exists whose `mainEntity` question/answer pairs match the visible FAQ accordion text.

- [ ] **Step 5: Commit**

```bash
git add app/conditions/[slug]/page.tsx
git commit -m "feat: add ConditionPage template rendering all condition routes from data"
```

---

### Task 5: Add condition routes to the sitemap

**Files:**

- Modify: `app/sitemap.ts`

**Interfaces:**

- Consumes: `conditionsBySlug` (`@/content/conditions`, Task 1).
- Produces: no new exports — `sitemap()`'s existing return shape is unchanged, just gains 4 more entries.

- [ ] **Step 1: Read the current file to confirm line numbers before editing**

Run: `cat app/sitemap.ts` (or open it) — confirm the `routes` array and its comment ("Add condition-page routes here once they ship...") are still at the same location described below. If the file has diverged, adapt the edit to the actual current content rather than blindly pattern-matching this diff.

- [ ] **Step 2: Update `app/sitemap.ts`**

Replace:

```ts
import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";

/** Static route sitemap (ATS-131). /thank-you is excluded — it's a
 * post-conversion confirmation page marked `robots: { index: false }`
 * (see app/thank-you/page.tsx). Add condition-page routes here once they
 * ship (ATS-131 depends on those pages existing — see content/conditions). */
type Route = Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> & { path: string };

const routes: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/home-visits", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
```

With:

```ts
import type { MetadataRoute } from "next";

import { conditionsBySlug } from "@/content/conditions";
import { siteConfig } from "@/content/site";

/** Static route sitemap (ATS-131). /thank-you is excluded — it's a
 * post-conversion confirmation page marked `robots: { index: false }`
 * (see app/thank-you/page.tsx). Condition-page routes (ATS-061) are appended
 * below from the same conditionsBySlug map the [slug] route itself uses, so
 * the sitemap can't drift out of sync with the routes that actually exist. */
type Route = Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> & { path: string };

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

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
```

- [ ] **Step 3: Verify types check and lint pass**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0, no errors.

- [ ] **Step 4: Manual check**

With `npm run dev` running, visit `http://localhost:3000/sitemap.xml` and confirm it lists `/conditions/neck-pain`, `/conditions/whiplash`, `/conditions/back-pain`, `/conditions/sciatica` alongside the existing static routes.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add condition-page routes to the sitemap"
```

---

### Task 6: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full project verification**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors, and the build output confirms 4 prerendered `/conditions/*` routes (same check as Task 4 Step 3).

- [ ] **Step 2: Confirm no accidental references to the omitted StillHaveQuestions/CtaBand or the excluded auto-accidents route**

Run:

```bash
grep -rn "StillHaveQuestions\|CtaBand" app/conditions/ components/sections/what-we-treat.tsx components/sections/condition-faq.tsx
grep -n "auto-accident" app/conditions/[slug]/page.tsx content/conditions/index.ts
```

Expected: first command has no output (no match). Second command's only matches, if any, should be in code comments explaining the exclusion — not in `conditionsBySlug`'s object literal or `generateStaticParams`'s output.

- [ ] **Step 3: Confirm all 4 acceptance-criteria routes are reachable and distinct**

With `npm run dev` running (or `npm run start` after the Step 1 build), fetch each route and confirm distinct `<title>` values:

```bash
for slug in neck-pain whiplash back-pain sciatica; do
  curl -s "http://localhost:3000/conditions/$slug" | grep -o "<title>[^<]*</title>"
done
```

Expected: 4 different title strings, each containing the matching condition's `hero.h1` text (e.g. "Neck Pain Relief That Actually Lasts", "Whiplash Doesn't Always Hurt Right Away", "Back Pain Care Built Around Your Recovery", "Stop Living Around the Pain in Your Leg").

## Acceptance criteria mapping

- 4 condition routes render from their data files — Task 1 (`conditionsBySlug`) + Task 4 (`generateStaticParams`), verified by Task 4 Step 3/4 and Task 6 Step 3.
- Section order + spacing match spec §B — Task 4's `ConditionPage` JSX, using every section's own existing spacing defaults (no per-page overrides), verified visually in Task 4 Step 4.
- Selector + accordion + PIP calc interactive & accessible — reuses `PointToWhereItHurts`, `FaqAccordion`, `PipCalculator` (inside `AccidentBanner`) unchanged from their existing accessible implementations; interactivity spot-checked in Task 4 Step 4.
- Static generation works; metadata + JSON-LD present — Task 4's `generateStaticParams`/`generateMetadata`/`notFound()` plus Task 3's `ConditionFaq` (`FaqJsonLd`), verified by Task 4 Steps 3–4 and Task 6 Steps 1/3.

## Known gap (flagged, not blocking)

Per user decision during brainstorming, `/auto-accidents` (the 5th `Condition` entry, `content/conditions/auto-accident.ts`) is intentionally not routed through this template — it stays a separate top-level route for a future ticket, consistent with `siteConfig.nav`'s existing "Auto Accidents" → `/auto-accidents` link. `StillHaveQuestions`/`CtaBand` are intentionally not recreated — deliberately removed from the design system in a prior teammate commit (`4425679`, "home page updates") and, per user decision, not brought back for this ticket. Both are documented in full in `docs/superpowers/specs/2026-07-30-condition-page-template-design.md`.
