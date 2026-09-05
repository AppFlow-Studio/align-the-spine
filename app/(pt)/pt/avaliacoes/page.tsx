import type { Metadata } from "next";
import Image from "next/image";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { ReviewsCarousel } from "@/components/sections/reviews-carousel";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { LeadForm } from "@/components/ui/lead-form";
import { Rating } from "@/components/ui/rating";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLocalizedStats } from "@/content/chrome";
import { HREFLANG } from "@/content/i18n";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptReviewsPage } from "@/content/pt/pages";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { isVerified } from "@/content/verified-value";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/avaliacoes");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/avaliacoes — Brazilian Portuguese counterpart of /reviews and
 * /es/resenas (ATS-SEO-135). Reviews render verbatim, in whatever language
 * each patient wrote them — never translated (see ptReviewsPage.languageNote
 * for why). No AggregateRating markup here either, exactly as the English
 * and Spanish pages: the 5.0/164 figure is a client-asserted number rather
 * than one read from a live source, and rating markup is a stronger,
 * machine-consumed claim than showing the same figure as copy.
 */
const breadcrumbs = [
  { name: "Início", path: "/pt" },
  { name: "Avaliações", path: route.path },
];

export default function PtReviewsPage() {
  const reviews = siteConfig.reviewsRating;
  const otherStats = getLocalizedStats("pt").filter((stat) => stat.label !== "Avaliações");

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.pt,
        })}
      />

      <section className="relative flex flex-col overflow-hidden pt-10 lg:-mt-[176px] lg:min-h-[860px] lg:flex-row">
        <div className="relative min-h-[560px] min-w-0 lg:min-h-full lg:flex-1">
          <Image
            src="https://align-the-spine.b-cdn.net/images/review-page-hero.png"
            alt={ptReviewsPage.heroAlt}
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-[75%_center]"
          />
          <div className="absolute inset-0 bg-[#2a2318]/45 lg:bg-gradient-to-r lg:from-[#2a2318]/70 lg:via-[#2a2318]/35 lg:to-transparent" />
          <Container>
            <div className="container relative z-10 flex h-full flex-col justify-start pb-16 pt-[120px] lg:pb-16 lg:pr-12 lg:pt-[170px]">
              <div className="max-w-lg">
                <BreadcrumbTrail items={breadcrumbs} className="mb-4" />
                <h1 className="font-display text-5xl font-medium text-white">{ptReviewsPage.h1}</h1>
                <p className="mt-4 font-sans text-body-lg text-white">{ptReviewsPage.intro}</p>

                {isVerified(reviews) && (
                  <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                    <span className="font-display text-hero text-yellow-400">
                      {reviews.value.rating.toFixed(1)}
                    </span>
                    <div className="flex flex-col gap-2">
                      <Rating
                        value={reviews.value.rating}
                        filledClassName="text-yellow-400 h-6 w-6 sm:h-7 sm:w-7"
                        emptyClassName="text-white/20 h-6 w-6 sm:h-7 sm:w-7"
                      />
                      <span className="font-sans text-body-lg text-white">
                        <strong className="font-semibold">
                          {reviews.value.count} {ptReviewsPage.ratingSuffix}
                        </strong>{" "}
                        {ptReviewsPage.ratingTail}
                      </span>
                    </div>
                  </div>
                )}

                {otherStats.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {otherStats.map((stat) => (
                      <span
                        key={stat.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 py-1.5 pl-3 pr-3.5 font-sans text-stat-label text-white"
                      >
                        {stat.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>

        <div className="relative flex flex-col bg-navy-900 px-6 pb-16 pt-10 sm:px-10 lg:w-[640px] lg:shrink-0 lg:px-16 lg:pb-16 lg:pt-[170px] xl:w-[760px] 2xl:w-[800px]">
          <LeadForm
            locale="pt"
            heading={ptReviewsPage.formHeading}
            variant={ptLeadFormVariants.reviewsEval.variant}
            fields={ptLeadFormVariants.reviewsEval.fields}
            submitLabel={ptLeadFormVariants.reviewsEval.submitLabel}
            submitVariant="teal"
            fieldOutline
            labelCase="none"
            headingClassName="mb-4 font-display text-3xl text-white"
            className="gap-y-4"
          />
          <p className="mt-6 font-sans text-body-lg text-mute-300">{ptReviewsPage.formFootnote}</p>
        </div>
      </section>

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow="Avaliações" sub={ptReviewsPage.languageNote}>
            {ptReviewsPage.carouselHeading}
          </SectionHeading>
          <ReviewsCarousel reviews={testimonials} locale="pt" />
        </div>
      </Section>

      <LocationIntro locale="pt" />
      <LocationFooter locale="pt" />
      <ContactSection locale="pt" />
    </>
  );
}
