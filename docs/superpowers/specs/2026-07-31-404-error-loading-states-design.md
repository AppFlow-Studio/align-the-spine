# App-wide 404, error boundary, and loading states — design

**Epic:** 12 – Cross-cutting · **Track:** Dev A · **Est:** S

## Summary

Add branded `not-found.tsx`, `error.tsx`, and `loading.tsx` at the app root so unknown
routes, uncaught render errors, and route-transition loading all get a consistent,
on-brand treatment instead of Next.js defaults.

## Files

### `app/not-found.tsx` (server component)

- Big "404" numeral (`font-display`, large fluid `clamp()` size, `text-navy-900/10`
  or similar light tint) as a decorative backdrop, with a real `<h1>Page not found</h1>`
  on top for a11y/SEO.
- Body copy + CTA row: `Button` `variant="teal"` → `/book` ("Book Appointment"),
  `Button` `variant="primary"` → `/` ("Back to Home").
- Wrapped in `Section`/`.container` matching `app/thank-you/page.tsx`'s spacing so it
  inherits `RootShell` (navbar/footer) automatically — Next renders root `not-found.tsx`
  inside the root layout's `{children}`.
- `export const metadata` built via `buildMetadata()` (`lib/seo/metadata.ts`) with
  `robots: { index: false }` (matches `thank-you`'s pattern for non-indexable routes).

### `app/error.tsx` (client component)

- `"use client"`, default export `Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void })`.
- `useEffect` logs `error` to `console.error` (no external error-reporting service exists
  in this repo yet, so nothing more elaborate is warranted).
- Same visual shell as `not-found`/`thank-you`: icon circle (navy-900 bg, `InfoIcon`),
  heading "Something went wrong", reassuring body copy.
- Three actions: `Try again` (primary, `onClick={reset}`), `Back to Home` (ghost, `/`),
  and the phone number (teal, `href={siteConfig.business.phoneHref}`) for reassurance.
- No `metadata` export (not allowed in client components) — the root layout's fallback
  metadata applies.

### `app/loading.tsx` (server component)

- Minimal centered spinner in a `min-h-[60vh]` flex-center wrapper, shown during
  route transitions/hydration. No copy — brief flash, not a designed empty state.
- Reuses the spinner visual already inlined in `components/ui/button.tsx`'s `Spinner`;
  extracted into a tiny shared `components/ui/spinner.tsx` so both call sites share one
  implementation instead of duplicating the markup.

## Out of scope

- `global-error.tsx` (catches errors in the root layout itself) — not requested by the
  ticket; root layout has no logic likely to throw.
- Per-route `loading.tsx` (e.g. `app/conditions/[slug]/loading.tsx`) — routes are
  statically generated with no real async fetch today, so a segment-scoped loading
  state would rarely render. Root-level coverage is sufficient for now.

## Testing

- Manual: visit an unknown route (`/does-not-exist`) → branded 404 renders with working
  CTAs. Temporarily throw in a page to confirm `error.tsx` renders with working
  `reset()`/home/call actions. `next build` passes (client/server component boundaries
  correct).
