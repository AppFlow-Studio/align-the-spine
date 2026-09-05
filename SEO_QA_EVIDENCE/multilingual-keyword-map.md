# Multilingual Keyword Map — EN / ES / PT-BR / HT

ATS-SEO-142 deliverable: "a multilingual keyword map with locale, cluster, intent, target page
family, funnel, and evidence source." Synthesizes the already-completed research in
`SEO_QA_EVIDENCE/ahrefs-2026-08/keyword-evidence-synthesis.md` (Part 1: Keywords Explorer) and
`SEO_QA_EVIDENCE/ahrefs-2026-09/synthesis-part2-and-final-labels.md` (Part 2: SERP Overview,
corrected US Spanish, PT-BR, HT) into the single-table format this ticket asks for. **This file
adds no new numbers** — every metric below is copied from those two source documents; where they
say a metric doesn't exist, this map says `VOLUME UNVERIFIED`, not an estimate.

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

| Cluster                                       | Volume              | KD  | CPC    | Intent                                                                     | Target page family                                                                                                                                                  | Funnel    | Evidence source                  | Label                                                                          |
| --------------------------------------------- | ------------------- | --- | ------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------- | ------------------------------------------------------------------------------ |
| acidente de carro                             | 100                 | 0   | $25.00 | Informational, Non-local (but high CPC — real commercial value per search) | `/pt/quiropratico-acidentes-de-carro`                                                                                                                               | TOFU/BOFU | Part 2                           | NEEDS MORE EVIDENCE — thin seed, high-CPC signal noted, not yet SERP-validated |
| torcicolo                                     | 250                 | 0   | $0.09  | Informational, Non-local                                                   | Covered within the accident page's answer blocks (torcicolo = the validated symptom term already used in `/pt/quiropratico-acidentes-de-carro`'s title/description) | TOFU      | Part 2                           | NEEDS MORE EVIDENCE                                                            |
| dor nas costas                                | 250                 | 5   | $0.06  | Informational, Non-local                                                   | Covered informationally; no dedicated PT condition page yet                                                                                                         | TOFU      | Part 2                           | NEEDS MORE EVIDENCE                                                            |
| dor lombar                                    | 150                 | 0   | $0.30  | Informational, Non-local                                                   | Same                                                                                                                                                                | TOFU      | Part 2                           | NEEDS MORE EVIDENCE                                                            |
| dor no pescoço                                | 100                 | 2   | –      | Informational, Non-local                                                   | Same                                                                                                                                                                | TOFU      | Part 2                           | NEEDS MORE EVIDENCE                                                            |
| dor ciática                                   | 20                  | 5   | –      | Informational, Non-local                                                   | Same                                                                                                                                                                | TOFU      | Part 2                           | NEEDS MORE EVIDENCE                                                            |
| quiroprático deerfield beach                  | `VOLUME UNVERIFIED` | –   | –      | –                                                                          | `/pt` home                                                                                                                                                          | BOFU      | Part 2 (zeroed out in this pull) | NEEDS MORE EVIDENCE                                                            |
| quiroprático perto de mim ("near me")         | `VOLUME UNVERIFIED` | –   | –      | –                                                                          | `/pt` home / services hub                                                                                                                                           | BOFU      | Part 2 (zeroed out in this pull) | NEEDS MORE EVIDENCE                                                            |
| quiroprático para/depois de acidente de carro | `VOLUME UNVERIFIED` | –   | –      | –                                                                          | `/pt/quiropratico-acidentes-de-carro`                                                                                                                               | BOFU      | Part 2 (zeroed out in this pull) | NEEDS MORE EVIDENCE                                                            |

**Standing recommendation carried into ATS-SEO-135's implementation** (see `content/pt/seo.ts`'s
header comment): with local/commercial "near me" and accident-specific terms all showing
`VOLUME UNVERIFIED` in Ahrefs, `/pt` page titles/descriptions target the plain everyday terms a
Brazilian Portuguese speaker would actually type (informed by the seed data that IS real —
"acidente de carro," "torcicolo," "dor nas costas," "dor lombar") rather than an SEO-optimized
keyword set that has no evidence behind it yet. A second Ahrefs pull with longer, multi-word
seeds (avoiding the "dor" homophone-matching bug documented in Part 2) is the next step before
any PT-BR routing decision is finalized — not a page-architecture change today.

---

## Haitian Creole (ht)

| Cluster                              | Volume              | Intent | Target page family                                          | Funnel    | Evidence source                            | Label                                               |
| ------------------------------------ | ------------------- | ------ | ----------------------------------------------------------- | --------- | ------------------------------------------ | --------------------------------------------------- |
| aksidan machin                       | `VOLUME UNVERIFIED` | –      | `/ht/kiwoprate-pou-aksidan-machin`                          | TOFU/BOFU | Part 2 (zero measurable data, all 6 seeds) | NEEDS MORE EVIDENCE — documented tooling limitation |
| chiropraktè aksidan machin           | `VOLUME UNVERIFIED` | –      | Same                                                        | BOFU      | Part 2                                     | NEEDS MORE EVIDENCE                                 |
| chiropraktè deerfield beach          | `VOLUME UNVERIFIED` | –      | `/ht` home                                                  | BOFU      | Part 2                                     | NEEDS MORE EVIDENCE                                 |
| chiropraktè tou pre mwen ("near me") | `VOLUME UNVERIFIED` | –      | `/ht` home / services hub                                   | BOFU      | Part 2                                     | NEEDS MORE EVIDENCE                                 |
| doulè do (back pain)                 | `VOLUME UNVERIFIED` | –      | Covered informationally; no dedicated HT condition page yet | TOFU      | Part 2                                     | NEEDS MORE EVIDENCE                                 |
| doulè nan kou (neck pain)            | `VOLUME UNVERIFIED` | –      | Same                                                        | TOFU      | Part 2                                     | NEEDS MORE EVIDENCE                                 |

**This is a documented tooling gap, not evidence of absent demand** (Part 2's own conclusion,
carried into `content/ht/seo.ts`'s header comment). Ahrefs has essentially no Haitian Creole
index coverage for this space; the matching-terms expansion (898 terms) was dominated by
unrelated English noise and is not usable. The `/ht/` build-out's justification today is
demographic (Broward/Palm Beach County's Haitian Creole-speaking population, per US Census/ACS
language-spoken-at-home data — cited as a legitimate substitute signal in Part 2), not search
volume. Recommended next steps before any HT routing decision: native-speaker review of the seed
terms themselves (spelling/phrasing variance in Kreyòl is real and Ahrefs/Trends may have data
under a different spelling), a Google Trends cross-check, and — after launch — real Search
Console query data, which is the first genuinely first-party signal this locale will have.
Code-switching behavior (Haitian Creole queries mixing English or French terms) could not be
inspected because no real SERP data exists yet to inspect it in; revisit once either Search
Console or a native-speaker-reviewed re-pull produces real queries to check.

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
