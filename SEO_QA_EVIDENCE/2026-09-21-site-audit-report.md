# SEO / Site Audit — 2026-09-21 (Ahrefs 17 Sep crawl + code cross-check)

**Snapshot date:** Ahrefs Site Audit crawled 2026-09-17, exported 2026-09-21. Cross-checked against the live `align-the-spine` codebase (branch `munis-dev`) the same day. Source evidence: `SEO_QA_EVIDENCE/ahrefs-2026-09-17/` (Overview PDF, pages.csv, links.csv — 203 pages / 8,348 links crawled).

One important timing note up front: **this crawl predates the IA-02 publish** (11 pages × EN/ES/PT/HT = 44 routes, shipped 2026-09-21, same day as this export). So several things this crawl flags as broken are already fixed in code — flagged explicitly below, not silently assumed fixed.

## Health snapshot

| Metric        | Value                              |
| ------------- | ---------------------------------- |
| Health Score  | **89 — Good**                      |
| Errors        | 22                                 |
| Warnings      | 89                                 |
| Notices       | 169                                |
| Crawled URLs  | 201 (101 internal, 100 resources)  |
| Links crawled | 1,344 found / 1,289 crawled        |
| HTTP status   | 199× 2xx, 4× 3xx, **zero 4xx/5xx** |

No errors, no 5xx, no broken pages at crawl time. The "22 errors" bucket is entirely the image-size issue below, not broken pages.

## 1. Indexability gap — already fixed in code, not yet re-verified live

