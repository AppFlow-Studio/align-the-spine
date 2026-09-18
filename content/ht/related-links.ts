import type { ConditionRelatedLink } from "@/content/conditions/types";
import { htRoutes } from "@/content/ht/seo";
import { isPublished } from "@/content/seo";

/** Haitian Creole counterpart of content/es/related-links.ts and
 * content/pt/related-links.ts — the "related content" pill rows at the
 * bottom of the Haitian Creole condition and service pages.
 *
 * Same contract: labels are keyed by the exact Haitian Creole route path, so
 * a label can never point somewhere other than what it says, and a draft
 * route is dropped from the row rather than linked. Every key must be a real
 * path in content/ht/seo.ts — buildHtRelatedLinks() throws otherwise, so a
 * typo fails the build instead of rendering a dead pill.
 */
const HT_RELATED_LINK_LABELS: Record<string, string> = {
  "/ht/kondisyon-nou-trete": "Tout kondisyon nou trete",
  "/ht/kondisyon-nou-trete/doule-do": "Doulè do",
  "/ht/kondisyon-nou-trete/doule-kou": "Doulè kou",
  "/ht/kondisyon-nou-trete/syatik": "Syatik",
  "/ht/kondisyon-nou-trete/antos-kou": "Antòs kou",
  "/ht/kondisyon-nou-trete/tet-fe-mal-sevikojenik": "Tèt fè mal sèvikojenik",
  "/ht/kondisyon-nou-trete/konmosyon-serebral": "Konmosyon serebral",
  "/ht/kondisyon-nou-trete/doule-machwa-atm": "ATM / doulè machwa",
  "/ht/sevis": "Gade tout sèvis yo",
  "/ht/sevis/ajisteman-kiwopratik": "Ajisteman kiwopratik",
  "/ht/sevis/dekonpresyon-kolon": "Dekonpresyon kolòn",
  "/ht/sevis/terapi-tisi-mou": "Terapi tisi mou",
  "/ht/sevis/terapi-vantouz": "Terapi vantouz",
  "/ht/kiwoprate-pou-aksidan-machin": "Swen apre yon aksidan",
  "/ht/dr-abe-nasser": "Sou Dr. Abe",
  "/ht/komante-pasyan": "Kòmantè pasyan",
  "/ht/kontakte-nou": "Kontakte nou",
  "/ht/zon-nou-sevi": "Zòn nou sèvi",
  "/ht/mande-yon-randevou": "Mande yon randevou",
};

export interface BuildHtRelatedLinksOptions {
  currentPath: string;
  paths: string[];
  highlightPath?: string;
}

export function buildHtRelatedLinks({
  currentPath,
  paths,
  highlightPath,
}: BuildHtRelatedLinksOptions): ConditionRelatedLink[] {
  const links: ConditionRelatedLink[] = [];
  for (const path of paths) {
    if (path === currentPath) continue;
    const route = htRoutes.find((entry) => entry.path === path);
    if (!route) {
      throw new Error(
        `content/ht/related-links.ts: no Haitian Creole route registered for "${path}"`,
      );
    }
    if (!isPublished(route)) continue;
    const label = HT_RELATED_LINK_LABELS[path];
    if (!label) {
      throw new Error(`content/ht/related-links.ts: no label registered for path "${path}"`);
    }
    links.push({ label, href: route.path, highlighted: path === highlightPath });
  }
  return links;
}
