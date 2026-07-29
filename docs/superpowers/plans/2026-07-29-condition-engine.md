# Condition Engine (Typed Schema + 5 Condition Data Files) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Define the typed `Condition` schema (hero, understanding, accident, comparisonRows, faq, whatWeTreat, flags) that will drive the not-yet-built ConditionPage template (ATS-061), and populate 5 real, non-placeholder condition data files: neck pain, whiplash, back pain, sciatica, and auto-accident.

**Architecture:** `content/conditions/types.ts` already has a partial `Condition` type (`slug`, `name`, `summary`, `understanding`, `accidentBanner`) consumed by two already-built-but-unmounted components: `UnderstandingCondition` (`components/sections/understanding-condition.tsx`) and `AccidentBanner` (`components/sections/accident-banner.tsx`). Neither component is referenced from any `app/` route today (confirmed by grep), so the schema can be expanded/renamed without any live-page regression — but the two consumer components must be updated in the same task as the schema change to keep `npm run typecheck` green. The single existing aggregate file `content/conditions/conditions.ts` (`neckPainCondition`) is deleted and replaced by 5 per-condition files matching the ticket's file list. `comparisonRows` reuses the existing shared `comparisonTableRows` / `autoAccidentComparisonRows` exports from `content/comparison-table.ts` (fully resolved per condition, not left for a future template to assemble). `whatWeTreat` items are hand-written per-condition blurbs (not reused service copy verbatim) using existing image assets already exported to `public/figma-exports/`. The Figma link in the ticket (node-id 96-250) resolves to a single small decorative layer (69×69px `Layer_1`), and a follow-up `get_metadata` call on the document root hit the Figma MCP Starter-plan rate limit — the same wall every prior ticket in this repo's history has hit on its first or second call (see `docs/superpowers/specs/2026-07-29-how-we-help-variant-copy-design.md`, `2026-07-24-point-to-where-it-hurts-design.md`, `2026-07-23-understanding-condition-design.md`). Per this repo's established fallback, all condition copy below is written directly, in the site's existing brand voice (Align the Spine Chiropractic / Dr. Abe Nasser / South Florida / 14-day Florida PIP window), reusing verbatim the two pieces of copy that already exist in the codebase (`neckPainCondition`'s intro/causes/redFlags/accidentBanner) for continuity.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies, no new design tokens, no new image assets (all `whatWeTreat`/hero/understanding images reuse existing files already in `public/figma-exports/`).

## Global Constraints

- No component-level test framework in active use in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build` — same convention as every prior plan in `docs/superpowers/plans/`.
- No lorem/placeholder copy anywhere in the 5 content files — every string is real, condition-specific copy (per ticket acceptance criteria).
- Florida PIP: treatment must begin within **14 days** of the accident (`lib/pip-window.ts`'s `PIP_WINDOW_DAYS`) — every `accident.headline`/`body`/`smallprint` must stay consistent with this fact, never a different number.
- Florida's statutory minimum PIP coverage is **$10,000** — used verbatim in the auto-accident file's `flags.pipStat`.
- Do not add or modify any route under `app/` — this ticket is schema + content only; wiring a real ConditionPage template is ATS-061's job (blocked by this ticket, not part of it).
- Reuse only image assets that already exist in `public/figma-exports/` (verified via directory listing) — never invent a filename.
- `content/comparison-table.ts`, `content/services-grid.ts`, `lib/pip-window.ts`, `components/ui/service-card.tsx`, `components/sections/how-we-help-steps.tsx`, and `content/auto-accident.ts` (the HOW WE HELP steps file from the prior ticket) are all unchanged by this plan — only `content/conditions/*` and the two files listed in Task 1 are touched.

---

### Task 1: Redefine the typed `Condition` schema and update its two existing consumers

**Files:**

- Modify: `content/conditions/types.ts`
- Modify: `components/sections/understanding-condition.tsx`
- Modify: `components/sections/accident-banner.tsx`
- Delete: `content/conditions/conditions.ts`

**Interfaces:**

- Produces: `Condition`, `ConditionHero`, `ConditionType`, `ConditionUnderstanding`, `ConditionAccident`, `ConditionFaqItem`, `ConditionFaq`, `ConditionWhatWeTreatItem`, `ConditionFlags` — all exported from `@/content/conditions/types`. Consumed by Tasks 2–6's 5 content files, and by `UnderstandingCondition`/`AccidentBanner` (this task).
- Consumes: `ComparisonRow` from `@/content/comparison-table` (already exists, unchanged).

- [ ] **Step 1: Rewrite `content/conditions/types.ts`**

```ts
import type { ComparisonRow } from "@/content/comparison-table";

export interface ConditionHero {
  /** Small uppercase chip above the H1 (Hero's `conditionChip`), e.g. "NECK PAIN". */
  eyebrowChip: string;
  h1: string;
  subhead: string;
  backgroundImage: { src: string; alt: string };
}

