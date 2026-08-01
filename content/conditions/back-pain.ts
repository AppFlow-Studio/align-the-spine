import { comparisonTableRows } from "@/content/comparison-table";
import { DEFAULT_ACCIDENT_SMALLPRINT, type Condition } from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Back Pain condition content per condition-page-spec §B, §C. Hero copy,
 * understanding/types/causes/redFlags, whenToSee, howWeTreat, feelsLike, and
 * relatedConditions are pulled directly from the Figma `back-pain` frame
 * (file 4mb4VDHszsaj2KEZzyjOjf, node 96:3517) — ATS-137's fidelity pass.
 *
 * Two deliberate deviations from the literal Figma text, both because this
 * frame reuses copy that reads as written for the Sciatica page, not Back
 * Pain (the same class of copy-paste mixup found on /auto-accidents' FAQ
 * and this same page's own FAQ block — see faq.items below):
 *  - hero.subhead: Figma's text opens "Evaluation and decompression-focused
 *    treatment for sciatic and radiating nerve pain" — kept the existing,
 *    genuinely back-pain-specific subhead instead.
 *  - faq.items: Figma's "Quick answers" here are literally Sciatica
 *    questions ("Can a car accident cause sciatica?", etc., with one
 *    duplicated). Kept this file's existing back-pain-specific FAQ. */
export const backPainCondition: Condition = {
  slug: "back-pain",
  name: "Back Pain",
  hero: {
    eyebrowChip: "Back pain after a car accident?",
    h1: "Back pain Chiropractor in Deerfield Beach, FL",
    subhead:
      "Whether it's a stubborn ache or a sharp, sudden pain, Dr. Abe Nasser gets to the cause instead of just calming the symptom.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Hands-on lower-back soft-tissue treatment",
    },
  },
  understanding: {
    eyebrow: "Understanding Back Pain",
    heading:
      "Back pain has a lot of possible causes. Finding yours is the first step to fixing it.",
    intro:
      "If a car accident is involved, Florida gives you 14 days to get evaluated and protect your PIP benefits, since sudden impact can cause the same herniated disc or muscle strain that shows up in everyday cases — sometimes with pain that radiates down the leg, a distinct pattern worth reading about on our Sciatica page. Everyday back pain follows a similar pattern: sudden strain from lifting or a bad movement, or pain that's been building for months from structural wear.",
    image: {
      src: "/figma-exports/back-pain-anatomy-diagram.png",
      alt: "Illustration of the lower back highlighting the lumbar spine and lumbar nerve as common sources of back pain",
    },
    types: [
      {
        name: "Accident-related",
        desc: "Back pain following a car accident or sudden impact, sometimes delayed in onset like whiplash. Florida gives you 14 days to get evaluated and protect your PIP benefits.",
      },
      {
        name: "Mechanical / Muscular",
        desc: "The most common type — strain from posture, lifting, or overuse rather than nerve or disc involvement. Responds well to adjustment and soft-tissue work.",
      },
      {
        name: "Disc-related",
        desc: "Pain originating from a bulging or herniated disc pressing on surrounding structures — may stay localized or radiate depending on severity. See Spinal Decompression for how we treat it conservatively.",
      },
      {
        name: "Acute",
        desc: "Sudden onset from a specific strain, sprain, or impact. Usually resolves within a few weeks with the right treatment.",
      },
      {
        name: "Radicular (nerve-related)",
        desc: "Pain that radiates from the lower back into the hip or leg, caused by a nerve being compressed or irritated — often from a herniated disc. This pattern is specifically Sciatica.",
      },
      {
        name: "Chronic",
        desc: "Pain that persists beyond three months, often from degenerative changes, repeated strain, or an old injury that never fully healed — needs an ongoing management plan, not a single fix.",
      },
    ],
    causes: [
      "Muscle or ligament strain",
      "Herniated or bulging discs",
      "Poor posture and prolonged sitting",
      "Pregnancy-related joint shifts",
      "Sports or repetitive strain",
      "Car accidents and sudden impact",
    ],
    redFlags: [
      "Numbness or weakness in the leg",
      "Pain that worsens at night or doesn't improve with rest",
      "Loss of bladder or bowel control — seek emergency care",
    ],
  },
  whenToSee: {
    heading: "When to See a Chiropractor for Back Pain",
    body: "Most back pain responds well to conservative care, especially when addressed early. It's worth scheduling an evaluation if pain has lasted more than a week or two, is interfering with sleep or daily movement, or followed a car accident, fall, or sudden impact — in Florida, PIP benefits require evaluation within 14 days to stay protected. Seek immediate medical attention rather than chiropractic care if you notice numbness or weakness that's getting worse, or any loss of bladder or bowel control.",
    image: {
      src: "/figma-exports/drabe-back.png",
      alt: "Dr. Abe reviewing a patient's back pain history",
    },
  },
  howWeTreat: [
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
      title: "Myofascial Release/Trigger Point",
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
  ],
  feelsLike: [
    {
      title: "Dull, aching stiffness",
      desc: "A constant low-grade ache, worse after sitting or standing still too long.",
    },
    {
      title: "Sharp catch on movement",
      desc: "A specific bend or twist that triggers a sudden, sharp pull — often muscular.",
    },
    {
      title: "Pain that won't ease up",
      desc: "Discomfort that's stuck around for weeks or months, not just a bad day.",
    },
    {
      title: "Radiating pain",
      desc: "Pain that travels into the hip or leg rather than staying in the lower back.",
    },
  ],
  relatedConditions: [
    { label: "Neck Pain", href: "/conditions/neck-pain" },
    { label: "Whiplash", href: "/conditions/whiplash" },
    { label: "Sciatica", href: "/conditions/sciatica" },
    { label: "Auto Accident Injuries", href: "/auto-accidents" },
    { label: "Home Visit Care", href: "/home-visits" },
    { label: "View All Treatments", href: "/services" },
  ],
  accident: {
    headline: "Back pain after a crash needs documentation, not just rest",
    body: "A sudden impact can strain the discs and joints of the lower back in ways that don't show up until days later. Florida law gives you 14 days after the accident to get evaluated and protect your PIP benefits.",
    smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
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
