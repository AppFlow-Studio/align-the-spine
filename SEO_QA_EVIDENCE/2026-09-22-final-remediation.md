# 2026-09-22 — Final remediation report

Closes the independent SEO acceptance audit of `munis-dev`.

|                                                |                                                |
| ---------------------------------------------- | ---------------------------------------------- |
| **Independent audit score (before)**           | **78 / 100**                                   |
| Branch at audit                                | `munis-dev` @ `1af7f66`                        |
| Findings raised                                | ATS-A01 … ATS-A11                              |
| Findings that reproduced as real defects       | 6                                              |
| Findings corrected as audit false positives    | 3                                              |
| Findings blocked on things outside engineering | 2                                              |
| Tests                                          | 585 → **631** (64 files, 0 failing)            |
| Lint                                           | 0 errors (11 pre-existing warnings, unchanged) |
| Typecheck                                      | clean                                          |
| Build                                          | succeeds, 115 static pages                     |

---

## 1. Finding-by-finding outcome

| ID      | Finding                         | Outcome                                | Evidence                                                                                       |
| ------- | ------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| ATS-A01 | Production stale / undeployed   | **BLOCKED** — needs merge + deploy     | prod sitemap 76 vs branch 120; GSC 0 impressions on all condition pages                        |
| ATS-A02 | `/feed.xml` 24-item ceiling     | **FIXED**                              | `app/feed.xml/route.ts`; 7 new tests; bug-reintroduction proven to fail 2 tests                |
| ATS-A03 | Home page → no condition links  | **FIXED** (audit root cause corrected) | 0 → 8 links EN; 0 → 3 each for ES/PT/HT                                                        |
| ATS-A04 | Region media not delivered      | **BLOCKED** — external asset (E25)     | all 6 `painAreaMedia` entries still empty; spec documented                                     |
| ATS-A05 | ES city metadata over budget    | **FIXED**                              | titles 62–73 → **38–49**; descriptions 170–181 → **137–148**; build-wide >160 count 19 → **0** |
| ATS-A06 | Pagination test mocked          | **FIXED**                              | real seeded 25-record repository; 8 tests                                                      |
| ATS-A07 | AggregateRating unsubstantiated | **FIXED**                              | 12 → **8** pages, exactly those rendering reviews                                              |
| ATS-A08 | Stale Ahrefs figures            | **FIXED**                              | `rank-baseline.md` refreshed live 2026-09-22                                                   |
| ATS-A09 | "Unsupported" Service nodes     | **FALSE POSITIVE** — no change         | both are visible cards; `@id` anchors confirmed in rendered HTML                               |
| ATS-A10 | PT/HT hubs without city pages   | **FALSE POSITIVE** — intentional       | already documented in `content/pt/seo.ts`                                                      |
| ATS-A11 | PT whiplash terminology         | **OPEN FOR NATIVE REVIEW**             | all candidate terms 0 US volume; content mechanism correct                                     |

### Corrections to the independent audit

Three of the eleven findings did not survive reproduction. Recording them because an audit
response that silently "fixes" non-problems is as misleading as one that misses real ones.

1. **ATS-A03's stated root cause was wrong.** The audit said the home page rendered
   `PointToWhereItHurts` with six regions lacking `href`. In fact 5 of 6 regions carry
   `href` through `getRouteHref()`, `shoulder-pain` is deliberately unlinked with a
   documented reason, and the home page does not render that component at all — it renders
   `SpineOverview`. The _symptom_ the audit measured (zero condition links on the home page)
   was real and is fixed; the diagnosis was not.
2. **ATS-A09 was a false positive.** "Sports Injury" and "Posture & Corrective" are visible
   service cards with real copy, and their `Service` `@id`s are `#slug` fragments that the
   page actually emits as element ids. Schema.org does not require a dedicated URL per
   Service. No nodes were removed; a test now locks the invariant.
3. **ATS-A10 was already a documented decision,** not an oversight.

---

## 2. YMYL content review — the gap the audit explicitly left open

The independent audit scored content quality as _not assessed_. That gap is now closed.

