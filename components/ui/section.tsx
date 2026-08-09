"use client";

import type { ElementType, HTMLAttributes } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  buildRevealTransition,
  REVEAL_DURATION_S,
  REVEAL_OFFSET_PX,
} from "@/components/ui/fade-in";
import { cn } from "@/lib/cn";

const spacings = {
  none: "",
  sm: "py-10 md:py-14",
  md: "py-14 md:py-20",
  lg: "py-20 md:py-28",
} as const;

/** Pre-built at module scope (not derived from the `as` prop via
 * motion.create() during render — that would create a new component type
 * on every render). `as` is never actually overridden anywhere in this
 * codebase — it defaults to, and always renders, "section" — so covering
 * that plus "div" as a reasonable fallback is enough; anything else quietly
 * skips the reveal animation (still renders correctly via the plain `Tag`
 * branch below) rather than crashing. */
const MOTION_TAGS = {
  section: motion.section,
  div: motion.div,
} as const;

/** Drag/animation event props whose React DOM signature collides with
 * Motion's own (differently-typed) callbacks of the same name — Section
 * only ever forwards these to a possibly-animated element, so it excludes
 * them rather than fighting the type conflict. None of this codebase's
 * ~25 Section call sites pass any of them. */
type NonMotionConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, NonMotionConflictingProps> {
  /** Rendered element, defaults to section. */
  as?: ElementType;
  spacing?: keyof typeof spacings;
  /** Every Section reveals itself (fade + rise) the first time it scrolls
   * into view — the site's default, consistent scroll animation. Pass
   * `false` for a section that either sits above the fold (nothing to
   * "scroll into") or already orchestrates its own, more granular reveal
   * internally (e.g. ServicesSection's heading-then-staggered-rows
   * treatment) — stacking this section-level reveal on top of an inner
   * one would double the motion. */
  reveal?: boolean;
}

/** Vertical-rhythm wrapper for page sections. Reveals on scroll by default
 * (see `reveal` above) using the same timing every other reveal primitive
 * on the site shares (components/ui/fade-in.tsx) — respects
 * prefers-reduced-motion, animates only opacity/transform (no layout
 * recalculation), and only ever plays once per section. */
export function Section({
  as: Tag = "section",
  spacing = "md",
  reveal = true,
  className,
  ...rest
}: SectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const MotionTag =
    typeof Tag === "string" ? MOTION_TAGS[Tag as keyof typeof MOTION_TAGS] : undefined;

  if (!reveal || !MotionTag) {
    return <Tag className={cn(spacings[spacing], className)} {...rest} />;
  }

  return (
    <MotionTag
      className={cn(spacings[spacing], className)}
      initial={{ opacity: 0, y: reduceMotion ? 0 : REVEAL_OFFSET_PX }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={buildRevealTransition(REVEAL_DURATION_S, 0, reduceMotion)}
      {...rest}
    />
  );
}
