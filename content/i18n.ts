/** Locale architecture (ATS-SEO-134: generalized from the original
 * Spanish-only layer to cover EN/ES/PT-BR/HT — see
 * docs/multilingual-seo-baseline.md for the audit this generalization is
 * based on).
 *
 * One source of truth for every locale's URL pairing. Everything
 * language-related derives from `localizedRoutes` below: the `<link
 * rel="alternate" hreflang>` tags (lib/seo/metadata.ts), the sitemap's
 * per-URL alternates (app/sitemap.ts), the navbar/footer language switcher
 * (components/layout/language-switcher.tsx), and breadcrumb/internal-link
 * targets. Nothing may hardcode a `/es/...`, `/pt/...` or `/ht/...` string
 * anywhere else — a pair that only exists in one of those places is exactly
 * how hreflang stops being reciprocal and Google quietly drops the
 * annotation.
 *
 * Deliberate non-goals (unchanged from the original Spanish-only design):
 *  - No middleware, no Accept-Language/IP redirect. Every locale stays
 *    directly reachable at its own URL (a forced redirect would hide a
 *    language from users and from Googlebot, which crawls from the US with
 *    no language preference).
 *  - No runtime translation. Non-English copy is committed source under
 *    content/es/, content/pt/, content/ht/, server-rendered like the
 *    English copy, so a localized URL returns localized HTML on the first
 *    response with no JS and no API call. There is no translation API in
 *    this codebase at all (verified repo-wide, ATS-SEO-133) — nothing to
 *    separate runtime UI translation from, and nothing that could leak an
 *    API key client-side.
 *
 * ATS-SEO-135 (Portuguese) and ATS-SEO-136 (Haitian Creole) have each
 * built the same nine route families — home, car-accident hub, services
 * hub, about, reviews, contact, book-an-appointment, conditions hub,
 * service-areas hub — so those nine `localizedRoutes` entries carry real
 * `pt`/`ht` paths. Every other route (the draft condition/service pages,
 * the 19 city pages, /privacy-policy, /blog, /home-visit-chiropractor)
 * still keeps `pt: null, ht: null`, same documented-null convention
 * Spanish's own draft routes use: a route only gets a non-null path once
 * a ticket actually builds that page, never guessed. `buildAlternates()`
 * simply never emits a pt/ht hreflang entry for a null route, which is the
 * "no indexable mixed-language 200" guarantee both tickets asked for — it
 * falls directly out of the null-means-no-page convention, not a new
 * mechanism.
 *
 * Every shared component that resolves locale-specific *content* (not
 * routes) — content/chrome.ts, content/testimonials.ts,
 * components/ui/{pip-calculator,lead-form,lead-consent,lead-form-popup,
 * underline-form,mobile-lead-preview-card}.tsx,
 * components/sections/{contact-section,hero,comparison-table,
 * hero-solid-panel}.tsx, components/layout/{location-intro,location-footer,
 * navbar,navbar-drawer}.tsx — now has real `pt` and `ht` branches wired in
 * by ATS-SEO-135/136, alongside their Spanish ones. The remaining
 * `components/content/{service-area-hero,accident-impact-visual,
 * es-service-area-article,es-condition-page}.tsx` files stay Spanish-only
 * on purpose: they're each coupled to Spanish-only data (the nineteen
 * Spanish city pages, the seven Spanish condition pages) that has no
 * Portuguese/Haitian-Creole counterpart yet, so the Portuguese and Haitian
 * Creole service-area pages are bespoke markup instead of reusing that
 * component — see app/(pt)/pt/areas-de-atendimento/page.tsx and
 * app/(ht)/ht/zon-nou-sevi/page.tsx's own comments.
 *
 * `LanguageSwitcher` itself is deliberately NOT touched by either ticket —
 * its 2-way EN⇄ES toggle UI becomes a 4-way equivalent-page menu under
 * ATS-SEO-137 ("Build four-language switcher and equivalent-page
 * navigation"), which owns that redesign. Until then, `pt`/`ht` pages fall
 * back to switching straight to English (their `target` resolves to "en",
 * same as Spanish's own fallback shape) — functional and never a broken
 * link, just not yet a real 4-way menu.
 */

