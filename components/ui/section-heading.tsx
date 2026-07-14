import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

export interface SectionHeadingProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  /** Heading element, defaults to h2. */
  as?: ElementType;
  /** Optional sub copy rendered below the heading. */
  sub?: ReactNode;
  /** Navy shade per section background (§A3: #2b3565 or #253067). */
  tone?: "navy-800" | "navy-900";
  children: ReactNode;
}

/** Eyebrow + display heading (Newsreader Medium 65/68) + optional sub. */
export function SectionHeading({
  eyebrow,
  as: Tag = "h2",
  sub,
  tone = "navy-800",
  className,
  children,
  ...rest
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)} {...rest}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          "font-display text-display",
          tone === "navy-800" ? "text-navy-800" : "text-navy-900",
        )}
      >
        {children}
      </Tag>
      {sub && <div className="font-sans text-body-lg text-ink-500">{sub}</div>}
    </div>
  );
}
