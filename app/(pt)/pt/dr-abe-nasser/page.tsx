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
import { HREFLANG } from "@/content/i18n";
import {
  ptDoctorHistoryContent,
  ptDoctorPage,
  ptDoctorProfileContent,
  ptHowHePracticesCards,
} from "@/content/pt/pages";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildPerson, buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/dr-abe-nasser");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/dr-abe-nasser — Brazilian Portuguese counterpart of /about and
 * /es/dr-abe-nasser (ATS-SEO-135).
 *
 * Emits the same Person `@id` (lib/schema.ts's DR_ABE_PERSON_ID) as the
 * English and Spanish pages — one Dr. Abe, described in three languages,
 * not three separate people in the graph. No credential, degree, school,
 * license number or years-of-practice claim appears anywhere on this page:
 * `doctorCredentials.verified` is still false, so buildPerson() omits
 * alumniOf/hasCredential, and this page's prose doesn't smuggle one in.
 */
export default function PtDoctorPage() {
  return (
    <>
      <JsonLd data={buildPerson()} />
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
          { name: ptDoctorPage.breadcrumb, path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "Dr. Abe Nasser avaliando o pescoço de um paciente",
        }}
        eyebrow={ptDoctorPage.hero.eyebrow}
        title={
          <>
            {ptDoctorPage.hero.titleLines[0]}
            <br />
            {ptDoctorPage.hero.titleLines[1]}
          </>
        }
        subhead={ptDoctorPage.hero.subhead}
        callPill={{
          eyebrow: ptDoctorPage.hero.callPillEyebrow,
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />
      <DoctorProfile
        variant="long"
        content={ptDoctorProfileContent}
        extended={<DoctorHistory content={ptDoctorHistoryContent} />}
      />
      <HowHePractices
        cards={ptHowHePracticesCards}
        eyebrow={ptDoctorPage.practices.eyebrow}
        heading={ptDoctorPage.practices.heading}
        callout={ptDoctorPage.practices.officeCallout}
      />
      <PhotoGallery />
      <LocationIntro locale="pt" />
      <LocationFooter locale="pt" />
      <ContactSection locale="pt" />
    </>
  );
}
