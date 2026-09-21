import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Source-scans the file rather than rendering it — this is a Client
 * Component using hooks and this repo has no jsdom/@testing-library/react
 * harness (see point-to-where-it-hurts.test.ts's own note on this). These
 * tests guard the ATS-E15a acceptance criteria that are pure text/structure
 * facts about the source, independent of whether real video assets exist
 * yet. */
describe("PainAreaMediaPanel", () => {
  const source = readFileSync(join(__dirname, "pain-area-media-panel.tsx"), "utf8");

  it("never falls back to a different region's clip: each <video> reads src/poster from painAreaMedia[id], not a shared default", () => {
    expect(source).toContain("src={regionMedia.src}");
    expect(source).toContain("poster={regionMedia.poster}");
    // No hardcoded fallback video/poster URL anywhere in the file.
    expect(source).not.toMatch(/src=["'](?!.*regionMedia).*\.(mp4|webm)["']/);
  });

  it("skips rendering a <video> element entirely for a region with no media, instead of an empty/broken src", () => {
    expect(source).toContain("if (!hasPainAreaMedia(regionMedia)) return null;");
  });

  it("logs a warning (not a silent failure) when the selected region has no media", () => {
    expect(source).toMatch(/console\.warn\(\s*["']\[pain-area\] missing media["']/);
  });

  it("sets muted, playsInline, and an active/inactive preload split on every clip", () => {
    expect(source).toContain("muted");
    expect(source).toContain("playsInline");
    expect(source).toContain('preload={isActive ? "auto" : "none"}');
  });

  it("pauses every non-active clip on switch instead of only hiding it via opacity", () => {
    expect(source).toMatch(/el\.pause\(\)/);
  });

  it("does not autoplay when the visitor prefers reduced motion", () => {
    expect(source).toContain("if (!reduceMotion) {");
    expect(source).toContain("ReducedMotionGate");
  });

  it("crossfades within the 180-260ms acceptance range", () => {
    expect(source).toMatch(/duration-200/);
  });

  it("uses a fixed aspect-ratio container so switching regions causes no layout shift", () => {
    expect(source).toMatch(/aspect-\[4\/3\]/);
  });
});
