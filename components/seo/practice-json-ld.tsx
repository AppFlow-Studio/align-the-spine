import { JsonLd } from "@/components/seo/json-ld";
import { buildMedicalBusiness, buildOrganization, buildWebSite } from "@/lib/schema";

/** Organization + WebSite + MedicalBusiness JSON-LD (ATS schema ticket
 * §2.3) — rendered on the homepage and /contact-us only, per the ticket's
 * "Homepage + contact schema" scope (not every page, unlike the old
 * app/layout.tsx site-wide render this replaces). */
export function PracticeJsonLd() {
  return (
    <>
      <JsonLd data={buildOrganization()} />
      <JsonLd data={buildWebSite()} />
      <JsonLd data={buildMedicalBusiness()} />
    </>
  );
}
