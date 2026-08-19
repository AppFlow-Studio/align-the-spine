import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const radii = {
  15: "rounded-15",
  20: "rounded-20",
  30: "rounded-30",
} as const;

const shadows = {
  none: "",
  card: "shadow-card",
  comparison: "shadow-comparison",
} as const;

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element, defaults to div. */
  as?: ElementType;
  radius?: keyof typeof radii;
  shadow?: keyof typeof shadows;
}

/** Surface primitive per condition-page-spec §A4: white sheet, radius 15/20/30,
 * optional card/comparison shadow tokens. */
export function Card({
  as: Tag = "div",
  radius = 20,
  shadow = "none",
  className,
  ...rest
}: CardProps) {
  return <Tag className={cn("bg-white", radii[radius], shadows[shadow], className)} {...rest} />;
}