import { esServiceAreaCities } from "@/content/es/service-areas-cities";

export const LOCALES = ["en", "es", "pt", "ht"] as const;
export type Locale = (typeof LOCALES)[number];

/** English is the site's primary language and the hreflang x-default
 * target — the practice is a US business whose default audience is
 * English-speaking, and every localized page has an English counterpart
 * while the reverse isn't true. */
export const DEFAULT_LOCALE: Locale = "en";

/** Endonym (the language's own name for itself), for the language switcher
 * and any other UI that lists available languages. Centralized per
 * ATS-SEO-134 so no component hand-types a language name that could drift
 * from another's. */
export const LOCALE_ENDONYM: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  ht: "Kreyòl Ayisyen",
};

/** `<html lang>` value per locale.
 *
 * en-US/es-US (not a bare "en"/"es", and not es-ES/es-MX): the existing,
 * already-indexed Spanish layer deliberately chose the US-region variant —
 * the audience is Spanish-speaking South Florida, and US Spanish is what
 * the copy under content/es/ is written in (see
 * SPANISH_SEO_IMPLEMENTATION_REPORT.md). This ticket preserves that
 * decision exactly rather than "fixing" it to match the parent epic
 * document's shorthand ("hreflang en" / "hreflang es") — changing an
 * already-live, already-indexed hreflang value on 9 published pages is a
 * real regression risk this ticket's own acceptance criteria forbid
 * ("EN/ES behavior does not regress"), not a neutral cleanup.
 *
 * pt-BR: the epic's explicit, correct target — Brazilian Portuguese is a
 * real, standard hreflang/lang value (distinct from pt-PT).
 *
 * ht: Haitian Creole has no widely-used region-qualified variant the way
 * es-US/pt-BR do; "ht" alone is the correct ISO 639-1 code and the value
 * the parent epic document specifies. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en-US",
  es: "es-US",
  pt: "pt-BR",
  ht: "ht",
};

/** hreflang codes — same language-region pairs as HTML_LANG. */
export const HREFLANG: Record<Locale, string> = HTML_LANG;

/** OpenGraph `og:locale` uses underscores, not the hyphens hreflang uses.
 * Facebook's og:locale list has no defined Haitian Creole entry; "ht_US"
 * mirrors the "this variety as spoken by our actual audience" reasoning
 * already applied to es-US (rather than "ht_HT", which would describe
 * Haiti-based readers, not the South Florida audience this site serves).
 * Low-confidence choice — flagged, not asserted — since there's no strong
 * precedent to check it against; if a consumer (Facebook, a validator)
 * doesn't recognize it, og:locale is simply ignored, not broken, so this is
 * safe to ship provisionally. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_US",
  pt: "pt_BR",
  ht: "ht_US",
};

/** Path prefix owned by a locale. English lives at the site root (its URLs
 * predate this work and must not move — see SPANISH_SEO_IMPLEMENTATION_REPORT.md
 * §English site safety); every other locale gets its own prefix, matching
 * the parent epic's required locale model exactly. */
export const LOCALE_PREFIX: Record<Locale, string> = {
  en: "",
  es: "/es",
  pt: "/pt",
  ht: "/ht",
};

export interface LocalizedRoute {
  /** Stable identifier — the thing that stays constant when a slug in any
   * language changes. Link internally by id, never by literal path. */
  id: string;
  /** English path from the site root. "" is the English home page. */
  en: string;
  /** Path in this locale, or null when no page exists for this route yet
   * in that locale. null is a deliberate, documented state, not an
   * omission: a localized URL that 200s with English content would be
   * worse than no localized URL at all (Google treats it as a duplicate,
   * and a reader gets a page they can't read). Every route currently has
   * `pt: null, ht: null` — see this file's header comment. */
  es: string | null;
  pt: string | null;
  ht: string | null;
}

