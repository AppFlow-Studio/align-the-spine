import { describe, expect, it } from "vitest";

import { getFooterConfig, getNav } from "@/content/chrome";
import { getEsRoute } from "@/content/es/seo";
import { getHtRoute } from "@/content/ht/seo";
import type { Locale } from "@/content/i18n";
import { getPtRoute } from "@/content/pt/seo";
import { getRoute, isPublished, type RouteMeta } from "@/content/seo";

const LOCALES: Locale[] = ["en", "es", "pt", "ht"];

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
        if (!isPublished(lookupRoute(link.href, locale))) {
          offenders.push(link.href);
        }
        for (const item of link.menu ?? []) {
          if (!isPublished(lookupRoute(item.href, locale))) {
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
        .filter((href) => !isPublished(lookupRoute(href, locale)));

      expect(offenders).toEqual([]);
    });
  }
});
