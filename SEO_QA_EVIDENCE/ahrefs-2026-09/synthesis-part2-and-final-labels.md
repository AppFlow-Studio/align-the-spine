# Ahrefs Evidence Synthesis — Part 2 (SERP Overview) + Corrected Spanish/PT-BR/HT — 2026-09

Builds on `SEO_QA_EVIDENCE/ahrefs-2026-08/keyword-evidence-synthesis.md` (Part 1: Keywords
Explorer volume/KD/intent). This is Part 2: SERP Overview for the 5 flagged queries, the
corrected US-targeted Spanish pull, and new PT-BR/HT clusters. Ends with the labeled final table
requested before any `ATS-SEO-004` update.

**Source files:** `PART-2-serp-overview/*.csv` (SERP Overview, US), `spanish-us/*.csv` (Keywords
Explorer, US — replaces the Spain-contaminated August pull), `pt-br/*.csv`, `ht/*.csv`.

---

## Part 2: SERP Overview — the 5 flagged queries

### 1. "back pain after car accident" (vol 1,000, KD1)

Top of SERP: AI Overview citing 4 sources — 3 injury/pain-clinic blogs (painspinetexas.com,
nexgenmedicalcenters.com, vertexpainphysicians.com) and 1 personal-injury law firm
(romanowlawgroup.com). Below that: **zero Local Pack**, a "People also ask" box, then organic
positions 2–10 are entirely long-form blog/guide articles from injury clinics and one more law
firm (Lipton Law). No chiropractor-branded result anywhere in the top 10. No local business of
any kind.

**Read:** Purely informational/publisher SERP. A commercial page — ours or anyone's — is not
what ranks here; long-form educational content is. This is not a page a local chiropractic
practice can realistically compete for as a commercial landing page.

**Routing implication:** The existing architecture already keeps this off a dedicated
commercial page (folded into `/car-accident-chiropractor` as a covered topic, not a standalone
target) — **VALIDATED**, that's the right call. The KD1/1,000-volume opportunity is real but
belongs to a `/blog` article written in the same guide/how-to format the SERP rewards, not to
the commercial hub. **CHANGE RECOMMENDED**: write this as a blog article (not a page-architecture
change — an editorial content item).

### 2. "headache after car accident" (vol 800, KD5, $10 CPC)

AI Overview citing 2 injury-clinic blogs. Position 2 is an NCBI/PMC medical-research paper
(DR95). "People also ask" box. Positions 4–10: injury/pain-clinic blogs (Florida Physical
Medicine, La Clinica SC, Expert Pain Care), one more auto-injury-law firm
(michiganautolaw.com). **Zero Local Pack. Zero chiropractor-branded result.**

**Read:** Same pattern as #1 — informational, publisher-dominated, no local-commercial
presence at all.

**Routing implication:** ATS-SEO-004 currently routes "headaches after accident" to
`/conditions/cervicogenic-headache` (a commercial condition page). **CHANGE RECOMMENDED**: this
literal phrase is not winnable by that commercial page — the condition page's real, winnable
target is the smaller commercial slice already validated in Part 1 ("tmj chiropractor" 900/KD0,
"chiropractor for headaches" 300/KD2), not this literal informational phrase. Treat "headache
after car accident" itself as a blog-article candidate, same as #1, and stop expecting the
condition page to rank for it directly.

### 3. "sciatica chiropractor" (vol 3,400, KD0) — the standout finding, now confirmed

**Local Pack is present** — 3 real local chiropractic business listings (The Joint Chiropractic,
Auxoma, Greenleaf Chiropractic). Below that: Healthline (DR92, a big publisher) and Alliance
Ortho at positions 3–4, but then **positions 5, 8, and 9 are small local chiropractors' own
service/blog pages** — most notably `mywichitachiro.com/conditions-treated/sciatica/`, a
**Landing > Service page at Domain Rating 1**, ranking position 5. Also `vranachiropractic.com`
(DR0) and `victoryspinecenter.com` (DR3), both real small chiropractic practices.

**Read:** This is exactly the confirmation needed before touching anything. A Local Pack exists
for this query pattern (local businesses get real placement), and — more importantly — a
practically brand-new, zero-authority local chiropractor's own condition-service page (DR1) ranks
organically in the top 5. That is about as strong a "a page like ours can compete here" signal as
SERP Overview can produce.

