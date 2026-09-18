import type { Citation } from "@/content/citations";
import { cn } from "@/lib/cn";

export interface CitationLinkProps {
  citation: Citation;
  className?: string;
}

/** ATS-SEO-070: reusable inline source citation — a real, crawlable `<a>`
 * (not a JS-only tooltip or icon) so search engines and users both see the
 * primary source right next to the claim it supports, per this ticket's
 * "citations must be visible" / "links must be crawlable" rules. No
 * `nofollow`: these link to primary authoritative sources (government
 * statute, recognized medical/government literature), not user content or
 * competitor pages. */
export function CitationLink({ citation, className }: CitationLinkProps) {
  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${citation.sourceTitle} — ${citation.sourceOrg}`}
      className={cn(
        "underline decoration-dotted underline-offset-2 hover:decoration-solid",
        className,
      )}
    >
      {citation.label}
    </a>
  );
}
