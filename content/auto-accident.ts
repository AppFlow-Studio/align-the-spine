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

/** Quote strip between the HOW WE HELP steps and the "Ready when you are"
 * CTA band, per the Figma frame. The original copy asserted an unverifiable
 * third-party attorney-referral claim and a "PIP-covered" coverage
 * guarantee — this file's own prior comment said both were removed for
 * lacking client sign-off, but the exported string still contained them
 * verbatim (SEO Foundation Phase 1 caught and fixed the actual value, not
 * just the comment describing the fix). Rewritten to describe only what the
 * practice does, with no referral claim and no coverage guarantee. */
export const autoAccidentAttorneyQuote =
  "When your case involves an attorney or an insurance adjuster, we coordinate directly with them — so your treatment plan and documentation are ready when they're needed.";
