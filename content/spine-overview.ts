export interface SpineSegment {
  id: string;
  /** Short region label, e.g. "Cervical (Neck)". */
  name: string;
  description: string;
  /** Percentage position of this region's marker on the (portrait) spine
   * frame, matched by eye against the region's location on the straightened
   * spine — the clip's last frame, which is what the callouts sit over. */
  position: { x: number; y: number };
  /** Which side of the image this region's callout label renders on. */
  labelSide: "left" | "right";
}

export interface SpineOverviewContent {
  eyebrow: string;
  heading: string;
  /** Straightened last frame — the resting state (and still fallback when
   * there's no clip / reduced motion). */
  image: { src: string; alt: string };
  /** Optional posture clip: plays once, hunched→aligned, when the section
   * scrolls into view, then rests on `image`; callouts fade in once it settles. */
  video?: string;
  /** Poster shown before the clip plays — the hunched first frame, so playback
   * starts with no jump. Defaults to `image.src`. */
  videoPoster?: string;
  segments: SpineSegment[];
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
  image: {
    src: "/figma-exports/spine-straight-poster.jpg",
    alt: "A spine straightening from a hunched posture to an upright, aligned one",
  },
  video: "https://align-the-spine.b-cdn.net/images/spine-straight.mp4",
  videoPoster: "/figma-exports/spine-hunched-poster.jpg",
  segments: [
    {
      id: "cervical",
      name: "Cervical (Neck)",
      description: "Headaches, neck stiffness, shoulder tension — most originate here.",
      position: { x: 52, y: 22 },
      labelSide: "left",
    },
    {
      id: "thoracic",
      name: "Thoracic (Mid-Back)",
      description: "The most common source of pain. Bears the majority of your body weight.",
      position: { x: 52, y: 44 },
      labelSide: "right",
    },
    {
      id: "lumbar",
      name: "Lumbar (Lower Back)",
      description: "Poor posture, desk work, and stress compress this region daily.",
      position: { x: 52, y: 61 },
      labelSide: "left",
    },
    {
      id: "sacral",
      name: "Sacral (Base)",
      description: "Hip pain, sciatica, and nerve issues often trace back to this area.",
      position: { x: 52, y: 76 },
      labelSide: "right",
    },
  ],
};