The crawl flags **21 pages** as `noindex`+`nofollow`: all 11 condition/service pages × EN + their ES mirrors (PT/HT weren't crawled as deeply in this pull, but the same gate applied to them too). Pulled the exact list from `pages.csv` — it's precisely the set the IA-02 override published today (`/conditions/back-pain`, `/conditions/sciatica`, `/services/spinal-decompression`, their `/es/...` mirrors, etc.).

**Status:** code-fixed same day as this crawl (see `content/seo.ts`'s IA-02 override note, `SEO_QA_EVIDENCE/2026-09-21-final-qa.md`). Verified locally via production build that `isPublished()` now returns `true` and sitemap includes all 44 routes. **Not yet verified by a live Ahrefs recrawl** — recommend re-running Site Audit ~3-5 days after this session to confirm Google/Ahrefs actually sees `index,follow` in production, not just in a local build.

## 2. Title tags — 10 too long, all a real pattern, not noise

Cross-checked every crawled page's title length directly against `pages.csv`. The 10 flagged all cluster in **Spanish and Portuguese condition/service pages**, where the `"<Condition> Chiropractor in Deerfield Beach, FL | Align the Spine"` template runs long once translated (e.g. _"Quiropráctico para Dolor de Cabeza Cervicogénico | Deerfield Beach | Align the Spine"_ — 86 characters). This isn't random content bloat, it's the shared title template not accounting for translation length. Longest 5:

1. ES — Cervicogenic headache (86 chars)
2. ES — TMJ/jaw pain (85 chars)
3. ES — Concussion (83 chars)
4. PT — Book appointment (79 chars)
5. ES — Whiplash (78 chars)

**Recommendation:** shorten the shared ES/PT title template (drop ", FL" or the trailing "| Align the Spine" brand suffix on the longest ones) rather than fixing one-by-one — this is a template-level issue.

## 3. Meta descriptions — 27 too long, 3 too short

Ahrefs flags these counts but the raw CSV export doesn't carry description text, so this couldn't be independently verified the way titles were. Given the scale (27 of ~100 real pages) this reads as the same root cause as titles: a shared description template that doesn't budget for translation expansion. Worth a dedicated pass through `content/*/seo.ts` description fields — not verified further here, flagged as a real gap in this audit rather than guessed at.

## 4. Open Graph — 3 pages incomplete

Flagged by Ahrefs, not independently isolated in this pass (no per-page OG data in the CSV export). Small enough (3 pages) to just check directly against `content/seo.ts`'s route registry next session.

## 5. Images — partially fixed, still heavy

The evidence folder's own `2026-09-21-final-qa.md` already documents a real fix same day: `public/figma-exports/` recompressed 187MB → 55.9MB, with the 3 worst offenders specifically called out. Verified this against the current filesystem: **`public/figma-exports/` is 60MB today**, consistent with that fix having landed.

However, checking the actual largest files remaining: several hero images are still **1.9–2.5MB each** (`spinal-decompression-hero.png`, `massage-soft-tissue-hero.png`, `home-visits-hero.png`, `drabe-spine.png`, others). The Ahrefs "22 images too large" count is from before the recompression fix, so it's likely lower now — but multi-megabyte PNGs for hero sections is still heavier than ideal for LCP. **Recommendation:** convert the remaining largest PNGs to WebP/AVIF with a `<picture>` fallback, particularly the ones used above-the-fold (hero sections directly affect Lighthouse LCP).

## 6. "More than three parameters in URL" — 52 flagged, false positive

Traced all 52 directly: every one is a Next.js `/_next/image?url=...&w=...&q=...&dpl=...` optimizer resource URL, not a real content page. This is Next's own image-optimization pipeline, not a URL-structure problem. **No action needed** — safe to ignore or exclude `/_next/*` from future crawls to reduce noise.

## 7. Redirects — 4, all expected

All 4 are the standard `apex → www` and `http → https` canonicalization redirects (`chirobackpain.com` → `www.chirobackpain.com`, `http://...` → `https://...`), plus `/robots.txt` redirecting the same way. This is correct, intentional behavior, not a defect.

## 8. Link integrity — clean

Checked all 8,348 crawled links in `links.csv` for 4xx/5xx targets: **zero broken links found**, internal or external, at crawl time.

## 9. Keyword/rank opportunity (from existing `rank-baseline.md`, not re-derived here)

The repo already has a keyword→URL mapping built from real Ahrefs Keywords Explorer data (Aug/Sep 2026 pulls) — see `SEO_QA_EVIDENCE/rank-baseline.md`. Standout opportunities already identified there, worth restating since this is the actionable part:

- **`sciatica chiropractor`** — 3,400/mo volume, **KD 0** — best single opportunity in the whole cluster, now that `/conditions/sciatica` is actually indexable.
- **Accident cluster** (`auto accident chiropractor`, `car accident chiropractor`, etc.) — the strongest validated cluster overall, 150-3,300/mo across 7 terms, all pointing at `/car-accident-chiropractor`.
- **`whiplash chiropractor`**, **`tmj chiropractor`**, **`concussion chiropractor`** — all KD 0, low-hanging once indexed.
- **No rank positions filled in yet** — needs actual Ahrefs Rank Tracker access (not available in this environment), and shouldn't be checked before ~1-2 weeks post-publish (2026-09-21) since these pages only became indexable today.

## What this audit could NOT verify from here

- **Live production indexability** of the 44 newly-published routes — verified in a local build, not against the actual Vercel production deploy or a live Ahrefs recrawl.
- **Meta description / Open Graph content specifics** — Ahrefs flagged counts, raw text wasn't in this CSV export.
- **Actual current image-issue count** — the 22-image figure predates the same-day recompression fix; likely lower now but not re-crawled to confirm.
- **Rank positions** — no Rank Tracker access from this environment.

## Priority action list

1. Re-run Ahrefs Site Audit ~1 week post-publish to confirm the 21 indexability fixes are live in production, not just local-build-verified.
2. Shorten the shared ES/PT title template — root-causes 10 of the flagged issues at once.
3. Audit meta descriptions in `content/*/seo.ts` for the same translation-length pattern (27 pages flagged).
4. Convert remaining 1.9-2.5MB hero PNGs to WebP/AVIF, prioritizing above-the-fold images.
5. Check the 3 Open Graph-incomplete pages directly against the route registry.
6. Fill in `rank-baseline.md` positions starting ~1-2 weeks post-publish (earliest: ~2026-10-05).
