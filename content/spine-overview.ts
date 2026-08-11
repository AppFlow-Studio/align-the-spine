import { siteConfig } from "@/content/site";

export interface SpineSegment {
  id: string;
  /** Short region label, e.g. "Cervical (Neck)". */
  name: string;
  description: string;
  /** Percentage position of this region's marker on the spine image
   * (object-contain, 500x500 source), matched by eye against the
   * region's anatomical location in the artwork. */
  position: { x: number; y: number };
  /** Which side of the image this region's callout label renders on. */
  labelSide: "left" | "right";
}

export interface SpineOverviewContent {
  eyebrow: string;
  heading: string;
  image: { src: string; alt: string };
  segments: SpineSegment[];
  cta: { label: string; href: string };
}

/** Home-page-only static spine diagram (replaces PointToWhereItHurts's
 * interactive hotspots on / — see components/sections/spine-overview.tsx).
 * Matches the "Your spine controls everything" Figma frame: a centered
 * heading over a single spine illustration with 4 leader-line callouts
 * (cervical/thoracic left-right alternating, per the frame) — no
 * PointToWhereItHurts-style interactivity or selection state, and no
 * intro paragraph under the heading (the frame goes straight from heading
 * to diagram). */
export const spineOverviewContent: SpineOverviewContent = {
  eyebrow: "Understanding the spine",
  heading: "Your spine controls everything",
  image: { src: "/figma-exports/spine-skeloton.png", alt: "Human spine anatomy, back view" },
  cta: { label: "Schedule an evaluation", href: siteConfig.bookingCta.href },
  segments: [
    {
      id: "cervical",
      name: "Cervical (Neck)",
      description: "Headaches, neck stiffness, shoulder tension — most originate here.",
      position: { x: 47, y: 25 },
      labelSide: "left",
    },
    {
      id: "thoracic",
      name: "Thoracic (Mid-Back)",
      description: "The most common source of pain. Bears the majority of your body weight.",
      position: { x: 51, y: 40 },
      labelSide: "right",
    },
    {
      id: "lumbar",
      name: "Lumbar (Lower Back)",
      description: "Poor posture, desk work, and stress compress this region daily.",
      position: { x: 52, y: 68 },
      labelSide: "left",
    },
    {
      id: "sacral",
      name: "Sacral (Base)",
      description: "Hip pain, sciatica, and nerve issues often trace back to this area.",
      position: { x: 50, y: 85 },
      labelSide: "right",
    },
  ],
};
