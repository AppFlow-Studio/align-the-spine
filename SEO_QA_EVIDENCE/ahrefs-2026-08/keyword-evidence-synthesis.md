# Ahrefs Keyword Evidence Synthesis — 2026-08/09 pull

**Status:** Keywords Explorer data (PART-1) and Content Gap (PART-3) complete for 9 clusters.
**Missing:** SERP Overview (PART-2) — not pulled yet. Several decisions below are flagged
`NEEDS SERP CHECK` and should not be treated as final until that evidence exists, per the
review note that competitor-organic-keyword inference (and, by the same logic, Keywords
Explorer volume/intent alone) is not full validation — SERP Overview is what actually confirms
whether Align can compete for a given query and whether two queries share real intent.

**Source files:** `PART-1/<cluster>/*.csv` (Overview, Matching terms, Related terms, Search
suggestions — Ahrefs exports, UTF-16LE, US-targeted except `spanish/` which was pulled with
country=ES, see the flag under Spanish below), `PART-3/*content-gap*.csv` (Align vs. Bartell/
County Line/Carpe Diem, US).

Every table below lists only keywords with real volume (>0) and material relevance — the raw
exports (2,000–3,300 rows each per cluster) are preserved in `PART-1/` for anyone who wants the
unfiltered data.

---

## 1. Accident hub — `/car-accident-chiropractor`

### Seed cluster (Overview)

| Keyword                                   | Volume | KD  | CPC    | Intent                                 |
| ----------------------------------------- | ------ | --- | ------ | -------------------------------------- |
| auto accident chiropractor                | 3,300  | 26  | $7.00  | Info, Commercial, Transactional, Local |
| car accident chiropractor                 | 2,900  | 0   | $7.00  | Info, Commercial, Transactional, Local |
| auto accident chiropractor near me        | 2,600  | 22  | $11.00 | Info, Commercial, Transactional, Local |
| car accident chiropractor near me         | 2,100  | 0   | $8.00  | Info, Commercial, Local                |
| chiropractor after car accident           | 450    | 3   | $6.00  | Info, Commercial, Local                |
| accident chiropractor                     | 350    | 0   | $6.00  | Info, Commercial, Local                |
| chiropractor for car accident             | 150    | 3   | $7.00  | Info, Commercial, Local                |
| car accident injury chiropractor          | 100    | 12  | $8.00  | Info, Commercial, Local                |
| pip chiropractor                          | 30     | –   | –      | –                                      |
| chiropractor deerfield beach car accident | 0      | –   | –      | –                                      |

