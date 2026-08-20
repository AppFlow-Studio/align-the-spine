import { LeadFormPopup } from "@/components/ui/lead-form-popup";
import type { LeadFormVariant } from "@/content/lead-forms";
import { leadFormVariants } from "@/content/lead-forms";

export interface MobileLeadPreviewCardProps {
  /** Card heading and the popup form's own heading — same text, so opening
   * the popup never feels like a different offer than what was tapped. */
  heading: string;
  formVariant: LeadFormVariant;
  submitLabel?: string;
  /** Short line under the heading, e.g. "Takes less than a minute." Kept
   * generic on purpose — every page uses this component, so it can't
   * reference a specific condition/city without risking a mismatch. */
  microcopy?: string;
  className?: string;
}

/** Compact, tap-to-expand mobile lead card (owner direction 2026-08-19,
 * matching a reference client's mobile CRO pattern): instead of showing
 * every form field immediately — real friction and visual weight
 * above the fold on a small screen — this shows two NON-interactive field
 * previews (First Name / Phone Number) and a CTA. The whole card is one tap
 * target (LeadFormPopup already wraps its children in a button) that opens
 * the real, fully-validated form in the same portal-based popup the site
 * already uses elsewhere (ATS-142) — no new submission path, no new
 * validation, just a lighter-weight entry point into the existing one.
 * Desktop is unaffected: callers render this only inside an `lg:hidden`
 * wrapper, keeping the full inline form on larger screens where the extra
 * fields aren't a scroll/friction cost. */
export function MobileLeadPreviewCard({
  heading,
  formVariant,
  submitLabel,
  microcopy = "Takes less than a minute — no obligation.",
  className,
}: MobileLeadPreviewCardProps) {
  const preset = leadFormVariants[formVariant];
  const ctaLabel = submitLabel ?? preset.submitLabel;

  return (
    <LeadFormPopup
      formHeading={heading}
      formVariant={formVariant}
      submitLabel={submitLabel}
      triggerClassName={`block w-full rounded-3xl bg-navy-900 p-6 text-left shadow-card transition-transform duration-200 active:scale-[0.99] ${className ?? ""}`}
    >
      <p className="font-display text-card-title !leading-[1.15] text-white">{heading}</p>
      <p className="mt-1.5 font-sans text-card-body text-mute-300">{microcopy}</p>

      {/* Decorative only — aria-hidden, no real <input>s. The entire card
       * is already one accessible button (LeadFormPopup's own trigger); a
       * screen reader doesn't need these previews narrated individually,
       * and marking them up as real form fields here would create a set of
       * unsubmittable, confusingly-named inputs that go nowhere. */}
      <div className="mt-4 flex flex-col gap-2.5" aria-hidden="true">
        <span className="flex min-h-11 items-center rounded-full border border-white/20 bg-white/5 px-5 font-sans text-card-body text-white/50">
          First Name
        </span>
        <span className="flex min-h-11 items-center rounded-full border border-white/20 bg-white/5 px-5 font-sans text-card-body text-white/50">
          Phone Number
        </span>
      </div>

      <span
        aria-hidden="true"
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-teal-500 px-6 font-sans text-button font-semibold text-white"
      >
        {ctaLabel}
      </span>
    </LeadFormPopup>
  );
}
