"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type FieldVariant = "dark" | "light";

/** Shared control styling per condition-page-spec §A7. `outline` swaps the
 * dark variant's filled/blurred look for a transparent, rounded, bordered
 * box — the solid-navy-panel Hero variant's field style, since the filled
 * look was designed against LiquidGlass, not a flat navy background. */
export function fieldControlClasses(variant: FieldVariant, hasError: boolean, outline = false) {
  if (variant === "dark" && outline) {
    return cn(
      "w-full rounded-[10px] border border-white/40 bg-transparent px-4 font-sans text-field text-white outline-none placeholder:text-white/50 transition-colors focus:outline-2 focus:-outline-offset-1 focus:outline-white",
      hasError && "border-error focus:outline-error",
    );
  }
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
