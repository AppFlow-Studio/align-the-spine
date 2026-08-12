export interface Service {
  slug: string;
  name: string;
  duration: string;
  summary: string;
  image: { src: string; alt: string };
  /** ATS-E4 (4.13): true for offers/equipment claims that need separate
   * sign-off beyond "this is a real service" — e.g. X-ray availability and
   * new-patient pricing. Filtered out of `services` (the exported, rendered
   * list) until that verification lands; see `allServices` for the full
   * source list including gated entries. */
  needsVerification?: boolean;
}

const allServices: Service[] = [
  {
    slug: "new-patient-special",
    name: "New Patient Special (includes XRAY)",
    duration: "1 hr",
    summary: "New patient special includes adjustment and x-ray.",
    image: {
      src: "/figma-exports/drabe-xray-newpt.png",
      alt: "New patient exam and X-ray evaluation",
    },
    // Bundles an X-ray-equipment claim and a pricing offer — neither has
    // client sign-off (ATS-E4 4.9/4.13). Omitted from `services` below
    // until both are verified.
    needsVerification: true,
  },
  {
    slug: "myofascial-release-trigger-point",
    name: "Myofascial Release/Trigger Point",
    duration: "1 hr",
    summary:
      "Dr. Abe uses a Graston tool and targeted pressure to address muscle tension and restricted soft-tissue movement, similar to a focused deep-tissue technique.",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Myofascial release and trigger point therapy with a Graston tool",
    },
  },
  {
    slug: "cupping-therapy",
    name: "Cupping Therapy",
    duration: "1 hr",
    summary:
      "Cupping applies localized suction to selected areas of muscle tension and may be included when appropriate for neck, back, or other soft-tissue concerns.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Cupping therapy treatment" },
  },
  {
    slug: "adjustment",
    name: "Adjustment",
    duration: "1 hr",
    summary:
      "Chiropractic adjustments use controlled pressure to improve motion in selected joints of the neck, mid back, or lower back after an appropriate evaluation.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
  },
  {
    slug: "traction-decompression",
    name: "Traction/Decompression",
    duration: "1 hr",
    summary:
      "Spinal traction and decompression use a controlled pull for selected neck or lower-back concerns. Settings are based on the evaluation and adjusted to the patient.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Spinal traction and decompression therapy",
    },
  },
  {
    slug: "car-accidents",
    name: "Car Accidents",
    duration: "1 hr",
    summary:
      "After a car accident, request a chiropractic evaluation for neck pain, back pain, stiffness, whiplash symptoms, and other musculoskeletal concerns.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Car accident consultation with Dr. Abe",
    },
  },
];

/** Rendered list — excludes any entry still pending verification
 * (ATS-E4 4.13). */
export const services: Service[] = allServices.filter((service) => !service.needsVerification);
