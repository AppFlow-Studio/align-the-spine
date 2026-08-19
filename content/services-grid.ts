import type { ServiceCardItem } from "@/components/ui/service-card";
import { getRouteHref } from "@/content/seo";

/** "/services" ServiceGrid content (ATS-081): 8 service cards. Reuses
 * ServiceGrid/ServiceCard like the homepage's AccidentInjuries grid does
 * (duration is unused by the card). Separate from content/services.ts, which
 * feeds the homepage's ServiceListRow list and its own distinct copy.
 *
 * IA-03 (LINK-01 DoD item): the "Car Accidents" and "Cupping Therapy" cards
 * were added so every homepage-listed service's owning page is reachable
 * from this hub too, not just the homepage. Their `href` is resolved
 * through getRouteHref() rather than hardcoded — cupping-therapy is
 * currently `status: "draft"` (pending clinician sign-off, IA-02), so its
 * card falls back to "Book now" until it publishes, instead of linking to a
 * noindex route (LINK-01). The 6 original cards' hrefs are untouched. */
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
  {
    slug: "car-accidents",
    name: "Car Accidents",
    duration: "",
    summary:
      "After a car accident, request a chiropractic evaluation for neck pain, back pain, stiffness, whiplash symptoms, and other musculoskeletal concerns.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Car accident consultation with Dr. Abe",
    },
    href: getRouteHref("/car-accident-chiropractor") ?? undefined,
    ctaLabel: "Learn more",
  },
  {
    slug: "cupping-therapy",
    name: "Cupping Therapy",
    duration: "",
    summary:
      "Cupping applies localized suction to selected areas of muscle tension and may be included when appropriate for neck, back, or other soft-tissue concerns.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Cupping therapy treatment" },
    href: getRouteHref("/services/cupping-therapy") ?? undefined,
    ctaLabel: "Learn more",
  },
];
