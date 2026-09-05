import { describe, expect, it } from "vitest";

import { esBookingCta, esFooter, esNav } from "@/content/es/chrome";
import { esRoutes } from "@/content/es/seo";
import { htRoutes } from "@/content/ht/seo";
import {
  buildAlternates,
  buildAlternatesForRoute,
  counterpartPath,
  DEFAULT_LOCALE,
  HREFLANG,
  HTML_LANG,
  LOCALE_ENDONYM,
  LOCALE_PREFIX,
  localeFromPath,
  LOCALES,
  localizedRoutes,
  OG_LOCALE,
  serviceAreaLocalizedRoutes,
  type LocalizedRoute,
} from "@/content/i18n";
import { ptRoutes } from "@/content/pt/seo";
import { isPublished, routes } from "@/content/seo";
import { siteConfig } from "@/content/site";

/** Locale QA (§Content completeness check / §hreflang validation in
 * SPANISH_SEO_IMPLEMENTATION_REPORT.md).
 *
 * The whole Spanish layer hangs off content/i18n.ts's route pairs: the
 * hreflang tags, the sitemap alternates, the language switcher and the
 * Spanish internal links all read that one table. These tests are what stop
 * the table and the two route registries from drifting apart — the failure
 * mode where a Spanish page ships with a canonical but no reciprocal
 * hreflang partner, or a nav link points at a Spanish URL nothing serves,
 * and nothing notices until Search Console does.
 */

const enPaths = new Set(routes.map((route) => route.path));
const esPaths = new Set(esRoutes.map((route) => route.path));
const ptPaths = new Set(ptRoutes.map((route) => route.path));
const htPaths = new Set(htRoutes.map((route) => route.path));
const pairsWithSpanish = localizedRoutes.filter((route) => route.es !== null);
const pairsWithPortuguese = localizedRoutes.filter((route) => route.pt !== null);
const pairsWithHaitianCreole = localizedRoutes.filter((route) => route.ht !== null);

describe("locale route map ↔ route registries", () => {
  it("registers every pair's English path in content/seo.ts", () => {
    const missing = localizedRoutes.filter((route) => !enPaths.has(route.en));
    expect(missing.map((route) => route.id)).toEqual([]);
  });

  it("registers every pair's Spanish path in content/es/seo.ts", () => {
    const missing = pairsWithSpanish.filter((route) => !esPaths.has(route.es as string));
    expect(missing.map((route) => route.id)).toEqual([]);
  });

  it("pairs every route in the Spanish registry", () => {
    const paired = new Set(pairsWithSpanish.map((route) => route.es as string));
    const orphans = [...esPaths].filter((path) => !paired.has(path));
    expect(orphans).toEqual([]);
  });

  // ATS-SEO-135/138: the same drift Spanish already guards against — a
  // route-table entry claiming a Portuguese path content/pt/seo.ts never
  // registered (target doesn't exist), or a Portuguese registry entry with
  // no route-table pair pointing at it (orphan, so no hreflang/language
  // switcher ever reaches it).
  it("registers every pair's Portuguese path in content/pt/seo.ts", () => {
    const missing = pairsWithPortuguese.filter((route) => !ptPaths.has(route.pt as string));
    expect(missing.map((route) => route.id)).toEqual([]);
  });

  it("pairs every route in the Portuguese registry", () => {
    const paired = new Set(pairsWithPortuguese.map((route) => route.pt as string));
    const orphans = [...ptPaths].filter((path) => !paired.has(path));
    expect(orphans).toEqual([]);
  });

  // ATS-SEO-136/138: identical guarantee for Haitian Creole.
  it("registers every pair's Haitian Creole path in content/ht/seo.ts", () => {
    const missing = pairsWithHaitianCreole.filter((route) => !htPaths.has(route.ht as string));
    expect(missing.map((route) => route.id)).toEqual([]);
  });

  it("pairs every route in the Haitian Creole registry", () => {
    const paired = new Set(pairsWithHaitianCreole.map((route) => route.ht as string));
    const orphans = [...htPaths].filter((path) => !paired.has(path));
    expect(orphans).toEqual([]);
  });

  it("covers every English registry route, even the English-only ones", () => {
    // A route absent from the map has no *declared* language status — it
    // would silently emit no hreflang whether or not that was intended.
    // `es: null` is how "English-only, deliberately" gets recorded.
    const mapped = new Set(localizedRoutes.map((route) => route.en));
    const unmapped = [...enPaths].filter((path) => !mapped.has(path));
    expect(unmapped).toEqual([]);
  });

  it("uses unique ids and unique paths", () => {
    const ids = localizedRoutes.map((route) => route.id);
    expect(new Set(ids).size).toBe(ids.length);

    const en = localizedRoutes.map((route) => route.en);
    expect(new Set(en).size).toBe(en.length);

    const es = pairsWithSpanish.map((route) => route.es);
    expect(new Set(es).size).toBe(es.length);

    const pt = pairsWithPortuguese.map((route) => route.pt);
    expect(new Set(pt).size).toBe(pt.length);

    const ht = pairsWithHaitianCreole.map((route) => route.ht);
    expect(new Set(ht).size).toBe(ht.length);
  });
});

