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
import { HREFLANG } from "@/content/i18n";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptContactPage } from "@/content/pt/pages";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/contato");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/contato — Brazilian Portuguese counterpart of /contact-us and
 * /es/contacto (ATS-SEO-135). Emits PracticeJsonLd for the same reason the
 * English/Spanish contact pages do: this is the page whose visible content
 * is the practice's name, address and phone. NAP renders straight from
 * siteConfig, untranslated and unreformatted.
 */
export default function PtContactPage() {
  return (
    <>
      <PracticeJsonLd />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.pt,
        })}
      />
      <div id="contact-hero-form">
        <Hero
          locale="pt"
          breadcrumbs={[
            { name: "Início", path: "/pt" },
            { name: ptContactPage.breadcrumb, path: route.path },
          ]}
          variant="condition"
          background={{
            src: "/figma-exports/interior-reception.png",
            alt: "Recepção da Align the Spine em Deerfield Beach",
          }}
          eyebrow={ptContactPage.hero.eyebrow}
          title={ptContactPage.hero.h1}
          subhead={ptContactPage.hero.subhead}
          callPill={{
            eyebrow: "Vamos conversar hoje",
            phone: `Ligar para ${siteConfig.business.phone}`,
          }}
          form={{
            heading: ptContactPage.hero.formHeading,
            submitLabel: ptLeadFormVariants.contactUs.submitLabel,
            variant: ptLeadFormVariants.contactUs.variant,
            fields: ptLeadFormVariants.contactUs.fields,
          }}
        />
      </div>

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />

      <LocationIntro locale="pt" sendHref="#contact-hero-form" />
      <LocationFooter locale="pt" />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow={ptContactPage.faqEyebrow} className="items-center text-center">
            {ptContactPage.faqHeading}
          </SectionHeading>
          <FaqAccordion items={ptContactPage.faq} />
          <FaqJsonLd items={ptContactPage.faq} />
        </div>
      </Section>
    </>
  );
}
