import { describe, expect, it } from "vitest";

import { contentBlocksSchema, estimatedReadingMinutes } from "./schemas";

describe("content block schema", () => {
  it("rejects raw scripts and event handlers", () => {
    for (const text of ["<script>alert(1)</script>", '<img src=x onerror="alert(1)">']) {
      expect(
        contentBlocksSchema.safeParse([{ id: "para-1", type: "paragraph", text }]).success,
      ).toBe(false);
    }
  });

  it("does not represent H1 and rejects skipped heading levels", () => {
    expect(
      contentBlocksSchema.safeParse([{ id: "head-1", type: "heading", level: 1, text: "Bad" }])
        .success,
    ).toBe(false);
    expect(
      contentBlocksSchema.safeParse([{ id: "head-3", type: "heading", level: 3, text: "Skipped" }])
        .success,
    ).toBe(false);
  });

  it("requires matching accessible table columns", () => {
    const result = contentBlocksSchema.safeParse([
      {
        id: "table-1",
        type: "table",
        caption: "Comparison",
        headers: ["A", "B"],
        rows: [["only one"]],
      },
    ]);
    expect(result.success).toBe(false);
  });

  it("calculates at least a one-minute reading time", () => {
    expect(
      estimatedReadingMinutes([{ id: "para-1", type: "paragraph", text: "Short copy." }]),
    ).toBe(1);
  });
});
