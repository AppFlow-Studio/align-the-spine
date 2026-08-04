export interface BodyRegion {
  id: string;
  name: string;
  description: string;
  /** Condition-route deep link, when one exists. Falls back to siteConfig.bookingCta.href. */
  href?: string;
  /** Percentage position within the square image container. */
  position: { x: number; y: number };
  /** Hotspot diameter in px (52-128 per spec). */
  size: number;
  labelSide: "left" | "right";
}

export interface PointToWhereItHurtsContent {
  eyebrow: string;
  heading: string;
  instruction: string;
  image: { src: string; alt: string };
  regions: BodyRegion[];
  ctaLabel: string;
}

/** "Point to where it hurts" body-diagram copy (Epic 4). Reuses the same body illustration
 * SpineAnatomy used, which this section replaces on the Home page. */
export const pointToWhereItHurtsContent: PointToWhereItHurtsContent = {
  eyebrow: "Understanding the spine",
  heading: "Point to where it hurts",
  instruction: "Select a highlighted region on the diagram to see what might be causing your pain.",
  image: { src: "/figma-exports/spine-skeloton.png", alt: "Human spine anatomy, back view" },
  ctaLabel: "Schedule now",
  regions: [
    {
      id: "headaches",
      name: "Headaches",
      description:
        "Tension and cervicogenic headaches often trace back to misalignment in the upper neck.",
      position: { x: 50, y: 10 },
      size: 56,
      labelSide: "right",
    },
    {
      id: "whiplash",
      name: "Whiplash",
      description: "Neck strain, stiffness, and reduced range of motion from sudden impact.",
      position: { x: 48, y: 24 },
      size: 72,
      labelSide: "right",
    },
    {
      id: "shoulder-pain",
      name: "Shoulder Pain",
      description: "Tightness and restricted movement from postural strain or old injuries.",
      position: { x: 30, y: 40 },
      size: 88,
      labelSide: "left",
    },
    {
      id: "back-pain",
      name: "Back Pain",
      description:
        "Aching or sharp pain along the mid and lower back, often tied to posture or overuse.",
      position: { x: 68, y: 46 },
      size: 104,
      labelSide: "right",
    },
    {
      id: "herniated-disc",
      name: "Herniated Disc",
      description:
        "A bulging or ruptured disc pressing on nearby nerves, causing pain that radiates outward.",
      position: { x: 50, y: 64 },
      size: 120,
      labelSide: "left",
    },
    {
      id: "sciatica",
      name: "Sciatica",
      description: "Sharp, radiating pain down the leg from nerve compression in the lower spine.",
      position: { x: 50, y: 84 },
      size: 96,
      labelSide: "right",
    },
  ],
};
