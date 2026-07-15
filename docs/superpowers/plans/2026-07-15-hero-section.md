# Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared 2-column `Hero` section (Home + Condition variants) and the minimal `LeadForm` it hosts, matching the ticket spec and reference screenshot.

**Architecture:** `LeadForm` (`components/ui/lead-form.tsx`, client, `react-hook-form`) is built first as a standalone primitive, then `Hero` (`components/sections/hero.tsx`, server component) composes the background stack + two-column layout around it. This is the first component in `components/sections/`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4, `react-hook-form` (already installed, unused elsewhere — this is its first real usage).

## Global Constraints

- No test framework exists in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA per task — same convention as every prior plan in `docs/superpowers/plans/`.
- **Do not modify** `components/layout/navbar.tsx`, `components/layout/root-shell.tsx`, `components/layout/location-footer.tsx`, or `components/layout/location-intro.tsx`. All four currently have real, uncommitted, unrelated work in progress (an ATS-013 LocationIntro/LocationFooter redesign, plus a hand-revert of `Navbar` from `sticky` back to `fixed inset-x-0 top-0`). Build Hero against their **current working-tree state as-is** — in particular, `Navbar` is `fixed`, transparent-over-dark-content by default, which Hero's background-bleed design depends on.
- **`app/page.tsx` currently contains only:**
  ```tsx
  export default function Home() {
    return <div></div>;
  }
  ```
  This is itself uncommitted (simplified from Next.js boilerplate). Any task that temporarily mounts a component here for manual QA must restore **exactly this content** afterward via a direct edit — **never** `git checkout -- app/page.tsx`, which would discard this already-uncommitted state and any other stray edits, not just the QA probe.
