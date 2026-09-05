import type { Metadata } from "next";
import { describe, expect, it } from "vitest";

import { esRoutes } from "@/content/es/seo";
import { htRoutes } from "@/content/ht/seo";
import {
  absoluteUrl,
  allLocalizedRoutes,
  buildAlternates,
  findRouteByPath,
  HREFLANG,
  LOCALE_PREFIX,
  LOCALES,
  type Locale,
  type LocalizedRoute,
} from "@/content/i18n";
import { ptRoutes } from "@/content/pt/seo";
import { routes } from "@/content/seo";
import { siteConfig } from "@/content/site";
import {
  buildEsRouteMetadata,
  buildHtRouteMetadata,
  buildPtRouteMetadata,
  buildRouteMetadata,
} from "@/lib/seo/metadata";

/** ATS-SEO-138's explicit automated-validation list, each as its own
 * describe block so a failure names exactly which property broke:
 * self-reference, reciprocity, target existence, canonical target
 * agreement, language-code validity, and staging-host leakage.
 *
 * This is deliberately a separate file from content/i18n.test.ts rather
 * than more tests folded into it: those tests exercise the Spanish layer
 * specifically (and, incrementally, Portuguese/Haitian Creole) as it was
 * built; this file exercises the N-locale hreflang CONTRACT itself,
 * exhaustively, over every real route this site has today — including
 * `allLocalizedRoutes` (so the derived service-area city pairs are
 * covered, not just the static registry) and every entry in all four
 * RouteMeta registries (so canonical-target-agreement is checked from the
 * metadata-builder side, not just the route-table side). A route added
 * next month is covered automatically; nothing here is a hand-picked
 * example route.
 */

const clusterableRoutes: LocalizedRoute[] = allLocalizedRoutes.filter(
  (route) => LOCALES.filter((locale) => route[locale] !== null).length >= 2,
);

describe("ATS-SEO-138: self-reference", () => {
  it("every route's hreflang cluster includes an entry for each of its own non-null locales", () => {
    for (const route of clusterableRoutes) {
      const alternates = buildAlternates(siteConfig.siteUrl, route.en, "en");
      expect(alternates, `${route.id}: expected a cluster, got null`).not.toBeNull();

      for (const locale of LOCALES) {
        const path = route[locale];
        if (path === null) continue;
        const selfKey = HREFLANG[locale];
        expect(
          alternates?.languages[selfKey],
          `${route.id}: missing self-reference for locale "${locale}" (hreflang "${selfKey}")`,
        ).toBe(absoluteUrl(siteConfig.siteUrl, path));
      }
    }
  });

  it("every route's cluster is reachable starting from ANY of its own locale paths, not just English", () => {
    // The self-reference guarantee only means something if it holds no
    // matter which side of the pair you ask from — asking from the
    // Portuguese path must return a cluster that itself contains the
    // Portuguese entry, not just the English-computed one re-labeled.
    for (const route of clusterableRoutes) {
      for (const locale of LOCALES) {
        const path = route[locale];
        if (path === null) continue;
        const alternates = buildAlternates(siteConfig.siteUrl, path, locale);
        expect(
          alternates?.languages[HREFLANG[locale]],
          `${route.id}: querying from its own "${locale}" path didn't return a self-entry`,
        ).toBe(absoluteUrl(siteConfig.siteUrl, path));
      }
    }
  });
});

describe("ATS-SEO-138: reciprocity", () => {
  it("every non-null locale in a route returns the identical cluster (both membership and x-default)", () => {
    // Generalizes content/i18n.test.ts's English<->Spanish-only reciprocity
    // check to all 4 locales and to the derived service-area city pairs —
    // a mismatch here is exactly how Google discards a hreflang annotation
    // as invalid (it requires every page in a cluster to agree).
    for (const route of clusterableRoutes) {
      const presentLocales = LOCALES.filter((locale) => route[locale] !== null);
      const clusters = presentLocales.map((locale) =>
        buildAlternates(siteConfig.siteUrl, route[locale] as string, locale),
      );
      const [first, ...rest] = clusters;
      for (let i = 0; i < rest.length; i++) {
        expect(
          rest[i],
          `${route.id}: cluster from "${presentLocales[i + 1]}" disagrees with the cluster from "${presentLocales[0]}"`,
        ).toEqual(first);
      }
    }
  });
});

