# Point To Where It Hurts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive "Point to where it hurts" body-diagram section — 6 clickable region hotspots over a shared body illustration that swap a detail panel on selection, keyboard-navigable via a roving-tabindex radiogroup, with a tappable-list fallback below `md` — and mount it on the Home page in place of the existing `SpineAnatomy` section.

**Architecture:** Two new Tailwind fontSize tokens (`selected-label`, `panel-body`) land first. `content/point-to-where-it-hurts.ts` exports a `PointToWhereItHurtsContent` shape (eyebrow/heading/instruction/image/regions/ctaLabel) with one real, fully-populated `pointToWhereItHurtsContent` const (6 `BodyRegion`s: Headaches, Whiplash, Shoulder Pain, Back Pain, Herniated Disc, Sciatica). `PointToWhereItHurts` (`components/sections/point-to-where-it-hurts.tsx`) is a client component — the first interactive one in `components/sections` — that owns `selectedId` state, a shared `useRovingRadioGroup` keyboard hook, and two sibling `role="radiogroup"` layouts (desktop diagram, `md:hidden` mobile list) that both read/write the same selection. It reuses `Section`, `Container`, `SectionHeading`, `ArrowRightIcon`, `siteConfig.bookingCta`, and `cn`. The final task deletes `components/sections/spine-anatomy.tsx` + `content/spine-anatomy.ts` and swaps the mount in `app/page.tsx` — this is a permanent replacement, not a temporary verification mount.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new dependencies.

## Global Constraints

