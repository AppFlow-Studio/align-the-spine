import type { LegalSection } from "@/content/legal/types";

export interface LegalContentProps {
  sections: LegalSection[];
}

/** Sectioned legal body (ATS-120): heading + copy per section, divided by
 * hairlines. `scroll-mt` offsets the anchor target below the fixed Navbar so
 * OnThisPageNav's jump links (and the scrollspy `rootMargin`) land correctly. */
export function LegalContent({ sections }: LegalContentProps) {
  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-[120px] border-t border-mute-300 py-10 first:border-t-0 first:pt-0"
        >
          <h2 className="font-display text-h2 text-navy-800">{section.heading}</h2>
          <p className="mt-4 break-words font-sans text-body-lg text-ink-500">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
