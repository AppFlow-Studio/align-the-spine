import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { Hero } from "@/components/sections/hero";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htContactPage } from "@/content/ht/pages";
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/kontakte-nou");

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht/kontakte-nou — Haitian Creole counterpart of /contact-us and
 * /pt/contato (ATS-SEO-136). Emits PracticeJsonLd for the same reason the
 * other language contact pages do: this is the page whose visible content
 * is the practice's name, address and phone. NAP renders straight from
 * siteConfig, untranslated and unreformatted.
 */
export default function HtContactPage() {
  return (
    <>
      <PracticeJsonLd />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.ht,
        })}
      />
      <div id="contact-hero-form">
        <Hero
          locale="ht"
          breadcrumbs={[
            { name: "Paj Prensipal", path: "/ht" },
            { name: htContactPage.breadcrumb, path: route.path },
          ]}
          variant="condition"
          background={{
            src: "/figma-exports/interior-reception.png",
            alt: "Resepsyon Align the Spine nan Deerfield Beach",
          }}
          eyebrow={htContactPage.hero.eyebrow}
          title={htContactPage.hero.h1}
          subhead={htContactPage.hero.subhead}
          callPill={{ eyebrow: "Ann pale jodi a", phone: `Rele ${siteConfig.business.phone}` }}
          form={{
            heading: htContactPage.hero.formHeading,
            submitLabel: htLeadFormVariants.contactUs.submitLabel,
            variant: htLeadFormVariants.contactUs.variant,
            fields: htLeadFormVariants.contactUs.fields,
          }}
        />
      </div>

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />

      <LocationIntro locale="ht" sendHref="#contact-hero-form" />
      <LocationFooter locale="ht" />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow={htContactPage.faqEyebrow} className="items-center text-center">
            {htContactPage.faqHeading}
          </SectionHeading>
          <FaqAccordion items={htContactPage.faq} />
          <FaqJsonLd items={htContactPage.faq} />
        </div>
      </Section>
    </>
  );
}
