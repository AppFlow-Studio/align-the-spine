import type { HowWeHelpStep } from "@/components/sections/how-we-help-steps";

/** "HOW WE HELP" steps for /auto-accidents, copy pulled directly from the
 * Figma frame's dev-mode screenshots. Reuses the Home-visits step images
 * (call/clipboard/notebook) — no auto-accident-specific photography exists
 * in this Figma file either. */
export const autoAccidentSteps: HowWeHelpStep[] = [
  {
    image: "/figma-exports/home-visits-step-call.png",
    alt: "Phone showing an incoming call",
    title: "Call or request online",
    description: "Tell us what happened. No call center, no hold music.",
  },
  {
    image: "/figma-exports/home-visits-step-eligibility.png",
    alt: "Clipboard with an evaluation form",
    title: "Full evaluation",
    description:
      "A complete exam and the documentation your claim actually needs — at the office or your home.",
  },
  {
    image: "/figma-exports/home-visits-step-visit.png",
    alt: "Notebook and pen ready for a treatment plan",
    title: "Your plan, fully handled",
    description: "Treatment tied to your case — your attorney or insurer coordinated for you.",
  },
];

/** Attorney-referral quote strip between the HOW WE HELP steps and the
 * "Ready when you are" CTA band, per the Figma frame. ATS-E4 (4.5): the
 * original copy asserted an unverified attorney-referral claim and a PIP
 * billing claim ("Attorneys across South Florida refer their clients to
 * Dr. Abe Nasser because he's one of the few providers doing PIP-covered
 * home visits.") — neither has client sign-off. Reworded to describe what
 * we do without the referral/insurance-billing assertions. */
export const autoAccidentAttorneyQuote =
  "If you're working with an attorney, we're happy to coordinate documentation directly with them for your case.";