describe("ATS-SEO-138: target existence", () => {
  const registryPaths: Record<Locale, Set<string>> = {
    en: new Set(routes.map((route) => route.path)),
    es: new Set(esRoutes.map((route) => route.path)),
    pt: new Set(ptRoutes.map((route) => route.path)),
    ht: new Set(htRoutes.map((route) => route.path)),
  };

  it("every non-null path in the static route table (localizedRoutes) is registered in its locale's RouteMeta registry", () => {
    // Service-area city pairs are deliberately excluded here: their English
    // side is CMS-driven (no static RouteMeta entry — see
    // content/i18n.ts's own comment on serviceAreaLocalizedRoutes), so this
    // check only makes sense for the statically-registered routes.
    for (const route of allLocalizedRoutes) {
      if (route.id.startsWith("serviceArea:")) continue;
      for (const locale of LOCALES) {
        const path = route[locale];
        if (path === null) continue;
        expect(
          registryPaths[locale].has(path),
          `${route.id}: "${locale}" path "${path}" has no matching entry in its RouteMeta registry`,
        ).toBe(true);
      }
    }
  });

  it("every hreflang alternate this site can emit points at a path some registry (or the derived city table) actually knows about", () => {
    const cityPaths: Record<Locale, Set<string>> = {
      en: new Set(),
      es: new Set(),
      pt: new Set(),
      ht: new Set(),
    };
    for (const route of allLocalizedRoutes) {
      if (!route.id.startsWith("serviceArea:")) continue;
      for (const locale of LOCALES) {
        const path = route[locale];
        if (path !== null) cityPaths[locale].add(path);
      }
    }

    for (const route of clusterableRoutes) {
      for (const locale of LOCALES) {
        const path = route[locale];
        if (path === null) continue;
        const known = registryPaths[locale].has(path) || cityPaths[locale].has(path);
        expect(known, `${route.id}: "${locale}" alternate "${path}" is registered nowhere`).toBe(
          true,
        );
      }
    }
  });
});

