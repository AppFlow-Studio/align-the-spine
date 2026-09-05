# Multilingual SEO baseline — ATS-SEO-133

**Audited commit:** `origin/main @ 06629cc` (merge of `munis-dev` PR #32, which carries all of Epic
F's ATS-SEO-051–063 work). No uncommitted work existed at audit time; `git status` was clean.
**No deploy/push/merge performed.** No user-visible functionality changed by this ticket.

**Method:** reconciled `SPANISH_SEO_IMPLEMENTATION_REPORT.md` (the existing, already-thorough
implementation report for the current `/es` layer, dated 2026-08-26) against the live current
codebase — verifying its claims still hold after the Epic F work that landed alongside/after it —
then filled the gaps that report doesn't cover (proxy/middleware, analytics, translation-API/
locale-cookie exposure, blog Spanish status) via direct code inspection and `curl` against a
running dev server.

---

## 1. Executive summary

The existing `/es` layer is a genuinely strong reference architecture, not a translated skin. Its
own report already documents this in detail — this audit's job was to check whether that's still
true after further site changes, and it is, with one previously-flagged defect now resolved and a
small number of new items to track for the 4-locale expansion.

**No P0 defect was found that requires correcting inside this audit ticket.**

---

## 2. Current-state inventory

| Area                                        | Status                                        | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routing (App Router route groups)           | **VERIFIED GOOD**                             | `app/(en)/`, `app/(es)/` — route groups don't affect URLs; confirmed no English URL changed, all Spanish URLs 200                                                                                                                                                                                                                                                                                                                                                                                                          |
| Rendering (SSR vs. client-side translation) | **VERIFIED GOOD**                             | No translation API, no client-side rewrite. `curl`-confirmed: Spanish `<h1>`/prose present on first byte, JS-independent                                                                                                                                                                                                                                                                                                                                                                                                   |
| `html lang`                                 | **VERIFIED GOOD**                             | Per-locale root layout (`app/(en)/layout.tsx` → `lang="en-US"`, `app/(es)/layout.tsx` → `lang="es-US"`) — confirmed live via curl on `/es`                                                                                                                                                                                                                                                                                                                                                                                 |
| Canonical                                   | **VERIFIED GOOD**                             | Every page self-canonicalizes; a Spanish page never canonicalizes to English. Confirmed live                                                                                                                                                                                                                                                                                                                                                                                                                               |
| hreflang                                    | **VERIFIED GOOD**                             | Reciprocal `en-US`/`es-US`/`x-default` from one function (`buildAlternates()` in `content/i18n.ts`), consumed by both HTML metadata and the sitemap so they can't drift. Confirmed live (attribute renders as `hrefLang=` per React's DOM-property casing — cosmetic, not a defect, Googlebot reads it case-insensitively)                                                                                                                                                                                                 |
| Sitemap                                     | **VERIFIED GOOD**                             | One sitemap, both locales, per-URL `xhtml:link` alternates. Draft routes, `/thank-you`, `/es/gracias` excluded                                                                                                                                                                                                                                                                                                                                                                                                             |
| Robots                                      | **VERIFIED GOOD**                             | `/es` subtree explicitly protected from ever being blocked (tested); only `/api/`, `/thank-you`, `/es/gracias`, `/admin/`, `/preview/` disallowed                                                                                                                                                                                                                                                                                                                                                                          |
| Schema                                      | **VERIFIED GOOD**, one item now resolved      | Shared `@id`s across locales for `Organization`/`MedicalBusiness`/`Person` (one entity, two languages, not two businesses). `Service` not duplicated on `/es/servicios`. **The report's §14.2 flag — `areaServed` publishing unverified cities because `buildMedicalBusiness()`/`buildService()` didn't respect `serviceAreasVerified` — is now resolved**: `serviceAreasVerified: true` (client-confirmed since) and `lib/schema.ts` correctly gates `areaServed` behind it (verified by direct code read, lines 156/288) |
| Language switcher                           | **VERIFIED GOOD**                             | Resolves the equivalent page (not a blanket link to `/es`), renders nothing when no counterpart exists, real `<a>` with `hreflang`/`lang`/`aria-label`                                                                                                                                                                                                                                                                                                                                                                     |
| Forms                                       | **VERIFIED GOOD**, one item flagged           | Same field names/variant keys across locales — leads land in the existing pipeline unchanged, no new PII field added for Spanish. `/es/solicitar-cita` uses the shared `LeadForm`, not the bespoke `BookingForm` the English page uses (English-only hardcoded copy) — cosmetic parity gap, not a defect, already tracked in the source report as an engineering follow-up                                                                                                                                                 |
| CMS/blog                                    | **NEEDS IMPROVEMENT (tracked, not a defect)** | Blog is CMS-driven (`content_type: "blog_post"`), explicitly `es: null` in `content/i18n.ts` with a written reason ("no Spanish editorial pipeline and no Spanish posts"). **Confirmed still correct as of this audit** — zero published articles exist in any language right now (verified in ATS-SEO-062), so there is nothing to translate yet. This is the right call for now, not a gap to close inside E10                                                                                                           |
| Middleware/proxy                            | **VERIFIED GOOD**                             | No `middleware.ts` exists. `proxy.ts` (Next 16's renamed middleware hook) does exactly one thing — sets `X-Robots-Tag: noindex, nofollow` outside production — and contains **zero locale/language logic of any kind**                                                                                                                                                                                                                                                                                                     |
| Locale-detection redirects                  | **VERIFIED GOOD — explicitly a non-goal**     | `content/i18n.ts`'s own header comment states it: "No middleware, no Accept-Language/IP redirect. Both locales stay directly reachable at their own URL." Confirmed no code path implements this. Matches the epic's non-negotiable requirement exactly                                                                                                                                                                                                                                                                    |
| Locale cookies                              | **NOT APPLICABLE**                            | None exist. Repo-wide search found zero references to a locale cookie of any kind                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `Accept-Language` header usage              | **NOT APPLICABLE**                            | The only repo hit is the doc comment above stating it's deliberately unused                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Translation library/API                     | **NOT APPLICABLE — none present**             | `package.json` has no translation/i18n/intl dependency. All Spanish content is committed, hand-written TypeScript source under `content/es/*`, reviewed like any other code change. **No API key can leak client-side because no such API is called anywhere, client or server**                                                                                                                                                                                                                                           |
| Analytics/dataLayer                         | **NEEDS IMPROVEMENT**                         | `lib/analytics/*` has zero locale-aware fields — the lead-success event fires identically regardless of source-page language. Spanish performance is measurable today only via URL-prefix filtering in Search Console/GA (works, and is explicitly how the source report recommends measuring it), but there's no explicit `locale` dimension on the event itself. Worth adding once a 4-locale funnel makes URL-prefix-only segmentation more cumbersome to maintain across 4 languages — not a blocker for 134           |

---

## 3. English ↔ Spanish page-family map

Authoritative source: `content/i18n.ts`. The map in `SPANISH_SEO_IMPLEMENTATION_REPORT.md` §4 was
spot-checked against the live registry and against 3 representative live routes (`/es`,
`/es/quiropractico-accidentes-de-auto`, `/es/condiciones/ciatica`) and confirmed still accurate:

- **9 published, indexable pairs** (home, car-accident hub, services, about, reviews, contact,
  book-an-appointment, conditions hub, service-areas hub).
- **11 pairs in `status: "draft"` on both sides** — the 7 condition pages + 4 dedicated service
  pages — noindex, excluded from the sitemap, `content/i18n.test.ts` fails the build if a
  published Spanish page's English original is still draft (enforced, not just documented).
- **19 derived city pairs** (`/service-areas/[slug]` ↔ `/es/areas-de-servicio/[slug]`), registered
  in a separate derived table (`serviceAreaLocalizedRoutes`) since their English halves are
  repository-served, not in `content/seo.ts`. Already covered in depth by ATS-SEO-063 (this
  session) — the 88.3% mean pairwise similarity finding and the owner's explicit decision to keep
  the city pages live regardless are unrelated to the _technical_ i18n architecture, which is
  sound (hreflang/canonical/sitemap treat these identically to static pairs, verified by dedicated
  tests).
- **3 deliberately English-only routes** (`es: null`): `/privacy-policy` (needs counsel review),
  `/blog` (no Spanish content exists to translate), `/home-visit-chiropractor` (still draft,
  unverified data on the English side too).
- **1 unpaired utility page**: `/thank-you` ↔ `/es/gracias`, both noindex.

**Pages actually ready to serve as the parity reference for PT-BR/HT**: the 9 published pairs.
These are the ones with real, live, tested Spanish content — the 11 draft pairs and the 19 city
pairs are real work too, but the published 9 are the cleanest "build this shape again" template
for ATS-SEO-135/136.

---

## 4. Classified findings

| #   | Finding                                                                                                               | Classification                                                                                                                             |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Route-group locale architecture (`app/(en)`, `app/(es)`) with per-locale root layout for correct SSR `html lang`      | **VERIFIED GOOD**                                                                                                                          |
| 2   | One route table (`content/i18n.ts`) drives hreflang, sitemap alternates, switcher, and Spanish internal links         | **VERIFIED GOOD**                                                                                                                          |
| 3   | No client-side translation, no locale cookie, no `Accept-Language` redirect                                           | **VERIFIED GOOD**                                                                                                                          |
| 4   | `serviceAreasVerified`/`areaServed` schema gating bug (source report §14.2)                                           | **RESOLVED since the source report** — verified fixed in current code                                                                      |
| 5   | Blog has no Spanish pairing                                                                                           | **NOT APPLICABLE currently** — zero published posts in any language; correct to defer                                                      |
| 6   | `/es/solicitar-cita` uses generic `LeadForm` instead of bespoke `BookingForm`                                         | **NEEDS IMPROVEMENT** — cosmetic, tracked as a non-blocking follow-up in the source report, not re-litigated here                          |
| 7   | Analytics events carry no explicit `locale` field                                                                     | **NEEDS IMPROVEMENT** — recommend addressing before/during ATS-SEO-143 (multilingual forms/CRO/analytics), since it compounds at 4 locales |
| 8   | Spanish copy not yet reviewed by a native South Florida Spanish speaker or clinician                                  | **NEEDS CONFIRMATION** (owner/clinician-blocked, not an engineering item)                                                                  |
| 9   | No Spanish privacy policy                                                                                             | **NEEDS CONFIRMATION** (counsel-blocked)                                                                                                   |
| 10  | Patient reviews stay in their original language (not translated) on Spanish pages, with a visible on-page explanation | **VERIFIED GOOD (deliberate)** — translating a review would be a fabricated review under Google's policies; correctly left alone           |
| 11  | Hero H1 text animates from `opacity:0` (present in server HTML, but visually revealed by JS)                          | **Pre-existing on English, inherited by Spanish — NOT this ticket's scope**, flagged for visibility only                                   |
| 12  | `global-not-found.tsx` relies on a Next.js convention the published docs still describe as experimental               | **Flagged for a Next upgrade regression-test**, not a current defect                                                                       |

---

## 5. Reconciliation with adjacent tickets

I don't have the full ticket bodies for ATS-SEO-E1/E4/E8/123/124/126/131/132 (only their titles
from the epic index) — this section notes what's directly observable in code, not a claim of full
reconciliation:

