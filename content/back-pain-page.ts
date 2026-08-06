import { DEFAULT_ACCIDENT_SMALLPRINT } from "@/content/conditions/types";
import type {
  ConditionAccident,
  ConditionFaq,
  ConditionFeelsLikeItem,
  ConditionRelatedLink,
  ConditionTreatmentItem,
  ConditionWarning,
  ConditionWhenToSee,
} from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Bespoke content for the dedicated /conditions/back-pain page (not the
 * shared Condition schema / [slug] template — the user asked to move off
 * that generic approach: every condition page gets its own screenshots and
 * its own hand-built page, starting here). Pulled from the Figma
 * `back-pain` frame (file 4mb4VDHszsaj2KEZzyjOjf, node 96:3517) via
 * get_design_context, cross-checked against the 10 design screenshots
 * provided directly.
 *
 * One deliberate deviation from the literal Figma text, same class of
 * copy-paste mixup documented in the previous back-pain.ts (now removed):
 * the "Was this from an accident?" banner and the FAQ header both read as
 * written for the Sciatica page ("Sciatic pain after an accident...",
 * "...treating sciatica"), not Back Pain. Kept this page's own
 * back-pain-specific copy for both instead of copying the mismatched text
 * verbatim. */

export const backPainHero = {
  eyebrowChip: "Back pain after a car accident?",
  h1: "Back pain Chiropractor in Deerfield Beach, FL",
  subhead:
    "Evaluation and decompression-focused treatment for sciatic and radiating nerve pain, with in-home visits available when it applies to your case.",
  backgroundImage: {
    src: "/figma-exports/drabe-backpain-front.png",
    alt: "Hands-on lower-back soft-tissue treatment",
  },
};

export const backPainCauses: string[] = [
  "Muscle or ligament strain",
  "Herniated or bulging discs",
  "Poor posture and prolonged sitting",
  "Pregnancy-related joint shifts",
  "Sports or repetitive strain",
  "Car accidents and sudden impact",
];

export const backPainRelatedMidPage: ConditionRelatedLink[] = [
  { label: "Sciatica", href: "/conditions/sciatica" },
  { label: "Herniated Disc", href: "/services/spinal-decompression", highlighted: true },
  { label: "Auto Accident Injuries", href: "/auto-accidents" },
];

export const backPainWhenToSee: ConditionWhenToSee = {
  heading: "When to See a Chiropractor for Back Pain",
  body: "Most back pain responds well to conservative care, especially when addressed early. It's worth scheduling an evaluation if pain has lasted more than a week or two, is interfering with sleep or daily movement, or followed a car accident, fall, or sudden impact — in Florida, PIP benefits require evaluation within 14 days to stay protected. Seek immediate medical attention rather than chiropractic care if you notice numbness or weakness that's getting worse, or any loss of bladder or bowel control.",
  image: {
    src: "/figma-exports/drabe-back.png",
    alt: "Dr. Abe reviewing a patient's back pain history",
  },
};

export const backPainHowWeTreat: ConditionTreatmentItem[] = [
  {
    title: "Myofasial Release/Trigger Point",
    desc: "Lower back strain often carries as tight, spasming muscle along the spine. The Graston tool works through that tension directly, breaking up adhesions similar to a deep massage.",
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
    desc: "Back pain frequently comes from fixations — segments of the spine, especially in the low back, that have lost their normal movement. Adjustments restore that motion so the surrounding muscles can stop compensating.",
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
    desc: "For disc-related or chronic back pain, traction stretches the lower spine to relieve pressure on the discs and nerves, helping pump fluid back into the disc space between vertebrae.",
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
    desc: "When even getting into the car is painful, we bring the exam and hands-on treatment to your living room instead.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Check eligibility",
    ctaLabel: "CHECK ELIGIBILITY",
    ctaHref: "/home-visits",
  },
];

export const backPainFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Dull, aching stiffness",
    desc: "A constant low-grade ache, worse after sitting or standing still too long.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Sharp catch on movement",
    desc: "A specific bend or twist that triggers a sudden, sharp pull — often muscular.",
    learnMoreHref: "/services/massage-soft-tissue",
  },
  {
    title: "Pain that won't ease up",
    desc: "Discomfort that's stuck around for weeks or months, not just a bad day.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Radiating pain",
    desc: "Pain that travels into the hip or leg rather than staying in the lower back.",
    learnMoreHref: "/conditions/sciatica",
  },
];

export const backPainWarning: ConditionWarning = {
  heading: "See a doctor promptly if you notice:",
  image: {
    src: "/figma-exports/drabe-back.png",
    alt: "Dr. Abe examining a patient's lower back",
  },
  bullets: [
    { label: "Numbness or weakness in the leg", href: "/conditions/sciatica" },
    {
      label: "Pain that worsens at night or doesn't improve with rest",
      href: "/services/spinal-decompression",
    },
    { label: "Loss of bladder or bowel control — seek emergency care" },
  ],
};

export const backPainAccident: ConditionAccident = {
  headline: "Back pain after a crash needs documentation, not just rest",
  body: "A sudden impact can strain the discs and joints of the lower back in ways that don't show up until days later. Florida law gives you 14 days after the accident to get evaluated and protect your PIP benefits.",
  smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
};

export const backPainRelatedBottom: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
  { label: "Spinal Decompression", href: "/services/spinal-decompression" },
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Home Visit Care", href: "/home-visits" },
  { label: "Herniated Disc", href: "/services/spinal-decompression" },
  { label: "View All Treatments", href: "/services" },
  { label: "Auto Accident Injuries", href: "/auto-accidents", highlighted: true },
];

export const backPainFaq: ConditionFaq = {
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
};
