import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { HREFLANG } from "@/content/i18n";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptBookingPage } from "@/content/pt/pages";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/solicitar-consulta");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/solicitar-consulta — Brazilian Portuguese counterpart of
 * /book-an-appointment and /es/solicitar-cita (ATS-SEO-135).
 *
 * Same "Solicitar" discipline as the CTA everywhere else on this page: the
 * subhead, the footer note and the "Como funciona" steps all say plainly
 * that submitting sends a request and the office calls back — the same
 * non-promise the English CTA was deliberately reworded off "Book" for
 * (ATS-E3 3.4), which the Portuguese page must not undo.
 */
export default function PtBookingPage() {
  return (
    <>
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.pt,
        })}
      />
      <HeroSolidPanel
        locale="pt"
        breadcrumbs={[
          { name: "Início", path: "/pt" },
          { name: ptBookingPage.breadcrumb, path: route.path },
        ]}
        eyebrow={ptBookingPage.hero.eyebrow}
        background={{
          src: "/figma-exports/phone-mockup.png",
          alt: "Paciente ligando para a Align the Spine para solicitar uma consulta",
        }}
        title={ptBookingPage.hero.h1}
        subhead={ptBookingPage.hero.subhead}
        callPill={{
          eyebrow: "Vamos conversar hoje",
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
        form={{
          heading: ptBookingPage.hero.formHeading,
          submitLabel: ptLeadFormVariants.booking.submitLabel,
          variant: ptLeadFormVariants.booking.variant,
          fields: ptLeadFormVariants.booking.fields,
          footerNote: ptBookingPage.hero.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />

      <Section spacing="lg">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow={ptBookingPage.whatHappensNext.eyebrow}>
            {ptBookingPage.whatHappensNext.heading}
          </SectionHeading>
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {ptBookingPage.whatHappensNext.steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-teal-500 font-sans text-button text-white"
                >
                  {index + 1}
                </span>
                <h3 className="font-display text-card-title text-navy-800">{step.title}</h3>
                <p className="font-sans text-card-body text-ink-900">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <LocationIntro locale="pt" />
      <LocationFooter locale="pt" />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow={ptBookingPage.faqEyebrow} className="items-center text-center">
            {ptBookingPage.faqHeading}
          </SectionHeading>
          <FaqAccordion items={ptBookingPage.faq} />
          <FaqJsonLd items={ptBookingPage.faq} />
        </div>
      </Section>
    </>
  );
}
