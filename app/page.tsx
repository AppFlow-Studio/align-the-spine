import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyChoose } from "@/components/sections/why-choose";
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
import { doctorProfileContent } from "@/content/doctor-profile";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { whyChooseContent } from "@/content/why-choose";
import { buildMetadata } from "@/lib/seo/metadata";

/** Code-split (Epic 12): interactive body-diagram selector, not needed
 * until scrolled to — kept out of the initial page JS bundle. */
const PointToWhereItHurts = dynamic(() =>
  import("@/components/sections/point-to-where-it-hurts").then((m) => m.PointToWhereItHurts),
);

export const metadata: Metadata = buildMetadata(getRoute(""));

/** / (Home) page assembly (ATS-071) per the homepage-1-col artboard:
 * HomeHero → ServiceGrid/ListRow → WhyChoose/PointToWhereItHurts (Epic 4, replaces
 * the ATS-072 SpineAnatomy quadrant section with an interactive hotspot diagram) →
 * DoctorBio → accident-injury grid → patient reviews → FAQ/CTA bands →
 * contact LeadForm → LocationIntro/LocationFooter (shared with
 * Services/About/Book — see app/book/page.tsx). */
export default function Home() {
  return (
    <>
      <PracticeJsonLd />
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
        subhead="Injured in a car accident? Full evaluation, treatment, and documentation for your PIP claim — at your home or in the office, on your schedule."
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Schedule Your Car Accident Evaluation",
          submitLabel: "Schedule My Car Accident Evaluation",
          footerNote: "Call us to check availability in your area.",
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />
      <ServicesSection />
      <WhyChoose content={whyChooseContent} />
      <AccidentInjuries />
      <PointToWhereItHurts content={pointToWhereItHurtsContent} />
      <DoctorProfile variant="short" content={doctorProfileContent} />
      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews} />
      {/* <FaqSection pageKey="home" /> */}
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
