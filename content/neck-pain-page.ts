import { DEFAULT_ACCIDENT_SMALLPRINT } from "@/content/conditions/types";
import type {
  ConditionAccident,
  ConditionFaq,
  ConditionFeelsLikeItem,
  ConditionTreatmentItem,
  ConditionWarning,
} from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Bespoke content for the dedicated /conditions/neck-pain page — same
 * per-condition, hand-built approach as /conditions/back-pain (ATS-137).
 * Pulled from the Figma `neck-pain` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:3094) via get_metadata/get_design_context, cross-checked against
 * the 10 design screenshots provided directly.
 *
 * Two deliberate deviations from the literal Figma text, the same class of
 * copy-paste mixup documented on back-pain-page.ts: the "Was this from an
 * accident?" banner and the FAQ (both header and all 4 items) read as
 * written for the Sciatica page verbatim, identical to back-pain's Figma
 * frame. Kept genuinely neck-pain-specific copy for both instead. */

export const neckPainHero = {
  // ATS-SEO-053: was "Neck pain after a car accident?" — same intent
  // mismatch fixed on back-pain under ATS-SEO-052, but more pronounced
  // here: this page's registered primaryQuery (content/seo.ts) and the
  // ATS-SEO-004 keyword map both assign ordinary, non-accident neck pain to
  // this route, while "neck pain after car accident" is explicitly routed
  // to /conditions/whiplash instead (that page owns "Whiplash after an
  // accident?" framing) — see the keyword-map doc's cannibalization risk
  // #2. Reworded to lead with everyday neck pain; the accident angle keeps
  // its own section/bridge further down the page (neckPainAccident).
  eyebrowChip: "Stiff neck that won't loosen up?",
  h1: "Neck Pain Chiropractor in Deerfield Beach, FL",
  subhead:
    "Chiropractic evaluation for neck pain, stiffness, and limited motion — whether it built up from posture and tension or started after a car accident.",
  backgroundImage: {
    src: "/figma-exports/dr-abe-neck.png",
    alt: "Dr. Abe Nasser examining a patient's neck",
  },
};

// ATS-SEO-053: reordered so the two accident-related causes sit last,
// matching this page's non-accident primary intent (see neckPainHero's doc
// comment) — same everyday-first ordering already used on
// backPainCauses.
export const neckPainCauses: string[] = [
  "Poor sleep posture",
  'Prolonged screen time ("tech neck")',
  "Stress-related muscle tension",
  "Degenerative joint changes",
  "Whiplash from a rear-end collision",
  "Car accidents and sudden impact",
];

// ATS-SEO-043: plain path config — see content/back-pain-page.ts's
// identical note for why (circular import via content/seo.ts).
export const neckPainRelatedMidPageConfig = {
  paths: ["/conditions/whiplash", "/services/spinal-decompression", "/car-accident-chiropractor"],
  highlightPath: "/services/spinal-decompression",
};

