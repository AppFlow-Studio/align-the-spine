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
      "Hands-on spinal adjustments that restore motion to fixated segments in the neck, mid back, and low back — the foundation of most treatment plans.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
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
      "Corrective care for postural imbalances that build up from desk work, driving, or repetitive strain, aimed at long-term alignment, not just relief.",
    image: { src: "/figma-exports/drabe-spine.png", alt: "Posture and corrective spinal care" },
  },
  {
    slug: "spinal-decompression",
    name: "Spinal Decompression",
    duration: "",
    summary:
      "Traction-based decompression that opens up compressed joints and pumps fluid back into the discs, easing pressure on nerves from disc displacement.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Spinal traction and decompression therapy",
    },
  },
  {
    slug: "headache-migraine",
    name: "Headache & Migraine",
    duration: "",
    summary:
      "Upper cervical adjustments that target the neck fixations behind tension headaches and migraines, not just the pain they cause.",
    image: { src: "/figma-exports/drabe-headache.png", alt: "Headache and migraine treatment" },
  },
  {
    slug: "massage-soft-tissue",
    name: "Massage/Soft-Tissue",
    duration: "",
    summary:
      "Myofascial release and soft-tissue work that loosens muscle spasms and breaks up adhesions, often paired with adjustments for faster recovery.",
    image: { src: "/figma-exports/drabe-soft-tissue.png", alt: "Massage and soft-tissue therapy" },
  },
];
