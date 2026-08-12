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
  eyebrowChip: "Joint stiffness or limited motion?",
  h1: "Chiropractic Adjustments in Deerfield Beach, FL",
  subhead:
    "Hands-on chiropractic adjustments use controlled pressure to improve joint motion. Dr. Abe evaluates your symptoms and safety before treatment.",
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
    learnMoreHref: "/car-accident-chiropractor",
  },
  {
    title: "Hands-on adjustment",
    description:
      "Dr. Abe applies precise, controlled pressure to an appropriate joint based on your exam findings and comfort.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Plan and reassessment",
    description:
      "Visit frequency depends on your symptoms and response to care. Accident-related findings are documented when relevant to your claim.",
    learnMoreHref: "/car-accident-chiropractor",
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
      a: "It may be appropriate after an evaluation rules out concerns that need imaging, urgent care, or referral. The first visit starts with an exam rather than assuming an adjustment is suitable.",
    },
    {
      q: "How is an adjustment different from a massage?",
      a: "A massage works the soft tissue around a joint; an adjustment targets the joint itself — restoring motion to a segment that's stopped moving properly (a fixation), which is often the real source of the pain.",
    },
    {
      q: "How many adjustments will I need?",
      a: "It depends on the condition, exam findings, and response to care. Dr. Abe reassesses progress instead of promising a fixed visit count or package upfront.",
    },
  ],
};
