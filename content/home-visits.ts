import type { HowWeHelpStep } from "@/components/sections/how-we-help-steps";

/** "Three steps, no waiting room" on /home-visits (ATS-110), per the
 * Home-visits-v2 artboard. */
export const homeVisitSteps: HowWeHelpStep[] = [
  {
    image: "/figma-exports/home-visits-step-call.png",
    alt: "Phone showing an incoming call",
    title: "Call or request online",
    description:
      "Tell us what's going on and where you're located. Most requests get a same-day answer.",
  },
  {
    image: "/figma-exports/home-visits-step-eligibility.png",
    alt: "Clipboard with an evaluation form",
    title: "Quick eligibility check",
    description:
      "We confirm whether a home visit fits your case and location, or whether the office is the better call.",
  },
  {
    image: "/figma-exports/home-visits-step-visit.png",
    alt: "Notebook and pen ready for a home visit",
    title: "Full visit, at your address",
    description:
      "Same exam and hands-on treatment as the office — Dr. Abe Nasser brings what's needed with him.",
  },
];

export interface FitChecklistRow {
  goodFit: string;
  inOffice: string;
}

/** "Home visits fit some cases better than others" comparison rows on
 * /home-visits (ATS-110/111), per the Home-visits-v2 artboard. */
export const homeVisitFitChecklist: FitChecklistRow[] = [
  {
    goodFit:
      "Recovering from a car accident, especially in the first 14 days (PIP-covered in most cases)",
    inOffice: "Outside our current service area (call and we'll let you know)",
  },
  {
    goodFit: "Limited mobility — post-surgical, elderly, or unable to drive comfortably",
    inOffice:
      "Cases needing equipment only available in-office, like traction or decompression tables",
  },
  {
    goodFit: "Located within our South Florida service area",
    inOffice:
      "Routine, non-urgent maintenance visits, where the office is usually faster to schedule",
  },
  {
    goodFit: "Needing a same-day evaluation and unable to get to the office quickly",
    inOffice: "First-time evaluations, so we can build your full treatment plan in person",
  },
];
