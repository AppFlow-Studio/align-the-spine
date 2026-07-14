"use client";

import { Input, type InputProps } from "@/components/ui/input";

export type DateFieldProps = Omit<InputProps, "type" | "inputMode">;

/** mm/dd/yyyy text field (PIP calculator). Plain text input so the
 * placeholder is always visible, unlike native date inputs. */
export function DateField({ placeholder = "mm/dd/yyyy", ...rest }: DateFieldProps) {
  return <Input inputMode="numeric" placeholder={placeholder} {...rest} />;
}
