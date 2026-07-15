import type { LeadFieldConfig } from "@/components/ui/lead-form";

export interface LeadFormVariantConfig {
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
    fields: baseFields,
    submitLabel: "Schedule My Evaluation",
  },
  carAccident: {
    fields: [
      ...baseFields,
      { name: "claimNumber", label: "Claim # (if available)", required: false },
    ],
    submitLabel: "Schedule My Car Accident Evaluation",
  },
  contact: {
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
    fields: [...baseFields, zipField],
    submitLabel: "Check Eligibility",
  },
} satisfies Record<string, LeadFormVariantConfig>;

export type LeadFormVariant = keyof typeof leadFormVariants;
