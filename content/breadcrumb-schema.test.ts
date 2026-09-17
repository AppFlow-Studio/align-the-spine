import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Components that render `BreadcrumbJsonLd` themselves whenever a
 * `breadcrumbs` prop is passed — the exact mechanism behind the
 * double-BreadcrumbList bug fixed 2026-09-16/17 (sciatica, whiplash,
 * car-accident-chiropractor, /conditions hub, and all 3 full-template
 * /services/* pages were each emitting it twice: once from one of these,
 * once from an explicit page-level `<BreadcrumbJsonLd>` call). Any other
 * component that ever gains this same self-rendering behavior must be
 * added here, or this test stops covering it. */
const SELF_RENDERING_HERO_COMPONENTS = ["HeroSolidPanel", "Hero"];

/** Counts how many independent things in `source` would each emit a
 * BreadcrumbList JSON-LD block if rendered:
 *   1. every explicit `<BreadcrumbJsonLd ... />` usage, and
 *   2. every self-rendering hero component invocation that receives a
 *      `breadcrumbs` prop (assumes the codebase's actual pattern of a
 *      single self-closing JSX tag per invocation — true for every real
 *      usage today; a future multi-line-wrapped or non-self-closing usage
 *      would need this regex revisited).
 * Deliberately source-scans rather than importing/rendering the page
 * modules: these are Next.js Server Components with no jsdom/testing-library
 * setup in this repo, same convention as content/route-registry-parity.test.ts
 * and the buildWebPage/buildMedicalWebPage source-scans in lib/schema.test.ts. */
function countBreadcrumbEmitters(source: string): number {
  const explicitCalls = source.match(/<BreadcrumbJsonLd\b/g)?.length ?? 0;

  let heroWithBreadcrumbsProp = 0;
  for (const name of SELF_RENDERING_HERO_COMPONENTS) {
    const tagPattern = new RegExp(`<${name}\\b([\\s\\S]*?)\\/>`, "g");
    for (const match of source.matchAll(tagPattern)) {
      if (/\bbreadcrumbs=\{/.test(match[1])) heroWithBreadcrumbsProp++;
    }
  }

  return explicitCalls + heroWithBreadcrumbsProp;
}

function findPageFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPageFiles(fullPath));
    } else if (entry.name === "page.tsx") {
      results.push(fullPath);
    }
  }
  return results;
}

describe("no page ever emits more than one BreadcrumbList JSON-LD block", () => {
  const appDir = join(__dirname, "..", "app");
  const offenders: { file: string; count: number }[] = [];

  for (const file of findPageFiles(appDir)) {
    if (file.includes(`${join("app", "(en)", "admin")}`)) continue; // not an SEO route
    const source = readFileSync(file, "utf8");
    const count = countBreadcrumbEmitters(source);
    if (count > 1) offenders.push({ file, count });
  }

  it("has zero pages with more than one breadcrumb-emitting mechanism", () => {
    expect(offenders).toEqual([]);
  });
});
