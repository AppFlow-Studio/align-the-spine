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
 * already accident-framed form (e.g. /auto-accidents) re-asking would be
 * pure friction, and classifyLeadPriority's variant-based fallback covers a
 * blank answer there. */
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
  /** /auto-accidents hero form: First/Last/Phone only, no email — matches
   * the Figma hero card exactly (unlike heroEval, which includes email). */
  accidentEval: {
    variant: "accidentEval",
    fields: [...baseFields.filter((field) => field.name !== "email"), carAccidentField],
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
  /** Two-step /book hero form per the Book-appt artboard: step 1 collects
   * first name + phone, step 2 the rest. No email field by design.
   * ATS-E3 (3.4): the free-text "notes" field is gone — a broad reason
   * select only, no open-ended detailed health notes. Also carries its own
   * "Accident" option in `reason`, which classifyLeadPriority treats as
   * equivalent to carAccidentField — kept as-is rather than duplicated
   * alongside a second, redundant accident question on this one form. */
  booking: {
    variant: "booking",
    fields: [
      { name: "firstName", label: "First Name", autoComplete: "given-name" },
      { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
      { name: "lastName", label: "Last Name", autoComplete: "family-name" },
      {
        name: "reason",
        label: "Reason for Visit",
        type: "select",
        placeholder: "Select a reason",
        options: [
          { label: "Back pain", value: "back-pain" },
          { label: "Neck pain", value: "neck-pain" },
          { label: "Sciatica", value: "sciatica" },
          { label: "Accident", value: "accident" },
          { label: "Home visit", value: "home-visit" },
          { label: "Other", value: "other" },
        ],
      },
    ],
    submitLabel: "Schedule My Evaluation",
  },
} satisfies Record<string, LeadFormVariantConfig>;

export type LeadFormVariant = keyof typeof leadFormVariants;
