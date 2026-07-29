import { comparisonTableRows } from "@/content/comparison-table";
import { DEFAULT_ACCIDENT_SMALLPRINT, type Condition } from "@/content/conditions/types";

/** Neck Pain condition content per condition-page-spec §B, §C. */
export const neckPainCondition: Condition = {
  slug: "neck-pain",
  name: "Neck Pain",
  hero: {
    eyebrowChip: "NECK PAIN",
    h1: "Neck Pain Relief That Actually Lasts",
    subhead:
      "From desk-job stiffness to whiplash aftermath, Dr. Abe Nasser builds a plan that restores motion instead of just masking the ache.",
    backgroundImage: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser examining a patient's neck",
    },
  },
  understanding: {
    eyebrow: "Understanding Neck Pain",
    intro:
      "Neck pain can range from a dull, nagging stiffness to sharp pain that limits how far you can turn your head. Left untreated, it often radiates into the shoulders and upper back.",
    image: {
      src: "/figma-exports/align-thespne-neck.png",
      alt: "Dr. Abe examining a seated patient's neck",
    },
    types: [
      {
        name: "Acute Neck Pain",
        desc: "Sudden onset, usually tied to a specific movement, injury, or sleeping position. Typically resolves within a few weeks with the right care.",
      },
      {
        name: "Chronic Neck Pain",
        desc: "Persists for three months or longer, often from poor posture, repetitive strain, or an old injury that never fully healed.",
      },
    ],
    causes: [
      "Poor posture from prolonged desk or phone use",
      "Whiplash from a car accident",
      "Sleeping in an awkward position",
      "Muscle strain from overexertion",
      "Degenerative changes in the cervical spine",
    ],
    redFlags: [
      "Numbness or tingling radiating into your arms or hands",
      "Neck pain following a fall, car accident, or direct blow",
      "Fever, unexplained weight loss, or night sweats alongside neck pain",
    ],
  },
  accident: {
    headline: "If a collision triggered this, Florida gives you 14 days",
    body: "Neck pain after an accident usually traces back to whiplash — sudden strain on the muscles and ligaments supporting your cervical spine. Florida's PIP rules only cover treatment if you're seen within 14 days of the crash, so don't wait for the stiffness to get worse before booking an exam.",
    smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
  },
  comparisonRows: comparisonTableRows,
  faq: {
    headerTail: "neck pain",
    items: [
      {
        q: "Is it normal for neck pain to spread into my shoulders?",
        a: "Yes — the muscles and nerves in your neck connect directly into the shoulders and upper back, so referred pain and stiffness in that area is common with both acute and chronic neck pain.",
      },
      {
        q: "Can a chiropractor help with a pinched nerve in my neck?",
        a: "Often, yes. Gentle cervical adjustments and soft-tissue work can relieve the pressure causing nerve irritation, though we'll confirm it's a good fit during your exam.",
      },
      {
        q: "How long until I feel relief?",
        a: "Many patients notice less stiffness within the first 2–3 visits, though how quickly you improve depends on whether the pain is acute or chronic.",
      },
      {
        q: "Should I still come in if my neck pain started weeks ago?",
        a: "Yes — chronic neck pain responds well to care too. We'll build a plan around how long you've had it and what's likely causing it.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Adjustments",
      desc: "Hands-on cervical adjustments that restore motion to fixated neck segments and ease the stiffness that builds up from poor posture or old injuries.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Posture & Corrective",
      desc: "Corrective care that retrains the neck and upper back for long-term alignment, not just short-term relief from desk or phone strain.",
      image: { src: "/figma-exports/drabe-spine.png", alt: "Posture and corrective spinal care" },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Myofascial release that loosens the muscle spasms behind neck stiffness, often paired with adjustments for faster recovery.",
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
