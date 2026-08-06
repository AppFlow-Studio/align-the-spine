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
  eyebrowChip: "Disc pain after a car accident?",
  h1: "Spinal Decompression in Deerfield Beach, FL",
  subhead:
    "Non-surgical traction that relieves pressure on compressed discs and nerves — whether from a car accident or years of wear. Full evaluation and PIP documentation available for accident cases.",
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
    learnMoreHref: "/auto-accidents",
  },
  {
    title: "Controlled traction sessions",
    description:
      "A specific pull is applied to the spine, gradually relieving the pressure a crash put on the disc and nerve.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Ongoing plan, documented for your claim",
    description:
      "Most post-accident cases need a short series, not a single visit. Everything is documented for your claim from day one.",
    learnMoreHref: "/auto-accidents",
  },
];

export interface DecompressionCondition {
  name: string;
  description: string;
  image: { src: string; alt: string };
}

/** "Conditions decompression relieves" list — reuses the existing
 * condition-page anatomy diagrams already shipped for these 4 conditions,
 * rather than sourcing new photography, since the Figma frame's own photo
 * treatment (staff headshots reused across every row) isn't meaningfully
 * tied to each condition anyway. */
export const decompressionConditions: DecompressionCondition[] = [
  {
    name: "Sciatica",
    description: "Nerve pain that shows up after a collision compresses a disc in the lower back.",
    image: {
      src: "/figma-exports/sciatica-anatomy-diagram.png",
      alt: "Sciatica nerve pain diagram",
    },
  },
  {
    name: "Whiplash-Related Disc Injury",
    description:
      "When the force of a crash affects a disc in the neck, not just the surrounding muscle.",
    image: {
      src: "/figma-exports/whiplash-anatomy-diagram.png",
      alt: "Whiplash disc injury diagram",
    },
  },
  {
    name: "Herniated Disc (Back)",
    description: "The most common disc injury we see from rear-end and side-impact collisions.",
    image: {
      src: "/figma-exports/back-pain-anatomy-diagram.png",
      alt: "Herniated lower back disc diagram",
    },
  },
  {
    name: "Herniated Disc (Neck)",
    description:
      "When the disc itself is affected by a collision, not just the surrounding soft tissue.",
    image: {
      src: "/figma-exports/neck-pain-anatomy-diagram.png",
      alt: "Herniated neck disc diagram",
    },
  },
];

export const decompressionFaq: ConditionFaq = {
  headerTail: "spinal decompression",
  items: [
    {
      q: "Can a car accident cause a herniated disc?",
      a: 'Often, yes — even from low-speed collisions. Muscle spasm and disc compression can take a day or two to fully present, which is why people who felt "fine" at the scene are limping by day three. If there was any accident involved, mention it at your evaluation so we can document it for your PIP claim correctly.',
    },
    {
      q: "Is spinal decompression painful?",
      a: "No — the traction is gentle and controlled, and most patients find the sessions relaxing rather than uncomfortable. Some mild soreness afterward is normal, similar to a deep stretch.",
    },
    {
      q: "How is this different from a chiropractic adjustment?",
      a: "An adjustment restores motion to a joint with a quick, controlled thrust. Decompression instead uses a slow, sustained pull to create negative pressure inside the disc itself — the two are often used together depending on what the evaluation finds.",
    },
    {
      q: "How many sessions will I need after an accident?",
      a: "Most post-accident cases need a short series rather than a single visit, since disc pressure typically eases gradually. We reassess as you go and document every session for your claim.",
    },
  ],
};
