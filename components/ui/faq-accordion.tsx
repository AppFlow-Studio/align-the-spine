"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { FAQ } from "@/content/faqs";
import { cn } from "@/lib/cn";

export interface FaqAccordionProps {
  items: FAQ[];
}

/** Single-open FAQ accordion per condition-page-spec §B11: hairline-divided
 * rows, "+" glyph rotates -45deg into an "x" on open, first item open by
 * default, Framer Motion height animation that respects prefers-reduced-motion. */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(items.length > 0 ? 0 : null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="divide-y divide-mute-300">
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `faq-button-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={item.question} className="py-6">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-6 text-left"
              >
                <span className="font-alt text-faq-q text-navy-900">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "font-alt text-faq-toggle text-navy-900 transition-transform duration-300",
                    open && "-rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pt-4 font-alt text-faq-a text-black">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
