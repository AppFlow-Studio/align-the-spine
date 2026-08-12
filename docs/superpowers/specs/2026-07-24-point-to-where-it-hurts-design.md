# "Point to where it hurts" Body Diagram — Design

**Ticket:** Epic 4 – Sections · Track: Dev A · Est: L · Depends on: ATS-022, ATS-025
**Source:** ticket text + a pasted screenshot of the Figma frame. The Figma MCP tool hit its
Professional-seat rate limit on the very first `get_metadata` call (same wall the
2026-07-23 understanding-condition ticket hit), so this design is built from the ticket text
and screenshot alone, per the repo's established fallback for rate-limited tickets.

## Summary

An interactive body-diagram section: a translucent body illustration with 6 clickable region
hotspots. Selecting a hotspot swaps a detail panel (title, description, "Schedule now" link)
in place of that region's label. Fully keyboard-navigable (roving tabindex, radiogroup
pattern), with a tappable-list fallback below `md`.

This section **replaces** the existing `SpineAnatomy` homepage section — same body image,
same "Understanding the spine" eyebrow, both are homepage "understand your pain" content, so
keeping both would put two near-duplicate blocks on the same page (user decision).

## Resolved open decisions

- **No Figma lookup** — MCP rate-limited on the first call; proceeding from ticket text + the
  pasted screenshot, matching this repo's established fallback (service-presentation,
  faq-section, still-have-questions, understanding-condition).
- **Replaces `SpineAnatomy` on Home** (user decision) — `components/sections/spine-anatomy.tsx`
  and `content/spine-anatomy.ts` are deleted; `app/page.tsx` mounts `PointToWhereItHurts`
  in the same slot. Comments elsewhere that reference `SpineAnatomy` historically (a
  `tailwind.config.ts` note about a responsive bug found in it) are left as-is — they document
  past reasoning for the `card-title` token, not a live dependency.
- **Region set: 6, not 7** (user decision) — the screenshot shows 7 labels (Headaches, Neck
  Pain, Whiplash, Shoulder Pain, Back Pain, Herniated Disc, Sciatica) but the ticket specifies
  exactly 6 hotspots and the body image only shows 6 dots. Dropped "Neck Pain", kept
  "Whiplash" — the screenshot's own example selection is Whiplash, with real copy already
  given ("Neck strain, stiffness, and reduced range of motion from sudden impact."), reused
  verbatim. Final 6: Headaches, Whiplash, Shoulder Pain, Back Pain, Herniated Disc, Sciatica.
- **Body image: reuse `/figma-exports/spine-skeloton.png`** — visually confirmed identical to
  the screenshot's body illustration (translucent blue silhouette, visible spine/ribs, back
  view, white bottom-fade already baked into the asset). Already used by the component this
  ticket replaces; no new export needed.
- **Hotspot coordinates/sizes are a judgment call** — no exact Figma frame data (rate-limited).
  Positions are `{x, y}` percentages within the square image container, read off the
  screenshot's relative dot placement; sizes vary 56–120px within the ticket's stated 52–128px
  range, larger over torso regions. Documented per-region in the content file below.
- **Deep-link mechanism** — `BodyRegion.href` is optional. The panel's CTA link uses
  `region.href ?? siteConfig.bookingCta.href`. No region has a real `href` today since no
  condition route exists yet (ATS-022, this ticket's own dependency, isn't built — same gap
  every Epic 4 ticket referencing condition routes has hit). This still satisfies the AC
  "Region → condition-route links where applicable" as a data-driven capability: setting
  `href` on a region is all a future condition-page ticket needs to do.
- **Selected panel position**: rendered in-place, replacing that region's simple label at the
  same `{x, y}` anchor and label side — not a fixed generic slot. This matches the screenshot
  (the Whiplash label becomes the full card in place) without needing per-region custom
  layout math beyond what's already computed for the plain labels.
- **"Current-point marker"**: interpreted as a decorative teal pulsing ring overlaid on
  whichever hotspot is currently selected (the glow visible around the neck dot in the
  screenshot's Whiplash example) — not a 7th static point. Ties directly into the
  reduced-motion AC (`motion-reduce:animate-none`).
- **Mobile fallback breakpoint**: `md`, matching every other responsive collapse in this repo
  (`SpineAnatomy`, `UnderstandingCondition`). Below `md`, the diagram + leader-line labels are
  replaced entirely by a vertical list of 6 tappable region buttons, sharing the same
  selection state and rendering the same `SelectedPanel` (in static, full-width layout) below
  the list.
- **Keyboard pattern**: `role="radiogroup"` / `role="radio"` with roving `tabIndex` — matches
  native single-select radio-group behavior (arrow keys move focus **and** selection), which
  is exactly the AC's "6 hotspots select + update panel" + "keyboard navigable (roving
  tabindex)" combined. A small `useRovingRadioGroup` hook centralizes the arrow/Home/End
  handling so the desktop and mobile groups share one implementation.
- **Instruction copy**: not visible in the pasted screenshot (likely cropped), but the ticket's
  spec bullet explicitly requires it ("instruction (Poppins 25/40)"). Written directly for
  this ticket, same kind of placeholder-content gap every prior ticket without a real copy
  feed has hit and documented (e.g. `neckPainCondition`'s intro/causes, `doctorProfileContent`'s
  bio).
