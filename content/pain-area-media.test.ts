import { describe, expect, it } from "vitest";

import { hasPainAreaMedia, painAreaMedia } from "@/content/pain-area-media";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";

describe("painAreaMedia", () => {
  it("has exactly one entry per region defined in point-to-where-it-hurts, keyed by the same ids", () => {
    const regionIds = pointToWhereItHurtsContent.regions.map((region) => region.id).sort();
    const mediaIds = Object.keys(painAreaMedia).sort();
    expect(mediaIds).toEqual(regionIds);
  });

  it("every entry is currently flagged as missing (ATS-E15a is still blocked on the E25 asset dependency)", () => {
    for (const [id, media] of Object.entries(painAreaMedia)) {
      expect(
        hasPainAreaMedia(media),
        `${id} should be missing until a real asset is approved`,
      ).toBe(false);
    }
  });

  it("hasPainAreaMedia only checks src, so filling in a real src is enough to unblock a region", () => {
    expect(
      hasPainAreaMedia({
        src: "https://align-the-spine.b-cdn.net/videos/x.mp4",
        poster: "",
        description: "",
      }),
    ).toBe(true);
    expect(
      hasPainAreaMedia({ src: "", poster: "https://example.com/poster.jpg", description: "x" }),
    ).toBe(false);
  });
});
