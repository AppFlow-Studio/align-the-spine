import type { ConditionFaq, ConditionFeelsLikeItem } from "@/content/conditions/types";

/** Bespoke content for the dedicated /conditions/cervicogenic-headache page
 * — same per-condition, hand-built approach as /conditions/back-pain and
 * /conditions/neck-pain (ATS-137), and the same per-page approach as the
 * 3 /services/* pages built this pass. Pulled from the Figma
 * `Cervicogenic Headache` frame (file 3oNk0hDle8VMrPJQ0W0pDG, node
 * 138:462) via get_metadata (get_design_context and download_assets were
 * both unavailable — Figma MCP tool-call limit reached mid-session).
 *
 * This frame is built on top of the massage-soft-tissue frame rather than
 * from scratch: only the Hero and "Understanding"/"What it feels like"
 * sections are genuinely cervicogenic-headache content — everything below
 * that (the FAQ, the "Conditions X relieves" list, the doctor-bio band) is
 * literal leftover massage-soft-tissue copy, unchanged apart from the H1.
 * Kept genuinely headache-specific content for the FAQ and skipped the
 * leftover "Conditions X relieves" list entirely rather than force
 * unrelated content onto a headache page (its differentiation job is
 * already done by the "what it feels like" grid below).
 *
 * ATS-E4 compliance scrubbing applied, same as every other page this pass
 * touched: the hero subhead's "Same-day evaluation... billed directly to
 * PIP" claim is removed/neutralized, and the closing CTA band's "Same-day
 * visits, seven days a week" claim is removed. The doctor-bio band's
 * "billed directly to your PIP claim" claim is dropped entirely (page
 * reuses the already-scrubbed shared doctorProfileContent bio instead).
 *
 * Deviation from the design-to-code skill's normal asset flow: the hero
 * background photo (node "hf_20260717_002604_...") couldn't be downloaded
 * because of the Figma tool-call limit, so this reuses the existing
 * /figma-exports/drabe-headache.png asset (already shipped on /services,
 * same subject matter) rather than inventing or guessing a substitute. */

export const cervicogenicHeadacheHero = {
  eyebrowChip: "Headaches that started after a car accident?",
  h1: "Cervicogenic Headache Chiropractor in Deerfield Beach, FL",
  subhead:
    "Headaches that actually start in your neck, not your head. Full evaluation and PIP documentation available when accident-related.",
  backgroundImage: {
    src: "/figma-exports/drabe-headache.png",
    alt: "Dr. Abe Nasser examining a patient for headache-related neck tension",
  },
};

export const cervicogenicHeadacheFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Base-of-skull ache",
    desc: "Starts at the back of the head and radiates forward.",
    learnMoreHref: "/conditions/neck-pain",
  },
  {
    title: "One-sided pressure",
    desc: "Stays on one side, unlike a typical tension headache.",
    learnMoreHref: "/conditions/whiplash",
  },
  {
    title: "Worse with movement",
    desc: "Turning or tilting the head triggers or intensifies it.",
    learnMoreHref: "/services/chiropractic-adjustments",
  },
  {
    title: "Doesn't respond to meds",
    desc: "Because the source is the neck, not the head.",
    learnMoreHref: "/services/spinal-decompression",
  },
];

export interface CervicogenicHeadacheCondition {
  name: string;
  description: string;
  image: { src: string; alt: string };
}

/** "Conditions cervicogenic headache relieves" list — related conditions
 * that either cause or commonly overlap with a cervicogenic headache after
 * a collision, each linking to its own dedicated condition page. */
export const cervicogenicHeadacheConditions: CervicogenicHeadacheCondition[] = [
  {
    name: "Whiplash",
    description:
      "The neck injury that most often triggers this type of headache after a collision.",
    image: {
      src: "/figma-exports/decompression-whiplash-disc.png",
      alt: "Hand assessing a patient's neck after whiplash",
    },
  },
  {
    name: "Neck Pain",
    description: "Ongoing stiffness and tension in the neck that radiates upward into a headache.",
    image: {
      src: "/figma-exports/drabe-shoulder.png",
      alt: "Dr. Abe Nasser treating a patient's neck and shoulder",
    },
  },
  {
    name: "TMJ / Jaw Pain",
    description: "Jaw clenching and joint strain from impact that can compound headache symptoms.",
    image: {
      src: "/figma-exports/drabe-head.png",
      alt: "Hands treating a patient's head and jaw",
    },
  },
  {
    name: "Concussion",
    description: "A head injury that can overlap with or mask a cervicogenic headache's symptoms.",
    image: {
      src: "/figma-exports/align-thespne-neck.png",
      alt: "Dr. Abe Nasser examining a patient's neck",
    },
  },
];

export const cervicogenicHeadacheFaq: ConditionFaq = {
  headerTail: "cervicogenic headaches",
  items: [
    {
      q: "Can a car accident cause headaches that show up weeks later?",
      a: "Yes — cervicogenic headaches are often delayed, sometimes by days or weeks, since the neck tension and joint irritation behind them can take time to fully develop. If a headache started any time after an accident, it's worth mentioning at your evaluation.",
    },
    {
      q: "How do I know if my headache is coming from my neck?",
      a: "A few signs point to it: it stays on one side, it gets worse when you turn or tilt your head, and it doesn't respond well to typical headache medication. A neck-focused exam is the only way to confirm it.",
    },
    {
      q: "Will pain medication help?",
      a: "Usually not much, since a cervicogenic headache's source is the joints and nerves in the neck, not the head itself. Treating the neck directly tends to work better than treating the headache in isolation.",
    },
    {
      q: "How many visits will I need?",
      a: "It depends on how long the tension and joint irritation have been building. Some patients feel meaningful relief within the first few visits; others need a longer plan. We reassess as you go.",
    },
  ],
};
