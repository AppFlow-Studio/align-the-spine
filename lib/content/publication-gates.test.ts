import { describe, expect, it } from "vitest";

import { fixtureContent } from "./fixtures";
import { evaluatePublicationGates } from "./publication-gates";

describe("publication gates", () => {
  it("does not block publication on missing clinician reviewer attribution", () => {
    // Owner direction 2026-08-18: the CMS moved to a separate project and
    // this app no longer has a reviewer-assignment UI, so clinician review
    // is no longer a hard publish blocker here — only content-quality gates
    // (thin content, missing sources, etc.) still apply.
    const result = evaluatePublicationGates(fixtureContent[0]!);
    expect(result.blockers.some((blocker) => /clinician/i.test(blocker))).toBe(false);
  });

  it("blocks service-area home-visit wording without city eligibility verification", () => {
    const result = evaluatePublicationGates(fixtureContent[2]!);
    expect(result.blockers.some((blocker) => /Home-visit eligibility/i.test(blocker))).toBe(true);
  });

  it("requires several unique local proof points", () => {
    const area = structuredClone(fixtureContent[2]!);
    area.serviceArea!.uniqueLocalProofPoints = ["Only one"];
    const result = evaluatePublicationGates(area);
    expect(result.blockers.some((blocker) => /three materially unique/i.test(blocker))).toBe(true);
  });

  it("requires key takeaways and an FAQ for blog posts", () => {
    const post = structuredClone(fixtureContent[0]!);
    post.keyTakeaways = [];
    post.faqs = [];
    const result = evaluatePublicationGates(post);
    expect(result.blockers.some((blocker) => /key takeaway/i.test(blocker))).toBe(true);
    expect(result.blockers.some((blocker) => /FAQ is required/i.test(blocker))).toBe(true);
  });

  it("does not require key takeaways or FAQs for service areas", () => {
    const area = structuredClone(fixtureContent[2]!);
    area.keyTakeaways = [];
    area.faqs = [];
    const result = evaluatePublicationGates(area);
    expect(result.blockers.some((blocker) => /key takeaway bullet/i.test(blocker))).toBe(false);
    expect(result.blockers.some((blocker) => /FAQ is required/i.test(blocker))).toBe(false);
  });
});
