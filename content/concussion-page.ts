import type { ConditionFaq, ConditionRelatedLink } from "@/content/conditions/types";

/** Bespoke content for the dedicated /conditions/concussion page — same
 * per-condition, hand-built approach as the other condition pages and the
 * /services/* pages built this pass. Pulled from the Figma `Concussion`
 * frame (file 3oNk0hDle8VMrPJQ0W0pDG, node 251:771) via get_metadata
 * (get_design_context and download_assets were both unavailable — Figma
 * MCP tool-call limit reached mid-session, same constraint noted on
 * cervicogenic-headache-page.ts).
 *
 * Like the cervicogenic-headache frame, this one reuses large chunks of
 * boilerplate from other frames rather than being built from scratch:
 * - The "Conditions X relieves" list (Whiplash/Neck Pain rows) is literal
 *   leftover massage-soft-tissue copy — skipped entirely rather than
 *   force unrelated content onto a concussion page.
 * - The doctor-bio band is the same leftover massage-page bio with an
 *   unverified PIP-billing claim — page reuses the shared, scrubbed
 *   doctorProfileContent bio instead.
 * - The FAQ heading/items are literal leftover massage-soft-tissue copy
 *   ("Everything you need to know about soft tissue therapy" on a
 *   concussion page) — replaced with real, concussion-specific questions.
 * - A "types-of-concussion-trauma" section exists in the frame but its
 *   text lives inside a component instance (SectionTitle/SymptomText/
 *   ItemTitle/ItemDescription slot names, not literal text) that only
 *   get_design_context can resolve — unavailable this pass, so it's
 *   skipped rather than guessed.
 * - A "HOW WE TREAT" section exists too, but its 4 treatment
 *   cards are literal leftover back-pain-page copy (titles like
 *   "Myofasial Release/Trigger Point" paired with a description about
 *   "lower back strain") — clinically inappropriate for a concussion page
 *   (concussion isn't treated with adjustments/traction), so skipped
 *   rather than reused as-is.
 *
 * What IS genuine to this frame: the Hero, the interactive "check your
 * symptoms" widget (SymptomChecklist component), and the Understanding
 * section below.
 *
 * ATS-E4 compliance scrubbing applied, same as every other page this pass
 * touched: the hero footerNote's hardcoded city list is neutralized, and
 * the closing CTA band's "Same-day visits, seven days a week" claim is
 * removed.
 *
 * Deviation from the design-to-code skill's normal asset flow: the hero
 * background photo shares the same Figma source node
 * (hf_20260717_002604_...) as the cervicogenic-headache page's hero,
 * which also couldn't be downloaded — reuses the same
 * /figma-exports/drabe-headache.png substitute for consistency. */

export const concussionHero = {
  eyebrowChip: "Hit your head or felt dazed after a car accident?",
  h1: "Concussion / Post-Concussion Chiropractor in Deerfield Beach, FL",
  subhead:
    'Even a "minor" concussion needs evaluation — symptoms can persist for weeks without the right care.',
  backgroundImage: {
    src: "/figma-exports/drabe-headache.png",
    alt: "Dr. Abe Nasser examining a patient after a car accident",
  },
};

export const concussionSymptoms: string[] = [
  "Headache or pressure in the head",
  "Dizziness or balance problems",
  "Sensitivity to light or noise",
  'Difficulty concentrating or "brain fog"',
  "Fatigue or sleep disturbances",
  "Irritability or mood changes",
];

export const concussionSymptomNote =
  "Worth a conversation. Even a couple of these symptoms after an accident are worth mentioning at an evaluation.";

export const concussionRelatedBottom: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Auto Accident Injuries", href: "/auto-accidents", highlighted: true },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
  { label: "Spinal Decompression", href: "/services/spinal-decompression" },
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Home Visit Care", href: "/home-visits" },
  { label: "Cervicogenic Headache", href: "/conditions/cervicogenic-headache" },
  { label: "View All Treatments", href: "/services" },
];

export const concussionFaq: ConditionFaq = {
  headerTail: "concussion and post-concussion care",
  items: [
    {
      q: "Can you have a concussion without losing consciousness or hitting your head?",
      a: "Yes — the sudden whiplash motion of a car accident alone can cause the brain to move inside the skull, which is enough to cause a mild traumatic brain injury. Most concussions don't involve any loss of consciousness at all.",
    },
    {
      q: "How long do concussion symptoms typically last?",
      a: "Many people improve within the first couple of weeks, but symptoms like headaches, dizziness, or brain fog that persist beyond that point are considered post-concussion syndrome and are worth a dedicated evaluation.",
    },
    {
      q: "Is chiropractic care safe after a concussion?",
      a: "Often, yes, once anything more serious has been ruled out — gentle, upper-cervical-focused care can help with the neck-related symptoms that frequently accompany a concussion. Your evaluation determines what's appropriate for your specific case.",
    },
    {
      q: "Why do concussion and whiplash so often get missed together?",
      a: 'Whiplash symptoms are more obvious and get treated first, while concussion symptoms like brain fog or light sensitivity are easy to dismiss as "just being shaken up." A full evaluation after any collision checks for both.',
    },
  ],
};