/** English ↔ Spanish route pairs.
 *
 * Spanish slugs are localized, not transliterated, and were chosen against
 * Spanish search intent rather than by translating the English slug word
 * for word (see the keyword map in SPANISH_SEO_IMPLEMENTATION_REPORT.md):
 *  - "quiropractico-accidentes-de-auto" carries the head term
 *    ("quiropráctico" + "accidente de auto") rather than mirroring the
 *    English word order of /car-accident-chiropractor.
 *  - "resenas" is deliberately ASCII (no ñ) — a percent-encoded ñ in a
 *    canonical URL is legal but reads as %C3%B1 everywhere it's copied,
 *    pasted, and reported on.
 *  - "solicitar-cita" ("request an appointment"), not "reservar"/"agendar":
 *    the form requests a callback, it does not confirm a slot, and the
 *    Spanish slug shouldn't promise something the English one deliberately
 *    stopped promising (see content/seo.ts on /book-an-appointment).
 *  - "dr-abe-nasser" rather than a literal "acerca-de": the page is the
 *    doctor's entity page, and the Spanish query that reaches it is his
 *    name plus "quiropráctico", not an abstract "about us".
 *
 * Trailing slashes are absent on both sides because the existing English
 * routes have none (Next's default `trailingSlash: false`) — Spanish URLs
 * follow the site's existing normalization rather than introducing a
 * second convention (see §URL normalization in the report).
 */
