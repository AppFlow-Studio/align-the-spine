import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element, defaults to p. */
  as?: ElementType;
}

/** Uppercase section label per condition-page-spec §A3:
 * Poppins Medium 25, tracking 1.25, teal. */
export function Eyebrow({ as: Tag = "p", className, ...rest }: EyebrowProps) {
  return (
    <Tag className={cn("font-sans text-eyebrow uppercase text-teal-500", className)} {...rest} />
  );
}
