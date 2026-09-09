import Image from "next/image";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ptAutoAccidentAccident } from "@/content/pt/auto-accident";
import { ptConditionPageCopy, type PtCondition } from "@/content/pt/conditions";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptDoctorProfileContent } from "@/content/pt/pages";
import { buildPtRelatedLinks } from "@/content/pt/related-links";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

/** Shared template for the seven `/pt/condicoes/*` pages — the Portuguese
 * counterpart of components/sections/es-condition-page.tsx (ATS-SEO-135
 * follow-up). Same structure, same section order, same rule that optional
 * sections (`list`, `feelsLike`, `howWeTreat`, `warning`) render only when a
 * condition supplies them — see that file's doc comment for the full
 * reasoning, which applies unchanged here.
 *
 * The red-flag band sits ABOVE the booking CTA on purpose, exactly as on
 * the Spanish/Portuguese accident page: a page that invites someone to book
 * has to say plainly when booking is the wrong call first.
 */
export function PtConditionPage({ condition }: { condition: PtCondition }) {
  const breadcrumbs = [
    { name: "Início", path: "/pt" },
    { name: "Condições", path: "/pt/condicoes" },
    { name: condition.breadcrumb, path: condition.path },
  ];

  return (
    <>
      <HeroSolidPanel
        locale="pt"
        breadcrumbs={breadcrumbs}
        background={condition.hero.backgroundImage}
        eyebrow={condition.hero.eyebrowChip}
        title={condition.hero.h1}
        subhead={condition.hero.subhead}
        callPill={{
          eyebrow: ptConditionPageCopy.callEyebrow,
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
        form={{
          heading: "Solicite sua avaliação",
          submitLabel: ptLeadFormVariants.heroEval.submitLabel,
          variant: ptLeadFormVariants.heroEval.variant,
          fields: ptLeadFormVariants.heroEval.fields,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />

      <ServiceIntro
        eyebrow={condition.understanding.eyebrow}
        heading={condition.understanding.heading}
        divider
        image={condition.understanding.image}
      >
        {condition.understanding.paragraphs.map((paragraph, index) => (
          <span key={index} className="mb-4 block last:mb-0">
            {paragraph}
          </span>
        ))}
      </ServiceIntro>

      {condition.list && (
        <Section>
          <Container className="flex flex-col gap-8">
            <SectionHeading as="h2">{condition.list.heading}</SectionHeading>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {condition.list.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-t border-mute-300 pt-4 font-sans text-body-lg text-ink-900"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-2 shrink-0 rounded-full bg-teal-500"
                  />
                  {item}
                </li>
              ))}
            </ul>
            {condition.list.note && (
              <p className="font-sans text-body-lg text-navy-900">{condition.list.note}</p>
            )}
          </Container>
        </Section>
      )}

      {condition.feelsLike && (
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Sintomas" className="items-center text-center">
              {condition.feelsLike.heading}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {condition.feelsLike.items.map((item) => (
                <div key={item.title} className="flex flex-col gap-3">
                  <h3 className="font-display text-card-title text-navy-800">{item.title}</h3>
                  <hr className="border-t border-navy-900" />
                  <p className="font-sans text-card-body text-ink-900">{item.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {condition.howWeTreat && (
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Nossa abordagem" className="items-center text-center">
              {condition.howWeTreat.heading}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {condition.howWeTreat.items.map((item) => (
                <div key={item.title} className="group flex flex-col gap-4">
                  <div className="relative aspect-[507/360] w-full overflow-hidden">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-card-title text-navy-800">{item.title}</h3>
                  <p className="font-sans text-card-body text-ink-900">{item.desc}</p>
                  <p className="font-sans text-stat-label uppercase tracking-[1.25px] text-mute-400">
                    {item.meta}
                  </p>
                  <Button variant="ghost" href={item.ctaHref} className="w-fit">
                    {item.ctaLabel}
                  </Button>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {condition.warning && (
        <Section spacing="sm" className="bg-[#FDF3F3]">
          <Container className="flex max-w-3xl flex-col gap-4">
            <Eyebrow>Sinais de alerta</Eyebrow>
            <h2 className="font-display text-h2 font-normal text-navy-900">
              {condition.warning.heading}
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-body-lg text-ink-500">
              {condition.warning.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="font-sans text-small-print text-ink-500">
              A Align the Spine não é um serviço de emergência e não faz diagnóstico pela internet.
              Esta página é informação geral e não substitui a avaliação de um profissional de
              saúde.
            </p>
          </Container>
        </Section>
      )}

      <ComparisonTable locale="pt" />

      <DoctorProfile
        variant="short"
        content={ptDoctorProfileContent}
        doctorLink={{ href: "/pt/dr-abe-nasser", label: "Conheça o Dr. Abe" }}
      />

      <AccidentBanner
        accident={ptAutoAccidentAccident}
        locale="pt"
        eyebrow={ptConditionPageCopy.accidentEyebrow}
      />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
        locale="pt"
        reviewsLink={{ href: "/pt/avaliacoes", label: "Ver todas as avaliações" }}
      />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 font-normal text-white">
              {ptConditionPageCopy.readyHeading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {ptConditionPageCopy.readyBody}
            </p>
          </div>
          <Button variant="teal" href="/pt/solicitar-consulta" className="w-fit shrink-0">
            {ptConditionPageCopy.readyCta}
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        heading={ptConditionPageCopy.relatedHeading}
        items={buildPtRelatedLinks({
          currentPath: condition.path,
          ...condition.relatedConfig,
        })}
      />

      <ConditionFaq faq={condition.faq} locale="pt" />
    </>
  );
}
