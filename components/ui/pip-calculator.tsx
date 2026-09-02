"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DateField } from "@/components/ui/date-field";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";
import {
  calculatePipWindow,
  enPipWindowMessages,
  esPipWindowMessages,
  parseUsDate,
  ptPipWindowMessages,
} from "@/lib/pip-window";

export interface PipCalculatorProps {
  className?: string;
  locale?: Locale;
}

interface PipCalculatorCopy {
  heading: string;
  prompt: string;
  invalid: string;
  dateLabel: string;
  callPrefix: string;
}

/** Both prompts are non-promissory and say plainly that this is not a
 * coverage determination — see lib/pip-window.ts for the statutory
 * reasoning. The Spanish/Portuguese mirror the English claim-for-claim.
 * ht falls back to the English copy pending real translation
 * (ATS-SEO-136) — no ht page exists yet to render this component. */
const ENGLISH_PIP_COPY: PipCalculatorCopy = {
  heading: "When did the accident happen?",
  prompt:
    "Enter a date to estimate the general 14-day initial-care timing period. This is not a coverage determination.",
  invalid: "That doesn't look like a valid date — use mm/dd/yyyy.",
  dateLabel: "Accident date",
  callPrefix: "Call",
};
const COPY: Record<Locale, PipCalculatorCopy> = {
  en: ENGLISH_PIP_COPY,
  es: {
    heading: "¿Cuándo ocurrió el accidente?",
    prompt:
      "Ingrese una fecha para estimar el plazo general de 14 días para iniciar la atención. Esto no es una determinación de cobertura.",
    // mm/dd/aaaa, not dd/mm/aaaa: the field is a US date input parsed by
    // parseUsDate, and the practice, its patients and their insurers are
    // all in Florida. Showing a Spanish-speaking visitor a European date
    // order here would produce silently wrong dates, not a friendlier form.
    invalid: "Esa fecha no parece válida — use el formato mm/dd/aaaa.",
    dateLabel: "Fecha del accidente",
    callPrefix: "Llamar al",
  },
  pt: {
    heading: "Quando o acidente aconteceu?",
    prompt:
      "Digite uma data para estimar o prazo geral de 14 dias para iniciar o atendimento. Isto não é uma determinação de cobertura.",
    // mm/dd/aaaa, não dd/mm/aaaa: o campo é uma entrada de data dos EUA
    // interpretada por parseUsDate, e o consultório, seus pacientes e as
    // seguradoras estão todos na Flórida.
    invalid: "Essa data não parece válida — use o formato mm/dd/aaaa.",
    dateLabel: "Data do acidente",
    callPrefix: "Ligar para",
  },
  ht: ENGLISH_PIP_COPY,
};

/** 14-day PIP window date calculator (ATS-032), embedded in the accident
 * banner on condition pages by AccidentBanner (ATS-044). Visuals per
 * condition-page-spec §B4. */
export function PipCalculator({ className, locale = DEFAULT_LOCALE }: PipCalculatorProps) {
  const [value, setValue] = useState("");
  const copy = COPY[locale];
  const windowMessages =
    locale === "es"
      ? esPipWindowMessages
      : locale === "pt"
        ? ptPipWindowMessages
        : enPipWindowMessages;

  const date = parseUsDate(value);
  // Only call the input invalid once it's shaped like a full date (4-digit
  // year typed) — anything shorter is still being typed.
  const formatComplete = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value.trim());
  const helper = date
    ? calculatePipWindow(date, new Date(), windowMessages).message
    : formatComplete
      ? copy.invalid
      : copy.prompt;

  return (
    <div
      className={cn(
        "flex flex-col gap-5 bg-overlay-white-15 p-8 shadow-card backdrop-blur-md",
        className,
      )}
    >
      <h3 className="font-sans text-calc-heading text-white">{copy.heading}</h3>

      <DateField
        aria-label={copy.dateLabel}
        variant="dark"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      <div className="bg-white/10 px-4 py-3">
        <p role="status" className="font-sans text-calc-helper text-white">
          {helper}
        </p>
      </div>

      <Button variant="teal" href={siteConfig.business.phoneHref} className="w-full">
        {copy.callPrefix} {siteConfig.business.phone}
      </Button>
    </div>
  );
}
