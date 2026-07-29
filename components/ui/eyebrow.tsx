import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element, defaults to p. */
  as?: ElementType;
  /** "onDark" swaps to the lighter teal-300 tint (ATS-134) — teal-500 only
   * clears WCAG AA against light surfaces (~2.4:1 against navy-900). Use
   * this whenever the eyebrow sits on a navy/dark background, e.g.
   * AccidentBanner's navy-900 panel or Hero's dark background image. */
  variant?: "default" | "onDark";
}

/** Uppercase section label per condition-page-spec §A3:
 * Poppins Medium 25, tracking 1.25, teal. */
export function Eyebrow({ as: Tag = "p", variant = "default", className, ...rest }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "font-sans text-eyebrow uppercase",
        variant === "onDark" ? "text-teal-300" : "text-teal-500",
        className,
      )}
      {...rest}
    />
  );
}
