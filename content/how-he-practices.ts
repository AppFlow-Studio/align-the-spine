export interface PracticeCard {
  title: string;
  description: string;
  image: { src: string; alt: string };
}

export interface HomeVisitCallout {
  heading: string;
  body: string;
  image: { src: string; alt: string };
}

/** "HOW HE PRACTICES" section per the about-drabe artboard (96:3244–96:4348,
 * ATS-090/091): a 3-card "What patients actually notice" row, then a
 * home-vs-office callout under "The office, when you'd rather come to us".
 * The artboard repeats the "HOW HE PRACTICES" eyebrow above both halves —
 * kept once, above the cards, since repeating identical eyebrow text twice
 * back-to-back reads as a duplication rather than two distinct sections. */
export const howHePracticesCards: PracticeCard[] = [
  {
    title: "Accessible care",
    description:
      "Transparent pricing and a $50 new-patient visit — great chiropractic care shouldn't be a luxury.",
    image: { src: "/figma-exports/drabe-whiplash.png", alt: "Chiropractic treatment session" },
  },
  {
    title: "Always the same doctor",
    description:
      "No rotating providers. Every visit, you see Dr. Abe — he knows your case because he's the one treating it.",
    image: { src: "/figma-exports/drabe-backpain.png", alt: "Dr. Abe treating a patient" },
  },
  {
    title: "Every stage of life",
    description:
      "Pre- and post-pregnancy, post-surgical, geriatric, athletes — care built around where you actually are.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe providing care at a patient's home",
    },
  },
];

export const homeVisitCallout: HomeVisitCallout = {
  heading: "The office, when you'd rather come to us",
  body: "Home visits are available based on your case and location — but the Deerfield Beach office is always here, same-day appointments most weeks.",
  image: { src: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
};