**Label: VALIDATED.** Per your instruction, this is now grounds to strengthen
`/conditions/sciatica`'s priority, metadata, content depth, internal linking, and supporting
topical coverage — not to create any new page or restructure anything, just to invest more in the
page that already owns this intent.

### 4. "should i see a chiropractor after a car accident" (vol 200, informational tag)

No AI Overview, no Local Pack. Top result is **an actual chiropractic clinic's own blog post**
(hoganchiropractic.com, DR12). Positions 3–4 are also real chiropractic-practice blogs
(presencechirokc.com, gouldcooksey.com). Positions 5–10 mix in 2 more law-firm blogs and a couple
more small clinics.

**Read:** Different from #1/#2 — this query is won substantially by small chiropractic
practices' own blog content, not big publishers or law firms. A realistic target for our own
blog.

**Routing implication:** **CHANGE RECOMMENDED** — same as #1/#2, write this as a blog article.
Stronger candidate than #1/#2 specifically because the SERP shows chiropractic-clinic content
(our exact category) already winning here, not just generic injury clinics.

### 5. "who pays for chiropractor after accident" (vol 250, informational tag)

Position 1 is a **law firm FAQ page** (benglasslaw.com). Positions 2–3 are legal Q&A aggregators
(JustAnswer, Reddit, Avvo). Mixed in lower down: one small chiropractor's blog
(charlottechironc.com, DR19, position 7) and 2 more injury-clinic chains.

**Read:** More legal/insurance-aggregator-saturated than #4 — this is fundamentally a payment/
insurance question, and attorneys and Q&A sites own more of the top of this SERP than clinics do.
Not impossible (one small chiropractor blog does crack the top 10), just a harder, lower-priority
target.

**Routing implication:** **CHANGE RECOMMENDED, lower priority** — still a legitimate blog-article
candidate (the existing content already has good, appropriately-hedged material on this exact
topic per the accident-page FAQ), but don't expect it to be a top performer given how much legal
content already occupies this SERP.

---

## Corrected Spanish pull (country = United States)

The August pull's country=ES contamination is now fixed. Real US-targeted numbers:

| Keyword                       | Volume (US) | Volume (ES, Aug pull) | KD  | Intent                             |
| ----------------------------- | ----------- | --------------------- | --- | ---------------------------------- |
| dolor de espalda              | 4,900       | 8,700                 | 9   | Informational, Non-local           |
| ciática                       | 3,900       | 3,800                 | 15  | Informational, Non-local           |
| dolor de cuello               | 900         | 2,600                 | 7   | Informational, Non-local           |
| **quiropráctico cerca de mí** | **600**     | 20                    | 55  | Info, **Commercial, Local**        |
| accidente automovilístico     | 400         | 150                   | 7   | Informational, Non-local ($20 CPC) |
| latigazo cervical             | 350         | 3,000                 | 0   | Informational, Non-local           |

**The single most important correction**: "quiropráctico cerca de mí" — the direct Spanish
"near me" commercial term — jumps from **20 volume (Spain-contaminated)** to **600 volume (real
US)**, a 30x difference, and is genuinely Commercial+Local intent. The Spain data was directionally
wrong in a way that would have badly undersold the Spanish local-commercial opportunity. **This
alone justifies never using country=ES data for ATS decisions**, exactly as instructed.

Everything else follows the same pattern as the English clusters: large informational symptom
volume (dolor de espalda, ciática) that isn't a local-commercial target, next to a smaller real
commercial term. Same shape, real numbers now.

The broader matching-terms/related-terms expansion for this cluster picked up significant
English-language noise (car crash, traffic collision, motorcycle accident today — generic
English accident queries bleeding into a Spanish-seeded pull). Treat the SEED overview numbers
above as the reliable evidence; the expanded-terms list needs manual filtering before use.

**Label: VALIDATED** (replaces the August Spain-contaminated numbers as the record for Spanish
local-commercial intent).

---

## Brazilian Portuguese (pt-BR)

