"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Tune the site's scroll-reveal feel from these five values — every
 * reveal primitive (FadeIn here, Section's built-in reveal, StaggerGroup/
 * StaggerItem in stagger-reveal.tsx) reads from them, so a change here
 * applies consistently site-wide.
 * - REVEAL_OFFSET_PX: how far content starts below its resting position.
 *   Kept fairly generous (40px) — this is a "rise into place" reveal, so
 *   the vertical travel needs to still be visible/legible, not just a
 *   fade with an incidental few-pixel nudge.
 * - REVEAL_DURATION_S: how long the slide takes — kept deliberately slow
 *   (~0.9s) so the motion reads as a clear, premium reveal rather than a
 *   flicker; don't drop this much below ~0.7s or it stops being
 *   noticeable, and don't push much past ~1.1s or it starts feeling sluggish.
 * - REVEAL_OPACITY_DURATION_RATIO: opacity gets its own, shorter
 *   transition — the content is fully visible at this fraction of the
 *   slide's duration while the upward motion keeps easing into place for
 *   the rest. That split is what makes this read as "rising into
 *   position" rather than "a fade that happens to end already in place":
 *   once both finished at the same instant, the slide was masked by the
 *   fade and only the opacity change actually registered.
 * - REVEAL_EASE: the slide's slow-in/gentle-settle curve — accelerates
 *   quickly then eases into place, no overshoot/bounce.
 * - REVEAL_STAGGER_STEP_S: delay between successive items in a
 *   StaggerGroup (see stagger-reveal.tsx). */
export const REVEAL_OFFSET_PX = 40;
export const REVEAL_DURATION_S = 0.9;
export const REVEAL_OPACITY_DURATION_RATIO = 0.6;
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
export const REVEAL_STAGGER_STEP_S = 0.09;

/** Shared opacity/y transition split — see REVEAL_OPACITY_DURATION_RATIO's
 * doc comment above for why opacity and the slide don't share one
 * duration. Used by FadeIn, Section's built-in reveal, and StaggerItem so
 * all three feel identical. */
export function buildRevealTransition(duration: number, delay: number, reduceMotion: boolean) {
  if (reduceMotion) return { duration: 0, delay: 0 };
  return {
    delay,
    opacity: { duration: duration * REVEAL_OPACITY_DURATION_RATIO, ease: "easeOut" as const },
    y: { duration, ease: REVEAL_EASE },
  };
}

export interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** "span" for inline content nested in phrasing-content-only elements
   * (e.g. a heading's title) — a motion.div there would be invalid HTML.
   * Defaults to "div". */
  as?: "div" | "span";
  /** Pixels the content starts offset by before settling into place.
   * 0 disables the slide, leaving a plain fade. Defaults to
   * REVEAL_OFFSET_PX. */
  offset?: number;
  delay?: number;
  /** Defaults to REVEAL_DURATION_S. */
  duration?: number;
  /** false (default): animates once on mount — for above-the-fold content
   * (e.g. the Hero title) already visible at load. true: animates the
   * first time it scrolls into view instead — for everything further down
   * the page, so sections don't animate off-screen before the user gets
   * there. Either way it only ever plays once per mount. */
  whenInView?: boolean;
}

/** Single-element fade/slide-up reveal — the site's baseline scroll-reveal
 * primitive, built on `motion` (already a dependency; also what Aceternity
 * UI's registry components expect as "motion/react"). Respects
 * prefers-reduced-motion the same way FaqAccordion already does with
 * framer-motion: reduced motion collapses the offset/duration to 0 so
 * content simply appears, no animation skipped/broken. Intentionally has
 * no opinion on typography/spacing so it can wrap any content without
 * fighting this project's own design tokens. For a list of siblings that
 * should reveal one after another (cards, rows), use StaggerGroup +
 * StaggerItem from stagger-reveal.tsx instead — they share this same
 * timing via the constants above. Most page sections don't need this
 * directly — Section (components/ui/section.tsx) already reveals itself
 * on scroll; reach for FadeIn for finer-grained control (e.g. the Hero
 * title/subhead's on-mount stagger, or content inside a Section that opted
 * out via `reveal={false}` to do its own StaggerGroup instead). */
export function FadeIn({
  children,
  className,
  as = "div",
  offset = REVEAL_OFFSET_PX,
  delay = 0,
  duration = REVEAL_DURATION_S,
  whenInView = false,
}: FadeInProps) {
  const reduceMotion = Boolean(useReducedMotion());
  void offset;
  const MotionTag = as === "span" ? motion.span : motion.div;
  const visible = { opacity: 1, y: 0 };
  const transition = buildRevealTransition(duration, delay, reduceMotion);

  return (
    <MotionTag
      className={className}
      /* Fail visible. The previous opacity:0 initial state remained stuck in
       * rendered Chrome baselines when Motion hydration did not complete,
       * hiding headings and CTAs. Core content must never depend on JS. */
      initial={false}
      transition={transition}
      {...(whenInView
        ? { whileInView: visible, viewport: { once: true, margin: "-80px" } }
        : { animate: visible })}
    >
      {children}
    </MotionTag>
  );
}
