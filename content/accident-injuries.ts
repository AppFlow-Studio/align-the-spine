import type { ServiceCardItem } from "@/components/ui/service-card";

/** "Common accident injuries we treat" grid per homepage artboard (Group 17,
 * 96:292–96:325). Reuses ServiceGrid/ServiceCard (duration is unused by the
 * card — condition cards have no session length). */
export const accidentInjuries: ServiceCardItem[] = [
  {
    slug: "whiplash",
    name: "Whiplash",
    duration: "",
    summary: "Neck strain, stiffness, and reduced range of motion from sudden impact.",
    image: { src: "/figma-exports/drabe-whiplash.png", alt: "Whiplash treatment" },
  },
  {
    slug: "lower-back-pain",
    name: "Lower Back Pain",
    duration: "",
    summary:
      "Structural alignment to address lumbar spine compression and muscular spasms from rear-end collisions.",
    image: { src: "/figma-exports/drabe-backpain.png", alt: "Lower back pain treatment" },
  },
  {
    slug: "herniated-disc",
    name: "Herniated Disc",
    duration: "",
    summary:
      "Specialized decompression techniques to relieve pressure on nerves from disc displacement.",
    image: { src: "/figma-exports/drabe-herniated%20disc.png", alt: "Herniated disc treatment" },
  },
  {
    slug: "shoulder-extremity",
    name: "Shoulder & Extremity",
    duration: "",
    summary:
      "Treatment for seatbelt-related shoulder trauma and joint injuries in the arms and legs.",
    image: { src: "/figma-exports/drabe-shoulder.png", alt: "Shoulder and extremity treatment" },
  },
  {
    slug: "headaches",
    name: "Headaches",
    duration: "",
    summary: "Upper cervical adjustments to alleviate post-traumatic headaches and tension.",
    image: { src: "/figma-exports/drabe-headache.png", alt: "Headache treatment" },
  },
  {
    slug: "soft-tissue",
    name: "Soft tissue",
    duration: "",
    summary: "Myofascial release for deep muscle bruising and ligament strain throughout the body.",
    image: { src: "/figma-exports/drabe-soft-tissue.png", alt: "Soft tissue treatment" },
  },
];
