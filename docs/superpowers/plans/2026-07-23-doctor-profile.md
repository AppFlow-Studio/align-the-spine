# DoctorProfile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "THE DOCTOR BEHIND YOUR CARE" section — portrait with an overlaid rating chip beside an eyebrow/name/bio/CTA block — as a single `DoctorProfile` component driven by a `variant: "short" | "long"` prop, fed by a new `content/doctor-profile.ts` config file, and mount the short variant on the home page between `ServicesSection` and `FaqSection`.

**Architecture:** Two new Tailwind design tokens (`doctor-name` fontSize, `overlay-ink-20` color) land first since the component depends on them. `content/doctor-profile.ts` exports a single typed config object (`doctorProfileContent`) built from `siteConfig` for the booking href. `DoctorProfile` (`components/sections/doctor-profile.tsx`) is a server component taking `variant`, `content`, and an optional `extended` slot (reserved for ATS-091's History/HOW HE PRACTICES cards, unused here), composing existing primitives (`Section`, `Container`, `Eyebrow`, `Button`, `StarIcon`, `next/image`) — no new UI primitives. `app/page.tsx` imports the content object and component and mounts `<DoctorProfile variant="short" .../>` between `<ServicesSection />` and `<FaqSection pageKey="home" />`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No component-level test framework in active use in this repo (one `vitest` unit test exists, for a non-component util); verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- Portrait is on the **left**, text (eyebrow/name/bio/CTA) is on the **right** — confirmed from Figma coordinates (file `NHwBqbGepOspY0GrCnECnj`, nodes `96:471`–`96:495`), not the ticket text's stated order. Do not swap the columns.
- Reuse existing tokens/components exactly, do not reimplement: `Eyebrow` (`components/ui/eyebrow.tsx`) for the eyebrow line, `Button variant="cta"` (`components/ui/button.tsx`) for the CTA (already renders the circular arrow badge, r80/h99), `text-body-lg` for the bio, `rounded-30`/`rounded-20` for the portrait/chip radii, `StarIcon` (`components/ui/icons/star.tsx`) for the chip stars.
- Do not modify `components/ui/rating.tsx` — its hardcoded teal/ink-500 colors are correct for its existing caller (`ReviewsStrip`); the chip here is hand-built to get white text/stars on the photo overlay instead.
- New tokens only: `doctor-name` fontSize (`65px`/`100px`/`500`) and `overlay-ink-20` color (`rgba(26, 26, 26, 0.2)`) — no other new tokens, no hardcoded hex values in component code.
- `variant` accepts `"short" | "long"`; only `"short"` is exercised by this plan (mounted on Home). `"long"` and the `extended` prop are plumbed but not wired to any content — do not build History/HOW HE PRACTICES cards content, that's ATS-091.
- Portrait image is `/figma-exports/portrait.png` (already present in the repo) — do not add a new image asset.

---

### Task 1: Design tokens — `doctor-name` fontSize, `overlay-ink-20` color

**Files:**

- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Interfaces:**

- Produces: CSS custom property `--overlay-ink-20`; Tailwind utilities `text-doctor-name` (font-size 65px/line-height 100px/font-weight 500) and `bg-overlay-ink-20` (`rgba(26, 26, 26, 0.2)`). Consumed by Task 3's `DoctorProfile`.

- [ ] **Step 1: Add `--overlay-ink-20` to `app/globals.css`**

In `app/globals.css`, in the `:root` block, add a new line directly after the existing `--overlay-white-16` line (currently line 23):

```css
--overlay-white-16: rgba(255, 255, 255, 0.16); /* dark-form field fill (§A7) */
--overlay-ink-20: rgba(26, 26, 26, 0.2); /* doctor-profile rating chip overlay (§B6) */
```

- [ ] **Step 2: Add `overlay.ink-20` to `tailwind.config.ts`**

In `tailwind.config.ts`, find the `overlay` block inside `colors` (currently lines 33–37):

```ts
        overlay: {
          "navy-20": "var(--overlay-navy-20)",
          "white-15": "var(--overlay-white-15)",
          "white-16": "var(--overlay-white-16)",
        },
```

Replace with:

```ts
        overlay: {
          "navy-20": "var(--overlay-navy-20)",
          "white-15": "var(--overlay-white-15)",
          "white-16": "var(--overlay-white-16)",
          "ink-20": "var(--overlay-ink-20)",
        },
```

- [ ] **Step 3: Add `doctor-name` fontSize to `tailwind.config.ts`**

In the same file, find the `"card-body"` entry at the end of the `fontSize` block (currently lines 96):

```ts
        "card-body": ["22px", { lineHeight: "40px", fontWeight: "400" }],
      },
```

Replace with:

```ts
        "card-body": ["22px", { lineHeight: "40px", fontWeight: "400" }],
        "doctor-name": ["65px", { lineHeight: "100px", fontWeight: "500" }],
      },
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat: add doctor-name font token and overlay-ink-20 color token"
```

---

### Task 2: `content/doctor-profile.ts` config

**Files:**

- Create: `content/doctor-profile.ts`

**Interfaces:**

- Consumes: `siteConfig` (`@/content/site`, `{ bookingCta: { href } }`).
- Produces: `DoctorProfileContent` (`{ eyebrow: string; name: string; bio: string; cta: { label: string; href: string }; rating: { value: number; count: number; location: string }; portrait: { src: string; alt: string } }`) and the const export `doctorProfileContent`. Consumed by Task 3's `DoctorProfile` and Task 4's `app/page.tsx`.

- [ ] **Step 1: Write `content/doctor-profile.ts`**

```ts
import { siteConfig } from "@/content/site";

export interface DoctorProfileContent {
  eyebrow: string;
  name: string;
  bio: string;
  cta: { label: string; href: string };
  rating: { value: number; count: number; location: string };
  portrait: { src: string; alt: string };
}

/** DoctorProfile copy per condition-page-spec §B6. Short and long variants
 * share this same content today — the profile block is pixel-identical
 * between the Home and About-page Figma instances; only the History +
 * HOW HE PRACTICES cards that follow it on the About page differ, and
 * those are tracked separately under ATS-091. */
export const doctorProfileContent: DoctorProfileContent = {
  eyebrow: "THE DOCTOR BEHIND YOUR CARE",
  name: "Dr. Abe Nasser",
  bio: "Dr. Abe is pleased to serve the Deerfield and surrounding areas. Dr. Abe began his chiropractic career serving the Broward county and Palm Beach County area working with many different patients from pre and post pregnancy, post-surgical, geriatric, and athletes.",
  cta: { label: "Book with Dr. Abe", href: siteConfig.bookingCta.href },
  rating: { value: 5, count: 152, location: "Deerfield Beach, Florida" },
  portrait: { src: "/figma-exports/portrait.png", alt: "Dr. Abe Nasser" },
};
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add content/doctor-profile.ts
git commit -m "feat: add doctor-profile content config"
```

---

### Task 3: `DoctorProfile` component

**Files:**

- Create: `components/sections/doctor-profile.tsx`

**Interfaces:**

- Consumes: `DoctorProfileContent` (`@/content/doctor-profile`, from Task 2); `Section` (`@/components/ui/section`, `{ children, spacing?, className?, as? }`); `Container` (`@/components/ui/container`, `{ children, className?, as? }`); `Eyebrow` (`@/components/ui/eyebrow`, `{ children, as?, className? }`); `Button` (`@/components/ui/button`, `{ variant?, href?, className?, children }`); `StarIcon` (`@/components/ui/icons/star`, standard `SVGProps<SVGSVGElement>`); `Image` (`next/image`); `doctor-name`/`overlay-ink-20` tokens from Task 1.
- Produces: `DoctorProfile` named export, props `{ variant: "short" | "long"; content: DoctorProfileContent; extended?: ReactNode }`. Consumed by Task 4's `app/page.tsx`.

- [ ] **Step 1: Write `components/sections/doctor-profile.tsx`**

```tsx
import type { ReactNode } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StarIcon } from "@/components/ui/icons/star";
import { Section } from "@/components/ui/section";
import type { DoctorProfileContent } from "@/content/doctor-profile";

export interface DoctorProfileProps {
  variant: "short" | "long";
  content: DoctorProfileContent;
  /** Rendered below the profile block only when variant is "long" — reserved
   * for ATS-091's History + HOW HE PRACTICES cards, unused today. */
  extended?: ReactNode;
}

/** "THE DOCTOR BEHIND YOUR CARE" block per condition-page-spec §B6: portrait
 * (r30) with an overlaid rating chip (stars + count + location, r20, dark
 * 20%-opacity overlay) on the left, eyebrow/name/bio/CTA on the right.
 * Portrait-left matches the actual Figma layout (file NHwBqbGepOspY0GrCnECnj,
 * nodes 96:471–96:495), not the ticket text's stated left/right order. */
export function DoctorProfile({ variant, content, extended }: DoctorProfileProps) {
  const { eyebrow, name, bio, cta, rating, portrait } = content;
  return (
    <Section spacing="lg">
      <Container className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="relative aspect-[639/833] w-full shrink-0 md:w-[45%]">
          <Image src={portrait.src} alt={portrait.alt} fill className="rounded-30 object-cover" />
          <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-3 rounded-20 bg-overlay-ink-20 px-6 py-4 backdrop-blur-sm">
            <span className="font-sans text-stat-label text-white">{rating.location}</span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex gap-1">
                {Array.from({ length: rating.value }, (_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-white" />
                ))}
              </span>
              <span className="font-sans text-stat-label text-white">{rating.count}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-doctor-name text-navy-900">{name}</h2>
          <p className="font-sans text-body-lg text-ink-900">{bio}</p>
          <Button variant="cta" href={cta.href}>
            {cta.label}
          </Button>
        </div>
      </Container>
      {variant === "long" && extended}
    </Section>
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
git add components/sections/doctor-profile.tsx
git commit -m "feat: add DoctorProfile section"
```

---

### Task 4: Mount `DoctorProfile` on the home page

**Files:**

- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `DoctorProfile` (`@/components/sections/doctor-profile`, from Task 3), `doctorProfileContent` (`@/content/doctor-profile`, from Task 2).

- [ ] **Step 1: Add the import and render between `ServicesSection` and `FaqSection`**

Current `app/page.tsx`:

```tsx
import { CtaBand } from "@/components/sections/cta-band";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services-section";
import { StillHaveQuestions } from "@/components/sections/still-have-questions";
import { ctaBandContent, stillHaveQuestionsContent } from "@/content/cta-bands";
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
      <StillHaveQuestions content={stillHaveQuestionsContent} />
      <CtaBand content={ctaBandContent} />
    </>
  );
}
```

Replace with:

```tsx
import { CtaBand } from "@/components/sections/cta-band";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services-section";
import { StillHaveQuestions } from "@/components/sections/still-have-questions";
import { ctaBandContent, stillHaveQuestionsContent } from "@/content/cta-bands";
import { doctorProfileContent } from "@/content/doctor-profile";
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
      <DoctorProfile variant="short" content={doctorProfileContent} />
      <FaqSection pageKey="home" />
      <StillHaveQuestions content={stillHaveQuestionsContent} />
      <CtaBand content={ctaBandContent} />
    </>
  );
}
```

- [ ] **Step 2: Typecheck, lint, build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

- [ ] **Step 3: Manual dev-server QA**

1. Run `npm run dev`, open the homepage.
2. Scroll past the services section and confirm a new section renders before the FAQ accordion: a portrait photo of Dr. Abe on the left (rounded corners, no visible clipping/stretching) and, on the right, a small teal uppercase eyebrow "THE DOCTOR BEHIND YOUR CARE", a large serif navy heading "Dr. Abe Nasser", a body paragraph, and a large navy pill button "Book with Dr. Abe" with a white circular arrow badge on its left — compare the button's style against the "Ready to get started?" button further down the page, they should look identical.
3. Confirm a translucent dark chip sits near the bottom of the portrait, readable over the photo, showing "Deerfield Beach, Florida" on the left and 5 white stars + "152" on the right.
4. Resize to a narrow mobile width (e.g. 375px) and confirm the portrait stacks above the text column, full-width, with no horizontal overflow and the chip remaining legible and inside the portrait's bounds; then to a wide desktop width (e.g. 1728px) and confirm the two-column layout with the portrait at roughly 45% width.
5. Click "Book with Dr. Abe" and confirm it navigates to `/book`.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mount DoctorProfile on the home page"
```
