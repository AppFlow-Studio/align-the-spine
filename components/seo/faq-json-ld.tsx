import { JsonLd } from "@/components/seo/json-ld";
import type { FAQ } from "@/content/faqs";
import { buildFAQPage } from "@/lib/schema";

export interface FaqJsonLdProps {
  items: FAQ[];
}

/** FAQPage JSON-LD for a set of visible on-page FAQs (ATS-131). Render this
 * alongside the FaqAccordion showing the same `items`, per Google's
 * requirement that FAQPage data match visible content. */
export function FaqJsonLd({ items }: FaqJsonLdProps) {
  return <JsonLd data={buildFAQPage(items)} />;
}
