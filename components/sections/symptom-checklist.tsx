"use client";

import { useState } from "react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

export interface SymptomChecklistProps {
  heading: string;
  symptoms: string[];
  /** Encouragement copy shown once at least one symptom is checked — no
   * threshold language ("worth a conversation" applies from the first
   * checked box, not some minimum count), so this doesn't read as a
   * diagnostic tool. */
  note: string;
  className?: string;
}

/** Interactive "check any symptoms you've noticed" widget per the Figma
 * concussion-page frame: a checkbox list plus a live "N symptoms selected"
 * summary card. Purely local UI state — nothing submitted or persisted,
 * so it's a self-assessment prompt for the call/form, not a diagnostic
 * tool (the summary copy is worded to stay on the right side of that
 * line). */
export function SymptomChecklist({ heading, symptoms, note, className }: SymptomChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(symptom: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(symptom)) next.delete(symptom);
      else next.add(symptom);
      return next;
    });
  }

  return (
    <Section className={className}>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-h2 text-navy-900">{heading}</h2>
          <ul className="flex flex-col gap-2">
            {symptoms.map((symptom) => {
              const isChecked = checked.has(symptom);
              return (
                <li key={symptom}>
                  <label className="flex cursor-pointer items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(symptom)}
                      className="h-5 w-5 shrink-0 accent-navy-900"
                    />
                    <span className="font-sans text-body-lg text-navy-900">{symptom}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className={cn(
            "flex flex-col gap-3 bg-overlay-teal-12 p-8",
            checked.size === 0 && "opacity-60",
          )}
        >
          <span className="font-display text-5xl text-navy-900">{checked.size}</span>
          <span className="font-sans text-stat-label uppercase text-ink-500">
            symptoms selected
          </span>
          {checked.size > 0 && <p className="font-sans text-body-lg text-navy-900">{note}</p>}
        </div>
      </Container>
    </Section>
  );
}
