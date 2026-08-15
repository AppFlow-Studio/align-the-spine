import type { ServiceCardItem } from "@/components/ui/service-card";

/** "/services" ServiceGrid content (ATS-081): 6 core service cards. Reuses
 * ServiceGrid/ServiceCard like the homepage's AccidentInjuries grid does
 * (duration is unused by the card). Separate from content/services.ts, which
 * feeds the homepage's ServiceListRow list and its own distinct copy. */
export const servicesGrid: ServiceCardItem[] = [
  {
    slug: "adjustments",
    name: "Adjustments",
    duration: "",
    summary:
      "Hands-on chiropractic adjustments using controlled pressure to improve joint motion in the neck, mid back, or lower back when appropriate.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
    href: "/services/chiropractic-adjustments",
    ctaLabel: "Learn more",
  },
  {
    slug: "sports-injury",
    name: "Sports Injury",
    duration: "",
    summary:
      "Assessment and hands-on treatment for strains, sprains, and overuse injuries, with a plan built around getting you back to your sport.",
    image: {
      src: "/figma-exports/abe-back-turn.png",
      alt: "Sports injury assessment and treatment",
    },
  },
  {
    slug: "posture-corrective",
    name: "Posture & Corrective",
    duration: "",
    summary:
      "Chiropractic evaluation and care for postural strain that can build from desk work, driving, or repetitive movement.",
    image: { src: "/figma-exports/drabe-spine.png", alt: "Posture and corrective spinal care" },
  },
  {
    slug: "spinal-decompression",
    name: "Spinal Decompression",
    duration: "",
    summary:
      "Controlled, traction-based spinal decompression for selected disc, joint, and radiating nerve-pain concerns after a full evaluation.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Spinal traction and decompression therapy",
    },
    href: "/services/spinal-decompression",
    ctaLabel: "Learn more",
  },
  {
    slug: "headache-migraine",
    name: "Headache & Migraine",
    duration: "",
    summary:
      "Neck-focused evaluation and chiropractic care for headaches with a possible musculoskeletal or cervical component.",
    image: { src: "/figma-exports/drabe-headache.png", alt: "Headache and migraine treatment" },
  },
  {
    slug: "massage-soft-tissue",
    name: "Massage/Soft-Tissue",
    duration: "",
    summary:
      "Myofascial release and targeted soft-tissue care for muscle tension, restricted motion, and injury-related soreness.",
    image: { src: "/figma-exports/drabe-soft-tissue.png", alt: "Massage and soft-tissue therapy" },
    href: "/services/soft-tissue-therapy",
    ctaLabel: "Learn more",
  },
];
