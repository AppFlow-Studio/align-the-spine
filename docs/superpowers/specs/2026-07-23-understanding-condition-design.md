# "Understanding [Condition]" Section — Design

**Ticket:** Epic 4 – Sections · Track: Dev A · Est: M · Depends on: ATS-022
**Source:** ticket text (pasted directly). References condition-page-spec §B3, §C (not present in this repo — same gap noted by every prior spec in this repo). No Figma node was available for this ticket: the Figma MCP tool hit its Starter-plan rate limit on the very first `get_metadata` call (same wall the 2026-07-10 design-tokens ticket hit), so this design is built from the ticket text alone, matching the majority convention already established for tickets without a Figma link (service-presentation, faq-section, still-have-questions).

## Summary

A fully data-driven educational block — eyebrow, intro statement, supporting image, a two-column "Types" / "Common Causes" split, and a "RedFlagCard" callout — meant to be reused by every condition page. This ticket builds the component and its content model; no condition-page route exists yet (ATS-022, this ticket's own dependency, hasn't been built), so there is nowhere permanent to mount it.

## Resolved open decisions

- **No Figma lookup** (user decision) — MCP rate-limited on the first call; proceeding from ticket text only, per the repo's established fallback.
- **Mount point: none, permanently** (user decision) — the component and content model are built and typechecked/linted/built, and verified visually by a _temporary_ mount on the Home page during development. That mount is removed before this work is considered done, since this block is condition-specific content, not Home content. It has no real destination until ATS-022 lands a condition-page route.
- **Content model: extend `Condition` + add one real condition** (user decision) — `content/conditions/types.ts` currently only has `{slug, name, summary}`, none of the fields this ticket needs. Extending it with a nested `understanding` block (rather than flattening new fields onto `Condition` directly) so future condition-page tickets can each add their own nested section key without one interface accreting unrelated fields. Populated with one real entry, **Neck Pain**, using `public/figma-exports/dr-abe-neck.png` (visually confirmed: Dr. Abe examining a patient's neck) as the supporting image. Intro/types/causes/red-flag copy is written directly for this ticket (plausible chiropractic content, not sourced from a real ATS-060 data feed, since none exists yet) — same kind of gap every prior ticket in this repo has hit and documented rather than blocked on (e.g. `doctorProfileContent`'s bio, `services.ts`'s summaries).
- **Reused tokens confirmed against existing `tailwind.config.ts`**: `navy-900` (`#253067`), `teal-500` (`#58a0a0`), `ink-900` (`#1a1a1a`), `ink-500` (`#777777`) all already exist and match the ticket's colors exactly — no new color tokens for text. `h2` (Newsreader, weight 600, clamps up to 35px) already matches "Types"/"Common Causes" headers (Newsreader SemiBold 35) and is used this way site-wide for section subheadings — reused as-is rather than adding a fixed-35px duplicate. `faq-a` (25px/40px/400, paired with `font-alt` for Geist) matches TypeCard description and Common Causes row text exactly. `faq-q` (25px/40px/600, `font-alt`) matches RedFlagCard's title ("Geist SemiBold 25") exactly. `radius-20`/`radius-30` match the RedFlagCard box and image corners.
- **New tokens required** (nothing in the existing scale covers these): `understanding-intro` (50px/62px/400, Newsreader Regular — the intro statement); `type-name` (30px/40px/600, Poppins SemiBold, teal — TypeCard name; line-height is a judgment call, no value given); `redflag-bullet` (23px/36px/400, Geist — RedFlagCard bullets; line-height is a judgment call, same reasoning); `overlay.teal-12` (`rgba(88,160,160,0.12)` — RedFlagCard box background, following the existing `overlay.*` naming convention alongside `ink-20`/`navy-20`/`white-15`/`white-16`).
- **RedFlagCard bullet marker**: the ticket doesn't specify one. Reusing the same teal 11×11 dot established one column over for Common Causes, rather than a default browser bullet or inventing a new marker style, for visual consistency within the same section.
- **Column divider**: uses the existing `Divider` component (`orientation="vertical"`) inside a `flex` row, per its own doc comment ("Vertical needs a sized flex/grid parent") — not Tailwind's `divide-x` utility, which isn't used anywhere else in this codebase. Hidden below `md` where the columns stack.
- **Common Causes row dividers**: reuses the existing `Divider` (horizontal) before every row, matching `ServicesSection`'s already-established "divider before every row including the first" convention.
- **Image aspect ratio**: not specified by the ticket (no Figma numbers available). Using `aspect-[16/9]`, a judgment call, full-width.
- **"2 TypeCards"**: typed as `ConditionType[]`, not a fixed 2-tuple — matches how every other fixed-count list in this repo (FAQ items, causes, stat rows) is typed as a plain array rather than enforced at the type level.

## Architecture

```
content/conditions/types.ts              — extend Condition with ConditionType, ConditionRedFlags,
                                            ConditionUnderstanding, and Condition.understanding
content/conditions/conditions.ts         — new: neckPainCondition: Condition
components/ui/type-card.tsx              — new: <TypeCard name description />
components/ui/red-flag-card.tsx          — new: <RedFlagCard title bullets />
components/sections/understanding-condition.tsx — new: <UnderstandingCondition condition />
tailwind.config.ts                       — add fontSize.understanding-intro/type-name/redflag-bullet,
                                            colors.overlay["teal-12"]
app/globals.css                          — add --overlay-teal-12
```

- Server component, no `"use client"` — no interactivity.
- No new npm dependencies. Reuses `Eyebrow`, `Divider`, `Section`, `Container`, `next/image`.
- No permanent change to `app/page.tsx` — see mount-point decision above.

## New design tokens

`tailwind.config.ts`:

```ts
fontSize: {
  // ...
  "understanding-intro": ["50px", { lineHeight: "62px", fontWeight: "400" }],
  "type-name": ["30px", { lineHeight: "40px", fontWeight: "600" }],
  "redflag-bullet": ["23px", { lineHeight: "36px", fontWeight: "400" }],
},
colors: {
  overlay: {
    // ...
    "teal-12": "var(--overlay-teal-12)",
  },
},
```

`app/globals.css`:

```css
--overlay-teal-12: rgba(88, 160, 160, 0.12);
```

## `content/conditions/types.ts` (extended)

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

## `content/conditions/conditions.ts` (new)

```ts
import type { Condition } from "@/content/conditions/types";

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

## `components/ui/type-card.tsx` (new)

```tsx
export interface TypeCardProps {
  name: string;
  description: string;
  className?: string;
}

/** TypeCard per condition-page-spec §B3: name (Poppins SemiBold 30 teal-500)
 * + description (Geist 25/40 ink-500). No border/background — plain stacked text. */
export function TypeCard({ name, description, className }: TypeCardProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h4 className="font-sans text-type-name text-teal-500">{name}</h4>
      <p className="font-alt text-faq-a text-ink-500">{description}</p>
    </div>
  );
}
```

## `components/ui/red-flag-card.tsx` (new)

```tsx
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
              className="mt-2.5 h-[11px] w-[11px] shrink-0 rounded-full bg-[#58A0A0]"
            />
            <span className="font-alt text-redflag-bullet text-ink-900">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## `components/sections/understanding-condition.tsx` (new)

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
                      className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#58A0A0]"
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

