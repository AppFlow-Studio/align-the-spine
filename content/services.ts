export interface Service {
  slug: string;
  name: string;
  summary: string;
  image: { src: string; alt: string };
}

export const services: Service[] = [
  {
    slug: "chiropractic-adjustments",
    name: "Chiropractic Adjustments",
    summary:
      "Precise, hands-on spinal adjustments that restore alignment, relieve pressure on irritated nerves, and get you moving without pain.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
  },
  {
    slug: "spinal-decompression",
    name: "Spinal Decompression & Traction",
    summary:
      "Gentle, controlled traction that takes pressure off compressed discs and nerves — ideal for herniated discs, sciatica, and chronic low back pain.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Spinal traction and decompression therapy",
    },
  },
  {
    slug: "cupping-therapy",
    name: "Cupping Therapy",
    summary:
      "Targeted suction therapy that boosts circulation, loosens tight muscles, and speeds recovery from soft-tissue injuries and chronic tension.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Cupping therapy treatment" },
  },
  {
    slug: "soft-tissue-therapy",
    name: "Soft Tissue Therapy",
    summary:
      "Hands-on myofascial release and massage techniques that break up scar tissue, ease muscle spasms, and restore healthy range of motion.",
    image: { src: "/figma-exports/drabe-softtissue.png", alt: "Soft tissue therapy treatment" },
  },
  {
    slug: "at-home-visits",
    name: "At-Home Visits",
    summary:
      "Full chiropractic care delivered right to your door — the same elite treatment you'd get in the office, built around your schedule and mobility.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe providing an at-home chiropractic visit",
    },
  },
  {
    slug: "new-patient-exam",
    name: "New Patient Exam & X-Ray",
    summary:
      "A thorough consultation, hands-on exam, and on-site imaging to pinpoint the cause of your pain before we build your personalized treatment plan.",
    image: {
      src: "/figma-exports/drabe-xray-newpt.png",
      alt: "New patient exam and X-ray evaluation",
    },
  },
];
