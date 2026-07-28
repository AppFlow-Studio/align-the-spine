export interface ComparisonRow {
  label: string;
  alignTheSpine: string;
  traditionalClinic: string;
}

export const comparisonTableEyebrow = "A Better Way to Recover";
export const comparisonTableHeading = "Why struggle to a clinic while you're in pain?";
export const comparisonTableSubheading =
  "Dr. Abe Nasser builds the plan around your recovery — including home visits when they're the right fit.";

/** Base "Align the Spine vs Traditional Clinic" rows per condition-page-spec
 * §B5, §C. Shared across every condition page (and /auto-accidents once
 * built) — not condition-specific, so this lives standalone rather than on
 * `Condition`. */
export const comparisonTableRows: ComparisonRow[] = [
  {
    label: "Travel",
    alignTheSpine: "In-home visits, when eligible",
    traditionalClinic: "You drive in pain",
  },
  {
    label: "Availability",
    alignTheSpine: "Same Day Appointment",
    traditionalClinic: "Wait list 2-3 weeks",
  },
  {
    label: "Comfort",
    alignTheSpine: "Your living Room",
    traditionalClinic: "Clinical Waiting Room",
  },
];

/** Extra rows for the "auto-accident" variant (/auto-accidents, once built)
 * per the ticket's ⚠️ Variant note. */
export const autoAccidentComparisonRows: ComparisonRow[] = [
  {
    label: "Your Doctor",
    alignTheSpine: "Same doctor, every visit",
    traditionalClinic: "Different provider each time",
  },
  {
    label: "Attorney Referrals",
    alignTheSpine: "No referral needed",
    traditionalClinic: "Outside referral required",
  },
];

export const comparisonTableFootnote =
  "Home visits are offered based on your case and location — we'll confirm eligibility when you call.";

export const comparisonTableColumnHeadings = {
  careBenefits: "Care Benefits",
  alignTheSpine: "Align the Spine",
  traditionalClinic: "Traditional Clinic",
} as const;
