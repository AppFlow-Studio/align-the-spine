# Design Tokens & Fonts (ATS-002) — Design

**Ticket:** Epic 0 – Foundation · Track: Dev A · Depends on: ATS-001 · Blocks: all UI
**Source:** Figma "Align the spine - Chiro (Copy)" file (`7p8hHjzZVy6MgpP6RAnmU1`), node `1:884` ("neck-imagesfocused" — the Neck condition page referenced by the ticket as condition-page-spec).

## Goal

Encode real design tokens (colors, radii, shadows, type scale, fluid grid) into Tailwind + CSS vars, and load the four brand font families via `next/font`, so every later UI ticket has a stable token surface to build against.

## Data source note

The ticket references a "condition-page-spec" document with sections §A2 (glass/overlay rgba), §A3 (type scale), and §E (breakpoint scaling) that were not present anywhere in the repo. The user pointed to the Figma file above as the actual source. Values below were pulled directly from Figma node inspection (`get_design_context` on individual text/shape nodes within the Neck page) rather than from a written spec doc, because no such doc exists in this project. Figma's MCP rate limit was hit partway through, so coverage is representative rather than exhaustive — gaps are called out explicitly rather than guessed.

## File changes

- **`tailwind.config.ts`** (new) — `theme.extend` for `colors`, `borderRadius`, `boxShadow`, `fontFamily`, `fontSize`. All values reference CSS custom properties (e.g. `"var(--color-navy-900)"`) rather than duplicating raw hex/px — the CSS vars in `globals.css` are the single source of truth; the config just maps Tailwind utility names onto them.
- **`app/globals.css`** — add `@config "../tailwind.config.ts";` (Tailwind v4's documented escape hatch for JS/TS config files, used here because the ticket explicitly asks for `tailwind.config.ts` even though this project's v4 setup is otherwise CSS-first). Add a `:root` block with every raw token value. Remove the `prefers-color-scheme: dark` block (create-next-app boilerplate; no dark palette exists in this design system). Point `body` background/foreground at `panel-100` / `ink-900`.
- **`app/layout.tsx`** — replace `Geist` + `Geist_Mono` (`next/font/google`, currently unused boilerplate) with `Newsreader`, `Poppins`, `Geist` (kept, repointed), each loaded with the exact weights below. No `Inter`.
- **`components/ui/icons/arrow-right.tsx`** (new) — inline SVG icon component replacing the `→` glyph everywhere it appears in the design (nav CTA, hero CTA, "Book now" labels, big circular CTA).

## Fonts

| Family     | CSS var          | Role                                                  | Weights loaded                                           |
| ---------- | ---------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| Newsreader | `--font-display` | display/headings                                      | 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold) |
| Poppins    | `--font-sans`    | UI, body, labels, buttons                             | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)  |
| Geist      | `--font-alt`     | FAQ, secondary body, "Book now", comparison sublabels | 400 (Regular), 500 (Medium), 600 (SemiBold)              |
| Inter      | —                | not shipped                                           | `→` glyph replaced by `ArrowRightIcon`                   |

All loaded via `next/font/google` with `subsets: ["latin"]`, each exposing a CSS variable consumed by `--font-display` / `--font-sans` / `--font-alt` in `globals.css`.

## Colors

```
--color-navy-900:  #253067
--color-navy-800:  #2b3565
--color-navy-700:  #374690   /* hero gradient end */
--color-teal-500:  #58a0a0
--color-ink-900:   #1a1a1a
--color-ink-500:   #777777
--color-mute-300:  #cdcdcd
--color-mute-400:  #8e9597
--color-mute-350:  #ababb3
--color-panel-100: #f6f6f6
```

Exposed as Tailwind color scales: `navy.{900,800,700}`, `teal.500`, `ink.{900,500}`, `mute.{300,400,350}`, `panel.100`.

**Gradient note:** `navy-700` is documented as the hero gradient's end color per the ticket. This spec only exposes the color token — assembling the actual gradient (start color, direction) belongs to the hero section ticket, since that requires the hero component's other visual decisions.

## Glass / overlay (§A2)

Only one value was confirmed before the rate limit: the nav "Book Appointment" pill uses `rgba(37, 48, 103, 0.2)` — navy-900 at 20% opacity, `rounded-40`. (The ticket's `radius-80` applies to _other_ glass pills/the big CTA elsewhere on the page, which weren't reachable this pass.)

```
--overlay-navy-20: rgba(37, 48, 103, 0.2)
```

Exposed as both the named var and usable directly via Tailwind opacity modifiers (`bg-navy-900/20`) since the color scale is already tokenized.

