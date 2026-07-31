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

/** ATS-030 variant presets. Every lead form on the site is one of these
 * configs spread into <LeadForm />:
 *
 *   <LeadForm heading="..." {...leadFormVariants.heroEval} />
 */
export const leadFormVariants = {
  heroEval: {
    variant: "heroEval",
    fields: baseFields,
    submitLabel: "Schedule My Evaluation",
  },
  /** /auto-accidents hero form: First/Last/Phone only, no email — matches
   * the Figma hero card exactly (unlike heroEval, which includes email). */
  accidentEval: {
    variant: "accidentEval",
    fields: baseFields.filter((field) => field.name !== "email"),
    submitLabel: "Schedule My Evaluation",
  },
  carAccident: {
    variant: "carAccident",
    fields: [
      ...baseFields,
      { name: "claimNumber", label: "Claim # (if available)", required: false },
    ],
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
      { name: "bestTime", label: "Best Time to Contact", required: false },
    ],
    submitLabel: "Contact Us",
  },
  /** No email field by design — the home-visits eligibility check (ATS-110)
   * only asks for name, phone, and zip. */
  eligibility: {
    variant: "eligibility",
    fields: [...baseFields.filter((field) => field.name !== "email"), zipField],
    submitLabel: "Check Eligibility",
  },
  /** Two-step /book hero form per the Book-appt artboard: step 1 collects
   * first name + phone, step 2 the rest. No email field by design. */
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
      {
        name: "notes",
        label: "Anything else we should know? (optional)",
        type: "textarea",
        required: false,
      },
    ],
    submitLabel: "Schedule My Evaluation",
  },
} satisfies Record<string, LeadFormVariantConfig>;

export type LeadFormVariant = keyof typeof leadFormVariants;
