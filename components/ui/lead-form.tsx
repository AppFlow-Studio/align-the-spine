"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export interface LeadFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface LeadFormProps {
  heading: string;
  submitLabel: string;
  onSubmit?: (values: LeadFormValues) => Promise<void>;
  className?: string;
}

const PHONE_PATTERN = /^[\d\s().+-]{7,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Inline lead-capture form hosted inside Hero (ATS-030 contract): First/Last
 * Name, Phone, Email, submit CTA, per condition-page-spec §A7 dark field
 * styling. `onSubmit` is injected so a later ATS-030 ticket can swap in real
 * submission logic (an API call) without changing this component's props. */
export function LeadForm({ heading, submitLabel, onSubmit, className }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onValid = async (values: LeadFormValues) => {
    setSubmitted(false);
    setSubmitError(null);
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      setSubmitted(true);
      setSubmitError(null);
      reset();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      className={cn("flex flex-col gap-5", className)}
    >
      <h2 className="font-sans text-button font-medium text-white">{heading}</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          variant="dark"
          error={errors.firstName?.message}
          {...register("firstName", { required: "Required" })}
        />
        <Input
          label="Last Name"
          variant="dark"
          error={errors.lastName?.message}
          {...register("lastName", { required: "Required" })}
        />
      </div>

      <Input
        label="Phone"
        type="tel"
        variant="dark"
        error={errors.phone?.message}
        {...register("phone", {
          required: "Required",
          pattern: { value: PHONE_PATTERN, message: "Enter a valid phone number" },
        })}
      />

      <Input
        label="Email"
        type="email"
        variant="dark"
        error={errors.email?.message}
        {...register("email", {
          required: "Required",
          pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
        })}
      />

      <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>

      {submitError && (
        <p role="alert" className="font-sans text-field text-error">
          {submitError}
        </p>
      )}

      {submitted && (
        <p role="status" className="font-sans text-field text-white">
          Thanks — we&apos;ll be in touch shortly.
        </p>
      )}
    </form>
  );
}
