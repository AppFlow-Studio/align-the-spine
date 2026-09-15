# SEO QA Evidence

ATS-SEO-132 deliverable — a reviewable evidence package so an independent reviewer can reach the same conclusions this branch's SEO/QA tickets did, without re-running everything themselves. Snapshot date: 2026-09-16 (branch `munis-dev`).

## Folder structure

Matches the ticket's required structure exactly (9 folders). Two folders hold more than one thing, documented here rather than left implicit:

- **`ahrefs-before/`** — two distinct things live here, both genuinely "before":
  - `bartell-chiropractic/`, `carpe-diem-chiropractic/`, `county-line-chiropractic/` — ATS-SEO-003's pre-implementation **competitor** research (Ahrefs Site Explorer exports for the 3 named competitors).
  - `site-audit-recrawl-27-aug/` — the **our-own-domain** Site Audit baseline crawl (27 Aug 2026) that ATS-SEO-122's before/after comparison used, pulled after Ahrefs access was granted.
- **`ahrefs-after/`**
  - `site-audit-recrawl-15-sep/` — the matching after-recrawl (15 Sep 2026) for the same project, plus the real competitor Content Gap export (bartellchiro.com, spineandjointcenterfortlauderdale.com) pulled the same session. See ATS-SEO-122's Notion ticket for the full before/after issue-count analysis.
- **`ahrefs-2026-08/`, `ahrefs-2026-09/`** — kept as their own top-level folders rather than nested under before/after: this is keyword/SERP research (Keywords Explorer, SERP Overview, Content Gap for ATS-SEO-004's keyword map), not a Site Audit crawl, so it doesn't fit either bucket cleanly. Documented here as the one structural deviation from the ticket's literal folder list.
- **`meta-seo-inspector/`, `seo-meta-in-1-click/`** — real browser-extension screenshots (ATS-SEO-121 round 2), 20 and 28 respectively, sampled across Home, About, Services hub, an individual service page, Sciatica, Whiplash, Reviews, Blog, Car-accident-chiropractor, Service-areas hub, Service-areas/Miami, and Book-an-appointment.
- **`view-source/`** — raw HTML (`curl`, no JS execution) for the same 15 pages ATS-SEO-121 named as required-inspection pages, pulled fresh against a real **production build** (`next build` + `next start`) on 2026-09-16 rather than dev mode.
- **`raw-html/`** — `SUMMARY.md` + `summary.json`: for each of those 15 pages, the title/canonical/H1 count/`tel:` link presence/missing-alt count/JSON-LD `@type`s, parsed directly from the `view-source/` files. This is what actually substantiates ATS-SEO-121's "raw HTML verified" claims with saved evidence, not just a ticket note.
- **`schema/`** — the exact JSON-LD blocks extracted from each of those 15 pages' raw HTML, one `.json` file per page, each block checked for valid JSON and required fields per `@type` (same validation approach ATS-SEO-122 described but hadn't saved to disk before this ticket).
- **`lighthouse/`** — real `npx lighthouse` HTML+JSON reports for 6 representative pages (`/`, `/car-accident-chiropractor`, `/about`, `/conditions/back-pain`, `/services`, `/service-areas/boca-raton`), run against the same production build via headless Chrome. Supersedes ATS-SEO-122's inline-only scores (never saved as files) with real report artifacts.
- **`test-results/`** — `vitest run --reporter=verbose` full output, 535/535 passing, captured 2026-09-16.

## What's each folder evidence _for_

| Folder                                                                     | Backs which ticket(s)                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `ahrefs-before/`, `ahrefs-after/`                                          | ATS-SEO-003 (competitor research), ATS-SEO-122 (Site Audit before/after) |
| `ahrefs-2026-08/`, `ahrefs-2026-09/`                                       | ATS-SEO-004 (keyword map), cited throughout ATS-SEO-125/126/127/131      |
| `meta-seo-inspector/`, `seo-meta-in-1-click/`, `view-source/`, `raw-html/` | ATS-SEO-121                                                              |
| `schema/`                                                                  | ATS-SEO-122, ATS-SEO-126                                                 |
| `lighthouse/`                                                              | ATS-SEO-122                                                              |
| `test-results/`                                                            | Every ticket's "tests passing" claim on this branch                      |

## Correction on record

An earlier pass (ATS-SEO-131) claimed 5 `/conditions/*` pages had zero `BreadcrumbList` schema, from a grep that only checked each page's own `page.tsx` imports. Generating `raw-html/SUMMARY.md` against the real production build surfaced that `HeroSolidPanel` renders `BreadcrumbJsonLd` itself whenever a `breadcrumbs` prop is passed — so all 7 `/conditions/*` pages actually do have it. `SEO_ROUTE_MATRIX.md` and the ATS-SEO-126/131 Notion tickets were corrected in place; the real gap (no `MedicalWebPage` on any of the 7) stands as originally reported.

## Guardrail

No Ahrefs account credentials, API keys, or session tokens are committed anywhere in this folder — every Ahrefs artifact here is an exported report (PDF/CSV/screenshot) a signed-in user downloaded, not a way to access the account itself.
