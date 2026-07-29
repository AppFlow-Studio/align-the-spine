import { autoAccidentComparisonRows, comparisonTableRows } from "@/content/comparison-table";
import type { Condition } from "@/content/conditions/types";

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
    eyebrowChip: "AUTO ACCIDENT CARE",
    h1: "Injured In A Crash? You Have 14 Days.",
    subhead:
      "Same-day evaluations, PIP billed directly, and documentation your claim can stand on — Dr. Abe Nasser handles the whole thing so you don't have to.",
    backgroundImage: {
      src: "/figma-exports/drabe-xray-newpt.png",
      alt: "X-ray review during a new patient accident evaluation",
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
    headline: "Florida law gives you 14 days to protect your PIP benefits",
    body: "It doesn't matter who was at fault — Florida's no-fault insurance law requires treatment to begin within 14 days of the accident for your PIP benefits to cover it. We handle the exam, the documentation, and the billing directly.",
    smallprint:
      "Missing this window means you may have to pay thousands for medical care out of your own pocket.",
  },
  comparisonRows: [...comparisonTableRows, ...autoAccidentComparisonRows],
  faq: {
    headerTail: "car accident injuries",
    items: [
      {
        q: "I feel fine — do I really need to be seen?",
        a: "Yes. Adrenaline and swelling can mask injuries for days. An early evaluation both protects your health and creates the documentation your PIP claim needs, even if you feel okay right now.",
      },
      {
        q: "Will this cost me anything out of pocket?",
        a: "In most PIP-covered cases, your evaluation and treatment are billed directly to your auto insurance — typically $0 out-of-pocket. We'll verify your coverage before your first visit.",
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
    pipStat: { label: "Florida PIP Coverage", value: "$10,000" },
  },
};
