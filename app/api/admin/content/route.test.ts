import { describe, expect, it } from "vitest";

import { slugSchema } from "@/lib/content/schemas";

import { slugFromTitle } from "./route";

/** The create form lets a writer skip the slug, so this derivation is what
 * most posts' URLs will actually come from — and a slug the database rejects
 * means a failed create with nothing to show for it. */
describe("slugFromTitle", () => {
  it("lowercases and hyphenates a normal title", () => {
    expect(slugFromTitle("What To Do After A Car Accident")).toBe(
      "what-to-do-after-a-car-accident",
    );
  });

  it("strips punctuation and collapses separators", () => {
    expect(slugFromTitle("Whiplash: what's normal — and what isn't?")).toBe(
      "whiplash-what-s-normal-and-what-isn-t",
    );
  });

  it("folds accents rather than dropping the word", () => {
    expect(slugFromTitle("Látigazo cervical después de un choque")).toBe(
      "latigazo-cervical-despues-de-un-choque",
    );
  });

  it("never leaves a leading or trailing hyphen", () => {
    expect(slugFromTitle("  ...Recovery timelines!  ")).toBe("recovery-timelines");
  });

  it("stays inside the database's slug format for a very long title", () => {
    const slug = slugFromTitle(
      "Questions to bring to a chiropractic evaluation appointment in Deerfield Beach Florida and what to expect afterwards",
    );
    expect(slug.length).toBeLessThanOrEqual(100);
    expect(slugSchema.safeParse(slug).success).toBe(true);
  });

  it("produces something slugSchema accepts for every ordinary title", () => {
    const titles = [
      "Chiropractic care for neck pain",
      "TMJ & jaw pain: 5 things to know",
      "Concussion red flags (2026 update)",
      "Sciatica — when to seek care",
    ];
    for (const title of titles) {
      expect(slugSchema.safeParse(slugFromTitle(title)).success).toBe(true);
    }
  });
});
