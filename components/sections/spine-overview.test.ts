import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { isPublished, routes } from "@/content/seo";
import { spineOverviewContent } from "@/content/spine-overview";

/** ATS-A03 regression guard.
 *
 * The home page rendered no internal link to any condition page at all. Its
 * anatomy section (SpineOverview) was informational-only, and the interactive
 * PointToWhereItHurts diagram — which does emit crawlable per-region links —
 * is used on the condition and accident pages, not here. So the site's
 * highest-authority page passed nothing directly to the seven condition pages
 * the SEO epic exists to rank; the only route in was the /conditions hub.
 *
 * Source-scans the component for the same reason point-to-where-it-hurts.test.ts
 * does: it's a Client Component using hooks, and this repo has no jsdom
 * harness to mount it. The content-level assertions below are real behaviour,
 * not source text. */
describe("spineOverviewContent destinations", () => {
  it("links at least one segment into the condition pages", () => {
    const linked = spineOverviewContent.segments.filter((segment) => segment.href);

    expect(linked.length).toBeGreaterThan(0);
    expect(linked.some((segment) => segment.href?.startsWith("/conditions/"))).toBe(true);
  });

  it("only ever points at registered, published routes", () => {
    for (const segment of spineOverviewContent.segments) {
      if (!segment.href) continue;

      const route = routes.find((entry) => entry.path === segment.href);
      expect(route, `${segment.id} -> ${segment.href} is not a registered route`).toBeDefined();
      expect(isPublished(route!), `${segment.id} -> ${segment.href} is not published`).toBe(true);
    }
  });

  it("routes each segment somewhere semantically defensible", () => {
    const byId = Object.fromEntries(
      spineOverviewContent.segments.map((segment) => [segment.id, segment.href]),
    );

    // Cervical copy is about neck/headache; sacral copy names sciatica outright.
    expect(byId.cervical).toBe("/conditions/neck-pain");
    expect(byId.sacral).toBe("/conditions/sciatica");
    // Thoracic and lumbar are both back regions.
    expect(byId.thoracic).toBe("/conditions/back-pain");
    expect(byId.lumbar).toBe("/conditions/back-pain");
  });

  it("resolves destinations through getRouteHref rather than hardcoded paths", () => {
    const source = readFileSync(join(__dirname, "../../content/spine-overview.ts"), "utf8");

    // A literal `href: "/conditions/..."` would bypass the published-route
    // gate and could outlive a route being returned to draft.
    expect(source).not.toMatch(/href:\s*"\/conditions\//);
    expect(source).toMatch(/href:\s*getRouteHref\(/);
  });
});

describe("SpineOverview renders its destinations as real anchors", () => {
  const source = readFileSync(join(__dirname, "spine-overview.tsx"), "utf8");

  it("wraps region names in a Link when a destination exists", () => {
    expect(source).toContain("function SegmentName");
    expect(source).toMatch(/if \(!segment\.href\) return <>\{children\}<\/>/);
    expect(source).toMatch(/<Link\s+href=\{segment\.href\}/);
  });

  it("links in both the desktop callout and the mobile list", () => {
    // Both branches always render (only CSS toggles visibility), so a crawler
    // must find the destination regardless of which one it reads.
    const occurrences = source.match(/<SegmentName segment=\{segment\}/g) ?? [];
    expect(occurrences.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps a visible focus state on the anchors", () => {
    expect(source).toContain("focus-visible:outline");
  });
});