- No component-level test framework in active use in this repo (one `vitest` unit test exists, for a non-component util); verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus manual dev-server QA — same convention as every prior plan in `docs/superpowers/plans/`.
- Reuse existing tokens/components exactly, do not reimplement: `Section`/`Container` (`components/ui/section.tsx`/`components/ui/container.tsx`), `SectionHeading` (`components/ui/section-heading.tsx`, gives the eyebrow + `display`-token heading + `body-lg` sub in one call), `ArrowRightIcon` (`components/ui/icons/arrow-right.tsx`), `siteConfig.bookingCta` (`content/site.ts`, `{ label: "Book Appointment", href: "/book" }`), `cn` (`lib/cn`).
- Reused tokens: `display` (Newsreader 500, clamps to 65px/68px) + `navy-800` (`#2b3565`) for the header via `SectionHeading`; `body-lg` (25px/40px/400 Poppins) for the instruction via `SectionHeading`'s `sub`; `card-title` (Newsreader 500, clamps to 35px) for region titles — the same token `SpineAnatomy`'s `RegionBlock` used for region names; `teal-500` (`#58a0a0`) for the panel border and selected states; `radius-20` for the panel and mobile list buttons; `ink-500` for panel body copy (matches `TypeCard`'s convention for supporting text under a colored title).
- New tokens only: `selected-label` (`25px`/`40px`/`600`, `1.25px` tracking) and `panel-body` (`22px`/`38px`/`400`) fontSizes — no other new tokens, no hardcoded hex values or px font sizes in component code.
- Body image is `/figma-exports/spine-skeloton.png` (already present in the repo, already used by the component being replaced) — do not add a new image asset.
- Exactly 6 regions, in this order: Headaches, Whiplash, Shoulder Pain, Back Pain, Herniated Disc, Sciatica. Default selection is `regions[0]` (Headaches).
- Selection state is driven by a single `role="radiogroup"`/`role="radio"` pattern with roving `tabIndex` (`0` on the selected radio, `-1` on the rest) — arrow keys (`ArrowRight`/`ArrowDown` next, `ArrowLeft`/`ArrowUp` previous, `Home` first, `End` last) both move focus and move selection, matching native radio-group behavior. This one pattern is shared by the desktop diagram and the mobile list via a `useRovingRadioGroup` hook — do not write two separate keyboard handlers.
- The current-point marker (the ticket's "+ a current-point marker") is a decorative pulsing ring on the selected hotspot only, gated `motion-safe:animate-pulse motion-reduce:animate-none` — not a 7th static point.
- `BodyRegion.href` is optional; the panel's CTA always resolves to `region.href ?? siteConfig.bookingCta.href`. No region has a real `href` yet (no condition route exists — ATS-022 dependency gap) but the field must exist on the type.
- Do not add or modify any route under `app/` other than the permanent `app/page.tsx` edit in the final task.
- This is a permanent replacement: `components/sections/spine-anatomy.tsx` and `content/spine-anatomy.ts` are deleted in the final task, not kept alongside the new section.

---

### Task 1: Design tokens — `selected-label`, `panel-body` fontSizes

**Files:**

- Modify: `tailwind.config.ts`

**Interfaces:**

- Produces: Tailwind utilities `text-selected-label` (25px/40px/600, 1.25px tracking) and `text-panel-body` (22px/38px/400). Consumed by Task 3's `PointToWhereItHurts`.

- [ ] **Step 1: Add the two new fontSize tokens to `tailwind.config.ts`**

Find the end of the `fontSize` block (currently lines 108–110):

```ts
        "understanding-intro": ["50px", { lineHeight: "62px", fontWeight: "400" }],
        "type-name": ["30px", { lineHeight: "40px", fontWeight: "600" }],
        "redflag-bullet": ["23px", { lineHeight: "36px", fontWeight: "400" }],
      },
```

Replace with:

```ts
        "understanding-intro": ["50px", { lineHeight: "62px", fontWeight: "400" }],
        "type-name": ["30px", { lineHeight: "40px", fontWeight: "600" }],
        "redflag-bullet": ["23px", { lineHeight: "36px", fontWeight: "400" }],
        "selected-label": [
          "25px",
          { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "600" },
        ],
        "panel-body": ["22px", { lineHeight: "38px", fontWeight: "400" }],
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
git commit -m "feat: add point-to-where-it-hurts selected-label and panel-body font tokens"
```

---

### Task 2: `content/point-to-where-it-hurts.ts` — region content

**Files:**

- Create: `content/point-to-where-it-hurts.ts`

**Interfaces:**

- Produces: `BodyRegion` (`{ id: string; name: string; description: string; href?: string; position: { x: number; y: number }; size: number; labelSide: "left" | "right" }`), `PointToWhereItHurtsContent` (`{ eyebrow: string; heading: string; instruction: string; image: { src: string; alt: string }; regions: BodyRegion[]; ctaLabel: string }`), and `pointToWhereItHurtsContent: PointToWhereItHurtsContent` const export (6 regions). Consumed by Task 3's `PointToWhereItHurts` and Task 4's `app/page.tsx` mount.

- [ ] **Step 1: Write `content/point-to-where-it-hurts.ts`**

```ts
export interface BodyRegion {
  id: string;
  name: string;
  description: string;
  /** Condition-route deep link, when one exists. Falls back to siteConfig.bookingCta.href. */
  href?: string;
  /** Percentage position within the square image container. */
  position: { x: number; y: number };
  /** Hotspot diameter in px (52-128 per spec). */
  size: number;
  labelSide: "left" | "right";
}

export interface PointToWhereItHurtsContent {
  eyebrow: string;
  heading: string;
  instruction: string;
  image: { src: string; alt: string };
  regions: BodyRegion[];
  ctaLabel: string;
}

/** "Point to where it hurts" body-diagram copy (Epic 4). Reuses the same body illustration
 * SpineAnatomy used, which this section replaces on the Home page. */
export const pointToWhereItHurtsContent: PointToWhereItHurtsContent = {
  eyebrow: "Understanding the spine",
  heading: "Point to where it hurts",
  instruction: "Select a highlighted region on the diagram to see what might be causing your pain.",
  image: { src: "/figma-exports/spine-skeloton.png", alt: "Human spine anatomy, back view" },
  ctaLabel: "Schedule now",
  regions: [
    {
      id: "headaches",
      name: "Headaches",
      description:
        "Tension and cervicogenic headaches often trace back to misalignment in the upper neck.",
      position: { x: 50, y: 10 },
      size: 56,
      labelSide: "right",
    },
    {
      id: "whiplash",
      name: "Whiplash",
      description: "Neck strain, stiffness, and reduced range of motion from sudden impact.",
      position: { x: 48, y: 24 },
      size: 72,
      labelSide: "right",
    },
    {
      id: "shoulder-pain",
      name: "Shoulder Pain",
      description: "Tightness and restricted movement from postural strain or old injuries.",
      position: { x: 30, y: 40 },
      size: 88,
      labelSide: "left",
    },
    {
      id: "back-pain",
      name: "Back Pain",
      description:
        "Aching or sharp pain along the mid and lower back, often tied to posture or overuse.",
      position: { x: 68, y: 46 },
      size: 104,
      labelSide: "right",
    },
    {
      id: "herniated-disc",
      name: "Herniated Disc",
      description:
        "A bulging or ruptured disc pressing on nearby nerves, causing pain that radiates outward.",
      position: { x: 50, y: 64 },
      size: 120,
      labelSide: "left",
    },
    {
      id: "sciatica",
      name: "Sciatica",
      description: "Sharp, radiating pain down the leg from nerve compression in the lower spine.",
      position: { x: 50, y: 84 },
      size: 96,
      labelSide: "right",
    },
  ],
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
git add content/point-to-where-it-hurts.ts
git commit -m "feat: add point-to-where-it-hurts region content"
```

---

### Task 3: `PointToWhereItHurts` section component

**Files:**

- Create: `components/sections/point-to-where-it-hurts.tsx`

**Interfaces:**

- Consumes: `BodyRegion`, `PointToWhereItHurtsContent` (`@/content/point-to-where-it-hurts`, from Task 2); `siteConfig` (`@/content/site`, `siteConfig.bookingCta.href`); `Container` (`@/components/ui/container`); `Section` (`@/components/ui/section`); `SectionHeading` (`@/components/ui/section-heading`, props `{ eyebrow?: string; sub?: ReactNode; children: ReactNode }`); `ArrowRightIcon` (`@/components/ui/icons/arrow-right`); `cn` (`@/lib/cn`); `selected-label`/`panel-body` tokens from Task 1.
- Produces: `PointToWhereItHurts` named export, props `{ content: PointToWhereItHurtsContent }`. Consumed by Task 4's `app/page.tsx` mount.

- [ ] **Step 1: Write `components/sections/point-to-where-it-hurts.tsx`**

```tsx
"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { BodyRegion, PointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface PointToWhereItHurtsProps {
  content: PointToWhereItHurtsContent;
}

/** Roving-tabindex radiogroup: arrow keys move focus AND selection, Home/End jump to the
 * first/last region — the native single-select radio-group pattern, shared by the desktop
 * diagram and the mobile region list. */
function useRovingRadioGroup(
  regions: BodyRegion[],
  selectedId: string,
  onSelect: (id: string) => void,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = regions.findIndex((region) => region.id === selectedId);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      nextIndex = (index + 1) % regions.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      nextIndex = (index - 1 + regions.length) % regions.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = regions.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    onSelect(regions[nextIndex].id);
    containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
  }

  return { containerRef, handleKeyDown };
}

function RegionLabel({ region, side }: { region: BodyRegion; side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "absolute top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap",
        side === "left" ? "right-full flex-row-reverse pr-2" : "left-full pl-2",
      )}
    >
      <span aria-hidden="true" className="flex shrink-0 items-center gap-2">
        <span className="h-px w-12 bg-mute-300" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#58A0A0]" />
      </span>
      <span className="font-sans text-body-lg text-navy-800">{region.name}</span>
    </div>
  );
}

function SelectedPanel({
  region,
  ctaLabel,
  layout,
  side,
}: {
  region: BodyRegion;
  ctaLabel: string;
  layout: "floating" | "static";
  side?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "rounded-20 border-2 border-teal-500 bg-white p-6 text-left shadow-card",
        layout === "floating" && "absolute top-1/2 w-[300px] -translate-y-1/2",
        layout === "floating" && side === "left" && "right-full mr-4",
        layout === "floating" && side === "right" && "left-full ml-4",
        layout === "static" && "mt-2 w-full",
      )}
    >
      <p className="font-sans text-selected-label uppercase text-teal-500">Selected</p>
      <h3 className="mt-2 font-display text-card-title text-navy-800">{region.name}</h3>
      <p className="mt-2 font-sans text-panel-body text-ink-500">{region.description}</p>
      <Link
        href={region.href ?? siteConfig.bookingCta.href}
        className="mt-4 inline-flex items-center gap-2 font-sans text-body-lg uppercase tracking-[1.25px] text-teal-500 transition-colors hover:text-teal-500/80"
      >
        {ctaLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

/** "Point to where it hurts" interactive body diagram (Epic 4). Replaces SpineAnatomy on the
 * Home page. 6 hotspots over a shared body illustration; selecting one swaps that region's
 * label for a detail panel in place. Below md, the diagram is replaced by a tappable list
 * (mobile fallback per spec) sharing the same selection state. */
export function PointToWhereItHurts({ content }: PointToWhereItHurtsProps) {
  const { eyebrow, heading, instruction, image, regions, ctaLabel } = content;
  const [selectedId, setSelectedId] = useState(regions[0].id);
  const selected = regions.find((region) => region.id === selectedId) ?? regions[0];

  const desktop = useRovingRadioGroup(regions, selectedId, setSelectedId);
  const mobile = useRovingRadioGroup(regions, selectedId, setSelectedId);

  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-14 text-center">
        <SectionHeading eyebrow={eyebrow} sub={instruction}>
          {heading}
        </SectionHeading>

        <div
          ref={desktop.containerRef}
          role="radiogroup"
          aria-label="Body regions"
          onKeyDown={desktop.handleKeyDown}
          className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block"
        >
          <Image src={image.src} alt={image.alt} fill className="object-contain" />

          {regions.map((region) => {
            const isSelected = region.id === selectedId;
            return (
              <div
                key={region.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${region.position.y}%`, left: `${region.position.x}%` }}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={region.name}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedId(region.id)}
                  style={{ width: region.size, height: region.size }}
                  className={cn(
                    "relative rounded-full bg-white/25 ring-1 ring-white/50 transition-colors hover:bg-white/40",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                  )}
                >
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full ring-2 ring-teal-500 ring-offset-2 motion-safe:animate-pulse motion-reduce:animate-none"
                    />
                  )}
                </button>

                {isSelected ? (
                  <SelectedPanel
                    region={region}
                    ctaLabel={ctaLabel}
                    layout="floating"
                    side={region.labelSide}
                  />
                ) : (
                  <RegionLabel region={region} side={region.labelSide} />
                )}
              </div>
            );
          })}
        </div>

        <div
          ref={mobile.containerRef}
          role="radiogroup"
          aria-label="Body regions"
          onKeyDown={mobile.handleKeyDown}
          className="flex w-full flex-col gap-3 md:hidden"
        >
          {regions.map((region) => {
            const isSelected = region.id === selectedId;
            return (
              <button
                key={region.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedId(region.id)}
                className={cn(
                  "rounded-20 border-2 px-6 py-4 text-left font-sans text-body-lg transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                  isSelected ? "border-teal-500 text-teal-500" : "border-mute-300 text-ink-900",
                )}
              >
                {region.name}
              </button>
            );
          })}
          <SelectedPanel region={selected} ctaLabel={ctaLabel} layout="static" />
        </div>
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
git add components/sections/point-to-where-it-hurts.tsx
git commit -m "feat: add PointToWhereItHurts section"
```

---

### Task 4: Replace `SpineAnatomy` with `PointToWhereItHurts` on Home

**Files:**

- Delete: `components/sections/spine-anatomy.tsx`
- Delete: `content/spine-anatomy.ts`
- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `PointToWhereItHurts` (`@/components/sections/point-to-where-it-hurts`, from Task 3), `pointToWhereItHurtsContent` (`@/content/point-to-where-it-hurts`, from Task 2).

This is a permanent mount, not a temporary verification-only edit — do not revert `app/page.tsx` at the end of this task.

- [ ] **Step 1: Delete the old section and its content file**

```bash
git rm components/sections/spine-anatomy.tsx content/spine-anatomy.ts
```

- [ ] **Step 2: Update the page-assembly doc comment in `app/page.tsx`**

Current (lines 27–31):

```tsx
/** / (Home) page assembly (ATS-071) per the homepage-1-col artboard:
 * HomeHero → ServiceGrid/ListRow → WhyChoose/SpineAnatomy (ATS-072) →
 * DoctorBio → accident-injury grid → patient reviews → FAQ/CTA bands →
 * contact LeadForm. LocationIntro/LocationFooter come from RootShell, which
 * already swaps in the "location" footer variant for "/". */
