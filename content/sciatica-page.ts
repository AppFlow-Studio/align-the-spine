import type {
  ConditionAccident,
  ConditionFaq,
  ConditionFeelsLikeItem,
  ConditionRelatedLink,
  ConditionTreatmentItem,
  ConditionWarning,
} from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Bespoke content for the dedicated /conditions/sciatica page — same
 * per-condition, hand-built approach as back-pain/neck-pain (ATS-137).
 * Pulled from the Figma `sciatica` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:813) via get_metadata/get_design_context, cross-checked against
 * the 12 design screenshots provided directly.
 *
 * Unlike back-pain and neck-pain, this frame's "Was this from an
 * accident?" banner and FAQ are NOT a copy-paste mismatch — this genuinely
 * is the Sciatica page, so that literal Figma copy is kept as-is (no
 * deviation needed here). The FAQ's 4th item is a literal duplicate of the
 * 3rd in the Figma frame ("Will I need surgery for a herniated disc?"
 * twice) — replaced with a distinct 4th question instead of shipping a
 * duplicate. */

export const sciaticaHero = {
  eyebrowChip: "Sciatica or nerve pain radiating down?",
  h1: "Sciatica Chiropractor in Deerfield Beach, FL",
  subhead:
    "Evaluation and decompression-focused treatment for sciatic and radiating nerve pain, with in-home visits available when it applies to your case.",
  backgroundImage: {
    src: "/figma-exports/drabe-backpain-front.png",
    alt: "Hands-on lower-back soft-tissue treatment",
  },
};

export const sciaticaSymptoms: string[] = [
  "Sharp, burning, or electric-shock-like pain",
  "Pain that worsens with sitting or coughing",
  "Numbness and tingling in the leg or foot",
  "Muscle weakness in the affected leg",
  "Localized pain in the buttock area",
];

export const sciaticaRelatedMidPage: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Herniated Disc", href: "/services/spinal-decompression", highlighted: true },
  { label: "Auto Accident Injuries", href: "/auto-accidents" },
];

export const sciaticaHowWeTreat: ConditionTreatmentItem[] = [
  {
    title: "Myofasial Release/Trigger Point",
    desc: "The piriformis and surrounding muscles often tighten around the sciatic nerve, adding to the pain. The Graston tool releases that tension directly, similar to a deep massage focused on the area compressing the nerve.",
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
    desc: "Sciatica often stems from a fixation in the lower spine putting pressure on the nerve root. Adjustments restore normal movement to that segment, which is frequently what relieves the radiating pain down the leg.",
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
    desc: "When sciatica is caused by a herniated disc or spinal stenosis, traction is the most direct approach — gently separating the vertebrae to take pressure off the compressed nerve root.",
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
    desc: "Sciatica can make sitting in a car unbearable. We bring the full exam and treatment to you when getting to the office isn't realistic.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Check eligibility",
    ctaLabel: "CHECK ELIGIBILITY",
    ctaHref: "/home-visits",
  },
];

export const sciaticaFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Radiating leg pain",
    desc: "Pain that travels from the lower back through the buttocks and down the leg.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Shooting or burning",
    desc: "A sharp, electric sensation that travels along the sciatic nerve path.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Numbness or tingling",
    desc: "Pins and needles or loss of sensation specifically in the leg or foot.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Muscle weakness",
    desc: 'Difficulty moving the foot or leg, often feeling "heavy" or unresponsive during activity.',
    learnMoreHref: "/services#massage-soft-tissue",
  },
];

export const sciaticaWarning: ConditionWarning = {
  heading: "See a doctor promptly if you notice:",
  image: {
    src: "/figma-exports/drabe-back.png",
    alt: "Dr. Abe examining a patient's lower back",
  },
  bullets: [
    { label: "Pain radiating below the knee", href: "/services/spinal-decompression" },
    { label: "Numbness or weakness in the foot", href: "/conditions/back-pain" },
    { label: "Loss of bladder or bowel control — seek emergency care" },
  ],
};

export const sciaticaAccident: ConditionAccident = {
  headline: "If impact triggered this, Florida gives you 14 days",
  body: "Sciatic pain after an accident usually traces back to a disc that shifted on impact and is now pressing on a nerve root. If a collision is anywhere in this story, Florida law gives you 14 days to get evaluated and protect your PIP benefits.",
  smallprint:
    "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
};

export const sciaticaRelatedBottom: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Auto Accident Injuries", href: "/auto-accidents", highlighted: true },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
  { label: "Spinal Decompression", href: "/services/spinal-decompression" },
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Home Visit Care", href: "/home-visits" },
  { label: "Herniated Disc", href: "/services/spinal-decompression" },
  { label: "View All Treatments", href: "/services" },
];

export const sciaticaFaq: ConditionFaq = {
  headerTail: "treating sciatica",
  items: [
    {
      q: "Can a car accident cause sciatica?",
      a: 'Often, yes — even from low-speed collisions. Muscle spasm and disc compression can take a day or two to fully present, which is why people who felt "fine" at the scene are limping by day three. If there was any accident involved, mention it at your evaluation so we can bill PIP correctly.',
    },
    {
      q: "How is sciatica different from regular lower back pain?",
      a: "Regular lower back pain stays in the lower back. Sciatica radiates — it travels down through the buttock and leg because a nerve root itself is compressed, not just the surrounding muscle or joint.",
    },
    {
      q: "Will I need surgery for a herniated disc?",
      a: "Rarely as a first step. Most herniated-disc sciatica responds well to conservative care — adjustments, decompression, and soft-tissue work — and we only discuss surgical referral if that doesn't relieve the nerve pressure.",
    },
    {
      q: "How long does sciatica usually take to improve?",
      a: "Many cases ease up within a few weeks of consistent care, though it depends on the cause — a muscular flare-up typically resolves faster than nerve compression from a disc issue. We reassess as you go and adjust the plan.",
    },
  ],
};