export const localizedRoutes: LocalizedRoute[] = [
  { id: "home", en: "", es: "/es", pt: "/pt", ht: "/ht" },
  {
    id: "carAccident",
    en: "/car-accident-chiropractor",
    es: "/es/quiropractico-accidentes-de-auto",
    pt: "/pt/quiropratico-acidentes-de-carro",
    ht: "/ht/kiwoprate-pou-aksidan-machin",
  },
  {
    id: "services",
    en: "/services",
    es: "/es/servicios",
    pt: "/pt/servicos",
    ht: "/ht/sevis",
  },
  {
    id: "about",
    en: "/about",
    es: "/es/dr-abe-nasser",
    pt: "/pt/dr-abe-nasser",
    ht: "/ht/dr-abe-nasser",
  },
  {
    id: "reviews",
    en: "/reviews",
    es: "/es/resenas",
    pt: "/pt/avaliacoes",
    ht: "/ht/komante-pasyan",
  },
  {
    id: "contact",
    en: "/contact-us",
    es: "/es/contacto",
    pt: "/pt/contato",
    ht: "/ht/kontakte-nou",
  },
  {
    id: "bookAppointment",
    en: "/book-an-appointment",
    es: "/es/solicitar-cita",
    pt: "/pt/solicitar-consulta",
    ht: "/ht/mande-yon-randevou",
  },

  // --- Hub pages whose children are NOT all paired ---------------------
  // Both hubs are real Spanish/Portuguese pages. What differs is what sits
  // under them, and why.
  // /conditions now has a Spanish hub, because its children do too — the
  // hub follows its children. /blog stays English-only (no Spanish/
  // Portuguese editorial pipeline); /service-areas has Spanish and
  // Portuguese hubs but deliberately no non-English children — see below.
  // The Portuguese conditions hub exists (ATS-SEO-135's published-parity
  // scope includes it) even though none of its children do yet — it
  // currently links onward to the accident/services pages instead, same
  // pattern as a hub whose children haven't published.
  {
    id: "conditionsHub",
    en: "/conditions",
    es: "/es/condiciones",
    pt: "/pt/condicoes",
    ht: "/ht/kondisyon-nou-trete",
  },
  // The service-area HUB is paired: /es/areas-de-servicio is a real
  // Spanish page (one office, named communities, honest limits).
  //
  // The nineteen /service-areas/[slug] city pages underneath it are NOT,
  // and that is the point. They are served from a static data file
  // (content/service-areas.ts) through a repository that mimics the CMS
  // interface — so translating them was mechanically possible and was
  // still the wrong call. Measured on their visible prose, the nineteen
  // are 88.3% similar to one another on average (max 96.7%, min 81.9%;
  // all 171 pairs above 80%), with only 0.6%-5.1% of each page's distinct
  // tokens unique to it. Spinning up nineteen Spanish translations of one
  // template is precisely the doorway-page surface this project is not
  // allowed to build, and it would have them cannibalize each other for
  // "quiropráctico en [ciudad]" besides.
  //
  // Each city keeps its English page, linked from the Spanish hub with
  // hrefLang="en" and a visible "(en inglés)" label. A city earns a
  // Spanish page when it has genuinely city-specific Spanish material to
  // put on it, one city at a time, on evidence.
  {
    id: "serviceAreas",
    en: "/service-areas",
    es: "/es/areas-de-servicio",
    pt: "/pt/areas-de-atendimento",
    ht: "/ht/zon-nou-sevi",
  },

  // --- English-only, deliberately (es/pt/ht: null) ----------------------
  // Every route below is either noindex today or unsafe to translate
  // without sign-off. Each keeps `es: null, pt: null, ht: null` so no
  // hreflang pair is emitted, no sitemap entry appears, and the language
  // switcher hides itself rather than dumping a reader onto an English page.
  //
  // /privacy-policy: a legal notice describing HIPAA and Florida privacy
  // obligations. A Spanish version is a legal document in its own right
  // and needs counsel review, not a content translation — see the report's
  // "Remaining work".
  { id: "privacyPolicy", en: "/privacy-policy", es: null, pt: null, ht: null },
  // The blog is CMS-driven (dynamic /blog/[slug]); there is no Spanish
  // editorial pipeline and no Spanish posts. Bulk-translating posts is
  // explicitly out of scope — see the report's "Remaining work".
  { id: "blog", en: "/blog", es: null, pt: null, ht: null },
  // The routes below are `status: "draft"` in content/seo.ts — noindex and
  // out of the sitemap pending a clinician's review of their medical
  // content. Translating unreviewed medical claims into a second language
  // doubles the exposure instead of halving it; they get Spanish pages
  // once (and only once) the English originals clear clinical review.
  { id: "homeVisit", en: "/home-visit-chiropractor", es: null, pt: null, ht: null },
  // The four service pages now have Spanish counterparts. Both sides stay
  // `status: "draft"` in their registries (noindex, out of the sitemap)
  // until a clinician signs off on the English originals — the Spanish
  // pages exist so the Spanish nav's Servicios dropdown has real Spanish
  // destinations, not so unreviewed medical copy gets indexed.
  // content/i18n.test.ts enforces that a Spanish page can't be published
  // while its English original is draft.
  {
    id: "serviceAdjustments",
    en: "/services/chiropractic-adjustments",
    es: "/es/servicios/ajustes-quiropracticos",
    pt: null,
    ht: null,
  },
  {
    id: "serviceDecompression",
    en: "/services/spinal-decompression",
    es: "/es/servicios/descompresion-espinal",
    pt: null,
    ht: null,
  },
  {
    id: "serviceSoftTissue",
    en: "/services/soft-tissue-therapy",
    es: "/es/servicios/terapia-de-tejidos-blandos",
    pt: null,
    ht: null,
  },
  {
    id: "serviceCupping",
    en: "/services/cupping-therapy",
    es: "/es/servicios/terapia-de-ventosas",
    pt: null,
    ht: null,
  },
  {
    id: "conditionBackPain",
    en: "/conditions/back-pain",
    es: "/es/condiciones/dolor-de-espalda",
    pt: null,
    ht: null,
  },
  {
    id: "conditionNeckPain",
    en: "/conditions/neck-pain",
    es: "/es/condiciones/dolor-de-cuello",
    pt: null,
    ht: null,
  },
  {
    id: "conditionSciatica",
    en: "/conditions/sciatica",
    es: "/es/condiciones/ciatica",
    pt: null,
    ht: null,
  },
  {
    id: "conditionWhiplash",
    en: "/conditions/whiplash",
    es: "/es/condiciones/latigazo-cervical",
    pt: null,
    ht: null,
  },
  {
    id: "conditionCervicogenic",
    en: "/conditions/cervicogenic-headache",
    es: "/es/condiciones/dolor-de-cabeza-cervicogenico",
    pt: null,
    ht: null,
  },
  {
    id: "conditionConcussion",
    en: "/conditions/concussion",
    es: "/es/condiciones/conmocion-cerebral",
    pt: null,
    ht: null,
  },
  {
    id: "conditionTmj",
    en: "/conditions/tmj-jaw-pain",
    es: "/es/condiciones/dolor-de-mandibula-atm",
    pt: null,
    ht: null,
  },
];

