import { describe, expect, it } from "vitest";

import { esRoutes } from "@/content/es/seo";
import { htRoutes } from "@/content/ht/seo";
import { ptRoutes } from "@/content/pt/seo";
import { routes } from "@/content/seo";

/** Ahrefs Site Audit 2026-09-17 flagged 10 overlong titles, 27 long + 3
 * short meta descriptions, and 3 pages with no Open Graph image — see
 * SEO_QA_EVIDENCE/2026-09-21-site-audit-report.md. Fixed as of 2026-09-22,
 * across all 4 locale registries (the flagged pages were only what that one
 * crawl happened to reach — ES/PT/HT titles had the identical root cause).
 * These gates keep it fixed: a route that regresses past budget now fails
 * the build instead of waiting for the next Ahrefs recrawl to notice.
 *
 * Budgets are deliberately a little looser than Google's real ~50-60/~150-160
 * char SERP truncation points (titles up to 70, descriptions 100-155) — the
 * goal is catching genuine outliers like the ones this audit found, not
 * forcing every already-reasonable title/description to the exact limit. */
const TITLE_MAX = 70;
const DESCRIPTION_MIN = 100;
const DESCRIPTION_MAX = 155;

const locales: Array<{ name: string; routes: typeof routes }> = [
  { name: "EN", routes },
  { name: "ES", routes: esRoutes },
  { name: "PT", routes: ptRoutes },
  { name: "HT", routes: htRoutes },
];

describe("SEO SERP budget (title/description length, OG image) across every locale", () => {
  for (const { name, routes: localeRoutes } of locales) {
    it(`${name}: no title exceeds ${TITLE_MAX} chars`, () => {
      const overLong = localeRoutes
        .filter((route) => route.title.length > TITLE_MAX)
        .map((route) => `${route.path} (${route.title.length}): "${route.title}"`);
      expect(overLong).toEqual([]);
    });

    it(`${name}: every description is between ${DESCRIPTION_MIN} and ${DESCRIPTION_MAX} chars`, () => {
      const outOfBudget = localeRoutes
        .filter(
          (route) =>
            route.description.length < DESCRIPTION_MIN ||
            route.description.length > DESCRIPTION_MAX,
        )
        .map((route) => `${route.path} (${route.description.length}): "${route.description}"`);
      expect(outOfBudget).toEqual([]);
    });

    it(`${name}: every route has an Open Graph image`, () => {
      const missingImage = localeRoutes.filter((route) => !route.image).map((route) => route.path);
      expect(missingImage).toEqual([]);
    });
  }
});
