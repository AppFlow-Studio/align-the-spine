"use client";

import { useId, type ComponentPropsWithRef } from "react";

import {
  errorId,
  fieldControlClasses,
  FieldWrapper,
  type FieldVariant,
} from "@/components/ui/field";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { cn } from "@/lib/cn";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<ComponentPropsWithRef<"select">, "className"> {
  label?: string;
  error?: string;
  variant?: FieldVariant;
  /** See fieldControlClasses' `outline` param. */
  outline?: boolean;
  options: SelectOption[];
  /** Rendered as a disabled empty-value first option. */
  placeholder?: string;
  className?: string;
}

export function Select({
  label,
  error,
  variant = "dark",
  outline = false,
  options,
  placeholder,
  className,
  id,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldWrapper id={fieldId} label={label} error={error} variant={variant} className={className}>
      <span className="relative">
        <select
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId(fieldId) : undefined}
          defaultValue={placeholder && rest.value === undefined ? "" : undefined}
          className={cn(
            outline ? "h-[52px]" : "h-[41px]",
            "appearance-none pr-10",
            variant === "dark" && "[&>option]:text-ink-900",
            fieldControlClasses(variant, Boolean(error), outline),
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2",
            variant === "dark" ? "text-white" : "text-navy-900",
          )}
        />
      </span>
    </FieldWrapper>
  );
}
