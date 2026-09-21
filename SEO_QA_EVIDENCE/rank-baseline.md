# Post-Launch Rank Baseline

Started 2026-09-21, the day the 11 condition/service pages (across EN/ES/PT/HT) were published for real — see `content/seo.ts`'s IA-02 override note and `SEO_ROUTE_MATRIX.md`. This is the keyword→target-URL mapping every major term on this site should be tracked against, built from the real Ahrefs data already gathered (`ahrefs-2026-08/keyword-evidence-synthesis.md`, `ahrefs-2026-09/synthesis-part2-and-final-labels.md`). **No actual rank position is filled in below** — this environment has no Ahrefs Rank Tracker access, and more fundamentally, Google has not yet re-crawled/indexed these 11 pages since they only became indexable today, so a rank check right now would just show "not ranking," which isn't a meaningful baseline. Rank position should be filled in by whoever has Ahrefs access, no sooner than ~1–2 weeks post-publish (real indexing lag), then re-checked periodically.

## How to fill this in

For each row: pull the keyword in Ahrefs Rank Tracker (or Google Search Console once it has data) against `www.chirobackpain.com`, record position + date. Re-run monthly at minimum; weekly for the first month post-launch to catch early indexing problems (e.g. a page that never gets crawled).

## Deerfield / general intent

| Keyword                      | Volume (US) | KD  | Target URL                                                                                            | Position (fill in) | Date checked |
| ---------------------------- | ----------- | --- | ----------------------------------------------------------------------------------------------------- | ------------------ | ------------ |
| chiropractor deerfield beach | 150         | —   | `/`                                                                                                   |                    |              |
| chiropractor near me         | 302,000     | —   | `/` (not a realistic target — hyper-competitive national term, home page owns the local variant only) |                    |              |

## Accident cluster (strongest validated cluster)

| Keyword                            | Volume (US) | KD  | Target URL                   | Position | Date |
| ---------------------------------- | ----------- | --- | ---------------------------- | -------- | ---- |
| auto accident chiropractor         | 3,300       | 26  | `/car-accident-chiropractor` |          |      |
| car accident chiropractor          | 2,900       | 0   | `/car-accident-chiropractor` |          |      |
| auto accident chiropractor near me | 2,600       | 22  | `/car-accident-chiropractor` |          |      |
| car accident chiropractor near me  | 2,100       | 0   | `/car-accident-chiropractor` |          |      |
| chiropractor after car accident    | 450         | 3   | `/car-accident-chiropractor` |          |      |
| accident chiropractor              | 350         | 0   | `/car-accident-chiropractor` |          |      |
| chiropractor for car accident      | 150         | 3   | `/car-accident-chiropractor` |          |      |

## Condition pages (published 2026-09-21)

| Keyword                    | Volume (US) | KD    | Target URL                                                              | Position | Date |
| -------------------------- | ----------- | ----- | ----------------------------------------------------------------------- | -------- | ---- |
| back pain chiropractor     | 2,000       | 20    | `/conditions/back-pain`                                                 |          |      |
| back pain deerfield        | 60          | 0     | `/conditions/back-pain` (hyper-local; Bartell ranks position 10 today)  |          |      |
| sciatica chiropractor      | 3,400       | **0** | `/conditions/sciatica` (standout best opportunity in the whole cluster) |          |      |
| chiropractor for neck pain | 600         | 4     | `/conditions/neck-pain`                                                 |          |      |
| whiplash chiropractor      | 250         | 0     | `/conditions/whiplash`                                                  |          |      |
| tmj chiropractor           | 900         | 0     | `/conditions/tmj-jaw-pain`                                              |          |      |
| chiropractor for headaches | 300         | 2     | `/conditions/cervicogenic-headache`                                     |          |      |
| concussion chiropractor    | 40          | 0     | `/conditions/concussion` (real but tiny — deprioritize)                 |          |      |

## Service pages (published 2026-09-21)

| Keyword                                       | Volume (US) | KD  | Target URL                                                                                                         | Position | Date |
| --------------------------------------------- | ----------- | --- | ------------------------------------------------------------------------------------------------------------------ | -------- | ---- |
| chiropractic adjustment                       | 6,700       | 9   | `/services/chiropractic-adjustments`                                                                               |          |      |
| spinal decompression                          | 16,000      | 12  | `/services/spinal-decompression` (Commercial but Non-local — researching-the-treatment intent, not pure "near me") |          |      |
| (no distinct validated commercial term found) | —           | —   | `/services/soft-tissue-therapy`                                                                                    |          |      |
| (no distinct validated commercial term found) | —           | —   | `/services/cupping-therapy`                                                                                        |          |      |

## Multilingual

| Keyword                        | Locale             | Volume (US)                                                                                                                                                                                         | KD  | Target URL                                               | Position | Date |
| ------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | -------------------------------------------------------- | -------- | ---- |
| quiropráctico cerca de mí      | es                 | 600                                                                                                                                                                                                 | 55  | `/es`                                                    |          |      |
| dolor de espalda quiropráctico | es                 | (see ES cluster, informational-heavy)                                                                                                                                                               | —   | `/es/condiciones/dolor-de-espalda`                       |          |      |
| quiropraxia                    | pt                 | 500                                                                                                                                                                                                 | 1   | `/pt/servicos` (supporting copy, implemented 2026-09-21) |          |      |
| quiropraxia near me            | pt (code-switched) | 150                                                                                                                                                                                                 | 38  | `/pt/servicos`                                           |          |      |
| quiropraxia cerca de mi        | pt (code-switched) | 80                                                                                                                                                                                                  | 50  | `/pt/servicos`                                           |          |      |
| (Haitian Creole terms)         | ht                 | **no measurable Ahrefs data** — documented tooling gap, not zero demand (see synthesis Part 3). Size off Census/ACS Broward/Palm Beach Haitian Creole-speaking population instead of search volume. | —   | `/ht`                                                    | N/A      | N/A  |

## Cannibalization check

`content/seo.test.ts` already enforces at build time that no two indexable routes share a `primaryQuery` — this is a live regression gate, not a one-time manual check. Re-verified as part of this pass: no collisions across the 44 published routes.

## Known gaps, stated honestly

- No literal Ahrefs Rank Tracker pull happened for this baseline — no Ahrefs account access in this environment (same class of gap as ATS-SEO-122's original blocker, now resolved for Site Audit but not for Rank Tracker specifically).
- Google Search Console would give real first-party data once these pages accumulate impressions — worth connecting if not already, since it doesn't require Ahrefs credentials.
- The 4 service pages besides adjustments/spinal-decompression have no distinctly validated Ahrefs commercial term on record — their content/targeting is sound, but nobody has pulled Keywords Explorer data specifically for soft-tissue-therapy or cupping-therapy as their own terms.
