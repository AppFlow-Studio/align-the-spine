# Multilingual Keyword Map — EN / ES / PT-BR / HT

ATS-SEO-142 deliverable: "a multilingual keyword map with locale, cluster, intent, target page
family, funnel, and evidence source." Synthesizes the research in
`SEO_QA_EVIDENCE/ahrefs-2026-08/keyword-evidence-synthesis.md` (Part 1: Keywords Explorer),
`SEO_QA_EVIDENCE/ahrefs-2026-09/synthesis-part2-and-final-labels.md` (Part 2: SERP Overview,
corrected US Spanish, PT-BR, HT; **Part 3, added 2026-09-06: the PT-BR re-pull and HT re-check
that section itself called for**) into the single-table format this ticket asks for. **This file
adds no numbers of its own** — every metric below, including the ones added in this revision, is
copied from those source documents; where they say a metric doesn't exist, this map says `VOLUME
UNVERIFIED`, not an estimate.

Label definitions (per this ticket's decision framework):

- **VALIDATED** — SERP + keyword evidence supports the existing decision.
- **CHANGE RECOMMENDED** — evidence supports a specific change; target/rationale noted.
- **NO CHANGE** — reviewed and existing implementation remains best.
- **NEEDS MORE EVIDENCE** — evidence incomplete; no routing change until it isn't.

Funnel stages used below: **TOFU** (symptom/informational research, not ready to book),
**MOFU** (condition/service exploration, comparing options), **BOFU** (local/commercial —
actively looking for a chiropractor to book), **CONVERSION** (the booking/contact action itself).

---

## English (en)

| Cluster                                                | Search intent                                                                                                          | Target page family                                                            | Funnel    | Evidence source      | Label                                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------- | -------------------- | ----------------------------------------------------------------------------- |
| car accident chiropractor / auto accident chiropractor | Commercial, Local, Transactional (2,900–3,300 vol, KD0–26)                                                             | `/car-accident-chiropractor`                                                  | BOFU      | Part 1               | VALIDATED                                                                     |
| back pain after car accident                           | Informational/publisher SERP (1,000 vol, KD1) — AI Overview + injury-clinic/law-firm blogs, zero Local Pack            | Covered as a subsection of `/car-accident-chiropractor`, not a dedicated page | TOFU      | Part 2 SERP          | VALIDATED (routing)                                                           |
| back pain after car accident — blog opportunity        | Same query, editorial framing                                                                                          | `/blog` article (guide/how-to format)                                         | TOFU      | Part 2 SERP          | CHANGE RECOMMENDED — new blog article, not a page-architecture change         |
| headache after car accident (literal phrase)           | Informational/publisher SERP (800 vol, KD5, $10 CPC) — zero Local Pack, zero chiropractor-branded result               | Not a realistic target for `/conditions/cervicogenic-headache`                | TOFU      | Part 2 SERP          | CHANGE RECOMMENDED — stop targeting this literal phrase from that page        |
| tmj chiropractor / chiropractor for headaches          | Commercial (900/KD0, 300/KD2)                                                                                          | `/conditions/cervicogenic-headache`'s real winnable target                    | BOFU      | Part 1               | VALIDATED                                                                     |
| should i see a chiropractor after a car accident       | Informational (200 vol) — small chiropractic-practice blogs already win this SERP                                      | `/blog` article                                                               | TOFU      | Part 2 SERP          | CHANGE RECOMMENDED                                                            |
| who pays for chiropractor after accident               | Informational (250 vol) — legal/insurance-aggregator-dominated                                                         | `/blog` article, lower priority                                               | TOFU      | Part 2 SERP          | CHANGE RECOMMENDED, lower priority                                            |
| sciatica chiropractor                                  | Commercial, Local (3,400 vol, KD0) — Local Pack present, a DR1 local chiropractor's service page ranks position 5      | `/conditions/sciatica` — strengthen priority/metadata/depth/internal links    | BOFU      | Part 1 + Part 2 SERP | VALIDATED (routing); CHANGE RECOMMENDED (strengthen, do not create a new URL) |
| whiplash chiropractor                                  | Commercial (250/KD0) vs. whiplash symptoms (7.9K, informational-only)                                                  | `/conditions/whiplash`                                                        | BOFU      | Part 1               | VALIDATED                                                                     |
| chiropractor for neck pain                             | Commercial (600/KD4) vs. neck pain relief (95K, informational-only)                                                    | `/conditions/neck-pain`                                                       | BOFU      | Part 1               | VALIDATED                                                                     |
| chiropractic adjustment                                | Commercial (6,700/KD9)                                                                                                 | Services hub                                                                  | MOFU/BOFU | Part 1               | VALIDATED                                                                     |
| chiropractor deerfield beach                           | Commercial, hyper-local (150 vol US; "near me" variant KD57 reflects Local-Pack/GBP dominance, not content difficulty) | Homepage                                                                      | BOFU      | Part 1               | VALIDATED                                                                     |

---

## Spanish (es) — US-targeted, replaces the Spain-contaminated August pull

| Cluster                   | Volume (US)                    | KD  | Intent                             | Target page family                                                                          | Funnel    | Evidence source            | Label                                                                             |
| ------------------------- | ------------------------------ | --- | ---------------------------------- | ------------------------------------------------------------------------------------------- | --------- | -------------------------- | --------------------------------------------------------------------------------- |
| quiropráctico cerca de mí | 600 (was 20 in the Spain pull) | 55  | Informational, Commercial, Local   | `/es` home + service pages                                                                  | BOFU      | Part 2 (corrected US pull) | CHANGE RECOMMENDED — use the corrected 600 figure everywhere the old 20 was cited |
| dolor de espalda          | 4,900                          | 9   | Informational, Non-local           | Not a dedicated ES condition page (none built yet)                                          | TOFU      | Part 2                     | VALIDATED (no chase)                                                              |
| ciática                   | 3,900                          | 15  | Informational, Non-local           | Same — informational only                                                                   | TOFU      | Part 2                     | VALIDATED (no chase)                                                              |
| dolor de cuello           | 900                            | 7   | Informational, Non-local           | Same                                                                                        | TOFU      | Part 2                     | VALIDATED (no chase)                                                              |
| accidente automovilístico | 400                            | 7   | Informational, Non-local ($20 CPC) | `/es/quiropractico-accidentes-de-auto` covers the topic, not a dedicated informational page | TOFU/BOFU | Part 2                     | VALIDATED                                                                         |
| latigazo cervical         | 350                            | 0   | Informational, Non-local           | Covered within the accident page                                                            | TOFU      | Part 2                     | VALIDATED                                                                         |

**Note:** the matching/related-terms expansion for this cluster picked up English-language noise
(car crash, traffic collision, etc.) — only the seed-term Overview numbers above are trusted
evidence; the expanded list needs manual filtering before any future use.

---

## Brazilian Portuguese (pt-BR)

| Cluster                                       | Volume                                                        | KD  | CPC    | Intent                                                                                                                   | Target page family                                                                                                                                                  | Funnel    | Evidence source                                                    | Label                                      |
| --------------------------------------------- | ------------------------------------------------------------- | --- | ------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------ | ------------------------------------------ |
| quiropraxia                                   | 500                                                           | 1   | $1.40  | Informational, Commercial, Local                                                                                         | `/pt` home + services hub (the head noun for the discipline itself, distinct from "quiroprático," the person)                                                       | BOFU      | Part 3                                                             | **CHANGE RECOMMENDED**                     |
| quiropraxia near me                           | 150                                                           | 38  | $2.50  | Informational, Commercial, Local (English-language code-mixed into a PT-seeded search)                                   | `/pt` home / services hub                                                                                                                                           | BOFU      | Part 3                                                             | CHANGE RECOMMENDED (same cluster as above) |
| quiropraxia cerca de mi                       | 80                                                            | 50  | $1.40  | Informational, Commercial, Local (Spanish-language code-mixed into a PT-seeded search)                                   | `/pt` home / services hub                                                                                                                                           | BOFU      | Part 3                                                             | CHANGE RECOMMENDED (same cluster as above) |
| acidente de carro                             | 100                                                           | 0   | $25.00 | Informational, Non-local (100% local-news/legal/dream-interpretation SERP — zero chiropractor presence, zero Local Pack) | `/pt/quiropratico-acidentes-de-carro` covers the topic via answer-first content, not as a literal-phrase target                                                     | TOFU/BOFU | Part 3 SERP                                                        | VALIDATED (no chase)                       |
| torcicolo                                     | 250                                                           | 0   | $0.09  | Informational, Non-local (AI-Overview-led Brazilian health-publisher SERP, zero Local Pack)                              | Covered within the accident page's answer blocks (torcicolo = the validated symptom term already used in `/pt/quiropratico-acidentes-de-carro`'s title/description) | TOFU      | Part 3 SERP                                                        | VALIDATED (no chase)                       |
| dor nas costas                                | 250                                                           | 5   | $0.06  | Informational, Non-local (same AI-Overview/publisher pattern as torcicolo)                                               | Covered informationally; no dedicated PT condition page yet                                                                                                         | TOFU      | Part 3 SERP                                                        | VALIDATED (no chase)                       |
| dor lombar                                    | 150                                                           | 0   | $0.30  | Informational, Non-local                                                                                                 | Same                                                                                                                                                                | TOFU      | Part 2 (SERP not separately pulled)                                | NEEDS MORE EVIDENCE                        |
| dor no pescoço                                | 100                                                           | 2   | –      | Informational, Non-local                                                                                                 | Same                                                                                                                                                                | TOFU      | Part 2                                                             | NEEDS MORE EVIDENCE                        |
| dor ciática                                   | 20                                                            | 5   | –      | Informational, Non-local                                                                                                 | Same                                                                                                                                                                | TOFU      | Part 2                                                             | NEEDS MORE EVIDENCE                        |
| quiroprático deerfield beach                  | `VOLUME UNVERIFIED`                                           | –   | –      | –                                                                                                                        | `/pt` home                                                                                                                                                          | BOFU      | Part 3 (confirmed "No data for this keyword" by direct screenshot) | NEEDS MORE EVIDENCE                        |
| quiroprático perto de mim ("near me")         | `VOLUME UNVERIFIED`                                           | –   | –      | –                                                                                                                        | `/pt` home / services hub                                                                                                                                           | BOFU      | Part 3 (confirmed "No data" by direct screenshot)                  | NEEDS MORE EVIDENCE                        |
| ajuste quiroprático                           | `VOLUME UNVERIFIED` (Global vol 30, blank in every US column) | –   | –      | –                                                                                                                        | Services hub (future PT-BR services page)                                                                                                                           | BOFU      | Part 3 (below Ahrefs' US measurement floor)                        | NEEDS MORE EVIDENCE                        |
| primeira consulta quiroprático                | `VOLUME UNVERIFIED` (fully blank, no Global vol either)       | –   | –      | –                                                                                                                        | `/pt/solicitar-consulta`                                                                                                                                            | BOFU      | Part 3 (below Ahrefs' US measurement floor)                        | NEEDS MORE EVIDENCE                        |
| quiroprático para/depois de acidente de carro | `VOLUME UNVERIFIED`                                           | –   | –      | –                                                                                                                        | `/pt/quiropratico-acidentes-de-carro`                                                                                                                               | BOFU      | Part 2 (zeroed out in this pull)                                   | NEEDS MORE EVIDENCE                        |

**Updated 2026-09-06 (Part 3):** the August/September pull's "dor" homophone-matching bug is
confirmed fixed by multi-word seeding — "quiropraxia" (the actual PT-BR noun for the discipline,
not "quiroprático," the person) returned a clean, usable Matching Terms expansion with a real
Local Pack on its own SERP, the same "informational leads, local business listings still get
real placement" pattern that validated "sciatica chiropractor" in Part 2. This is the first
PT-BR local-commercial term with real evidence behind it — implementation (working "quiropraxia"
into `/pt` supporting copy and a future services-hub pass) is deferred to whichever ticket next
touches `content/pt/pages.ts`, not actioned by this evidence file. The accident/symptom seed
terms' own SERPs were also checked directly: "acidente de carro" is dominated by Brazilian local
news and legal/dream-interpretation content with zero chiropractor presence, and "torcicolo"/
"dor nas costas" are AI-Overview-led Brazilian health-publisher SERPs with no Local Pack —
confirming ATS-SEO-135's original decision to treat these as supporting symptom-language, not
page-level targets, is correct. What's still genuinely unresolved: direct "near me"/Deerfield
Beach local terms remain confirmed zero-data (screenshotted, not inferred), and the
adjustments/first-visit cluster ("ajuste quiroprático," "primeira consulta quiroprático") is
below Ahrefs' measurement floor for this market. See
`SEO_QA_EVIDENCE/ahrefs-2026-09/synthesis-part2-and-final-labels.md`'s "Part 3" section for the
full SERP-level detail behind every row above.

---

## Haitian Creole (ht)

| Cluster                              | Volume                                                       | Intent | Target page family                                          | Funnel    | Evidence source                            | Label                                               |
| ------------------------------------ | ------------------------------------------------------------ | ------ | ----------------------------------------------------------- | --------- | ------------------------------------------ | --------------------------------------------------- |
| aksidan machin                       | `VOLUME UNVERIFIED` (sparse single-digit monthly trend only) | –      | `/ht/kiwoprate-pou-aksidan-machin`                          | TOFU/BOFU | Part 2 + Part 3 (re-confirmed)             | NEEDS MORE EVIDENCE — documented tooling limitation |
| chiropraktè aksidan machin           | `VOLUME UNVERIFIED`                                          | –      | Same                                                        | BOFU      | Part 2                                     | NEEDS MORE EVIDENCE                                 |
| chiropraktè deerfield beach          | `VOLUME UNVERIFIED`                                          | –      | `/ht` home                                                  | BOFU      | Part 3 (confirmed "No data" by screenshot) | NEEDS MORE EVIDENCE                                 |
| chiropraktè tou pre mwen ("near me") | `VOLUME UNVERIFIED`                                          | –      | `/ht` home / services hub                                   | BOFU      | Part 3 (confirmed "No data" by screenshot) | NEEDS MORE EVIDENCE                                 |
| premye vizit kiwopratè (first visit) | `VOLUME UNVERIFIED`                                          | –      | `/ht/mande-yon-randevou`                                    | BOFU      | Part 3 (confirmed "No data" by screenshot) | NEEDS MORE EVIDENCE                                 |
| doulè do (back pain)                 | `VOLUME UNVERIFIED`                                          | –      | Covered informationally; no dedicated HT condition page yet | TOFU      | Part 3 (confirmed "No data" by screenshot) | NEEDS MORE EVIDENCE                                 |
| doulè nan kou (neck pain)            | `VOLUME UNVERIFIED`                                          | –      | Same                                                        | TOFU      | Part 2 (not re-checked in Part 3)          | NEEDS MORE EVIDENCE                                 |

**This is a documented tooling gap, not evidence of absent demand** (Part 2's own conclusion,
carried into `content/ht/seo.ts`'s header comment, and re-confirmed independently in Part 3 —
2026-09-06 — via direct Keywords Explorer screenshots for 4 of the 6 terms above rather than
only a bulk export). Ahrefs has essentially no Haitian Creole index coverage for this space; the
matching-terms expansion (898 terms in Part 2, still noise-dominated when re-checked for
"aksidan machin" alone in Part 3) is not usable. The `/ht/` build-out's justification today is
demographic (Broward/Palm Beach County's Haitian Creole-speaking population, per US Census/ACS
language-spoken-at-home data — cited as a legitimate substitute signal in Part 2), not search
volume. Recommended next steps before any HT routing decision, none executed yet: native-speaker
review of the seed terms themselves (spelling/phrasing variance in Kreyòl is real and
Ahrefs/Trends may have data under a different spelling — this includes finding the right Kreyòl
phrasing for a sciatica-equivalent and an adjustments/services cluster, neither of which has been
submitted to Ahrefs in any form yet), a Google Trends cross-check, and — after launch — real
Search Console query data, which is the first genuinely first-party signal this locale will have.
Code-switching behavior (Haitian Creole queries mixing English or French terms) could still not
be inspected because no real SERP data exists yet to inspect it in; revisit once either Search
Console or a native-speaker-reviewed re-pull produces real queries to check. See
`SEO_QA_EVIDENCE/ahrefs-2026-09/synthesis-part2-and-final-labels.md`'s "Part 3" section for the
full detail.

---

## Cross-cutting rules this map follows (per this ticket's "standing ATS keyword-routing rule")

1. No target was chosen from raw volume alone — every BOFU/commercial target above is
   distinguished from its much-larger TOFU/informational neighbor explicitly (e.g., "dolor de
   espalda" 4,900 vs. "quiropráctico cerca de mí" 600 — the smaller number is the real target).
2. Every `NEEDS MORE EVIDENCE` row stays `NEEDS MORE EVIDENCE` here — none were promoted to a
   routing decision to fill out this table.
3. No new PT-BR/HT city or condition pages are proposed anywhere in this map — ATS-SEO-135/136
   deliberately built only the 9 published-parity page families in each language precisely to
   avoid multiplying thin four-language doorway pages (see `content/pt/seo.ts`/`content/ht/seo.ts`
   header comments).
4. Every TOFU "blog article opportunity" row is an editorial content recommendation, not a
   page-architecture change — implementing any of them is a separate, future ticket referencing
   this map, not something this document authorizes on its own.