**Finding — this is the strongest cluster in the whole pull.** Every primary term is real,
national-scale commercial volume with low-to-moderate KD (0–26), Commercial+Transactional+Local
intent across the board. This upgrades the previous evidence standard (which only had "chiropractor
in deerfield beach," vol 60, and "back pain deerfield," vol 60, both hyper-local) to a full
validated national cluster. **Confirms the existing architecture — `/car-accident-chiropractor` as
the primary accident-commercial hub — is correctly targeted, now with real data instead of
competitor-gap inference.**

### Notable expanded terms (Matching/Related/Suggestions, top by volume)

Most of the top-35 by raw volume is noise from shared words ("chiropractor near me" 302K — belongs
to homepage, not this page; "yelp reviews," "yelp login," "the joint chiropractic" — a national
franchise brand, irrelevant). Filtering to what's actually on-topic:

| Keyword                   | Volume | KD  | Intent                           | Note                                        |
| ------------------------- | ------ | --- | -------------------------------- | ------------------------------------------- |
| quiropráctico cerca de mi | 3,500  | 66  | Info, Commercial, Local          | Spanish "near me" — see Spanish section     |
| corrective chiropractic   | 1,500  | 2   | Info, Commercial, Branded, Local | Likely a specific brand/entity, not generic |

### Informational-only candidates (route to `/blog`, not this page)

| Keyword                                          | Volume | Intent             |
| ------------------------------------------------ | ------ | ------------------ |
| who pays for chiropractor after accident         | 250    | Informational only |
| should i see a chiropractor after a car accident | 200    | Informational only |

These are real questions with real volume but educational/insurance-explainer intent — good blog
article candidates, per the ticket's rule not to force informational queries onto the commercial
page. `NEEDS SERP CHECK` to confirm the ranking pages are actually blog/publisher content and not
local clinics before finalizing that routing.

---

## 2. Whiplash — `/conditions/whiplash`

### Seed cluster (Overview)

| Keyword                      | Volume | KD  | CPC   | Intent                      |
| ---------------------------- | ------ | --- | ----- | --------------------------- |
| whiplash symptoms            | 7,900  | 2   | $0.02 | Informational, Non-local    |
| whiplash treatment           | 1,900  | 20  | $2.50 | Informational, Non-local    |
| neck pain after car accident | 1,600  | 37  | $6.00 | Informational, Non-local    |
| whiplash chiropractor        | 250    | 0   | $4.00 | Info, **Commercial, Local** |
| whiplash recovery time       | 150    | 43  | $2.50 | Informational, Non-local    |
| chiropractor for whiplash    | 80     | 0   | $4.00 | Info, **Commercial, Local** |

**Finding — important intent split.** The big-volume whiplash terms (whiplash injury 12K, whiplash
symptoms 7.9K, "how long does whiplash last" 2.1K, "what does whiplash feel like" 1.6K, "signs of
whiplash" 900) are **all Informational/Non-local intent** — these are national symptom-research
queries that will be dominated by medical publishers (Mayo Clinic/Cleveland Clinic-style SERPs),
not local clinic pages. `NEEDS SERP CHECK` to confirm, but the Intent tag alone is a strong signal.

The actual **local-commercial slice is small but real and low-difficulty**: "whiplash chiropractor"
(250, KD0), "chiropractor for whiplash" (80, KD0), "whiplash chiropractor near me" (500, KD61),
"chiropractor for whiplash near me" (450, KD unlisted), "whiplash doctor" (600, KD0). **This
confirms the current page's primaryQuery ("whiplash chiropractor Deerfield Beach") is targeting
the right slice — the page should not chase the 7.9K "whiplash symptoms" volume, that's a different
SERP entirely.**

One incidental finding worth a look: "whiplash vs concussion" (450) and "can you get a concussion
from whiplash" (400) are real, low-competition queries — a candidate for an explicit
whiplash↔concussion cross-link/FAQ item, which doesn't fully exist today.

---

## 3. Neck pain (non-accident) — `/conditions/neck-pain`

### Seed cluster (Overview)

| Keyword                    | Volume | KD  | CPC   | Intent                      |
| -------------------------- | ------ | --- | ----- | --------------------------- |
| neck pain relief           | 95,000 | 49  | $0.35 | Informational, Non-local    |
| tech neck                  | 27,000 | 14  | $0.03 | Informational, Non-local    |
| stiff neck                 | 23,000 | 24  | $0.03 | Informational, Non-local    |
| chiropractor for neck pain | 600    | 4   | $2.50 | Info, **Commercial, Local** |
| neck pain chiropractor     | 450    | 4   | $2.50 | Info, **Commercial, Local** |

**Finding — this is the clearest example of the review's warning.** "neck pain relief" (95,000
volume!) looks huge, but it's pure informational/self-care intent (stretches, exercises, causes) —
not winnable or even relevant for a local clinic page, and chasing it would be exactly the "volume
alone" mistake flagged. The real opportunity is the small commercial slice: "chiropractor for neck
pain" (600, **KD4** — very low) and "neck pain chiropractor" (450, KD4). **Confirms the existing
page's non-accident, general-neck-pain framing is targeting the right (small, winnable) query, and
confirms we should not try to capture the "neck pain relief" volume on this page.**

---

## 4. Back pain — `/conditions/back-pain`

### Seed cluster (Overview)

| Keyword                      | Volume  | KD    | CPC   | Intent                      |
| ---------------------------- | ------- | ----- | ----- | --------------------------- |
| back pain relief             | 274,000 | 28    | $0.70 | Informational, Non-local    |
| slipped disc                 | 19,000  | 33    | $1.00 | Informational, Non-local    |
| back pain chiropractor       | 2,000   | 20    | –     | Info, **Commercial, Local** |
| back pain after car accident | 1,000   | **1** | $6.00 | Informational, Non-local    |
| lower back pain chiropractor | 450     | 41    | $2.50 | Info, **Commercial, Local** |

**Finding 1:** Same informational-halo pattern as neck pain — "back pain relief" (274K) and
"herniated disc" (159K) are not winnable local-clinic targets. "back pain chiropractor" (2,000,
KD20) is the real, larger-than-neck-pain commercial opportunity for this page — good news, this is
the single best non-accident condition-commercial term found across back-pain/neck-pain/sciatica.

**Finding 2 — worth a second look:** "back pain after car accident" carries real volume (1,000) at
**KD1** (almost no competition) but Informational/Non-local intent per Ahrefs, not Local/Commercial.
The existing architecture (confirmed again in this review round) deliberately routes this query to
`/car-accident-chiropractor`, not `/conditions/back-pain`, per the "don't create a page/steal an
angle for a keyword that already has a home" rule. Given the Informational intent tag and KD1, this
is plausibly satisfied by good content _within_ the accident hub (which already covers back pain as
one of several accident injuries) rather than needing dedicated treatment. `NEEDS SERP CHECK` to
confirm what's actually ranking (local clinic vs. injury-attorney vs. publisher) before fully
closing this — a KD1/1000-volume query costing us nothing to also address well is worth 5 minutes
of SERP inspection.

---

## 5. Sciatica — `/conditions/sciatica`

### Seed cluster (Overview)

| Keyword                 | Volume | KD    | CPC   | Intent                      |
| ----------------------- | ------ | ----- | ----- | --------------------------- |
| pinched nerve           | 27,000 | 5     | $0.04 | Informational, Non-local    |
| sciatica treatment      | 16,000 | 43    | $0.40 | Informational, Non-local    |
| sciatica chiropractor   | 3,400  | **0** | $2.00 | Info, **Commercial, Local** |
| lower back and leg pain | 1,100  | 26    | $1.10 | Informational, Non-local    |
| pain down leg           | 150    | 22    | $0.08 | Informational, Non-local    |
| radiating leg pain      | 150    | 0     | $0.35 | Informational, Non-local    |

**Finding — standout result of this entire pull.** "sciatica chiropractor" at **3,400 volume / KD 0**
is the single strongest commercial opportunity found across every cluster researched so far —
higher volume than back pain's commercial term, higher than neck pain's, and literally zero
measured difficulty. This is a much stronger validated target than anything in the original
evidence set. Also confirms "pinched nerve" as real, very-high-volume patient vocabulary (27,000,
KD5) — matches the patient-language synonym work already done on this page (ATS-SEO-054), though
that specific phrase is informational-intent, not something this page should try to rank for
directly.

---

## 6. Services (adjustments / spinal decompression / soft tissue)

### Seed cluster (Overview)

| Keyword                           | Volume | KD  | CPC   | Intent                          |
| --------------------------------- | ------ | --- | ----- | ------------------------------- |
| spinal decompression              | 16,000 | 12  | $0.90 | Info, Commercial, **Non-local** |
| herniated disc treatment          | 12,000 | 17  | $0.80 | Informational, Non-local        |
| chiropractic adjustment           | 6,700  | 9   | $3.00 | Info, **Commercial, Local**     |
| non-surgical spinal decompression | 60     | 9   | $1.50 | Informational, Non-local        |

**Finding:** "spinal decompression" (16,000, KD12) is real volume, but tagged **Commercial +
Non-local** — meaning searchers are likely comparing/researching the treatment itself rather than
searching "near me." That matches the existing page's already-written framing (explains the
treatment in depth) reasonably well, but it also means this term is less of a pure local-lead-gen
play than the "X chiropractor" pattern elsewhere. "chiropractic adjustment" (6,700, KD9) is a solid,
real Local+Commercial opportunity for the adjustments page. The herniated-disc informational halo
(159K/20K/12K) is the same non-winnable pattern as elsewhere — good vocabulary source (we already
use "slipped disc," "herniated disc" as patient language, per ATS-SEO-052/058), not a ranking
target.

