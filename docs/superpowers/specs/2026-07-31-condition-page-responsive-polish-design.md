# Condition page responsive polish — Design

**Ticket:** ATS-062 (assumed number not in ticket text) · Epic 5 – Condition engine · Track: Dev A · Est: M · Depends on: ATS-061
**Source:** ticket text (references condition-page-spec §E, not present in this repo — same gap noted by every prior condition-page spec in this repo, including the 2026-07-30 template design doc and the `display`/`h2`/`card-title` clamp() tokens already in `tailwind.config.ts`, which cite this same §E from an earlier ticket, ATS-112).

## Summary

Mobile/tablet responsive pass over the `/conditions/[slug]` template (ATS-061): stack the four 2-column blocks below desktop width, finish the `clamp()` fluid-type conversion §E started (ATS-112 already converted `display`/`h2`/`card-title`; this covers the remaining fixed-px headline tokens used on this template), and verify the whole page at 1440/1024/768/375 in a real browser. Colors/radii/shadows are explicitly out of scope (ticket: "keep ... fixed").

## Current state vs. target

| Block                                        | 2-col split today                                      | Target                                                                                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hero                                         | `lg:` (1024px)                                         | unchanged — already stacks below 1024                                                                                                                                                                        |
| AccidentBanner                               | `lg:` (1024px)                                         | unchanged — already stacks below 1024                                                                                                                                                                        |
| UnderstandingCondition (Types/Common Causes) | `md:` (768px)                                          | move to `lg:` — currently splits at tablet, ticket wants it stacked through tablet like the other three blocks                                                                                               |
| DoctorProfile                                | `xl:` (1280px)                                         | re-verify with a real browser at 1024/768; tighten to `lg:` only if the clamp'd `doctor-name` token removes the clipping ATS-092 documented, otherwise leave `xl:` as a documented exception (user decision) |
| ComparisonTable                              | horizontal scroll-snap "scroller" (3 cols never stack) | unchanged — already the "stacked/scroller" pattern the ticket asks for                                                                                                                                       |
| PointToWhereItHurts (selector)               | `md:hidden` region-list fallback below 768             | unchanged — already matches "selector → region list on mobile"                                                                                                                                               |

Mobile/tablet/desktop boundary used throughout: **stack below `lg` (1024px), split at `lg` and up** — matches Hero/AccidentBanner's existing, unmodified behavior and the ticket's own verification breakpoints (1440 and 1024 both read as "desktop-shaped" in the ticket, 768 and 375 as "stacked").

## Type scaling

`tailwind.config.ts` already has 3 clamp()'d tokens from a prior ticket (ATS-112), each with a code comment citing condition-page-spec §E and the same 375→1728px interpolation:

```
display:  clamp(36px, 2.14vw + 27.96px, 65px)   / lh clamp(38px, 2.22vw + 29.69px, 68px)
h2:       clamp(24px, 0.81vw + 20.95px, 35px)   / lh clamp(45px, 1.55vw + 39.18px, 66px)
card-title: clamp(24px, 0.81vw + 20.95px, 35px) / lh clamp(25px, 0.89vw + 21.67px, 37px)
```

Three more headline-level tokens used directly on this template are still fixed-px with manual (or no) breakpoint variation and are the ones this ticket's "apply clamp() type scaling" targets:

- **`hero`** (`64px`/`68px`) — today `Hero`'s `<h1>` hand-rolls its own 3-step scale (`text-[32px] sm:text-[44px] lg:text-hero`) instead of using the token at all. Converting `hero` to clamp() lets the `<h1>` drop the manual sm/lg overrides and use `text-hero` alone at every width.
- **`understanding-intro`** (`30px`/`40px`) — used by `UnderstandingCondition`'s intro paragraph and reused by `AccidentBanner`'s headline (`text-h2 md:text-understanding-intro`); currently has zero fluid scaling below its one hard-coded size.
- **`doctor-name`** (`40px`/`48px`) — `DoctorProfile`'s `<h2>`, same issue.

