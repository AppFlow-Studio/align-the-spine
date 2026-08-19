"use client";

export interface ScrollToFormButtonProps {
  /** Element ids to try in order — pass every responsive instance of the
   * target form (e.g. a desktop and a mobile card toggled by CSS) so
   * whichever one is actually visible at the current viewport gets used.
   * Picking by `offsetParent !== null` (not a media query) means this
   * still works correctly if the layout's breakpoints ever change. */
  targetIds: string[];
  triggerClassName?: string;
  children: React.ReactNode;
}

/** Scrolls to an eligibility form that's already elsewhere on the page,
 * instead of opening a second copy of it in a modal (ATS-144) — service-area
 * pages always render a real "Check eligibility" card themselves (desktop
 * panel + mobile peeking card in ServiceAreaHero), so a popup here would
 * just duplicate it. LeadFormPopup stays reserved for pages, like /blog,
 * that don't already show a form. */
export function ScrollToFormButton({
  targetIds,
  triggerClassName,
  children,
}: ScrollToFormButtonProps) {
  function handleClick() {
    const target = targetIds
      .map((id) => document.getElementById(id))
      .find((el) => el && el.offsetParent !== null);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.querySelector("input")?.focus({ preventScroll: true });
  }

  return (
    <button type="button" onClick={handleClick} className={triggerClassName}>
      {children}
    </button>
  );
}
