import { JsonLdScript } from "@/components/seo/json-ld-script";
import type { FAQ } from "@/content/faqs";

export interface FaqJsonLdProps {
  items: FAQ[];
}

/** FAQPage JSON-LD for a set of visible on-page FAQs (ATS-131). Render this
 * alongside the FaqAccordion showing the same `items`, per Google's
 * requirement that FAQPage data match visible content. */
export function FaqJsonLd({ items }: FaqJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}
