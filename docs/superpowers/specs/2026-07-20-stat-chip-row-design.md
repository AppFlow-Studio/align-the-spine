# StatChipRow — Design

**Ticket:** Epic 4 – Sections · Track: Dev A · Est: S
**Source:** ticket text (pasted directly). References condition-page-spec §B2 (not present in this repo — treated as the ticket text itself plus this repo's existing `TopStatsBar`/`Hero` conventions).

## Summary

Inline stat-chip row rendering the same 5 stats as `TopStatsBar` (Reviews / Visits / When it applies / Bilingual care / Insurance), styled as compact wrapping chips instead of a grid strip, for use inside `Hero`.

## Resolved open decisions

- **Data source:** reads `siteConfig.stats` directly from `content/site.ts` — the same array `TopStatsBar` consumes. No new content, no props needed to pass stat data in; this keeps both components in sync by construction rather than by convention.
- **Location:** `components/ui/stat-chip-row.tsx`, not `components/layout/`. It's a reusable, content-agnostic display primitive (like `Badge`), not global page chrome — `TopStatsBar` (the actual persistent chrome strip) stays in `components/layout/`.
- **Visual treatment:** hero backgrounds are dark photos, so this can't reuse `TopStatsBar`'s light-surface tokens (`text-mute-400` label / `text-ink-900` value). Each chip is a glass pill — `rounded-40 bg-overlay-white-15 px-4 py-2` (the same glass token already used for the `LeadForm` card and `Button variant="glass"`) — with `text-stat-label uppercase text-mute-300` label stacked above `text-stat-value text-white` value. Reuses existing dark-surface tokens; no new colors introduced.
- **Wired into `Hero` now**, not left for a later ticket: rendered unconditionally for both `"home"` and `"condition"` variants, at the bottom of the left column's content stack (after CTAs/`bilingualNote`, still inside the existing `flex flex-col gap-6` column). No new `Hero` props — `StatChipRow` self-sources from `siteConfig`, same pattern as `LeadForm`'s footer note being static-positioned in the JSX rather than prop-gated.

## Architecture

```
components/ui/
  stat-chip-row.tsx   — server component, <StatChipRow className? />
```

- No `"use client"` — purely presentational, no state/interactivity, consistent with `Badge`, `Eyebrow`, `TopStatsBar`.
- No new npm dependencies, no new design tokens.

## `StatChipRow` props

```ts
export interface StatChipRowProps {
  className?: string;
}
```

## Markup / layout

```
<dl className="flex flex-wrap gap-3">
  {siteConfig.stats.map((stat) => (
    <div key={stat.label} className="flex flex-col gap-0.5 rounded-40 bg-overlay-white-15 px-4 py-2">
      <dt className="font-sans text-stat-label uppercase text-mute-300">{stat.label}</dt>
      <dd className="font-sans text-stat-value text-white">{stat.value}</dd>
    </div>
  ))}
</dl>
```

- `flex flex-wrap` + per-chip `gap-3` on the row is what satisfies "wraps gracefully on mobile" — no breakpoint-specific overrides needed, chips simply reflow.
- `dt`/`dd` + `text-stat-label`/`text-stat-value` tokens are the exact ones `TopStatsBar` already uses, so typography stays consistent between the strip and chip treatments per the ticket's "shares data with TopStatsBar" framing.

## `Hero` change

- Import `StatChipRow` and render it as the last child of the left column's `flex flex-col gap-6` div, after the existing home/condition conditional blocks, unconditional on `variant`.
- No prop/type changes to `HeroProps`.

## Acceptance criteria mapping

- [x] Renders from shared config — reads `siteConfig.stats` directly, same source as `TopStatsBar`.
- [x] Chip layout matches hero treatment — glass pill using the same `bg-overlay-white-15` token as the rest of Hero's dark-surface chrome (LeadForm card, glass button).
- [x] Wraps gracefully on mobile — `flex flex-wrap` row, no fixed widths.

## Out of scope

- Any change to `TopStatsBar` itself.
- Any change to `siteConfig.stats` content/shape.
- Per-variant stat filtering (e.g. hiding a stat on condition pages) — ticket describes the same 5 stats for both.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- Manual, dev server: view Hero (both variants, if both are mounted anywhere) at desktop and mobile widths; confirm chips wrap onto multiple lines without overflow/clipping at narrow widths, and read legibly against the dark background photo.
