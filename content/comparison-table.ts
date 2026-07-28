export interface ComparisonRow {
  label: string;
  alignTheSpine: string;
  traditionalClinic: string;
}

/** Base "Align the Spine vs Traditional Clinic" rows per condition-page-spec
 * §B5, §C. Shared across every condition page (and /auto-accidents once
 * built) — not condition-specific, so this lives standalone rather than on
 * `Condition`. */
export const comparisonTableRows: ComparisonRow[] = [
  {
    label: "Travel",
    alignTheSpine: "We come to you — home, office, or hospital visits",
    traditionalClinic: "You drive to them, every appointment",
  },
  {
    label: "Availability",
    alignTheSpine: "Same-day and evening appointments, real flexibility",
    traditionalClinic: "Book weeks out, fixed clinic hours",
  },
  {
    label: "Comfort",
    alignTheSpine: "Treated in your own space, no waiting room",
    traditionalClinic: "Waiting rooms and rushed visit slots",
  },
  {
    label: "Continuity of Care",
    alignTheSpine: "One dedicated doctor who knows your case",
    traditionalClinic: "A different provider almost every visit",
  },
  {
    label: "Cost & Insurance",
    alignTheSpine: "Transparent pricing — PIP and insurance handled for you",
    traditionalClinic: "Surprise billing, you navigate insurance yourself",
  },
];

/** Extra rows for the "auto-accident" variant (/auto-accidents, once built)
 * per the ticket's ⚠️ Variant note. */
export const autoAccidentComparisonRows: ComparisonRow[] = [
  {
    label: "Your Doctor",
    alignTheSpine: "The same doctor treats you from first visit to last",
    traditionalClinic: "Rotating providers — retell your story every visit",
  },
  {
    label: "Attorney Referrals",
    alignTheSpine: "No referral needed — we work directly with your case",
    traditionalClinic: "Often requires an outside attorney referral to begin care",
  },
];

export const comparisonTableFootnote =
  "Care Benefits reflect typical patient experience and may vary by location, insurance, and individual case.";
