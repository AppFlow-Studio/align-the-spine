"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { type FieldVariant } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadConversion } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  buildLeadFormSchema,
  type LeadFieldConfig,
  type LeadFieldType,
} from "@/lib/lead-form-schema";

export type LeadFormValues = Record<string, string>;

export type { LeadFieldConfig, LeadFieldType };
export { buildLeadFormSchema };

export interface LeadFormProps {
  heading: string;
  /** Variant key sent to /api/lead so the server re-validates against the
   * matching schema. Comes for free when spreading a leadFormVariants preset. */
  variant?: string;
  /** Field config driving both rendering and the zod validation schema. */
  fields: LeadFieldConfig[];
  submitLabel: string;
  /** Overrides the default submission (POST /api/lead + redirect to
   * /thank-you). When provided, success shows `successMessage` inline instead. */
  onSubmit?: (values: LeadFormValues) => Promise<void>;
  successMessage?: string;
  /** Field styling for dark (hero) vs light surfaces. */
  fieldVariant?: FieldVariant;
  className?: string;
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
  variant = "heroEval",
  fields,
  submitLabel,
  onSubmit,
  successMessage = "Thanks — we'll be in touch shortly.",
  fieldVariant = "dark",
  className,
}: LeadFormProps) {
  const router = useRouter();
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

    // Spam guard: a filled honeypot fakes success without submitting anything.
    if (honeypot?.value) {
      setSubmitted(true);
      reset();
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(values);
        trackLeadConversion(variant);
        setSubmitted(true);
        reset();
        return;
      }

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant, values, website: honeypot?.value ?? "" }),
      });
      if (!response.ok) {
        throw new Error(`Lead submission failed with status ${response.status}`);
      }
      trackLeadConversion(variant);
      router.push("/thank-you");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      className={cn("relative grid grid-cols-2 gap-x-4 gap-y-5", className)}
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
        const label = field.label.toUpperCase();
        if (type === "select") {
          return (
            <Select
              key={field.name}
              label={label}
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
              label={label}
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
            label={label}
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