describe("ATS-SEO-138: canonical target agreement", () => {
  /** Checks an ALREADY-BUILT Metadata object (from the real builder every
   * page.tsx calls — this never reimplements buildMetadata's own logic)
   * against its route's expected canonical, and against its own entry in
   * its `alternates.languages` cluster. The two are built from the same
   * `route.path`/`buildAlternates` call inside buildMetadata(), so
   * disagreement here would mean buildMetadata() itself regressed, not a
   * content mistake.
   *
   * Whether a self-hreflang entry is REQUIRED (not just checked when
   * present) is derived from content/i18n.ts's own route table via
   * `findRouteByPath` — a page whose route has 2+ real locales must carry
   * its own hreflang self-entry; a genuinely English-only page (e.g.
   * /privacy-policy) correctly has none. Treating "hreflang absent" as
   * automatically OK (rather than deriving whether it should be present)
   * is exactly the gap that let a locale-mismatched buildMetadata() call
   * pass silently in an earlier draft of this file — confirmed by
   * mutation-testing buildEsRouteMetadata's `locale` argument before this
   * fix landed. */
  function assertCanonicalAgreesWithSelf(locale: Locale, path: string, metadata: Metadata) {
    const canonical = metadata.alternates?.canonical as string | undefined;
    const expected = absoluteUrl(siteConfig.siteUrl, path);
    expect(canonical, `${locale} "${path}": canonical is missing`).toBe(expected);

    const route = findRouteByPath(path, locale);
    const localeCount = route ? LOCALES.filter((loc) => route[loc] !== null).length : 0;
    const requiresHreflang = localeCount >= 2;

    const languages = metadata.alternates?.languages as Record<string, string> | undefined;
    const selfHreflang = languages?.[HREFLANG[locale]];

    if (requiresHreflang) {
      expect(
        selfHreflang,
        `${locale} "${path}": route has ${localeCount} real locales, so a self hreflang entry is required, but alternates.languages was ${languages ? "missing the key" : "absent entirely"}`,
      ).toBe(canonical);
    } else {
      expect(
        languages,
        `${locale} "${path}": route has no real translation, so alternates.languages should be entirely absent, not present`,
      ).toBeUndefined();
    }
  }

  it("English routes self-canonicalize and agree with their own hreflang entry", () => {
    for (const route of routes) {
      assertCanonicalAgreesWithSelf("en", route.path, buildRouteMetadata(route));
    }
  });

  it("Spanish routes self-canonicalize and agree with their own hreflang entry", () => {
    for (const route of esRoutes) {
      assertCanonicalAgreesWithSelf("es", route.path, buildEsRouteMetadata(route));
    }
  });

  it("Portuguese routes self-canonicalize and agree with their own hreflang entry", () => {
    for (const route of ptRoutes) {
      assertCanonicalAgreesWithSelf("pt", route.path, buildPtRouteMetadata(route));
    }
  });

  it("Haitian Creole routes self-canonicalize and agree with their own hreflang entry", () => {
    for (const route of htRoutes) {
      assertCanonicalAgreesWithSelf("ht", route.path, buildHtRouteMetadata(route));
    }
  });

  it("never canonicalizes a translated route back to its English original", () => {
    // The specific regression this ticket names by name: "never
    // canonicalize ES/PT/HT back to English merely because they are
    // translations."
    const translatedMetadata = [
      ...esRoutes.map((route) => buildEsRouteMetadata(route)),
      ...ptRoutes.map((route) => buildPtRouteMetadata(route)),
      ...htRoutes.map((route) => buildHtRouteMetadata(route)),
    ];
    const englishCanonicals = new Set(
      routes.map((route) => absoluteUrl(siteConfig.siteUrl, route.path)),
    );

    for (const metadata of translatedMetadata) {
      const canonical = metadata.alternates?.canonical;
      expect(canonical).not.toBe(siteConfig.siteUrl);
      expect(englishCanonicals.has(canonical as string)).toBe(false);
    }
  });
});

describe("ATS-SEO-138: language-code validity", () => {
  it("every hreflang code this site can emit is a valid language tag (language-region pair, or bare ISO 639-1)", () => {
    const seen = new Set<string>();
    for (const route of clusterableRoutes) {
      const alternates = buildAlternates(siteConfig.siteUrl, route.en, "en");
      for (const key of Object.keys(alternates?.languages ?? {})) seen.add(key);
    }
    expect(seen.size).toBeGreaterThan(0); // sanity: the real table has real clusters to check

    for (const code of seen) {
      if (code === "x-default") continue;
      const isLanguageRegion = /^[a-z]{2}-[A-Z]{2}$/.test(code);
      const isBareLanguage = /^[a-z]{2}$/.test(code);
      expect(isLanguageRegion || isBareLanguage, `invalid hreflang code emitted: "${code}"`).toBe(
        true,
      );
    }
  });

  it("never emits a duplicate hreflang code within one cluster", () => {
    // Two entries claiming the same hreflang code (e.g. two "es-US"
    // targets) is invalid regardless of what each individually points at.
    for (const route of clusterableRoutes) {
      const presentLocales = LOCALES.filter((locale) => route[locale] !== null);
      const codes = presentLocales.map((locale) => HREFLANG[locale]);
      expect(new Set(codes).size, `${route.id}: duplicate hreflang code in cluster`).toBe(
        codes.length,
      );
    }
  });
});

