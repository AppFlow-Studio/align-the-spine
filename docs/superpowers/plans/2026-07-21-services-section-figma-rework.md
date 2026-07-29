# Services Section Figma Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage "services" section to match the real Figma design (file `NHwBqbGepOspY0GrCnECnj`, node `96:155`, "Online Appointment" section) instead of the previously-inferred layout, which was built without ever opening Figma (see `docs/superpowers/specs/2026-07-21-service-presentation-design.md:4`: _"No Figma file was opened for this ticket"_).

**Architecture:** `content/services.ts` is rewritten with the exact 6 services, order, copy, and images from the Figma node (New Patient Special → Myofasial Release/Trigger Point → Cupping Therapy → Adjustment → Traction/Decompression → Car Accidents), plus a new `duration` field ("1 hr" per row, shown in a muted meta line). `ServiceListRow` is reworked to match the real layout: image always on the left (no left/right alternation — the design never alternates), title in `navy-900` (not `navy-800`), a two-tone description (muted duration/contact line + dark body copy in one paragraph), and a solid rectangular navy "Book" button (new `book` Button variant — flat, no arrow, unlike every existing variant). `ServicesSection` drops the centered "Our services" eyebrow+heading in favor of the real left-aligned "Online Appointment" heading, and renders a divider before every row (including the first), matching the Figma hairlines. Two shared type tokens (`card-title`, `card-body`) get their line-heights corrected from invented values to the real Figma numbers (37px / 40px) since they're only consumed by this feature.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies. All 6 images already exist in `public/figma-exports/`.

## Global Constraints

- No test framework exists in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as the prior plan.
- Reuse existing tokens/colors: `navy-900` (`#253067`), `navy-800` (`#2b3565`), `ink-900` (`#1a1a1a`), `ink-500` (`#777777`), `font-display`/`font-sans`, `rounded-15`.
- Booking links continue to point at `siteConfig.bookingCta.href` (`/book`) — no per-service route exists.
- Copy must match the Figma text verbatim, including the source's own spelling ("Myofasial") and existing minor phrasing — this task reproduces the design, it does not edit the client's copy.
- `ServiceGrid`/`ServiceCard` (the still-unmounted 3×2 grid) are out of scope for visual rework — only their shared `ServiceCardItem` type gains the new `duration` field for type compatibility with `content/services.ts`. No Figma reference exists for the grid card on this page.

---

### Task 1: Correct `card-title`/`card-body` line-heights to match Figma

**Files:**

- Modify: `tailwind.config.ts:82-83`

**Interfaces:**

- Produces: `text-card-title` now `35px/37px/500` (was `35px/42px/500`). `text-card-body` now `22px/40px/400` (was `22px/38px/400`). Consumed by Task 5's `ServiceListRow` (and unchanged by Task 4's `ServiceCard`, which also picks up the corrected values since it shares the same token).

- [ ] **Step 1: Update the two tokens**

Current (`tailwind.config.ts:82-83`):

```ts
        "card-title": ["35px", { lineHeight: "42px", fontWeight: "500" }],
        "card-body": ["22px", { lineHeight: "38px", fontWeight: "400" }],
```

Replace with:

```ts
        "card-title": ["35px", { lineHeight: "37px", fontWeight: "500" }],
        "card-body": ["22px", { lineHeight: "40px", fontWeight: "400" }],
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
git commit -m "fix: correct card-title/card-body line-heights to match Figma"
```

---

### Task 2: Add a `book` Button variant

**Files:**

- Modify: `components/ui/button.tsx:8-25` (the `variants` object)

**Interfaces:**

- Produces: `variants.book` — a new key in the `variants` object, making `variant="book"` a valid `Button` prop value. Consumed by Task 5's `ServiceListRow`.

- [ ] **Step 1: Add the `book` variant**

Current end of the `variants` object (`components/ui/button.tsx:22-25`):

```ts
  /* Nav pill: navy 20% overlay, h52, r40 */
  "nav-pill":
    "h-[52px] gap-2 rounded-40 bg-overlay-navy-20 px-6 font-sans text-nav text-white hover:bg-navy-900 focus-visible:outline-white",
} as const;
```

Replace with:

```ts
  /* Nav pill: navy 20% overlay, h52, r40 */
  "nav-pill":
    "h-[52px] gap-2 rounded-40 bg-overlay-navy-20 px-6 font-sans text-nav text-white hover:bg-navy-900 focus-visible:outline-white",
  /* Services-row "Book": solid navy rectangle, h58, Poppins 20 white, no arrow, no radius (per Figma) */
  book: "h-[58px] px-10 font-sans text-button text-white bg-navy-900 hover:bg-navy-700 focus-visible:outline-navy-900",
} as const;
```

