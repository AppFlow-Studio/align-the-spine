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
      ...baseFields,
      zipField,
      {
        name: "bestTime",
        label: "Best Time to Contact",
        type: "select",
        placeholder: "Select a time",
        options: [
          { label: "Morning", value: "morning" },
          { label: "Afternoon", value: "afternoon" },
          { label: "Evening", value: "evening" },
        ],
      },
      { name: "message", label: "Message", type: "textarea" },
    ],
    submitLabel: "Contact Us",
  },
  eligibility: {
    variant: "eligibility",
    fields: [...baseFields, zipField],
    submitLabel: "Check Eligibility",
  },
} satisfies Record<string, LeadFormVariantConfig>;

export type LeadFormVariant = keyof typeof leadFormVariants;
