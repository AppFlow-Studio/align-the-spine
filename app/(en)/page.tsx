import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyChoose } from "@/components/sections/why-choose";
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
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
 * hotspot version) → DoctorBio → "Injured in a car accident?" CTA band (ATS-SEO-125 —
 * a summary/link, not the full accident-injuries treatment /car-accident-chiropractor
 * owns) → patient reviews → FAQ/CTA bands → contact LeadForm →
 * LocationIntro/LocationFooter (shared with Services/About/Book — see app/book/page.tsx).
 *
 * ATS-SEO-050: H1 previously led with the brand name ("Align the Spine /
 * Deerfield Beach / Chiropractor") while the <title> tag
 * (content/seo.ts's "" route) leads with the intent phrase ("Chiropractor
 * in Deerfield Beach, FL | Align the Spine") — misaligned order between
 * the two, and out of step with every other page's H1 (none of them lead
 * with the brand; /car-accident-chiropractor's H1 is just "Car Accident
 * Chiropractor", no brand at all). Rewritten to lead with the same phrase
 * the title tag leads with — brand stays visible elsewhere on this page
 * (logo/nav, callPill, footer) without needing to open the H1. */
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
            Chiropractor in
            <br />
            Deerfield Beach, FL
          </>
        }
        badge="We accept cash visits"
        bilingualNote="¿Habla español? Dr. Abe habla su idioma."
        subhead="Chiropractic care in Deerfield Beach for back pain, neck pain, mobility concerns, and injuries — with focused evaluations after car accidents."
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Request Your Chiropractic Evaluation",
          submitLabel: leadFormVariants.heroEval.submitLabel,
          footerNote:
            "Visit us in Deerfield Beach, or call to ask whether a home visit fits your case and location.",
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />
      <ServicesSection />
      <WhyChoose content={whyChooseContent} />
      {/* ATS-SEO-125: this used to be a full <AccidentInjuries /> grid —
       * the exact same heading, eyebrow, and six injury cards
       * /car-accident-chiropractor renders in full. That page owns
       * accident-specific intent; duplicating its whole treatment here
       * competed with it for the same queries (see content/seo.ts's
       * "KNOWN GAP" comment on this route, now resolved). This keeps the
       * homepage's own required "Injured in a car accident?" path
       * prominent — a CTA band, not the full section — and sends anyone
       * who needs the full treatment to the page that owns it. */}
      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white font-normal">
              Injured in a car accident?
            </h2>
            <p className="font-sans text-body-lg text-mute-300 sm:w-[65%]">
              We evaluate whiplash, neck and back pain, and other collision injuries, with
              documentation for PIP insurance when eligible.
            </p>
          </div>
          <Button variant="teal" href="/car-accident-chiropractor" className="w-fit shrink-0">
            See Car Accident Care
          </Button>
        </Container>
      </Section>
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
