import { describe, expect, it } from "vitest";

import { getFooterConfig, getNav } from "@/content/chrome";
import { getEsRoute } from "@/content/es/seo";
import { esServiceAreaCities } from "@/content/es/service-areas-cities";
import { getHtRoute } from "@/content/ht/seo";
import type { Locale } from "@/content/i18n";
import { getPtRoute } from "@/content/pt/seo";
import { getRoute, isPublished, type RouteMeta } from "@/content/seo";
import { serviceAreas } from "@/content/service-areas";

const LOCALES: Locale[] = ["en", "es", "pt", "ht"];

// /service-areas/[slug] and /es/areas-de-servicio/[slug] are dynamic
// routes with no RouteMeta entry at all — see content/chrome.ts's own
// isServiceAreaCityPath() doc comment for why that's correct, not a gap.
function isServiceAreaCityPath(path: string): boolean {
  return (
    serviceAreas.some((city) => path === `/service-areas/${city.slug}`) ||
    esServiceAreaCities.some((city) => path === `/es/areas-de-servicio/${city.slug}`)
  );
}

function isPublishedPath(path: string, locale: Locale): boolean {
  if (isServiceAreaCityPath(path)) return true;
  return isPublished(lookupRoute(path, locale));
}

function lookupRoute(path: string, locale: Locale): RouteMeta {
  if (locale === "es") return getEsRoute(path);
  if (locale === "pt") return getPtRoute(path);
  if (locale === "ht") return getHtRoute(path);
  return getRoute(path);
}

/** Regression guard for the nav/footer indexability fix (2026-09-17): a
 * primary-nav or footer link must never point at a draft/noindex route, in
 * any locale. Written against the invariant, not today's specific
 * fallback hrefs, so it stays valid once condition/service pages flip to
 * published — the test would then start asserting against each page's own
 * (now-published) href instead of its hub fallback, with no test change
 * needed here. */
describe("getNav never links to a draft/noindex route", () => {
  for (const locale of LOCALES) {
    it(`every top-level and menu-item href in getNav("${locale}") resolves to a published route`, () => {
      const nav = getNav(locale);
      const offenders: string[] = [];

      for (const link of nav) {
        if (!isPublishedPath(link.href, locale)) {
          offenders.push(link.href);
        }
        for (const item of link.menu ?? []) {
          if (!isPublishedPath(item.href, locale)) {
            offenders.push(item.href);
          }
        }
      }

      expect(offenders).toEqual([]);
    });
  }
});

describe("getFooterConfig never links to a draft/noindex route", () => {
  for (const locale of LOCALES) {
    it(`every footer link in getFooterConfig("${locale}") resolves to a published route`, () => {
      const { links } = getFooterConfig(locale);
      const offenders = links
        .map((link) => link.href)
        .filter((href) => !isPublishedPath(href, locale));

      expect(offenders).toEqual([]);
    });
  }
});
