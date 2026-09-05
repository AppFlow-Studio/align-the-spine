import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  htAutoAccidentAccident,
  htAutoAccidentAnswers,
  htAutoAccidentCoordinationQuote,
  htAutoAccidentCtaBands,
  htAutoAccidentFaq,
  htAutoAccidentFaqHeading,
  htAutoAccidentHero,
  htAutoAccidentRedFlags,
  htAutoAccidentSteps,
  htAutoAccidentStepsHeading,
  htPipStat,
} from "@/content/ht/auto-accident";
import { htAccidentInjuries, htHomeSections } from "@/content/ht/home";
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htDoctorProfileContent } from "@/content/ht/pages";
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { isVerified } from "@/content/verified-value";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const FaqAccordion = dynamic(() =>
  import("@/components/ui/faq-accordion").then((m) => m.FaqAccordion),
);

const route = getHtRoute("/ht/kiwoprate-pou-aksidan-machin");

const faqItems = htAutoAccidentFaq.map((item) => ({ question: item.q, answer: item.a }));

const [subheadBeforePip, subheadAfterPip] = htAutoAccidentHero.subhead.split(
  htAutoAccidentHero.pipLinkPhrase,
);

const pipStat = isVerified(htPipStat) ? htPipStat.value : undefined;

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht/kiwoprate-pou-aksidan-machin — the Haitian Creole site's primary
 * acquisition page (ATS-SEO-136), and the Haitian Creole counterpart of
 * /car-accident-chiropractor. Composition mirrors the Portuguese/Spanish
 * accident pages exactly. */
export default function HtAutoAccidentPage() {
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
          { name: "Aksidan Machin", path: route.path },
        ]}
        background={{
          src: "/figma-exports/interior-corridor.png",
          alt: "Koulwa resepsyon Align the Spine nan Deerfield Beach",
        }}
        eyebrow={htAutoAccidentHero.eyebrowChip}
        title={
          <>
            {htAutoAccidentHero.titleLines[0]}
            <br />
            {htAutoAccidentHero.titleLines[1]}
          </>
        }
        subhead={
          <>
            {subheadBeforePip}
            <a href="#pip-calculator" className="underline">
              {htAutoAccidentHero.pipLinkPhrase}
            </a>
            {subheadAfterPip}
          </>
        }
        callPill={{
          eyebrow: htAutoAccidentHero.callPillEyebrow,
          phone: `Rele ${siteConfig.business.phone}`,
        }}
        stat={pipStat}
        form={{
          heading: htAutoAccidentHero.form.heading,
          submitLabel: htLeadFormVariants.accidentEval.submitLabel,
          variant: htLeadFormVariants.accidentEval.variant,
          fields: htLeadFormVariants.accidentEval.fields,
          footerNote: htAutoAccidentHero.form.footerNote,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />

      <ComparisonTable variant="auto-accident" locale="ht" />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Apre yon aksidan" className="max-w-3xl">
            Sa moun mande nou apre yon kolizyon
          </SectionHeading>
          <div className="flex flex-col gap-10 lg:gap-12">
            {htAutoAccidentAnswers.map((block) => (
              <article key={block.heading} className="flex max-w-3xl flex-col gap-3">
                <h3 className="font-display text-h2 font-normal text-navy-900">{block.heading}</h3>
                <p className="font-sans text-body-lg font-medium text-navy-900">{block.answer}</p>
                <p className="font-sans text-body-lg text-ink-500">{block.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section spacing="sm" className="bg-[#FDF3F3]">
        <Container className="flex max-w-3xl flex-col gap-4">
          <h2 className="font-display text-h2 font-normal text-navy-900">
            {htAutoAccidentRedFlags.heading}
          </h2>
          <p className="font-sans text-body-lg text-navy-900">{htAutoAccidentRedFlags.intro}</p>
          <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-body-lg text-ink-500">
            {htAutoAccidentRedFlags.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sans text-small-print text-ink-500">
            {htAutoAccidentRedFlags.footnote}
          </p>
        </Container>
      </Section>

      <div id="pip-calculator">
        <AccidentBanner
          accident={htAutoAccidentAccident}
          locale="ht"
          eyebrow="Èske se te yon aksidan?"
        />
      </div>

      <Section spacing="lg" className="container">
        <HowWeHelpSteps heading={htAutoAccidentStepsHeading} steps={htAutoAccidentSteps} />
      </Section>

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {htAutoAccidentCoordinationQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 font-normal text-white">
              {htAutoAccidentCtaBands.ready.heading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {htAutoAccidentCtaBands.ready.body}
            </p>
          </div>
          <Button variant="teal" href="/ht/mande-yon-randevou" className="w-fit shrink-0">
            {htAutoAccidentCtaBands.ready.cta}
          </Button>
        </Container>
      </Section>

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
        locale="ht"
        reviewsLink={{ href: "/ht/komante-pasyan", label: "Wè tout kòmantè yo" }}
      />

      <DoctorProfile
        variant="short"
        content={htDoctorProfileContent}
        doctorLink={{ href: "/ht/dr-abe-nasser", label: "Fè konesans ak Dr. Abe" }}
      />

      <AccidentInjuries
        items={htAccidentInjuries}
        eyebrow={htHomeSections.accidentInjuriesEyebrow}
        heading={htHomeSections.accidentInjuriesHeading}
        locale="ht"
        isAccidentPage
      />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">
              {htAutoAccidentCtaBands.call.heading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {htAutoAccidentCtaBands.call.body}
            </p>
          </div>
          <Button
            variant="glass"
            href={siteConfig.business.phoneHref}
            eyebrow={htAutoAccidentCtaBands.call.eyebrow}
            className="w-fit shrink-0"
          >
            {htAutoAccidentCtaBands.call.cta}
          </Button>
        </Container>
      </Section>

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={htAutoAccidentFaqHeading.eyebrow}
            className="items-center text-center"
          >
            {htAutoAccidentFaqHeading.headingLead} <br /> {htAutoAccidentFaqHeading.headingTail}
          </SectionHeading>
          <FaqAccordion items={faqItems} />
          <FaqJsonLd items={faqItems} />
        </div>
      </Section>
    </>
  );
}
