import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { InfoIcon } from "@/components/ui/icons/info";
import type { ContentFaqItem } from "@/lib/content/types";

/** Article-body FAQ block: a visually distinct teal-bordered card (icon
 * badge + "FAQs" eyebrow) around the existing single-open FaqAccordion, so
 * this reads as its own section rather than blending into the surrounding
 * prose — plus the matching FAQPage JSON-LD (ATS-131 pattern), derived from
 * the same `faqs` shown on screen. Omitted entirely when the article has no
 * FAQs yet rather than rendering an empty shell. */
export function ArticleFaqSection({ faqs }: { faqs: ContentFaqItem[] }) {
  if (!faqs.length) return null;
  return (
    <section
      aria-labelledby="article-faq-heading"
      className="mt-14 rounded-30 border-2 border-teal-500/25 bg-[#eff8f7] p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white"
        >
          <InfoIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-500">FAQs</p>
          <h2 id="article-faq-heading" className="font-display text-2xl text-navy-800 sm:text-3xl">
            Frequently asked questions
          </h2>
        </div>
      </div>
      <div className="mt-6">
        <FaqAccordion items={faqs} />
      </div>
      <FaqJsonLd items={faqs} />
    </section>
  );
}
