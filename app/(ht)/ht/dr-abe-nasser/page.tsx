import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorHistory } from "@/components/sections/doctor-history";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { HowHePractices } from "@/components/sections/how-he-practices";
import { PhotoGallery } from "@/components/sections/photo-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import {
  htDoctorHistoryContent,
  htDoctorPage,
  htDoctorProfileContent,
  htHowHePracticesCards,
} from "@/content/ht/pages";
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildPerson, buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/dr-abe-nasser");

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht/dr-abe-nasser — Haitian Creole counterpart of /about and
 * /pt/dr-abe-nasser (ATS-SEO-136).
 *
 * Emits the same Person `@id` (lib/schema.ts's DR_ABE_PERSON_ID) as the
 * English/Spanish/Portuguese pages — one Dr. Abe, described in four
 * languages, not four separate people in the graph. No credential,
 * degree, school, license number or years-of-practice claim appears
 * anywhere on this page: `doctorCredentials.verified` is still false, so
 * buildPerson() omits alumniOf/hasCredential, and this page's prose
 * doesn't smuggle one in.
 */
export default function HtDoctorPage() {
  return (
    <>
      <JsonLd data={buildPerson()} />
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
          { name: htDoctorPage.breadcrumb, path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "Dr. Abe Nasser ap evalye kou yon pasyan",
        }}
        eyebrow={htDoctorPage.hero.eyebrow}
        title={
          <>
            {htDoctorPage.hero.titleLines[0]}
            <br />
            {htDoctorPage.hero.titleLines[1]}
          </>
        }
        subhead={htDoctorPage.hero.subhead}
        callPill={{
          eyebrow: htDoctorPage.hero.callPillEyebrow,
          phone: `Rele ${siteConfig.business.phone}`,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />
      <DoctorProfile
        variant="long"
        content={htDoctorProfileContent}
        extended={<DoctorHistory content={htDoctorHistoryContent} />}
      />
      <HowHePractices
        cards={htHowHePracticesCards}
        eyebrow={htDoctorPage.practices.eyebrow}
        heading={htDoctorPage.practices.heading}
        callout={htDoctorPage.practices.officeCallout}
      />
      <PhotoGallery />
      <LocationIntro locale="ht" />
      <LocationFooter locale="ht" />
      <ContactSection locale="ht" />
    </>
  );
}
