import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServiceCatalog } from "@/components/sections/service-catalog";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/services"));

/** /services page assembly (ATS-081) per the services artboard (frame
 * 96:2185 — the ticket's node ref 1:2583 no longer resolves in the file):
 * Hero (reusing the artboard's actual car-accident-themed copy/form, not
 * the ticket's "Comprehensive care" line, which belongs to the About page's
 * Hero) → ServiceCatalog intro+grid (the ticket's "Comprehensive care,
 * tailored to you" line lives here as the section heading) → DoctorBio →
 * PatientReviews ("Patient Success" band, same placeholder copy as the
 * artboard's Group 10) → LocationIntro/LocationFooter (shared with
 * Home/About/Book) → contact LeadForm, which sits below Hours of Operation
 * per the artboard. */
export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Services", path: "/services" },
        ]}
      />
      <Hero
        variant="home"
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "Dr. Abe Nasser treating a patient's neck",
        }}
        eyebrow="Every treatment built around your accident"
        title="Chiropractic Services in Deerfield Beach, FL"
        subhead="From routine adjustments to specialized recovery care — same doctor, every visit, at the office or your home when it applies."
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Schedule Your Car Accident Evaluation",
          submitLabel: leadFormVariants.carAccident.submitLabel,
          variant: leadFormVariants.carAccident.variant,
          fields: leadFormVariants.carAccident.fields,
          footerNote:
            "Serving Deerfield Beach, Boca Raton, Fort Lauderdale, and surrounding South Florida communities.",
        }}
      />
      <ServiceCatalog />
      <DoctorProfile variant="short" content={doctorProfileContent} />
      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews} />
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
