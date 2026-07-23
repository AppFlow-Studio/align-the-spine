# Understanding Condition Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully data-driven "Understanding [condition]" educational block — eyebrow, intro statement, supporting image, a hairline-divided Types/Common Causes two-column split, and a RedFlagCard callout — as a single `UnderstandingCondition` component reusable by every condition page, fed by a new nested `understanding` block on the `Condition` type.

**Architecture:** Three new Tailwind fontSize tokens (`understanding-intro`, `type-name`, `redflag-bullet`) and one new overlay color (`overlay.teal-12`) land first. `content/conditions/types.ts` gets a new nested `ConditionUnderstanding` shape (`intro`, `image`, `types`, `causes`, `redFlags`) added to `Condition`. `content/conditions/conditions.ts` exports one real, fully-populated entry (`neckPainCondition`) since no ATS-060 data feed exists yet. Two small presentational primitives (`TypeCard`, `RedFlagCard`) go in `components/ui/`, matching this repo's existing granularity (`Card`, `Badge`, `ServiceCard`). `UnderstandingCondition` (`components/sections/understanding-condition.tsx`) is a server component that takes a single `condition: Condition` prop and composes everything, reusing `Section`, `Container`, `Eyebrow`, `Divider`, and the existing `h2`/`faq-a`/`faq-q` tokens. The component is verified visually with a temporary, uncommitted mount on the Home page (no condition-page route exists yet — that's ATS-022, not this ticket) — the mount is reverted before the work is done, so `app/page.tsx` has no net change.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No component-level test framework in active use in this repo (one `vitest` unit test exists, for a non-component util); verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- Reuse existing tokens/components exactly, do not reimplement: `Eyebrow` (`components/ui/eyebrow.tsx`), `Divider` (`components/ui/divider.tsx`, both orientations), `Section`/`Container` (`components/ui/section.tsx`/`components/ui/container.tsx`), the `h2` fontSize token (Types/Common Causes headers), the `faq-a` fontSize token paired with `font-alt` (TypeCard description, Common Causes row text), the `faq-q` fontSize token paired with `font-alt` (RedFlagCard title).
- New tokens only: `understanding-intro` (`50px`/`62px`/`400`), `type-name` (`30px`/`40px`/`600`), `redflag-bullet` (`23px`/`36px`/`400`) fontSizes, and `overlay.teal-12` (`rgba(88, 160, 160, 0.12)`) color — no other new tokens, no hardcoded hex values in component code.
- Colors `navy-900` (`#253067`), `teal-500` (`#58a0a0`), `ink-900` (`#1a1a1a`), `ink-500` (`#777777`) already exist — use `text-navy-900`/`text-teal-500`/`text-ink-900`/`text-ink-500`, never hardcode these hex values.
- The vertical column divider must be the existing `Divider` component (`orientation="vertical"`) inside a flex row, not Tailwind's `divide-x` utility (not used anywhere else in this codebase).
- Common Causes rows use a horizontal `Divider` before every row, including the first — matching `ServicesSection`'s established convention.
- Both the Common Causes dot and the RedFlagCard bullet dot are a plain `h-[11px] w-[11px] rounded-full bg-teal-500` span — no icon asset.
- `Condition.understanding.types` and `.causes` are plain arrays (`ConditionType[]`, `string[]`), not fixed-length tuples — matches every other list type in this repo.
- Do not add or modify any route under `app/` other than the temporary, reverted `app/page.tsx` edit in the final task — no condition-page route exists yet (ATS-022).
- Supporting image is `/figma-exports/dr-abe-neck.png` (already present in the repo) — do not add a new image asset.

---

### Task 1: Design tokens — `understanding-intro`, `type-name`, `redflag-bullet` fontSizes, `overlay.teal-12` color

**Files:**

- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Interfaces:**

- Produces: CSS custom property `--overlay-teal-12`; Tailwind utilities `text-understanding-intro` (50px/62px/400), `text-type-name` (30px/40px/600), `text-redflag-bullet` (23px/36px/400), and `bg-overlay-teal-12` (`rgba(88, 160, 160, 0.12)`). Consumed by Task 4's `TypeCard`, Task 5's `RedFlagCard`, and Task 6's `UnderstandingCondition`.

- [ ] **Step 1: Add `--overlay-teal-12` to `app/globals.css`**

In `app/globals.css`, in the `:root` block, find the overlays block (currently lines 20–24):

