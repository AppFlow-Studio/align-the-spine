import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** LINK-02: "breadcrumbs render on every non-home page." Source-scanning
 * check (same convention as content/route-registry-parity.test.ts) rather
 * than a rendered-output test — this repo has no jsdom/testing-library
 * setup. Confirms presence (`breadcrumbs={` passed to HeroSolidPanel/Hero,
 * or a direct <BreadcrumbTrail> for the two pages with bespoke hero
 * markup), not the exact hierarchy — that's covered by construction, since
 * BreadcrumbTrail and BreadcrumbJsonLd are always fed from the same items
 * array (see components/seo/breadcrumb-trail.tsx's doc comment). */
const appDir = join(__dirname);

/** /thank-you is deliberately excluded — noindex, post-conversion,
 * intentionally minimal (see app/thank-you/page.tsx's own doc comment) —
 * a breadcrumb trail back to pages the visitor just finished with adds
 * nothing there. Not in content/seo.ts's registry either, for the same
 * reason (see that file's own comment). */
const EXCLUDED_ROUTES = new Set(["", "/thank-you"]);

function collectPageFiles(dir: string, routePath = ""): { route: string; file: string }[] {
  const found: { route: string; file: string }[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "api") continue; // route handlers, not pages
      found.push(...collectPageFiles(fullPath, `${routePath}/${entry.name}`));
    } else if (entry.name === "page.tsx") {
      found.push({ route: routePath, file: fullPath });
    }
  }
  return found;
}

describe("LINK-02: breadcrumbs render on every non-home page", () => {
  const pages = collectPageFiles(appDir).filter(({ route }) => !EXCLUDED_ROUTES.has(route));

  it.each(pages)("$route has breadcrumbs wired in", ({ file }) => {
    const source = readFileSync(file, "utf8");
    const hasBreadcrumbs = /breadcrumbs=\{/.test(source) || /<BreadcrumbTrail\b/.test(source);
    expect(hasBreadcrumbs, `${file} has no breadcrumbs prop or <BreadcrumbTrail>`).toBe(true);
  });
});