/** The nineteen service-area city pairs, derived rather than typed.
 *
 * These live OUTSIDE `localizedRoutes` on purpose. That array is checked
 * against the two static route registries (content/seo.ts and
 * content/es/seo.ts) by content/i18n.test.ts — every entry must appear in
 * both — and the English city pages are not in content/seo.ts at all: they
 * are served through the content repository (`listPublicContent`,
 * `contentType: "service_area"`), the same mechanism the blog uses. Adding
 * them to `localizedRoutes` would mean either breaking that registry check
 * or registering nineteen English routes that the English sitemap would
 * then emit twice.
 *
 * So they are a second, derived table. Everything downstream —
 * `findRouteByPath`, `counterpartPath`, `buildAlternates` — consults both,
 * which means hreflang, the language switcher and the sitemap's alternates
 * all behave identically for a city page and a static page.
 *
 * Derived from `esServiceAreaCities` (which is itself checked against
 * content/service-areas.ts at module load) so the pairing cannot drift: a
 * city cannot appear on one side only.
 */
export const serviceAreaLocalizedRoutes: LocalizedRoute[] = esServiceAreaCities.map((city) => ({
  id: `serviceArea:${city.slug}`,
  en: `/service-areas/${city.slug}`,
  es: `/es/areas-de-servicio/${city.slug}`,
  // No pt/ht city pages exist — see this file's header comment on why every
  // route defaults to null here rather than a guessed path.
  pt: null,
  ht: null,
}));

/** Every pair the site knows about, static and service-area alike. Use this
 * for path lookups; use `localizedRoutes` when you specifically mean the
 * statically-registered routes. */
export const allLocalizedRoutes: LocalizedRoute[] = [
  ...localizedRoutes,
  ...serviceAreaLocalizedRoutes,
];

/** Looks a pair up by its stable id — throws rather than returning
 * undefined so a typo in a link fails at build time, matching
 * content/seo.ts's getRoute(). */
export function getLocalizedRoute(id: string): LocalizedRoute {
  const route = allLocalizedRoutes.find((entry) => entry.id === id);
  if (!route) throw new Error(`content/i18n.ts: no localized route registered for id "${id}"`);
  return route;
}

/** The path for `id` in `locale`, or null when that locale has no page for
 * it. Call sites that render a link must handle null explicitly (skip the
 * link, or fall back to the English URL with an explicit hrefLang) rather
 * than silently linking a Spanish reader to English. */
export function localePath(id: string, locale: Locale): string | null {
  return getLocalizedRoute(id)[locale];
}

/** The English home page is registered as "" (so `${siteUrl}${path}` yields
 * a bare origin, the convention content/seo.ts has always used), but every
 * runtime source of a path — usePathname(), a request URL, a link href —
 * spells it "/". Normalizing here is what lets the same route table answer
 * lookups from both. Without it the language switcher silently disappeared
 * on both home pages, which is exactly the sort of null-returns-quietly bug
 * this table's `null` convention makes easy to miss. */
function normalizePath(path: string): string {
  return path === "/" ? "" : path.replace(/\/$/, "");
}

/** Reverse lookup: the pair that owns `path` in `locale`, or null if the
 * path isn't a registered route for that locale. */
export function findRouteByPath(path: string, locale: Locale): LocalizedRoute | null {
  const normalized = normalizePath(path);
  return allLocalizedRoutes.find((entry) => entry[locale] === normalized) ?? null;
}