---

## 7. TMJ / cervicogenic headache / concussion

### Seed cluster (Overview)

| Keyword                            | Volume | KD  | CPC    | Intent                                  |
| ---------------------------------- | ------ | --- | ------ | --------------------------------------- |
| cervicogenic headache              | 40,000 | 31  | $0.07  | Informational, Non-local                |
| post concussion syndrome treatment | 1,600  | 9   | $0.60  | Informational, Non-local                |
| tmj chiropractor                   | 900    | 0   | $2.00  | Info, **Commercial, Local**             |
| headache after car accident        | 800    | 5   | $10.00 | Informational (no Local/Commercial tag) |
| chiropractor for headaches         | 300    | 2   | $3.00  | Info, **Commercial, Local**             |
| jaw pain chiropractor              | 60     | 0   | $2.00  | Info, **Commercial, Local**             |
| concussion chiropractor            | 40     | 0   | $1.70  | Info, Commercial, Transactional, Local  |

**Finding 1:** "cervicogenic headache" itself has real, unexpectedly large national volume
(40,000) — much higher than assumed when that page was originally scoped as a niche clinical term —
but it's purely informational, not a local-commercial target. "tmj chiropractor" (900, KD0) and
"chiropractor for headaches" (300, KD2) are the real, low-difficulty, winnable commercial terms —
both validate their respective pages' current primary queries.

