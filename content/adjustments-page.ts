import type { ConditionFaq } from "@/content/conditions/types";

/** Bespoke content for the dedicated /services/chiropractic-adjustments
 * page — same per-page, hand-built approach as the 4 condition pages
 * (ATS-137). Pulled from the Figma `services-chiropractic-adjustements`
 * frame (file 3oNk0hDle8VMrPJQ0W0pDG, node 96:1228) via
 * get_design_context, cross-checked against the rendered screenshot.
 *
 * ATS-E4 compliance scrubbing applied throughout, same as every other
 * page this pass touched: the Figma hero subhead's "Same-day visits"
 * claim, the "How It Works" third step's "billed to PIP"/"billed
 * directly to your claim" framing, the doctor-bio band's "hundreds of
 * accident cases"/attorney-referral claim, and the closing CTA band's
 * "Same-day visits, seven days a week" claim are all removed or
 * neutralized — none have client approval. The FAQ section is a literal
 * copy of the sciatica page's FAQ (same "Everything you need to know
 * about treating sciatica"-class copy-paste bug documented on
 * back-pain-page.ts/sciatica-page.ts) — replaced with real,
 * adjustments-specific questions instead of carrying the mismatch
 * forward again. */

export const adjustmentsHero = {
  eyebrowChip: "Injured in a car accident?",
  h1: "Chiropractic Adjustments in Deerfield Beach, FL",
  subhead:
    "Restore motion lost in a collision — full evaluation, treatment, and documentation for your PIP claim. In-home care available when it applies.",
  backgroundImage: {
    src: "/figma-exports/adjustments-hero.png",
    alt: "Treatment room set up for a chiropractic adjustment",
  },
};

export interface AdjustmentsStep {
  title: string;
  description: string;
  learnMoreHref?: string;
}

export const adjustmentsHowItWorks: AdjustmentsStep[] = [
  {
    title: "Full evaluation",
    description:
      "We identify exactly which segments lost motion in the collision and rule out anything needing imaging or referral first.",
    learnMoreHref: "/auto-accidents",
  },
  {
    title: "Hands-on adjustment",
    description:
      "Precise, controlled pressure restores motion to the affected joint. Many patients feel relief immediately.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Ongoing plan, billed to PIP",
    description:
      "Some cases resolve in one visit; others need a short series. Everything is documented and billed directly to your claim.",
    learnMoreHref: "/auto-accidents#pip",
  },
];

export const adjustmentsFaq: ConditionFaq = {
  headerTail: "chiropractic adjustments",
  items: [
    {
      q: "Does an adjustment hurt?",
      a: "Most patients feel pressure or a release, not pain — some soreness afterward is common, similar to starting a new stretch or exercise. We adjust our approach if anything feels off during your visit.",
    },
    {
      q: "Is an adjustment safe after a car accident?",
      a: "Often yes, once we've ruled out fracture, dislocation, or significant nerve compression during your evaluation. That's why the first visit is a full exam, not straight to treatment.",
    },
    {
      q: "How is an adjustment different from a massage?",
      a: "A massage works the soft tissue around a joint; an adjustment targets the joint itself — restoring motion to a segment that's stopped moving properly (a fixation), which is often the real source of the pain.",
    },
    {
      q: "How many adjustments will I need?",
      a: "It depends on the injury. Some patients feel significantly better after one visit; others need a short series. We reassess as you go rather than committing you to a fixed package upfront.",
    },
  ],
};
