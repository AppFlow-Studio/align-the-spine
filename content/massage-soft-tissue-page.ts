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
  eyebrowChip: "Muscle tightness or soft-tissue soreness?",
  h1: "Massage & Soft Tissue Therapy in Deerfield Beach, FL",
  subhead:
    "Targeted soft-tissue care for muscle tension, restricted motion, and injury-related soreness, selected after a chiropractic evaluation by Dr. Abe.",
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

/** Conditions addressed with soft-tissue care — per the Figma frame,
 * each row uses a treatment photo rather than an anatomy diagram. Whiplash
 * and Back Pain reuse the same photos as the spinal-decompression page's
 * equivalent rows (identical shots in that Figma file). */
export const massageConditions: MassageCondition[] = [
  {
    name: "Whiplash",
    description:
      "Addresses muscle spasm and guarding around the neck after an appropriate evaluation.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-whiplash.png",
      alt: "Hand assessing a patient's neck after whiplash",
    },
  },
  {
    name: "Neck Pain",
    description: "For tension and stiffness following a collision, not just everyday strain.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/dr-abe-neck.png",
      alt: "Dr. Abe Nasser treating a patient's neck and shoulder",
    },
  },
  {
    name: "Back Pain",
    description: "Targets muscle spasm that may accompany a back, disc, or joint injury.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-backpain-front.png",
      alt: "Hands treating a patient's lower back",
    },
  },
  {
    name: "Shoulder & Extremity",
    description: "Seatbelt-related bruising and soft-tissue trauma in the arms and shoulders.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/align-the-spine-shoulders.png",
      alt: "Hands treating a patient's shoulder",
    },
  },
];

export const massageFaq: ConditionFaq = {
  headerTail: "soft tissue therapy",
  items: [
    {
      q: "Can soft tissue work help right after a car accident?",
      a: "It may be appropriate after an evaluation rules out injuries needing urgent care or referral. Mention the collision and symptom timing so Dr. Abe can choose a suitable technique and document the visit.",
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
      a: "It varies with the injury and response to care. Dr. Abe reassesses your symptoms rather than promising a fixed number of sessions or package upfront.",
    },
  ],
};