**Finding 2 — worth a second look:** "headache after car accident" (800 volume, KD5, $10 CPC — a
notably high CPC suggesting real commercial value even though Ahrefs' intent tag here doesn't show
Local/Commercial) is the exact phrase the existing keyword map (ATS-SEO-004) already routes to
`/conditions/cervicogenic-headache`. The intent tag not showing Commercial is a flag worth a SERP
check — `NEEDS SERP CHECK` before treating that routing as fully confirmed, though the high CPC is
independent evidence of commercial value regardless of Ahrefs' auto-tagged intent.

**Finding 3:** "concussion chiropractor" (only 40 volume, KD0) is real but tiny — consistent with,
and no reason to change, this page's already-conservative treatment (stays permanently draft/noindex
regardless of clinician sign-off, most emergency-focused of the condition pages, per its own
registry justification).

---

## 8. Broad / homepage

### Seed cluster (Overview)

| Keyword                      | Volume  | KD  | CPC   | Intent                  |
| ---------------------------- | ------- | --- | ----- | ----------------------- |
| chiropractor near me         | 302,000 | 57  | $3.00 | Info, Commercial, Local |
| chiropractor deerfield beach | 150     | 14  | –     | Info, Commercial, Local |
| deerfield beach chiropractor | 60      | –   | –     | –                       |

**Finding:** "chiropractor near me" is enormous but KD57 and inherently Local-Pack/GBP-dominated —
realistically resolved by Google Business Profile strength more than organic content alone (a
non-code lever, worth flagging to whoever owns GBP). "chiropractor deerfield beach" (150, KD14) and
"deerfield beach chiropractor" (60) remain the actual winnable hyper-local terms and match the
homepage's existing primaryQuery — consistent with, and an upgrade on, the original vol-60 estimate
(this pull shows 150 for the "chiropractor + deerfield beach" word order, vs. 60 for the reverse
order — worth using the higher-volume phrasing as the lead H1/title pattern if not already).

Noise to explicitly discard: "the joint," "the joint chiropractic" (70–80K volume) — a national
franchise brand, not relevant to Align at all despite surfacing in matching terms.

---

## 9. Spanish

