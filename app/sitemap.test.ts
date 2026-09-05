import { describe, expect, it } from "vitest";

import { esRoutes } from "@/content/es/seo";
import { htRoutes } from "@/content/ht/seo";
import { buildAlternates, type Locale } from "@/content/i18n";
import { ptRoutes } from "@/content/pt/seo";
import { isPublished, routes } from "@/content/seo";
import { siteConfig } from "@/content/site";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("returns absolute URLs under siteConfig.siteUrl for every entry", async () => {
    for (const entry of await sitemap()) {
      expect(entry.url.startsWith(siteConfig.siteUrl)).toBe(true);
    }
  });

  it("excludes utility and legacy redirect routes", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).not.toContain("/thank-you");
    expect(paths).not.toContain("/book");
    expect(paths).not.toContain("/auto-accident");
    expect(paths).not.toContain("/auto-accidents");
    expect(paths).not.toContain("/home-visits");
    expect(paths).not.toContain("/services/massage-soft-tissue");
  });

  it("gives every entry a truthy lastModified", async () => {
    for (const entry of await sitemap()) {
      expect(entry.lastModified).toBeTruthy();
    }
  });

  it("includes every published English route exactly once", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const route of routes.filter(isPublished)) {
      expect(paths.filter((path) => path === route.path)).toHaveLength(1);
    }
  });

  it("includes every published Spanish route exactly once", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const route of esRoutes.filter(isPublished)) {
      expect(paths.filter((path) => path === route.path)).toHaveLength(1);
    }
  });

  // ATS-SEO-135
  it("includes every published Portuguese route exactly once", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const route of ptRoutes.filter(isPublished)) {
      expect(paths.filter((path) => path === route.path)).toHaveLength(1);
    }
  });

  // ATS-SEO-136
  it("includes every published Haitian Creole route exactly once", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const route of htRoutes.filter(isPublished)) {
      expect(paths.filter((path) => path === route.path)).toHaveLength(1);
    }
  });

  it("lists the static routes English-first, then Spanish, then Portuguese, then Haitian Creole", async () => {
    // CMS-driven blog/service-area entries are appended after all four, so
    // this only pins the ordering of the static registries relative to
    // each other.
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    const staticCount =
      routes.filter(isPublished).length +
      esRoutes.filter(isPublished).length +
      ptRoutes.filter(isPublished).length +
      htRoutes.filter(isPublished).length;
    expect(paths.slice(0, staticCount)).toEqual([
      ...routes.filter(isPublished).map((route) => route.path),
      ...esRoutes.filter(isPublished).map((route) => route.path),
      ...ptRoutes.filter(isPublished).map((route) => route.path),
      ...htRoutes.filter(isPublished).map((route) => route.path),
    ]);
  });

  it("lists no URL twice", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("excludes the Spanish post-conversion page", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).not.toContain("/es/gracias");
  });

  // The sitemap's per-URL hreflang and the HTML <link rel="alternate">
  // tags are both generated from content/i18n.ts's buildAlternates(). This
  // asserts the sitemap really does read that source rather than carrying
  // its own copy — two independently-maintained hreflang sets drifting
  // apart is the specific failure this guards against.
  it("annotates each entry with the same alternates buildAlternates() returns", async () => {
    for (const entry of await sitemap()) {
      const path = entry.url.replace(siteConfig.siteUrl, "");
      const isSpanish = path === "/es" || path.startsWith("/es/");
      const isPortuguese = path === "/pt" || path.startsWith("/pt/");
      const isHaitianCreole = path === "/ht" || path.startsWith("/ht/");
      const locale: Locale = isSpanish ? "es" : isPortuguese ? "pt" : isHaitianCreole ? "ht" : "en";
      const expected = buildAlternates(siteConfig.siteUrl, path, locale);
      if (expected) {
        expect(entry.alternates).toEqual({ languages: expected.languages });
      } else {
        expect(entry.alternates).toBeUndefined();
      }
    }
  });

  // ATS-E4 (4.12/4.14) / ATS-E3 (3.7): these routes are draft (noindex,
  // out of the sitemap) until their respective approvals land — condition
  // pages need a clinician reviewer, /home-visits needs verified
  // service-area/availability data. /reviews flipped to published
  // 2026-08-12 once real reviews landed (content/testimonials.ts) — see
  // content/seo.ts. This test intentionally fails once any of the
  // remaining routes flips to "published" without also being removed from
  // this list, as a reminder to update the assertion deliberately rather
  // than let it silently pass.
  it("excludes routes still pending approval", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const path of [
      "/conditions/back-pain",
      "/conditions/neck-pain",
      "/conditions/sciatica",
      "/conditions/whiplash",
      "/conditions/cervicogenic-headache",
      "/conditions/concussion",
      "/conditions/tmj-jaw-pain",
      "/home-visit-chiropractor",
      "/services/chiropractic-adjustments",
      "/services/spinal-decompression",
      "/services/soft-tissue-therapy",
    ]) {
      expect(paths).not.toContain(path);
    }
  });

  // ATS-SEO-139: the same "never leaks a draft page" guarantee as above,
  // but derived from the registries themselves rather than a hand-picked
  // path list — so it stays correct as routes flip between draft/published
  // (including a future PT/HT draft, which the hardcoded list above has
  // never had one of to catch).
  it("never includes a draft-status route from any of the four registries", async () => {
    const paths = new Set(
      (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, "")),
    );
    for (const registry of [routes, esRoutes, ptRoutes, htRoutes]) {
      for (const route of registry.filter((r) => !isPublished(r))) {
        expect(paths.has(route.path), `draft route "${route.path}" leaked into the sitemap`).toBe(
          false,
        );
      }
    }
  });

  // ATS-SEO-139: "No staging/noncanonical URL in sitemap" as its own,
  // explicit acceptance criterion — content/hreflang-cluster-validation.test.ts
  // already checks this for the underlying route tables, but not for
  // sitemap.ts's actual output specifically.
  it("never emits a staging or non-production host", async () => {
    const FORBIDDEN_HOST_PATTERNS = [
      /localhost/i,
      /127\.0\.0\.1/,
      /\.vercel\.app/i,
      /staging/i,
      /\bpreview\b/i,
    ];
    for (const entry of await sitemap()) {
      for (const pattern of FORBIDDEN_HOST_PATTERNS) {
        expect(pattern.test(entry.url), `sitemap URL "${entry.url}" leaks a staging host`).toBe(
          false,
        );
      }
      for (const url of Object.values(entry.alternates?.languages ?? {})) {
        const urlString = String(url);
        for (const pattern of FORBIDDEN_HOST_PATTERNS) {
          expect(
            pattern.test(urlString),
            `sitemap alternate "${urlString}" leaks a staging host`,
          ).toBe(false);
        }
      }
    }
  });
});
