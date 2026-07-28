"use client";

import { useEffect, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import type { LegalSection } from "@/content/legal/types";
import { cn } from "@/lib/cn";

export interface OnThisPageNavProps {
  sections: Pick<LegalSection, "id" | "navLabel">[];
}

/** Offset that clears the fixed 100px Navbar, plus a small buffer. */
const SCROLLSPY_OFFSET = 140;

/** Tracks which section is currently under the sticky navbar, per ATS-120's
 * scrollspy requirement. Picks the last section (in document order) whose
 * top has crossed above the navbar offset — an IntersectionObserver
 * threshold-based approach was tried first, but it can never mark the final
 * section "active" once there's no more room to scroll it past the
 * bottom-margin boundary. */
function useActiveSectionId(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const updateActive = () => {
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - SCROLLSPY_OFFSET <= 0) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [ids]);

  return activeId;
}

function NavLinks({
  sections,
  activeId,
  onNavigate,
}: {
  sections: OnThisPageNavProps["sections"];
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {sections.map((section) => {
        const active = section.id === activeId;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={onNavigate}
              aria-current={active ? "location" : undefined}
              className={cn(
                "flex items-center gap-3 py-2 font-alt text-alt-label transition-colors",
                active ? "text-teal-500" : "text-ink-500 hover:text-navy-900",
              )}
            >
              <ArrowRightIcon className="h-4 w-4 shrink-0" />
              <span className="min-w-0">{section.navLabel}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Sticky "ON THIS PAGE" anchor nav (ATS-120): sidebar with scrollspy at
 * lg+, a collapsible disclosure on smaller screens. */
export function OnThisPageNav({ sections }: OnThisPageNavProps) {
  const activeId = useActiveSectionId(sections.map((section) => section.id));

  return (
    <nav aria-label="On this page">
      <details className="group border border-mute-300 px-5 py-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-eyebrow uppercase text-teal-500">
          On This Page
          <ChevronDownIcon className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-2">
          <NavLinks sections={sections} activeId={activeId} />
        </div>
      </details>

      <div className="hidden lg:sticky lg:top-[140px] lg:block">
        <p className="mb-4 font-sans text-eyebrow uppercase text-teal-500">On This Page</p>
        <NavLinks sections={sections} activeId={activeId} />
      </div>
    </nav>
  );
}
