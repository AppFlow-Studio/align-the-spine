import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const spacings = {
  none: "",
  sm: "py-10 md:py-14",
  md: "py-14 md:py-20",
  lg: "py-20 md:py-28",
} as const;

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element, defaults to section. */
  as?: ElementType;
  spacing?: keyof typeof spacings;
}

/** Vertical-rhythm wrapper for page sections. */
export function Section({ as: Tag = "section", spacing = "md", className, ...rest }: SectionProps) {
  return <Tag className={cn(spacings[spacing], className)} {...rest} />;
}
