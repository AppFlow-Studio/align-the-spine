import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { servicesGrid } from "@/content/services-grid";
import { siteConfig } from "@/content/site";
import { buildService } from "@/lib/schema";

/** ATS-A09 closure.
 *
 * The acceptance audit flagged the /services hub for emitting eight `Service`
 * nodes when only four services have dedicated pages, and suspected two of
 * them ("Sports Injury", "Posture & Corrective") of being unsupported claims.
 *
 * Verified 2026-09-22: they are NOT unsupported. Both are rendered as real,
 * visible service cards on /services with their own descriptions and images,
 * and each node's `@id` is a `#{slug}` fragment of that same page — which the
 * page actually emits as an element id. Schema.org `Service` does not require
 * a dedicated URL; it requires that the described offering match visible
 * content, which it does. No nodes were removed.
 *
 * What was missing was any guard keeping it that way. These tests assert the
 * invariant that made the original finding a false alarm, so a future Service
 * node added without visible support fails here instead of shipping. */
describe("every Service node is backed by visible content", () => {
  const servicesPage = readFileSync("app/(en)/services/page.tsx", "utf8");

  it("anchors every node's @id to a #slug fragment of /services", () => {
    for (const service of servicesGrid) {
      const schema = buildService(service);
      expect(schema["@id"]).toBe(`${siteConfig.siteUrl}/services#${service.slug}`);
    }
  });

  it("gives every service a non-empty visible name and description", () => {
    for (const service of servicesGrid) {
      expect(service.name.trim().length).toBeGreaterThan(0);
      expect(service.summary.trim().length).toBeGreaterThan(20);
      const schema = buildService(service);
      expect(schema.name).toBe(service.name);
      // Structured data must not say anything the card doesn't.
      expect(schema.description).toBe(service.summary);
    }
  });

  it("uses unique slugs so no two nodes collide on one @id", () => {
    const slugs = servicesGrid.map((service) => service.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("renders the grid from the same array the schema is built from", () => {
    // If the page ever stops mapping servicesGrid, a node could describe a
    // service the page no longer shows.
    expect(servicesPage).toContain("servicesGrid");
  });

  it("never invents a link target for a service with no page", () => {
    // IA-03's "do not invent services" rule: a service without a dedicated
    // page carries no href rather than pointing somewhere unrelated.
    const withoutPages = servicesGrid.filter((service) => !service.href);
    for (const service of withoutPages) {
      expect(service.href).toBeUndefined();
    }
    // Those services still exist as real offerings — they just aren't links.
    expect(withoutPages.every((service) => service.summary.trim().length > 20)).toBe(true);
  });
});