```css
/* Design tokens: overlays (condition-page-spec §A2, partial) */
--overlay-navy-20: rgba(37, 48, 103, 0.2);
--overlay-white-15: rgba(255, 255, 255, 0.15);
--overlay-white-16: rgba(255, 255, 255, 0.16); /* dark-form field fill (§A7) */
--overlay-ink-20: rgba(26, 26, 26, 0.2); /* doctor-profile rating chip overlay (§B6) */
```

Replace with:

```css
/* Design tokens: overlays (condition-page-spec §A2, partial) */
--overlay-navy-20: rgba(37, 48, 103, 0.2);
--overlay-white-15: rgba(255, 255, 255, 0.15);
--overlay-white-16: rgba(255, 255, 255, 0.16); /* dark-form field fill (§A7) */
--overlay-ink-20: rgba(26, 26, 26, 0.2); /* doctor-profile rating chip overlay (§B6) */
--overlay-teal-12: rgba(88, 160, 160, 0.12); /* RedFlagCard box background (§B3) */
```

- [ ] **Step 2: Add `overlay.teal-12` to `tailwind.config.ts`**

In `tailwind.config.ts`, find the `overlay` block inside `colors` (currently lines 33–38):

```ts
        overlay: {
          "navy-20": "var(--overlay-navy-20)",
          "white-15": "var(--overlay-white-15)",
          "white-16": "var(--overlay-white-16)",
          "ink-20": "var(--overlay-ink-20)",
        },
```

Replace with:

```ts
        overlay: {
          "navy-20": "var(--overlay-navy-20)",
          "white-15": "var(--overlay-white-15)",
          "white-16": "var(--overlay-white-16)",
          "ink-20": "var(--overlay-ink-20)",
          "teal-12": "var(--overlay-teal-12)",
        },
```

- [ ] **Step 3: Add the three new fontSize tokens to `tailwind.config.ts`**

In the same file, find the `"doctor-name"` entry at the end of the `fontSize` block (currently line 98):

```ts
        "doctor-name": ["65px", { lineHeight: "100px", fontWeight: "500" }],
      },
```

Replace with:

```ts
        "doctor-name": ["65px", { lineHeight: "100px", fontWeight: "500" }],
        "understanding-intro": ["50px", { lineHeight: "62px", fontWeight: "400" }],
        "type-name": ["30px", { lineHeight: "40px", fontWeight: "600" }],
        "redflag-bullet": ["23px", { lineHeight: "36px", fontWeight: "400" }],
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
git commit -m "feat: add understanding-condition font tokens and overlay-teal-12 color token"
```

---

### Task 2: Extend `Condition` type with the `understanding` block

**Files:**

- Modify: `content/conditions/types.ts`

**Interfaces:**

- Produces: `ConditionType` (`{ name: string; description: string }`), `ConditionRedFlags` (`{ title: string; bullets: string[] }`), `ConditionUnderstanding` (`{ intro: string; image: { src: string; alt: string }; types: ConditionType[]; causes: string[]; redFlags: ConditionRedFlags }`), and `Condition.understanding: ConditionUnderstanding`. Consumed by Task 3's `content/conditions/conditions.ts` and Task 6's `UnderstandingCondition`.

- [ ] **Step 1: Rewrite `content/conditions/types.ts`**

Current file:

```ts
export interface Condition {
  slug: string;
  name: string;
  summary: string;
}
```

Replace with:

```ts
export interface ConditionType {
  name: string;
  description: string;
}

export interface ConditionRedFlags {
  title: string;
  bullets: string[];
}

export interface ConditionUnderstanding {
  intro: string;
  image: { src: string; alt: string };
  types: ConditionType[];
  causes: string[];
  redFlags: ConditionRedFlags;
}

export interface Condition {
  slug: string;
  name: string;
  summary: string;
  understanding: ConditionUnderstanding;
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
git add content/conditions/types.ts
git commit -m "feat: add understanding block to Condition type"
```

---

### Task 3: `content/conditions/conditions.ts` — Neck Pain content

**Files:**

- Create: `content/conditions/conditions.ts`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`, from Task 2).
- Produces: `neckPainCondition: Condition` const export. Consumed by Task 6's temporary Home-page mount (Task 7).

- [ ] **Step 1: Write `content/conditions/conditions.ts`**

```ts
import type { Condition } from "@/content/conditions/types";

/** Neck Pain condition content per condition-page-spec §B3, §C. Stands in for
 * the not-yet-built ATS-060 condition data feed — the shape here is what
 * ATS-060 is expected to populate for every condition. */