| Keyword                                       | Volume | KD  | CPC        | Intent                   |
| --------------------------------------------- | ------ | --- | ---------- | ------------------------ |
| torcicolo                                     | 250    | 0   | $0.09      | Informational, Non-local |
| dor nas costas                                | 250    | 5   | $0.06      | Informational, Non-local |
| dor lombar                                    | 150    | 0   | $0.30      | Informational, Non-local |
| acidente de carro                             | 100    | 0   | **$25.00** | Informational, Non-local |
| dor no pescoço                                | 100    | 2   | –          | Informational, Non-local |
| dor ciática                                   | 20     | 5   | –          | Informational, Non-local |
| quiroprático deerfield beach                  | 0      | –   | –          | –                        |
| quiroprático perto de mim                     | 0      | –   | –          | –                        |
| quiroprático para/depois de acidente de carro | 0      | –   | –          | –                        |

**⚠️ Data-quality flag:** the matching-terms/related-terms expansion for this cluster is
**not usable** — Ahrefs matched the short Portuguese word "dor" (pain) against unrelated English
homophones (Doritos, Doris Day, Dorian Gray, "double" — literally thousands of irrelevant rows).
Of 6,010 expanded terms, only 332 had any volume, and the visible top ones are almost entirely
this noise. The **6 seed terms above are still valid** (direct Keywords Explorer lookups,
unaffected by the expansion bug) — just don't trust the expanded vocabulary list from this pull.

**Read:** No direct "near me"/local-commercial term shows measurable volume yet (all three
zeroed out). "acidente de carro" carries a real $25 CPC despite only 100 volume — a strong
signal of commercial value per search even though the raw volume is low. The symptom terms
(torcicolo, dor nas costas, dor lombar) show the same low-but-real pattern as Haitian Creole's
neighbor language would be expected to.

**Label: NEEDS MORE EVIDENCE.** The seed data is real but thin, and the vocabulary-expansion step
needs to be re-run with longer, unambiguous multi-word seeds (e.g., start from "dor nas costas"
and "dor no pescoço" as the base terms for Matching Terms specifically, not the bare word "dor")
before drawing conclusions about page-level PT-BR strategy. Recommend a second, more targeted
pull before ATS-SEO-142 (PT-BR/HT keyword map ticket) finalizes anything.

---

## Haitian Creole (ht)

All 6 seed terms returned **zero measurable Ahrefs data** — no volume, KD, or CPC for any of
them:

```
aksidan machin · chiropraktè aksidan machin · chiropraktè deerfield beach ·
chiropraktè tou pre mwen · doulè do · doulè nan kou
```

The matching-terms expansion (898 unique terms) is similarly unusable — dominated by unrelated
English noise (double dominoes, "double jaw surgery cost," generic "chiropractic machine"/
"chiropractic activator gun" queries with no connection to Haitian Creole search behavior).

**This is exactly the evidence-limitation case flagged in advance, not a finding of "no
demand."** Ahrefs' keyword database has essentially no Haitian Creole coverage for this space.
South Florida has a substantial Haitian Creole-speaking population (Broward/Palm Beach County
specifically), so the realistic read is a **tooling gap**, not an absent market.

**Label: NEEDS MORE EVIDENCE — documented tooling limitation, not a negative finding.**
Recommend for ATS-SEO-142/ATS-SEO-136 (Haitian Creole `/ht/` implementation):

1. Do not size the Haitian Creole opportunity off Ahrefs volume — it isn't measurable here.
2. Get native-speaker review of the seed terms themselves (transliteration/phrasing variance in
   Haitian Creole is real, and a slightly different spelling might surface real Google Trends or
   Ahrefs data where these exact strings don't).
3. Consider Google Trends and/or Google Ads Keyword Planner as a cross-check — different
   underlying data sources than Ahrefs' own crawl-based index, more likely to have some signal
   for a smaller/regional language market.
4. Treat US Census/ACS language-spoken-at-home data for Broward/Palm Beach County as a legitimate
   substitute demand signal when search-volume tools are silent — that's a defensible way to
   justify the `/ht/` build-out on demographic grounds even without keyword volume, worth stating
   explicitly in ATS-SEO-142 rather than leaving the page's existence unjustified.

---

## Part 3 (2026-09-06) — the follow-up pull this section itself recommended

**Source files:** `SEO_QA_EVIDENCE/ahrefs-2026-09/06-09-26/*/` — one subfolder per keyword, each
holding whatever export types Ahrefs actually returned for that term (Overview, Matching terms,
Related terms, Search suggestions, SERP overview where available) plus a screenshot for every
term that came back with zero data, so a "no data" claim below is never taken on faith.

This directly answers the "re-pull with longer, unambiguous multi-word seeds" and "pull SERP
Overview for material routing/priority decisions" asks above.

### PT-BR: the "dor" homophone bug is gone, and one term newly clears the local-commercial bar

The August pull's seed terms were re-verified (same numbers: torcicolo 250/KD0, dor nas costas
250/KD5, dor lombar 150/KD0, acidente de carro 100/KD0/$25 CPC, dor no pescoço 100/KD2, dor
ciática 20/KD5) — nothing changed there, this is a consistency check, not new information.

