import { describe, expect, it } from "vitest";

import { assertTransitionAllowed, canTransition } from "./state-machine";

describe("content state machine", () => {
  it("never grants editorial transitions to lead managers", () => {
    expect(() =>
      assertTransitionAllowed({
        from: "draft",
        to: "in_review",
        role: "lead_manager",
        actorId: "lead-manager",
        updatedBy: "editor",
        medicalReviewRequired: false,
      }),
    ).toThrow(/cannot change editorial content/i);
  });
  it("permits only declared transitions", () => {
    expect(canTransition("draft", "in_review")).toBe(true);
    expect(canTransition("draft", "published")).toBe(false);
    expect(canTransition("archived", "published")).toBe(false);
  });

  it("prevents editor publication and medical self-approval", () => {
    expect(() =>
      assertTransitionAllowed({
        from: "approved",
        to: "published",
        role: "editor",
        actorId: "a",
        updatedBy: "b",
        medicalReviewRequired: true,
      }),
    ).toThrow(/admin/i);
    expect(() =>
      assertTransitionAllowed({
        from: "in_review",
        to: "approved",
        role: "clinician_reviewer",
        actorId: "a",
        updatedBy: "a",
        medicalReviewRequired: true,
      }),
    ).toThrow(/self-approved/i);
  });

  it("allows a distinct clinician reviewer to approve", () => {
    expect(() =>
      assertTransitionAllowed({
        from: "in_review",
        to: "approved",
        role: "clinician_reviewer",
        actorId: "reviewer",
        updatedBy: "editor",
        medicalReviewRequired: true,
      }),
    ).not.toThrow();
  });
});
