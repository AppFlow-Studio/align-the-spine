# 2026-09-22 — Remediation checklist (independent audit ATS-A01 … ATS-A11)

Working checklist for closing the independent SEO acceptance audit (scored **78/100**).
Every row was reproduced against the current branch **before** any change was made; three
findings did not survive reproduction and are recorded as such rather than "fixed".

Baseline captured before any edit:

| Item          | Value                                             |
| ------------- | ------------------------------------------------- |
| Branch / HEAD | `munis-dev` @ `1af7f66`                           |
| vs `main`     | 27 ahead, 0 behind (fast-forwards cleanly)        |
| Upstream      | in sync (`0` commits behind `upstream/munis-dev`) |
| Lint          | 0 errors, 11 pre-existing warnings                |
| Typecheck     | clean                                             |
| Tests         | 585 passing / 59 files                            |
| Build         | succeeds (115 static pages)                       |
| Sitemap       | 120 URLs                                          |
| Rendered      | 106 prerendered pages                             |

---

## ATS-A01 — Production is a stale mid-branch build

- **Reproduced:** yes. Production `/conditions/sciatica` → `noindex, nofollow`; production
  sitemap 76 URLs vs branch 120; GSC shows 0 impressions for every condition/service page
  across 22 Aug – 21 Sep.
- **Root cause:** not a code defect. The branch has never been merged or deployed.
- **Action:** none available here — merging and deploying is explicitly out of scope for
  this task. Carried into the PR description and the post-deploy checklist.
- **Status:** **BLOCKED — requires merge + deploy by Bilal.**

## ATS-A02 — `/feed.xml` retained the 24-item pagination ceiling

- **Reproduced:** yes. `app/feed.xml/route.ts:14` called
  `listPublicContent({ contentType: "blog_post", pageSize: 24 })`.
- **Root cause:** two parts. (1) The 2026-09-17 sitemap fix repaired only the sitemap's
  caller. (2) More fundamentally, every repository clamped `pageSize` to a hardcoded
  `Math.min(24, …)` in three separate places, and `listAllPublicContent` asked for `100` —
  a request silently overridden. The loop happened to stay correct because `totalPages`
  derives from the clamped size, but the requested page size was dead intent.
- **Action:**
  - `lib/content/repository.ts` — added `MAX_PUBLIC_PAGE_SIZE`, `DEFAULT_PUBLIC_PAGE_SIZE`
    and `clampPageSize()` as the single source of truth.
  - All three repositories (`fixture`, `supabase`, `static-service-area`) now call
    `clampPageSize()` instead of duplicating the literal.
  - `listAllPublicContent` pages with `MAX_PUBLIC_PAGE_SIZE`, so the request matches reality.
  - `app/feed.xml/route.ts` now retrieves **all** published posts, sorts newest-first, then
    applies an explicit, documented `FEED_MAX_ENTRIES = 50` cap.
- **Tests:** `lib/content/public-content.test.ts` rewritten (see ATS-A06);
  `app/feed.xml/route.test.ts` created — 7 cases.
- **Verified:** reintroducing a 24-item ceiling fails 2 tests; restoring passes 7/7.
- **Status:** **FIXED.**

## ATS-A03 — Home page passed no internal authority to condition pages

- **Reproduced:** partly — **the audit's stated root cause was wrong.**
  - The audit claimed the home page rendered `PointToWhereItHurts` with six region links
    all falling back to `/book-an-appointment` because the regions had no `href`.
  - Actually: 5 of 6 regions **do** carry `href` via `getRouteHref()`, the sixth
    (`shoulder-pain`) is deliberately unlinked with a documented reason, and
    `herniated-disc` correctly points at `/services/spinal-decompression`. The component
    is correct and needs no change.
  - The home page does not render `PointToWhereItHurts` at all — it renders
    `SpineOverview`, a static anatomy diagram which had no links by design.
- **The real defect stands:** rendered home page contained **zero** links to any condition
  page, in all four locales. Only route in was the `/conditions` hub.
