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
  className?: string;
}

export function Input({ label, error, variant = "dark", className, id, ...rest }: InputProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldWrapper id={fieldId} label={label} error={error} variant={variant} className={className}>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId(fieldId) : undefined}
        className={cn("h-[41px]", fieldControlClasses(variant, Boolean(error)))}
        {...rest}
      />
    </FieldWrapper>
  );
}
