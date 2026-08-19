import type { LeadFieldConfig } from "@/lib/lead-form-schema";

export interface LeadFormVariantConfig {
  /** Key the server uses to pick the validation schema in /api/lead. */
  variant: string;
  fields: LeadFieldConfig[];
  submitLabel: string;
}

const baseFields: LeadFieldConfig[] = [
  { name: "firstName", label: "First Name", half: true, autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", half: true, autoComplete: "family-name" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
];

const zipField: LeadFieldConfig = {
  name: "zip",
  label: "Zip Code",
  type: "zip",
  autoComplete: "postal-code",
};

/** Shared across every variant so a lead can always be filtered/prioritized
 * by whether it's accident-related, regardless of which page or form it
 * came through — lib/analytics.ts's classifyLeadPriority reads this field
 * first, ahead of any page/variant-based inference. Left optional: on an
 * already accident-framed form (e.g. /car-accident-chiropractor) re-asking
 * would be pure friction, and classifyLeadPriority's variant-based fallback
 * covers a blank answer there — see accidentEval below, which drops this
 * question entirely for exactly that reason. */
const carAccidentField: LeadFieldConfig = {
  name: "carAccident",
  label: "Is this related to a car accident?",
  type: "select",
  required: false,
  placeholder: "Select one",
  options: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};

/** /car-accident-chiropractor-only — replaces carAccidentField there since
 * "is this related to a car accident?" is redundant on a page the visitor
 * only reached because it is one; the date narrows Florida's 14-day PIP
 * evaluation window instead, which is actually new information. Native
 * <input type="date"> enforces the format (no free-text parsing), and
 * lib/lead-form-schema.ts's isNotFutureDate refine rejects a date after
 * today server-side too. */
const accidentDateField: LeadFieldConfig = {
  name: "accidentDate",
  label: "Date of Accident",
  type: "date",
  autoComplete: "off",
};

/** ATS-030 variant presets. Every lead form on the site is one of these
 * configs spread into <LeadForm />:
 *
 *   <LeadForm heading="..." {...leadFormVariants.heroEval} />
 */
export const leadFormVariants = {
  heroEval: {
    variant: "heroEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Schedule My Evaluation",
  },
  /** /car-accident-chiropractor hero form: same First/Last/Phone/Email
   * fields as heroEval, but accidentDateField instead of carAccidentField
   * — see that field's own doc comment for why. Already in
   * lib/analytics.ts's HIGH_PRIORITY_VARIANTS, so dropping carAccidentField
   * here doesn't lose priority classification — the variant alone is
   * enough since the whole page is accident-framed. */
  accidentEval: {
    variant: "accidentEval",
    fields: [...baseFields, accidentDateField],
    submitLabel: "Schedule My Evaluation",
  },
  /** /contact-us hero form: single Name field (not First/Last), Phone,
   * Email, and a Message textarea — matches the Figma hero card exactly. */
  contactUs: {
    variant: "contactUs",
    fields: [
      { name: "name", label: "Name", half: true, autoComplete: "name" },
      { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
      { name: "email", label: "Email", type: "email", autoComplete: "email" },
      carAccidentField,
      { name: "message", label: "Message", type: "textarea" },
    ],
    submitLabel: "Send Message",
  },
  // ATS-E3 (3.1): no claim-number field — the ticket forbids collecting
  // it on this form (broad accident qualifier only, no case-detail
  // fields).
  carAccident: {
    variant: "carAccident",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Schedule My Car Accident Evaluation",
  },
  /** /reviews hero form — same fields as heroEval, own variant key purely
   * so leads from this placement are distinguishable in the /api/lead log
   * and any future funnel analysis, same reasoning as carAccident
   * duplicating heroEval's fields below. */
  reviewsEval: {
    variant: "reviewsEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Schedule My Evaluation",
  },
  contact: {
    variant: "contact",
    fields: [
      { name: "firstName", label: "First Name", half: true, autoComplete: "given-name" },
      { name: "lastName", label: "Last Name", half: true, autoComplete: "family-name" },
      { name: "email", label: "Email", type: "email", autoComplete: "email" },
      { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
      { ...zipField, half: true },
      carAccidentField,
      { name: "bestTime", label: "Best Time to Contact", required: false },
    ],
    submitLabel: "Contact Us",
  },
  /** No email field by design — the home-visits eligibility check (ATS-110)
   * only asks for name, phone, and zip. */
  eligibility: {
    variant: "eligibility",
    fields: [...baseFields.filter((field) => field.name !== "email"), zipField, carAccidentField],
    submitLabel: "Check Eligibility",
  },
  /** Single-step /book form: first name, last name, email, phone, and the
   * same carAccidentField every other full form uses — no free-text
   * "reason" select, no two-step gating. */
  booking: {
    variant: "booking",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Schedule My Evaluation",
  },
} satisfies Record<string, LeadFormVariantConfig>;

export type LeadFormVariant = keyof typeof leadFormVariants;