Note: `book` is intentionally omitted from the `arrowSize` map and from the arrow-rendering condition (`variant === "primary" || ...`) further down in the same file — the Figma design has no trailing arrow on this button, so no changes are needed there.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/button.tsx
git commit -m "feat: add book button variant for services list"
```

---

### Task 3: Rewrite `content/services.ts` with real Figma content

**Files:**

- Modify: `content/services.ts` (full rewrite)

**Interfaces:**

- Produces: `Service` (`{ slug: string; name: string; duration: string; summary: string; image: { src: string; alt: string } }` — adds `duration` to the existing shape), `services: Service[]` (6 entries, Figma order). Consumed by Task 6's `ServicesSection`.

- [ ] **Step 1: Rewrite `content/services.ts`**

```ts
export interface Service {
  slug: string;
  name: string;
  duration: string;
  summary: string;
  image: { src: string; alt: string };
}

export const services: Service[] = [
  {
    slug: "new-patient-special",
    name: "New Patient Special (includes XRAY)",
    duration: "1 hr",
    summary: "New patient special includes adjustment and x-ray.",
    image: {
      src: "/figma-exports/drabe-xray-newpt.png",
      alt: "New patient exam and X-ray evaluation",
    },
  },
  {
    slug: "myofascial-release-trigger-point",
    name: "Myofasial Release/Trigger Point",
    duration: "1 hr",
    summary:
      "We use the gratson tool to loosen up any muscle spasms and break up any adhesions in the soft tissue. This technique is otherwise known as scraping and can be very similar to a massage.",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Myofascial release and trigger point therapy with the gratson tool",
    },
  },
  {
    slug: "cupping-therapy",
    name: "Cupping Therapy",
    duration: "1 hr",
    summary:
      "Increases blood circulation to the area the cups are applied to. This helps ease pain and ease any trigger points you might have and your neck, low back, or other areas.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Cupping therapy treatment" },
  },
  {
    slug: "adjustment",
    name: "Adjustment",
    duration: "1 hr",
    summary:
      "Adjustments are used to help put motion into the spine and making sure the spine is moving properly. Sometimes in the neck mid back and low back we have what we call fixations in the vertebrae, and this can cause discomfort and pain.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
  },
  {
    slug: "traction-decompression",
    name: "Traction/Decompression",
    duration: "1 hr",
    summary:
      "Traction of the low back and even the neck can be done. You are strapped down to a machine and a specific poundage is set. The machine starts at helps open up the joints in the area traction is being applied. This helps to pump fluid into the discs that are between our vertebrae.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Spinal traction and decompression therapy",
    },
  },
  {
    slug: "car-accidents",
    name: "Car Accidents",
    duration: "1 hr",
    summary:
      "If you have been injured in a car accident, we can help! Please provide your first and last name, phone, email, and accident claim number.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Car accident consultation with Dr. Abe",
    },
  },
];
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: FAIL — `components/ui/service-card.tsx`'s `ServiceCardItem` doesn't yet have `duration`, so `services` (now `Service[]` with `duration`) isn't assignable where `ServiceCardItem[]` is expected. This is fixed in Task 4; that failure is expected here.

- [ ] **Step 3: Commit**

```bash
git add content/services.ts
git commit -m "feat: replace services content with real Figma copy and order"
```

---

### Task 4: Add `duration` to the shared `ServiceCardItem` type

**Files:**

- Modify: `components/ui/service-card.tsx:8-13`

**Interfaces:**

- Produces: `ServiceCardItem` now `{ slug: string; name: string; duration: string; summary: string; image: { src: string; alt: string } }`. Consumed by Task 5's `ServiceListRow` and by `ServiceGrid` (unchanged file, inherits the wider type automatically).

- [ ] **Step 1: Add the field**

Current (`components/ui/service-card.tsx:8-13`):

```ts
export interface ServiceCardItem {
  slug: string;
  name: string;
  summary: string;
  image: { src: string; alt: string };
}
```

Replace with:

```ts
export interface ServiceCardItem {
  slug: string;
  name: string;
  duration: string;
  summary: string;
  image: { src: string; alt: string };
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0 (the Task 3 failure is now resolved).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/service-card.tsx
git commit -m "feat: add duration field to ServiceCardItem"
```

---

### Task 5: Rework `ServiceListRow` to match Figma (image-left, no alternation)

**Files:**

- Modify: `components/ui/service-list-row.tsx` (full rewrite)

**Interfaces:**

- Consumes: `ServiceCardItem` (from Task 4); `Button` (`@/components/ui/button`, now with `variant="book"` from Task 2); `siteConfig` (`@/content/site`); `Image` (`next/image`); `cn` (`@/lib/cn`).
- Produces: `ServiceListRowProps` now `{ item: ServiceCardItem; className?: string }` — **removes** the `reverse` prop (the Figma design never alternates image side). Consumed by Task 6's `ServicesSection`.