```

Replace with:

```tsx
/** / (Home) page assembly (ATS-071) per the homepage-1-col artboard:
 * HomeHero → ServiceGrid/ListRow → WhyChoose/PointToWhereItHurts (Epic 4, replaces
 * the ATS-072 SpineAnatomy quadrant section with an interactive hotspot diagram) →
 * DoctorBio → accident-injury grid → patient reviews → FAQ/CTA bands →
 * contact LeadForm. LocationIntro/LocationFooter come from RootShell, which
 * already swaps in the "location" footer variant for "/". */
```

- [ ] **Step 3: Swap the imports**

Remove these two lines:

```tsx
import { SpineAnatomy } from "@/components/sections/spine-anatomy";
```

```tsx
import { spineAnatomyContent } from "@/content/spine-anatomy";
```

Add:

```tsx
import { PointToWhereItHurts } from "@/components/sections/point-to-where-it-hurts";
```

```tsx
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
```

(Import order doesn't matter here — the `prettier` pre-commit hook auto-sorts imports on commit.)

- [ ] **Step 4: Swap the mounted component**

Current:

```tsx
<SpineAnatomy content={spineAnatomyContent} />
```

Replace with:

```tsx
<PointToWhereItHurts content={pointToWhereItHurtsContent} />
```

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: exit 0, no errors.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mount PointToWhereItHurts on Home, replacing SpineAnatomy"
```