- **ATS-SEO-123 (phone source of truth)**: the trailing-whitespace bug in
  `siteConfig.business.phone`/`phoneHref` was found and fixed in this same session (ATS-SEO-061),
  before this audit. Spanish content interpolates the same `siteConfig.business.phone` value
  (confirmed in the source report §3a — two Spanish FAQ answers had a hardcoded old number,
  already rewritten to interpolate), so the fix propagates to Spanish automatically. No separate
  Spanish-side phone fix needed.
- **ATS-SEO-124 (thank-you noindex)**: `/thank-you` and `/es/gracias` are both confirmed noindex
  and excluded from the sitemap (verified live for `/thank-you` in ATS-SEO-061; `/es/gracias`
  confirmed via the source report's explicit QA table, not re-curled in this pass).
- **ATS-SEO-126 (accident/conditions structured-data graph)**: schema entities are already shared
  across locales via stable `@id`s (§6.8 of the source report) — this looks like it's already
  satisfied for the current 2-locale state, but I can't confirm against the actual ticket's
  specific acceptance bar without its text.
- **E1/E4/E8/131/132**: no code-visible evidence of conflicting parallel logic (single route
  registry, single schema builder file, single metadata builder) — but I'd want those ticket
  bodies before claiming full reconciliation rather than just "nothing contradicts what I can
  see."

---

## 6. Target locale model for the 4-locale expansion

Confirms the epic's stated model, with no changes recommended to it based on this audit:

- English: `/` · `hreflang en`
- Spanish: `/es/` · `hreflang es` (already live)
- Brazilian Portuguese: `/pt/` · `hreflang pt-BR`
- Haitian Creole: `/ht/` · `hreflang ht`
- `x-default` → English, matching the current Spanish implementation's choice (no evidence found
  to prefer any other default)

