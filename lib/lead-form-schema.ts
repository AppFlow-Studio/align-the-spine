import { z } from "zod";

/** Shared (client + server) LeadForm field config and validation. Kept free of
 * "use client" so the /api/lead route can enforce the same schema server-side. */

export type LeadFieldType = "text" | "tel" | "email" | "zip" | "select" | "textarea";

export interface LeadFieldOption {
  label: string;
  value: string;
}

export interface LeadFieldConfig {
  /** Key in the submitted values object. */
  name: string;
  label: string;
  /** Defaults to "text". "zip" renders a numeric text input with ZIP validation. */
  type?: LeadFieldType;
  /** Defaults to true. */
  required?: boolean;
  /** Half-width fields pair up side by side in the two-column grid. */
  half?: boolean;
  /** Options for `type: "select"`. */
  options?: LeadFieldOption[];
  placeholder?: string;
  autoComplete?: string;
}

const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;

/** Max raw-input length per field type — a hard ceiling independent of
 * format validation, so a field can't be used to submit an arbitrarily long
 * string (junk data, a crude DoS attempt against the email pipeline, etc.).
 * "text"/"select" here means the fallback for any type not listed below. */
const MAX_LENGTHS: Partial<Record<LeadFieldType, number>> = {
  tel: 20,
  email: 254, // RFC 5321 practical max
  zip: 10,
  textarea: 2000,
};
const DEFAULT_MAX_LENGTH = 100;

/** Strips everything but digits and requires a real 10-digit US number (or
 * 11 with a leading country code 1) — rejects short numbers, padded/too-long
 * numbers, and letters, rather than just checking punctuation shape the way
 * a loose character-class regex would. */
function isValidUsPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

/** Each variant's schema is derived from its fields config: every field is
 * trimmed and length-capped regardless of type; required fields must be
 * non-empty after trimming; tel/email/zip enforce their format whenever
 * there's a value (always for required fields, only when non-empty for
 * optional ones). */
export function buildLeadFormSchema(fields: LeadFieldConfig[]) {
  const shape: Record<string, z.ZodType<string>> = {};

  for (const field of fields) {
    const type = field.type ?? "text";
    const required = field.required !== false;
    const maxLength = MAX_LENGTHS[type] ?? DEFAULT_MAX_LENGTH;

    let schema = z.string().trim().max(maxLength, "Too long");
    if (required) schema = schema.min(1, "Required");
    if (type === "email") schema = schema.email("Enter a valid email");
    else if (type === "zip") schema = schema.regex(ZIP_PATTERN, "Enter a valid ZIP code");

    let fieldSchema: z.ZodType<string> = schema;
    if (type === "tel") {
      fieldSchema = schema.refine(isValidUsPhone, "Enter a valid 10-digit phone number");
    }

    shape[field.name] = required ? fieldSchema : z.literal("").or(fieldSchema);
  }

  return z.object(shape);
}
