import type { Metadata } from "next";

import { HtConditionPage } from "@/components/sections/ht-condition-page";
import { JsonLd } from "@/components/seo/json-ld";
import { htSciatica } from "@/content/ht/conditions";
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/kondisyon-nou-trete/syatik");

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht/kondisyon-nou-trete/syatik — Haitian Creole counterpart of
 * /conditions/sciatica and /es/condiciones/ciatica.
 *
 * `status: "draft"` in content/ht/seo.ts, mirroring the English/Spanish
 * originals — noindex and out of the sitemap pending clinician review of
 * the medical content, but reachable and linkable from the Haitian Creole
 * nav.
 */
export default function HtSciaticaPage() {
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
      <HtConditionPage condition={htSciatica} />
    </>
  );
}
