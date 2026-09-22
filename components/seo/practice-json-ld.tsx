import { JsonLd } from "@/components/seo/json-ld";
import { buildMedicalBusiness, buildOrganization, buildWebSite } from "@/lib/schema";

/** Organization + WebSite + MedicalBusiness JSON-LD (ATS schema ticket
 * §2.3) — rendered on the home and contact pages of each locale, per the
 * ticket's "Homepage + contact schema" scope (not every page, unlike the old
 * app/layout.tsx site-wide render this replaces).
 *
 * ATS-A07: these eight pages are the ones that opt into `aggregateRating`,
 * because every one of them renders HeroReviewsCarousel/ReviewsCarousel with
 * the real client-supplied reviews — so the rating describes review content
 * the visitor can actually see. Pages that call `buildMedicalBusiness()`
 * directly (the four service-area hubs) get the default, which omits the
 * rating; they render no review content and must not claim one. */
export function PracticeJsonLd() {
  return (
    <>
      <JsonLd data={buildOrganization()} />
      <JsonLd data={buildWebSite()} />
      <JsonLd data={buildMedicalBusiness({ includeAggregateRating: true })} />
    </>
  );
}
