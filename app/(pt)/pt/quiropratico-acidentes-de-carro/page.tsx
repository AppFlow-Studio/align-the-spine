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
import { HREFLANG } from "@/content/i18n";
import {
  ptAutoAccidentAccident,
  ptAutoAccidentAnswers,
  ptAutoAccidentCoordinationQuote,
  ptAutoAccidentCtaBands,
  ptAutoAccidentFaq,
  ptAutoAccidentFaqHeading,
  ptAutoAccidentHero,
  ptAutoAccidentRedFlags,
  ptAutoAccidentSteps,
  ptAutoAccidentStepsHeading,
  ptPipStat,
} from "@/content/pt/auto-accident";
import { ptAccidentInjuries, ptHomeSections } from "@/content/pt/home";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptDoctorProfileContent } from "@/content/pt/pages";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { isVerified } from "@/content/verified-value";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const FaqAccordion = dynamic(() =>
  import("@/components/ui/faq-accordion").then((m) => m.FaqAccordion),
);

const route = getPtRoute("/pt/quiropratico-acidentes-de-carro");

const faqItems = ptAutoAccidentFaq.map((item) => ({ question: item.q, answer: item.a }));

const [subheadBeforePip, subheadAfterPip] = ptAutoAccidentHero.subhead.split(
  ptAutoAccidentHero.pipLinkPhrase,
);

const pipStat = isVerified(ptPipStat) ? ptPipStat.value : undefined;

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/quiropratico-acidentes-de-carro — the Portuguese site's primary
 * acquisition page (ATS-SEO-135), and the Portuguese counterpart of
 * /car-accident-chiropractor and /es/quiropractico-accidentes-de-auto.
 * Composition mirrors the Spanish accident page exactly. */
export default function PtAutoAccidentPage() {
  return (
    <>
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.pt,
        })}
      />

      <HeroSolidPanel
        locale="pt"
        breadcrumbs={[
          { name: "Início", path: "/pt" },
          { name: "Acidentes de Carro", path: route.path },
        ]}
        background={{
          src: "/figma-exports/interior-corridor.png",
          alt: "Corredor de recepção da Align the Spine em Deerfield Beach",
        }}
        eyebrow={ptAutoAccidentHero.eyebrowChip}
        title={
          <>
            {ptAutoAccidentHero.titleLines[0]}
            <br />
            {ptAutoAccidentHero.titleLines[1]}
          </>
        }
        subhead={
          <>
            {subheadBeforePip}
            <a href="#pip-calculator" className="underline">
              {ptAutoAccidentHero.pipLinkPhrase}
            </a>
            {subheadAfterPip}
          </>
        }
        callPill={{
          eyebrow: ptAutoAccidentHero.callPillEyebrow,
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
        stat={pipStat}
        form={{
          heading: ptAutoAccidentHero.form.heading,
          submitLabel: ptLeadFormVariants.accidentEval.submitLabel,
          variant: ptLeadFormVariants.accidentEval.variant,
          fields: ptLeadFormVariants.accidentEval.fields,
          footerNote: ptAutoAccidentHero.form.footerNote,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />

      <ComparisonTable variant="auto-accident" locale="pt" />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Depois de um acidente" className="max-w-3xl">
            O que as pessoas nos perguntam depois de uma batida
          </SectionHeading>
          <div className="flex flex-col gap-10 lg:gap-12">
            {ptAutoAccidentAnswers.map((block) => (
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
            {ptAutoAccidentRedFlags.heading}
          </h2>
          <p className="font-sans text-body-lg text-navy-900">{ptAutoAccidentRedFlags.intro}</p>
          <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-body-lg text-ink-500">
            {ptAutoAccidentRedFlags.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sans text-small-print text-ink-500">
            {ptAutoAccidentRedFlags.footnote}
          </p>
        </Container>
      </Section>

      <div id="pip-calculator">
        <AccidentBanner
          accident={ptAutoAccidentAccident}
          locale="pt"
          eyebrow="Foi por um acidente?"
        />
      </div>

      <Section spacing="lg" className="container">
        <HowWeHelpSteps heading={ptAutoAccidentStepsHeading} steps={ptAutoAccidentSteps} />
      </Section>

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {ptAutoAccidentCoordinationQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 font-normal text-white">
              {ptAutoAccidentCtaBands.ready.heading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {ptAutoAccidentCtaBands.ready.body}
            </p>
          </div>
          <Button variant="teal" href="/pt/solicitar-consulta" className="w-fit shrink-0">
            {ptAutoAccidentCtaBands.ready.cta}
          </Button>
        </Container>
      </Section>

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
        locale="pt"
        reviewsLink={{ href: "/pt/avaliacoes", label: "Ver todas as avaliações" }}
      />

      <DoctorProfile
        variant="short"
        content={ptDoctorProfileContent}
        doctorLink={{ href: "/pt/dr-abe-nasser", label: "Conheça o Dr. Abe" }}
      />

      <AccidentInjuries
        items={ptAccidentInjuries}
        eyebrow={ptHomeSections.accidentInjuriesEyebrow}
        heading={ptHomeSections.accidentInjuriesHeading}
        locale="pt"
        isAccidentPage
      />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">
              {ptAutoAccidentCtaBands.call.heading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {ptAutoAccidentCtaBands.call.body}
            </p>
          </div>
          <Button
            variant="glass"
            href={siteConfig.business.phoneHref}
            eyebrow={ptAutoAccidentCtaBands.call.eyebrow}
            className="w-fit shrink-0"
          >
            {ptAutoAccidentCtaBands.call.cta}
          </Button>
        </Container>
      </Section>

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={ptAutoAccidentFaqHeading.eyebrow}
            className="items-center text-center"
          >
            {ptAutoAccidentFaqHeading.headingLead} <br /> {ptAutoAccidentFaqHeading.headingTail}
          </SectionHeading>
          <FaqAccordion items={faqItems} />
          <FaqJsonLd items={faqItems} />
        </div>
      </Section>
    </>
  );
}
