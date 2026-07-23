import { siteConfig } from "@/content/site";

export interface SpineRegion {
  name: string;
  subtitle: string;
  description: string;
  /** Quadrant the label sits in, relative to the spine image. */
  position: "left-top" | "left-bottom" | "right-top" | "right-bottom";
}

export interface SpineAnatomyContent {
  eyebrow: string;
  heading: string;
  regions: SpineRegion[];
  image: { src: string; alt: string };
  cta: { label: string; href: string };
}

/** SpineAnatomy copy per homepage artboard (96:169–96:243, 96:276–96:289), ATS-072. */
export const spineAnatomyContent: SpineAnatomyContent = {
  eyebrow: "Understanding the spine",
  heading: "Your spine controls everything",
  image: { src: "/figma-exports/spine-skeloton.png", alt: "Human spine anatomy, back view" },
  cta: { label: "Book an appointment", href: siteConfig.bookingCta.href },
  regions: [
    {
      name: "Cervical",
      subtitle: "(Neck)",
      description: "Headaches, neck stiffness, shoulder tension — most originate here.",
      position: "left-top",
    },
    {
      name: "Thoracic",
      subtitle: "(Mid-Back)",
      description: "The most common source of pain. Bears the majority of your body weight.",
      position: "right-top",
    },
    {
      name: "Lumbar",
      subtitle: "(Lower Back)",
      description: "Poor posture, desk work, and stress compress this region daily.",
      position: "left-bottom",
    },
    {
      name: "Sacral",
      subtitle: "(Base)",
      description: "Hip pain, sciatica, and nerve issues often trace back to this area.",
      position: "right-bottom",
    },
  ],
};
