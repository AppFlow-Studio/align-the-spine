"use client";

import { useState, type BaseSyntheticEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Input } from "@/components/ui/input";
import type { LeadFormValues } from "@/components/ui/lead-form";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Select } from "@/components/ui/select";
import { leadFormVariants } from "@/content/lead-forms";
import { trackLeadConversion } from "@/lib/analytics";
import { buildLeadFormSchema } from "@/lib/lead-form-schema";

const config = leadFormVariants.booking;
const STEP_ONE_FIELDS = ["firstName", "phone"] as const;

function SquareButton({
  children,
  ...rest
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="relative flex h-12 w-full items-center justify-center bg-navy-900 px-8 font-sans text-button text-white transition-colors hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-70"
      {...rest}
    >
      {children}
      <ArrowRightIcon className="absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2" />
    </button>
  );
}

/** Two-step booking form per the Book-appt artboard (ATS-100): step 1 asks
 * first name + phone ("Continue"), step 2 the remaining fields ("Schedule My
 * Evaluation"). Submits through the ATS-031 pipeline (/api/lead → /thank-you)
 * with the "booking" variant re-validated server-side. */
export function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(config.fields)) as Resolver<LeadFormValues>,
    defaultValues: Object.fromEntries(config.fields.map((field) => [field.name, ""])),
  });

  const visibleFields =
    step === 1
      ? config.fields.filter((field) => (STEP_ONE_FIELDS as readonly string[]).includes(field.name))
      : config.fields;

  const onContinue = async () => {
    if (await trigger([...STEP_ONE_FIELDS])) setStep(2);
  };

  const onValid = async (values: LeadFormValues, event?: BaseSyntheticEvent) => {
    setSubmitError(null);
    const honeypot = (event?.target as HTMLFormElement | undefined)?.elements.namedItem(
      "website",
    ) as HTMLInputElement | null;

    // Spam guard: a filled honeypot routes nowhere and submits nothing.
    if (honeypot?.value) {
      reset();
      return;
    }

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant: config.variant, values, website: "" }),
      });
      if (!response.ok) {
        throw new Error(`Lead submission failed with status ${response.status}`);
      }
      trackLeadConversion(config.variant);
      router.push("/thank-you");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <LiquidGlass radius="rounded-none" className="shadow-card">
      <form
        onSubmit={handleSubmit(onValid)}
        noValidate
        className="relative flex flex-col gap-4 p-6 sm:p-12"
      >
        <h2 className="font-sans text-calc-heading text-white">Request an appointment</h2>

        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
          <label htmlFor="booking-form-website">Website</label>
          <input
            id="booking-form-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {visibleFields.map((field) => {
          const label = field.label.toUpperCase();
          const error = errors[field.name]?.message;
          if (field.type === "select") {
            return (
              <Select
                key={field.name}
                label={label}
                variant="dark"
                options={field.options ?? []}
                placeholder={field.placeholder}
                error={error}
                {...register(field.name)}
              />
            );
          }
          return (
            <Input
              key={field.name}
              label={label}
              type={field.type === "tel" ? "tel" : "text"}
              variant="dark"
              autoComplete={field.autoComplete}
              error={error}
              {...register(field.name)}
            />
          );
        })}

        <div className="mt-2 flex flex-col gap-2">
          {step === 1 ? (
            <SquareButton type="button" onClick={onContinue}>
              Continue
            </SquareButton>
          ) : (
            <SquareButton
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
            >
              {isSubmitting ? "Sending…" : config.submitLabel}
            </SquareButton>
          )}
          <p className="text-center font-sans text-field-error font-light text-white">
            Step {step} of 2
          </p>
        </div>

        {submitError && (
          <p role="alert" className="font-sans text-field text-error">
            {submitError}
          </p>
        )}
      </form>
    </LiquidGlass>
  );
}
