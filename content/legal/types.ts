/** Shared shape for legal pages (ATS-120) — /privacy-policy today, other
 * legal pages (terms, etc.) can reuse the same OnThisPageNav + LegalContent
 * components against their own section list. */
export interface LegalSection {
  /** Anchor id, also the OnThisPageNav href target. */
  id: string;
  /** Label shown in OnThisPageNav — usually matches `heading`, but kept
   * separate since the artboard's HIPAA nav label differs from its section heading. */
  navLabel: string;
  heading: string;
  /** One or more paragraphs, rendered as separate <p> tags per the artboard
   * (each section's copy is visually split into distinct paragraphs, not
   * one run-on block). */
  body: string[];
}