**Scope:** all 7 English condition pages, 4 service pages, `/car-accident-chiropractor`,
`/home-visit-chiropractor` — read in rendered form, then scanned programmatically for 14
unsafe-claim patterns (guarantees, cure claims, "will heal/fix/eliminate", avoid-surgery,
pain-free, absolutes, permanence, universality, zero-dollar, coverage promises, immediate
relief, diagnosis language, full-recovery).

**Result: zero unsafe claims.** Every pattern that matched proved safe on inspection:

| Match               | Page                     | Actual text                                                                   | Verdict                                                                            |
| ------------------- | ------------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `guarantee`         | whiplash                 | "…**not a guarantee** either way, since severity and individual healing vary" | Hedge — the opposite of a promise                                                  |
| `guarantee`         | chiropractic-adjustments | "An evaluation **does not guarantee** PIP benefits"                           | Explicit disclaimer                                                                |
| `guaranteed`        | home-visit               | "offered based on your case and location, **not guaranteed** for every visit" | Explicit hedge                                                                     |
| `without surgery`   | spinal-decompression     | "gentle, controlled traction … **without surgery**"                           | Factual description of a non-surgical modality, not an avoid-surgery promise       |
| `fully heal`        | back-pain                | "an old injury that **never fully healed**"                                   | Describes chronic-pain aetiology                                                   |
| `pain free`, `100%` | all pages                | "I left there feeling so much better and pain free" / "100% recommended!"     | Verbatim patient reviews, never edited — editing them would constitute fabrication |

**Red-flag guidance verified present where it clinically matters:**

- **Concussion** — "A concussion is a mild traumatic brain injury that needs medical
  evaluation. Chiropractic care is not a substitute for emergency or neurological
  assessment" (stated twice, including above the fold); red-flag list covering loss of
  consciousness, confusion, slurred speech, new weakness/numbness; "Emergency warning signs
  should not wait for a chiropractic visit"; correct sequencing ("After medical clearance…").
- **Sciatica** — "Loss of bladder or bowel control (a recognized warning sign of **cauda
  equina syndrome**) — seek emergency care." Correct red flag, named correctly.
- **Cervicogenic headache** — "New, severe, or worsening headaches after a collision need
  prompt medical evaluation" and "timing alone does not identify the cause" — correctly
  distinguishes and defers rather than claiming the cause.
- **Florida PIP** — cited as `Fla. Stat. § 627.736` with "coverage depending on eligibility
  and policy terms" on every page that mentions it. No automatic-benefit or free-care claim
  anywhere.

**No content changes were required or made.** One observation logged rather than changed:
spinal-decompression's "helping draw it back into place" describes a disc-repositioning
mechanism that is clinically debated. It is hedged ("helping", not "will"), describes
intended mechanism rather than promising an outcome, and softening it further would push
the page toward the useless boilerplate this task explicitly warns against. Flagged for
clinical preference, not corrected unilaterally.

> Method note: the first pass of the safety-signal scanner under-reported emergency
> guidance on sciatica and the headache page. Cause was mine, not the site's — stateful
> `g`-flagged regexes reused with `.test()` across files, so `lastIndex` persisted between
> pages. Re-checked by reading the pages directly.

---

## 3. Home-page CTR anomaly (Step 15) — investigated, no change made

The audit flagged a genuine oddity: 15,432 impressions at average position 2.38 returning
0.10% CTR. Query-level Search Console data (22 Aug – 21 Sep) explains it completely.

**Real branded and local queries perform normally:**

| Query                                            | Impressions | Clicks |   CTR | Position |
| ------------------------------------------------ | ----------: | -----: | ----: | -------: |
| align the spine chiropractic                     |         105 |      7 | 6.67% |      2.6 |
| align the spine chiropractic and wellness center |          25 |      5 | 20.0% |      9.4 |
| chiropractor in deerfield beach                  |          15 |      1 | 6.67% |     12.7 |
| walk in chiropractor near me                     |          18 |      1 | 5.56% |      1.0 |

