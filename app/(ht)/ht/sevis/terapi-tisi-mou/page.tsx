import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { htAutoAccidentAccident } from "@/content/ht/auto-accident";
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htDoctorProfileContent } from "@/content/ht/pages";
import { buildHtRelatedLinks } from "@/content/ht/related-links";
import { getHtRoute } from "@/content/ht/seo";
import {
  htMassageConditions,
  htMassageFaq,
  htMassageHero,
  htMassageRelatedConfig,
  htMassageTechniques,
  htServicePageCopy,
} from "@/content/ht/services-pages";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/sevis/terapi-tisi-mou");

export const metadata: Metadata = buildHtRouteMetadata(route);

const breadcrumbs = [
  { name: "Akèy", path: "/ht" },
  { name: "Sèvis", path: "/ht/sevis" },
  { name: "Terapi tisi mou", path: route.path },
];

/** /ht/sevis/terapi-tisi-mou — Haitian Creole counterpart of
 * /services/soft-tissue-therapy and /es/servicios/terapia-de-tejidos-blandos.
 * `status: "draft"` in content/ht/seo.ts, mirroring the English/Spanish
 * originals: it carries clinical guidance about technique selection that
 * hasn't had a clinician's sign-off. */
export default function HtSoftTissuePage() {
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
        breadcrumbs={breadcrumbs}
        background={htMassageHero.backgroundImage}
        eyebrow={htMassageHero.eyebrowChip}
        title={htMassageHero.h1}
        subhead={htMassageHero.subhead}
        callPill={{ eyebrow: "Ann pale jodi a", phone: `Rele ${siteConfig.business.phone}` }}
        form={{
          heading: "Mande evalyasyon ou",
          submitLabel: htLeadFormVariants.heroEval.submitLabel,
          variant: htLeadFormVariants.heroEval.variant,
          fields: htLeadFormVariants.heroEval.fields,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />

      <ServiceIntro
        eyebrow="Konprann tretman an"
        heading="Yo chwazi teknik la selon tisi a, se pa yon woutin"
        divider
        cta={{ href: "#teknik-yo", label: "Gade teknik yo" }}
        image={{
          src: "/figma-exports/massage-soft-tissue-hero.png",
          alt: "Sal tretman masaj ak terapi tisi mou",
        }}
      >
        Yon masaj òdinè chèche rilaksasyon jeneral. Sa a diferan: travay la dirije nan tisi
        espesifik kolizyon an afekte — tisi sikatris, rèd fasya, oswa kontizyon fon — epi yo chwazi
        teknik la selon evalyasyon ou. Souvan li akonpaye yon{" "}
        <Link href="/ht/sevis/ajisteman-kiwopratik" className="underline">
          ajisteman kiwopratik
        </Link>{" "}
        lè jwenti a ak miskilati a enplike an menm tan. Si ka ou a soti nan yon{" "}
        <Link href="/ht/kiwoprate-pou-aksidan-machin" className="underline">
          aksidan machin
        </Link>
        , chak sesyon dokimante pou reklamasyon ou.
      </ServiceIntro>

      <div id="teknik-yo" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Kijan nou travay" className="items-center text-center">
              {htServicePageCopy.techniquesHeading}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {htMassageTechniques.map((technique) => (
                <div key={technique.title} className="group flex flex-col gap-4">
                  <div className="relative aspect-[507/360] w-full overflow-hidden">
                    <Image
                      src={technique.image.src}
                      alt={technique.image.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-card-title text-navy-800">{technique.title}</h3>
                  <hr className="border-t border-navy-900" />
                  <p className="font-sans text-card-body text-ink-900">{technique.description}</p>
                  <p className="font-sans text-stat-label uppercase tracking-[1.25px] text-mute-400">
                    {htServicePageCopy.bestForLabel}: {technique.bestFor}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>

      <Section>
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="Sa nou trete" className="items-center text-center">
            {htServicePageCopy.conditionsHeading}
          </SectionHeading>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {htMassageConditions.map((condition) => (
              <div key={condition.name} className="group flex flex-col gap-4">
                <div className="relative aspect-[507/360] w-full overflow-hidden">
                  <Image
                    src={condition.image.src}
                    alt={condition.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display text-card-title text-navy-800">{condition.name}</h3>
                <p className="font-sans text-card-body text-ink-900">{condition.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ComparisonTable locale="ht" />

      <DoctorProfile
        variant="short"
        content={htDoctorProfileContent}
        doctorLink={{ href: "/ht/dr-abe-nasser", label: "Konnen Dr. Abe" }}
      />

      <AccidentBanner
        accident={htAutoAccidentAccident}
        locale="ht"
        eyebrow="Èske se te akoz yon aksidan?"
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
              {htServicePageCopy.readyHeading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {htServicePageCopy.readyBody}
            </p>
          </div>
          <Button variant="teal" href="/ht/mande-yon-randevou" className="w-fit shrink-0">
            {htServicePageCopy.readyCta}
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        heading={htServicePageCopy.relatedHeading}
        items={buildHtRelatedLinks({ currentPath: route.path, ...htMassageRelatedConfig })}
      />

      <ConditionFaq faq={htMassageFaq} locale="ht" />
    </>
  );
}