- **Action:** added optional `href` to `SpineSegment`, resolved through
  `getRouteHref()` / new `getEsRouteHref()` / `getPtRouteHref()` / `getHtRouteHref()` so a
  draft or unregistered destination degrades to plain text. Region names now render as
  anchors in both the desktop callout and the mobile list.
- **Also:** removed a stale comment in `content/point-to-where-it-hurts.ts` still claiming
  `/conditions/cervicogenic-headache` was draft pending IA-02 sign-off.
- **Verified:** home page 0 → 8 condition links; `/es`, `/pt`, `/ht` each 0 → 3.
- **Tests:** `components/sections/spine-overview.test.ts` — 7 cases.
- **Status:** **FIXED** (with the audit's root cause corrected).

## ATS-A04 — Region-specific media not delivered

- **Reproduced:** yes. All six `painAreaMedia` entries are `{ src: "", poster: "", description: "" }`.
- **Root cause:** external asset dependency (E25). Re-checked the repository, the CDN
  references and project files — no per-region clinical clips exist. The only media on the
  Bunny CDN zone is generic clinic/marketing footage.
- **Action:** none possible without fabricating or substituting footage, which the ticket
  explicitly forbids ("a visitor selecting 'neck' and seeing a lower-back treatment clip is
  a clinical-accuracy problem"). The plumbing is complete and asset-ready.
- **Status:** **BLOCKED — external asset dependency.** Asset spec is in
  `content/pain-area-media.ts`: H.264 MP4, 1280×960, <6s, seamless loop, no audio track,
  one region first to de-risk format.

## ATS-A05 — Spanish city-page metadata template over budget

- **Reproduced:** yes. 19 pages; titles 62–73 chars, descriptions 170–181 chars. Every
  over-length description in the entire 106-page build came from this one template.
- **Root cause:** `esServiceAreaTitle()` / `esServiceAreaMetaDescription()` led with the
  long "a Domicilio para Accidentes de Auto" qualifier, pushing the city — the only part
  that differentiates the 19 pages — past the truncation point.
- **Action:** both templates rewritten to front-load intent + city. PIP 14-day wording
  dropped **from the meta description only**; it remains verbatim in the page body, where
  it has the context that keeps it accurate. "pacientes elegibles" retained so the
  eligibility hedge survives; "Deerfield Beach" added so the real office location is named.
- **Verified:** titles now 38–49, descriptions 137–148, across all 19.
- **Tests:** `content/metadata-budget.test.ts` — 14 cases, covering all four registries.
- **Status:** **FIXED.**

## ATS-A06 — Pagination regression test was mocked

- **Reproduced:** yes. All three cases injected a fake `listFn` returning hand-written page
  objects, so the repository clamp — the behaviour that caused the bug — was never exercised.
  No `/feed.xml` test existed at all.
- **Action:** rewrote `lib/content/public-content.test.ts` around a real paginating
  repository seeded with 25 published posts that reuses the production `clampPageSize()`
  and the same offset arithmetic the shipped repositories use.
- **Key guard added:** a single `listPublic()` call can never return the full dataset,
  whatever `pageSize` is requested (24 / 25 / 100 / 1000 / undefined all asserted) — so any
  future caller reading one page as "everything" is provably wrong.
- **Status:** **FIXED.** 8 cases here + 7 in the feed test.

## ATS-A07 — AggregateRating on pages with no visible reviews

- **Reproduced:** yes. 12 rendered pages emitted `{"ratingValue":5,"reviewCount":164}`.
- **Root cause:** `buildMedicalBusiness()` attached the rating automatically whenever the
  claim was verified, so every caller inherited it regardless of page content.
- **Independent verification performed:**
  - The 8 pages rendering `PracticeJsonLd` (EN/ES/PT/HT home + contact) **all** render
    `HeroReviewsCarousel`/`ReviewsCarousel` with real client-supplied reviews — substantiated.
  - The 4 service-area hubs render **no** review component — unsubstantiated.
  - `/reviews` renders reviews but deliberately carries no rating markup (ATS-SEO-060).
    That decision was left standing.
- **NOT reverified:** the 5.0 / 164 figure itself. GBP is out of scope for this task and no
  connector is available — recorded rather than assumed.
- **Action:** `aggregateRating` is now opt-in (`includeAggregateRating`, default `false`).
  `PracticeJsonLd` opts in; the 4 hubs get the default.
- **Verified:** 12 → 8 pages, exactly the substantiated set.
- **Tests:** `lib/schema-aggregate-rating.test.ts` — 8 cases; `lib/schema.test.ts` updated.
- **Status:** **FIXED** (rating value itself still pending GBP reverification).

## ATS-A08 — Stale Ahrefs figures in rank-baseline.md

- **Reproduced:** yes, and re-queried live on 2026-09-22 rather than trusting the audit's
  own numbers.
- **Action:** `SEO_QA_EVIDENCE/rank-baseline.md` refreshed. See that file for the full
  table with retrieval date, database and source.
- **Status:** **FIXED.**

## ATS-A09 — "Unsupported" Service schema nodes

- **Reproduced: NO — this was a false positive in the audit.**
- **Verification:** "Sports Injury" and "Posture & Corrective" are rendered as real,
  visible service cards on `/services` with their own descriptions and images. Each
  `Service` node's `@id` is a `#{slug}` fragment of that page, and the page emits matching
  element ids (`id="sports-injury"`, `id="posture-corrective"` — both confirmed in rendered
  HTML). Schema.org `Service` does not require a dedicated URL; it requires the described
  offering to match visible content, which it does.
- **Action:** no nodes removed. Added `content/services-schema-support.test.ts` (5 cases)
  asserting the invariant that made this a false alarm, so a future node added without
  visible support fails instead of shipping.
- **Status:** **NO CHANGE NEEDED — verified and now covered.**

## ATS-A10 — PT/HT service-area hubs have no city pages

- **Reproduced:** yes, structurally.
- **Verification:** `content/pt/seo.ts` already documents this as deliberate: "The 19
  service-area city pages remain deliberately NOT built here — see
  docs/multilingual-seo-baseline.md's page-family strategy on why those stay out of scope
  regardless of locale."
- **Action:** none. The decision is recorded, and mass-producing 38 translated city pages
  for route parity is explicitly the wrong move.
- **Status:** **NO CHANGE NEEDED — intentional, already documented.**

## ATS-A11 — Portuguese whiplash terminology

- **Reproduced:** yes, as a terminology question, not a defect.
- **Evidence gathered (Ahrefs, US, 2026-09-22):** `torcicolo cervical` **0**,
  `chicote cervical` **0**, `lesao em chicote` no data, `torcicolo` 250 (but that term
  means stiff neck generally). No PT-BR whiplash term has measurable US demand.
- **Content check:** the page's first sentence reads "uma lesão no pescoço por movimento
  brusco, comum em colisões traseiras" — which describes the whiplash mechanism correctly.
  A reader is not misled.
- **Action:** URL **kept**. Renaming means a slug change, a permanent redirect, an
  hreflang-cluster edit and sitemap churn, for a page with zero measurable demand and no
  demonstrably better alternative. Full reasoning recorded inline in `content/pt/seo.ts`.
- **Status:** **OPEN FOR NATIVE REVIEW** — flagged for a PT-BR speaker, consistent with the
  repo's existing `docs/multilingual-seo-baseline.md` §8.2 disclosure.

---

## Additional work completed beyond the audit findings

- **YMYL content review (audit had explicitly skipped this).** All 7 EN condition pages,
  4 service pages, the accident page and the home-visit page read and scanned for unsafe
  claims. Result: **zero unsafe claims.** Every pattern that matched a risk regex proved to
  be a hedge or a verbatim patient review on inspection. Detail in
  `2026-09-22-final-remediation.md`.
- **Home-page CTR anomaly investigated at query level** (Step 15). Conclusion: not a
  metadata problem; no rewrite performed. Detail in the final remediation doc.
- **Localized home pages** received the same internal-linking treatment as English, and
  `/es`, `/pt`, `/ht` `lastModified` were bumped accordingly.
