import type { Metadata } from "next";

import { PtConditionPage } from "@/components/sections/pt-condition-page";
import { JsonLd } from "@/components/seo/json-ld";
import { HREFLANG } from "@/content/i18n";
import { ptCervicogenicHeadache } from "@/content/pt/conditions";
import { getPtRoute } from "@/content/pt/seo";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/condicoes/dor-de-cabeca-cervicogenica");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/condicoes/dor-de-cabeca-cervicogenica — Brazilian Portuguese
 * counterpart of /conditions/cervicogenic-headache and
 * /es/condiciones/dolor-de-cabeza-cervicogenico.
 *
 * `status: "draft"` in content/pt/seo.ts, mirroring the English/Spanish
 * originals — noindex and out of the sitemap pending clinician review of
 * the medical content, but reachable and linkable from the Portuguese nav.
 */
export default function PtCervicogenicHeadachePage() {
  return (
    <>
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.pt,
        })}
      />
      <PtConditionPage condition={ptCervicogenicHeadache} />
    </>
  );
}
