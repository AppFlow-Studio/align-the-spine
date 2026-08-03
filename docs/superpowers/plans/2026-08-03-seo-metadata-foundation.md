# SEO Metadata Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining gaps in the site's metadata/canonical/robots/sitemap foundation so every indexable route has a unique, self-referencing canonical, the sitemap is registry-driven with real dates, previews are fail-closed noindex, and the legacy `/auto-accident` duplicate is gone.

**Architecture:** A new `content/seo.ts` registry becomes the single source of title/description/image/canonical-path/sitemap-priority per static route; `app/sitemap.ts` and each static page's `metadata` export both read from it. `content/site.ts` gains an env-driven `siteUrl` and an `isProduction()` check that `lib/seo/metadata.ts`'s `buildMetadata()`, `app/robots.ts`, and `app/layout.tsx` all consult to force noindex outside actual Vercel production. `/auto-accident` permanently redirects to `/auto-accidents`.

**Tech Stack:** Next.js 15 App Router (`MetadataRoute`, `generateMetadata`/`metadata` exports), TypeScript, Vitest.

## Global Constraints

- `alignthespinechiropractic.com` is the confirmed production origin — never hardcode it anywhere except `content/site.ts`'s fallback.
- `isProduction()` must be **fail-closed**: only `process.env.VERCEL_ENV === "production"` counts as production; local dev, CI, and Vercel previews all noindex.
- Never use `new Date()` / build time for a sitemap `lastModified` — use the explicit dates recorded in `content/seo.ts` (sourced from `git log` on each route's content, given in each task below).
- Don't fabricate an approved asset that doesn't exist — the Apple touch icon and web manifest are skipped in this pass since no approved asset exists yet; only `/favicon.ico` (already in `app/`) is wired.
- Follow existing repo conventions: `@/` path alias, co-located `*.test.ts` files, Vitest (`describe`/`it`/`expect`), Prettier/ESLint via the pre-commit hook (don't hand-format — let `lint-staged` fix import order on commit).
- Run `npm run typecheck` and `npm test` after every task; run `npm run build` (production build, not `next dev`) as the final gate in Task 12.

---

### Task 1: `content/site.ts` — env-driven `siteUrl`, `isProduction()`, fix the `/auto-accident` nav link

**Files:**

- Modify: `content/site.ts`
- Test: `content/site.test.ts` (new)

**Interfaces:**

- Produces: `siteConfig.siteUrl: string` (unchanged shape, now env-driven), `export function isProduction(): boolean` — consumed by Tasks 2, 4, 5, 6.

- [ ] **Step 1: Write the failing test**

Create `content/site.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { isProduction } from "@/content/site";

describe("isProduction", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is true only when VERCEL_ENV is exactly "production"', () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isProduction()).toBe(true);
  });

  it("is false for preview deploys", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isProduction()).toBe(false);
  });

  it("is false when VERCEL_ENV is unset (local dev, CI)", () => {
    vi.stubEnv("VERCEL_ENV", "");
    expect(isProduction()).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run content/site.test.ts`
Expected: FAIL — `isProduction` is not exported from `@/content/site`.

- [ ] **Step 3: Implement**

In `content/site.ts`, change the `siteUrl` line inside `export const siteConfig: SiteConfig = {`:

```ts
  siteUrl: "https://alignthespinechiropractic.com",
```

to:

```ts
  siteUrl: process.env.SITE_URL ?? "https://alignthespinechiropractic.com",
```

Immediately above `export const siteConfig: SiteConfig = {`, add:

```ts
/** True only for actual Vercel production deploys. Local dev, CI, and
 * Vercel preview builds are all treated as non-production so metadata/
 * robots default to noindex — fail closed rather than risk a preview
 * leaking into search. */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}
```

Also fix the nav link that currently points at the route being redirected in Task 9 — change this entry in the `nav` array:

```ts
    { label: "Auto Accidents", href: "/auto-accident" },
```

to:

```ts
    { label: "Auto Accidents", href: "/auto-accidents" },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run content/site.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add content/site.ts content/site.test.ts
git commit -m "feat(seo): add env-driven siteUrl and isProduction() gate"
```

---

### Task 2: `lib/seo/metadata.ts` — fail-closed noindex outside production, bypass the layout title template

**Files:**

- Modify: `lib/seo/metadata.ts`
- Modify: `lib/seo/metadata.test.ts` (currently uncommitted/untracked — rewrite in full)

**Interfaces:**

- Consumes: `isProduction()`, `siteConfig` from `@/content/site` (Task 1).
- Produces: `buildMetadata(input: BuildMetadataInput): Metadata` — unchanged public shape/name, consumed by every page (Tasks 7, 8) and unaffected callers already using it.

- [ ] **Step 1: Write the failing test**

Replace the full contents of `lib/seo/metadata.test.ts` with:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/content/site";

import { buildMetadata } from "./metadata";

describe("buildMetadata", () => {
  it("builds a canonical URL from siteConfig.siteUrl and the given path", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/services",
    });
    expect(metadata.alternates).toEqual({ canonical: `${siteConfig.siteUrl}/services` });
  });

  it("wraps title in { absolute } so the root layout's title.template can't double-suffix it", () => {
    const metadata = buildMetadata({
      title: "Book an Appointment | Align the Spine Chiropractic",
      description: "Description",
      path: "/book",
    });
    expect(metadata.title).toEqual({
      absolute: "Book an Appointment | Align the Spine Chiropractic",
    });
  });

  it("mirrors title/description/url into openGraph and twitter", () => {
    const metadata = buildMetadata({ title: "Title", description: "Description", path: "/book" });
    expect(metadata.openGraph).toMatchObject({
      title: "Title",
      description: "Description",
      url: `${siteConfig.siteUrl}/book`,
      siteName: siteConfig.business.name,
    });
    expect(metadata.twitter).toMatchObject({ title: "Title", description: "Description" });
  });

  it("includes an OG/Twitter image and upgrades the Twitter card when one is given", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/about",
      image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser" },
    });
    expect(metadata.openGraph?.images).toEqual([
      { url: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser" },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["/figma-exports/dr-abe-neck.png"],
    });
  });

  it("falls back to a text-only summary card when no image is given", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/privacy-policy",
    });
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter).toMatchObject({ card: "summary" });
  });
});