**⚠️ Data-quality flag: this pull was run with country = ES (Spain), not US.** The file names
(`google_es_...`) and several results confirm it — e.g. "clinica universidad de navarra" (5,700
volume) and "cun madrid"/"cun pamplona" are a real hospital system in Pamplona, Spain, not a Florida
entity. **This cluster needs to be re-pulled with country = United States** to reflect actual
US-based Spanish-speaker search behavior (per the review's explicit instruction: "research Spanish
as its own market... using actual Spanish search behavior," which means Spanish-language searches
_from the US_, not from Spain). Treat the numbers below as directional vocabulary only, not
validated US demand, until re-pulled.

| Keyword                   | Volume (ES) | KD  | Intent                   |
| ------------------------- | ----------- | --- | ------------------------ |
| dolor de espalda          | 8,700       | 28  | Informational, Non-local |
| ciática                   | 3,800       | 10  | Informational, Non-local |
| latigazo cervical         | 3,000       | 2   | Informational, Non-local |
| dolor de cuello           | 2,600       | 7   | Informational, Non-local |
| quiropráctico cerca de mí | 20          | 32  | Info, Commercial, Local  |

Even discounting the Spain contamination, the pattern rhymes with the English clusters:
symptom/condition terms carry real volume but informational intent; the direct "near me" commercial
term is tiny (20). **Action: re-run the Spanish cluster with country=US before drawing any
conclusion about Spanish local-intent opportunity size.**

---

## 10. Content Gap (Align vs. Bartell / County Line / Carpe Diem, US)

Only 8 rows returned — confirms the market is as thin as the original ATS-SEO-003 research found.
Mostly noise (competitor branded terms: "carpe diem chiropractic," "bartell chiropractic," "bartell
chiropractic life center," "joseph coffman" — a person's name). Two rows carry real signal:

- **"back pain deerfield"** (60, KD0) — Bartell ranks position 10, traffic 1. This is the same
  evidence already in the original `ahrefs-before` set — reconfirmed, not new.
- **"frozen shoulder chiropractor near me"** (100, KD0) — Carpe Diem's dedicated shoulder-pain
  condition page ranks position 7. This is a useful structural proof-point: a specific-condition
  page _can_ pick up a real "near me" long-tail commercial query at zero difficulty, even for a
  weak competitor. Supports (doesn't newly prove, but reinforces) the site's existing dedicated
  condition-page strategy.

No major missed-opportunity gap surfaced beyond what was already known — this is a low-competition
market with little for Content Gap to reveal, consistent with the original research.

---

## Cross-cluster pattern (applies everywhere)

Every single cluster shows the same shape: **huge informational/symptom-research volume that isn't
winnable or even relevant for a local commercial page, sitting next to a much smaller, low-KD,
genuinely winnable local-commercial slice.** Ranked by strength of the commercial opportunity found:

1. **Accident cluster** (2,900–3,300 vol, KD0–26) — strongest, already the top-priority page.
2. **Sciatica chiropractor** (3,400 vol, **KD0**) — standout single best result in this pull.
3. **Back pain chiropractor** (2,000 vol, KD20).
4. **Chiropractic adjustment** (6,700 vol, KD9).
5. **Neck pain chiropractor** / **chiropractor for neck pain** (450–600 vol, KD4).
6. **TMJ chiropractor** (900 vol, KD0).
7. **Chiropractor for headaches** (300 vol, KD2).
8. **Whiplash chiropractor** (250 vol, KD0).
9. **Concussion chiropractor** (40 vol, KD0) — real but negligible, consistent with its
   deliberately conservative treatment.

None of this changes the existing page architecture — every finding above validates a decision
already made, using real numbers instead of competitor-gap inference. The two open items are the
`NEEDS SERP CHECK` flags (back-pain-after-accident and headache-after-accident routing) and the
Spanish re-pull.

## Still needed (PART-2)

SERP Overview wasn't pulled this round. Before treating the `NEEDS SERP CHECK` items above as
closed, or before creating any new URL based on this data, pull SERP Overview for:

- back pain after car accident
- headache after car accident
- who pays for chiropractor after accident / should i see a chiropractor after a car accident
- sciatica chiropractor (to confirm what's actually rankable at KD0 — local clinics, or something
  else entirely)

A `PART-2-SERP-overview-NEEDED/` folder is ready in this evidence directory for those exports.
