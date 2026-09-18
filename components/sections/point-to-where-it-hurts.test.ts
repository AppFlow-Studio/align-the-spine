import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Regression guard for the crawlability fix (2026-09-17): the visible
 * "point to where it hurts" UI only ever shows one destination link at a
 * time (SelectedPanel), and only after a region is picked — no region is
 * selected by default, so a crawler that doesn't execute the click used
 * to see zero of the 6 region -> condition/service links in the initial
 * HTML. A hidden, always-rendered link list was added right after the
 * section heading, before any client-state-gated block.
 *
 * Source-scans the file rather than rendering it: this is a Client
 * Component that calls useState/useRef/useEffect, so it can't be invoked
 * as a plain function the way components/seo/json-ld.test.tsx tests
 * JsonLd (hooks require React's render dispatcher), and this repo has no
 * @testing-library/react/jsdom harness set up to actually mount it. */
describe("PointToWhereItHurts renders every region's destination link unconditionally", () => {
  const source = readFileSync(join(__dirname, "point-to-where-it-hurts.tsx"), "utf8");

  it("has a hidden, always-rendered link for every region, positioned before any selection-gated block", () => {
    const crawlableBlockMatch = source.match(
      /<nav aria-hidden="true"[^>]*>[\s\S]*?regions\.map[\s\S]*?<Link[\s\S]*?<\/nav>/,
    );
    expect(crawlableBlockMatch, "expected an unconditional hidden nav of region links").not.toBe(
      null,
    );

    const firstSelectionGuardIndex = source.indexOf("{selected &&");
    const crawlableBlockIndex = crawlableBlockMatch!.index!;
    expect(
      crawlableBlockIndex,
      "the crawlable link block must render before the first client-state-gated (`{selected && ...}`) block, not inside it",
    ).toBeLessThan(firstSelectionGuardIndex);
  });

  it("the hidden link block is excluded from the tab order and accessibility tree (the visible UI is the real interactive experience)", () => {
    const crawlableBlockMatch = source.match(/<nav aria-hidden="true"[^>]*>[\s\S]*?<\/nav>/)![0];
    expect(crawlableBlockMatch).toContain("tabIndex={-1}");
  });

  it("each hidden link falls back to the booking CTA when a region's own route isn't published yet (never links to a draft/noindex page)", () => {
    expect(source).toContain("region.href ?? siteConfig.bookingCta.href");
  });
});