- [ ] **Step 1: Rewrite `components/ui/service-list-row.tsx`**

```tsx
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface ServiceListRowProps {
  item: ServiceCardItem;
  className?: string;
}

/** Services-list row per Figma (file NHwBqbGepOspY0GrCnECnj, node 96:155,
 * "Online Appointment" section): image fixed to the left, title/meta/
 * description/"Book" button on the right for every row — the source design
 * never alternates image side. No Divider baked in — the consumer renders
 * one before each row (see ServicesSection). */
export function ServiceListRow({ item, className }: ServiceListRowProps) {
  return (
    <div
      className={cn("flex flex-col gap-6 py-10 md:flex-row md:items-start md:gap-10", className)}
    >
      <div className="relative aspect-[670/374] w-full shrink-0 md:w-[45%]">
        <Image src={item.image.src} alt={item.image.alt} fill className="rounded-15 object-cover" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-4">
        <h3 className="font-display text-card-title text-navy-900">{item.name}</h3>
        <p className="font-sans text-card-body">
          <span className="text-ink-500">
            {item.duration} | Contact us ({siteConfig.business.phone})
          </span>
          <br />
          <span className="text-ink-900">{item.summary}</span>
        </p>
        <Button variant="book" href={siteConfig.bookingCta.href} className="mt-2">
          Book
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: FAIL — `ServicesSection` (Task 6 hasn't run yet) still passes a `reverse` prop that no longer exists. This is fixed in Task 6; expected here.

- [ ] **Step 3: Commit**

```bash
git add components/ui/service-list-row.tsx
git commit -m "feat: rework ServiceListRow to match Figma image-left layout"
```

---

### Task 6: Rework `ServicesSection` heading and divider placement

**Files:**

- Modify: `components/sections/services-section.tsx` (full rewrite)

**Interfaces:**

- Consumes: `ServiceListRow` (from Task 5, no `reverse` prop); `Divider` (`@/components/ui/divider`); `Section`/`Container`/`SectionHeading` (existing); `services` (`@/content/services`, from Task 3).
- Produces: `ServicesSection` named export (no props, unchanged signature). Already mounted in `app/page.tsx` below `<Hero />` and above `<FaqSection pageKey="home" />` — no changes needed there.

- [ ] **Step 1: Rewrite `components/sections/services-section.tsx`**

```tsx
import { Fragment } from "react";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceListRow } from "@/components/ui/service-list-row";
import { services } from "@/content/services";

/** Homepage services list per Figma (file NHwBqbGepOspY0GrCnECnj, node
 * 96:155, "Online Appointment" section): left-aligned heading (no eyebrow),
 * then every row preceded by a Divider hairline (including the first),
 * fed by content/services.ts. */
export function ServicesSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-2">
        <SectionHeading tone="navy-800">Online Appointment</SectionHeading>
        {services.map((service) => (
          <Fragment key={service.slug}>
            <Divider />
            <ServiceListRow item={service} />
          </Fragment>
        ))}
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Typecheck, lint, build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

- [ ] **Step 3: Manual dev-server QA**

1. Run `npm run dev`, open the homepage.
2. Confirm the section between Hero and FAQ now reads "Online Appointment" (left-aligned navy heading, no eyebrow above it), followed by a hairline divider, then 6 rows in this exact order: New Patient Special (includes XRAY), Myofasial Release/Trigger Point, Cupping Therapy, Adjustment, Traction/Decompression, Car Accidents.
3. Confirm every row has its image on the **left** (none on the right) — compare against the Figma frame at https://www.figma.com/design/NHwBqbGepOspY0GrCnECnj/Align-the-spine---Chiro?node-id=96-155.
4. Confirm each row's description shows a muted "1 hr | Contact us (954) 573-7192" line above the darker body copy, and a solid navy rectangular "Book" button (no arrow) below it.
5. Confirm a divider separates every row, including one between the heading and the first row.
6. Resize to a narrow mobile width (e.g. 375px) and confirm each row stacks image-above-text with no horizontal overflow.

- [ ] **Step 4: Commit**

```bash
git add components/sections/services-section.tsx
git commit -m "feat: rework ServicesSection heading and dividers to match Figma"
```

---

## Self-Review

- **Spec coverage:** heading text/alignment (Task 6), no alternation + image-left (Task 5), title color navy-900 (Task 5), two-tone description (Task 5), solid "Book" button (Task 2, Task 5), divider before every row (Task 6), real copy/order/images (Task 3), corrected shared type tokens (Task 1, Task 4) — all covered.
- **Placeholder scan:** no TBD/TODO markers; every step has complete code.
- **Type consistency:** `ServiceCardItem` (Task 4) → `Service` (Task 3) → `ServiceListRowProps` (Task 5) → `ServicesSection` (Task 6) all use the same field names (`slug`, `name`, `duration`, `summary`, `image`) throughout.
