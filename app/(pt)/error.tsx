"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { InfoIcon } from "@/components/ui/icons/info";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/content/site";

/** Portuguese error boundary — mirrors app/(es)/error.tsx. A Portuguese page
 * that throws must not fall back to an English error screen. */
export default function PtError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-900">
          <InfoIcon className="h-8 w-8 text-white" />
        </span>

        <h1 className="font-display text-display text-navy-900">Algo deu errado</h1>

        <p className="font-sans text-body-lg text-ink-500">
          Ocorreu um erro inesperado ao carregar esta página. Você pode tentar novamente, voltar ao
          início ou ligar para nós e atendemos imediatamente.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" onClick={reset}>
            Tentar novamente
          </Button>
          <Button href="/pt" variant="ghost">
            Voltar ao Início
          </Button>
          <Button href={siteConfig.business.phoneHref} variant="teal">
            Ligar para {siteConfig.business.phone}
          </Button>
        </div>
      </div>
    </Section>
  );
}
