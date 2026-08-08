import type { ConditionFaq, ConditionRelatedLink } from "@/content/conditions/types";

/** Bespoke content for the dedicated /conditions/tmj-jaw-pain page — same
 * per-condition, hand-built approach as the other condition pages and the
 * /services/* pages built this pass. Pulled from the Figma `TMJ/Jawpain`
 * frame (file 3oNk0hDle8VMrPJQ0W0pDG, node 273:872) via get_metadata
 * (get_design_context and download_assets were both unavailable — Figma
 * MCP tool-call limit reached mid-session, same constraint noted on
 * cervicogenic-headache-page.ts and concussion-page.ts).
 *
 * Same pattern as the other two "accident injury" frames built this pass:
 * - The hero eyebrow was literal leftover concussion-page copy ("Hit your
 *   head or felt dazed after a car accident?" on a jaw-pain page) —
 *   replaced with genuine TMJ-appropriate copy.
 * - The doctor-bio band and FAQ are the same leftover massage-soft-tissue
 *   copy found on every other frame this pass — bio reuses the shared,
 *   scrubbed doctorProfileContent instead, FAQ is bespoke.
 * - A "types-of-tmj-dysfunction" section exists (symptom list, related
 *   conditions, a "spectrum" bar from acute to chronic, a bruxism note)
 *   but all of its text lives inside a component instance (SectionTitle/
 *   SymptomText/CardTitle/SpectrumHeading/etc. slot names, not literal
 *   text) that only get_design_context can resolve — unavailable this
 *   pass, so it's skipped rather than guessed, same as the equivalent
 *   section on concussion-page.ts.
 *
 * What IS genuine to this frame: the Hero and the Understanding section
 * below.
 *
 * ATS-E4 compliance scrubbing applied, same as every other page this pass
 * touched: the hero footerNote's hardcoded city list is neutralized, and
 * the closing CTA band's "Same-day visits, seven days a week" claim is
 * removed.
 *
 * Deviation from the design-to-code skill's normal asset flow: the hero
 * background photo shares the same Figma source node
 * (hf_20260717_002604_...) as the cervicogenic-headache and concussion
 * pages' heroes, which also couldn't be downloaded — reuses the same
 * /figma-exports/drabe-headache.png substitute for consistency. No photo
 * was specified for the Understanding section in this frame (unlike the
 * other two), so it reuses /figma-exports/dr-abe-neck.png, matching the
 * other two pages' Understanding-section photo. */

export const tmjJawPainHero = {
  eyebrowChip: "Jaw pain or clicking after a car accident?",
  h1: "TMJ / Jaw Pain Chiropractor in Deerfield Beach, FL",
  subhead:
    "The same forces that cause whiplash can injure the jaw joint too — often missed because the neck pain gets all the attention.",
  backgroundImage: {
    src: "/figma-exports/drabe-headache.png",
    alt: "Dr. Abe Nasser examining a patient after a car accident",
  },
};

export const tmjJawPainRelatedBottom: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Auto Accident Injuries", href: "/auto-accidents", highlighted: true },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Cervicogenic Headache", href: "/conditions/cervicogenic-headache" },
  { label: "Concussion", href: "/conditions/concussion" },
  { label: "Home Visit Care", href: "/home-visits" },
  { label: "View All Treatments", href: "/services" },
];

export const tmjJawPainFaq: ConditionFaq = {
  headerTail: "TMJ and jaw pain",
  items: [
    {
      q: "Can a car accident really cause TMJ problems?",
      a: "Yes — the same forward-back motion that causes whiplash can strain or misalign the jaw joint on impact, especially if your jaw was clenched or open at the moment of collision. It's easy to miss because neck pain usually gets the attention first.",
    },
    {
      q: "What does TMJ dysfunction feel like?",
      a: "Common signs include clicking or popping when you open your mouth, jaw pain or tightness, difficulty chewing, and headaches that trace back to the jaw joint rather than the neck.",
    },
    {
      q: "How is TMJ dysfunction treated?",
      a: "Treatment depends on what the evaluation finds — it can include gentle joint mobilization, soft-tissue work on the surrounding muscles, and guidance on habits (like clenching) that keep aggravating it.",
    },
    {
      q: "How many visits will I need?",
      a: "It varies by how significant the strain is. Mild cases can improve in a few visits; others need a longer plan, especially if there's ongoing clenching or grinding involved. We reassess as you go.",
    },
  ],
};
