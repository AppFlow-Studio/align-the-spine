import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Frosted "liquid glass" surface: a translucent card whose edges catch a
 * bright highlight (inset box-shadow) over a lightly brightened + blurred
 * backdrop, so the photo behind it reads *through* the glass rather than
 * sitting behind a flat frosted panel. Replaces the old `bg-overlay-white-15`
 * + `backdrop-blur-md` treatment on the hero lead form.
 *
 * The card corners are set once via `radius` and shared by every layer so the
 * highlight, border and clip all round together. Note we deliberately drop the
 * displacement (feTurbulence/feDisplacementMap) filter from the original
 * reference markup — at usable scales it warps the form fields into
 * illegibility; the brightness + edge highlight carry the glass read on their
 * own. */
export function LiquidGlass({
  children,
  className,
  radius = "rounded-3xl",
  id,
}: {
  children: ReactNode;
  className?: string;
  /** Tailwind rounding utility applied to the card and every glass layer. */
  radius?: string;
  id?: string;
}) {
  const glassBody: CSSProperties = {
    filter: "drop-shadow(-8px -10px 46px #0000005f)",
    backdropFilter: "brightness(1.1) blur(2px)",
    WebkitBackdropFilter: "brightness(1.1) blur(2px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };
  const edgeHighlight: CSSProperties = {
    boxShadow:
      "inset 6px 6px 0px -6px rgba(255, 255, 255, 0.7), inset 0 0 8px 1px rgba(255, 255, 255, 0.7)",
  };

  return (
    <div id={id} className={cn("relative overflow-hidden", radius, className)}>
      <div className={cn("absolute inset-0", radius)} style={glassBody}>
        <div className={cn("absolute inset-0", radius)} style={edgeHighlight} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
