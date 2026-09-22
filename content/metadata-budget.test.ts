import { describe, expect, it } from "vitest";

import { esRoutes } from "@/content/es/seo";
import {
  esServiceAreaCities,
  esServiceAreaMetaDescription,
  esServiceAreaTitle,
} from "@/content/es/service-areas-cities";
import { htRoutes } from "@/content/ht/seo";
import { ptRoutes } from "@/content/pt/seo";
import { isPublished, routes, type RouteMeta } from "@/content/seo";

/** ATS-A05 regression coverage.
 *
 * Google truncates a SERP title around 600px and a description around
 * 920px — both are pixel budgets, not character counts, so these limits are
 * deliberately generous rather than a strict 60/155 style rule. They exist to
 * catch a *template* that has run away (the Spanish city pages shipped
 * 170–181 character descriptions across all nineteen), not to police a title
 * that happens to land at 62.
 *
 * Only indexable routes are checked. Noindex utility pages (/thank-you,
 * /es/gracias, error pages) are intentionally exempt — their metadata never
 * reaches a SERP. */
const TITLE_BUDGET = 65;
const DESCRIPTION_MAX = 160;
const DESCRIPTION_MIN = 70;

const LOCALE_ROUTES: { locale: string; entries: RouteMeta[] }[] = [
  { locale: "en", entries: routes },
  { locale: "es", entries: esRoutes },
  { locale: "pt", entries: ptRoutes },
  { locale: "ht", entries: htRoutes },
];

describe("Spanish service-area city templates", () => {
  it("covers all nineteen cities", () => {
    expect(esServiceAreaCities).toHaveLength(19);
  });

  it("keeps every generated title inside the SERP budget", () => {
    const over = esServiceAreaCities
      .map((city) => ({ city: city.communityName, title: esServiceAreaTitle(city) }))
      .filter((row) => row.title.length > TITLE_BUDGET);

    expect(over).toEqual([]);
  });

  it("keeps every generated description between the minimum and maximum", () => {
    const bad = esServiceAreaCities
      .map((city) => ({
        city: city.communityName,
        length: esServiceAreaMetaDescription(city).length,
      }))
      .filter((row) => row.length > DESCRIPTION_MAX || row.length < DESCRIPTION_MIN);

    expect(bad).toEqual([]);
  });

  it("front-loads the city name so it survives truncation", () => {
    for (const city of esServiceAreaCities) {
      const title = esServiceAreaTitle(city);
      expect(title).toContain(city.communityName);
      // The city must appear within the part of the title that actually renders.
      expect(title.indexOf(city.communityName)).toBeLessThan(TITLE_BUDGET - 10);
    }
  });

  it("keeps the eligibility hedge in the description — never an unqualified promise", () => {
    for (const city of esServiceAreaCities) {
      expect(esServiceAreaMetaDescription(city)).toContain("elegibles");
    }
  });

  it("names the real Deerfield Beach office rather than implying one per city", () => {
    for (const city of esServiceAreaCities) {
      expect(esServiceAreaMetaDescription(city)).toContain("Deerfield Beach");
    }
  });
});

describe("registry metadata budgets", () => {
  for (const { locale, entries } of LOCALE_ROUTES) {
    it(`[${locale}] every indexable route has a description within budget`, () => {
      const bad = entries
        .filter(isPublished)
        .map((route) => ({ path: route.path || "/", length: route.description.length }))
        .filter((row) => row.length > DESCRIPTION_MAX || row.length < DESCRIPTION_MIN);

      expect(bad).toEqual([]);
    });

    it(`[${locale}] every indexable route has a non-empty title and description`, () => {
      for (const route of entries.filter(isPublished)) {
        expect(route.title.trim().length).toBeGreaterThan(0);
        expect(route.description.trim().length).toBeGreaterThan(0);
      }
    });
  }
});
