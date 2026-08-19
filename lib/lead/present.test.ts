import { describe, expect, it } from "vitest";

import { attributionSummary, formLabel, leadDisplayName, shortSubmissionId } from "./present";
import type { LeadRow } from "./types";

describe("attributionSummary", () => {
  it("shows utm values and reports click ids as present (non-PII)", () => {
    const summary = attributionSummary({ utm_source: "google", gclid: "Cj0KEQ..." });
    expect(summary).toBe("source=google; gclid present");
    expect(summary).not.toContain("Cj0KEQ");
  });

  it("returns null when empty", () => {
    expect(attributionSummary({})).toBeNull();
  });
});

describe("formLabel", () => {
  it("maps known variants to friendly labels", () => {
    expect(formLabel("accidentEval")).toBe("Accident evaluation");
    expect(formLabel("eligibility")).toBe("Home-visit eligibility");
  });

  it("falls back to the raw variant for unknowns", () => {
    expect(formLabel("mystery")).toBe("mystery");
  });
});

describe("shortSubmissionId", () => {
  it("returns the first UUID segment", () => {
    expect(shortSubmissionId("a1b2c3d4-0000-0000-0000-000000000000")).toBe("a1b2c3d4");
  });
});

describe("leadDisplayName", () => {
  const base = { first_name: null, last_name: null, full_name: null } as unknown as LeadRow;
  it("prefers full_name", () => {
    expect(leadDisplayName({ ...base, full_name: "Jane Q" })).toBe("Jane Q");
  });
  it("combines first + last", () => {
    expect(leadDisplayName({ ...base, first_name: "Jane", last_name: "Doe" })).toBe("Jane Doe");
  });
  it("returns null when nothing is set", () => {
    expect(leadDisplayName(base)).toBeNull();
  });
});
