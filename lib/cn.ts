import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** tailwind-merge's default config only recognizes Tailwind's *built-in*
 * font-size scale (xs/sm/base/lg/.../9xl) as the "font-size" class group —
 * anything else shaped like `text-{word}` (no brackets, no known color
 * shade) falls back into its generic "text-color" bucket instead. That
 * silently broke every custom fontSize token in tailwind.config.ts
 * (text-hero, text-h2, text-body-lg, etc.) the moment it appeared in the
 * same cn() call as a text-color class — e.g. `cn("font-display text-hero
 * text-white", ...)` collapsed to `"font-display text-white"`, dropping
 * the Hero H1's font-size/line-height/weight entirely. Listing every
 * custom key here as an explicit "font-size" group member fixes that:
 * twMerge now matches them before falling through to the color bucket, so
 * they conflict correctly with *other* font sizes and not with colors.
 * Keep this list in sync with tailwind.config.ts's `fontSize` keys. */
const CUSTOM_FONT_SIZE_KEYS = [
  "hero",
  "display",
  "h2",
  "eyebrow",
  "body-lg",
  "button",
  "nav",
  "faq-q",
  "faq-a",
  "faq-toggle",
  "alt-label",
  "stat-label",
  "stat-value",
  "btn-lg",
  "btn-eyebrow",
  "field",
  "calc-heading",
  "calc-helper",
  "field-error",
  "footer-tagline",
  "footer-heading",
  "footer-copy",
  "card-title",
  "card-body",
  "doctor-name",
  "understanding-intro",
  "type-name",
  "redflag-bullet",
  "selected-label",
  "panel-body",
  "small-print",
];

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: CUSTOM_FONT_SIZE_KEYS }] } },
});

/** Same call signature as before (strings/booleans/null/undefined), now a
 * superset via clsx's ClassValue (arrays, objects also accepted) — merged
 * through tailwind-merge so later conflicting Tailwind classes win instead
 * of both landing in the className string. Upgraded so shadcn/Aceternity
 * UI registry components — which assume this exact cn(...) behavior via
 * @/lib/utils — work unmodified when pasted in; every existing call site
 * here keeps working since only string/boolean/null/undefined args were
 * ever passed. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