Each converts using the same linear-interpolation formula already used for `display`/`h2`/`card-title` (`clamp(min, slope·vw + intercept, max)`, min derived at 375px, max at 1728px, same as the existing tokens' own derivation — no new methodology). Smaller body-copy tokens (`type-name`, `redflag-bullet`, `panel-body`, `selected-label`, etc.) are out of scope: the ticket's "type scaling" bullet reads as headline-level, matching the size class of tokens ATS-112 already converted, and those smaller sizes have no reported readability/overflow problem to fix.

`AccidentBanner`'s `text-h2 md:text-understanding-intro` headline keeps its existing two-token structure (smaller `h2` scale until `md`, then the larger `understanding-intro` scale) — both tokens are now fluid, so the visual jump at `md` becomes a jump between two already-smooth curves rather than an isolated cliff. Not otherwise restructured; that dual-token choice predates this ticket and isn't part of its scope.

Once `hero` is clamp()'d, `Hero`'s `<h1>` className simplifies from:

```
font-display text-[32px] leading-[38px] text-white sm:text-[44px] sm:leading-[50px] lg:text-hero
```

to:

```
font-display text-hero text-white
```

## Changes

1. `tailwind.config.ts` — convert `hero`, `understanding-intro`, `doctor-name` fontSize entries to `clamp()` per the formula above.
2. `components/sections/hero.tsx` — simplify `<h1>` className to plain `text-hero` (no per-breakpoint overrides needed once the token itself is fluid).
3. `components/sections/understanding-condition.tsx` — `md:flex-row`/`md:items-stretch` → `lg:flex-row`/`lg:items-stretch` on the Types/Causes wrapper; `Divider`'s `hidden md:block` → `hidden lg:block`.
4. `components/sections/doctor-profile.tsx` — re-verified live at 1024/768; changed only if the clipping ATS-092 found is confirmed gone (see Verification).
5. No changes anticipated to `AccidentBanner`, `ComparisonTable`, `PointToWhereItHurts` — their breakpoint behavior already matches target; verification may still surface small overflow/clipping fixes at the 4 required widths, applied inline if found.

No color/radius/shadow changes (ticket: "keep colors/radii/shadows fixed"). No new components, no new dependencies.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- Real browser (dev server + connected Chrome tab, not just Tailwind-class reasoning — several prior plans in this repo's ledger flagged unconfirmed mobile QA as a residual gap, this ticket exists partly to close that): visit `/conditions/neck-pain` (representative of all 4 slugs, same template) at 1440, 1024, 768, and 375px widths.
  - Confirm Hero form drops below the headline at 375/768/1024 and sits beside it at 1440 (and at 1024 if DoctorProfile's investigation doesn't change the 1024 desktop-start decision for Hero itself — Hero already splits at `lg`).
  - Confirm Understanding, Accident, Doctor blocks stack correctly at each width per the table above.
  - Confirm ComparisonTable's horizontal scroller works (no layout break, scrollable, snap points land on column edges) and the selector's mobile region-list renders/operates at 375/768.
  - Confirm no horizontal overflow/clipping anywhere on the page at any of the 4 widths.
  - Spot-check that `text-hero`/`text-understanding-intro`/`text-doctor-name` don't overflow their containers at either clamp() extreme (375px and ≥1728px, the latter approximated by a wide window).
  - Spot-check `/` (Home) and `/privacy-policy` at 375 and 1440 to confirm the shared `hero`/`doctor-name` token changes don't regress pages outside the condition template.
- Desktop parity vs Figma: since no new Figma read was attempted for this ticket (matches the precedent set by the ATS-061 template design doc, which also didn't re-fetch Figma), "parity" is verified as "unchanged from ATS-061's already-approved desktop rendering" at 1440px — i.e. this pass must not visibly alter the 1440px layout, only add/smooth scaling below it.

## Blast radius note: shared tokens

`hero`, `understanding-intro`, and `doctor-name` are shared Tailwind font-size tokens, not condition-page-private ones — grepping usage found:

- `text-hero`: `Hero` (used by `/`, `/services`, `/about`, `/book`, `/home-visits`, and all condition pages) and `/privacy-policy`'s standalone `<h1>`.
- `text-understanding-intro`: only `UnderstandingCondition` and `AccidentBanner` (condition pages only).
- `text-doctor-name`: only `DoctorProfile` (rendered on condition pages, `/services`, `/about`, `/`).

Converting these tokens to `clamp()` therefore improves (never regresses, since min/max bracket the existing fixed value) type scaling on every page that uses them, not just condition pages. This is accepted as in-scope collateral benefit, not scope creep — same token, same fix, no per-page conditional logic. Verification below spot-checks the home page and `/privacy-policy` in addition to a condition page to confirm no regression on the pages this ticket doesn't otherwise touch.

## Out of scope

- Colors, border-radii, shadows (ticket: keep fixed).
- Restructuring `AccidentBanner`'s dual-token headline sizing.
- StillHaveQuestions / any section not already part of ATS-061's shipped template.
- Any layout/stacking change to pages other than the condition-page template (Home, Services, About, Book, Home Visits, Privacy Policy) — only the shared font-size tokens are touched there, not their layouts.
