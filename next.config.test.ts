import { describe, expect, it } from "vitest";

import nextConfig from "./next.config";

/** ATS-SEO-139: "permanent redirects only for true retired URLs; avoid
 * redirect chains/loops." All of `next.config.ts`'s redirects predate this
 * epic and are English-only legacy-URL cleanup (ATS-141 template retirement,
 * etc.) — none of them touch /es, /pt, or /ht, which is itself the correct
 * outcome of this ticket's "audit any existing experimental PT/HT routes
 * before adding redirects" step: there are none to audit, and none were
 * added, because no retired Portuguese/Haitian Creole URL exists yet.
 */
describe("next.config redirects", () => {
  async function getRedirects() {
    const redirects = nextConfig.redirects;
    if (!redirects) throw new Error("next.config.ts: redirects() is not defined");
    return redirects();
  }

  it("marks every redirect permanent (this file has no temporary redirects to distinguish)", async () => {
    for (const redirect of await getRedirects()) {
      expect(redirect.permanent, `${redirect.source} -> ${redirect.destination}`).toBe(true);
    }
  });

  it("has no redirect chain (no destination is itself another redirect's source)", async () => {
    const redirects = await getRedirects();
    const sources = new Set(redirects.map((r) => r.source));
    for (const redirect of redirects) {
      expect(
        sources.has(redirect.destination),
        `chain: ${redirect.source} -> ${redirect.destination} -> (redirects again)`,
      ).toBe(false);
    }
  });

  it("has no redirect loop (a source is never its own destination, directly or via another entry)", async () => {
    const redirects = await getRedirects();
    for (const redirect of redirects) {
      expect(redirect.destination).not.toBe(redirect.source);
    }
    // Two-hop loop: A -> B and B -> A.
    const bySource = new Map(redirects.map((r) => [r.source, r.destination]));
    for (const redirect of redirects) {
      const roundTrip = bySource.get(redirect.destination);
      expect(
        roundTrip,
        `loop: ${redirect.source} -> ${redirect.destination} -> ${roundTrip}`,
      ).not.toBe(redirect.source);
    }
  });

  it("declares no redirect touching the /es, /pt, or /ht locale subtrees", () => {
    // Not a permanent architectural ban — a genuinely retired Portuguese or
    // Haitian Creole URL would legitimately need one — just today's true
    // state, so an unreviewed locale redirect doesn't slip in silently.
    const configSource = String(nextConfig.redirects);
    for (const prefix of ["/es", "/pt", "/ht"]) {
      expect(configSource.includes(`"${prefix}`)).toBe(false);
      expect(configSource.includes(`'${prefix}`)).toBe(false);
    }
  });

  it("uses only relative, same-origin destinations (no accidental cross-host redirect)", async () => {
    for (const redirect of await getRedirects()) {
      expect(redirect.destination.startsWith("/")).toBe(true);
      expect(redirect.destination.startsWith("//")).toBe(false);
    }
  });
});
