"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import {
  REVEAL_DURATION_S,
  REVEAL_EASE,
  REVEAL_OFFSET_PX,
  REVEAL_OPACITY_DURATION_RATIO,
  REVEAL_STAGGER_STEP_S,
} from "@/components/ui/fade-in";

export interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  /** Delay added between each direct StaggerItem child's reveal. Defaults
   * to REVEAL_STAGGER_STEP_S (kept subtle — this is a stagger, not a
   * sequence of separate entrances). */
  staggerStep?: number;
}

/** Wraps a set of StaggerItem siblings (e.g. a card grid, a row list) so
 * they reveal in a staggered sequence the first time the group scrolls
 * into view, instead of all at once. Orchestration is Motion's own
 * built-in `staggerChildren` — children pick up "hidden"/"visible" from
 * this parent automatically because they share the same variant names, no
 * per-child delay math needed. */
export function StaggerGroup({
  children,
  className,
  staggerStep = REVEAL_STAGGER_STEP_S,
}: StaggerGroupProps) {
  const reduceMotion = useReducedMotion();
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : staggerStep } },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  /** "span" for inline content — see FadeIn's same prop. Defaults to "div". */
  as?: "div" | "span";
  offset?: number;
  duration?: number;
}

/** One reveal step inside a StaggerGroup. Must be a direct child of
 * StaggerGroup (or nested only inside plain, non-animated wrappers) — its
 * "hidden"/"visible" variants are triggered by the group's own
 * initial/whileInView, not by this component itself. */
export function StaggerItem({
  children,
  className,
  as = "div",
  offset = REVEAL_OFFSET_PX,
  duration = REVEAL_DURATION_S,
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = as === "span" ? motion.span : motion.div;
  // Same opacity/y split as FadeIn — see its REVEAL_OPACITY_DURATION_RATIO
  // doc comment: opacity finishes early so the item is fully visible while
  // still rising into place.
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : offset },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            opacity: { duration: duration * REVEAL_OPACITY_DURATION_RATIO, ease: "easeOut" },
            y: { duration, ease: REVEAL_EASE },
          },
    },
  };

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
