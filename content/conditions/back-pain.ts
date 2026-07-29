import { comparisonTableRows } from "@/content/comparison-table";
import type { Condition } from "@/content/conditions/types";

/** Back Pain condition content per condition-page-spec §B, §C. */
export const backPainCondition: Condition = {
  slug: "back-pain",
  name: "Back Pain",
  hero: {
    eyebrowChip: "BACK PAIN",
    h1: "Back Pain Care Built Around Your Recovery",
    subhead:
      "Whether it's a stubborn ache or a sharp, sudden pain, Dr. Abe Nasser gets to the cause instead of just calming the symptom.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Man holding his lower back in pain",
    },
  },
  understanding: {
    eyebrow: "Understanding Back Pain",
    intro:
      "Back pain can show up as a dull ache after a long day or a sharp, locking pain that stops you mid-movement. It's one of the most common reasons people come in — and one of the most treatable when the actual cause is identified early.",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Dr. Abe examining a patient's lower back",
    },
    types: [
      {
        name: "Mechanical Back Pain",
        desc: "Pain from joint, muscle, or ligament strain in the spine itself — the most common type, often tied to posture, lifting, or overuse.",
      },
      {
        name: "Disc-Related Back Pain",
        desc: "Pain from a bulging or herniated disc pressing on nearby structures, often radiating into the hip or leg.",
      },
    ],
    causes: [
      "Heavy lifting with poor form",
      "Prolonged sitting or standing",
      "Car accidents and sudden impacts",
      "Degenerative disc changes over time",
      "Muscle imbalance from inactivity",
    ],
    redFlags: [
      "Numbness, tingling, or weakness in one or both legs",
      "Loss of bladder or bowel control",
      "Back pain following a fall, accident, or direct blow",
    ],
  },
  accident: {
    headline: "Back pain after a crash needs documentation, not just rest",
    body: "A sudden impact can strain the discs and joints of the lower back in ways that don't show up until days later. Florida law gives you 14 days after the accident to get evaluated and protect your PIP benefits.",
    smallprint:
      "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
  },
  comparisonRows: comparisonTableRows,
  faq: {
    headerTail: "back pain",
    items: [
      {
        q: "Is it safe to get adjusted if I have a herniated disc?",
        a: "Often yes — many disc-related cases respond well to gentle adjustments and decompression. We'll confirm what's safe for your specific case during your exam, not guess.",
      },
      {
        q: "Should I rest or stay active with back pain?",
        a: "Some rest helps early on, but too much of it can slow recovery. We'll give you a specific plan for what to do and avoid based on what's actually causing your pain.",
      },
      {
        q: "What if my back pain radiates down my leg?",
        a: "That's often a sign of nerve involvement, commonly from a disc issue or sciatica. It's worth an exam sooner rather than later so we can catch it early.",
      },
      {
        q: "How many visits does back pain usually take to improve?",
        a: "Mechanical strain often improves within a few visits; disc-related pain can take longer. We reassess along the way and adjust the plan as you go.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression that opens up compressed joints and eases pressure on discs and nerves in the lower back.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services",
    },
    {
      title: "Adjustments",
      desc: "Hands-on adjustments that restore motion to fixated segments in the mid and low back — the foundation of most back-pain treatment plans.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Soft-tissue work that loosens the muscle guarding and spasm that often accompanies low-back pain.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services",
    },
  ],
  flags: {
    isAccidentVariant: false,
    extraComparisonRows: false,
  },
};
