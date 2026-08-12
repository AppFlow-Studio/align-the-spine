import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyChoose } from "@/components/sections/why-choose";
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
import { doctorProfileContent } from "@/content/doctor-profile";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { spineOverviewContent } from "@/content/spine-overview";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { whyChooseContent } from "@/content/why-choose";
import { buildMetadata } from "@/lib/seo/metadata";

/** Code-split (Epic 12): not needed until scrolled to — kept out of the
 * initial page JS bundle. */
const SpineOverview = dynamic(() =>
  import("@/components/sections/spine-overview").then((m) => m.SpineOverview),
);

export const metadata: Metadata = buildMetadata(getRoute(""));

/** / (Home) page assembly (ATS-071) per the homepage-1-col artboard:
 * HeroSolidPanel → ServiceGrid/ListRow → WhyChoose/SpineOverview (static "Understanding
 * the spine" diagram — condition pages keep the interactive PointToWhereItHurts
 * hotspot version) → DoctorBio → accident-injury grid → patient reviews →
 * FAQ/CTA bands → contact LeadForm → LocationIntro/LocationFooter (shared with
 * Services/About/Book — see app/book/page.tsx). */
export default function Home() {
  return (
    <>
      <PracticeJsonLd />
      <HeroSolidPanel
        background={{
          src: "/figma-exports/interior-reception.png",
          alt: "Align the Spine reception area",
        }}
        title={
          <>
            Align the Spine
            <br />
            Deerfield Beach
            <br />
            Chiropractor
          </>
        }
        badge="Office Visits are $50"
        bilingualNote="¿Habla español? Dr. Abe habla su idioma."
        subhead="Chiropractic care in Deerfield Beach for back pain, neck pain, mobility concerns, and injuries — with focused evaluations after car accidents."
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Schedule Your Chiropractic Evaluation",
          submitLabel: "Schedule My Evaluation",
          footerNote:
            "Visit us in Deerfield Beach, or call to ask whether a home visit fits your case and location.",
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />
      <ServicesSection />
      <WhyChoose content={whyChooseContent} />
      <AccidentInjuries />
      <SpineOverview content={spineOverviewContent} />
      <DoctorProfile variant="short" content={doctorProfileContent} />
      {/* slice(1, 4), not (0, 3): homeFeaturedTestimonial is homeReviews[0]
       * (Sheila's car-accident review — kept as the big featured quote
       * since it's the most relevant to this practice's primary accident
       * leads), so the grid below starts from the next review instead of
       * repeating her a second time as both the featured quote and the
       * first card. */}
      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews.slice(1, 4)} />
      {/* <FaqSection pageKey="home" /> */}
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