- Colors/radius/shadow/fonts: existing tokens only (`navy-900` `#253067`, `navy-700` `#374690`, `teal-500` `#58a0a0`, `mute-300` `#cdcdcd`, `overlay-white-15`, `radius-15`, `shadow-card`, `text-hero`, `text-body-lg`, `text-alt-label`, `text-button`, `text-field`). Arbitrary bracket pixel values (e.g. `min-h-[975px]`) are fine for one-off sizes not in the type/spacing scale — this repo already does this (`h-[420px]` in `location-intro.tsx`, `h-[100px]` in `navbar.tsx`) — but never hardcode a hex color in JSX.
- Phone number comes from `siteConfig.business.phone` / `siteConfig.business.phoneHref` (`content/site.ts`) — **not** the stale `(954) 123-4576` visible in the reference screenshot.
- Background photo: `/figma-exports/interior-reception.png`. Spine overlay: `/figma-exports/spine-skeloton.png`. Both already exist in `public/figma-exports/` (currently untracked in git — that's pre-existing, not something this plan resolves).
- **Hero's negative top margin** (to bleed its background under the fixed `Navbar`, over `TopStatsBar`) is computed from `TopStatsBar`'s actual rendered height at each breakpoint, not guessed. `components/layout/top-stats-bar.tsx` renders `siteConfig.stats` (5 items) in a `dl.grid` with `text-stat-label` (18px/28px line-height) over `text-stat-value` (32px/40px line-height), `gap-1` (4px) between them, `gap-y-8` (32px) between rows, wrapped in `.container.py-4.md:py-6`. Row height ≈ 28+4+40 = 72px. Grid columns: `grid-cols-2` (<640px) → `sm:grid-cols-3` (640–1023px) → `lg:grid-cols-5` (≥1024px). Padding: `py-4` (32px total) below `md` (768px), `md:py-6` (48px total) at/above it. This gives:
  | Breakpoint                                                                                                                                                                                                                                                                                                                                                   | Columns | Rows (5 items) | Padding | Height                   |
  | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------------- | ------- | ------------------------ |
  | `<640px`                                                                                                                                                                                                                                                                                                                                                     | 2       | 3              | 32px    | 32 + 72·3 + 32·2 = 312px |
  | `640–767px`                                                                                                                                                                                                                                                                                                                                                  | 3       | 2              | 32px    | 32 + 72·2 + 32 = 208px   |
  | `768–1023px`                                                                                                                                                                                                                                                                                                                                                 | 3       | 2              | 48px    | 48 + 72·2 + 32 = 224px   |
  | `≥1024px`                                                                                                                                                                                                                                                                                                                                                    | 5       | 1              | 48px    | 48 + 72 = 120px          |
  | So Hero's top margin is `-mt-[312px] sm:-mt-[208px] md:-mt-[224px] lg:-mt-[120px]`. **This is an assumption tied to `siteConfig.stats` currently having exactly 5 short, non-wrapping labels** — flagged here rather than silently baked in; if stats content changes enough to wrap or change row count, these four values need recalculating the same way. |

---

### Task 1: `LeadForm` component

**Files:**

- Create: `components/ui/lead-form.tsx`

**Interfaces:**

- Consumes: `Input` (`@/components/ui/input`, `InputProps` incl. `label`, `error`, `variant`), `Button` (`@/components/ui/button`, incl. `loading` prop), `cn` (`@/lib/cn`).
- Produces: `LeadForm` named export, props `{ heading: string; submitLabel: string; onSubmit?: (values: LeadFormValues) => Promise<void>; className?: string }`; `LeadFormValues` named export type `{ firstName: string; lastName: string; phone: string; email: string }`. Consumed by Task 2's `Hero`.

- [ ] **Step 1: Write `components/ui/lead-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export interface LeadFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface LeadFormProps {
  heading: string;
  submitLabel: string;
  onSubmit?: (values: LeadFormValues) => Promise<void>;
  className?: string;
}

const PHONE_PATTERN = /^[\d\s().+-]{7,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Inline lead-capture form hosted inside Hero (ATS-030 contract): First/Last
 * Name, Phone, Email, submit CTA, per condition-page-spec §A7 dark field
 * styling. `onSubmit` is injected so a later ATS-030 ticket can swap in real
 * submission logic (an API call) without changing this component's props. */
export function LeadForm({ heading, submitLabel, onSubmit, className }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>();
  const [submitted, setSubmitted] = useState(false);

  const onValid = async (values: LeadFormValues) => {
    if (onSubmit) {
      await onSubmit(values);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    setSubmitted(true);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      className={cn("flex flex-col gap-5", className)}
    >
      <h2 className="font-sans text-button font-medium text-white">{heading}</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          variant="dark"
          error={errors.firstName?.message}
          {...register("firstName", { required: "Required" })}
        />
        <Input
          label="Last Name"
          variant="dark"
          error={errors.lastName?.message}
          {...register("lastName", { required: "Required" })}
        />
      </div>

      <Input
        label="Phone"
        type="tel"
        variant="dark"
        error={errors.phone?.message}
        {...register("phone", {
          required: "Required",
          pattern: { value: PHONE_PATTERN, message: "Enter a valid phone number" },
        })}
      />

      <Input
        label="Email"
        type="email"
        variant="dark"
        error={errors.email?.message}
        {...register("email", {
          required: "Required",
          pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
        })}
      />

      <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>

      {submitted && (
        <p role="status" className="font-sans text-field text-white">
          Thanks — we&apos;ll be in touch shortly.
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Verify typecheck, lint, build**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual verification — throwaway mount**

Temporarily replace `app/page.tsx` with:

```tsx
import { LeadForm } from "@/components/ui/lead-form";

export default function Home() {
  return (
    <div className="bg-navy-900 p-10">
      <div className="max-w-md">
        <LeadForm
          heading="Schedule Your Car Accident Evaluation"
          submitLabel="Schedule My Car Accident Evaluation"
          onSubmit={async (values) => {
            console.log("submitted", values);
          }}
        />
      </div>
    </div>
  );
}
```

Run: `npm run dev`, open `http://localhost:3000`.

Confirm:

- First Name, Last Name (side by side), Phone, Email, then the submit button render on the dark navy background with white/glass field styling (readable placeholder/label text, not dark-on-dark).
- Submitting with all fields empty shows a "Required" error under each field and does not call `onSubmit` (check the browser console — no `submitted` log).
- Filling in an obviously invalid email (e.g. `test`) and a valid phone/name, then submitting, shows an email-format error only.
- Filling in all fields validly and submitting: the button shows its loading spinner briefly, the console logs `submitted {...}` with the four values, the fields clear, and a "Thanks — we'll be in touch shortly." message appears.
- Tab through the form with the keyboard only: focus order is First → Last → Phone → Email → Submit, each field shows a visible focus ring, and screen-reader-relevant `aria-invalid`/`aria-describedby` attributes appear on fields with errors (check via devtools Accessibility/Elements panel).

Restore `app/page.tsx` to exactly:

```tsx
export default function Home() {
  return <div></div>;
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/lead-form.tsx
git commit -m "feat: add LeadForm component"
```

---

### Task 2: `Hero` section component

**Files:**

- Create: `components/sections/hero.tsx`

**Interfaces:**

- Consumes: `LeadForm`, `LeadFormValues` (Task 1, `@/components/ui/lead-form`); `Button` (`@/components/ui/button`); `Eyebrow` (`@/components/ui/eyebrow`, existing, `text-eyebrow`/teal-500 uppercase label); `siteConfig` (`@/content/site`); `next/image`.
- Produces: `Hero` named export, `HeroProps`/`HeroCta`/`HeroFormConfig` named export types from `components/sections/hero.tsx`. No later task consumes this yet — it's wired into a real page by a future ticket.

- [ ] **Step 1: Write `components/sections/hero.tsx`**

```tsx
import type { ReactNode } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LeadForm, type LeadFormValues } from "@/components/ui/lead-form";
import { siteConfig } from "@/content/site";

export interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "teal" | "cta";
}

export interface HeroFormConfig {
  heading: string;
  submitLabel: string;
  footerNote?: string;
  onSubmit?: (values: LeadFormValues) => Promise<void>;
}

export interface HeroProps {
  variant: "home" | "condition";
  background: { src: string; alt: string };
  spineOverlay?: boolean;
  eyebrow?: string;
  title: ReactNode;
  subhead: string;
  conditionChip?: string;
  badge?: string;
  ctas?: HeroCta[];
  callPill?: { eyebrow: string; phone: string };
  bilingualNote?: string;
  form: HeroFormConfig;
}

function HeroChip({ children }: { children: ReactNode }) {
  return (
    <span className="w-fit rounded-6 bg-teal-500 px-6 py-3 font-sans text-button text-white">
      {children}
    </span>
  );
}

/** Shared 2-column hero shell (Home + Condition variants) per
 * condition-page-spec §B1. Pulls itself above TopStatsBar via a
 * breakpoint-tuned negative top margin so its background bleeds to the
 * viewport's true top, behind the fixed transparent Navbar — see
 * docs/superpowers/specs/2026-07-15-hero-section-design.md. */
export function Hero({
  variant,
  background,
  spineOverlay = true,
  eyebrow,
  title,
  subhead,
  conditionChip,
  badge,
  ctas,
  callPill,
  bilingualNote,
  form,
}: HeroProps) {
  return (
    <section className="relative -mt-[312px] min-h-[975px] overflow-hidden sm:-mt-[208px] md:-mt-[224px] lg:-mt-[120px]">
      <Image src={background.src} alt={background.alt} fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/[.47]" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/0 to-navy-700/80" />
      {spineOverlay && (
        <Image
          src="/figma-exports/spine-skeloton.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain opacity-30"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-20 rounded-t-[50px] bg-white" />

      <div className="container relative z-10 grid gap-10 pb-32 pt-[220px] lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-[260px]">
        <div className="flex flex-col gap-6">
          {variant === "condition" && conditionChip && <HeroChip>{conditionChip}</HeroChip>}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

          <h1 className="font-display text-hero text-white">{title}</h1>
          <p className="font-sans text-body-lg text-mute-300">{subhead}</p>

          {callPill && (
            <Button
              variant="glass"
              href={siteConfig.business.phoneHref}
              eyebrow={callPill.eyebrow}
              className="w-fit"
            >
              {callPill.phone}
            </Button>
          )}

          {variant === "condition" && bilingualNote && (
            <p className="font-alt text-alt-label text-mute-300">{bilingualNote}</p>
          )}

          {variant === "home" && (badge || ctas?.length) && (
            <div className="flex flex-wrap items-center gap-4">
              {badge && <HeroChip>{badge}</HeroChip>}
              {ctas?.map((cta) => (
                <Button key={cta.label} href={cta.href} variant={cta.variant ?? "primary"}>
                  {cta.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-15 bg-overlay-white-15 p-8 shadow-card">
            <LeadForm
              heading={form.heading}
              submitLabel={form.submitLabel}
              onSubmit={form.onSubmit}
            />
          </div>
          {form.footerNote && (
            <p className="font-sans text-body-lg text-white">{form.footerNote}</p>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify typecheck, lint, build**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual verification — throwaway mount, Home variant vs. reference screenshot**

Temporarily replace `app/page.tsx` with:

```tsx
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
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
  );
}
```

This references `siteConfig` without importing it — add the import:

```tsx
import { Hero } from "@/components/sections/hero";
import { siteConfig } from "@/content/site";
```

Run: `npm run dev`, open `http://localhost:3000`.

