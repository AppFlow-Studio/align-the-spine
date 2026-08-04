# SEO metadata + canonical + robots + sitemap foundation

**Ticket:** Implementation Plan §5, P0A (launch blocker)
**Date:** 2026-08-03

## Context

Most of this ticket's infra already exists under earlier ticket IDs (ATS-131 sitemap/robots, ATS-141 auto-accidents rebuild, ATS-137 condition full-fidelity pages): `lib/seo/metadata.ts` provides `buildMetadata()` (title/description/canonical/OpenGraph/Twitter), most pages call it, `app/sitemap.ts` and `app/robots.ts` exist. This spec covers only the remaining gaps against the ticket's acceptance criteria.

## Gaps identified

1. No `content/seo.ts` route registry — `app/sitemap.ts` hardcodes its own route list, independent of what pages declare, so the two can drift.
2. `app/sitemap.ts` uses `lastModified: new Date()` (build time) — the ticket explicitly forbids this.
3. `/contact-us`, `/auto-accidents`, `/thank-you` hand-roll `Metadata` directly instead of calling `buildMetadata()` — no `alternates.canonical`.
4. `app/layout.tsx` has no `title.template`, no default `openGraph`/`twitter`, no `icons`, no top-level `robots`, no `verification`.
5. No preview/nonproduction noindex anywhere — a Vercel preview build would currently emit indexable pages with production canonical URLs.
6. `siteConfig.siteUrl` is a hardcoded string, not env-driven.
7. `/auto-accident` (legacy 24-line template route) duplicates `/auto-accidents` (current 171-line bespoke build, ATS-141) — both live, both indexable, near-identical titles. Real duplicate-content risk.

## Decisions

- **Duplicate route:** 301 redirect `/auto-accident` → `/auto-accidents` via `next.config.ts` `redirects()`. Delete `app/auto-accident/page.tsx` and its now-dead condition wiring.
- **SITE_URL:** `process.env.SITE_URL ?? "https://alignthespinechiropractic.com"` in `content/site.ts` — works today with zero env setup, becomes env-driven once `SITE_URL` is set on Vercel.
- **Preview/nonproduction noindex:** `isProduction = process.env.VERCEL_ENV === "production"` in `content/site.ts`. Fail-closed: local dev, CI, and Vercel preview builds are all treated as noindex since none of them set `VERCEL_ENV=production`.

## Design

### `content/site.ts`

Add `siteUrl` env fallback and `isProduction` flag (see Decisions).

### `content/seo.ts` (new)

Typed registry, one entry per indexable route:

```ts
interface RouteEntry {
  path: string;           // "" for home
  title: string;
  description: string;
  image?: { src: string; alt: string };
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified: string;   // ISO date, tied to real content/source-control history — never build time
}
export const routes: RouteEntry[] = [ ... ];
```

`app/sitemap.ts` maps straight over `routes` instead of maintaining its own list. Dynamic `/conditions/[slug]` entries (from `conditionsBySlug`) stay generated separately and get appended, same as today, each with an explicit `lastModified`.

### `lib/seo/metadata.ts`

`buildMetadata()` forces `robots: { index: false, follow: false }` whenever `!siteConfig.isProduction`, regardless of what a page passes in — fail-closed so a page can't accidentally ship indexable in preview by omission.

### `app/layout.tsx`

- `title.template = "%s | Align the Spine Chiropractic"`, `title.default` = current broad-local title
- default `openGraph`/`twitter` (site name, description, approved image) so any page missing its own social block still gets sane output
- `icons` (favicon, apple touch, manifest — reuse existing `app/favicon.ico`; add apple-touch-icon only if an approved asset exists, otherwise skip rather than fabricate one)
- top-level `robots` default mirroring the `isProduction` gate
- `verification.google = process.env.GOOGLE_SITE_VERIFICATION` (omitted, not placeholder text, when unset — avoids shipping a fake token)

### `app/robots.ts`

When `!isProduction`: `{ userAgent: "*", disallow: "/" }`. Otherwise current production rules. Sitemap URL referenced in both cases.

### Pages to fix

`/contact-us`, `/auto-accidents`, `/thank-you` switch to `buildMetadata()` for real canonicals (`/thank-you` keeps `robots: { index: false }`, which now also gets reinforced by the layout-level default in preview).

### `next.config.ts`

Add permanent redirect `/auto-accident` → `/auto-accidents`.

### `.env.example` (new)

Document `SITE_URL` and `GOOGLE_SITE_VERIFICATION` (both optional, with fallback behavior noted).

## Testing

- Unit tests: `buildMetadata()` noindex-in-nonproduction behavior (mock `siteConfig.isProduction`); `content/seo.ts` registry shape.
- `app/sitemap.ts`/`app/robots.ts` are Next route handlers — cover via existing test patterns if any exist for them, otherwise a light smoke test (call the exported function, assert absolute URLs, assert `/thank-you` and `/auto-accident` are absent).
- Production build (`next build`) run at the end, not just `next dev`, per acceptance criteria.

## Out of scope

- Actual Search Console verification token value (placeholder/unset is fine per ticket).
- Confirming the production hostname is marketing-final (using the existing `siteConfig.siteUrl` value as-is).
- Any other backlog ticket downstream of this one.
