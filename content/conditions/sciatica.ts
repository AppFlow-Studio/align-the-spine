import { comparisonTableRows } from "@/content/comparison-table";
import { DEFAULT_ACCIDENT_SMALLPRINT, type Condition } from "@/content/conditions/types";

/** Sciatica condition content per condition-page-spec §B, §C. */
export const sciaticaCondition: Condition = {
  slug: "sciatica",
  name: "Sciatica",
  hero: {
    eyebrowChip: "SCIATICA",
    h1: "Stop Living Around the Pain in Your Leg",
    subhead:
      "Sciatica isn't something to just push through. Dr. Abe Nasser targets the nerve compression causing it, not just the pain it sends down your leg.",
    backgroundImage: {
      src: "/figma-exports/align-thespine-back.png",
      alt: "Dr. Abe adjusting a patient's low back",
    },
  },
  understanding: {
    eyebrow: "Understanding Sciatica",
    intro:
      "Sciatica is nerve pain, not muscle pain — it starts with compression somewhere along the sciatic nerve in your lower spine and radiates down through the hip, leg, and sometimes into the foot. It can range from a dull ache to a sharp, shooting pain that makes sitting or standing miserable.",
    image: {
      src: "/figma-exports/abe-back.png",
      alt: "Dr. Abe examining a patient with sciatic nerve pain",
    },
    types: [
      {
        name: "Acute Sciatica",
        desc: "A sudden flare, often triggered by lifting, twisting, or a herniated disc pressing on the nerve. Usually improves within weeks with the right care.",
      },
      {
        name: "Chronic Sciatica",
        desc: "Recurring or long-standing nerve compression, often from degenerative changes or a disc issue that's never fully resolved.",
      },
    ],
    causes: [
      "Herniated or bulging lumbar disc",
      "Spinal stenosis narrowing the nerve pathway",
      "Piriformis muscle spasm compressing the nerve",
      "Prolonged sitting or poor posture",
      "Pregnancy-related pelvic shifts",
    ],
    redFlags: [
      "Sudden weakness or numbness in your leg or foot",
      "Loss of bladder or bowel control",
      "Pain in both legs at the same time",
    ],
  },
  accident: {
    headline: "Sciatic pain after a crash traces back to spinal impact, not just soreness",
    body: "A collision can jolt the lower spine enough to compress the sciatic nerve, even if the pain doesn't start until days later. To protect your PIP benefits under Florida law, you must get evaluated for your sciatic nerve compression within 14 days of the accident.",
    smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
  },
  comparisonRows: comparisonTableRows,
  faq: {
    headerTail: "sciatica",
    items: [
      {
        q: "Can a chiropractor actually help sciatica, or just back pain?",
        a: "Yes — sciatica often responds well to decompression and targeted adjustments that relieve pressure on the nerve itself, not just the surrounding muscles.",
      },
      {
        q: "Why does my leg hurt more than my back?",
        a: "Because sciatica is nerve pain that travels — the compression is usually in your lower spine, but the pain you feel most is often along the nerve's path down your leg.",
      },
      {
        q: "Is walking good or bad for sciatica?",
        a: "Usually good in moderation — it keeps the area mobile without loading the spine the way sitting does. We'll tell you what's right for your specific case.",
      },
      {
        q: "How fast can I expect relief?",
        a: "Acute cases often ease within a few visits; nerve pain that's been building for months usually takes longer. We'll set expectations after your first exam.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression that's often the most direct way to take pressure off the compressed nerve causing sciatica.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services",
    },
    {
      title: "Adjustments",
      desc: "Targeted lumbar adjustments that restore motion to the segment compressing the sciatic nerve.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Soft-tissue work on the piriformis and surrounding muscles, which are often part of what's compressing the nerve.",
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
