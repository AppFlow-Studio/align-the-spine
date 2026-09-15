import { describe, expect, it } from "vitest";

import { esConditions } from "@/content/es/conditions";
import {
  esAdjustmentsHero,
  esCuppingHero,
  esDecompressionHero,
  esMassageHero,
} from "@/content/es/services-pages";
import { htConditions } from "@/content/ht/conditions";
import {
  htAdjustmentsHero,
  htCuppingHero,
  htDecompressionHero,
  htMassageHero,
} from "@/content/ht/services-pages";
import { ptConditions } from "@/content/pt/conditions";
import {
  ptAdjustmentsHero,
  ptCuppingHero,
  ptDecompressionHero,
  ptMassageHero,
} from "@/content/pt/services-pages";

/** ATS-SEO-070 follow-up: Spanish ↔ Portuguese ↔ Haitian Creole parity for
 * the seven condition pages and four service pages, mirroring the exact
 * failure content/es/content-parity.test.ts already guards against for the
 * homepage/services-grid lists — the three locales silently offering a
 * different set of condition/service pages, not a stale sentence (which
 * this can't detect and isn't supposed to).
 *
 * Compares on `slug` — the structural identity of each condition/service —
 * so a future condition or service added to one locale and forgotten in
 * the other two fails a test instead of shipping a 3-way mismatch. */

const slugs = (items: { slug: string }[]) => items.map((item) => item.slug).sort();

describe("condition page locale parity", () => {
  it("offers the same seven conditions in Spanish, Portuguese, and Haitian Creole", () => {
    expect(slugs(ptConditions)).toEqual(slugs(esConditions));
    expect(slugs(htConditions)).toEqual(slugs(esConditions));
  });
});

describe("service page locale parity", () => {
  // The four service pages aren't collected into one array the way
  // conditions are (each is hand-assembled, see content/es/services-pages.ts's
  // own doc comment on why) — so parity here means the same 4 hero/content
  // sets exist across all three locales, not a slug-array comparison.
  it("has all four service pages' hero content in Spanish, Portuguese, and Haitian Creole", () => {
    const esHeroes = [esAdjustmentsHero, esDecompressionHero, esMassageHero, esCuppingHero];
    const ptHeroes = [ptAdjustmentsHero, ptDecompressionHero, ptMassageHero, ptCuppingHero];
    const htHeroes = [htAdjustmentsHero, htDecompressionHero, htMassageHero, htCuppingHero];

    expect(ptHeroes).toHaveLength(esHeroes.length);
    expect(htHeroes).toHaveLength(esHeroes.length);
    for (const hero of [...ptHeroes, ...htHeroes]) {
      expect(hero.h1.trim().length).toBeGreaterThan(0);
      expect(hero.subhead.trim().length).toBeGreaterThan(0);
    }
  });
});
