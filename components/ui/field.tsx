"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type FieldVariant = "dark" | "light";

/** Shared control styling per condition-page-spec §A7. */
export function fieldControlClasses(variant: FieldVariant, hasError: boolean) {
  return cn(
    "w-full border-[0.5px] px-4 font-sans text-field outline-none transition-colors",
    variant === "dark"
      ? "border-gray-200 bg-overlay-white-16 text-white placeholder:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-white/70"
      : "border-mute-300 bg-white text-navy-900 placeholder:text-ink-500 focus:outline-2 focus:-outline-offset-1 focus:outline-navy-700",
    hasError && "border-error focus:outline-error",
  );
}

export interface FieldWrapperProps {
  id: string;
  label?: string;
  error?: string;
  variant: FieldVariant;
  className?: string;
  children: ReactNode;
}

export function errorId(id: string) {
  return `${id}-error`;
}

export function FieldWrapper({
  id,
  label,
  error,
  variant,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "font-sans text-field",
            variant === "dark" ? "text-white" : "text-navy-900",
          )}
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p id={errorId(id)} role="alert" className="font-sans text-field-error text-error">
          {error}
        </p>
      )}
    </div>
  );
}
