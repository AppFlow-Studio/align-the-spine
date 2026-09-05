import type { LeadFormVariantConfig } from "@/content/lead-forms";
import type { LeadFieldConfig } from "@/lib/lead-form-schema";

/** Brazilian Portuguese lead-form presets (ATS-SEO-135) — the `/pt` mirror
 * of content/es/lead-forms.ts, built the same way and for the same reason:
 *
 *  1. `variant` keys are unchanged from the English/Spanish presets.
 *     lib/leads/request.ts re-validates every submission with
 *     `buildLeadFormSchema(leadFormVariants[formId].fields)` — the ENGLISH
 *     config, looked up by variant name. A Portuguese form posting a
 *     different variant key, or the same key with different fields, is
 *     rejected server-side.
 *  2. Field `name`s, and their ORDER, are unchanged — they're the payload
 *     keys the practice's lead pipeline and lib/analytics read.
 *  3. Select `value`s ("yes"/"no") are unchanged — the label is for the
 *     human, the value is for the pipeline.
 *
 * content/es/content-parity.test.ts's field-name/order/variant-key/select-value
 * assertions exist because an earlier Spanish drift caused real submissions
 * to fail server-side validation — this file is written against that
 * lesson from the start rather than repeating the mistake in a third
 * language.
 *
 * No field is added beyond what the English/Spanish forms ask.
 */
const baseFields: LeadFieldConfig[] = [
  { name: "firstName", label: "Nome", half: true, autoComplete: "given-name" },
  { name: "lastName", label: "Sobrenome", half: true, autoComplete: "family-name" },
  { name: "phone", label: "Telefone", type: "tel", autoComplete: "tel" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
];

const zipField: LeadFieldConfig = {
  name: "zip",
  label: "CEP",
  type: "zip",
  autoComplete: "postal-code",
};

const carAccidentField: LeadFieldConfig = {
  name: "carAccident",
  label: "Relacionado a um acidente de carro?",
  type: "select",
  required: false,
  placeholder: "Selecione uma opção",
  options: [
    { label: "Sim", value: "yes" },
    { label: "Não", value: "no" },
  ],
};

/** Accident date, not an accident description — narrows Florida's 14-day
 * initial-care timing window, which is scheduling information rather than
 * clinical detail. */
const accidentDateField: LeadFieldConfig = {
  name: "accidentDate",
  label: "Data do acidente",
  type: "date",
  autoComplete: "off",
};

export const ptLeadFormVariants = {
  heroEval: {
    variant: "heroEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar minha avaliação",
  },
  accidentEval: {
    variant: "accidentEval",
    fields: [...baseFields, accidentDateField, carAccidentField],
    submitLabel: "Solicitar minha avaliação",
  },
  contactUs: {
    variant: "contactUs",
    fields: [
      ...baseFields,
      carAccidentField,
      { name: "message", label: "Mensagem", type: "textarea" },
    ],
    submitLabel: "Enviar mensagem",
  },
  carAccident: {
    variant: "carAccident",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar minha avaliação",
  },
  reviewsEval: {
    variant: "reviewsEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar minha avaliação",
  },
  contact: {
    variant: "contact",
    fields: [
      { name: "firstName", label: "Nome", half: true, autoComplete: "given-name" },
      { name: "lastName", label: "Sobrenome", half: true, autoComplete: "family-name" },
      { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
      { name: "phone", label: "Telefone", type: "tel", half: true, autoComplete: "tel" },
      { ...zipField, half: true },
      carAccidentField,
      { name: "bestTime", label: "Melhor horário para contato", required: false },
    ],
    submitLabel: "Entrar em contato",
  },
  eligibility: {
    variant: "eligibility",
    fields: [...baseFields, zipField, carAccidentField],
    submitLabel: "Verificar elegibilidade",
  },
  /** "Solicitar", nunca "Marcar"/"Agendar" — o consultório retorna a
   * ligação para confirmar o horário. Mesma razão da CTA em inglês
   * ("Request", não "Book" — ATS-E3 3.4) e da CTA em espanhol
   * ("Solicitar"). */
  booking: {
    variant: "booking",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar minha avaliação",
  },
} satisfies Record<string, LeadFormVariantConfig>;
