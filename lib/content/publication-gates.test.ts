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

  it("requires an FAQ for blog posts but only recommends key-takeaway bullets", () => {
    // Bullets stopped being a blocker when publication stopped waiting on a
    // second person (202609270002): the summary box already renders the
    // required directAnswer, so a bulletless post is publishable. FAQs stay
    // required — they render on the page and carry the FAQPage structured data.
    const post = structuredClone(fixtureContent[0]!);
    post.keyTakeaways = [];
    post.faqs = [];
    const result = evaluatePublicationGates(post);
    expect(result.blockers.some((blocker) => /key takeaway/i.test(blocker))).toBe(false);
    expect(result.recommendations.some((entry) => /key-takeaway/i.test(entry))).toBe(true);
    expect(result.blockers.some((blocker) => /FAQ is required/i.test(blocker))).toBe(true);
  });

  it("keeps a bulletless post publishable when everything else is in place", () => {
    const post = structuredClone(fixtureContent[0]!);
    post.keyTakeaways = [];
    post.noindex = false;
    post.noindexReason = undefined;
    // The fixture is a short seed; the word-count gate is a separate rule and
    // isn't what this test is about.
    post.blocks = [
      ...post.blocks,
      {
        id: "filler",
        type: "paragraph",
        text: Array.from({ length: 400 }, () => "word").join(" "),
      },
    ];
    const result = evaluatePublicationGates(post);
    expect(result.blockers).toEqual([]);
    expect(result.passed).toBe(true);
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