describe("buildMetadata production gating", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("forces noindex when VERCEL_ENV is not production, even if the caller didn't ask for it", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const metadata = buildMetadata({ title: "Title", description: "Description", path: "/about" });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("respects the caller's robots value in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/thank-you",
      robots: { index: false },
    });
    expect(metadata.robots).toEqual({ index: false });
  });

  it("omits robots in production when the caller didn't pass one", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const metadata = buildMetadata({ title: "Title", description: "Description", path: "/about" });
    expect(metadata.robots).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/seo/metadata.test.ts`
Expected: FAIL — `metadata.title` is currently a plain string, not `{ absolute }`; the production-gating tests fail because noindex isn't forced yet.

- [ ] **Step 3: Implement**

Replace the full contents of `lib/seo/metadata.ts`:

```ts
import type { Metadata } from "next";

import { isProduction, siteConfig } from "@/content/site";

export interface BuildMetadataInput {
  /** Full page title, e.g. "Book an Appointment | Align the Spine Chiropractic". */
  title: string;
  description: string;
  /** Route path from the site root, e.g. "/services". Use "" for the home page. */
  path: string;
  /** Social preview image. Omit for routes with no natural hero image (e.g. /privacy-policy) —
   * OpenGraph/Twitter degrade gracefully to a text-only card. */
  image?: { src: string; alt: string };
  robots?: Metadata["robots"];
}

/** Builds the title/description/canonical/OpenGraph/Twitter metadata shared by every
 * route, so each page only supplies its own copy. Image `src` may be relative —
 * `metadataBase` on the root layout (app/layout.tsx) resolves it to an absolute URL
 * for OG/Twitter. `title` is wrapped in `{ absolute }` because every caller already
 * bakes the full "X | Align the Spine Chiropractic" string into `title` themselves —
 * `{ absolute }` opts out of the root layout's `title.template` so it doesn't get
 * suffixed a second time. Forces noindex outside production (see
 * content/site.ts's isProduction()) regardless of what a page passes in, so a
 * preview deploy can never ship an indexable page by omission. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  robots,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.siteUrl}${path}`;
  const effectiveRobots: Metadata["robots"] = isProduction()
    ? robots
    : { index: false, follow: false };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.business.name,
      type: "website",
      images: image ? [{ url: image.src, alt: image.alt }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image.src] : undefined,
    },
    ...(effectiveRobots ? { robots: effectiveRobots } : {}),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/seo/metadata.test.ts`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/seo/metadata.ts lib/seo/metadata.test.ts
git commit -m "feat(seo): force noindex outside production in buildMetadata"
```

---

### Task 3: `content/seo.ts` — typed route registry

**Files:**

- Create: `content/seo.ts`
- Test: `content/seo.test.ts`

**Interfaces:**

- Consumes: `siteConfig` from `@/content/site`; `backPainHero` from `@/content/back-pain-page`; `neckPainHero` from `@/content/neck-pain-page`.
- Produces: `export interface RouteMeta { path, title, description, image?, changeFrequency, priority, lastModified }`, `export const routes: RouteMeta[]`, `export function getRoute(path: string): RouteMeta` — consumed by `app/sitemap.ts` (Task 4) and pages (Tasks 7, 8).

- [ ] **Step 1: Write the failing test**

Create `content/seo.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { getRoute, routes } from "@/content/seo";

describe("routes registry", () => {
  it("has no duplicate paths", () => {
    const paths = routes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("gives every route a non-empty title and description", () => {
    for (const route of routes) {
      expect(route.title.length).toBeGreaterThan(0);
      expect(route.description.length).toBeGreaterThan(0);
    }
  });

  it("keeps every priority within Next's valid 0-1 range", () => {
    for (const route of routes) {
      expect(route.priority).toBeGreaterThanOrEqual(0);
      expect(route.priority).toBeLessThanOrEqual(1);
    }
  });

  it("gives every route an ISO lastModified date, not a runtime Date", () => {
    for (const route of routes) {
      expect(route.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("excludes /thank-you, /404, and API routes", () => {
    const paths = routes.map((route) => route.path);
    expect(paths).not.toContain("/thank-you");
    expect(paths).not.toContain("/404");
    expect(paths.some((path) => path.startsWith("/api"))).toBe(false);
  });

  it("excludes the legacy /auto-accident route", () => {
    expect(routes.map((route) => route.path)).not.toContain("/auto-accident");
  });
});

describe("getRoute", () => {
  it("returns the matching route", () => {
    expect(getRoute("/services").path).toBe("/services");
  });

  it("throws for an unregistered path instead of silently returning nothing", () => {
    expect(() => getRoute("/does-not-exist")).toThrow(/no route registered/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run content/seo.test.ts`
Expected: FAIL — `@/content/seo` does not exist.

- [ ] **Step 3: Implement**

Create `content/seo.ts`:

```ts
import type { MetadataRoute } from "next";

import { backPainHero } from "@/content/back-pain-page";
import { neckPainHero } from "@/content/neck-pain-page";
import { siteConfig } from "@/content/site";

export interface RouteMeta {
  /** Route path from the site root, e.g. "/services". "" is the home page. */
  path: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  /** ISO date (YYYY-MM-DD) tied to this route's last meaningful content
   * change. Bump it by hand when the page's content changes — never derive
   * it from build time. */
  lastModified: string;
}

