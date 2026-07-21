export interface Service {
  slug: string;
  name: string;
  duration: string;
  summary: string;
  image: { src: string; alt: string };
}

export const services: Service[] = [
  {
    slug: "new-patient-special",
    name: "New Patient Special (includes XRAY)",
    duration: "1 hr",
    summary: "New patient special includes adjustment and x-ray.",
    image: {
      src: "/figma-exports/drabe-xray-newpt.png",
      alt: "New patient exam and X-ray evaluation",
    },
  },
  {
    slug: "myofascial-release-trigger-point",
    name: "Myofasial Release/Trigger Point",
    duration: "1 hr",
    summary:
      "We use the gratson tool to loosen up any muscle spasms and break up any adhesions in the soft tissue. This technique is otherwise known as scraping and can be very similar to a massage.",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Myofascial release and trigger point therapy with the gratson tool",
    },
  },
  {
    slug: "cupping-therapy",
    name: "Cupping Therapy",
    duration: "1 hr",
    summary:
      "Increases blood circulation to the area the cups are applied to. This helps ease pain and ease any trigger points you might have and your neck, low back, or other areas.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Cupping therapy treatment" },
  },
  {
    slug: "adjustment",
    name: "Adjustment",
    duration: "1 hr",
    summary:
      "Adjustments are used to help put motion into the spine and making sure the spine is moving properly. Sometimes in the neck mid back and low back we have what we call fixations in the vertebrae, and this can cause discomfort and pain.",
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
      "Traction of the low back and even the neck can be done. You are strapped down to a machine and a specific poundage is set. The machine starts at helps open up the joints in the area traction is being applied. This helps to pump fluid into the discs that are between our vertebrae.",
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
      "If you have been injured in a car accident, we can help! Please provide your first and last name, phone, email, and accident claim number.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Car accident consultation with Dr. Abe",
    },
  },
];
