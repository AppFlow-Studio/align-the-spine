# Service presentation components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `ServiceCard`, `ServiceGrid`, and `ServiceListRow` — content-driven presentational components fed by `content/services.ts` — plus a `ServicesSection` that wires `ServiceListRow` into the home page as the concrete, live usage.

**Architecture:** `content/services.ts`'s `Service` gains an `image: { src, alt }` field and 6 real entries. `ServiceCardItem` (a small structural type — `slug`/`name`/`summary`/`image`) is declared in `components/ui/service-card.tsx` and consumed by `ServiceGrid` and `ServiceListRow` so any future data shape (e.g. `Condition` + an image field) can reuse these components without modification. `ServiceCard` composes the existing `Card`, `Button variant="ghost"`; `ServiceGrid` is a responsive CSS grid of `ServiceCard`s; `ServiceListRow` is a single alternating image/text row (no `Divider` baked in — consumer places it). `ServicesSection` (`components/sections/services-section.tsx`, server component) composes `Section`/`Container`/`SectionHeading` + a `ServiceListRow`/`Divider` list from `content/services.ts`, mounted on `app/page.tsx` below `FaqSection`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No test framework exists in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- Typography/color: reuse existing tokens only — `text-navy-800` (`#2b3565`), `text-ink-900` (`#1a1a1a`), `font-display`/`font-sans`/`font-alt`, `rounded-15`/`rounded-20`, `shadow-card`. Two new fontSize tokens are added in Task 1 (`card-title`, `card-body`) because no existing token matches "Newsreader Medium 35" or "Poppins 22/38" exactly.
- "Book now"/"Book" reuse the **existing** `Button variant="ghost"` (`components/ui/button.tsx`) unchanged — do not add a new button variant.
- Booking links point at `siteConfig.bookingCta.href` (`@/content/site`) — no per-service route exists.
- `ServiceGrid`/`ServiceCard`/`ServiceListRow` must depend only on the structural `ServiceCardItem` type (declared once, imported by the other two), never on `content/services.ts`'s `Service` type by name — this is what lets a future condition-page ticket reuse them.
- No `/services` page route or condition-page route is created by this plan — neither exists in `app/` yet, and creating one is out of scope (see spec's "Out of scope").

---

### Task 1: Add `card-title`/`card-body` type tokens

**Files:**

- Modify: `tailwind.config.ts:58-82` (the `fontSize` object)

**Interfaces:**

- Produces: Tailwind utility classes `text-card-title` (35px/42px, weight 500) and `text-card-body` (22px/38px, weight 400). Consumed by Task 2's `ServiceCard` and Task 4's `ServiceListRow`.

- [ ] **Step 1: Add the two tokens to `tailwind.config.ts`**

Current end of the `fontSize` object (`tailwind.config.ts:76-81`):

```ts
        "footer-heading": [
          "25px",
          { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "500" },
        ],
        "footer-copy": ["20px", { lineHeight: "32px", fontWeight: "400" }],
      },
```

Replace with:

```ts
        "footer-heading": [
          "25px",
          { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "500" },
        ],
        "footer-copy": ["20px", { lineHeight: "32px", fontWeight: "400" }],
        "card-title": ["35px", { lineHeight: "42px", fontWeight: "500" }],
        "card-body": ["22px", { lineHeight: "38px", fontWeight: "400" }],
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
git commit -m "feat: add card-title and card-body type tokens"
```

---

### Task 2: Extend `content/services.ts` with `image` + real service data

**Files:**

- Modify: `content/services.ts` (full rewrite, 5 lines → new structure below)

**Interfaces:**

- Produces: `Service` (`{ slug: string; name: string; summary: string; image: { src: string; alt: string } }`), `services: Service[]` (6 entries). Consumed by Task 5's `ServicesSection`.

- [ ] **Step 1: Rewrite `content/services.ts`**

```ts
export interface Service {
  slug: string;
  name: string;
  summary: string;
  image: { src: string; alt: string };
}

export const services: Service[] = [
  {
    slug: "chiropractic-adjustments",
    name: "Chiropractic Adjustments",
    summary:
      "Precise, hands-on spinal adjustments that restore alignment, relieve pressure on irritated nerves, and get you moving without pain.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
  },
  {
    slug: "spinal-decompression",
    name: "Spinal Decompression & Traction",
    summary:
      "Gentle, controlled traction that takes pressure off compressed discs and nerves — ideal for herniated discs, sciatica, and chronic low back pain.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Spinal traction and decompression therapy",
    },
  },
  {
    slug: "cupping-therapy",
    name: "Cupping Therapy",
    summary:
      "Targeted suction therapy that boosts circulation, loosens tight muscles, and speeds recovery from soft-tissue injuries and chronic tension.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Cupping therapy treatment" },
  },
  {
    slug: "soft-tissue-therapy",
    name: "Soft Tissue Therapy",
    summary:
      "Hands-on myofascial release and massage techniques that break up scar tissue, ease muscle spasms, and restore healthy range of motion.",
    image: { src: "/figma-exports/drabe-softtissue.png", alt: "Soft tissue therapy treatment" },
  },
  {
    slug: "at-home-visits",
    name: "At-Home Visits",
    summary:
      "Full chiropractic care delivered right to your door — the same elite treatment you'd get in the office, built around your schedule and mobility.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe providing an at-home chiropractic visit",
    },
  },
  {
    slug: "new-patient-exam",
    name: "New Patient Exam & X-Ray",
    summary:
      "A thorough consultation, hands-on exam, and on-site imaging to pinpoint the cause of your pain before we build your personalized treatment plan.",
    image: {
      src: "/figma-exports/drabe-xray-newpt.png",
      alt: "New patient exam and X-ray evaluation",
    },
  },
];
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add content/services.ts
git commit -m "feat: add image field and real content to services.ts"
```

---

### Task 3: `ServiceCard` component

**Files:**

- Create: `components/ui/service-card.tsx`

**Interfaces:**

- Consumes: `Card` (`@/components/ui/card`, `{ as?, radius?, shadow?, className?, ...HTMLAttributes }`); `Button` (`@/components/ui/button`, `{ variant?, href?, className?, children }`); `siteConfig` (`@/content/site`, uses `siteConfig.bookingCta.href`); `Image` (`next/image`); `cn` (`@/lib/cn`).
- Produces: `ServiceCardItem` (`{ slug: string; name: string; summary: string; image: { src: string; alt: string } }`) and `ServiceCard` named export, props `{ item: ServiceCardItem; className?: string }`. `ServiceCardItem` is consumed by Task 4's `ServiceGrid` and Task 4's `ServiceListRow`.

- [ ] **Step 1: Write `components/ui/service-card.tsx`**

```tsx
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface ServiceCardItem {
  slug: string;
  name: string;
  summary: string;
  image: { src: string; alt: string };
}

export interface ServiceCardProps {
  item: ServiceCardItem;
  className?: string;
}

/** Service card per condition-page-spec §B9: image (r15), title (Newsreader
 * Medium 35 navy-800), description (Poppins 22/38 ink-900), "Book now" ghost
 * link. Card r20, ~507×618 proportions via aspect-ratio (not hardcoded px)
 * so ServiceGrid can collapse responsively. */
export function ServiceCard({ item, className }: ServiceCardProps) {
  return (
    <Card radius={20} shadow="card" className={cn("flex flex-col overflow-hidden", className)}>
      <div className="relative aspect-[507/360] w-full shrink-0">
        <Image src={item.image.src} alt={item.image.alt} fill className="rounded-15 object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-8">
        <h3 className="font-display text-card-title text-navy-800">{item.name}</h3>
        <p className="font-sans text-card-body text-ink-900">{item.summary}</p>
        <Button variant="ghost" href={siteConfig.bookingCta.href} className="mt-auto w-fit">
          Book now
        </Button>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/service-card.tsx
git commit -m "feat: add ServiceCard component"
```

---

### Task 4: `ServiceGrid` and `ServiceListRow` components

**Files:**

- Create: `components/ui/service-grid.tsx`
- Create: `components/ui/service-list-row.tsx`

**Interfaces:**

- Consumes: `ServiceCardItem`, `ServiceCard` (`@/components/ui/service-card`, from Task 3); `Button` (`@/components/ui/button`); `siteConfig` (`@/content/site`); `Image` (`next/image`); `cn` (`@/lib/cn`).
- Produces: `ServiceGrid` named export, props `{ items: ServiceCardItem[]; className?: string }`. `ServiceListRow` named export, props `{ item: ServiceCardItem; reverse?: boolean; className?: string }`. Both consumed by Task 5's `ServicesSection` (`ServiceListRow` only) and future tickets (`ServiceGrid`, not mounted by this plan).

- [ ] **Step 1: Write `components/ui/service-grid.tsx`**

```tsx
import { ServiceCard, type ServiceCardItem } from "@/components/ui/service-card";
import { cn } from "@/lib/cn";

export interface ServiceGridProps {
  items: ServiceCardItem[];
  className?: string;
}

/** Responsive 3×2 service grid per condition-page-spec §B9: 1 col (mobile)
 * → 2 col (sm) → 3 col (lg). Generic over ServiceCardItem so condition's
 * "What we treat" grid can reuse it once condition content gains images. */
export function ServiceGrid({ items, className }: ServiceGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <ServiceCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write `components/ui/service-list-row.tsx`**

```tsx
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface ServiceListRowProps {
  item: ServiceCardItem;
  /** Alternates image side per row index — true puts the image on the right. */
  reverse?: boolean;
  className?: string;
}

/** Alternating list-style service row per condition-page-spec §B9
 * (services-3 / homepage list layout): image one side, title/description/
 * "Book" ghost link the other. No divider baked in — the consumer renders
 * one between rows (see ServicesSection). */
export function ServiceListRow({ item, reverse = false, className }: ServiceListRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 py-8 md:flex-row md:items-center md:gap-10",
        reverse && "md:flex-row-reverse",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 md:w-[360px]">
        <Image src={item.image.src} alt={item.image.alt} fill className="rounded-15 object-cover" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-3">
        <h3 className="font-display text-card-title text-navy-800">{item.name}</h3>
        <p className="font-sans text-card-body text-ink-900">{item.summary}</p>
        <Button variant="ghost" href={siteConfig.bookingCta.href}>
          Book
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add components/ui/service-grid.tsx components/ui/service-list-row.tsx
git commit -m "feat: add ServiceGrid and ServiceListRow components"
```

---

### Task 5: `ServicesSection` and homepage wiring

**Files:**

- Create: `components/sections/services-section.tsx`
- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `ServiceListRow` (`@/components/ui/service-list-row`, from Task 4); `Divider` (`@/components/ui/divider`, `{ orientation?, className? }`); `Section` (`@/components/ui/section`); `Container` (`@/components/ui/container`); `SectionHeading` (`@/components/ui/section-heading`); `services` (`@/content/services`, from Task 2); `FaqSection` (`@/components/sections/faq-section`, existing).
- Produces: `ServicesSection` named export (no props). Mounted in `app/page.tsx` below `<FaqSection pageKey="home" />`.

- [ ] **Step 1: Write `components/sections/services-section.tsx`**

```tsx
import { Fragment } from "react";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceListRow } from "@/components/ui/service-list-row";
import { services } from "@/content/services";

/** Homepage services list per condition-page-spec §B9 (services-3 /
 * homepage list layout): alternating ServiceListRow entries separated by
 * Divider hairlines, fed by content/services.ts. */
export function ServicesSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-2">
        <SectionHeading
          eyebrow="Our services"
          className="mx-auto max-w-2xl items-center text-center"
        >
          How we help you move without pain
        </SectionHeading>
        {services.map((service, i) => (
          <Fragment key={service.slug}>
            {i > 0 && <Divider />}
            <ServiceListRow item={service} reverse={i % 2 === 1} />
          </Fragment>
        ))}
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Mount `ServicesSection` in `app/page.tsx`**

Current `app/page.tsx`:

```tsx
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { siteConfig } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero
        variant="home"
        background={{
          src: "/figma-exports/interior-reception.png",
          alt: "Align the Spine reception area",
        }}
        title={
          <>
            Align the Spine
            <br />
            South Florida&apos;s
            <br />
            Chiropractor
          </>
        }
        subhead="At your home or in the office. We provide elite spinal health solutions tailored to your unique lifestyle and recovery goals."
        badge="Office visits are $50"
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Schedule Your Car Accident Evaluation",
          submitLabel: "Schedule My Car Accident Evaluation",
          footerNote:
            "Serving Deerfield Beach, Boca Raton, Fort Lauderdale, and surrounding South Florida communities.",
        }}
      />
      <FaqSection pageKey="home" />
    </>
  );
}
```

Replace with:

```tsx
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services-section";
import { siteConfig } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero
        variant="home"
        background={{
          src: "/figma-exports/interior-reception.png",
          alt: "Align the Spine reception area",
        }}
        title={
          <>
            Align the Spine
            <br />
            South Florida&apos;s
            <br />
            Chiropractor
          </>
        }
        subhead="At your home or in the office. We provide elite spinal health solutions tailored to your unique lifestyle and recovery goals."
        badge="Office visits are $50"
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Schedule Your Car Accident Evaluation",
          submitLabel: "Schedule My Car Accident Evaluation",
          footerNote:
            "Serving Deerfield Beach, Boca Raton, Fort Lauderdale, and surrounding South Florida communities.",
        }}
      />
      <ServicesSection />
      <FaqSection pageKey="home" />
    </>
  );
}
```

- [ ] **Step 3: Typecheck, lint, build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

- [ ] **Step 4: Manual dev-server QA**

1. Run `npm run dev`, open the homepage.
2. Confirm a new "Our services" section renders between Hero and the FAQ section: a centered teal eyebrow + centered navy heading, then 6 rows — each with an image, a navy serif title, a body paragraph, and a "Book" link with a trailing arrow that navigates to `/book`.
3. Confirm rows alternate image side: row 1 image-left, row 2 image-right, row 3 image-left, etc., and a thin horizontal divider separates each row (5 dividers between 6 rows, none before the first or after the last).
4. Resize to a narrow mobile width (e.g. 375px) and confirm each row stacks image-above-text with no horizontal overflow.
5. Temporarily add `import { ServiceGrid } from "@/components/ui/service-grid";` and `import { services } from "@/content/services";` to `app/page.tsx` and render `<ServiceGrid items={services} />` anywhere in the tree to visually confirm the grid collapses 3→2→1 columns when resizing the browser from desktop to mobile width, then remove that temporary import/render (it is not part of this plan's shipped homepage).

- [ ] **Step 5: Commit**

```bash
git add components/sections/services-section.tsx app/page.tsx
git commit -m "feat: add ServicesSection and mount it on the home page"
```
