import { autoAccidentComparisonRows, comparisonTableRows } from "@/content/comparison-table";
import { DEFAULT_ACCIDENT_SMALLPRINT, type Condition } from "@/content/conditions/types";
import { unverified } from "@/content/verified-value";

/** Auto Accident condition content per condition-page-spec §B, §C. The
 * accident-variant flags below (extra comparison rows, $10k Florida PIP
 * stat) are the only 3 fields this ticket's acceptance criteria calls out
 * by name; the future ConditionPage template (ATS-061) is expected to gate
 * the already-built HOW WE HELP section
 * (components/sections/how-we-help-steps.tsx + content/auto-accident.ts's
 * autoAccidentSteps) behind this same `flags.isAccidentVariant`, rather
 * than adding a redundant 4th flag key. */
export const autoAccidentCondition: Condition = {
  slug: "auto-accidents",
  name: "Auto Accident Injuries",
  hero: {
    eyebrowChip: "AUTO ACCIDENT CHIROPRACTOR IN DEERFIELD BEACH, FL",
    // ATS-E3 (3.1): H1 set verbatim to the ticket's required SEO wording —
    // deviates from the Figma-approved "Injured in an Accident?" headline
    // (ATS-141). If this needs to be visually distinct from the on-page H1
    // (e.g. a shorter marketing headline over this as the true semantic
    // H1), flag it — for now the ticket's H1 text renders as the hero
    // headline directly, matching every other page's pattern.
    h1: "Chiropractic Evaluation After a Car Accident in Deerfield Beach",
    subhead:
      "Complete chiropractic care — full exam, treatment, and documentation for your claim. See your Florida PIP window below. In-home visits available when it's the right fit for your case.",
    backgroundImage: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Align the Spine reception hallway",
    },
  },
  understanding: {
    eyebrow: "Understanding Accident Injuries",
    intro:
      "Car accidents don't just cause the injury you can feel right away — the real damage is often soft-tissue and joint trauma that takes days to surface. Getting a full evaluation early both protects your health and creates the record your PIP claim depends on.",
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
    headline: "Florida gives you 14 days from the accident",
    body: "Florida law requires treatment within 14 days of an auto accident. Miss that window and you may forfeit your Personal Injury Protection (PIP) benefits entirely — even if the accident wasn't your fault.",
    smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
  },
  comparisonRows: [...comparisonTableRows, ...autoAccidentComparisonRows],
  faq: {
    headerTail: "car accident injuries",
    items: [
      {
        q: "I feel fine — do I really need to be seen?",
        a: "Yes. Adrenaline and swelling can mask injuries for days, so feeling okay right now isn't proof you're in the clear. Getting checked promptly catches problems while they're easiest to treat, and it puts a timestamped exam on record in case your claim needs it later.",
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
        a: "You may still have options, but PIP coverage becomes harder to secure the longer you wait. Call us — we'll talk through what's still possible for your case.",
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
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Myofascial release for the whiplash and soft-tissue strain a crash leaves behind, paired with adjustments for faster recovery.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services",
    },
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression for accident cases where disc pressure is behind radiating arm or leg pain.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services",
    },
  ],
  flags: {
    isAccidentVariant: true,
    extraComparisonRows: true,
    // ATS-E4 (4.5): specific PIP coverage dollar figures — unverified,
    // Hero's `stat` callout renders nothing until this is approved.
    pipStat: unverified(),
  },
};