Confirm, comparing against the reference screenshot:

- The reception photo fills the full-width band from the very top of the viewport, with no `TopStatsBar` visible above or through it, and the navbar logo/links float over the photo with a transparent background.
- The headline, subhead, call-pill, and "Office visits are $50" chip render on the left in white/teal per the screenshot; the form card (glass, rounded, First/Last/Phone/Email + submit button) renders on the right, with the "Serving Deerfield Beach..." note below it.
- A faint spine illustration is visible within the darkened photo background.
- A white rounded-top shape caps the very bottom of the band.
- Temporarily add `eyebrow="Auto Accident Care"` to the `<Hero>` props above, reload, and confirm a small teal uppercase label renders directly above the headline — then remove it again, since it's not part of the reference screenshot's config.
- Resize to a tablet width (e.g. 820px) and a mobile width (e.g. 390px): the form card visibly drops below the headline/subhead block in both cases (single-column stack), and no horizontal scrollbar appears.
- Tab through the page from the top: focus reaches the navbar links/CTA first, then the call-pill, then into the form fields in order, each with a visible focus ring.

Restore `app/page.tsx` to exactly:

```tsx
export default function Home() {
  return <div></div>;
}
```

- [ ] **Step 4: Commit**

```bash
git add components/sections/hero.tsx
git commit -m "feat: add Hero section with Home/Condition variants"
```

---

## Manual follow-up (not part of these tickets)

- **Wiring Hero into a real page:** this plan only builds and manually verifies the component; no route renders it permanently yet. `app/page.tsx` (Home) and any condition-page route are separate tickets.
- **Real ATS-030 submission:** `LeadForm`'s `onSubmit` prop is the seam for it — no backend/API route exists yet.
- **`TopStatsBar` becomes fully hidden on any page that leads with `Hero`,** by design (see Global Constraints). If a future page needs both `Hero` and a visible stats bar, that's a design conflict to resolve at that point, not silently here.
- **Condition variant is unverified against a real screenshot** — Task 2's manual QA only visually compares the Home variant (the only one with a reference screenshot). Spot-check the condition variant's `conditionChip`/`bilingualNote`/no-badge rendering manually before shipping a real condition page against it.
- **Trust chips** (mentioned in the ticket's Home acceptance criteria) aren't in the reference screenshot's config and have no dedicated prop in this plan — `ctas`/`badge` cover what's visible. Add a `trustChips?: string[]` prop later if a real page needs them, once there's a concrete visual to match.
