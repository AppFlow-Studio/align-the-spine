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

const PHONE_PATTERN = /^[\d\s().+-]{7,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;

const PATTERN_RULES: Partial<Record<LeadFieldType, { pattern: RegExp; message: string }>> = {
  tel: { pattern: PHONE_PATTERN, message: "Enter a valid phone number" },
  email: { pattern: EMAIL_PATTERN, message: "Enter a valid email" },
  zip: { pattern: ZIP_PATTERN, message: "Enter a valid ZIP code" },
};

/** Each variant's schema is derived from its fields config: required fields
 * must be non-empty, and tel/email/zip enforce a format when filled in. */
export function buildLeadFormSchema(fields: LeadFieldConfig[]) {
  const shape: Record<string, z.ZodType<string>> = {};
  for (const field of fields) {
    const rule = PATTERN_RULES[field.type ?? "text"];
    if (field.required === false) {
      shape[field.name] = rule
        ? z.literal("").or(z.string().regex(rule.pattern, rule.message))
        : z.string();
    } else {
      let schema = z.string().min(1, "Required");
      if (rule) schema = schema.regex(rule.pattern, rule.message);
      shape[field.name] = schema;
    }
  }
  return z.object(shape);
}
