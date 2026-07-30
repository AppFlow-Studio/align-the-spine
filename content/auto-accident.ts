import type { HowWeHelpStep } from "@/components/sections/how-we-help-steps";

/** "HOW WE HELP" steps for the /auto-accident page (Epic 4), claim/PIP-framed
 * copy per the ticket's scope. Reuses the Home-visits step
 * images (call/clipboard/notebook) since no auto-accident-specific Figma
 * assets exist yet — the Figma MCP tool hit its call limit this session, so
 * Frame 13/14/12's dev-mode specs were never pulled. */
export const autoAccidentSteps: HowWeHelpStep[] = [
  {
    image: "/figma-exports/home-visits-step-call.png",
    alt: "Phone showing an incoming call",
    title: "Call or request your evaluation",
    description:
      "Tell us about your accident and when it happened. Most requests get a same-day answer, and we'll walk you through what a PIP-covered evaluation includes.",
  },
  {
    image: "/figma-exports/home-visits-step-eligibility.png",
    alt: "Clipboard with an evaluation form",
    title: "Full accident evaluation",
    description:
      "A complete exam that documents your injuries the way your claim — and your attorney, if you have one — needs.",
  },
  {
    image: "/figma-exports/home-visits-step-visit.png",
    alt: "Notebook and pen ready for a treatment plan",
    title: "Your treatment plan, handled",
    description:
      "We build and manage your care plan and bill PIP directly, so you're not stuck fronting costs or chasing paperwork.",
  },
];
