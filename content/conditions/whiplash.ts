import { comparisonTableRows } from "@/content/comparison-table";
import { DEFAULT_ACCIDENT_SMALLPRINT, type Condition } from "@/content/conditions/types";

/** Whiplash condition content per condition-page-spec §B, §C. */
export const whiplashCondition: Condition = {
  slug: "whiplash",
  name: "Whiplash",
  hero: {
    eyebrowChip: "WHIPLASH",
    h1: "Whiplash Doesn't Always Hurt Right Away",
    subhead:
      "Soft-tissue injuries from a collision can stay quiet for days. Dr. Abe Nasser documents and treats whiplash early, before it becomes a long-term problem.",
    backgroundImage: {
      src: "/figma-exports/drabe-whiplash-man.png",
      alt: "Dr. Abe treating a patient's neck",
    },
  },
  understanding: {
    eyebrow: "Understanding Whiplash",
    intro:
      "Whiplash happens when a sudden impact snaps the neck forward and back faster than the muscles and ligaments can brace for it. Symptoms often don't appear until 24–72 hours after the accident, which is why early evaluation matters even if you feel fine.",
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Close-up of neck treatment for whiplash",
    },
    types: [
      {
        name: "Grade I–II Whiplash",
        desc: "Neck pain, stiffness, and reduced range of motion without measurable nerve involvement. The most common presentation after a rear-end collision.",
      },
      {
        name: "Grade III–IV Whiplash",
        desc: "Includes neurological signs like numbness, weakness, or reflex changes, sometimes with fracture or dislocation. Requires prompt, closely managed care.",
      },
    ],
    causes: [
      "Rear-end car collisions, even at low speed",
      "Contact sports impacts",
      "Slip-and-fall accidents",
      "Sudden stops or jolts while riding as a passenger",
    ],
    redFlags: [
      "Numbness, tingling, or weakness in your arms or hands",
      "Severe headache or dizziness that won't go away",
      "Blurred vision or trouble concentrating after the accident",
    ],
  },
  accident: {
    headline: "The 14-day window starts the day of the crash — not the day it starts to hurt",
    body: "Whiplash symptoms are notorious for showing up late, but Florida's PIP clock doesn't wait for the pain to catch up. Getting evaluated within 14 days of the accident is what keeps your benefits — and your claim — intact.",
    smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
  },
  comparisonRows: comparisonTableRows,
  faq: {
    headerTail: "whiplash",
    items: [
      {
        q: "I feel fine after my accident — do I still need to get checked?",
        a: "Yes. Whiplash and other soft-tissue injuries often take 1–3 days to show symptoms. An early exam creates the documentation your PIP claim needs even if you feel okay right now.",
      },
      {
        q: "Will an X-ray or MRI be part of my visit?",
        a: "If your exam findings call for it, we'll order imaging to rule out fracture or disc involvement — most whiplash cases don't need it, but we won't guess when it matters.",
      },
      {
        q: "How long does whiplash recovery usually take?",
        a: "Mild cases often improve in a few weeks of care; more significant injuries can take a few months. We reassess regularly and adjust your plan as you progress.",
      },
      {
        q: "Do I need a lawyer to see you for a whiplash claim?",
        a: "No — you can come in with or without an attorney. If you do have one, our documentation is built to support that claim directly.",
      },
    ],
  },
  whatWeTreat: [
    {
      title: "Adjustments",
      desc: "Gentle cervical adjustments that restore motion lost to whiplash's sudden neck-and-back snap, without forcing a still-inflamed joint.",
      image: {
        src: "/figma-exports/drabeadjust.png",
        alt: "Dr. Abe performing a chiropractic adjustment",
      },
      href: "/services",
    },
    {
      title: "Massage/Soft-Tissue",
      desc: "Myofascial release for the muscle spasms and adhesions whiplash leaves behind in the neck and upper back.",
      image: {
        src: "/figma-exports/drabe-soft-tissue.png",
        alt: "Massage and soft-tissue therapy",
      },
      href: "/services",
    },
    {
      title: "Spinal Decompression",
      desc: "Traction-based decompression for whiplash cases where disc pressure is contributing to arm or hand symptoms.",
      image: {
        src: "/figma-exports/drabe-traction_compression.png",
        alt: "Spinal traction and decompression therapy",
      },
      href: "/services",
    },
  ],
  flags: {
    isAccidentVariant: false,
    extraComparisonRows: false,
  },
};
