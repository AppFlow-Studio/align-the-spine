# Audit Closure — 2026-09-22

Closes out every actionable item Bilal flagged against `SEO_QA_EVIDENCE/2026-09-21-site-audit-report.md`. Each item below states what changed, how it was verified, and — critically — whether that verification is **munis-dev/local-build-verified** or **production-verified**. This branch has not been merged/deployed as of this note, so nothing here can honestly claim production verification; see the final section for what's still genuinely post-deploy work.

## 1. Ten overlong titles — fixed (23 titles across all 4 locales, comprehensively)

The Ahrefs crawl only found 10 because it's the one crawl reached EN + ES depth — the same root cause (a shared title template that doesn't budget for translation length) applied identically to PT/HT titles the crawl never reached. Fixed all 23 titles over 70 characters across EN/ES/PT/HT by dropping the trailing `| Align the Spine` brand suffix — location and intent stay fully intact; the brand still shows via the SERP domain/favicon. Longest title site-wide is now 70 characters.

**New regression gate**: `content/seo-serp-budget.test.ts` fails the build if any locale's title exceeds 70 chars — this can't silently regress again.

## 2. 27 long + 3 short meta descriptions — fixed (33 descriptions across all 4 locales)

Same all-locales treatment. Trimmed 30 descriptions over 155 chars and lengthened 3 under 100 chars (`EN /reviews`, `PT /pt/avaliacoes`, `HT /ht/komante-pasyan`). Every edit preserved full meaning — safety-critical content (the concussion pages' "not a substitute for emergency/neurological care" disclaimer, in all 3 languages that have one) was reworded to fit budget, never cut.

Same `content/seo-serp-budget.test.ts` file gates every locale's descriptions to 100-155 chars going forward.

## 3. Three incomplete Open Graph pages — fixed

Traced exactly which 3 by cross-referencing every route's `image` field: `EN /privacy-policy`, `ES /es/resenas`, `ES /es/contacto`. All three had no `image` at all — added one to each, reusing existing photo assets already used by sibling pages (`exterior-img.png` for the two location-ish pages, `interior-table.png` matching the English `/reviews` page for `/es/resenas`). Same test file gates every locale for a missing OG image going forward.

## 4. Remaining oversized hero images — optimized, updated exact count given

Before this pass: `public/figma-exports/` was 60MB (after the earlier 2026-09-21 recompression that took it from 187MB), with 8 files still over 1.9MB and 41 files over 300KB.

Ran every PNG/JPEG over 400KB through `sharp` (resize to max 2200px width — still comfortably above what any of these hero images render at, even at 2x DPR on a `sizes="(min-width: 1024px) 62vw, 100vw"` slot; palette-based PNG re-encoding, quality 82): 37 files were reduced, only writing back when the result was actually smaller.

**Result**: `public/figma-exports/` is now **36MB** (60MB → 36MB, a further 40% cut on top of the prior fix). Exact current counts, since Ahrefs' own byte threshold for "Image file size too large" isn't public and this environment can't submit a live crawl to get its literal number back:

| Threshold           | File count                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| >1MB                | 8 (down from the prior pass's larger set; largest is now 1.24MB, was 2.5MB+) |
| >500KB              | 35                                                                           |
| >200KB              | 46                                                                           |
| Total PNG/JPG files | 78                                                                           |

Spot-checked visual quality on the most aggressively compressed file (`spinal-decompression-hero.png`, 2.0MB→503KB) — no visible artifacts. `next build` succeeds; every page still renders through `next/image`, which independently re-optimizes/serves WebP or AVIF per-request on top of this — these numbers are the _source_ file sizes, a floor under what any visitor actually downloads, not the delivered bytes.

## 5. Point-to-where-it-hurts region-specific media/video — status confirmed explicitly (NOT fully implemented)

To be unambiguous, since the prior report only covered the crawlability fix for a _different_ feature (region→condition destination links existing in initial HTML) and that could read as implying the video panel itself was done: **it is not.** ATS-E15a is still genuinely blocked on the E25 video-asset dependency — verified directly against the Bunny CDN storage zone on 2026-09-21 that no per-region video/poster/caption assets exist. What exists today:

- `content/pain-area-media.ts` — the typed media map, all 6 regions currently empty/blocked
- `components/sections/pain-area-media-panel.tsx` — the full panel (crossfade, pause-on-switch, reduced-motion gate, missing-asset fallback) — but since every entry is empty, it renders the "Video coming soon" fallback for all 6 regions today, not real video
- Tests covering the plumbing, not real playback (nothing to play back yet)

Nothing changed on this item since 2026-09-21 — still waiting on real assets. See the ATS-E15a Notion ticket for the live status.

## 6. LOCAL-01 — final implementation/verification

Two-part ticket, both parts checked directly against the current code:

1. **Turn-by-turn "Get Directions" link** — fully implemented. `lib/maps.ts`'s `buildDirectionsUrl()` (Google's keyless Directions URL scheme, no API key) is wired into `components/layout/location-footer.tsx` across all 4 locales, each with its own localized label ("Get Directions" / "Cómo llegar" / "Como chegar" / "Jwenn Direksyon"). Tested: `lib/maps.test.ts` covers `buildDirectionsUrl()` directly, including asserting no API key leaks into the URL.
2. **Parking guidance** — correctly still unverified/unrendered. `siteConfig.parkingGuidance` has no client-confirmed source of truth (lot vs. street, validation, accessible spaces), so it stays `status: "needs-confirmation"` and `location-footer.tsx` renders nothing for it rather than a guessed "free parking available" claim. This is the same discipline every other `VerifiedValue` claim on this site follows — not a gap, a deliberate absence pending real data. Tested: `content/site.test.ts` asserts `isVerified()` correctly refuses to render it in the unverified state.

**LOCAL-01 is done for what can be done without new client data.** The only remaining work is non-code: someone confirms real parking details with the client, then one field flips and it renders automatically.

## 7. Route-count inconsistencies — cleaned up, real numbers below

Two separate, genuinely confusing things, now disambiguated:

**"21 vs 22" noindex pages.** These were never the same metric. The Ahrefs 2026-09-17 crawl's own Overview page reports **21** for `Noindex page`, `Nofollow page`, and `Noindex and nofollow page` (all three agree) — the exact set is the IA-02 override's 20 routes that crawl reached (EN + ES; PT/HT weren't crawled that deep) plus `/home-visit-chiropractor` (unrelated, stays draft for its own separate reason). **22** is a different Ahrefs metric — `Image file size too large` — that a reader could easily conflate with the noindex figures since it's numerically close and sits right next to them in the same Top Issues table. Confirmed this is exactly what ATS-SEO-131's route matrix ticket separately documented ("22 errors, all 'Image file size too large'"). Fixed by stating both numbers explicitly next to each other everywhere they're cited from now on, rather than letting "the noindex number" float ambiguously.

**"44 routes vs 39-count sitemap breakdown."** The original final-qa.md note ("39 condition/service entries + hubs, matching the exact expected 3+21+3+12 breakdown") was confusing shorthand that didn't reconcile cleanly with "44" — corrected in place with a dated note. Re-verified directly against a real production build's live `/sitemap.xml`:

- **44 IA-02 routes** = 28 condition-page entries (7 conditions × 4 locales) + 16 service-page entries (4 services × 4 locales). Confirmed present via direct URL-pattern count against the fetched sitemap.
- **120 total sitemap URLs**: 41 EN + 39 ES + 20 PT + 20 HT. The gap between 44 and 120 is hubs, static pages (home, about, contact, reviews, blog, privacy policy, etc.), and the service-area city pages — **19 EN + 19 ES** city pages exist (`content/service-areas.ts` / `content/es/service-areas-cities.ts`), not 0 Spanish city pages as a stale comment in `content/es/seo.ts` used to claim. That comment (which cited a nonexistent file, `content/es/service-areas.ts`, and said "deliberately no Spanish counterpart for the nineteen... pages") was corrected in place — it was written before the Spanish city-page template shipped and nobody went back to fix it. PT/HT have no per-city pages, which is accurate and unchanged.

## 8. Notion tickets updated

- **IA-02** (`Build the condition pages with a YMYL-compliant content model`): posted the override confirmation, the corrected route counts, and an explicit statement that the code-gate removal and actual clinician sign-off are two separate facts — the override doesn't retroactively claim sign-off happened.
- **ATS-SEO-131** (route matrix): already correctly documents the 44-row IA-02 update from 2026-09-21; no further correction needed there.
- This closure doc + the corrected `2026-09-21-final-qa.md` line are the canonical numbers from here forward.

## Implemented/verified on `munis-dev` vs. production-verified — read this before treating anything above as "done, ship it"

**Everything in this document and the linked evidence is verified against `munis-dev` and/or a local production build** (`next build && next start`, direct `curl`/fetch against localhost, the committed test suite). **None of it is production-verified** — this branch is not yet merged or deployed. Distinguishing the two matters because "the code is correct" and "production actually serves it that way" are different claims, and conflating them is exactly the kind of thing this audit exists to catch.

### Genuinely post-deploy (cannot be done from here, regardless of merge status)

- **Rank positions** (`SEO_QA_EVIDENCE/rank-baseline.md`): needs real indexing time (1-2 weeks minimum post-deploy) plus Ahrefs Rank Tracker access this environment doesn't have.
- **Google Rich Results Test / schema.org hosted validator**: no browser/network tool here can submit pages to Google's or schema.org's hosted tools. The structural JSON-LD validation already done (required-field checks per `@type`) is real verification, just not literally those two tools.
- **Real-device/browser QA**: mobile/desktop visual QA, interactive nav/form/call-button behavior — everything here was verified via `curl`/direct HTML inspection and the automated test suite, not a rendered browser.
- **Live Ahrefs recrawl**: to confirm the noindex/nofollow flags actually clear and the image-size issue count actually dropped, in production, not just in this local build.

### What to do once this PR merges and deploys

1. Re-fetch `/sitemap.xml` and spot-check a few of the 44 newly-indexable routes directly against the live domain.
2. Re-run Ahrefs Site Audit ~3-7 days post-deploy.
3. Start filling in `rank-baseline.md` positions no sooner than ~1-2 weeks post-deploy.
4. Run Google Rich Results Test and schema.org validator against a few sampled live URLs.
5. A real device/browser pass on the newly-published pages.

## Verification run this session

- `tsc --noEmit`: clean
- `eslint`: clean (pre-existing unrelated warnings only)
- `vitest run`: **585/585 passing** (12 new tests added: `content/seo-serp-budget.test.ts`)
- `next build`: succeeds