describe("Spanish URL shape", () => {
  it("puts every Spanish route under /es", () => {
    for (const route of esRoutes) {
      expect(route.path === "/es" || route.path.startsWith("/es/")).toBe(true);
    }
  });

  it("keeps Spanish paths lowercase, ASCII, and without a trailing slash", () => {
    for (const route of esRoutes) {
      // Follows the existing English normalization (Next's default
      // `trailingSlash: false`) rather than introducing a second convention.
      expect(route.path).toBe(route.path.toLowerCase());
      expect(route.path.endsWith("/")).toBe(false);
      // No accented characters in slugs: a percent-encoded ñ is legal but
      // reads as %C3%B1 everywhere the URL is copied, pasted or reported on.
      expect(/^[a-z0-9/-]+$/.test(route.path)).toBe(true);
    }
  });
});

describe("Spanish metadata completeness", () => {
  it("gives every Spanish route a title, description and lastModified", () => {
    for (const route of esRoutes) {
      expect(route.title.trim().length).toBeGreaterThan(0);
      expect(route.description.trim().length).toBeGreaterThan(0);
      expect(route.lastModified).toBeTruthy();
    }
  });

  it("keeps Spanish descriptions to a sensible length", () => {
    // Not a Google rule (there is no fixed limit) — a floor that catches a
    // stub description, and a ceiling that catches a paragraph pasted in.
    for (const route of esRoutes) {
      expect(route.description.length).toBeGreaterThanOrEqual(70);
      expect(route.description.length).toBeLessThanOrEqual(200);
    }
  });

  it("gives every Spanish route a unique title and description", () => {
    const titles = esRoutes.map((route) => route.title);
    expect(new Set(titles).size).toBe(titles.length);

    const descriptions = esRoutes.map((route) => route.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("writes Spanish titles and descriptions in Spanish, not English", () => {
    // A cheap smoke test for the specific regression that matters: an /es
    // page shipping with its English title/description copied over. Looks
    // for English function words that would never appear in this copy.
    //
    // The business name is stripped first: "Align the Spine Chiropractic"
    // is the practice's registered name and its search entity, so it stays
    // English in both languages by design (NAP consistency across
    // locales) — the "the" inside it is not an untranslated string.
    const englishTells = /\b(the|and|your|with|after|our)\b/i;
    const withoutBrand = (value: string) => value.split("Align the Spine").join("");

    for (const route of esRoutes) {
      expect(englishTells.test(withoutBrand(route.title))).toBe(false);
      expect(englishTells.test(withoutBrand(route.description))).toBe(false);
    }
  });
});

describe("hreflang", () => {
  it("emits reciprocal annotations from both sides of every pair", () => {
    for (const route of pairsWithSpanish) {
      const fromEnglish = buildAlternates(siteConfig.siteUrl, route.en, "en");
      const fromSpanish = buildAlternates(siteConfig.siteUrl, route.es as string, "es");

      expect(fromEnglish).not.toBeNull();
      expect(fromSpanish).not.toBeNull();
      // Reciprocity: both pages must describe the same set of alternates,
      // or Google drops the annotation entirely.
      expect(fromEnglish).toEqual(fromSpanish);
    }
  });

  it("points x-default at the English URL and each locale at its own", () => {
    for (const route of pairsWithSpanish) {
      const alternates = buildAlternates(siteConfig.siteUrl, route.en, "en");
      expect(alternates?.languages).toEqual({
        [HREFLANG.en]: `${siteConfig.siteUrl}${route.en}`,
        [HREFLANG.es]: `${siteConfig.siteUrl}${route.es}`,
        // ATS-SEO-135/136 gave nine of these pairs real /pt and /ht
        // counterparts too — include each whenever the route has one, same
        // reciprocal-hreflang rule as Spanish.
        ...(route.pt ? { [HREFLANG.pt]: `${siteConfig.siteUrl}${route.pt}` } : {}),
        ...(route.ht ? { [HREFLANG.ht]: `${siteConfig.siteUrl}${route.ht}` } : {}),
        "x-default": `${siteConfig.siteUrl}${route.en}`,
      });
    }
  });

  it("emits no annotations for a route with no counterpart", () => {
    for (const route of localizedRoutes.filter((entry) => entry.es === null)) {
      expect(buildAlternates(siteConfig.siteUrl, route.en, "en")).toBeNull();
    }
  });

  it("uses absolute URLs on the configured origin", () => {
    for (const route of pairsWithSpanish) {
      const alternates = buildAlternates(siteConfig.siteUrl, route.en, "en");
      for (const url of Object.values(alternates?.languages ?? {})) {
        // The English home page's path is "" (not "/"), so its URL is the
        // bare origin — which is what app/sitemap.ts has always emitted for
        // it, and what buildMetadata already sets as its canonical. Both
        // forms address the same resource; the point of this assertion is
        // that nothing relative or cross-origin slips into an alternate.
        expect(url === siteConfig.siteUrl || url.startsWith(`${siteConfig.siteUrl}/`)).toBe(true);
      }
    }
  });

  it("uses valid hreflang codes — a language-region pair, or a bare ISO 639-1 code", () => {
    // Most locales are a language-region pair (en-US, es-US, pt-BR). Haitian
    // Creole has no widely-used region-qualified variant, so "ht" alone is
    // the correct value (a bare ISO 639-1 code is valid hreflang syntax) —
    // see content/i18n.ts's HTML_LANG doc comment for the reasoning.
    for (const locale of LOCALES) {
      const code = HREFLANG[locale];
      const isLanguageRegion = /^[a-z]{2}-[A-Z]{2}$/.test(code);
      const isBareLanguage = /^[a-z]{2}$/.test(code);
      expect(isLanguageRegion || isBareLanguage).toBe(true);
    }
  });
});

describe("language switcher targets", () => {
  it("round-trips English → Spanish → English for every pair", () => {
    for (const route of pairsWithSpanish) {
      const toSpanish = counterpartPath(route.en, "en", "es");
      expect(toSpanish).toBe(route.es);
      expect(counterpartPath(toSpanish as string, "es", "en")).toBe(route.en);
    }
  });

  it("returns null rather than falling back to a home page", () => {
    // Sending someone who asked for "this page in Spanish" to /es instead
    // is a worse answer than hiding the control, which is what null does.
    for (const route of localizedRoutes.filter((entry) => entry.es === null)) {
      expect(counterpartPath(route.en, "en", "es")).toBeNull();
    }
    expect(counterpartPath("/not-a-route", "en", "es")).toBeNull();
  });
});

describe("Spanish internal link graph", () => {
  // Includes mega-menu items, not just the top-level nav entries — the
  // Servicios dropdown's four destinations are exactly the kind of link
  // that can rot unnoticed, since nothing renders them until a hover.
  const spanishHrefs = [
    ...esNav.flatMap((link) => [link.href, ...(link.menu ?? []).map((item) => item.href)]),
    esBookingCta.href,
    ...esFooter.links.map((link) => link.href),
  ];

  // The Áreas de Servicio dropdown links the nineteen city pages, which
  // live in the derived pair table rather than the static Spanish registry
  // (see serviceAreaLocalizedRoutes in content/i18n.ts for why). They are
  // still real, registered Spanish routes — just registered elsewhere.
  const esCityPaths = new Set(
    serviceAreaLocalizedRoutes.map((entry) => entry.es).filter((path): path is string => !!path),
  );

  it("points every Spanish nav, CTA and footer link at a registered Spanish route", () => {
    for (const href of spanishHrefs) {
      expect(esPaths.has(href) || esCityPaths.has(href), `unregistered Spanish link: ${href}`).toBe(
        true,
      );
    }
  });

  it("keeps the Spanish chrome inside Spanish", () => {
    // The one deliberate exception is the privacy-policy link, which is
    // declared separately and rendered with an explicit hrefLang="en-US"
    // (see content/chrome.ts's getFooterConfig).
    for (const href of spanishHrefs) {
      expect(href.startsWith("/es")).toBe(true);
    }
    expect(esFooter.privacyPolicy.href).toBe("/privacy-policy");
  });
});

describe("publication parity", () => {
  /** Both directions, because each failure mode is real and different:
   *
   *  - Spanish published while English is draft would route around the
   *    clinician-review gate by indexing a translation of unreviewed
   *    medical copy.
   *  - English published while Spanish is draft makes the indexable
   *    English page advertise an hreflang alternate that points at a
   *    noindex URL. Google is being told "here is the Spanish version of
   *    this page" and then told not to index it. That's how /es/condiciones
   *    was caught: the English /conditions hub is published, so its sitemap
   *    entry carried an alternate to a Spanish hub still marked draft.
   */
  it("keeps both halves of every hreflang pair at the same publication status", () => {
    const mismatched = pairsWithSpanish
      .map((route) => {
        const en = routes.find((entry) => entry.path === route.en);
        const es = esRoutes.find((entry) => entry.path === route.es);
        if (!en || !es) return null;
        return isPublished(en) === isPublished(es)
          ? null
          : `${route.en} (${isPublished(en) ? "published" : "draft"}) <-> ${route.es} (${isPublished(es) ? "published" : "draft"})`;
      })
      .filter(Boolean);
    expect(mismatched).toEqual([]);
  });

  it("never publishes a Spanish page whose English original is still draft", () => {
    // The draft routes are noindex pending clinician review of their medical
    // content. Indexing a Spanish translation of unreviewed medical copy
    // would route around that gate rather than respect it.
    for (const route of pairsWithSpanish) {
      const en = routes.find((entry) => entry.path === route.en);
      const es = esRoutes.find((entry) => entry.path === route.es);
      if (es && isPublished(es)) {
        expect(en && isPublished(en)).toBe(true);
      }
    }
  });
});

/** ATS-SEO-134: generalized locale config / route-family coverage. These
 * prove the 4-locale architecture actually works, not just that it compiles
 * — including the N-way hreflang logic for pt/ht, which the real route
 * table can't exercise directly (every entry currently has pt/ht: null; see
 * content/i18n.ts's header comment for why that's deliberate, not
 * unfinished). */
describe("ATS-SEO-134: locale config completeness", () => {
  it("declares exactly the epic's required 4 locales", () => {
    expect(LOCALES).toEqual(["en", "es", "pt", "ht"]);
  });

  it("English remains the default locale and x-default target", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("has an endonym, html-lang, hreflang, og:locale, and URL prefix for every locale", () => {
    for (const locale of LOCALES) {
      expect(LOCALE_ENDONYM[locale]).toBeTruthy();
      expect(HTML_LANG[locale]).toBeTruthy();
      expect(HREFLANG[locale]).toBeTruthy();
      expect(OG_LOCALE[locale]).toBeTruthy();
      // English's prefix is legitimately "" (site root) — every other
      // locale must have a real, non-empty prefix.
      if (locale !== "en") expect(LOCALE_PREFIX[locale]).toBeTruthy();
    }
  });

  it("matches the parent epic's exact required locale model", () => {
    expect(LOCALE_PREFIX).toEqual({ en: "", es: "/es", pt: "/pt", ht: "/ht" });
    expect(HREFLANG.pt).toBe("pt-BR");
    expect(HREFLANG.ht).toBe("ht");
  });

  it("centralizes the 4 language endonyms exactly as specified", () => {
    expect(LOCALE_ENDONYM).toEqual({
      en: "English",
      es: "Español",
      pt: "Português",
      ht: "Kreyòl Ayisyen",
    });
  });

  it("preserves the existing live en-US/es-US hreflang values (no regression)", () => {
    // These 2 are already indexed on 9 published pages — changing them to
    // match the parent epic doc's bare "en"/"es" shorthand would be a real,
    // live hreflang change, not a neutral cleanup. See content/i18n.ts's
    // HTML_LANG doc comment.
    expect(HREFLANG.en).toBe("en-US");
    expect(HREFLANG.es).toBe("es-US");
  });
});

describe("ATS-SEO-134: localeFromPath detects every locale's prefix", () => {
  it("identifies each locale from a path under its prefix", () => {
    expect(localeFromPath("/")).toBe("en");
    expect(localeFromPath("/car-accident-chiropractor")).toBe("en");
    expect(localeFromPath("/es")).toBe("es");
    expect(localeFromPath("/es/servicios")).toBe("es");
    expect(localeFromPath("/pt")).toBe("pt");
    expect(localeFromPath("/pt/servicos")).toBe("pt");
    expect(localeFromPath("/ht")).toBe("ht");
    expect(localeFromPath("/ht/sevis")).toBe("ht");
  });

  it("does not false-positive on an English path that merely starts with another locale's prefix letters", () => {
    // /esteban or /pterodactyl-shaped-slug should never be mistaken for
    // /es or /pt — the check requires an exact prefix or prefix + "/".
    expect(localeFromPath("/esteban")).toBe("en");
    expect(localeFromPath("/pterodactyl")).toBe("en");
    expect(localeFromPath("/html-tips")).toBe("en");
  });
});

describe("ATS-SEO-134: buildAlternatesForRoute — N-way hreflang", () => {
  const siteUrl = siteConfig.siteUrl;

  it("emits all 4 locales plus x-default when every locale has a page", () => {
    const route: LocalizedRoute = {
      id: "test:full",
      en: "/example",
      es: "/es/ejemplo",
      pt: "/pt/exemplo",
      ht: "/ht/egzanp",
    };
    const alternates = buildAlternatesForRoute(siteUrl, route);
    expect(alternates).not.toBeNull();
    expect(alternates?.languages).toEqual({
      "en-US": `${siteUrl}/example`,
      "es-US": `${siteUrl}/es/ejemplo`,
      "pt-BR": `${siteUrl}/pt/exemplo`,
      ht: `${siteUrl}/ht/egzanp`,
      "x-default": `${siteUrl}/example`,
    });
  });

  it("emits only the locales that actually have a page — proves pt/ht can be added independently", () => {
    const route: LocalizedRoute = {
      id: "test:pt-only",
      en: "/example",
      es: null,
      pt: "/pt/exemplo",
      ht: null,
    };
    const alternates = buildAlternatesForRoute(siteUrl, route);
    expect(alternates?.languages).toEqual({
      "en-US": `${siteUrl}/example`,
      "pt-BR": `${siteUrl}/pt/exemplo`,
      "x-default": `${siteUrl}/example`,
    });
    expect(alternates?.languages["es-US"]).toBeUndefined();
    expect(alternates?.languages.ht).toBeUndefined();
  });

  it("returns null (no indexable mixed-language annotation) when only English exists", () => {
    const route: LocalizedRoute = {
      id: "test:en-only",
      en: "/example",
      es: null,
      pt: null,
      ht: null,
    };
    expect(buildAlternatesForRoute(siteUrl, route)).toBeNull();
  });

  it("real route table: pt-BR/ht hreflang is emitted only for the routes ATS-SEO-135/136 actually built", () => {
    // ATS-SEO-135/136 gave the same nine routes real /pt and /ht paths —
    // those, and only those, may emit a pt-BR/ht alternate. Every other
    // route must still emit nothing, so a route table typo can't silently
    // start claiming a Portuguese or Haitian Creole page that doesn't exist.
    for (const route of localizedRoutes) {
      const alternates = buildAlternatesForRoute(siteUrl, route);
      if (route.pt) {
        expect(alternates?.languages["pt-BR"]).toBe(`${siteUrl}${route.pt}`);
      } else {
        expect(alternates?.languages["pt-BR"]).toBeUndefined();
      }
      if (route.ht) {
        expect(alternates?.languages.ht).toBe(`${siteUrl}${route.ht}`);
      } else {
        expect(alternates?.languages.ht).toBeUndefined();
      }
    }
  });
});
