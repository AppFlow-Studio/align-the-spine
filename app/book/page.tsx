import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { BookingForm } from "@/components/sections/booking-form";
import { Hero } from "@/components/sections/hero";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { bookFaqs } from "@/content/faqs";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/book"));

/** /book page assembly (ATS-100) per the Book-appt artboard (96:22): dark
 * booking hero with the two-step BookingForm, LocationIntro + LocationFooter
 * (shared with Home/Services/About), centered "Quick answers" FAQ, and the
 * standard navy footer via RootShell. */
export default function BookPage() {
  return (
    <>
      <Hero
        variant="condition"
        background={{
          src: "/figma-exports/phone-mockup.png",
          alt: "Patient calling Align the Spine to book an appointment",
        }}
        title="Book a Chiropractic Appointment"
        subhead="Same-day visits, in-office or in-home when it applies. Tell us what's going on and we'll take it from there."
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        bilingualNote="¿Habla español? Dr. Abe habla su idioma."
        formSlot={<BookingForm />}
      />

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
