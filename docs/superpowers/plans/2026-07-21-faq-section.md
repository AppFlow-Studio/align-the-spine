# FaqSection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `FaqSection` — an eyebrow + centered heading + `FaqAccordion` (ATS-023) wrapper fed by a per-page entry in a restructured `content/faqs.ts`, emitting an inline `FAQPage` JSON-LD script — and mount it on the home page.

**Architecture:** `content/faqs.ts` changes from a flat `FAQ[]` to `Record<pageKey, PageFaqs>` (`PageFaqs = { tail: string; items: FAQ[] }`), seeded with one `"home"` entry. `FaqSection` (`components/sections/faq-section.tsx`, server component) takes a `pageKey` prop, looks up the entry, and composes existing primitives (`Section`, `SectionHeading`, `FaqAccordion`) plus a hand-rolled JSON-LD `<script>` tag built from the same `items` array. `app/page.tsx` mounts it below `Hero`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No test framework exists in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- Typography/color: `SectionHeading`'s default `tone="navy-800"` (→ `text-navy-800` = `#2b3565`) and `text-display` (Newsreader Medium 65/68) are existing tokens — reuse as-is, no new tokens, no hardcoded hex.
- No changes to `FaqAccordion` (`components/ui/faq-accordion.tsx`), `SectionHeading` (`components/ui/section-heading.tsx`), `Eyebrow`, or `Section` — all consumed via their existing public props only.
- `content/faqs.ts`'s `FAQ` interface (`{ question: string; answer: string }`) must stay unchanged and stay exported under the same name — `FaqAccordion` imports it directly (`import type { FAQ } from "@/content/faqs"`).

---

### Task 1: Restructure `content/faqs.ts` into keyed-per-page shape

**Files:**

- Modify: `content/faqs.ts` (full rewrite, 37 lines → new structure below)

**Interfaces:**

- Produces: `FAQ` (unchanged shape, still exported), `PageFaqs` (`{ tail: string; items: FAQ[] }`), `faqsByPage: Record<string, PageFaqs>`. Consumed by Task 2's `FaqSection`.

- [ ] **Step 1: Rewrite `content/faqs.ts`**

```ts
export interface FAQ {
  question: string;
  answer: string;
}

export interface PageFaqs {
  /** Header tail: "Everything you need to know about {tail}" */
  tail: string;
  items: FAQ[];
}

export const faqsByPage: Record<string, PageFaqs> = {
  home: {
    tail: "your spine health",
    items: [
      {
        question: "Do you accept insurance?",
        answer:
          "Yes — we work with most major insurance providers, and if you were in an auto accident, PIP coverage often reduces your out-of-pocket cost to $0. Call us and we'll verify your benefits before your first visit.",
      },
      {
        question: "What should I expect at my first visit?",
        answer:
          "Your first visit includes a full consultation, a hands-on exam, and — if needed — imaging to pinpoint the cause of your pain. We'll walk you through a treatment plan before any adjustment begins.",
      },
      {
        question: "Do I need an appointment, or can I walk in?",
        answer:
          "We recommend booking ahead so we can hold time for a full exam, but we keep same-day slots open for urgent cases — call the office and we'll fit you in when we can.",
      },
      {
        question: "I was just in a car accident. How soon should I come in?",
        answer:
          "As soon as possible, even if you feel fine. Whiplash and soft-tissue injuries often don't show symptoms for days. Early evaluation also creates the documentation your PIP claim needs.",
      },
      {
        question: "How many visits will I need?",
        answer:
          "It depends on the injury and how long you've had it. Many patients feel relief within a few visits, while more complex or long-standing issues may need several weeks of care. We'll reassess and adjust the plan as you progress.",
      },
      {
        question: "Do you offer home visits?",
        answer:
          "Yes, home visits are available when it applies — ask our team when you call and we'll let you know if it's a fit for your situation.",
      },
    ],
  },
};
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0. (`FaqAccordion`'s `import type { FAQ } from "@/content/faqs"` still resolves since `FAQ` is still exported unchanged.)

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add content/faqs.ts
git commit -m "refactor: key faqs.ts content per page"
```

---

### Task 2: `FaqSection` component

**Files:**

- Create: `components/sections/faq-section.tsx`

**Interfaces:**

- Consumes: `faqsByPage`, `PageFaqs` (`@/content/faqs`, from Task 1); `Section` (`@/components/ui/section`, `{ children, spacing?, className?, as? }`); `SectionHeading` (`@/components/ui/section-heading`, `{ eyebrow?, as?, sub?, tone?, className?, children }`); `FaqAccordion` (`@/components/ui/faq-accordion`, `{ items: FAQ[] }`).
- Produces: `FaqSection` named export, props `{ pageKey: keyof typeof faqsByPage }`. Consumed by Task 3's `app/page.tsx`.

- [ ] **Step 1: Write `components/sections/faq-section.tsx`**

```tsx
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqsByPage } from "@/content/faqs";

export interface FaqSectionProps {
  pageKey: keyof typeof faqsByPage;
}

/** FAQ section per condition-page-spec §B11/§C: eyebrow + centered heading +
 * FaqAccordion, fed by a per-page faqsByPage entry, with an inline FAQPage
 * JSON-LD script derived from the same items shown on screen. */
export function FaqSection({ pageKey }: FaqSectionProps) {
  const { tail, items } = faqsByPage[pageKey];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Section>
      <SectionHeading
        eyebrow="Frequently asked questions"
        className="mx-auto max-w-2xl items-center text-center"
      >
        Everything you need to know about {tail}
      </SectionHeading>
      <FaqAccordion items={items} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
git add components/sections/faq-section.tsx
git commit -m "feat: add FaqSection component with FAQPage JSON-LD"
```

---

### Task 3: Mount `FaqSection` on the home page

**Files:**

- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `FaqSection` from Task 2 (`@/components/sections/faq-section`, props `{ pageKey: "home" }`).

- [ ] **Step 1: Add the import and render `FaqSection` below `Hero`**

Current `app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/hero";
import { siteConfig } from "@/content/site";

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

Replace with:

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

- [ ] **Step 2: Typecheck, lint, build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

- [ ] **Step 3: Manual dev-server QA**

1. Run `npm run dev`, open the homepage.
2. Confirm below the Hero section: an uppercase teal "Frequently asked questions" eyebrow, centered; a centered heading "Everything you need to know about your spine health" in the large serif (Newsreader) navy style; then 6 accordion rows with the first one open by default, "+" toggles rotating into an "x" on click.
3. Resize to a narrow mobile width (e.g. 375px) and confirm the heading and accordion rows remain readable with no horizontal overflow.
4. View page source (or DevTools Elements panel) and confirm a `<script type="application/ld+json">` tag is present containing valid JSON with a `mainEntity` array of 6 `Question`/`Answer` objects matching the on-screen copy.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mount FaqSection on the home page"
```
