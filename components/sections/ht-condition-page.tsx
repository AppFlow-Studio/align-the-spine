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
import { htAutoAccidentAccident } from "@/content/ht/auto-accident";
import { htConditionPageCopy, type HtCondition } from "@/content/ht/conditions";
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htDoctorProfileContent } from "@/content/ht/pages";
import { buildHtRelatedLinks } from "@/content/ht/related-links";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

/** Shared template for the seven `/ht/kondisyon-nou-trete/*` pages — the
 * Haitian Creole counterpart of components/sections/es-condition-page.tsx
 * and pt-condition-page.tsx (ATS-SEO-136 follow-up). Same structure, same
 * section order, same rule that optional sections (`list`, `feelsLike`,
 * `howWeTreat`, `warning`) render only when a condition supplies them.
 *
 * The red-flag band sits ABOVE the booking CTA on purpose, same reasoning
 * as the Spanish/Portuguese templates: a page that invites someone to book
 * has to say plainly when booking is the wrong call first.
 */
export function HtConditionPage({ condition }: { condition: HtCondition }) {
  const breadcrumbs = [
    { name: "Akèy", path: "/ht" },
    { name: "Kondisyon Nou Trete", path: "/ht/kondisyon-nou-trete" },
    { name: condition.breadcrumb, path: condition.path },
  ];

  return (
    <>
      <HeroSolidPanel
        locale="ht"
        breadcrumbs={breadcrumbs}
        background={condition.hero.backgroundImage}
        eyebrow={condition.hero.eyebrowChip}
        title={condition.hero.h1}
        subhead={condition.hero.subhead}
        callPill={{
          eyebrow: htConditionPageCopy.callEyebrow,
          phone: `Rele ${siteConfig.business.phone}`,
        }}
        form={{
          heading: "Mande evalyasyon ou",
          submitLabel: htLeadFormVariants.heroEval.submitLabel,
          variant: htLeadFormVariants.heroEval.variant,
          fields: htLeadFormVariants.heroEval.fields,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />

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
            <SectionHeading eyebrow="Sentòm" className="items-center text-center">
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
            <SectionHeading eyebrow="Apwòch nou" className="items-center text-center">
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
            <Eyebrow>Siy alèt</Eyebrow>
            <h2 className="font-display text-h2 font-normal text-navy-900">
              {condition.warning.heading}
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-body-lg text-ink-500">
              {condition.warning.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="font-sans text-small-print text-ink-500">
              Align the Spine se pa yon sèvis ijans e li pa fè dyagnostik sou entènèt. Paj sa a se
              enfòmasyon jeneral e li pa ranplase evalyasyon yon pwofesyonèl sante.
            </p>
          </Container>
        </Section>
      )}

      <ComparisonTable locale="ht" />

      <DoctorProfile
        variant="short"
        content={htDoctorProfileContent}
        doctorLink={{ href: "/ht/dr-abe-nasser", label: "Konnen Dr. Abe" }}
      />

      <AccidentBanner
        accident={htAutoAccidentAccident}
        locale="ht"
        eyebrow={htConditionPageCopy.accidentEyebrow}
      />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
        locale="ht"
        reviewsLink={{ href: "/ht/komante-pasyan", label: "Gade tout kòmantè yo" }}
      />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 font-normal text-white">
              {htConditionPageCopy.readyHeading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {htConditionPageCopy.readyBody}
            </p>
          </div>
          <Button variant="teal" href="/ht/mande-yon-randevou" className="w-fit shrink-0">
            {htConditionPageCopy.readyCta}
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        heading={htConditionPageCopy.relatedHeading}
        items={buildHtRelatedLinks({
          currentPath: condition.path,
          ...condition.relatedConfig,
        })}
      />

      <ConditionFaq faq={condition.faq} locale="ht" />
    </>
  );
}
