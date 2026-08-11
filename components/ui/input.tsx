"use client";

import { useId, type ComponentPropsWithRef } from "react";

import {
  errorId,
  fieldControlClasses,
  FieldWrapper,
  type FieldVariant,
} from "@/components/ui/field";
import { cn } from "@/lib/cn";

export interface InputProps extends Omit<ComponentPropsWithRef<"input">, "className"> {
  label?: string;
  error?: string;
  variant?: FieldVariant;
  /** See fieldControlClasses' `outline` param. */
  outline?: boolean;
  className?: string;
}

export function Input({
  label,
  error,
  variant = "dark",
  outline = false,
  className,
  id,
  ...rest
}: InputProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldWrapper id={fieldId} label={label} error={error} variant={variant} className={className}>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId(fieldId) : undefined}
        className={cn(
          outline ? "h-[52px]" : "h-[41px] outline-1px outline-gray-200 border-gray-200",
          fieldControlClasses(variant, Boolean(error), outline),
        )}
        {...rest}
      />
    </FieldWrapper>
  );
}
