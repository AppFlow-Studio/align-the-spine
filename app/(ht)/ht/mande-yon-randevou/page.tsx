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
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htBookingPage } from "@/content/ht/pages";
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/mande-yon-randevou");

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht/mande-yon-randevou — Haitian Creole counterpart of
 * /book-an-appointment and /pt/solicitar-consulta (ATS-SEO-136).
 *
 * Same "Mande" discipline as the CTA everywhere else on this page: the
 * subhead, the footer note and the "Kijan sa mache" steps all say plainly
 * that submitting sends a request and the office calls back — the same
 * non-promise the English CTA was deliberately reworded off "Book" for
 * (ATS-E3 3.4), which this page must not undo.
 */
export default function HtBookingPage() {
  return (
    <>
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.ht,
        })}
      />
      <HeroSolidPanel
        locale="ht"
        breadcrumbs={[
          { name: "Paj Prensipal", path: "/ht" },
          { name: htBookingPage.breadcrumb, path: route.path },
        ]}
        eyebrow={htBookingPage.hero.eyebrow}
        background={{
          src: "/figma-exports/phone-mockup.png",
          alt: "Pasyan k ap rele Align the Spine pou mande yon randevou",
        }}
        title={htBookingPage.hero.h1}
        subhead={htBookingPage.hero.subhead}
        callPill={{ eyebrow: "Ann pale jodi a", phone: `Rele ${siteConfig.business.phone}` }}
        form={{
          heading: htBookingPage.hero.formHeading,
          submitLabel: htLeadFormVariants.booking.submitLabel,
          variant: htLeadFormVariants.booking.variant,
          fields: htLeadFormVariants.booking.fields,
          footerNote: htBookingPage.hero.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />

      <Section spacing="lg">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow={htBookingPage.whatHappensNext.eyebrow}>
            {htBookingPage.whatHappensNext.heading}
          </SectionHeading>
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {htBookingPage.whatHappensNext.steps.map((step, index) => (
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

      <LocationIntro locale="ht" />
      <LocationFooter locale="ht" />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow={htBookingPage.faqEyebrow} className="items-center text-center">
            {htBookingPage.faqHeading}
          </SectionHeading>
          <FaqAccordion items={htBookingPage.faq} />
          <FaqJsonLd items={htBookingPage.faq} />
        </div>
      </Section>
    </>
  );
}