describe("ATS-SEO-138: staging-host leakage", () => {
  const FORBIDDEN_HOST_PATTERNS = [
    /localhost/i,
    /127\.0\.0\.1/,
    /\.vercel\.app/i,
    /staging/i,
    /\bpreview\b/i,
    /\bdev\b\./i,
  ];

  it("siteConfig.siteUrl is the real production host over https, with no trailing slash", () => {
    expect(siteConfig.siteUrl).toBe("https://www.chirobackpain.com");
    expect(siteConfig.siteUrl.startsWith("https://")).toBe(true);
    expect(siteConfig.siteUrl.endsWith("/")).toBe(false);
    for (const pattern of FORBIDDEN_HOST_PATTERNS) {
      expect(pattern.test(siteConfig.siteUrl), `siteUrl matched forbidden pattern ${pattern}`).toBe(
        false,
      );
    }
  });

  it("every canonical and hreflang URL this site can emit is rooted at siteConfig.siteUrl and carries no staging host", () => {
    for (const route of clusterableRoutes) {
      const alternates = buildAlternates(siteConfig.siteUrl, route.en, "en");
      for (const url of Object.values(alternates?.languages ?? {})) {
        expect(
          url === siteConfig.siteUrl || url.startsWith(`${siteConfig.siteUrl}/`),
          `${route.id}: alternate URL "${url}" is not rooted at the production site URL`,
        ).toBe(true);
        for (const pattern of FORBIDDEN_HOST_PATTERNS) {
          expect(
            pattern.test(url),
            `${route.id}: alternate URL "${url}" leaks a staging host`,
          ).toBe(false);
        }
      }
    }
  });

  it("every registry's real canonical URLs are all on the production host", () => {
    for (const [registry, build] of [
      [routes, buildRouteMetadata],
      [esRoutes, buildEsRouteMetadata],
      [ptRoutes, buildPtRouteMetadata],
      [htRoutes, buildHtRouteMetadata],
    ] as const) {
      for (const route of registry) {
        const canonical = build(route).alternates?.canonical as string;
        expect(canonical.startsWith(siteConfig.siteUrl)).toBe(true);
        for (const pattern of FORBIDDEN_HOST_PATTERNS) {
          expect(pattern.test(canonical)).toBe(false);
        }
      }
    }
  });
});

describe("ATS-SEO-138: URL shape conventions (lowercase, ASCII, no trailing slash, correct prefix)", () => {
  // content/i18n.test.ts's "Spanish URL shape" describe block already
  // covers Spanish specifically (and predates this file); this block
  // generalizes the same three checks to all four locales so Portuguese
  // and Haitian Creole get the identical guarantee, not just Spanish.
  const localeRegistries: Record<Locale, { path: string }[]> = {
    en: routes,
    es: esRoutes,
    pt: ptRoutes,
    ht: htRoutes,
  };

  for (const locale of LOCALES) {
    it(`keeps every "${locale}" path lowercase, ASCII, and without a trailing slash`, () => {
      for (const route of localeRegistries[locale]) {
        // The English home page is registered as "" by convention (see
        // content/i18n.ts) so that `${siteUrl}${path}` yields a bare
        // origin — a legitimate exception to "non-empty path", not a
        // trailing-slash violation.
        if (route.path === "") continue;
        expect(route.path).toBe(route.path.toLowerCase());
        expect(route.path.endsWith("/")).toBe(false);
        // No accented characters in slugs (true across all 4 languages'
        // registries, including Portuguese/Haitian Creole's own accented
        // vocabulary): a percent-encoded character is legal but reads as
        // %C3%A8 everywhere the URL is copied, pasted or reported on.
        expect(/^[a-z0-9/-]+$/.test(route.path)).toBe(true);
      }
    });

    // English has no prefix (it lives at the site root by design — see
    // content/i18n.ts's LOCALE_PREFIX doc comment), so there is nothing to
    // assert here for "en"; skip rather than emit a vacuous always-passing
    // test for it.
    if (locale === "en") continue;

    it(`puts every "${locale}" route under its own locale prefix`, () => {
      const prefix = LOCALE_PREFIX[locale];
      for (const route of localeRegistries[locale]) {
        expect(route.path === prefix || route.path.startsWith(`${prefix}/`)).toBe(true);
      }
    });
  }
});