export interface ConditionType {
  name: string;
  desc: string;
}

export interface ConditionUnderstanding {
  /** Full eyebrow line, e.g. "Understanding Neck Pain" — rendered as-is. */
  eyebrow: string;
  intro: string;
  image: { src: string; alt: string };
  types: ConditionType[];
  causes: string[];
  /** Flat list of warning symptoms. The card's static "See a doctor
   * promptly if you notice:" title lives in UnderstandingCondition, not
   * here — it never varies by condition. */
  redFlags: string[];
}

export interface ConditionAccident {
  headline: string;
  body: string;
  smallprint: string;
}

export interface ConditionFaqItem {
  q: string;
  a: string;
}

export interface ConditionFaq {
  /** Header tail: "Everything you need to know about {headerTail}" */
  headerTail: string;
  items: ConditionFaqItem[];
}

export interface ConditionWhatWeTreatItem {
  title: string;
  desc: string;
  image: { src: string; alt: string };
  href: string;
}

export interface ConditionFlags {
  /** True only for the auto-accident page — gates the extra comparison
   * rows, the PIP stat, and (in the future ConditionPage template,
   * ATS-061) the HOW WE HELP section already built in
   * `content/auto-accident.ts` / `components/sections/how-we-help-steps.tsx`. */
  isAccidentVariant: boolean;
  /** True when `comparisonRows` includes the auto-accident-only rows. */
  extraComparisonRows: boolean;
  /** Florida PIP coverage stat, shown only on the auto-accident page. */
  pipStat?: { label: string; value: string };
}

export interface Condition {
  slug: string;
  name: string;
  hero: ConditionHero;
  understanding: ConditionUnderstanding;
  accident: ConditionAccident;
  comparisonRows: ComparisonRow[];
  faq: ConditionFaq;
  whatWeTreat: ConditionWhatWeTreatItem[];
  flags: ConditionFlags;
}
```

- [ ] **Step 2: Update `components/sections/understanding-condition.tsx` for the new field names**

Replace the full file with:

```tsx
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RedFlagCard } from "@/components/ui/red-flag-card";
import { Section } from "@/components/ui/section";
import { TypeCard } from "@/components/ui/type-card";
import type { Condition } from "@/content/conditions/types";

export interface UnderstandingConditionProps {
  condition: Condition;
  className?: string;
}

/** Static per condition-page-spec §B3 — the red-flag card's call-to-action
 * title never varies by condition, only its bullet list does. */
const RED_FLAGS_TITLE = "See a doctor promptly if you notice:";

/** "Understanding [condition]" educational block per condition-page-spec §B3, §C:
 * eyebrow + intro + supporting image, then a hairline-divided Types/Common Causes
 * split, then a RedFlagCard callout. Fully data-driven off Condition.understanding
 * so every condition page can reuse this one component. */
