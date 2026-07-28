import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServicesSection } from "@/components/sections/services-section";
import { SpineAnatomy } from "@/components/sections/spine-anatomy";
import { WhyChoose } from "@/components/sections/why-choose";
import { doctorProfileContent } from "@/content/doctor-profile";
import { siteConfig } from "@/content/site";
import { spineAnatomyContent } from "@/content/spine-anatomy";
import { homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { whyChooseContent } from "@/content/why-choose";

export const metadata: Metadata = {
  title: `${siteConfig.business.name} | South Florida's Chiropractor`,
  description:
    "Elite spinal health care in Deerfield Beach, FL — office visits from $50, same-day car accident evaluations, and home visits when it fits your case. Call (954) 573-7192.",
};

/** / (Home) page assembly (ATS-071) per the homepage-1-col artboard:
 * HomeHero → ServiceGrid/ListRow → WhyChoose/SpineAnatomy (ATS-072) →
 * DoctorBio → accident-injury grid → patient reviews → FAQ/CTA bands →
 * contact LeadForm → LocationIntro/LocationFooter (shared with
 * Services/About/Book — see app/book/page.tsx). */
export default function Home() {
  return (
    <>
      <Hero
        variant="home"
        background={{
          src: "/figma-exports/interior-reception.png",
          alt: "Align the Spine reception area",
        }}
        title={
          <>
            Align the Spine
            <br />
            South Florida&apos;s
            <br />
            Chiropractor
          </>
        }
        subhead="At your home or in the office. We provide elite spinal health solutions tailored to your unique lifestyle and recovery goals."
        badge="Office visits are $50"
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Schedule Your Car Accident Evaluation",
          submitLabel: "Schedule My Car Accident Evaluation",
          footerNote:
            "Serving Deerfield Beach, Boca Raton, Fort Lauderdale, and surrounding South Florida communities.",
        }}
      />
      <ServicesSection />
      <WhyChoose content={whyChooseContent} />
      <AccidentInjuries />
      <SpineAnatomy content={spineAnatomyContent} />
      <DoctorProfile variant="short" content={doctorProfileContent} />
      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews} />
      {/* <FaqSection pageKey="home" /> */}
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