/** The equivalent page in the other language, for the language switcher.
 *
 * Returns the counterpart's path, or null when this page has no
 * counterpart. Deliberately never falls back to the other locale's home
 * page: sending someone who asked for "this page in Spanish" to /es
 * instead is a worse answer than not offering the switch, and it's how
 * a language switcher ends up looking broken. Callers hide the control
 * when this returns null.
 */
export function counterpartPath(path: string, from: Locale, to: Locale): string | null {
  const route = findRouteByPath(path, from);
  if (!route) return null;
  return route[to];
}

/** Absolute URL for a path, using the configured production origin. */
export function absoluteUrl(siteUrl: string, path: string): string {
  // The home page is "" (not "/"), which would produce a bare origin with
  // no trailing slash — fine and canonical for a root URL, and consistent
  // with what app/sitemap.ts already emitted for English before this work.
  return `${siteUrl}${path}`;
}

export interface AlternateLinks {
  /** hreflang code -> absolute URL, including "x-default". */
  languages: Record<string, string>;
}

/** Builds the reciprocal hreflang set for whichever locale is rendering.
 *
 * Generalized (ATS-SEO-134) to N locales: emits one entry per locale that
 * actually has a non-null path for this route, plus x-default. English
 * (`route.en`) is always present — every route has an English path by
 * construction — so a route with no translations at all still returns
 * null here (a one-entry hreflang set annotates nothing, and Google
 * requires the annotations to be reciprocal, so a lone self-referential
 * alternate is noise at best), matching the original 2-locale behavior
 * exactly for every route that currently has `pt: null, ht: null`. Once a
 * route gets a real pt or ht path, this function starts including it
 * automatically — no call site changes needed.
 *
 * Both the HTML `<link rel="alternate">` tags and the sitemap's per-URL
 * alternates read this same function, so the two can never describe
 * different pairings.
 *
 * x-default points at the English URL: it's the version to serve a user
 * whose language doesn't match any annotated locale.
 */
export function buildAlternates(
  siteUrl: string,
  path: string,
  locale: Locale,
): AlternateLinks | null {
  const route = findRouteByPath(path, locale);
  if (!route) return null;
  return buildAlternatesForRoute(siteUrl, route);
}

/** The pure N-way hreflang logic `buildAlternates` runs once it has a
 * route in hand — split out so it's directly testable against a synthetic
 * route (proving the pt/ht generalization actually works) without having
 * to mutate the real, currently-all-null-pt/ht route table to do it. */
export function buildAlternatesForRoute(
  siteUrl: string,
  route: LocalizedRoute,
): AlternateLinks | null {
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    const localizedPath = route[loc];
    if (localizedPath === null) continue;
    languages[HREFLANG[loc]] = absoluteUrl(siteUrl, localizedPath);
  }
  // Only English (self) present -> no real translation exists, same as the
  // original "route.es === null -> return null" check.
  if (Object.keys(languages).length < 2) return null;

  languages["x-default"] = absoluteUrl(siteUrl, route.en);
  return { languages };
}

/** True when `path` belongs to the Spanish subtree. Kept as a thin,
 * backward-compatible wrapper around `localeFromPath` — every existing
 * caller wants exactly this boolean, and rewriting them to compare against
 * `localeFromPath(path) === "es"` inline is a call-site change this ticket
 * doesn't need to make just to add pt/ht detection underneath. */
export function isSpanishPath(path: string): boolean {
  return localeFromPath(path) === "es";
}

/** The locale a URL path belongs to. Generalized (ATS-SEO-134) to check
 * every non-English prefix, not just Spanish's. English has no prefix
 * (`LOCALE_PREFIX.en === ""`), so it's implicitly the fallback — checked
 * last, never as a `path.startsWith("")` match (which would be true for
 * every path and short-circuit everything else). */
export function localeFromPath(path: string): Locale {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    const prefix = LOCALE_PREFIX[locale];
    if (path === prefix || path.startsWith(`${prefix}/`)) return locale;
  }
  return DEFAULT_LOCALE;
}