**Gap:** the rest of §A2's overlay/glass values (e.g. the "big CTA" glass surface, any light/white glass variants) weren't reachable before hitting Figma's rate limit. Not fabricated here — follow-up needed once Figma access resets, most likely surfaced naturally when the component tickets that use those surfaces (hero big CTA, sheet) are built.

## Radius

Numeric scale, matching the ticket's own numbering rather than inventing semantic names:

```
--radius-6:  6px   /* inputs */
--radius-15: 15px
--radius-20: 20px
--radius-30: 30px  /* major cards */
--radius-40: 40px  /* buttons */
--radius-50: 50px  /* sheet top */
--radius-80: 80px  /* glass pills / big CTA */
```

Produces Tailwind utilities `rounded-6`, `rounded-15`, `rounded-20`, `rounded-30`, `rounded-40`, `rounded-50`, `rounded-80`.

## Shadow

```
--shadow-card:       0 4px 50px rgba(0, 0, 0, 0.15)
--shadow-comparison: 0 10px 30px rgba(0, 0, 0, 0.04)
```

Tailwind: `shadow-card`, `shadow-comparison`.

## Type scale (§A3)

Built from text nodes actually sampled on the Neck page — not a fabricated full scale. Each entry is a Tailwind `fontSize` tuple `[size, { lineHeight, letterSpacing?, fontWeight }]`, so `text-hero`, `text-h2`, etc. apply size + line-height + tracking + weight together.

| Token            | Font    | Size / Line-height | Weight | Tracking | Sampled from                                                                       |
| ---------------- | ------- | ------------------ | ------ | -------- | ---------------------------------------------------------------------------------- |
| `text-hero`      | display | 87px / 90px        | 300    | —        | Hero H1 ("Neck pain and stiffness?")                                               |
| `text-h2`        | display | 35px / 66px        | 600    | —        | Section heading ("Types")                                                          |
| `text-eyebrow`   | sans    | 25px / 40px        | 500    | 1.25px   | Eyebrow label ("UNDERSTANDING NECK PAIN")                                          |
| `text-body-lg`   | sans    | 25px / 40px        | 400    | —        | Hero subcopy                                                                       |
| `text-button`    | sans    | 20px / 40px        | 400    | —        | CTA button label                                                                   |
| `text-nav`       | sans    | 17px / 40px        | 400    | 0.85px   | Nav links (both states — resolves the nav-link inconsistency acceptance criterion) |
| `text-faq-q`     | alt     | 25px / 40px        | 600    | —        | FAQ question                                                                       |
| `text-faq-a`     | alt     | 25px / 40px        | 400    | —        | FAQ answer (color: `ink-900`)                                                      |
| `text-alt-label` | alt     | 22px / 40px        | 400    | —        | "Book now" / comparison sublabels                                                  |

`text-nav` is applied uppercase at the component level (Tailwind's `uppercase` utility), not baked into the font-size token, since text-transform isn't part of a `fontSize` tuple.

**Gap:** roles not sampled this pass (e.g. an `h1`/`h3` distinct from the hero/section styles, form field labels/values) aren't included. Add them when a component ticket needs them rather than guessing now.

## Grid / fluid container (§E)

No breakpoint frames exist in the Figma file to sample (only the 1728px desktop canvas). Implemented as a fluid container that:

- Caps at `max-width: 1568px`, centered.
- Scales horizontal padding from 24px at a 375px floor (assumed mobile minimum, not spec-confirmed) up to exactly 80px at the 1728px canvas width (spec-confirmed: `(1728 − 1568) / 2 = 80`).

```css
.container {
  width: 100%;
  max-width: 1568px;
  margin-inline: auto;
  padding-inline: clamp(24px, 4.14vw + 8.5px, 80px);
}
```

The `4.14vw + 8.5px` slope is derived from linear interpolation between (375px → 24px) and (1728px → 80px). This is a judgment call flagged as an assumption, not a confirmed value.

## Acceptance criteria mapping

- [x] All colors, radii, shadows available as Tailwind tokens + CSS vars — via `tailwind.config.ts` + `:root` in `globals.css`.
- [x] Four fonts load via `next/font`; `→` is an icon, Inter not bundled — `ArrowRightIcon` component, no Inter import.
- [x] Type scale from spec §A3 available as utilities — `fontSize` scale in `tailwind.config.ts` (scoped to sampled roles; noted gap above).
- [x] Nav-link inconsistency resolved (Poppins 17 for both nav states) — single `text-nav` token.

## Out of scope

- Building the actual nav, hero, card, FAQ, or comparison components — this ticket only lands tokens/fonts.
- Assembling the hero gradient CSS (only the end color is tokenized here).
- Completing the full §A2 glass/overlay inventory beyond the one confirmed value.
