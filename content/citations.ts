/** ATS-SEO-070: shared registry of primary-source citations for material
 * PIP/medical claims. Each claim is defined once here and referenced by key
 * from page content (see content/conditions/auto-accident.ts,
 * content/whiplash-page.ts) instead of being hand-typed as unlinked prose in
 * every page that states it — a correction or link rot only needs a single
 * edit. Only add entries backed by a primary authoritative source (official
 * government/statute text, or recognized medical/government literature) —
 * never a competitor page, per this ticket's rules. */
export interface Citation {
  /** Stable key, matching this citation's key in the CITATIONS registry. */
  id: string;
  /** Short visible text rendered as the link itself, e.g. "Fla. Stat. § 627.736". */
  label: string;
  /** Full name of the cited source/document, shown in the link's tooltip. */
  sourceTitle: string;
  /** Publishing organization, e.g. "Florida Legislature". */
  sourceOrg: string;
  /** Direct URL to the primary source. */
  url: string;
  /** ISO date this source was last confirmed to say what it's cited for. */
  accessedDate: string;
}

export const CITATIONS = {
  floridaPip14Day: {
    id: "floridaPip14Day",
    label: "Fla. Stat. § 627.736",
    sourceTitle:
      "Florida Statutes § 627.736 — Required motor vehicle insurance; personal injury protection",
    sourceOrg: "Florida Legislature",
    url: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.736.html",
    accessedDate: "2026-09-09",
  },
} as const satisfies Record<string, Citation>;
