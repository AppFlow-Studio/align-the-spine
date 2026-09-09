import type { ConditionRelatedLink } from "@/content/conditions/types";
import { ptRoutes } from "@/content/pt/seo";
import { isPublished } from "@/content/seo";

/** Portuguese counterpart of content/es/related-links.ts — the "related
 * content" pill rows at the bottom of the Portuguese condition and service
 * pages.
 *
 * Same contract: labels are keyed by the exact Portuguese route path, so a
 * label can never point somewhere other than what it says, and a draft
 * route is dropped from the row rather than linked. Every key must be a
 * real path in content/pt/seo.ts — buildPtRelatedLinks() throws otherwise,
 * so a typo fails the build instead of rendering a dead pill.
 */
const PT_RELATED_LINK_LABELS: Record<string, string> = {
  "/pt/condicoes": "Todas as condições que tratamos",
  "/pt/condicoes/dor-nas-costas": "Dor nas costas",
  "/pt/condicoes/dor-no-pescoco": "Dor no pescoço",
  "/pt/condicoes/ciatica": "Ciática",
  "/pt/condicoes/torcicolo-cervical": "Torcicolo cervical",
  "/pt/condicoes/dor-de-cabeca-cervicogenica": "Dor de cabeça cervicogênica",
  "/pt/condicoes/concussao": "Concussão",
  "/pt/condicoes/dor-na-mandibula-atm": "ATM / dor na mandíbula",
  "/pt/servicos": "Ver todos os serviços",
  "/pt/servicos/ajustes-quiropraticos": "Ajustes quiropráticos",
  "/pt/servicos/descompressao-da-coluna": "Descompressão da coluna",
  "/pt/servicos/terapia-de-tecidos-moles": "Terapia de tecidos moles",
  "/pt/servicos/terapia-de-ventosas": "Terapia de ventosas",
  "/pt/quiropratico-acidentes-de-carro": "Atendimento após um acidente",
  "/pt/dr-abe-nasser": "Sobre o Dr. Abe",
  "/pt/avaliacoes": "Avaliações de pacientes",
  "/pt/contato": "Contato",
  "/pt/areas-de-atendimento": "Áreas de atendimento",
  "/pt/solicitar-consulta": "Solicitar uma consulta",
};

export interface BuildPtRelatedLinksOptions {
  currentPath: string;
  paths: string[];
  highlightPath?: string;
}

export function buildPtRelatedLinks({
  currentPath,
  paths,
  highlightPath,
}: BuildPtRelatedLinksOptions): ConditionRelatedLink[] {
  const links: ConditionRelatedLink[] = [];
  for (const path of paths) {
    if (path === currentPath) continue;
    const route = ptRoutes.find((entry) => entry.path === path);
    if (!route) {
      throw new Error(`content/pt/related-links.ts: no Portuguese route registered for "${path}"`);
    }
    if (!isPublished(route)) continue;
    const label = PT_RELATED_LINK_LABELS[path];
    if (!label) {
      throw new Error(`content/pt/related-links.ts: no label registered for path "${path}"`);
    }
    links.push({ label, href: route.path, highlighted: path === highlightPath });
  }
  return links;
}