**What's new:**

- **"quiropraxia" (500 vol, KD1, $1.40 CPC, Informational+Commercial+Local intent) — Matching
  Terms is now clean.** Multi-word seeding (starting from "quiropraxia" itself, an actual PT-BR
  noun, rather than the bare word "dor") avoided the homophone bug entirely — no Doritos/Doris
  Day noise this time. It surfaced two real local-commercial variants Ahrefs had never returned
  for this cluster before:
  - **"quiropraxia near me" — 150 vol, KD38**, English-language local intent mixed into a
    Portuguese-seeded search (real code-mixing behavior, not a data error — flagged per this
    ticket's "account for code-switching" instruction, applied here to the language it actually
    showed up for).
  - **"quiropraxia cerca de mi" — 80 vol, KD50**, Spanish-language local intent under the same
    Portuguese seed — a second, different code-mixing pattern (a Portuguese speaker's query
    picking up Spanish "near me" phrasing, plausible in South Florida's mixed-language market).
  - Related Terms confirmed "quiropraxia" sits in the same broad cluster as "chiropractic"/
    "chiropractic adjustment"/"chiropractic care" (20K/7.1K/7K vol) — informational/English
    halo terms, not new PT-BR targets themselves, same "large informational neighbor, smaller
    real target" pattern the English/Spanish clusters already showed.
  - **SERP Overview for "quiropraxia" shows a real Local Pack** (Jordan Chiropractic & Acupuncture,
    West Chiropractic) at position 2, immediately below an AI Overview citing Wikipedia/Mayo
    Clinic/MedlinePlus — i.e., informational sources own the very top, but a Local Pack still
    renders directly beneath it. That is the same shape as the validated "sciatica chiropractor"
    finding: informational content leads, but local business listings get real placement on the
    same SERP.
  - **Label: CHANGE RECOMMENDED.** "Quiropraxia" (not "quiroprático," which is the person/job
    title already used in `content/pt/seo.ts`'s titles) is the validated PT-BR head noun for the
    practice/discipline itself and belongs in `/pt`'s supporting copy and in a future PT-BR
    services-hub optimization pass — implementation deferred to whichever ticket next touches
    `content/pt/seo.ts`/`content/pt/pages.ts`, not actioned inside this evidence file.

- **"acidente de carro" SERP Overview: zero chiropractor presence, zero Local Pack.** Every
  organic result and every "Top stories" card is Brazilian local-news coverage of actual car
  crashes (Catve, Rádio Rural, Marechal News, etc.) or the Portuguese Wikipedia article on traffic
  accidents — not a single injury-clinic, chiropractor, or law-firm result anywhere in the visible
  rows. Matching/Related Terms confirm the same pattern outward: "abogado de acidente de carro"/
  "advogado de acidente de carro" (Spanish/Portuguese personal-injury-law terms, 70-100 vol) and
  "sonhar com acidente de carro" ("dreaming about a car accident" — a psychology/dream-interpretation
  query, 40 vol) sit in the same cluster. **Label: VALIDATED (no chase).** The $25 CPC is real
  advertiser value per click, but the organic SERP itself is news/legal/dream-interpretation
  content, not a page type `/pt/quiropratico-acidentes-de-carro` should try to rank for on this
  literal phrase — the existing page's own PT-BR-specific answer-first content (torcicolo, dor
  nas costas as the validated symptom terms already used in its title/description) remains the
  right target, unchanged from ATS-SEO-135's original approach.

- **"torcicolo" and "dor nas costas" SERP Overview: both are AI-Overview-led, Brazilian
  health-publisher SERPs** (Tua Saúde, Rede D'Or, Mayo Clinic's PT edition, CUF, Lusíadas Saúde —
  all real Brazilian/Portuguese medical-publisher domains) — **zero Local Pack on either.** Same
  informational/publisher pattern the English "back pain after car accident"/"headache after car
  accident" SERPs showed in Part 2. **Label: VALIDATED (no chase as a commercial target)** —
  these two terms stay exactly where ATS-SEO-135 already put them: supporting symptom-language
  inside the existing PT-BR pages' answer-first content, not a target for a dedicated new page.
  Related Terms for "dor nas costas" is now also clean and usable (lombalgia 250/KD18, dor na
  lombar 200/KD0, dor nas costas lado esquerdo/direito 70-80 vol) — real Brazilian Portuguese
  symptom-phrasing variants, useful vocabulary for future body copy, not new routing targets.

- **Still zero data, confirmed by direct Keywords Explorer screenshot** (not just an unreturned
  CSV — Ahrefs explicitly shows "No data for this keyword" for each): "quiroprático deerfield
  beach" and "quiroprático perto de mim." Both stay `VOLUME UNVERIFIED`.

- **Two requested clusters were never findable in Ahrefs at all** — "ajuste quiroprático" (Global
  volume 30, but blank in every US-specific column: Volume, Difficulty, CPC, Intents) and
  "primeira consulta quiroprático" (completely blank, no Global volume either). Both are
  genuinely below Ahrefs' measurement floor for this market, not skipped — the export files exist
  and show blank rows, not missing files. **Label: NEEDS MORE EVIDENCE**, same as before.

**Updated PT-BR label:** was `NEEDS MORE EVIDENCE` across the board in Part 2. Now: **"quiropraxia"
cluster (including its near-me/cerca-de-mi variants) is CHANGE RECOMMENDED**; the accident/symptom
seed terms are **VALIDATED (no chase)** for their literal phrasing; "near me"/Deerfield Beach
local-direct terms and the adjustments/first-visit cluster remain **NEEDS MORE EVIDENCE**. This is
real progress, not a full close-out — the PT-BR local-commercial opportunity is now partially
evidence-backed (quiropraxia) rather than entirely unverified.

### Haitian Creole: confirmed a genuine, near-total tooling gap — not a re-pull failure

All 6 originally-flagged terms were re-checked directly in Keywords Explorer's Overview (not just
resubmitted to the same bulk export that hit the homophone bug before): "chiroprakè deerfield
beach," "chiroprakè tou pre mwen," and "doulè do" each returned an explicit **"No data for this
keyword"** screen (Search volume "0-10," Traffic Potential "N/A," Keyword ideas "not found" in
all four categories) — confirmed by direct screenshot for each, not inferred from a blank CSV
row. "Premye vizit kiwopratè" (the first-visit cluster this ticket asked for) returned the
identical "no data" result. "Aksidan machin" is the one term with ANY trend signal at all — a
sparse 24-month history (0,0,0,0,0,0,0,0,0,0,4,0,0,3,0,1,0,0,2,0,3,0,0,1 — single-digit monthly
counts, mostly zero) — but its Matching/Search-suggestions expansion is still dominated by
unrelated English noise ("pakistan machine tool factory," "accident machine," etc.), exactly the
same bug pattern as the original pull, just under a different seed. No sciatica-equivalent or
adjustments/services Haitian Creole term was submitted this round — flagged in the "Standing
recommendation" below rather than guessed at, per this ticket's own "get native-speaker review of
the seed terms themselves" instruction, which hasn't happened yet.