**The aggregate is diluted by ~7,000 zero-click impressions from one anomalous cluster:**

| Query                                          | Impressions | Clicks | Position |
| ---------------------------------------------- | ----------: | -----: | -------: |
| chiropractor                                   |       1,266 |      0 |     2.39 |
| schedule chiropractor                          |       1,222 |      0 |  **1.0** |
| book chiropractic appointment                  |         680 |      0 |  **1.0** |
| call chiropractic office pompano beach         |         620 |      0 |  **1.0** |
| call chiropractor                              |         615 |      0 |  **1.0** |
| book chiropractor appointment                  |         596 |      0 |  **1.0** |
| schedule chiropractic appointment              |         588 |      0 |  **1.0** |
| request chiropractor appointment pompano beach |         556 |      0 |  **1.0** |
| hire chiropractor                              |         456 |      0 |  **1.0** |
| …and ~5 more of the same shape                 |             |        |          |

Every one is a formulaic verb-led action phrase (`schedule|book|call|request|hire` +
service + optional city), sits at _exactly_ position 1.0, and has _exactly_ zero clicks.
Genuine position-1 organic listings for "book chiropractic appointment" would convert.
That signature indicates non-standard SERP surfaces rather than a snippet problem.

**Conclusion: this is a measurement artifact, not a metadata defect.** The home page's real
organic CTR on queries that behave normally is 5–20%. Per this task's own instruction —
"Do not rewrite homepage metadata based only on aggregate CTR" — **no metadata change was
made.** Recommend segmenting these queries out before using home-page CTR as a KPI.

---

## 4. Verified rendered state after remediation

| Check                                      | Before  | After      |
| ------------------------------------------ | ------- | ---------- |
| Pages analysed                             | 106     | 106        |
| Meta descriptions > 160 chars              | **19**  | **0**      |
| Meta descriptions < 70 chars (indexable)   | 0       | 0          |
| Titles > 60 chars                          | 60      | 41         |
| Titles > 65 chars (indexable)              | 27      | 8          |
| Pages with duplicate `BreadcrumbList`      | 0       | **0**      |
| Pages with H1 count ≠ 1                    | 0       | **0**      |
| Incomplete Open Graph (indexable)          | 0       | **0**      |
| `og:image` not absolute                    | 0       | **0**      |
| Canonical host mismatches                  | 0       | **0**      |
| Hreflang clusters (5-entry / 3-entry)      | 80 / 19 | 80 / 19    |
| Hreflang → noindex target                  | 0       | **0**      |
| Sitemap URLs                               | 120     | 120        |
| Sitemap containing noindex/utility URLs    | 0       | **0**      |
| `aggregateRating` pages                    | 12      | **8**      |
| Home-page links to condition pages         | **0**   | **8**      |
| `/es` `/pt` `/ht` links to condition pages | 0 each  | **3 each** |
| Tests                                      | 585     | **631**    |

Remaining titles over 60 characters were reviewed individually rather than mechanically
truncated, per this task's instruction. The 8 still over 65 are cases where the city or
condition name itself carries the length (e.g. "TMJ / Jaw Pain Chiropractor in Deerfield
Beach, FL | Align the Spine"); trimming them would cost entity or geographic clarity for a
few pixels. None are template-driven runaway.

---

## 5. Remaining external blockers

1. **Deployment (ATS-A01).** Everything in this branch is unverifiable in production until
   merged and deployed. Highest-value action available.
2. **Region-specific media (ATS-A04).** Needs 6 clinical demonstration clips. Spec:
   H.264 MP4, 1280×960, under 6s, seamless loop, no audio. Request one region first.
3. **GBP reverification of 5.0 / 164 (ATS-A07).** Required before widening
   `includeAggregateRating` to any further page.
4. **Native PT-BR review (ATS-A11).** Terminology call belongs to a speaker.
5. **Notion requirement matrix.** Connector unauthenticated in this environment — only
   `authenticate`/`complete_authentication` exposed, no query capability. Matrix cannot be
   produced here. Unchanged from the independent audit.
