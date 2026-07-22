# StillHaveQuestions + CTABand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two recurring page sections — `StillHaveQuestions` (full-bleed navy band with the ATS-020 glass call-pill) and `CtaBand` (light booking CTA with the arrow-badge button) — fed by a new `content/cta-bands.ts` config file, and mount both on the home page after `FaqSection`.

**Architecture:** `content/cta-bands.ts` exports two typed, page-agnostic config objects (`stillHaveQuestionsContent`, `ctaBandContent`) built from `siteConfig`. `StillHaveQuestions` (`components/sections/still-have-questions.tsx`) and `CtaBand` (`components/sections/cta-band.tsx`) are server components that each take a single `content` prop and compose existing primitives (`Section`, `Container`, `Button`) — no new UI primitives, no new icons. `app/page.tsx` imports both content objects and components and mounts `<StillHaveQuestions /> <CtaBand />` immediately after `<FaqSection pageKey="home" />`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No test framework exists in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- No new Tailwind tokens or hardcoded hex colors: `bg-navy-900` (`#253067`), `text-display` (Newsreader Medium, clamp 36–65px/38–68px), `text-body-lg` (Poppins 25/40), `text-mute-300` (`#cdcdcd`), `text-h2`/`text-navy-800` are all existing tokens — reuse as-is.
- Call-pill must be the existing `Button variant="glass"` (`components/ui/button.tsx`) with an `eyebrow` prop — do not create a new `CallPill` component or duplicate its markup.
- CTA button must be the existing `Button variant="cta"` — it already renders the circular arrow badge; do not add separate arrow markup.
- `app/home-visits/page.tsx` is not touched by this plan (its existing inline navy CTA card is a different, out-of-scope treatment).
- Both new section components take content as props (not internal imports) — matches the `HowWeHelpSteps` convention, not `FaqSection`'s internal `pageKey` lookup.

---

### Task 1: `content/cta-bands.ts` config

**Files:**

- Create: `content/cta-bands.ts`

**Interfaces:**

- Consumes: `siteConfig` (`@/content/site`, `{ business: { phone, phoneHref }, bookingCta: { href } }`).
- Produces: `StillHaveQuestionsContent` (`{ heading: string; eyebrow: string; phone: string; phoneHref: string; note: string }`), `CtaBandContent` (`{ heading: string; cta: { label: string; href: string } }`), and the two const exports `stillHaveQuestionsContent`, `ctaBandContent`. Consumed by Task 2's `StillHaveQuestions`, Task 3's `CtaBand`, and Task 4's `app/page.tsx`.

- [ ] **Step 1: Write `content/cta-bands.ts`**

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

/** StillHaveQuestions band copy per condition-page-spec §B10 (ATS-121). */
export const stillHaveQuestionsContent: StillHaveQuestionsContent = {
  heading: "Still have questions? Just Call",
  eyebrow: "Speak with us today",
  phone: `Call ${siteConfig.business.phone}`,
  phoneHref: siteConfig.business.phoneHref,
  note: "Dr. Abe Answers the phone. No call center, no hold music.",
};

/** CTABand copy per condition-page-spec §B10 (ATS-121). */
export const ctaBandContent: CtaBandContent = {
  heading: "Ready to get started?",
  cta: { label: "Book an appointment", href: siteConfig.bookingCta.href },
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
git add content/cta-bands.ts
git commit -m "feat: add cta-bands content config"
```

---

### Task 2: `StillHaveQuestions` component

**Files:**

- Create: `components/sections/still-have-questions.tsx`

**Interfaces:**

- Consumes: `StillHaveQuestionsContent` (`@/content/cta-bands`, from Task 1); `Section` (`@/components/ui/section`, `{ children, spacing?, className?, as? }`); `Container` (`@/components/ui/container`, `{ children, className?, as? }`); `Button` (`@/components/ui/button`, `{ variant?, href?, eyebrow?, className?, children }`).
- Produces: `StillHaveQuestions` named export, props `{ content: StillHaveQuestionsContent }`. Consumed by Task 4's `app/page.tsx`.

- [ ] **Step 1: Write `components/sections/still-have-questions.tsx`**

```tsx
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { StillHaveQuestionsContent } from "@/content/cta-bands";

export interface StillHaveQuestionsProps {
  content: StillHaveQuestionsContent;
}

/** Full-bleed navy "Still have questions? Just Call" band per
 * condition-page-spec §B10 (ATS-121): heading + ATS-020 glass call-pill +
 * muted note, background bled edge-to-edge via Section, text gutter-aligned
 * via the nested Container. */
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

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/still-have-questions.tsx
git commit -m "feat: add StillHaveQuestions section"
```

---

### Task 3: `CtaBand` component

**Files:**

- Create: `components/sections/cta-band.tsx`

**Interfaces:**

- Consumes: `CtaBandContent` (`@/content/cta-bands`, from Task 1); `Section`, `Container`, `Button` (same signatures as Task 2).
- Produces: `CtaBand` named export, props `{ content: CtaBandContent }`. Consumed by Task 4's `app/page.tsx`.

- [ ] **Step 1: Write `components/sections/cta-band.tsx`**

```tsx
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { CtaBandContent } from "@/content/cta-bands";

export interface CtaBandProps {
  content: CtaBandContent;
}

/** Recurring generic booking CTA band per condition-page-spec §B10
 * (ATS-121): centered heading + arrow-badge "cta" button, no background
 * color so it reads distinct from the navy StillHaveQuestions band above
 * it on the home page. */
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

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/cta-band.tsx
git commit -m "feat: add CtaBand section"
```

---

### Task 4: Mount both bands on the home page

**Files:**

- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `StillHaveQuestions` (`@/components/sections/still-have-questions`, from Task 2), `CtaBand` (`@/components/sections/cta-band`, from Task 3), `stillHaveQuestionsContent`, `ctaBandContent` (`@/content/cta-bands`, from Task 1).

- [ ] **Step 1: Add imports and render both bands after `FaqSection`**

Current `app/page.tsx`:

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

Replace with:

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

- [ ] **Step 2: Typecheck, lint, build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

- [ ] **Step 3: Manual dev-server QA**

1. Run `npm run dev`, open the homepage.
2. Scroll below the FAQ accordion and confirm a full-bleed navy (`#253067`) band spans the entire viewport width (background reaches both edges of the browser window, not just the container gutters).
3. Inside that band, confirm: a large centered white serif heading "Still have questions? Just Call"; below it, the glass call-pill (translucent white rounded pill with a phone icon, "Speak with us today" eyebrow, and "Call (954) 573-7192") — compare visually against the same pill already shown in the Hero section, they should look identical; below that, a centered muted line "Dr. Abe Answers the phone. No call center, no hold music."
4. Immediately below the navy band, confirm a light/transparent band with a centered heading "Ready to get started?" and a large navy pill button "Book an appointment" with a white circular arrow badge on its left — compare visually against the closing button in `app/home-visits/page.tsx`'s "HOW WE HELP" section, they should look identical in style.
5. Resize to a narrow mobile width (e.g. 375px) and confirm both bands remain centered, single-column, with no horizontal overflow or clipped text; then to a wide desktop width (e.g. 1728px) and confirm the navy band background still reaches both edges and the call-pill has scaled up to its `xl:` size.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mount StillHaveQuestions and CtaBand on the home page"
```
