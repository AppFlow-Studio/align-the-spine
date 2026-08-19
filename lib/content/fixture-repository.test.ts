import { describe, expect, it } from "vitest";

import { FixtureContentRepository } from "./fixture-repository";

describe("public fixture repository", () => {
  it("never returns draft or in-review fixtures to public queries", async () => {
    const repository = new FixtureContentRepository();
    expect((await repository.listPublic({ contentType: "blog_post" })).items).toEqual([]);
    expect(
      await repository.getPublicBySlug(
        "blog_post",
        "what-to-do-after-a-car-accident-in-deerfield-beach",
      ),
    ).toBeNull();
  });

  it("keeps editorial fixtures available to protected previews", async () => {
    const repository = new FixtureContentRepository();
    expect((await repository.listEditorial()).length).toBeGreaterThanOrEqual(3);
  });
});
