import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { routes } from "@/content/seo";

/** Routes that intentionally have a page.tsx but no content/seo.ts entry —
 * see content/seo.ts's own comment on why /thank-you is absent (noindex,
 * post-conversion, doesn't belong in the sitemap). Keep this list small and
 * explicit; it's the only escape hatch this test allows. */
const UNREGISTERED_ALLOWLIST = new Set(["/thank-you"]);

const appDir = join(__dirname, "..", "app");

/** Walks app/ collecting every route path with a page.tsx — "" for the root
 * page, "/services" for app/services/page.tsx, etc. */
function collectPageRoutes(dir: string, routePath = ""): string[] {
  if (routePath.startsWith("/admin")) return [];
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...collectPageRoutes(fullPath, `${routePath}/${entry.name}`));
    } else if (entry.name === "page.tsx" && !routePath.includes("[")) {
      found.push(routePath);
    }
  }
  return found;
}

/** Build-time reconciliation (brief §1.5/§10): a registered-but-missing or
 * existing-but-unregistered route is exactly how a page ships without a
 * canonical, or a stale registry entry points at nothing. */
describe("route registry ↔ filesystem parity", () => {
  const filesystemRoutes = collectPageRoutes(appDir);
  const registeredPaths = new Set(routes.map((route) => route.path));
  const filesystemPaths = new Set(filesystemRoutes);

  it("registers every page.tsx route, or lists it in the allowlist", () => {
    const unregistered = filesystemRoutes.filter(
      (path) => !registeredPaths.has(path) && !UNREGISTERED_ALLOWLIST.has(path),
    );
    expect(unregistered).toEqual([]);
  });

  it("has a page.tsx for every registered route", () => {
    const missing = [...registeredPaths].filter((path) => !filesystemPaths.has(path));
    expect(missing).toEqual([]);
  });

  it("keeps the allowlist free of stale entries", () => {
    const stale = [...UNREGISTERED_ALLOWLIST].filter(
      (path) => !filesystemPaths.has(path) || registeredPaths.has(path),
    );
    expect(stale).toEqual([]);
  });
});