**Recommended generalization shape for ATS-SEO-134** (not implemented in this audit ticket):

1. `content/i18n.ts`'s `Locale` type, `LOCALES`, `HTML_LANG`, `HREFLANG`, `OG_LOCALE`,
   `LOCALE_PREFIX` all need a third and fourth member. The route-pair table (`localizedRoutes`)
   needs to grow from an EN↔ES pair shape to an EN↔ES↔PT↔HT shape (or an array-of-locales shape) —
   this is the central architectural decision 134 needs to make, and it should be made once,
   deliberately, not incrementally re-shaped by 135 then 136.
2. Route groups: `app/(pt)/`, `app/(ht)/`, each with their own root layout (mirroring
   `app/(en)/layout.tsx` / `app/(es)/layout.tsx`) for correct SSR `html lang` per locale, same
   reasoning as §6.2 of the source report (a shared root layout can't know the locale without
   `headers()`, which would force dynamic rendering site-wide).
3. `content/pt/*`, `content/ht/*` content module trees, mirroring `content/es/*`'s shape
   (`seo.ts`, `chrome.ts`, `home.ts`, `pages.ts`, `lead-forms.ts`, etc.) — not a locale prop
   threaded through the Spanish modules themselves, matching the existing precedent that Spanish
   pages are their own committed content, not a runtime transform of English.