---

### Task 5: Manual dev-server QA

**Files:** none (verification only).

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`, open the homepage.

- [ ] **Step 2: Desktop diagram (1728px width)**

1. Confirm the eyebrow "UNDERSTANDING THE SPINE", header "Point to where it hurts", and an instruction line render above the diagram.
2. Confirm the body illustration renders with 6 circular hotspots over it, and "Headaches" is selected by default (teal-bordered panel showing "SELECTED" / "Headaches" / its description / "SCHEDULE NOW" in place of its label).
3. Click each of the other 5 hotspots in turn. Confirm each click swaps the panel to that region (previously selected region's label reappears as plain text) and the teal pulsing ring moves to the newly selected hotspot.
4. Click "SCHEDULE NOW" in the panel and confirm it navigates to `/book`.

- [ ] **Step 3: Keyboard navigation**

1. Tab to the diagram's radiogroup. Confirm a visible focus ring appears on the selected hotspot.
2. Press `ArrowRight`/`ArrowDown` repeatedly and confirm selection and focus both advance through all 6 regions in order, wrapping back to Headaches after Sciatica.
3. Press `ArrowLeft`/`ArrowUp` and confirm it moves backward through the same order.
4. Press `Home` and confirm it jumps to Headaches; press `End` and confirm it jumps to Sciatica.

- [ ] **Step 4: Reduced motion**

1. In Chrome DevTools, open the Rendering tab and emulate `prefers-reduced-motion: reduce`.
2. Select a region and confirm the teal ring around the selected hotspot no longer pulses (static ring only).
3. Turn the emulation off and confirm the pulse returns.

- [ ] **Step 5: Mobile fallback (375px width)**

1. Resize the viewport to 375px (or use DevTools device emulation).
2. Confirm the diagram is hidden and a vertical list of 6 tappable region buttons renders instead, with "Headaches" shown as selected (teal border/text) and the panel rendered full-width below the list.
3. Tap a different region button and confirm the panel updates and the border/text of the newly selected button turns teal while the previous one reverts.
4. Confirm nothing overflows horizontally at this width.

- [ ] **Step 6: Tablet check (768px width)**

Resize to 768px and confirm the desktop diagram layout is showing (not the mobile list), with no visual overlap between hotspot labels and the panel.

- [ ] **Step 7: Final verification**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all three exit 0, no errors.

## Acceptance criteria mapping

- 6 hotspots select + update panel — Task 3 (`regions.map` renders 6 `role="radio"` hotspots; `onClick`/roving-tabindex both call `setSelectedId`), verified in Task 5 Step 2.
- Keyboard navigable (roving tabindex), focus rings, reduced-motion — Task 3's `useRovingRadioGroup` + `focus-visible:outline` + `motion-safe:animate-pulse motion-reduce:animate-none`, verified in Task 5 Steps 3–4.
- Mobile fallback: tappable region list — Task 3's `md:hidden` region-button list, verified in Task 5 Step 5.
- Region → condition-route links where applicable — Task 2's optional `BodyRegion.href` + Task 3's `region.href ?? siteConfig.bookingCta.href`, verified in Task 5 Step 2 (falls back to `/book` today since no condition route exists yet).
