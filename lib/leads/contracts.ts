import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";

export const LEAD_FORM_VERSION = 1;
export const LEAD_CONSENT_VERSION = "web-lead-v1";
export const LEAD_CONSENT_WORDING =
  "By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.";

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
