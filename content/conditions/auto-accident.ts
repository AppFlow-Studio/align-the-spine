import { autoAccidentComparisonRows, comparisonTableRows } from "@/content/comparison-table";
import { DEFAULT_ACCIDENT_SMALLPRINT, type Condition } from "@/content/conditions/types";
import { verified } from "@/content/verified-value";

/** Auto Accident condition content per condition-page-spec §B, §C. The
 * accident-variant flags below (extra comparison rows, $10k Florida PIP
 * stat) are the only 3 fields this ticket's acceptance criteria calls out
 * by name; the future ConditionPage template (ATS-061) is expected to gate
 * the already-built HOW WE HELP section
 * (components/sections/how-we-help-steps.tsx + content/auto-accident.ts's
 * autoAccidentSteps) behind this same `flags.isAccidentVariant`, rather
 * than adding a redundant 4th flag key. */
export const autoAccidentCondition: Condition = {
  slug: "car-accident-chiropractor",
  name: "Auto Accident Injuries",
  hero: {
    eyebrowChip: "CHIROPRACTIC CARE AFTER A CAR ACCIDENT",
    // Reverted to the Figma-approved "Injured in an Accident?" headline
    // (superseding the ATS-E3 (3.1) SEO-verbatim override) per the
    // solid-panel Hero redesign — matches the design 1:1 (ATS-141).
    h1: "Injured in an Accident?",
    // Was "Covered entirely by Florida PIP insurance" — a flat 100% coverage
    // guarantee, which contradicts the actual PIP structure this same hero
    // states two fields below (flags.pipStat: capped at $10,000 with an
    // Emergency Medical Condition determination, $2,500 without one) and
    // the truth-constraint ban on payment/coverage guarantees.
    subhead:
      "Dr. Abe provides chiropractic evaluations in Deerfield Beach for neck pain, back pain, stiffness, and whiplash after a car accident, with documentation for PIP insurance when eligible.",
    backgroundImage: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Align the Spine reception hallway",
    },
  },
  understanding: {
    eyebrow: "Understanding Accident Injuries",
    intro:
      "Car accidents can strain muscles, ligaments, joints, and discs, and some symptoms may take hours or days to become noticeable. A chiropractic evaluation documents musculoskeletal concerns and helps determine whether care or referral is appropriate.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Dr. Abe Nasser consulting with a new accident patient",
    },
    types: [
      {
        name: "Soft-Tissue Injuries",
        desc: "Whiplash, muscle strain, and ligament sprain from the sudden force of a collision — the most common accident injury, and often the slowest to show symptoms.",
      },
      {
        name: "Spinal & Disc Injuries",
        desc: "Joint misalignment or disc damage from impact, which can cause pain that radiates into the arms, hips, or legs if left untreated.",
      },
    ],
    causes: [
      "Rear-end and side-impact collisions",
      "Sudden braking or swerving",
      "Airbag deployment force",
      "Being a passenger during a low-speed impact",
    ],
    redFlags: [
      "Numbness, tingling, or weakness in your arms or legs",
      "Severe headache, dizziness, or confusion after the crash",
      "Chest, abdominal, or worsening pain of any kind",
    ],
  },
  accident: {
    headline: "Florida PIP has a 14-day initial-care window",
    body: "Florida PIP generally requires initial services and care within 14 days of a motor vehicle accident. Eligibility, reimbursement, and benefit limits depend on the policy and circumstances.",
    smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
  },
  comparisonRows: [...comparisonTableRows, ...autoAccidentComparisonRows],
  faq: {
    headerTail: "car accident injuries",
    items: [
      {
        q: "I feel fine — do I really need to be seen?",
        a: "Some accident-related symptoms can appear later. Seek urgent medical care for severe or worsening symptoms; otherwise, a timely evaluation can document concerns and determine whether treatment or referral is appropriate.",
      },
      {
        q: "Will this cost me anything out of pocket?",
        a: "It depends on your coverage and the specifics of your case. Call us and we'll walk through what to expect before your first visit.",
      },
      {
        q: "Do I need a police report or an attorney to be seen?",
        a: "No — you can come in with just your insurance information. If you do have a police report or an attorney, we're happy to coordinate documentation with them.",
      },
      {
        q: "What happens after the 14-day window has passed?",
        a: "You can still seek appropriate medical care, but Florida PIP payment generally depends on receiving initial services and care within 14 days. Ask your insurer or a qualified legal professional about your specific coverage.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Adjustments",
      desc: "Hands-on adjustments that restore motion to the segments most commonly jarred loose by a collision.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services/chiropractic-adjustments",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Myofascial release and other soft-tissue techniques for selected muscle tension, guarding, and accident-related strain.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services/soft-tissue-therapy",
    },
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression for accident cases where disc pressure is behind radiating arm or leg pain.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services/spinal-decompression",
    },
  ],
  flags: {
    isAccidentVariant: true,
    extraComparisonRows: true,
    // ATS-E4 (4.5): specific PIP coverage dollar figures — approved by the
    // client via the solid-panel Hero redesign mockup, which shows this
    // exact stat rendered under the divider line.
    pipStat: verified(
      {
        value: "$10,000",
        description:
          "in PIP coverage available with an Emergency Medical Condition determination - $2,500 without one",
      },
      "Client-provided design mockup",
      "2026-08-11",
    ),
  },
};
