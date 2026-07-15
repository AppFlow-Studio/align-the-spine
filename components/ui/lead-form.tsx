"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { type FieldVariant } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

export type LeadFormValues = Record<string, string>;

export type LeadFieldType = "text" | "tel" | "email" | "zip" | "select" | "textarea";

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
  options?: SelectOption[];
  placeholder?: string;
  autoComplete?: string;
}

export interface LeadFormProps {
  heading: string;
  /** Field config driving both rendering and the zod validation schema. */
  fields: LeadFieldConfig[];
  submitLabel: string;
  /** Wired to the real endpoint + success route by ATS-031; falls back to a
   * simulated delay so forms are demoable before then. */
  onSubmit?: (values: LeadFormValues) => Promise<void>;
  successMessage?: string;
  /** Field styling for dark (hero) vs light surfaces. */
  fieldVariant?: FieldVariant;
  className?: string;
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

function inputType(type: LeadFieldType) {
  if (type === "tel" || type === "email") return type;
  return "text";
}

/** Config-driven lead-capture form (ATS-030). Every lead form on the site is a
 * fields config passed to this engine — see content/lead-forms.ts for the
 * variant presets and docs/lead-form-contract.md for the props contract. */
export function LeadForm({
  heading,
  fields,
  submitLabel,
  onSubmit,
  successMessage = "Thanks — we'll be in touch shortly.",
  fieldVariant = "dark",
  className,
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(fields)) as Resolver<LeadFormValues>,
    defaultValues: Object.fromEntries(fields.map((field) => [field.name, ""])),
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onValid = async (values: LeadFormValues, event?: BaseSyntheticEvent) => {
    setSubmitted(false);
    setSubmitError(null);
    const honeypot = (event?.target as HTMLFormElement | undefined)?.elements.namedItem(
      "website",
    ) as HTMLInputElement | null;
    try {
      // Spam guard: a filled honeypot fakes success without submitting.
      if (!honeypot?.value) {
        if (onSubmit) {
          await onSubmit(values);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
      setSubmitted(true);
      reset();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      className={cn("relative grid grid-cols-2 gap-x-4 gap-y-5 backdrop-blur-md", className)}
    >
      <h2
        className={cn(
          "col-span-2 font-sans text-button font-medium",
          fieldVariant === "dark" ? "text-white" : "text-navy-900",
        )}
      >
        {heading}
      </h2>

      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="lead-form-website">Website</label>
        <input id="lead-form-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {fields.map((field) => {
        const type = field.type ?? "text";
        const spanClass = field.half ? undefined : "col-span-2";
        const error = errors[field.name]?.message;
        if (type === "select") {
          return (
            <Select
              key={field.name}
              label={field.label}
              variant={fieldVariant}
              options={field.options ?? []}
              placeholder={field.placeholder}
              error={error}
              className={spanClass}
              {...register(field.name)}
            />
          );
        }
        if (type === "textarea") {
          return (
            <Textarea
              key={field.name}
              label={field.label}
              variant={fieldVariant}
              placeholder={field.placeholder}
              error={error}
              className={spanClass}
              {...register(field.name)}
            />
          );
        }
        return (
          <Input
            key={field.name}
            label={field.label}
            type={inputType(type)}
            inputMode={type === "zip" ? "numeric" : undefined}
            variant={fieldVariant}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            error={error}
            className={spanClass}
            {...register(field.name)}
          />
        );
      })}

      <Button type="submit" variant="primary" loading={isSubmitting} className="col-span-2 w-full">
        {submitLabel}
      </Button>

      {submitError && (
        <p role="alert" className="col-span-2 font-sans text-field text-error">
          {submitError}
        </p>
      )}

      {submitted && (
        <p
          role="status"
          className={cn(
            "col-span-2 font-sans text-field",
            fieldVariant === "dark" ? "text-white" : "text-navy-900",
          )}
        >
          {successMessage}
        </p>
      )}
    </form>
  );
}
