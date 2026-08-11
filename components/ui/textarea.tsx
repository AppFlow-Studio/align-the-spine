"use client";

import { useId, type ComponentPropsWithRef } from "react";

import {
  errorId,
  fieldControlClasses,
  FieldWrapper,
  type FieldVariant,
} from "@/components/ui/field";
import { cn } from "@/lib/cn";

export interface TextareaProps extends Omit<ComponentPropsWithRef<"textarea">, "className"> {
  label?: string;
  error?: string;
  variant?: FieldVariant;
  /** See fieldControlClasses' `outline` param. */
  outline?: boolean;
  className?: string;
}

export function Textarea({
  label,
  error,
  variant = "dark",
  outline = false,
  className,
  id,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldWrapper id={fieldId} label={label} error={error} variant={variant} className={className}>
      <textarea
        id={fieldId}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId(fieldId) : undefined}
        className={cn(
          "min-h-[123px] resize-y py-2",
          fieldControlClasses(variant, Boolean(error), outline),
        )}
        {...rest}
      />
    </FieldWrapper>
  );
}
