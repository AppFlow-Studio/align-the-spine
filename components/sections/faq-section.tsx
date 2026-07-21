import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqsByPage } from "@/content/faqs";

export interface FaqSectionProps {
  pageKey: keyof typeof faqsByPage;
}

/** FAQ section per condition-page-spec §B11/§C: eyebrow + centered heading +
 * FaqAccordion, fed by a per-page faqsByPage entry, with an inline FAQPage
 * JSON-LD script derived from the same items shown on screen. */
export function FaqSection({ pageKey }: FaqSectionProps) {
  const { tail, items } = faqsByPage[pageKey];

  const jsonLd = {
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
  };

  return (
    <Section>
      <SectionHeading
        eyebrow="Frequently asked questions"
        className="mx-auto max-w-2xl items-center text-center"
      >
        Everything you need to know about {tail}
      </SectionHeading>
      <FaqAccordion items={items} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </Section>
  );
}
