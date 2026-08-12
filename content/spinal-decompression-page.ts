import type { ConditionFaq } from "@/content/conditions/types";

/** Bespoke content for the dedicated /services/spinal-decompression page —
 * same per-page, hand-built approach as the condition pages and
 * /services/chiropractic-adjustments. Pulled from the Figma
 * services-spinal-decompression frame (file 3oNk0hDle8VMrPJQ0W0pDG, node
 * 135:326) via get_design_context, cross-checked against the rendered
 * screenshot.
 *
 * ATS-E4 compliance scrubbing applied, same as every other page this pass
 * touched: the hero subhead's "Same-day evaluation" claim and its
 * footerNote's hardcoded city list are removed/neutralized, "How It Works"
 * step 3's "billed to PIP" framing reworded to "documented for your claim",
 * the FAQ's "bill PIP correctly" reworded to "document it for your PIP
 * claim", the doctor-bio band's "handles the documentation and billing
 * directly with your PIP claim" claim is dropped entirely (page reuses the
 * already-scrubbed shared doctorProfileContent bio instead), and the
 * closing CTA band's "Same-day visits, seven days a week" claim is removed.
 * The FAQ section is a literal copy of the adjustments page's FAQ heading
 * ("...about chiropractic adjustments" — the same copy-paste bug documented
 * on every other page this pass touched) — replaced with real,
 * decompression-specific questions instead of carrying the mismatch
 * forward again. */

export const spinalDecompressionHero = {
  eyebrowChip: "Disc or radiating nerve pain?",
  h1: "Spinal Decompression in Deerfield Beach, FL",
  subhead:
    "Non-surgical spinal decompression uses controlled traction to reduce pressure on spinal joints and discs. An evaluation determines whether it fits your case.",
  backgroundImage: {
    src: "/figma-exports/spinal-decompression-hero.png",
    alt: "Treatment room set up for spinal decompression therapy",
  },
};

export interface DecompressionStep {
  title: string;
  description: string;
  learnMoreHref?: string;
}

export const decompressionHowItWorks: DecompressionStep[] = [
  {
    title: "Full evaluation & imaging review",
    description:
      "We confirm whether the collision caused or worsened a disc injury, and review any imaging you already have.",
    learnMoreHref: "/car-accident-chiropractor",
  },
  {
    title: "Controlled traction sessions",
    description:
      "A specific pull is applied to the spine, gradually relieving the pressure a crash put on the disc and nerve.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Plan and reassessment",
    description:
      "Session frequency depends on your findings and response. Accident-related care is documented for your claim when applicable.",
    learnMoreHref: "/car-accident-chiropractor",
  },
];

export interface DecompressionCondition {
  name: string;
  description: string;
  image: { src: string; alt: string };
}

/** Conditions evaluated for decompression — per the Figma frame, each row
 * uses a treatment photo rather than an anatomy diagram. */
export const decompressionConditions: DecompressionCondition[] = [
  {
    name: "Sciatica",
    description:
      "Radiating leg pain that may involve irritation or compression of a lower-back nerve.",
    image: {
      src: "/figma-exports/decompression-sciatica.png",
      alt: "Chiropractor treating a patient's lower back for sciatica",
    },
  },
  {
    name: "Whiplash-Related Disc Injury",
    description:
      "When the disc itself is affected by a collision, not just the surrounding soft tissue.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-whiplash.png",
      alt: "Hand assessing a patient's neck for whiplash-related disc injury",
    },
  },
  {
    name: "Herniated Disc (Back)",
    description: "A lower-back disc condition that may irritate nearby nerves and affect movement.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-herniated%20disc.png",
      alt: "Hands treating a patient's lower back for a herniated disc",
    },
  },
  {
    name: "Herniated Disc (Neck)",
    description:
      "When the force of a crash affects a disc in the neck, not just the surrounding muscle.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-head.png",
      alt: "Hands treating a patient's neck for a herniated disc",
    },
  },
];

export const decompressionFaq: ConditionFaq = {
  headerTail: "spinal decompression",
  items: [
    {
      q: "Can a car accident cause a herniated disc?",
      a: "A collision can injure or aggravate a spinal disc, but symptoms alone cannot confirm a herniation. An evaluation and any appropriate imaging review help determine the likely source.",
    },
    {
      q: "Is spinal decompression painful?",
      a: "Spinal decompression uses controlled traction and should be adjusted to your comfort. Tell Dr. Abe about pain or unusual symptoms during or after a session so the plan can be reassessed.",
    },
    {
      q: "How is this different from a chiropractic adjustment?",
      a: "An adjustment restores motion to a joint with a quick, controlled thrust. Decompression instead uses a slow, sustained pull to create negative pressure inside the disc itself — the two are often used together depending on what the evaluation finds.",
    },
    {
      q: "How many sessions will I need after an accident?",
      a: "The number of sessions depends on exam findings and response to care. Dr. Abe reassesses progress and documents accident-related treatment when applicable.",
    },
  ],
};