export function UnderstandingCondition({ condition, className }: UnderstandingConditionProps) {
  const { understanding } = condition;
  const { eyebrow, intro, image, types, causes, redFlags } = understanding;

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <p className="font-display text-understanding-intro text-navy-900">{intro}</p>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-stretch">
          <div className="flex flex-1 flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">Types</h3>
            <div className="flex flex-col gap-6">
              {types.map((type) => (
                <TypeCard key={type.name} name={type.name} description={type.desc} />
              ))}
            </div>
          </div>

          <Divider orientation="vertical" className="hidden md:block" />

          <div className="flex flex-1 flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">Common Causes</h3>
            <ul className="flex flex-col">
              {causes.map((cause) => (
                <li key={cause}>
                  <Divider />
                  <div className="flex items-center gap-3 py-4">
                    <span
                      aria-hidden="true"
                      className="h-[11px] w-[11px] shrink-0 rounded-full bg-teal-500"
                    />
                    <span className="font-alt text-faq-a text-ink-900">{cause}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <RedFlagCard title={RED_FLAGS_TITLE} bullets={redFlags} />
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: Update `components/sections/accident-banner.tsx` for the new field names**

Replace the full file with:

```tsx
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PipCalculator } from "@/components/ui/pip-calculator";
import { Section } from "@/components/ui/section";
import type { Condition } from "@/content/conditions/types";

export interface AccidentBannerProps {
  condition: Condition;
  className?: string;
}

/** "Was this from an accident?" band per condition-page-spec §B4, §C:
 * navy rounded card, condition-driven headline/body/smallprint on the left,
 * PIPCalculator (ATS-032) on the right. Eyebrow is static — everything else
 * varies per condition via Condition.accident. */
export function AccidentBanner({ condition, className }: AccidentBannerProps) {
  const { accident } = condition;

  return (
    <Section className={className}>
      <Container>
        <div className="rounded-30 bg-navy-900 p-10 md:p-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6">
              <Eyebrow>Was this from an accident?</Eyebrow>
              <h2 className="font-display text-h2 md:text-understanding-intro text-white">
                {accident.headline}
              </h2>
              <p className="font-sans text-body-lg text-mute-300">{accident.body}</p>

              <div className="flex items-start gap-4 rounded-30 bg-overlay-white-15 px-5 py-4 lg:items-center lg:rounded-full">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500 font-sans text-sm font-bold text-white"
                >
                  !
                </span>
                <p className="font-sans text-small-print text-mute-300">{accident.smallprint}</p>
              </div>
            </div>

            <div className="w-full lg:ml-auto lg:max-w-md">
              <PipCalculator />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Delete the superseded aggregate file**

```bash
rm content/conditions/conditions.ts
```

- [ ] **Step 5: Verify types still check**

Run: `npm run typecheck`
Expected: exits 0, no errors. `content/conditions/conditions.ts` (the only importer of the old schema shape besides the two components just updated) is deleted, and no other file in the repo imports `content/conditions/conditions` or `neckPainCondition` (confirmed by grep before writing this plan) — so nothing should be left dangling. If this fails, grep for `neckPainCondition` and `conditions/conditions` and remove any stragglers before continuing.

- [ ] **Step 6: Commit**

```bash
git add content/conditions/types.ts components/sections/understanding-condition.tsx components/sections/accident-banner.tsx
git rm content/conditions/conditions.ts
git commit -m "feat: define typed Condition schema for the condition engine"
```

---

### Task 2: `content/conditions/neck.ts`

**Files:**

- Create: `content/conditions/neck.ts`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`, Task 1), `comparisonTableRows` (`@/content/comparison-table`, existing).
- Produces: `neckPainCondition: Condition` const export.

- [ ] **Step 1: Write `content/conditions/neck.ts`**

```ts
import { comparisonTableRows } from "@/content/comparison-table";
import type { Condition } from "@/content/conditions/types";

/** Neck Pain condition content per condition-page-spec §B, §C. */
export const neckPainCondition: Condition = {
  slug: "neck-pain",
  name: "Neck Pain",
  hero: {
    eyebrowChip: "NECK PAIN",
    h1: "Neck Pain Relief That Actually Lasts",
    subhead:
      "From desk-job stiffness to whiplash aftermath, Dr. Abe Nasser builds a plan that restores motion instead of just masking the ache.",
    backgroundImage: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser examining a patient's neck",
    },
  },
  understanding: {
    eyebrow: "Understanding Neck Pain",
    intro:
      "Neck pain can range from a dull, nagging stiffness to sharp pain that limits how far you can turn your head. Left untreated, it often radiates into the shoulders and upper back.",
    image: {
      src: "/figma-exports/align-thespne-neck.png",
      alt: "Illustration of the cervical spine",
    },
    types: [
      {
        name: "Acute Neck Pain",
        desc: "Sudden onset, usually tied to a specific movement, injury, or sleeping position. Typically resolves within a few weeks with the right care.",
      },
      {
        name: "Chronic Neck Pain",
        desc: "Persists for three months or longer, often from poor posture, repetitive strain, or an old injury that never fully healed.",
      },
    ],
    causes: [
      "Poor posture from prolonged desk or phone use",
      "Whiplash from a car accident",
      "Sleeping in an awkward position",
      "Muscle strain from overexertion",
      "Degenerative changes in the cervical spine",
    ],
    redFlags: [
      "Numbness or tingling radiating into your arms or hands",
      "Neck pain following a fall, car accident, or direct blow",
      "Fever, unexplained weight loss, or night sweats alongside neck pain",
    ],
  },
  accident: {
    headline: "If a collision triggered this, Florida gives you 14 days",
    body: "Neck pain after an accident usually traces back to whiplash — sudden strain on the muscles and ligaments supporting your cervical spine. If a collision is anywhere in this story, Florida law gives you 14 days to get evaluated and protect your PIP benefits.",
    smallprint:
      "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
  },
  comparisonRows: comparisonTableRows,
  faq: {
    headerTail: "neck pain",
    items: [
      {
        q: "Is it normal for neck pain to spread into my shoulders?",
        a: "Yes — the muscles and nerves in your neck connect directly into the shoulders and upper back, so referred pain and stiffness in that area is common with both acute and chronic neck pain.",
      },
      {
        q: "Can a chiropractor help with a pinched nerve in my neck?",
        a: "Often, yes. Gentle cervical adjustments and soft-tissue work can relieve the pressure causing nerve irritation, though we'll confirm it's a good fit during your exam.",
      },
      {
        q: "How long until I feel relief?",
        a: "Many patients notice less stiffness within the first 2–3 visits, though how quickly you improve depends on whether the pain is acute or chronic.",
      },
      {
        q: "Should I still come in if my neck pain started weeks ago?",
        a: "Yes — chronic neck pain responds well to care too. We'll build a plan around how long you've had it and what's likely causing it.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Adjustments",
      desc: "Hands-on cervical adjustments that restore motion to fixated neck segments and ease the stiffness that builds up from poor posture or old injuries.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Posture & Corrective",
      desc: "Corrective care that retrains the neck and upper back for long-term alignment, not just short-term relief from desk or phone strain.",
      image: { src: "/figma-exports/drabe-spine.png", alt: "Posture and corrective spinal care" },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Myofascial release that loosens the muscle spasms behind neck stiffness, often paired with adjustments for faster recovery.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services",
    },
  ],
  flags: {
    isAccidentVariant: false,
    extraComparisonRows: false,
  },
};
```

- [ ] **Step 2: Verify types check and no placeholder copy slipped in**

Run: `npm run typecheck`
Expected: exits 0, no errors.

Run: `grep -i "lorem" content/conditions/neck.ts`
Expected: no output (no match).

- [ ] **Step 3: Commit**

```bash
git add content/conditions/neck.ts
git commit -m "feat: add neck pain condition content"
```

---

### Task 3: `content/conditions/whiplash.ts`

**Files:**

- Create: `content/conditions/whiplash.ts`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`, Task 1), `comparisonTableRows` (`@/content/comparison-table`, existing).
- Produces: `whiplashCondition: Condition` const export.

- [ ] **Step 1: Write `content/conditions/whiplash.ts`**

```ts
import { comparisonTableRows } from "@/content/comparison-table";
import type { Condition } from "@/content/conditions/types";

/** Whiplash condition content per condition-page-spec §B, §C. */
export const whiplashCondition: Condition = {
  slug: "whiplash",
  name: "Whiplash",
  hero: {
    eyebrowChip: "WHIPLASH",
    h1: "Whiplash Doesn't Always Hurt Right Away",
    subhead:
      "Soft-tissue injuries from a collision can stay quiet for days. Dr. Abe Nasser documents and treats whiplash early, before it becomes a long-term problem.",
    backgroundImage: {
      src: "/figma-exports/drabe-whiplash-man.png",
      alt: "Man holding his neck after a car accident, showing signs of whiplash",
    },
  },
  understanding: {
    eyebrow: "Understanding Whiplash",
    intro:
      "Whiplash happens when a sudden impact snaps the neck forward and back faster than the muscles and ligaments can brace for it. Symptoms often don't appear until 24–72 hours after the accident, which is why early evaluation matters even if you feel fine.",
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Illustration of whiplash neck injury mechanics",
    },
    types: [
      {
        name: "Grade I–II Whiplash",
        desc: "Neck pain, stiffness, and reduced range of motion without measurable nerve involvement. The most common presentation after a rear-end collision.",
      },
      {
        name: "Grade III–IV Whiplash",
        desc: "Includes neurological signs like numbness, weakness, or reflex changes, sometimes with fracture or dislocation. Requires prompt, closely managed care.",
      },
    ],
    causes: [
      "Rear-end car collisions, even at low speed",
      "Contact sports impacts",
      "Slip-and-fall accidents",
      "Sudden stops or jolts while riding as a passenger",
    ],
    redFlags: [
      "Numbness, tingling, or weakness in your arms or hands",
      "Severe headache or dizziness that won't go away",
      "Blurred vision or trouble concentrating after the accident",
    ],
  },
  accident: {
    headline: "The 14-day window starts the day of the crash — not the day it starts to hurt",
    body: "Whiplash symptoms are notorious for showing up late, but Florida's PIP clock doesn't wait for the pain to catch up. Getting evaluated within 14 days of the accident is what keeps your benefits — and your claim — intact.",
    smallprint:
      "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
  },
  comparisonRows: comparisonTableRows,
  faq: {
    headerTail: "whiplash",
    items: [
      {
        q: "I feel fine after my accident — do I still need to get checked?",
        a: "Yes. Whiplash and other soft-tissue injuries often take 1–3 days to show symptoms. An early exam creates the documentation your PIP claim needs even if you feel okay right now.",
      },
      {
        q: "Will an X-ray or MRI be part of my visit?",
        a: "If your exam findings call for it, we'll order imaging to rule out fracture or disc involvement — most whiplash cases don't need it, but we won't guess when it matters.",
      },
      {
        q: "How long does whiplash recovery usually take?",
        a: "Mild cases often improve in a few weeks of care; more significant injuries can take a few months. We reassess regularly and adjust your plan as you progress.",
      },
      {
        q: "Do I need a lawyer to see you for a whiplash claim?",
        a: "No — you can come in with or without an attorney. If you do have one, our documentation is built to support that claim directly.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Adjustments",
      desc: "Gentle cervical adjustments that restore motion lost to whiplash's sudden neck-and-back snap, without forcing a still-inflamed joint.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Myofascial release for the muscle spasms and adhesions whiplash leaves behind in the neck and upper back.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services",
    },
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression for whiplash cases where disc pressure is contributing to arm or hand symptoms.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services",
    },
  ],
  flags: {
    isAccidentVariant: false,
    extraComparisonRows: false,
  },
};
```

- [ ] **Step 2: Verify types check and no placeholder copy slipped in**

Run: `npm run typecheck`
Expected: exits 0, no errors.

Run: `grep -i "lorem" content/conditions/whiplash.ts`
Expected: no output (no match).

- [ ] **Step 3: Commit**

```bash
git add content/conditions/whiplash.ts
git commit -m "feat: add whiplash condition content"
```

---

### Task 4: `content/conditions/back-pain.ts`

**Files:**

- Create: `content/conditions/back-pain.ts`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`, Task 1), `comparisonTableRows` (`@/content/comparison-table`, existing).
- Produces: `backPainCondition: Condition` const export.

- [ ] **Step 1: Write `content/conditions/back-pain.ts`**

```ts
import { comparisonTableRows } from "@/content/comparison-table";
import type { Condition } from "@/content/conditions/types";

/** Back Pain condition content per condition-page-spec §B, §C. */
export const backPainCondition: Condition = {
  slug: "back-pain",
  name: "Back Pain",
  hero: {
    eyebrowChip: "BACK PAIN",
    h1: "Back Pain Care Built Around Your Recovery",
    subhead:
      "Whether it's a stubborn ache or a sharp, sudden pain, Dr. Abe Nasser gets to the cause instead of just calming the symptom.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Man holding his lower back in pain",
    },
  },
  understanding: {
    eyebrow: "Understanding Back Pain",
    intro:
      "Back pain can show up as a dull ache after a long day or a sharp, locking pain that stops you mid-movement. It's one of the most common reasons people come in — and one of the most treatable when the actual cause is identified early.",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Dr. Abe examining a patient's lower back",
    },
    types: [
      {
        name: "Mechanical Back Pain",
        desc: "Pain from joint, muscle, or ligament strain in the spine itself — the most common type, often tied to posture, lifting, or overuse.",
      },
      {
        name: "Disc-Related Back Pain",
        desc: "Pain from a bulging or herniated disc pressing on nearby structures, often radiating into the hip or leg.",
      },
    ],
    causes: [
      "Heavy lifting with poor form",
      "Prolonged sitting or standing",
      "Car accidents and sudden impacts",
      "Degenerative disc changes over time",
      "Muscle imbalance from inactivity",
    ],
    redFlags: [
      "Numbness, tingling, or weakness in one or both legs",
      "Loss of bladder or bowel control",
      "Back pain following a fall, accident, or direct blow",
    ],
  },
  accident: {
    headline: "Back pain after a crash needs documentation, not just rest",
    body: "A sudden impact can strain the discs and joints of the lower back in ways that don't show up until days later. Florida law gives you 14 days after the accident to get evaluated and protect your PIP benefits.",
    smallprint:
      "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
  },
  comparisonRows: comparisonTableRows,
  faq: {
    headerTail: "back pain",
    items: [
      {
        q: "Is it safe to get adjusted if I have a herniated disc?",
        a: "Often yes — many disc-related cases respond well to gentle adjustments and decompression. We'll confirm what's safe for your specific case during your exam, not guess.",
      },
      {
        q: "Should I rest or stay active with back pain?",
        a: "Some rest helps early on, but too much of it can slow recovery. We'll give you a specific plan for what to do and avoid based on what's actually causing your pain.",
      },
      {
        q: "What if my back pain radiates down my leg?",
        a: "That's often a sign of nerve involvement, commonly from a disc issue or sciatica. It's worth an exam sooner rather than later so we can catch it early.",
      },
      {
        q: "How many visits does back pain usually take to improve?",
        a: "Mechanical strain often improves within a few visits; disc-related pain can take longer. We reassess along the way and adjust the plan as you go.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression that opens up compressed joints and eases pressure on discs and nerves in the lower back.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services",
    },
    {
      title: "Adjustments",
      desc: "Hands-on adjustments that restore motion to fixated segments in the mid and low back — the foundation of most back-pain treatment plans.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Soft-tissue work that loosens the muscle guarding and spasm that often accompanies low-back pain.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services",
    },
  ],
  flags: {
    isAccidentVariant: false,
    extraComparisonRows: false,
  },
};
```

- [ ] **Step 2: Verify types check and no placeholder copy slipped in**

Run: `npm run typecheck`
Expected: exits 0, no errors.

Run: `grep -i "lorem" content/conditions/back-pain.ts`
Expected: no output (no match).

- [ ] **Step 3: Commit**

```bash
git add content/conditions/back-pain.ts
git commit -m "feat: add back pain condition content"
```

---

### Task 5: `content/conditions/sciatica.ts`

**Files:**

- Create: `content/conditions/sciatica.ts`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`, Task 1), `comparisonTableRows` (`@/content/comparison-table`, existing).
- Produces: `sciaticaCondition: Condition` const export.

- [ ] **Step 1: Write `content/conditions/sciatica.ts`**

```ts
import { comparisonTableRows } from "@/content/comparison-table";
import type { Condition } from "@/content/conditions/types";

/** Sciatica condition content per condition-page-spec §B, §C. */
export const sciaticaCondition: Condition = {
  slug: "sciatica",
  name: "Sciatica",
  hero: {
    eyebrowChip: "SCIATICA",
    h1: "Stop Living Around the Pain in Your Leg",
    subhead:
      "Sciatica isn't something to just push through. Dr. Abe Nasser targets the nerve compression causing it, not just the pain it sends down your leg.",
    backgroundImage: {
      src: "/figma-exports/align-thespine-back.png",
      alt: "Man experiencing sciatic nerve pain radiating down his leg",
    },
  },
  understanding: {
    eyebrow: "Understanding Sciatica",
    intro:
      "Sciatica is nerve pain, not muscle pain — it starts with compression somewhere along the sciatic nerve in your lower spine and radiates down through the hip, leg, and sometimes into the foot. It can range from a dull ache to a sharp, shooting pain that makes sitting or standing miserable.",
    image: {
      src: "/figma-exports/abe-back.png",
      alt: "Dr. Abe examining a patient with sciatic nerve pain",
    },
    types: [
      {
        name: "Acute Sciatica",
        desc: "A sudden flare, often triggered by lifting, twisting, or a herniated disc pressing on the nerve. Usually improves within weeks with the right care.",
      },
      {
        name: "Chronic Sciatica",
        desc: "Recurring or long-standing nerve compression, often from degenerative changes or a disc issue that's never fully resolved.",
      },
    ],
    causes: [
      "Herniated or bulging lumbar disc",
      "Spinal stenosis narrowing the nerve pathway",
      "Piriformis muscle spasm compressing the nerve",
      "Prolonged sitting or poor posture",
      "Pregnancy-related pelvic shifts",
    ],
    redFlags: [
      "Sudden weakness or numbness in your leg or foot",
      "Loss of bladder or bowel control",
      "Pain in both legs at the same time",
    ],
  },
  accident: {
    headline: "Sciatic pain after a crash traces back to spinal impact, not just soreness",
    body: "A collision can jolt the lower spine enough to compress the sciatic nerve, even if the pain doesn't start until days later. Florida law gives you 14 days after the accident to get evaluated and protect your PIP benefits.",
    smallprint:
      "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
  },
  comparisonRows: comparisonTableRows,
  faq: {
    headerTail: "sciatica",
    items: [
      {
        q: "Can a chiropractor actually help sciatica, or just back pain?",
        a: "Yes — sciatica often responds well to decompression and targeted adjustments that relieve pressure on the nerve itself, not just the surrounding muscles.",
      },
      {
        q: "Why does my leg hurt more than my back?",
        a: "Because sciatica is nerve pain that travels — the compression is usually in your lower spine, but the pain you feel most is often along the nerve's path down your leg.",
      },
      {
        q: "Is walking good or bad for sciatica?",
        a: "Usually good in moderation — it keeps the area mobile without loading the spine the way sitting does. We'll tell you what's right for your specific case.",
      },
      {
        q: "How fast can I expect relief?",
        a: "Acute cases often ease within a few visits; nerve pain that's been building for months usually takes longer. We'll set expectations after your first exam.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression that's often the most direct way to take pressure off the compressed nerve causing sciatica.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services",
    },
    {
      title: "Adjustments",
      desc: "Targeted lumbar adjustments that restore motion to the segment compressing the sciatic nerve.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Soft-tissue work on the piriformis and surrounding muscles, which are often part of what's compressing the nerve.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services",
    },
  ],
  flags: {
    isAccidentVariant: false,
    extraComparisonRows: false,
  },
};
```

- [ ] **Step 2: Verify types check and no placeholder copy slipped in**

Run: `npm run typecheck`
Expected: exits 0, no errors.

Run: `grep -i "lorem" content/conditions/sciatica.ts`
Expected: no output (no match).

- [ ] **Step 3: Commit**

```bash
git add content/conditions/sciatica.ts
git commit -m "feat: add sciatica condition content"
```

---

### Task 6: `content/conditions/auto-accident.ts` — with accident-variant flags set

**Files:**

- Create: `content/conditions/auto-accident.ts`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`, Task 1), `comparisonTableRows` + `autoAccidentComparisonRows` (`@/content/comparison-table`, existing).
- Produces: `autoAccidentCondition: Condition` const export.

Note: this file lives at `content/conditions/auto-accident.ts` and is distinct from the existing top-level `content/auto-accident.ts` (the HOW WE HELP step content from the prior ticket) — different directory, no collision, no changes to that file. `slug` is `"auto-accidents"` (plural) to match the live nav entry `siteConfig.nav` → `{ label: "Auto Accidents", href: "/auto-accidents" }`, even though the ticket's file-list shorthand is singular ("auto-accident.ts").

- [ ] **Step 1: Write `content/conditions/auto-accident.ts`**

```ts
import { autoAccidentComparisonRows, comparisonTableRows } from "@/content/comparison-table";
import type { Condition } from "@/content/conditions/types";

/** Auto Accident condition content per condition-page-spec §B, §C. The
 * accident-variant flags below (extra comparison rows, $10k Florida PIP
 * stat) are the only 3 fields this ticket's acceptance criteria calls out
 * by name; the future ConditionPage template (ATS-061) is expected to gate
 * the already-built HOW WE HELP section
 * (components/sections/how-we-help-steps.tsx + content/auto-accident.ts's
 * autoAccidentSteps) behind this same `flags.isAccidentVariant`, rather
 * than adding a redundant 4th flag key. */
export const autoAccidentCondition: Condition = {
  slug: "auto-accidents",
  name: "Auto Accident Injuries",
  hero: {
    eyebrowChip: "AUTO ACCIDENT CARE",
    h1: "Injured In A Crash? You Have 14 Days.",
    subhead:
      "Same-day evaluations, PIP billed directly, and documentation your claim can stand on — Dr. Abe Nasser handles the whole thing so you don't have to.",
    backgroundImage: {
      src: "/figma-exports/drabe-xray-newpt.png",
      alt: "X-ray review during a new patient accident evaluation",
    },
  },
  understanding: {
    eyebrow: "Understanding Accident Injuries",
    intro:
      "Car accidents don't just cause the injury you can feel right away — the real damage is often soft-tissue and joint trauma that takes days to surface. Getting a full evaluation early both protects your health and creates the record your PIP claim depends on.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Dr. Abe Nasser consulting with a new accident patient",
    },
    types: [
      {
        name: "Soft-Tissue Injuries",
        desc: "Whiplash, muscle strain, and ligament sprain from the sudden force of a collision — the most common accident injury, and often the slowest to show symptoms.",
      },
      {
        name: "Spinal & Disc Injuries",
        desc: "Joint misalignment or disc damage from impact, which can cause pain that radiates into the arms, hips, or legs if left untreated.",
      },
    ],
    causes: [
      "Rear-end and side-impact collisions",
      "Sudden braking or swerving",
      "Airbag deployment force",
      "Being a passenger during a low-speed impact",
    ],
    redFlags: [
      "Numbness, tingling, or weakness in your arms or legs",
      "Severe headache, dizziness, or confusion after the crash",
      "Chest, abdominal, or worsening pain of any kind",
    ],
  },
  accident: {
    headline: "Florida law gives you 14 days to protect your PIP benefits",
    body: "It doesn't matter who was at fault — Florida's no-fault insurance law requires treatment to begin within 14 days of the accident for your PIP benefits to cover it. We handle the exam, the documentation, and the billing directly.",
    smallprint:
      "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
  },
  comparisonRows: [...comparisonTableRows, ...autoAccidentComparisonRows],
  faq: {
    headerTail: "car accident injuries",
    items: [
      {
        q: "I feel fine — do I really need to be seen?",
        a: "Yes. Adrenaline and swelling can mask injuries for days. An early evaluation both protects your health and creates the documentation your PIP claim needs, even if you feel okay right now.",
      },
      {
        q: "Will this cost me anything out of pocket?",
        a: "In most PIP-covered cases, your evaluation and treatment are billed directly to your auto insurance — typically $0 out-of-pocket. We'll verify your coverage before your first visit.",
      },
      {
        q: "Do I need a police report or an attorney to be seen?",
        a: "No — you can come in with just your insurance information. If you do have a police report or an attorney, we're happy to coordinate documentation with them.",
      },
      {
        q: "What happens after the 14-day window has passed?",
        a: "You may still have options, but PIP coverage becomes harder to secure the longer you wait. Call us — we'll talk through what's still possible for your case.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Adjustments",
      desc: "Hands-on adjustments that restore motion to the segments most commonly jarred loose by a collision.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Myofascial release for the whiplash and soft-tissue strain a crash leaves behind, paired with adjustments for faster recovery.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services",
    },
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression for accident cases where disc pressure is behind radiating arm or leg pain.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services",
    },
  ],
  flags: {
    isAccidentVariant: true,
    extraComparisonRows: true,
    pipStat: { label: "Florida PIP Coverage", value: "$10,000" },
  },
};
```

- [ ] **Step 2: Verify types check and no placeholder copy slipped in**

Run: `npm run typecheck`
Expected: exits 0, no errors.

Run: `grep -i "lorem" content/conditions/auto-accident.ts`
Expected: no output (no match).

- [ ] **Step 3: Commit**

```bash
git add content/conditions/auto-accident.ts
git commit -m "feat: add auto-accident condition content with accident-variant flags"
```

---

### Task 7: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full project verification**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

- [ ] **Step 2: Confirm all 5 files exist and no lorem/placeholder text anywhere in `content/conditions/`**

Run: `grep -ril "lorem\|placeholder\|TODO\|TBD" content/conditions/`
Expected: no output (no match).

- [ ] **Step 3: Confirm the auto-accident flags satisfy the acceptance criteria**

Run: `grep -A3 "flags:" content/conditions/auto-accident.ts`
Expected: shows `isAccidentVariant: true`, `extraComparisonRows: true`, and a `pipStat` with `value: "$10,000"`.

## Acceptance criteria mapping

- Typed schema exported + validated — Task 1's `content/conditions/types.ts` (`Condition` and its 8 nested interfaces), validated by `npm run typecheck` passing in every task and the final Task 7 build.
- All 5 files populated with real copy (no lorem) — Tasks 2–6 (`neck.ts`, `whiplash.ts`, `back-pain.ts`, `sciatica.ts`, `auto-accident.ts`), each verified individually with a `lorem` grep, plus the repo-wide check in Task 7.
- auto-accident flags set (extra rows, $10k PIP stat, HOW WE HELP) — Task 6's `flags: { isAccidentVariant: true, extraComparisonRows: true, pipStat: { value: "$10,000", ... } }`; `isAccidentVariant` is the single flag the future ConditionPage template (ATS-061) is expected to also gate the already-built HOW WE HELP section on (see Task 6's file-level doc comment).

## Known gap (flagged, not blocking)

The Figma link in the ticket (node-id 96-250) resolves to a single decorative 69×69px layer, not a content frame, and a follow-up `get_metadata` call on the document root hit the Figma MCP Starter-plan rate limit before any artboard text could be pulled. Every piece of copy in this plan is written directly (reusing the two pieces of copy already established in the deleted `neckPainCondition` for continuity), following this repo's established fallback for rate-limited tickets. If the real condition-page-spec §C "deltas table" becomes accessible later, treat any wording differences as a follow-up content pass, not a redo of the schema itself.
