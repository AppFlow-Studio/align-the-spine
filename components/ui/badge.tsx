import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const variants = {
  /* SELECTED chip: navy fill, white text */
  selected: "bg-navy-900 text-white",
  /* VERIFIED GOOGLE REVIEW chip: soft panel fill, muted text */
  verified: "bg-panel-100 text-mute-400",
  /* Generic tag chip: hairline outline, ink text */
  tag: "border border-mute-300 text-ink-500",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

/** Chip per condition-page-spec §A5: SELECTED, VERIFIED GOOGLE REVIEW, tags. */
export function Badge({ variant = "tag", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-1 font-sans text-stat-label uppercase",
        variants[variant],
        className,
      )}
      {...rest}
    />
  );
}
