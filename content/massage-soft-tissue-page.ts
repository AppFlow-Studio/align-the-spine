import type { ConditionFaq } from "@/content/conditions/types";

/** Bespoke content for the dedicated /services/massage-soft-tissue page —
 * same per-page, hand-built approach as the condition pages and
 * /services/chiropractic-adjustments and /services/spinal-decompression.
 * Pulled from the Figma services-massage-soft-tissue frame (file
 * 3oNk0hDle8VMrPJQ0W0pDG, node 135:656) via get_design_context,
 * cross-checked against the rendered screenshot.
 *
 * ATS-E4 compliance scrubbing applied, same as every other page this pass
 * touched: the hero subhead's "same-day visits, billed directly to PIP"
 * claim and its footerNote's hardcoded city list are removed/neutralized,
 * the doctor-bio band's "billed directly to your PIP claim" claim is
 * dropped entirely (page reuses the already-scrubbed shared
 * doctorProfileContent bio instead), and the closing CTA band's "Same-day
 * visits, seven days a week" claim is removed. The FAQ section's own
 * heading matched this page correctly for once, but 2 of its 4 questions
 * were copy-pasted from the spinal-decompression page's FAQ ("Is spinal
 * decompression painful?" on a massage page) — replaced with real,
 * massage-specific questions instead of carrying the mismatch forward. */

export const massageSoftTissueHero = {
  eyebrowChip: "Bruised or sore after a crash?",
  h1: "Massage & Soft Tissue Therapy in Deerfield Beach, FL",
  subhead:
    "Hands-on treatment for the muscle spasm, bruising, and soft-tissue strain a collision leaves behind — full evaluation and PIP documentation available for accident cases.",
  backgroundImage: {
    src: "/figma-exports/massage-soft-tissue-hero.png",
    alt: "Soft tissue and massage therapy treatment room",
  },
};

export interface MassageTechnique {
  title: string;
  description: string;
  bestFor: string;
  image: { src: string; alt: string };
}

export const massageTechniques: MassageTechnique[] = [
  {
    title: "Graston Technique / Trigger Point",
    description:
      "Uses a stainless steel tool to break up scar tissue and muscle spasm from a collision — similar to a deep massage, but more targeted.",
    bestFor: "muscle spasm, scar tissue, chronic tension",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Graston technique soft tissue treatment",
    },
  },
  {
    title: "Myofascial Release",
    description:
      "Sustained pressure on the fascia surrounding muscles releases tightness that built up in the days after impact.",
    bestFor: "restricted movement, whiplash-related stiffness",
    image: { src: "/figma-exports/drabe-backpain.png", alt: "Myofascial release treatment" },
  },
  {
    title: "Deep Tissue Therapy",
    description:
      "Slow, firm pressure reaches deeper muscle layers affected by bruising or strain from the crash.",
    bestFor: "deep bruising, muscle guarding, post-accident soreness",
    image: { src: "/figma-exports/drabe-soft-tissue.png", alt: "Deep tissue therapy treatment" },
  },
];

export interface MassageCondition {
  name: string;
  description: string;
  image: { src: string; alt: string };
}

/** "Conditions soft tissue therapy relieves" list — reuses the existing
 * condition-page anatomy diagrams already shipped for Whiplash/Neck
 * Pain/Back Pain, same reuse pattern as the spinal-decompression page's
 * equivalent section. */
export const massageConditions: MassageCondition[] = [
  {
    name: "Whiplash",
    description: "Releases the muscle spasm and guarding around an injured neck after impact.",
    image: { src: "/figma-exports/whiplash-anatomy-diagram.png", alt: "Whiplash injury diagram" },
  },
  {
    name: "Neck Pain",
    description: "For tension and stiffness following a collision, not just everyday strain.",
    image: { src: "/figma-exports/neck-pain-anatomy-diagram.png", alt: "Neck pain diagram" },
  },
  {
    name: "Back Pain",
    description: "Relieves muscle spasm surrounding a disc or joint injury from a crash.",
    image: { src: "/figma-exports/back-pain-anatomy-diagram.png", alt: "Back pain diagram" },
  },
  {
    name: "Shoulder & Extremity",
    description: "Seatbelt-related bruising and soft-tissue trauma in the arms and shoulders.",
    image: { src: "/figma-exports/drabe-shoulder.png", alt: "Shoulder and extremity treatment" },
  },
];

export const massageFaq: ConditionFaq = {
  headerTail: "soft tissue therapy",
  items: [
    {
      q: "Can soft tissue work help right after a car accident?",
      a: "Often, yes — muscle spasm and bruising from a collision typically respond well to hands-on soft tissue work once anything more serious has been ruled out at your evaluation. Mention any accident at that visit so we can document it for your claim correctly.",
    },
    {
      q: "How is this different from a regular massage?",
      a: "A regular massage is general relaxation; this is targeted treatment matched to the specific tissue a collision affected — Graston, myofascial release, or deep tissue, depending on whether it's scar tissue, fascia tightness, or deep bruising.",
    },
    {
      q: "Is this covered under my accident claim?",
      a: "If your injury is accident-related, we document every session so it's on record for your claim. Coverage details depend on your specific policy — we're happy to help however we can.",
    },
    {
      q: "How many sessions will I need after an accident?",
      a: "It varies by injury. Some soreness resolves in a session or two; deeper bruising or chronic guarding may need a short series. We reassess as you go rather than committing you to a fixed package upfront.",
    },
  ],
};
