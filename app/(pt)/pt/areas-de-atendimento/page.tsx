import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HREFLANG } from "@/content/i18n";
import { getPtRoute } from "@/content/pt/seo";
import { ptServiceAreasCopy } from "@/content/pt/service-areas";
import { siteConfig } from "@/content/site";
import { buildMedicalBusiness, buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const GOOGLE_MAPS_URL = "https://share.google/9ln6JLZdTiphHnmzF";

const route = getPtRoute("/pt/areas-de-atendimento");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/areas-de-atendimento — Brazilian Portuguese counterpart of
 * /service-areas and /es/areas-de-servicio (ATS-SEO-135).
 *
 * Deliberately NOT a reuse of components/content/service-area-hero.tsx and
 * its nineteen-community grid: that component and content/es/service-areas.ts
 * are built entirely around content/es/service-areas-cities.ts's nineteen
 * individual Spanish city pages, none of which have a Portuguese
 * counterpart (out of this ticket's scope — see content/pt/seo.ts's header
 * comment). Building a nineteen-city grid here with no pages behind any of
 * the links would be exactly the "empty/partial page for route parity"
 * this ticket's acceptance criteria rule out. Instead this page states the
 * one verified office plainly and explains, honestly, how home-visit
 * eligibility for nearby communities is confirmed (by phone, case by case)
 * — the real, current process, not a fabricated coverage map. The hero
 * below is bespoke markup rather than HeroSolidPanel/ServiceAreaHero: both
 * of those components are shaped around a lead-form panel this page
 * doesn't have (there is no eligibility form here to embed — the CTA is a
 * phone call or the booking-request page), so reusing either would mean
 * fighting its layout rather than using it.
 */
export default function PtServiceAreasPage() {
  const breadcrumbs = [
    { name: "Início", path: "/pt" },
    { name: ptServiceAreasCopy.breadcrumb, path: route.path },
  ];
  const { address, phone, phoneHref } = siteConfig.business;
  const { hero, intro, office } = ptServiceAreasCopy;

  return (
    <div className="bg-panel-100 pb-24">
      <JsonLd data={buildMedicalBusiness()} />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.pt,
        })}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <section className="relative overflow-hidden lg:-mt-[176px] lg:min-h-[560px]">
        <Image
          src="/figma-exports/exterior-img.png"
          alt="Fachada externa do prédio do consultório em Deerfield Beach"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <Container>
          <div className="container relative z-10 flex flex-col justify-start pb-16 pt-[140px] lg:pb-20 lg:pt-[260px]">
            <BreadcrumbTrail items={breadcrumbs} className="mb-4" />
            <Eyebrow variant="onDark" className="pb-2">
              {hero.eyebrow}
            </Eyebrow>
            <h1 className="font-display text-hero font-medium text-white">{hero.title}</h1>
            <p className="mt-6 max-w-xl font-sans text-body-lg text-white">
              {hero.addressLead}{" "}
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-white/50 underline-offset-2 hover:decoration-white"
              >
                {address.line1}, {address.suite}, {address.city}, {address.state} {address.zip}
              </a>
              {hero.addressTail}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={phoneHref}
                className="inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-navy-900 transition-colors hover:bg-mute-300"
              >
                {hero.callPrefix} {phone}
              </a>
              <Link
                href="/pt/solicitar-consulta"
                className="inline-flex min-h-11 items-center rounded-full border border-white px-6 font-semibold text-white transition-colors hover:border-teal-500 hover:bg-teal-500"
              >
                {hero.requestCta}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="container mt-14" aria-labelledby="eligibility-heading">
        <h2 id="eligibility-heading" className="font-display text-4xl text-navy-800">
          {intro.heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-500">{intro.body}</p>

        <h3 className="mt-10 font-display text-2xl text-navy-800">{intro.eligibilityHeading}</h3>
        <ol className="mt-4 max-w-3xl list-decimal space-y-3 pl-5 leading-7 text-ink-500">
          {intro.eligibilitySteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm leading-6 text-ink-500">{intro.disclaimer}</p>
      </section>

      <section className="container mt-14 grid gap-8 rounded-40 bg-white p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
            {office.eyebrow}
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block font-display text-4xl text-navy-800 underline decoration-navy-800/30 underline-offset-4 hover:decoration-navy-800"
          >
            {address.line1}, {address.suite}
          </a>
          <address className="mt-4 not-italic leading-7 text-ink-500">
            {address.city}, {address.state} {address.zip}
          </address>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-navy-900 px-6 font-semibold text-white transition-colors hover:bg-navy-700"
          >
            {office.directionsCta}
          </a>
        </div>
      </section>
    </div>
  );
}