4. `buildAlternates()`/`findRouteByPath()`/`counterpartPath()` need to handle N-way reciprocal
   hreflang (currently 2-way) — every published page in any locale needs alternates for every
   _other_ locale that has a real counterpart, plus `x-default`.
5. Shared components' existing `locale`/content props (21 components already have this per the
   source report §17) need a 3rd/4th branch, not a new prop — the pattern already generalizes,
   it just needs more values accepted.
6. `content/i18n.test.ts`'s registry-parity enforcement (no route ships without a language
   decision; a published translation can't point at a draft original) needs to run across all 4
   locales, not just 2.

## 7. Page-family strategy for PT-BR/HT

Recommend building PT-BR and HT against the **9 published English pairs first** (the same scope
the Spanish layer started with), not the 11 draft condition/service pages — those stay
English/Spanish-only until clinician review clears them, same rule, same enforcement mechanism,
applied to 2 more locales.

The blog and the 19 service-area city pages are **not** recommended as day-one PT-BR/HT scope:

- Blog: no content exists in any language yet.
- Service-area cities: the English set already carries a documented, owner-accepted duplication
  risk (ATS-SEO-063); tripling that pattern into 2 more languages before that risk is resolved on
  the English/Spanish side would be compounding a known issue, not extending a proven one.

---

## 8. Documented blockers for PT-BR/HT

1. **Search-demand evidence is asymmetric across the two new locales.** Per
   `SEO_QA_EVIDENCE/ahrefs-2026-09/synthesis-part2-and-final-labels.md`: PT-BR has real but thin
   seed-keyword data (needs a re-pull with longer seed phrases — the initial pull's
   vocabulary-expansion step hit an Ahrefs term-matching bug). HT returned **zero measurable
   Ahrefs data** across every seed term tried — documented explicitly as a tooling/evidence
   limitation, not a finding of no demand, given South Florida's real Haitian Creole-speaking
   population. ATS-SEO-142 should not size the HT build on search volume; it should use
   demographic (Census/ACS language-spoken-at-home) justification instead, and get native-speaker
   review of the seed terms before concluding anything from Ahrefs' silence.
2. **No native-speaker review pipeline exists yet for any non-English content** — Spanish itself
   is still pending this (source report §14.10). PT-BR and HT will need the same, and arguably
   need it _more_ given neither the implementer nor this audit has any working knowledge of
   Brazilian Portuguese or Haitian Creole beyond what's checkable against dictionaries/machine
   translation — unlike Spanish, where the source report's author evidently applied real
   linguistic judgment (register, city-name handling, "auto/carro/choque" synonym-cluster
   reasoning). **This is the single largest quality risk for 135/136** and should be flagged to
   whoever owns those tickets before content is written, not discovered after.
3. **Clinician review backlog.** The 11 draft condition/service pages block Spanish expansion
   today and will block PT-BR/HT identically — this doesn't get easier by adding locales, it
   triples in scope the moment those pages clear review.
4. **`BookingForm` locale coverage** (§2, item 6 above) — if PT-BR/HT reuse the generic `LeadForm`
   like Spanish currently does, that's consistent, not a new gap. If a future ticket wants
   `BookingForm` localized, do it once for all 3 non-English locales together, not 3 times.
5. **No decision recorded yet on PT-BR/HT `x-default` interaction** if a browser's language list
   ever matters for anything non-redirect-related (e.g., a future `Content-Language` response
   header, unrelated to the explicitly-rejected auto-redirect). Not urgent, worth a one-line
   decision in 134 rather than an implicit default.

---

## 9. Recommendation

**Proceed to ATS-SEO-134.** No P0 defect blocks it. The single most consequential decision 134
needs to make explicitly (not inherit implicitly from the 2-locale shape) is the route-pair table
structure for N locales — get that right once, since 135/136 and everything in Phase 3 build
directly on top of it.
