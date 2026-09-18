import type { Metadata } from "next";
import Link from "next/link";

import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htDoctorProfileContent } from "@/content/ht/pages";
import { buildHtRelatedLinks } from "@/content/ht/related-links";
import { getHtRoute } from "@/content/ht/seo";
import {
  htCuppingFaq,
  htCuppingHero,
  htCuppingRelatedConfig,
  htServicePageCopy,
} from "@/content/ht/services-pages";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/sevis/terapi-vantouz");

export const metadata: Metadata = buildHtRouteMetadata(route);

const breadcrumbs = [
  { name: "Akèy", path: "/ht" },
  { name: "Sèvis", path: "/ht/sevis" },
  { name: "Terapi vantouz", path: route.path },
];

/** /ht/sevis/terapi-vantouz — Haitian Creole counterpart of
 * /services/cupping-therapy and /es/servicios/terapia-de-ventosas.
 *
 * Deliberately the leanest of the four Haitian Creole service pages,
 * exactly as the English/Spanish/Portuguese ones are: cupping is a single
 * technique, not a full treatment category, so this doesn't carry the
 * comparison table, accident banner or reviews band the other three do.
 *
 * `status: "draft"` in content/ht/seo.ts, mirroring the English original. */
export default function HtCuppingTherapyPage() {
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
        background={htCuppingHero.backgroundImage}
        eyebrow={htCuppingHero.eyebrowChip}
        title={htCuppingHero.h1}
        subhead={htCuppingHero.subhead}
        callPill={{ eyebrow: "Ann pale jodi a", phone: `Rele ${siteConfig.business.phone}` }}
        form={{
          heading: "Mande evalyasyon ou",
          submitLabel: htLeadFormVariants.heroEval.submitLabel,
          variant: htLeadFormVariants.heroEval.variant,
          fields: htLeadFormVariants.heroEval.fields,
        }}
      />

      <ServiceIntro
        eyebrow="Konprann tretman an"
        heading="Aspirasyon lokalize pou zòn tansyon espesifik"
        divider
        image={{
          src: "/figma-exports/cupping-drabe.png",
          alt: "Sesyon terapi vantouz",
        }}
      >
        Terapi vantouz mete gode sou po a pou aplike aspirasyon nan zòn tansyon miskilè seleksyone.
        Li ka enkli ansanm ak lòt travay{" "}
        <Link href="/ht/sevis/terapi-tisi-mou" className="underline">
          tisi mou
        </Link>{" "}
        lè sa apwopriye pou jèn nan kou, nan do, oswa nan lòt zòn. Dr. Abe deside si sa apwopriye
        pou ka ou a apati evalyasyon an, se pa yon woutin fiks — epi l ap di w lè yon lòt teknik se
        yon pi bon pwen depa. Si ka ou a soti nan yon{" "}
        <Link href="/ht/kiwoprate-pou-aksidan-machin" className="underline">
          aksidan machin
        </Link>
        , chak sesyon dokimante pou reklamasyon ou.
      </ServiceIntro>

      <DoctorProfile
        variant="short"
        content={htDoctorProfileContent}
        doctorLink={{ href: "/ht/dr-abe-nasser", label: "Konnen Dr. Abe" }}
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
        items={buildHtRelatedLinks({ currentPath: route.path, ...htCuppingRelatedConfig })}
      />

      <ConditionFaq faq={htCuppingFaq} locale="ht" />
    </>
  );
}
