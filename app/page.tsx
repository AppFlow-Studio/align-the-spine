import { CtaBand } from "@/components/sections/cta-band";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services-section";
import { StillHaveQuestions } from "@/components/sections/still-have-questions";
import { ctaBandContent, stillHaveQuestionsContent } from "@/content/cta-bands";
import { doctorProfileContent } from "@/content/doctor-profile";
import { siteConfig } from "@/content/site";

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
      <DoctorProfile variant="short" content={doctorProfileContent} />
      <FaqSection pageKey="home" />
      <StillHaveQuestions content={stillHaveQuestionsContent} />
      <CtaBand content={ctaBandContent} />
    </>
  );
}
