import type { Metadata } from "next";
import Link from "next/link";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { BookingForm } from "@/components/sections/booking-form";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { bookFaqs } from "@/content/faqs";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/book-an-appointment"));

/** /book page assembly (ATS-100) per the Book-appt artboard (96:22): dark
 * booking hero with the two-step BookingForm, LocationIntro + LocationFooter
 * (shared with Home/Services/About), centered "Quick answers" FAQ, and the
 * standard navy footer via RootShell. */
export default function BookPage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Book an Appointment", path: "/book-an-appointment" },
        ]}
        eyebrow="Ready to schedule your evaluation?"
        background={{
          src: "/figma-exports/phone-mockup.png",
          alt: "Patient calling Align the Spine to book an appointment",
        }}
        title="Request a Chiropractic Appointment"
        subhead="Request an appointment with Dr. Abe in Deerfield Beach, or ask whether a home visit fits your case and location."
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        formSlot={<BookingForm />}
        bilingualNote="¿Habla español? Dr. Abe habla su idioma."
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />

      {/* ATS-SEO-061: no outbound link to /services or
       * /car-accident-chiropractor anywhere in this page's own body
       * content — same gap ATS-SEO-041 already found and fixed on other
       * pages. */}
      <Section spacing="sm">
        <Container className="flex flex-wrap justify-center gap-8 text-center font-sans text-card-body">
          <Link href="/services" className="text-navy-900 underline underline-offset-4">
            Explore our services
          </Link>
          <Link
            href="/car-accident-chiropractor"
            className="text-navy-900 underline underline-offset-4"
          >
            Car accident care with Dr. Abe
          </Link>
        </Container>
      </Section>

      <LocationIntro />
      <LocationFooter />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Before you call" className="items-center text-center">
            Quick answers
          </SectionHeading>
          <FaqAccordion items={bookFaqs} />
          <FaqJsonLd items={bookFaqs} />
        </div>
      </Section>
    </>
  );
}
