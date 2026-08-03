import { DEFAULT_ACCIDENT_SMALLPRINT } from "@/content/conditions/types";
import type {
  ConditionAccident,
  ConditionFaq,
  ConditionFeelsLikeItem,
  ConditionRelatedLink,
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
  eyebrowChip: "Neck pain after a car accident?",
  h1: "Neck Pain Chiropractor in Deerfield Beach, FL",
  subhead:
    "Evaluation and decompression-focused treatment for sciatic and radiating nerve pain, with in-home visits available when it applies to your case.",
  backgroundImage: {
    src: "/figma-exports/dr-abe-neck.png",
    alt: "Dr. Abe Nasser examining a patient's neck",
  },
};

export const neckPainCauses: string[] = [
  "Car accidents and sudden impact",
  "Whiplash from a rear-end collision",
  "Poor sleep posture",
  'Prolonged screen time ("tech neck")',
  "Stress-related muscle tension",
  "Degenerative joint changes",
];

export const neckPainRelatedMidPage: ConditionRelatedLink[] = [
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Herniated Disc", href: "/services#spinal-decompression", highlighted: true },
  { label: "Auto Accident Injuries", href: "/auto-accidents" },
];

export const neckPainHowWeTreat: ConditionTreatmentItem[] = [
  {
    title: "Myofasial Release/Trigger Point",
    desc: "Tension from posture, stress, or sleep position tends to build up as tight knots in the neck and shoulders. The Graston tool breaks up that muscle tightness — similar to a deep massage, but targeted to the specific spots holding tension.",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
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
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
    meta: "1 hr",
    ctaLabel: "BOOK NOW",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Traction/Decompression",
    desc: "For neck pain that's structural rather than muscular — often from a disc issue — traction relieves pressure between the vertebrae, helping resolve pain that adjustment alone doesn't fully address.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
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
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Check eligibility",
    ctaLabel: "CHECK ELIGIBILITY",
    ctaHref: "/home-visits",
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
    learnMoreHref: "/services#massage-soft-tissue",
  },
  {
    title: "Radiating tension",
    desc: "Tightness that spreads into the shoulders and upper back, not just the neck itself.",
    learnMoreHref: "/services#spinal-decompression",
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
    { label: "Weakness in the arm or grip", href: "/services#spinal-decompression" },
    { label: "Loss of bladder or bowel control — seek emergency care" },
  ],
};

export const neckPainAccident: ConditionAccident = {
  headline: "Neck pain after a crash needs documentation, not just rest",
  body: "A sudden impact can strain the muscles and ligaments supporting the cervical spine in ways that don't show up until days later. Florida law gives you 14 days after the accident to get evaluated and protect your PIP benefits.",
  smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
};

export const neckPainRelatedBottom: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Auto Accident Injuries", href: "/auto-accidents", highlighted: true },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
  { label: "Spinal Decompression", href: "/services#spinal-decompression" },
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Home Visit Care", href: "/home-visits" },
  { label: "Herniated Disc", href: "/services#spinal-decompression" },
  { label: "View All Treatments", href: "/services" },
];

export const neckPainFaq: ConditionFaq = {
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
};
