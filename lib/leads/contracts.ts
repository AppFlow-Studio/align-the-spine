import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";

export const LEAD_FORM_VERSION = 1;
export const LEAD_CONSENT_VERSION = "web-lead-v1";
export const LEAD_CONSENT_WORDING =
  "By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.";

/** Spanish rendering of the SAME consent, recorded under the SAME
 * LEAD_CONSENT_VERSION — it is one consent shown in two languages, not a
 * second, weaker one. Keep the two strings semantically identical: if the
 * English wording changes, this must change with it and the version must be
 * bumped for both. A Spanish-speaking patient has to be agreeing to exactly
 * what an English-speaking one agrees to, and the stored version has to
 * identify that text. */
export const LEAD_CONSENT_WORDING_ES =
  "Al enviar este formulario, usted acepta que Align the Spine Chiropractic pueda comunicarse con usted sobre su solicitud. No incluya información médica urgente ni altamente sensible.";

/** Brazilian Portuguese rendering of the SAME consent (ATS-SEO-135), under
 * the SAME LEAD_CONSENT_VERSION for the same reason as the Spanish one: one
 * consent, shown in three languages, not a third, weaker one. */
export const LEAD_CONSENT_WORDING_PT =
  "Ao enviar este formulário, você concorda que a Align the Spine Chiropractic pode entrar em contato com você sobre sua solicitação. Não inclua informações médicas urgentes ou altamente sensíveis.";

/** Haitian Creole rendering of the SAME consent (ATS-SEO-136), under the
 * SAME LEAD_CONSENT_VERSION — one consent, shown in four languages, not a
 * fourth, weaker one. */
export const LEAD_CONSENT_WORDING_HT =
  "Lè ou soumèt fòm sa a, ou dakò Align the Spine Chiropractic ka kontakte ou konsènan demann ou an. Pa mete okenn enfòmasyon medikal ijan oswa trè sansib.";

export const SENSITIVE_FIELDS = new Set(["message", "accidentDate"]);

export function isLeadFormVariant(value: unknown): value is LeadFormVariant {
  return typeof value === "string" && value in leadFormVariants;
}

export function splitLeadFields(values: Record<string, string>) {
  const contactFields: Record<string, string> = {};
  const sensitiveFields: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (SENSITIVE_FIELDS.has(key)) sensitiveFields[key] = value;
    else contactFields[key] = value;
  }
  return { contactFields, sensitiveFields };
}
