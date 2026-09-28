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
    expect(canTransition("draft", "published")).toBe(true);
    expect(canTransition("draft", "in_review")).toBe(true);
    expect(canTransition("archived", "published")).toBe(false);
    expect(canTransition("published", "draft")).toBe(false);
    // Service areas keep the original draft -> in_review -> approved chain.
    expect(canTransition("draft", "published", "service_area")).toBe(false);
    expect(canTransition("draft", "in_review", "service_area")).toBe(true);
  });

  it("lets a blog writer publish their own post with no review handoff", () => {
    expect(() =>
      assertTransitionAllowed({
        from: "draft",
        to: "published",
        role: "editor",
        actorId: "writer",
        updatedBy: "writer",
        medicalReviewRequired: true,
      }),
    ).not.toThrow();
  });

  it("keeps editor publication and medical self-approval blocked on service areas", () => {
    expect(() =>
      assertTransitionAllowed({
        from: "approved",
        to: "published",
        role: "editor",
        actorId: "a",
        updatedBy: "b",
        medicalReviewRequired: true,
        contentType: "service_area",
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
        contentType: "service_area",
      }),
    ).toThrow(/self-approved/i);
  });

  it("allows a distinct clinician reviewer to approve a service area", () => {
    expect(() =>
      assertTransitionAllowed({
        from: "in_review",
        to: "approved",
        role: "clinician_reviewer",
        actorId: "reviewer",
        updatedBy: "editor",
        medicalReviewRequired: true,
        contentType: "service_area",
      }),
    ).not.toThrow();
  });
});