export const neckPainHowWeTreat: ConditionTreatmentItem[] = [
  {
    title: "Myofascial Release/Trigger Point",
    desc: "Tension from posture, stress, or sleep position tends to build up as tight knots in the neck and shoulders. The Graston tool breaks up that muscle tightness — similar to a deep massage, but targeted to the specific spots holding tension.",
    image: {
      src: "/figma-exports/how-we-treat-1.png",
      alt: "Myofascial release and trigger point therapy with the Graston tool",
    },
    meta: "1 hr",
    ctaLabel: "BOOK NOW",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Adjustment",
    desc: "Everyday stiffness often comes from small fixations in the neck's vertebrae — segments that aren't moving the way they should. Adjustments restore that motion, which is usually what turns a stiff neck into a fully mobile one again.",
    image: {
      src: "/figma-exports/adjustment-image.jpeg",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
    meta: "1 hr",
    ctaLabel: "BOOK NOW",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Traction/Decompression",
    desc: "For selected neck-pain cases involving a disc or joint concern, controlled traction may reduce pressure between vertebrae. The evaluation determines whether it is appropriate.",
    image: {
      src: "/figma-exports/how-we-treat-3.png",
      alt: "Spinal traction and decompression therapy",
    },
    meta: "1 hr",
    ctaLabel: "BOOK NOW",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Home Visit Care",
    desc: "For neck pain bad enough that turning your head to drive is uncomfortable, we bring the exam and treatment to you instead of asking you to make the trip.",
    image: {
      src: "/figma-exports/how-we-treat-4.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Check eligibility",
    ctaLabel: "CHECK ELIGIBILITY",
    ctaHref: "/home-visit-chiropractor",
  },
];

export const neckPainFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Morning stiffness",
    desc: "Tight and hard to turn first thing, loosening up as the day goes on.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Tech neck ache",
    desc: "A dull, nagging strain at the base of the skull after hours at a desk or on a phone.",
    learnMoreHref: "/services/soft-tissue-therapy",
  },
  {
    title: "Radiating tension",
    desc: "Tightness that spreads into the shoulders and upper back, not just the neck itself.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Sharp or sudden pain",
    desc: "A specific movement or angle that triggers a sharp catch, often a sign it's more structural.",
    learnMoreHref: "/conditions/whiplash",
  },
];

export const neckPainWarning: ConditionWarning = {
  heading: "See a doctor promptly if you notice:",
  image: {
    src: "/figma-exports/drabe-releasetool.png",
    alt: "Dr. Abe treating a patient's neck and shoulder",
  },
  bullets: [
    { label: "Numbness or tingling radiating into the arm or hand", href: "/conditions/whiplash" },
    { label: "Weakness in the arm or grip", href: "/services/spinal-decompression" },
    // ATS-SEO-053: named the recognized clinical concern this combination
    // of symptoms flags — cervical spinal cord compression, not cauda
    // equina syndrome (that term is specific to the lumbar spine and was
    // used on back-pain-page.ts's equivalent bullet instead) — grounds the
    // guidance in accurate terminology without diagnosing the reader.
    {
      label:
        "Loss of bladder or bowel control, or new weakness in both arms and legs (recognized warning signs of spinal cord compression) — seek emergency care",
    },
  ],
};

export const neckPainAccident: ConditionAccident = {
  headline: "Neck pain after a crash needs documentation, not just rest",
  body: "A sudden impact can strain the muscles and ligaments supporting the cervical spine, and symptoms may appear later. Florida PIP generally requires initial services and care within 14 days of a motor vehicle accident.",
  smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
};

// Plain path config — see neckPainRelatedMidPageConfig's doc comment above.
export const neckPainRelatedBottomConfig = {
  paths: [
    "/conditions/back-pain",
    "/conditions/whiplash",
    "/services/spinal-decompression",
    "/conditions",
    "/car-accident-chiropractor",
    "/blog",
    "/book-an-appointment",
  ],
  highlightPath: "/book-an-appointment",
};

export const neckPainFaq: ConditionFaq = {
  headerTail: "neck pain",
  items: [
    {
      q: "Is it normal for neck pain to spread into my shoulders?",
      a: "Yes — the muscles and nerves in your neck connect directly into the shoulders and upper back, so referred pain and stiffness in that area is common with both acute and chronic neck pain.",
    },
    {
      q: "Can a chiropractor help with a pinched nerve in my neck?",
      a: "Chiropractic care may be appropriate for some musculoskeletal causes of nerve irritation. An exam is needed first to determine whether adjustments, soft-tissue care, imaging review, or referral is the safer next step.",
    },
    {
      q: "How long can neck pain take to improve?",
      a: "Timing varies with the cause, severity, and how long symptoms have been present. Dr. Abe reassesses your response to care and adjusts the plan rather than promising a fixed number of visits.",
    },
    {
      q: "Should I still come in if my neck pain started weeks ago?",
      a: "Yes. An evaluation can help identify musculoskeletal contributors and whether chiropractic care or another type of care is appropriate, even when symptoms began weeks ago.",
    },
  ],
};