export const neckPainCondition: Condition = {
  slug: "neck-pain",
  name: "Neck Pain",
  summary: "Relief from chronic and acute neck pain through targeted chiropractic care.",
  understanding: {
    intro:
      "Neck pain can range from a dull, nagging stiffness to sharp pain that limits how far you can turn your head. Left untreated, it often radiates into the shoulders and upper back.",
    image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe examining a patient's neck" },
    types: [
      {
        name: "Acute Neck Pain",
        description:
          "Sudden onset, usually tied to a specific movement, injury, or sleeping position. Typically resolves within a few weeks with the right care.",
      },
      {
        name: "Chronic Neck Pain",
        description:
          "Persists for three months or longer, often from poor posture, repetitive strain, or an old injury that never fully healed.",
      },
    ],
    causes: [
      "Poor posture from prolonged desk or phone use",
      "Whiplash from a car accident",
      "Sleeping in an awkward position",
      "Muscle strain from overexertion",
      "Degenerative changes in the cervical spine",
    ],
    redFlags: {
      title: "See a doctor promptly if you notice:",
      bullets: [
        "Numbness or tingling radiating into your arms or hands",
        "Neck pain following a fall, car accident, or direct blow",
        "Fever, unexplained weight loss, or night sweats alongside neck pain",
      ],
    },
  },
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
git add content/conditions/conditions.ts
git commit -m "feat: add neck pain condition content"
```

---

### Task 4: `TypeCard` component

**Files:**

- Create: `components/ui/type-card.tsx`

**Interfaces:**

- Consumes: `cn` (`@/lib/cn`); `type-name` fontSize token from Task 1.
- Produces: `TypeCard` named export, props `{ name: string; description: string; className?: string }`. Consumed by Task 6's `UnderstandingCondition`.

- [ ] **Step 1: Write `components/ui/type-card.tsx`**

```tsx
import { cn } from "@/lib/cn";

export interface TypeCardProps {
  name: string;
  description: string;
  className?: string;
}

/** TypeCard per condition-page-spec §B3: name (Poppins SemiBold 30 teal-500)
 * + description (Geist 25/40 ink-500). Plain stacked text, no border/background. */
export function TypeCard({ name, description, className }: TypeCardProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h4 className="font-sans text-type-name text-teal-500">{name}</h4>
      <p className="font-alt text-faq-a text-ink-500">{description}</p>
    </div>
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
git add components/ui/type-card.tsx
git commit -m "feat: add TypeCard component"
```

---

### Task 5: `RedFlagCard` component

**Files:**

- Create: `components/ui/red-flag-card.tsx`

**Interfaces:**

- Consumes: `cn` (`@/lib/cn`); `redflag-bullet`/`overlay.teal-12` tokens from Task 1; `faq-q` fontSize token (already exists, defined alongside `faq-a` in `tailwind.config.ts`).
- Produces: `RedFlagCard` named export, props `{ title: string; bullets: string[]; className?: string }`. Consumed by Task 6's `UnderstandingCondition`.

- [ ] **Step 1: Write `components/ui/red-flag-card.tsx`**

```tsx
import { cn } from "@/lib/cn";

export interface RedFlagCardProps {
  title: string;
  bullets: string[];
  className?: string;
}

/** RedFlagCard per condition-page-spec §B3: rgba(88,160,160,0.12) box, r20,
 * title Geist SemiBold 25 navy-900, teal-dot bullets Geist 23. */
export function RedFlagCard({ title, bullets, className }: RedFlagCardProps) {
  return (
    <div className={cn("rounded-20 bg-overlay-teal-12 p-8", className)}>
      <p className="font-alt text-faq-q text-navy-900">{title}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2.5 h-[11px] w-[11px] shrink-0 rounded-full bg-teal-500"
            />
            <span className="font-alt text-redflag-bullet text-ink-900">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
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
git add components/ui/red-flag-card.tsx
git commit -m "feat: add RedFlagCard component"
```

---

### Task 6: `UnderstandingCondition` section component

**Files:**

- Create: `components/sections/understanding-condition.tsx`

**Interfaces:**

- Consumes: `Condition` (`@/content/conditions/types`, from Task 2); `Container` (`@/components/ui/container`, `{ children, className?, as? }`); `Divider` (`@/components/ui/divider`, `{ orientation?, className? }`); `Eyebrow` (`@/components/ui/eyebrow`, `{ children, as?, className? }`); `Section` (`@/components/ui/section`, `{ children, spacing?, className?, as? }`); `TypeCard` (`@/components/ui/type-card`, from Task 4, `{ name, description, className? }`); `RedFlagCard` (`@/components/ui/red-flag-card`, from Task 5, `{ title, bullets, className? }`); `Image` (`next/image`); `understanding-intro` token from Task 1.
- Produces: `UnderstandingCondition` named export, props `{ condition: Condition; className?: string }`. Consumed by Task 7's temporary Home-page mount.

- [ ] **Step 1: Write `components/sections/understanding-condition.tsx`**

```tsx
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RedFlagCard } from "@/components/ui/red-flag-card";
import { Section } from "@/components/ui/section";
import { TypeCard } from "@/components/ui/type-card";
import type { Condition } from "@/content/conditions/types";
import { cn } from "@/lib/cn";

export interface UnderstandingConditionProps {
  condition: Condition;
  className?: string;
}

/** "Understanding [condition]" educational block per condition-page-spec §B3, §C:
 * eyebrow + intro + supporting image, then a hairline-divided Types/Common Causes
 * split, then a RedFlagCard callout. Fully data-driven off Condition.understanding
 * so every condition page can reuse this one component. */
export function UnderstandingCondition({ condition, className }: UnderstandingConditionProps) {
  const { name, understanding } = condition;
  const { intro, image, types, causes, redFlags } = understanding;

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Eyebrow>Understanding {name}</Eyebrow>
          <p className="font-display text-understanding-intro text-navy-900">{intro}</p>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-30">
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-stretch">
          <div className="flex flex-1 flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">Types</h3>
            <div className="flex flex-col gap-6">
              {types.map((type) => (
                <TypeCard key={type.name} name={type.name} description={type.description} />
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

        <RedFlagCard title={redFlags.title} bullets={redFlags.bullets} />
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

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exit 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/understanding-condition.tsx
git commit -m "feat: add UnderstandingCondition section"
```

---

### Task 7: Manual dev-server QA (temporary mount, not committed)

**Files:**

- Temporarily modify (do not commit): `app/page.tsx`

**Interfaces:**

- Consumes: `UnderstandingCondition` (`@/components/sections/understanding-condition`, from Task 6), `neckPainCondition` (`@/content/conditions/conditions`, from Task 3).

This task verifies the component renders and collapses correctly. No permanent page exists for it yet (ATS-022), so the mount added here is reverted at the end — `app/page.tsx` must be back to its pre-task state before this plan is considered done.

- [ ] **Step 1: Temporarily add the import and render it after `<Hero />`**

In `app/page.tsx`, add to the top imports:

```tsx
import { UnderstandingCondition } from "@/components/sections/understanding-condition";
import { neckPainCondition } from "@/content/conditions/conditions";
```

And render it directly after the closing `/>` of `<Hero ... />` (before `<ServicesSection />`):

```tsx
      <UnderstandingCondition condition={neckPainCondition} />
      <ServicesSection />
```

- [ ] **Step 2: Run the dev server and inspect the section**

1. Run `npm run dev`, open the homepage.
2. Confirm a teal uppercase eyebrow "UNDERSTANDING NECK PAIN" renders above a large serif navy intro paragraph, followed by a rounded image with a soft white fade at its bottom edge (no hard cutoff line).
3. Confirm two columns below the image: left column headed "Types" with two stacked name/description pairs (teal Poppins name, gray Geist description); right column headed "Common Causes" with five dot-marked rows, each preceded by a thin horizontal rule; a thin vertical rule separates the two columns.
4. Confirm a pale teal-tinted rounded box below the columns titled "See a doctor promptly if you notice:" with three dot-marked bullet lines.
5. Resize to a narrow mobile width (e.g. 375px) and confirm the two columns stack vertically (Types above Common Causes), the vertical divider disappears, and nothing overflows horizontally.
6. Resize to a wide desktop width (e.g. 1728px) and confirm the two-column layout returns with the vertical divider visible.

- [ ] **Step 3: Revert the temporary mount**

```bash
git checkout -- app/page.tsx
```

Run `git status` and confirm `app/page.tsx` shows no pending changes.

- [ ] **Step 4: Final verification**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

(No commit for this task — the mount was verification-only and has been reverted.)

## Acceptance criteria mapping

- All text/images from condition data (ATS-060) — Task 6's `UnderstandingCondition` reads everything from the `condition` prop; Task 3's `neckPainCondition` is the stand-in real content.
- Types + Causes + RedFlag render per spec — Tasks 4, 5, 6.
- 2-col → 1-col on mobile — Task 6 (`flex-col md:flex-row`, divider hidden below `md`), verified in Task 7.