- **Reused tokens confirmed against `tailwind.config.ts`**: `display` (Newsreader, weight 500,
  clamps up to 65px/68px) matches the ticket's "header (Newsreader Medium 65/68)" exactly at
  its upper bound, and `navy-800` (`#2b3565`) matches the ticket's header color exactly —
  reused via the existing `SectionHeading` component rather than hand-rolling a heading.
  `body-lg` (25px/40px/400 Poppins) matches "instruction (Poppins 25/40)" exactly — passed as
  `SectionHeading`'s `sub`. `card-title` (Newsreader, weight 500, clamps up to 35px) matches
  "region title (Newsreader Medium 35)" — the same token `SpineAnatomy`'s `RegionBlock` already
  used for region names, reused here for the same purpose. `teal-500` (`#58a0a0`) matches the
  panel border color exactly. `radius-20` matches the panel's `r20`.
- **New tokens required** (nothing in the existing scale covers these): `selected-label`
  (25px/40px/600, 1.25px tracking, Poppins — "SELECTED"; tracking is a judgment call, matched
  to `eyebrow`'s tracking for visual consistency since the ticket doesn't specify one);
  `panel-body` (22px/38px/400, Poppins — panel description; the closest existing token,
  `alt-label`, is 22px but 40px line-height and Geist, not Poppins, so a new token was added
  rather than reused, per this repo's established precedent of not reusing weight/line-height
  mismatches even when the size lines up).
- **Panel description color**: not specified by the ticket. Using `ink-500`, matching
  `TypeCard`'s established convention for supporting body copy under a colored/dark title.
- **No project-level "SCHEDULE NOW" component exists** — it's a small uppercase tracked text
  link with a trailing arrow icon, not a pill/circle button (`ArrowButton` is circular,
  `Button` is a filled pill — neither matches the screenshot's plain link style). Built inline
  reusing `ArrowRightIcon`, following `service-areas.tsx`'s established
  `uppercase tracking-[1.25px]` text-link style.

## Architecture

```
content/point-to-where-it-hurts.ts        — new: BodyRegion, PointToWhereItHurtsContent,
                                              pointToWhereItHurtsContent (6 regions)
components/sections/point-to-where-it-hurts.tsx — new: <PointToWhereItHurts content />
                                              "use client" — selection state + keyboard nav
tailwind.config.ts                        — add fontSize.selected-label/panel-body
app/page.tsx                              — swap SpineAnatomy → PointToWhereItHurts
content/spine-anatomy.ts                  — deleted
components/sections/spine-anatomy.tsx     — deleted
```

- Client component (`"use client"`) — first component in `components/sections` that needs
  interactivity beyond a form; every prior section here (`UnderstandingCondition`,
  `SpineAnatomy`, etc.) is a server component, so this is a deliberate, scoped exception.
- No new npm dependencies. Reuses `Container`, `Section`, `SectionHeading`, `ArrowRightIcon`,
  `siteConfig.bookingCta`, `cn`.

## New design tokens

`tailwind.config.ts`:

```ts
fontSize: {
  // ...
  "selected-label": ["25px", { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "600" }],
  "panel-body": ["22px", { lineHeight: "38px", fontWeight: "400" }],
},
```

## `content/point-to-where-it-hurts.ts` (new)

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

/** "Point to where it hurts" body-diagram copy per the Figma screenshot + ticket spec
 * (Epic 4). Reuses the same body illustration SpineAnatomy used, which this section
 * replaces on the Home page. */
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

## `components/sections/point-to-where-it-hurts.tsx` (new)

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

## `app/page.tsx` changes

- Replace the `SpineAnatomy` import + `spineAnatomyContent` import with `PointToWhereItHurts` +
  `pointToWhereItHurtsContent`.
- Replace `<SpineAnatomy content={spineAnatomyContent} />` with
  `<PointToWhereItHurts content={pointToWhereItHurtsContent} />` in the same position in the
  section order.

## Acceptance criteria mapping

- [ ] 6 hotspots select + update panel — `regions.map` renders 6 `role="radio"` buttons;
      `onClick`/`onKeyDown` both call `setSelectedId`, which swaps `RegionLabel` → `SelectedPanel`
      in place for the selected region.
- [ ] Keyboard navigable (roving tabindex), focus rings, reduced-motion — `useRovingRadioGroup`
      implements arrow/Home/End roving tabindex; `focus-visible:outline` rings on every hotspot and
      mobile button; the current-point marker's pulse is gated
      `motion-safe:animate-pulse motion-reduce:animate-none`.
- [ ] Mobile fallback: tappable region list — the `md:hidden` region-button list, sharing the
      same `selectedId` state and `SelectedPanel`.
- [ ] Region → condition-route links where applicable — `SelectedPanel`'s CTA uses
      `region.href ?? siteConfig.bookingCta.href`; no region has a real `href` yet since no
      condition route exists (ATS-022 dependency gap), but the mechanism is in place.

## Out of scope

- Any second body-diagram variant (e.g. front view) — only the one back-view illustration from
  the screenshot/existing asset.
- Wiring real `href`s to condition routes — no condition-page route exists yet (ATS-022,
  ATS-025). Content authors set `href` per region once those land.
- Any second breakpoint tier between the diagram and the mobile list (e.g. a scaled-down
  diagram at `sm`) — the ticket asks for a fallback list, not a responsive-scaled diagram.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- No component test framework in use in this repo beyond `lib/pip-window.test.ts` — no test
  added, consistent with every other presentational/interactive component here.
- Manual, dev server: mount on Home, confirm at 375px (mobile list + panel), 768px, and 1728px
  (desktop diagram) —
  - click each of the 6 hotspots, confirm the panel swaps to that region and the previously
    selected region's label reappears
  - keyboard: Tab to the group, arrow keys move focus + selection through all 6, Home/End jump
    to first/last, visible focus ring throughout
  - emulate `prefers-reduced-motion: reduce` in devtools, confirm the current-point marker's
    pulse stops
  - mobile list: tap a region, confirm the panel appears below the list and updates on
    subsequent taps
  - click "Schedule now" in the panel, confirm it navigates to `/book`
