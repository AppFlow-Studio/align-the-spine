import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Página não encontrada | Align the Spine Chiropractic",
  description: "A página que você procura não existe ou foi movida.",
  path: "/pt/404",
  robots: { index: false },
  locale: "pt",
});

/** Portuguese 404 — the Portuguese-tree counterpart of
 * app/(es)/not-found.tsx. An unknown /pt/... URL must land here (a real 404
 * in Portuguese), never on the English/Spanish 404 and never on a 200
 * shell: a soft 404 under /pt would teach Google that arbitrary Portuguese
 * paths resolve. */
export default function PtNotFound() {
  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <p
          aria-hidden="true"
          className="font-display text-[clamp(80px,14vw,160px)] leading-none text-navy-900/10"
        >
          404
        </p>

        <h1 className="font-display text-display text-navy-900">Página não encontrada</h1>

        <p className="font-sans text-body-lg text-ink-500">
          A página que você procura não existe ou foi movida. Vamos ajudar você a continuar a partir
          daqui.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/pt/solicitar-consulta" variant="teal">
            Solicitar Consulta
          </Button>
          <Button href="/pt" variant="primary">
            Voltar ao Início
          </Button>
        </div>
      </div>
    </Section>
  );
}
