import type {
  ConditionAccident,
  ConditionFaq,
  ConditionFeelsLikeItem,
  ConditionRelatedLink,
  ConditionTreatmentItem,
  ConditionWarning,
} from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Bespoke content for the dedicated /conditions/whiplash page — same
 * per-condition, hand-built approach as back-pain/neck-pain/sciatica
 * (ATS-137, final condition off the generic [slug] template). Pulled from
 * the Figma `whiplash` frame (file 4mb4VDHszsaj2KEZzyjOjf, node 96:2629)
 * via get_metadata/get_design_context, cross-checked against the 11
 * design screenshots provided directly.
 *
 * Unlike back-pain/neck-pain, most of this frame's copy (hero, accident
 * banner, FAQ headers/questions) is genuinely whiplash-specific — not a
 * copy-paste mismatch. The one exception: the FAQ's first item pairs the
 * correct whiplash question ("How long does whiplash take to heal?") with
 * the wrong answer (literally the sciatica/back-pain FAQ's PIP-billing
 * answer, copy-pasted again). Wrote a real answer for that item, and for
 * the other 3 whiplash questions the Figma frame left with collapsed/empty
 * answer text — adapted from the previous Condition-schema whiplash.ts
 * (now deleted), which already had solid whiplash-specific FAQ copy. */

export const whiplashHero = {
  eyebrowChip: "Whiplash after an accident?",
  h1: "Whiplash Chiropractor in Deerfield Beach, FL",
  subhead:
    "Evaluation and treatment for whiplash — stiffness, restricted range of motion, and the headaches that come with it, with in-home visits available when it applies to your case.",
  backgroundImage: {
    src: "/figma-exports/drabe-whiplash-man.png",
    alt: "Dr. Abe treating a patient's neck",
  },
};

export const whiplashSymptoms: string[] = [
  "Neck pain and stiffness that worsens the day after the accident",
  "Headaches starting at the base of the skull",
  "Reduced range of motion — difficulty turning the head",
  "Shoulder and upper back pain",
  "Tingling or numbness in the arms",
  'Fatigue and difficulty concentrating ("brain fog")',
];

export const whiplashRelatedMidPage: ConditionRelatedLink[] = [
  { label: "Cervicogenic Headache", href: "/conditions/neck-pain" },
  { label: "TMJ / Jaw Pain from Trauma", href: "/services#adjustments", highlighted: true },
  { label: "Concussion / Post-Concussion Syndrome", href: "/auto-accidents" },
  { label: "Shoulder Pain", href: "/services/massage-soft-tissue" },
  { label: "Auto Accident Injuries", href: "/auto-accidents" },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
];

export const whiplashHowWeTreat: ConditionTreatmentItem[] = [
  {
    title: "Myofasial Release/Trigger Point",
    desc: "We use the Graston tool to break up scar tissue and muscle spasm in the neck and upper back that build up after a collision. This can feel similar to a deep massage and helps restore the soft tissue's normal movement.",
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
    desc: "After whiplash, the neck often loses its normal motion in specific segments — what we call fixations. Adjustments restore that motion so the neck can heal properly instead of compensating around the stiffness.",
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
    desc: "For whiplash that's affecting the discs in the neck, traction gently separates the vertebrae to relieve pressure and encourage fluid movement back into the disc space — often paired with adjustment for faster recovery.",
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
    desc: "Turning your head to check mirrors or drive is often the hardest part of whiplash recovery. We come to you in the early days when driving isn't realistic yet — full exam and treatment, wherever you're most comfortable.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Check eligibility",
    ctaLabel: "CHECK ELIGIBILITY",
    ctaHref: "/home-visits",
  },
];

export const whiplashFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Delayed onset",
    desc: "Feeling fine at the scene, then waking up unable to turn your head.",
    learnMoreHref: "/auto-accidents",
  },
  {
    title: "Neck stiffness",
    desc: "Usually the first symptom — tight, restricted, uncomfortable to turn.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Headaches",
    desc: "Often start at the base of the skull, sometimes days after impact.",
    learnMoreHref: "/conditions/neck-pain",
  },
  {
    title: "Reduced range of motion",
    desc: "Trouble turning your head fully in one or both directions.",
    learnMoreHref: "/services/massage-soft-tissue",
  },
];

export const whiplashWarning: ConditionWarning = {
  heading: "See a doctor promptly if you notice:",
  image: {
    src: "/figma-exports/drabe-whiplash.png",
    alt: "Dr. Abe examining a patient's neck",
  },
  bullets: [
    { label: "Pain radiating down the arm", href: "/conditions/neck-pain" },
    { label: "Severe headache that won't resolve", href: "/conditions/neck-pain" },
    { label: "Vision changes or dizziness" },
  ],
};

export const whiplashAccident: ConditionAccident = {
  headline: "Florida gives you 14 days from the accident",
  body: "Whiplash is a PIP-eligible injury under Florida law, but the clock starts at the accident, not when symptoms peak. Get evaluated within 14 days to keep your benefits intact, even if the pain is still building.",
  smallprint:
    "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
};

export const whiplashRelatedBottom: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Auto Accident Injuries", href: "/auto-accidents", highlighted: true },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
  { label: "Spinal Decompression", href: "/services/spinal-decompression" },
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Home Visit Care", href: "/home-visits" },
  { label: "Herniated Disc", href: "/services/spinal-decompression" },
  { label: "View All Treatments", href: "/services" },
];

export const whiplashFaq: ConditionFaq = {
  headerTail: "treating whiplash",
  items: [
    {
      q: "How long does whiplash take to heal?",
      a: "Mild cases often improve within a few weeks of consistent care; more significant injuries can take a few months. We reassess regularly and adjust your plan as you progress.",
    },
    {
      q: 'What does a whiplash "grade" mean?',
      a: "Grade describes severity, from I (mild muscle strain) to IV (fracture or dislocation). Most cases are Grade I–II — muscle and ligament strain that responds well to conservative care — but grading is exactly why we do a full evaluation instead of guessing.",
    },
    {
      q: "Can whiplash cause headaches weeks later?",
      a: "Yes — cervicogenic headaches that trace back to the neck are one of the most common delayed whiplash symptoms, sometimes showing up well after the initial stiffness eases.",
    },
    {
      q: "How does PIP coverage work for my visit?",
      a: "Florida PIP covers up to $10,000 in medical costs if you're evaluated within 14 days of the accident. We bill directly to your PIP claim, so there's no upfront cost for eligible visits.",
    },
  ],
};
