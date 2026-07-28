"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DateField } from "@/components/ui/date-field";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";
import { calculatePipWindow, parseUsDate } from "@/lib/pip-window";

export interface PipCalculatorProps {
  className?: string;
}

const PROMPT = "Enter your accident date to see how many days you have left to begin treatment.";
const INVALID = "That doesn't look like a valid date — use mm/dd/yyyy.";

/** 14-day PIP window date calculator (ATS-032), embedded in the accident
 * banner on condition pages by AccidentBanner (ATS-044). Visuals per
 * condition-page-spec §B4. */
export function PipCalculator({ className }: PipCalculatorProps) {
  const [value, setValue] = useState("");

  const date = parseUsDate(value);
  // Only call the input invalid once it's shaped like a full date (4-digit
  // year typed) — anything shorter is still being typed.
  const formatComplete = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value.trim());
  const helper = date ? calculatePipWindow(date).message : formatComplete ? INVALID : PROMPT;

  return (
    <div
      className={cn(
        "flex flex-col gap-5 bg-overlay-white-15 p-8 shadow-card backdrop-blur-md",
        className,
      )}
    >
      <h3 className="font-sans text-calc-heading text-white">When did the accident happen?</h3>

      <DateField
        aria-label="Accident date"
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
        Call {siteConfig.business.phone}
      </Button>
    </div>
  );
}
