export interface SpineOverviewContent {
  eyebrow: string;
  heading: string;
  image: { src: string; alt: string };
}

/** Home-page-only static spine diagram (replaces PointToWhereItHurts's
 * interactive hotspots on / — see components/sections/spine-overview.tsx).
 * The four regions and their captions are baked into the image itself, so
 * `image.alt` carries the full text for screen readers. */
export const spineOverviewContent: SpineOverviewContent = {
  eyebrow: "Understanding the spine",
  heading: "Your spine controls everything",
  image: {
    src: "/figma-exports/spine-regions-diagram.png",
    alt: "Diagram of the spine's four regions, viewed from the back: cervical (neck) — headaches, neck stiffness, and shoulder tension most often originate here; thoracic (mid-back) — the most common source of pain, bearing the majority of the body's weight; lumbar (lower back) — compressed daily by poor posture, desk work, and stress; sacral (base) — hip pain, sciatica, and nerve issues often trace back to this area.",
  },
};