/** Single source of truth for every statically-indexable route: app/sitemap.ts
 * maps straight over this, and each static page's own metadata export pulls
 * its entry by path via getRoute() instead of re-declaring title/description,
 * so the two can't drift apart. The dynamic /conditions/[slug] routes
 * (content/conditions/*.ts — whiplash, sciatica) aren't listed here; see
 * app/sitemap.ts for how those are appended. /thank-you and /404 are
 * intentionally absent — both are noindex and neither belongs in the
 * sitemap. /auto-accident is absent too — it 301s to /auto-accidents
 * (see next.config.ts). */
export const routes: RouteMeta[] = [
  {
    path: "",
    title: `${siteConfig.business.name} | South Florida's Chiropractor`,
    description:
      "Elite spinal health care in Deerfield Beach, FL — office visits from $50, same-day car accident evaluations, and home visits when it fits your case. Call (954) 573-7192.",
    image: { src: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
    changeFrequency: "weekly",
    priority: 1,
    lastModified: "2026-08-02",
  },
  {
    path: "/services",
    title: `Chiropractic Services in Deerfield Beach, FL | ${siteConfig.business.name}`,
    description:
      "Adjustments, sports injury care, posture correction, spinal decompression, headache relief, and massage/soft-tissue therapy — same doctor, every visit. Call (954) 573-7192.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser treating a patient's neck",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-07-31",
  },
  {
    path: "/book",
    title: `Book an Appointment | ${siteConfig.business.name}`,
    description:
      "Schedule your chiropractic evaluation in Deerfield Beach or at your home. Same-day slots available for urgent cases — book online or call (954) 573-7192.",
    image: {
      src: "/figma-exports/phone-mockup.png",
      alt: "Patient calling Align the Spine to book an appointment",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-07-31",
  },
  {
    path: "/auto-accidents",
    title: `Auto Accident Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
    description:
      "Same-day auto accident evaluations, billed directly to Florida PIP. Full exam, treatment, and documentation for your claim — in-home visits available. Call (954) 573-7192.",
    image: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Align the Spine reception hallway",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-03",
  },
  {
    path: "/conditions/back-pain",
    title: `${backPainHero.h1} | ${siteConfig.business.name}`,
    description: backPainHero.subhead,
    image: backPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-01",
  },
  {
    path: "/conditions/neck-pain",
    title: `${neckPainHero.h1} | ${siteConfig.business.name}`,
    description: neckPainHero.subhead,
    image: neckPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-01",
  },
  {
    path: "/home-visits",
    title: `Home Visit Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
    description:
      "Full chiropractic exams and treatment at your address when it fits your case and location. Check your home-visit eligibility online or call (954) 573-7192.",
    image: {
      src: "/figma-exports/home-visits-hero.png",
      alt: "Dr. Abe Nasser setting up a treatment table in a patient's living room",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-07-31",
  },
  {
    path: "/about",
    title: `About Dr. Abe Nasser | ${siteConfig.business.name}`,
    description:
      "One doctor, every visit. Meet Dr. Abe Nasser — bilingual, transparent pricing, and the same provider from your first exam through recovery. Call (954) 573-7192.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser treating a patient's neck",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-07-31",
  },
  {
    path: "/contact-us",
    title: `Contact Us | ${siteConfig.business.name}`,
    description:
      "Questions about your visit, insurance, or your claim? Reach Align the Spine Chiropractic directly — no call center, no hold music. Call (954) 573-7192.",
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-07-31",
  },
  {
    path: "/privacy-policy",
    title: `Privacy Policy | ${siteConfig.business.name}`,
    description:
      "How Align the Spine Chiropractic collects, uses, and protects your information, including HIPAA-protected health information.",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: "2026-07-31",
  },
];

/** Looks up a route's registry entry by path — throws if missing rather than
 * silently falling back, so a page that forgets to register itself fails at
 * build time instead of shipping without a canonical. */
export function getRoute(path: string): RouteMeta {
  const route = routes.find((entry) => entry.path === path);
  if (!route) throw new Error(`content/seo.ts: no route registered for path "${path}"`);
  return route;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run content/seo.test.ts`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add content/seo.ts content/seo.test.ts
git commit -m "feat(seo): add typed route registry for sitemap + page metadata"
```

---

### Task 4: `app/sitemap.ts` — source from the registry, real dates for dynamic conditions

**Files:**

- Modify: `app/sitemap.ts`
- Test: `app/sitemap.test.ts` (new)

**Interfaces:**

- Consumes: `routes` from `@/content/seo` (Task 3), `conditionsBySlug` from `@/content/conditions`, `siteConfig` from `@/content/site`.
- Produces: `export default function sitemap(): MetadataRoute.Sitemap` — unchanged public shape.

- [ ] **Step 1: Write the failing test**

Create `app/sitemap.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { siteConfig } from "@/content/site";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("returns absolute URLs under siteConfig.siteUrl for every entry", () => {
    for (const entry of sitemap()) {
      expect(entry.url.startsWith(siteConfig.siteUrl)).toBe(true);
    }
  });

  it("excludes /thank-you and the legacy /auto-accident route", () => {
    const paths = sitemap().map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).not.toContain("/thank-you");
    expect(paths).not.toContain("/auto-accident");
  });

  it("includes the dynamic /conditions/whiplash and /conditions/sciatica routes with real, non-build-time dates", () => {
    const entries = sitemap();
    const whiplash = entries.find((entry) => entry.url.endsWith("/conditions/whiplash"));
    const sciatica = entries.find((entry) => entry.url.endsWith("/conditions/sciatica"));
    expect(whiplash?.lastModified).toBe("2026-07-29");
    expect(sciatica?.lastModified).toBe("2026-07-29");
  });

  it("gives every entry a truthy lastModified", () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toBeTruthy();
    }
  });

  it("includes every static route from the registry exactly once", () => {
    const paths = sitemap().map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).toContain("/services");
    expect(paths).toContain("/auto-accidents");
    expect(paths).toContain("/conditions/back-pain");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/sitemap.test.ts`
Expected: FAIL — `/conditions/whiplash`/`/conditions/sciatica` still use `new Date()`, so `lastModified` won't equal `"2026-07-29"`.

- [ ] **Step 3: Implement**

Replace the full contents of `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";

import { conditionsBySlug } from "@/content/conditions";
import { routes } from "@/content/seo";
import { siteConfig } from "@/content/site";

/** Real (non-build-time) lastModified dates for the two remaining
 * conditions still served by the generic /conditions/[slug] template (see
 * content/conditions/index.ts). Bump the date here by hand when either
 * condition's content changes — content/seo.ts covers every other route. */
const dynamicConditionLastModified: Record<string, string> = {
  whiplash: "2026-07-29",
  sciatica: "2026-07-29",
};

function lastModifiedFor(slug: string): string {
  const date = dynamicConditionLastModified[slug];
  if (!date) {
    throw new Error(`app/sitemap.ts: no lastModified configured for condition "${slug}"`);
  }
  return date;
}

/** Sitemap (ATS-131): sourced entirely from content/seo.ts's route registry
 * plus the dynamic /conditions/[slug] routes derived from conditionsBySlug,
 * so a new static page or condition doesn't also need a second, separate
 * sitemap entry. /thank-you, /404, /auto-accident, and API routes are
 * absent because they're not in the registry — see content/seo.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const conditionEntries: MetadataRoute.Sitemap = Object.keys(conditionsBySlug).map((slug) => ({
    url: `${siteConfig.siteUrl}/conditions/${slug}`,
    lastModified: lastModifiedFor(slug),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...conditionEntries];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/sitemap.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/sitemap.test.ts
git commit -m "feat(seo): source sitemap from content/seo.ts registry with real dates"
```

---

### Task 5: `app/robots.ts` — disallow everything outside production

**Files:**

- Modify: `app/robots.ts`
- Test: `app/robots.test.ts` (new)

**Interfaces:**

- Consumes: `isProduction()`, `siteConfig` from `@/content/site` (Task 1).
- Produces: `export default function robots(): MetadataRoute.Robots` — unchanged public shape.

- [ ] **Step 1: Write the failing test**

Create `app/robots.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/content/site";

import robots from "./robots";

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("disallows everything when not production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("allows crawling except /api/ and /thank-you in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thank-you"],
    });
  });

  it("always references the canonical sitemap URL", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().sitemap).toBe(`${siteConfig.siteUrl}/sitemap.xml`);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/robots.test.ts`
Expected: FAIL — current `robots()` always returns the production rules.

- [ ] **Step 3: Implement**

Replace the full contents of `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

import { isProduction, siteConfig } from "@/content/site";

/** robots.txt (ATS-131). Production allows crawling site-wide except the
 * lead API route and the post-conversion /thank-you page. Every
 * nonproduction deploy (local dev, CI, Vercel previews) disallows
 * everything — robots.txt alone can't reliably keep a preview out of
 * search (a crawler can ignore it), so this is paired with the per-page/
 * layout noindex in lib/seo/metadata.ts and app/layout.tsx. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction()
      ? { userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/robots.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add app/robots.ts app/robots.test.ts
git commit -m "feat(seo): noindex robots.txt outside production"
```

---

### Task 6: `app/layout.tsx` — title template, OG/Twitter defaults, icons, robots, verification

**Files:**

- Modify: `app/layout.tsx`

**Interfaces:**

- Consumes: `isProduction()`, `siteConfig` from `@/content/site` (Task 1).

- [ ] **Step 1: Implement**

In `app/layout.tsx`, change the import line:

```ts
import { siteConfig } from "@/content/site";
```

to:

```ts
import { isProduction, siteConfig } from "@/content/site";
```

Replace the whole `metadata` export (including its doc comment):

```ts
/** Fallback metadata for any route that doesn't set its own `title`/
 * `description` (every current page does — see app/page.tsx, app/about/
 * page.tsx, etc.). No `title.template` here: each page already bakes the
 * business name into its own title string, so a template would double it up. */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: `${siteConfig.business.name} | South Florida's Chiropractor`,
  description:
    "Elite spinal health care in Deerfield Beach, FL — office visits from $50, same-day car accident evaluations, and home visits when it fits your case.",
};
```

with:

```ts
/** Site-wide metadata scaffolding (P0A SEO foundation). Every route sets its
 * own title/description/OG/Twitter/robots via lib/seo/metadata.ts's
 * buildMetadata(), which wraps `title` in `{ absolute }` — so `title.template`
 * below only ever applies to a route that doesn't call buildMetadata (none
 * currently do). `robots` mirrors buildMetadata's own isProduction() gate so
 * a route can't ship indexable in a nonproduction deploy by omission. */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.business.name} | South Florida's Chiropractor`,
    template: "%s | Align the Spine Chiropractic",
  },
  description:
    "Elite spinal health care in Deerfield Beach, FL — office visits from $50, same-day car accident evaluations, and home visits when it fits your case.",
  openGraph: {
    siteName: siteConfig.business.name,
    type: "website",
    images: [
      { url: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/figma-exports/interior-reception.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};
```

- [ ] **Step 2: Verify no test regressions**

Run: `npx vitest run`
Expected: PASS — `app/layout.tsx` has no dedicated test file; this step confirms nothing else broke.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(seo): wire title template, OG/Twitter defaults, icons, robots into root layout"
```

---

### Task 7: Wire the six static-copy pages to the registry

**Files:**

- Modify: `app/page.tsx`, `app/services/page.tsx`, `app/book/page.tsx`, `app/home-visits/page.tsx`, `app/about/page.tsx`, `app/privacy-policy/page.tsx`

**Interfaces:**

- Consumes: `getRoute` from `@/content/seo` (Task 3).

This task is mechanical and identical in shape across all six files — swap the inlined `buildMetadata({...})` call for `buildMetadata(getRoute("/path"))`, add the `getRoute` import, and drop the `siteConfig` import only where nothing else in the file still uses it.

- [ ] **Step 1: `app/page.tsx`**

Add import (anywhere in the import block — `lint-staged`'s `eslint --fix` reorders on commit):

```ts
import { getRoute } from "@/content/seo";
```

Replace:

```ts
export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.business.name} | South Florida's Chiropractor`,
  description:
    "Elite spinal health care in Deerfield Beach, FL — office visits from $50, same-day car accident evaluations, and home visits when it fits your case. Call (954) 573-7192.",
  path: "",
  image: { src: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
});
```

with:

```ts
export const metadata: Metadata = buildMetadata(getRoute(""));
```

`siteConfig` is still used elsewhere in this file (the `callPill` phone number) — keep its import.

- [ ] **Step 2: `app/services/page.tsx`**

Add `import { getRoute } from "@/content/seo";`. Replace:

```ts
export const metadata: Metadata = buildMetadata({
  title: `Chiropractic Services in Deerfield Beach, FL | ${siteConfig.business.name}`,
  description:
    "Adjustments, sports injury care, posture correction, spinal decompression, headache relief, and massage/soft-tissue therapy — same doctor, every visit. Call (954) 573-7192.",
  path: "/services",
  image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser treating a patient's neck" },
});
```

with:

```ts
export const metadata: Metadata = buildMetadata(getRoute("/services"));
```

Keep the `siteConfig` import (still used for `callPill`).

- [ ] **Step 3: `app/book/page.tsx`**

Add `import { getRoute } from "@/content/seo";`. Replace:

```ts
export const metadata: Metadata = buildMetadata({
  title: `Book an Appointment | ${siteConfig.business.name}`,
  description:
    "Schedule your chiropractic evaluation in Deerfield Beach or at your home. Same-day slots available for urgent cases — book online or call (954) 573-7192.",
  path: "/book",
  image: {
    src: "/figma-exports/phone-mockup.png",
    alt: "Patient calling Align the Spine to book an appointment",
  },
});
```

with:

```ts
export const metadata: Metadata = buildMetadata(getRoute("/book"));
```

Keep the `siteConfig` import (still used for `callPill`).

- [ ] **Step 4: `app/home-visits/page.tsx`**

Add `import { getRoute } from "@/content/seo";`. Replace:

```ts
export const metadata: Metadata = buildMetadata({
  title: `Home Visit Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
  description:
    "Full chiropractic exams and treatment at your address when it fits your case and location. Check your home-visit eligibility online or call (954) 573-7192.",
  path: "/home-visits",
  image: {
    src: "/figma-exports/home-visits-hero.png",
    alt: "Dr. Abe Nasser setting up a treatment table in a patient's living room",
  },
});
```

with:

```ts
export const metadata: Metadata = buildMetadata(getRoute("/home-visits"));
```

Keep the `siteConfig` import (still used multiple times below for phone/booking links).

- [ ] **Step 5: `app/about/page.tsx`**

Add `import { getRoute } from "@/content/seo";`. Replace:

```ts
export const metadata: Metadata = buildMetadata({
  title: `About Dr. Abe Nasser | ${siteConfig.business.name}`,
  description:
    "One doctor, every visit. Meet Dr. Abe Nasser — bilingual, transparent pricing, and the same provider from your first exam through recovery. Call (954) 573-7192.",
  path: "/about",
  image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser treating a patient's neck" },
});
```

with:

```ts
export const metadata: Metadata = buildMetadata(getRoute("/about"));
```

Keep the `siteConfig` import (still used for `callPill`).

- [ ] **Step 6: `app/privacy-policy/page.tsx`**

Add `import { getRoute } from "@/content/seo";`. Replace:

```ts
export const metadata: Metadata = buildMetadata({
  title: `Privacy Policy | ${siteConfig.business.name}`,
  description:
    "How Align the Spine Chiropractic collects, uses, and protects your information, including HIPAA-protected health information.",
  path: "/privacy-policy",
});
```

with:

```ts
export const metadata: Metadata = buildMetadata(getRoute("/privacy-policy"));
```

This file has **no other** use of `siteConfig` — remove its now-unused `import { siteConfig } from "@/content/site";` line entirely.

- [ ] **Step 7: Verify**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS, no type errors (an unused `siteConfig` import would fail `tsc`/ESLint if left in `privacy-policy/page.tsx`).

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx app/services/page.tsx app/book/page.tsx app/home-visits/page.tsx app/about/page.tsx app/privacy-policy/page.tsx
git commit -m "refactor(seo): wire static pages to the content/seo.ts registry"
```

---

### Task 8: Give `/contact-us`, `/auto-accidents`, and `/thank-you` real canonicals

**Files:**

- Modify: `app/contact-us/page.tsx`, `app/auto-accidents/page.tsx`, `app/thank-you/page.tsx`

**Interfaces:**

- Consumes: `buildMetadata` from `@/lib/seo/metadata`, `getRoute` from `@/content/seo` (Task 3).

- [ ] **Step 1: `app/contact-us/page.tsx`**

Add imports:

```ts
import { getRoute } from "@/content/seo";
import { buildMetadata } from "@/lib/seo/metadata";
```

Replace:

```ts
export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.business.name}`,
  description:
    "Questions about your visit, insurance, or your claim? Reach Align the Spine Chiropractic directly — no call center, no hold music. Call (954) 573-7192.",
};
```

with:

```ts
export const metadata: Metadata = buildMetadata(getRoute("/contact-us"));
```

Keep the `siteConfig` import (still used for `callPill`).

- [ ] **Step 2: `app/auto-accidents/page.tsx`**

Add imports:

```ts
import { getRoute } from "@/content/seo";
import { buildMetadata } from "@/lib/seo/metadata";
```

Replace:

```ts
export const metadata: Metadata = {
  title: `Auto Accident Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
  description:
    "Same-day auto accident evaluations, billed directly to Florida PIP. Full exam, treatment, and documentation for your claim — in-home visits available. Call (954) 573-7192.",
};
```

with:

```ts
export const metadata: Metadata = buildMetadata(getRoute("/auto-accidents"));
```

Keep the `siteConfig` import (still used for phone/booking links).

- [ ] **Step 3: `app/thank-you/page.tsx`**

Add `import { buildMetadata } from "@/lib/seo/metadata";`. Replace:

```ts
export const metadata: Metadata = {
  title: `Thank You | ${siteConfig.business.name}`,
  description: "We've received your request and will be in touch shortly.",
  robots: { index: false },
};
```

with:

```ts
export const metadata: Metadata = buildMetadata({
  title: `Thank You | ${siteConfig.business.name}`,
  description: "We've received your request and will be in touch shortly.",
  path: "/thank-you",
  robots: { index: false },
});
```

`/thank-you` deliberately stays out of `content/seo.ts` (it's not in the sitemap and is always noindex), so it keeps its own inline `buildMetadata()` call rather than going through `getRoute()`. Keep the `siteConfig` import.

- [ ] **Step 4: Verify**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/contact-us/page.tsx app/auto-accidents/page.tsx app/thank-you/page.tsx
git commit -m "fix(seo): give /contact-us, /auto-accidents, /thank-you real canonicals"
```

---

### Task 9: Redirect `/auto-accident` → `/auto-accidents`, delete the legacy route

**Files:**

- Modify: `next.config.ts`
- Delete: `app/auto-accident/page.tsx`
- Modify: `app/conditions/[slug]/page.tsx` (stale comments referencing the deleted route)
- Modify: `content/conditions/index.ts` (stale comment referencing the deleted route)
- Modify: `components/templates/condition-page.tsx` (verify no stale reference remains)

**Interfaces:** None — this task only removes a route and fixes routing/comments; it doesn't change any function signature other tasks depend on.

- [ ] **Step 1: Add the redirect**

Replace the full contents of `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {/* config options here */};

export default nextConfig;
```

with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // /auto-accident (legacy template route) was superseded by the
        // bespoke /auto-accidents build (ATS-141) — permanent redirect so
        // neither URL competes for the same query in search.
        source: "/auto-accident",
        destination: "/auto-accidents",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Delete the legacy route**

```bash
git rm app/auto-accident/page.tsx
```

- [ ] **Step 3: Fix the stale comments in `app/conditions/[slug]/page.tsx`**

Replace:

```ts
/** Static params for the 4 in-scope condition routes (ATS-061). auto-accident
 * intentionally excluded — it's the separate /auto-accident route. */
```

with:

```ts
/** Static params for the 4 in-scope condition routes (ATS-061). auto-accident
 * intentionally excluded — it's the separate /auto-accidents route. */
```

Replace:

```ts
/** /conditions/[slug] route (ATS-061): resolves the slug against
 * conditionsBySlug and delegates rendering to the shared ConditionPage
 * template (components/templates/condition-page.tsx), which also backs
 * /auto-accident. */
```

with:

```ts
/** /conditions/[slug] route (ATS-061): resolves the slug against
 * conditionsBySlug and delegates rendering to the shared ConditionPage
 * template (components/templates/condition-page.tsx), which also backs
 * /auto-accidents. */
```

- [ ] **Step 4: Fix the stale comment in `content/conditions/index.ts`**

Replace:

```ts
/** The remaining condition-page routes still served by the generic [slug]
 * template (ATS-061). auto-accident.ts is intentionally excluded — /auto-
 * accident is a separate, already-built top-level route, not part of this
 * dynamic [slug] group. back-pain and neck-pain are also excluded as of
```

with:

```ts
/** The remaining condition-page routes still served by the generic [slug]
 * template (ATS-061). auto-accident.ts is intentionally excluded — it feeds
 * /auto-accidents, a separate, already-built top-level route, not part of
 * this dynamic [slug] group. back-pain and neck-pain are also excluded as of
```

- [ ] **Step 5: Confirm `components/templates/condition-page.tsx` has no stale reference**

Run: `grep -n "auto-accident\"" components/templates/condition-page.tsx`
Expected: no output (its only auto-accident-related lines are the `autoAccidentSteps` import and the `"auto-accident"` variant string used for `ComparisonTable`, both unrelated to the route path and correctly left alone).

- [ ] **Step 6: Verify the redirect and confirm nothing else references the deleted route**

Run:

```bash
grep -rn "app/auto-accident/\|from \"@/app/auto-accident" --include=*.ts --include=*.tsx . 2>/dev/null | grep -v node_modules | grep -v ".next"
npx vitest run
npx tsc --noEmit
```

Expected: no matches for the first command; tests and typecheck pass.

- [ ] **Step 7: Commit**

```bash
git add next.config.ts app/conditions/\[slug\]/page.tsx content/conditions/index.ts
git commit -m "fix(seo): 301 /auto-accident to /auto-accidents, delete the duplicate route"
```

---

### Task 10: `.env.example`

**Files:**

- Create: `.env.example`

- [ ] **Step 1: Create the file**

```bash
# Production origin used for canonical URLs, the sitemap, and robots.txt.
# Falls back to https://alignthespinechiropractic.com in content/site.ts if unset.
SITE_URL=https://alignthespinechiropractic.com

# Google Search Console HTML-tag verification token (Settings > Ownership
# verification > HTML tag > content="..."). Optional — app/layout.tsx omits
# the verification meta tag entirely when this is unset, so it's safe to
# ship without one until marketing supplies it.
GOOGLE_SITE_VERIFICATION=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs(seo): document SITE_URL and GOOGLE_SITE_VERIFICATION env vars"
```

---

### Task 11: Verify every indexable route's canonical, title, and duplicate-content fix by hand

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background)

- [ ] **Step 2: Spot-check canonicals**

For each of `/`, `/services`, `/book`, `/auto-accidents`, `/conditions/back-pain`, `/conditions/neck-pain`, `/conditions/whiplash`, `/conditions/sciatica`, `/home-visits`, `/about`, `/contact-us`, `/privacy-policy`, `/thank-you`: fetch the page and confirm `<link rel="canonical">` is present, absolute, and matches the route (`/thank-you`'s page should additionally have `<meta name="robots" content="noindex...">`).

Run (adjust the path per route):

```bash
curl -s http://localhost:3000/services | grep -o '<link rel="canonical"[^>]*>'
curl -s http://localhost:3000/thank-you | grep -o '<meta name="robots"[^>]*>'
```

- [ ] **Step 3: Confirm `/auto-accident` redirects**

Run: `curl -sI http://localhost:3000/auto-accident | grep -i "location\|HTTP"`
Expected: `HTTP/1.1 308` (or 307 in dev) with `location: /auto-accidents`.

- [ ] **Step 4: Confirm sitemap/robots output**

Run:

```bash
curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"
curl -s http://localhost:3000/robots.txt
```

Expected: one `<url>` per registry route + 2 dynamic conditions (12 total); `robots.txt` shows the production `Allow: /` rules (dev server has no `VERCEL_ENV`, so this instead confirms the code path renders — full production behavior is verified in Task 12's production build, where `VERCEL_ENV` still won't be set locally either, so also spot check by temporarily running `VERCEL_ENV=production npm run build && VERCEL_ENV=production npm start` and re-curling `/robots.txt` to see the production rules, then stop that server).

- [ ] **Step 5: Stop the dev server**

---

### Task 12: Final verification — lint, typecheck, full suite, production build

**Files:** none (verification only)

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: no errors (unused imports, import order, etc.)

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 3: Full test suite**

Run: `npm test`
Expected: all tests pass, including every new file from Tasks 1–5

- [ ] **Step 4: Production build (not `next dev`)**

Run: `npm run build`
Expected: build succeeds; confirm the build log lists `/sitemap.xml`, `/robots.txt`, and every static route as prerendered, and that `/auto-accident` no longer appears as a page.

- [ ] **Step 5: Production-mode smoke test**

Run:

```bash
VERCEL_ENV=production npm run build
npm run start &
sleep 2
curl -s http://localhost:3000/ | grep -o '<meta name="robots"[^>]*>'
curl -s http://localhost:3000/robots.txt
kill %1
```

Expected: homepage has no `noindex` meta (or none at all, meaning default index/follow); `robots.txt` shows the production `Allow: /` rules referencing `/sitemap.xml`.

- [ ] **Step 6: Final commit (if any formatting fixups were needed)**

```bash
git status
# If lint/format made changes:
git add -A
git commit -m "chore(seo): lint/format fixups"
```