## Acceptance criteria mapping

- [x] All text/images from condition data (ATS-060) — everything rendered comes from the `condition` prop (`Condition.understanding`); no hardcoded copy in the component. `neckPainCondition` is real content standing in for the not-yet-built ATS-060 data feed.
- [x] Types + Causes + RedFlag render per spec — two `TypeCard`s in the Types column, dot-marked rows in Common Causes, `RedFlagCard` below with the teal-tinted box.
- [x] 2-col → 1-col on mobile — `flex-col md:flex-row`, vertical divider hidden below `md`, matching every other responsive stack in this repo.

## Out of scope

- Mounting on a real condition page — no route exists yet (ATS-022).
- Any second condition's content — only Neck Pain is populated; more conditions get added when ATS-060/a condition-page route actually needs them.
- Any animation/entrance treatment — no established pattern in `components/` for this.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- No component test framework in use in this repo (only `lib/pip-window.test.ts`, pure date-math logic) — no test added, consistent with every other presentational component (`ServiceCard`, `DoctorProfile`, etc.).
- Manual, dev server: temporarily mount `<UnderstandingCondition condition={neckPainCondition} />` on the Home page, confirm image/gradient, Types/Causes columns, RedFlagCard, and the 2-col → 1-col collapse at mobile (375px), tablet, and desktop (1728px) widths — then remove the temporary mount.
