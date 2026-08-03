import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorHistory } from "@/components/sections/doctor-history";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { HowHePractices } from "@/components/sections/how-he-practices";
import { PhotoGallery } from "@/components/sections/photo-gallery";
import { doctorHistoryContent, doctorProfileContent } from "@/content/doctor-profile";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/about"));

/** /about page assembly (ATS-090) per the about-drabe artboard (frame
 * 96:2442 — the ticket's node refs 1:3379/1:3512 don't resolve in the file,
 * same stale-ID issue as ATS-081's services artboard ref): Hero (no lead
 * form on this artboard, unlike Home/Services — condition variant for its
 * eyebrow + bilingual note) → DoctorProfile long variant (short profile
 * block + HISTORY long bio in the `extended` slot) → HowHePractices
 * (ATS-091, built here since /about's acceptance criteria required it) →
 * PhotoGallery → LocationIntro/LocationFooter (shared with Home/Services/
 * Book) → contact LeadForm, which sits below Hours of Operation per the
 * artboard, same as /services. */
export default function AboutPage() {
  return (
    <>
      <Hero
        variant="condition"
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "Dr. Abe Nasser treating a patient's neck",
        }}
        eyebrow="The doctor South Florida refers accident patients to"
        title="Comprehensive care, tailored to you"
        subhead="From routine adjustments to specialized recovery care — same doctor, every visit, at the office or your home when it applies."
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        bilingualNote="¿Habla español? Dr. Abe habla su idioma."
      />
      <DoctorProfile
        variant="long"
        content={doctorProfileContent}
        extended={<DoctorHistory content={doctorHistoryContent} />}
      />
      <HowHePractices />
      <PhotoGallery />
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
