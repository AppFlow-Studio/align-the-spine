import { siteConfig } from "@/content/site";

export interface SpineSegment {
  id: string;
  /** Region label, e.g. "Cervical spine (C1–C7)". */
  name: string;
  description: string;
}

export interface SpineOverviewContent {
  eyebrow: string;
  heading: string;
  intro: string;
  image: { src: string; alt: string };
  segments: SpineSegment[];
  cta: { label: string; href: string };
}

/** Static "Understanding the spine" overview for the Home page (ATS-071). The
 * condition pages keep the interactive PointToWhereItHurts hotspot diagram; the
 * home page shows this calmer, non-interactive anatomy primer that walks the
 * four spinal regions top-to-bottom and names where the accident injuries we
 * treat tend to land. Reuses the same body illustration as PointToWhereItHurts. */
export const spineOverviewContent: SpineOverviewContent = {
  eyebrow: "Understanding the spine",
  heading: "How your spine carries a collision",
  intro:
    "A car accident sends force through the entire spine, but each region absorbs it differently. Here's how the four regions work — and where the injuries we treat most often show up.",
  image: { src: "/figma-exports/spine-skeloton.png", alt: "Human spine anatomy, back view" },
  cta: { label: "Schedule an evaluation", href: siteConfig.bookingCta.href },
  segments: [
    {
      id: "cervical",
      name: "Cervical spine (C1–C7)",
      description:
        "The neck — the most mobile and least protected part of the spine. Whiplash, cervicogenic headaches, and reduced range of motion almost always start here.",
    },
    {
      id: "thoracic",
      name: "Thoracic spine (T1–T12)",
      description:
        "The mid-back, anchored to the rib cage. Seat-belt and bracing forces leave it stiff and tender between the shoulder blades.",
    },
    {
      id: "lumbar",
      name: "Lumbar spine (L1–L5)",
      description:
        "The lower back, which carries most of your weight. Herniated discs and the radiating leg pain of sciatica concentrate here.",
    },
    {
      id: "sacral",
      name: "Sacrum & coccyx",
      description:
        "The base that ties the spine into the pelvis. Misalignment here throws off posture and load all the way up the chain.",
    },
  ],
};
