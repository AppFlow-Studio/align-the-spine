import type { LeadFormVariantConfig } from "@/content/lead-forms";
import type { LeadFieldConfig } from "@/lib/lead-form-schema";

/** Haitian Creole lead-form presets (ATS-SEO-136) — the `/ht` mirror of
 * content/es/lead-forms.ts and content/pt/lead-forms.ts, built the same way
 * and for the same reason:
 *
 *  1. `variant` keys are unchanged from the English/Spanish/Portuguese
 *     presets. lib/leads/request.ts re-validates every submission with
 *     `buildLeadFormSchema(leadFormVariants[formId].fields)` — the ENGLISH
 *     config, looked up by variant name. A Haitian Creole form posting a
 *     different variant key, or the same key with different fields, is
 *     rejected server-side.
 *  2. Field `name`s, and their ORDER, are unchanged — they're the payload
 *     keys the practice's lead pipeline and lib/analytics read.
 *  3. Select `value`s ("yes"/"no") are unchanged — the label is for the
 *     human, the value is for the pipeline.
 *
 * No field is added beyond what the English/Spanish/Portuguese forms ask.
 * Wording is genuine Kreyòl Ayisyen, not French — "imel" not "courriel",
 * "nimewo telefòn" not "numéro de téléphone".
 */
const baseFields: LeadFieldConfig[] = [
  { name: "firstName", label: "Non", half: true, autoComplete: "given-name" },
  { name: "lastName", label: "Siyati", half: true, autoComplete: "family-name" },
  { name: "phone", label: "Telefòn", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Imel", type: "email", autoComplete: "email" },
];

const zipField: LeadFieldConfig = {
  name: "zip",
  label: "Kòd postal",
  type: "zip",
  autoComplete: "postal-code",
};

const carAccidentField: LeadFieldConfig = {
  name: "carAccident",
  label: "Èske sa gen rapò ak yon aksidan machin?",
  type: "select",
  required: false,
  placeholder: "Chwazi yon opsyon",
  options: [
    { label: "Wi", value: "yes" },
    { label: "Non", value: "no" },
  ],
};

/** Accident date, not an accident description — narrows Florida's 14-day
 * initial-care timing window, which is scheduling information rather than
 * clinical detail. */
const accidentDateField: LeadFieldConfig = {
  name: "accidentDate",
  label: "Dat aksidan an",
  type: "date",
  autoComplete: "off",
};

export const htLeadFormVariants = {
  heroEval: {
    variant: "heroEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Mande evalyasyon mwen",
  },
  accidentEval: {
    variant: "accidentEval",
    fields: [...baseFields, accidentDateField, carAccidentField],
    submitLabel: "Mande evalyasyon mwen",
  },
  contactUs: {
    variant: "contactUs",
    fields: [
      ...baseFields,
      carAccidentField,
      { name: "message", label: "Mesaj", type: "textarea" },
    ],
    submitLabel: "Voye mesaj",
  },
  carAccident: {
    variant: "carAccident",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Mande evalyasyon mwen",
  },
  reviewsEval: {
    variant: "reviewsEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Mande evalyasyon mwen",
  },
  contact: {
    variant: "contact",
    fields: [
      { name: "firstName", label: "Non", half: true, autoComplete: "given-name" },
      { name: "lastName", label: "Siyati", half: true, autoComplete: "family-name" },
      { name: "email", label: "Imel", type: "email", autoComplete: "email" },
      { name: "phone", label: "Telefòn", type: "tel", half: true, autoComplete: "tel" },
      { ...zipField, half: true },
      carAccidentField,
      { name: "bestTime", label: "Pi bon lè pou kontakte ou", required: false },
    ],
    submitLabel: "Kontakte nou",
  },
  eligibility: {
    variant: "eligibility",
    fields: [...baseFields, zipField, carAccidentField],
    submitLabel: "Verifye elijibilite",
  },
  /** "Mande", jamè "Rezève"/"Konfime" — biwo a rele ou tounen pou konfime
   * lè a. Menm rezon ak CTA angle a ("Request", pa "Book" — ATS-E3 3.4), ak
   * CTA panyòl la ("Solicitar") ak pòtigè a ("Solicitar"). */
  booking: {
    variant: "booking",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Mande evalyasyon mwen",
  },
} satisfies Record<string, LeadFormVariantConfig>;