**Updated HT label: unchanged — `NEEDS MORE EVIDENCE — documented tooling limitation`, now
confirmed by a second, independent re-check rather than a single pull.** This is no longer "we
haven't tried again yet" — it's "we tried again, with direct keyword-level verification instead
of only a bulk export, and the result is the same near-total gap." The recommendation stands
exactly as written above: demographic (Census/ACS) justification over search-volume sizing,
native-speaker seed review before any third attempt, and real Search Console query data after
launch as the first genuinely first-party signal this locale will have. Code-switching behavior
could still not be inspected — no real SERP exists yet for any Haitian Creole term to check it in.

---

## Final labeled routing decisions

| Decision                                                                                                    | Label                                                                                                   | Evidence                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/car-accident-chiropractor` as primary accident-commercial hub                                             | **VALIDATED**                                                                                           | Part 1: 2,900–3,300 vol, KD0–26, Commercial+Transactional+Local across the whole cluster                                                                                                                                                                             |
| `/conditions/sciatica` — keep as-is, general routing                                                        | **VALIDATED** (already correct)                                                                         | Part 1: 3,400 vol/KD0                                                                                                                                                                                                                                                |
| `/conditions/sciatica` — **strengthen** priority/metadata/content depth/internal linking                    | **CHANGE RECOMMENDED**                                                                                  | Part 2 SERP: Local Pack present + a DR1 local chiropractor's service page ranking position 5 — ATS can realistically compete here                                                                                                                                    |
| `/conditions/whiplash` — non-accident-symptom volume (whiplash symptoms 7.9K, etc.) not chased              | **VALIDATED**                                                                                           | Part 1: all Informational/Non-local intent                                                                                                                                                                                                                           |
| `/conditions/whiplash` — small commercial slice (whiplash chiropractor 250/KD0) as the real target          | **VALIDATED**                                                                                           | Part 1                                                                                                                                                                                                                                                               |
| `/conditions/neck-pain` — non-accident framing, small commercial slice as target                            | **VALIDATED**                                                                                           | Part 1: neck pain relief 95K is informational-only; chiropractor for neck pain 600/KD4 is the real target                                                                                                                                                            |
| `/conditions/back-pain` — general intent, accident traffic bridged to accident page                         | **VALIDATED**                                                                                           | Part 1 + Part 2                                                                                                                                                                                                                                                      |
| "back pain after car accident" routed to `/car-accident-chiropractor` as a subsection, not a dedicated page | **VALIDATED**                                                                                           | Part 2 SERP: informational/publisher-dominated, no local pack, no commercial page ranks                                                                                                                                                                              |
| "back pain after car accident" as a `/blog` article opportunity                                             | **CHANGE RECOMMENDED**                                                                                  | Part 2 SERP: guide/how-to article format wins, KD1                                                                                                                                                                                                                   |
| "headaches after accident" routed to `/conditions/cervicogenic-headache` as the _literal query target_      | **CHANGE RECOMMENDED**                                                                                  | Part 2 SERP: zero local/commercial presence for this literal phrase — the page's real winnable target is the smaller "tmj chiropractor"/"chiropractor for headaches" slice already validated, not this phrase                                                        |
| "headache after car accident" as a `/blog` article opportunity                                              | **CHANGE RECOMMENDED**                                                                                  | Part 2 SERP: publisher/injury-clinic-blog-dominated, KD5                                                                                                                                                                                                             |
| "should i see a chiropractor after a car accident" as a `/blog` article                                     | **CHANGE RECOMMENDED**                                                                                  | Part 2 SERP: small chiropractic-clinic blogs already win this exact SERP                                                                                                                                                                                             |
| "who pays for chiropractor after accident" as a `/blog` article                                             | **CHANGE RECOMMENDED, lower priority**                                                                  | Part 2 SERP: legal/insurance-aggregator-dominated, harder but not impossible                                                                                                                                                                                         |
| Services hub / adjustments / spinal decompression pages                                                     | **VALIDATED**                                                                                           | Part 1: chiropractic adjustment 6,700/KD9 real; herniated disc informational halo correctly not chased                                                                                                                                                               |
| TMJ / cervicogenic-headache / concussion condition pages — general routing unchanged                        | **VALIDATED**                                                                                           | Part 1                                                                                                                                                                                                                                                               |
| Homepage broad "chiropractor deerfield beach" targeting                                                     | **VALIDATED**                                                                                           | Part 1: 150 vol (US), real hyper-local term, GBP-dependent (KD57 on the "near me" variant reflects Local-Pack dominance, not organic-content difficulty)                                                                                                             |
| Spanish local-commercial sizing                                                                             | **CHANGE RECOMMENDED — use the corrected number**                                                       | "quiropráctico cerca de mí" is 600 volume (US), not 20 (Spain) — replace the August figure everywhere it's cited                                                                                                                                                     |
| Spanish informational/symptom terms (dolor de espalda, ciática, etc.)                                       | **VALIDATED** (directionally unchanged from Aug, numbers refreshed)                                     | Corrected US pull                                                                                                                                                                                                                                                    |
| PT-BR "quiropraxia" cluster (incl. "quiropraxia near me" 150/KD38, "quiropraxia cerca de mi" 80/KD50)       | **CHANGE RECOMMENDED**                                                                                  | Part 3: clean Matching Terms pull (homophone bug avoided via multi-word seeding), Local Pack present on the head term's own SERP — same "informational leads, Local Pack still renders" shape as the validated sciatica finding                                      |
| PT-BR accident/symptom seed terms (acidente de carro, torcicolo, dor nas costas) as literal-phrase targets  | **VALIDATED (no chase)**                                                                                | Part 3 SERP: acidente de carro is 100% local-news/legal/dream-interpretation content, zero chiropractor presence; torcicolo/dor nas costas are AI-Overview-led Brazilian health-publisher SERPs, zero Local Pack on either                                           |
| PT-BR "near me"/Deerfield Beach direct terms, adjustments cluster, first-visit cluster                      | **NEEDS MORE EVIDENCE**                                                                                 | Part 3: "quiroprático deerfield beach"/"quiroprático perto de mim" confirmed zero data by direct screenshot; "ajuste quiroprático"/"primeira consulta quiroprático" below Ahrefs' US measurement floor                                                               |
| HT (`/ht/`) opportunity sizing (ATS-SEO-142/136)                                                            | **NEEDS MORE EVIDENCE — documented tooling limitation, now confirmed by a second independent re-check** | Part 3: 5 of 6 re-checked terms (incl. the new "premye vizit kiwopratè" first-visit term) confirmed "No data for this keyword" by direct screenshot; "aksidan machin" has only sparse single-digit monthly trend data and its own expansion is still noise-dominated |
| Service-area city-page architecture (19 cities)                                                             | **NO CHANGE**                                                                                           | Already resolved in ATS-SEO-063 — owner-directed decision on record (SPANISH_SEO_IMPLEMENTATION_REPORT.md §11b), not reopened by this pull                                                                                                                           |

## Status

Part 1 + Part 2 + corrected Spanish are complete for the original 9 English clusters and the 5
flagged SERP checks. Part 3 (2026-09-06) closed the PT-BR re-pull this doc itself called for:
the "dor" homophone bug is confirmed fixed by multi-word seeding, and the "quiropraxia" cluster
is now genuinely evidence-backed (CHANGE RECOMMENDED) rather than uniformly `NEEDS MORE
EVIDENCE`. The accident/symptom seed terms' literal-phrase SERPs were also checked and validated
as non-targets, closing that half of the original PT-BR question.

**What remains open, honestly:** PT-BR's own "near me"/Deerfield Beach direct terms and its
adjustments/first-visit clusters are still `NEEDS MORE EVIDENCE` — confirmed zero/below-floor in
Ahrefs, not yet resolved by any other method. Haitian Creole is now confirmed `NEEDS MORE
EVIDENCE — documented tooling limitation` by a SECOND independent re-check (5 of 6 terms
directly screenshotted as "No data for this keyword"), which is stronger evidence of a genuine
tooling gap than the original single pull, but is still not a resolution — the recommended next
steps (native-speaker seed review, Google Trends/Keyword Planner cross-check, Census/ACS
demographic justification, post-launch Search Console data) have not been executed. No PT-BR or
HT SERP Overview was pulled for the "near me"/Deerfield-Beach-direct/adjustments/first-visit
terms specifically, since none of them returned enough Ahrefs data to have a real SERP worth
capturing that way — Ahrefs' own "no data" screens are the evidence for those, not a missing
export.

**Ready for `ATS-SEO-004` update** on every row labeled VALIDATED or CHANGE RECOMMENDED above,
including the new PT-BR "quiropraxia" finding. PT-BR's remaining direct-local-term gap and HT in
full still block any further page-level content decision beyond what ATS-SEO-135/136 already
shipped, until their own flagged follow-up work happens.
