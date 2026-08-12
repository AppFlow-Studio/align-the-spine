import type { ReactNode } from "react";

import { CheckIcon } from "@/components/ui/icons/check";
import { CloseIcon } from "@/components/ui/icons/close";
import type { FitChecklistRow } from "@/content/home-visits";
import { cn } from "@/lib/cn";

export interface FitChecklistProps {
  rows: FitChecklistRow[];
}

function ChecklistColumn({
  heading,
  headingClassName,
  icon,
  iconClassName,
  itemClassName,
  items,
}: {
  heading: string;
  headingClassName: string;
  icon: ReactNode;
  iconClassName: string;
  itemClassName: string;
  items: string[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className={cn("font-display text-h2", headingClassName)}>{heading}</h3>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-4 border-t border-mute-300 py-6 first:border-t-0"
          >
            <span
              className={cn(
                "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                iconClassName,
              )}
            >
              {icon}
            </span>
            <p className={cn("font-alt text-alt-label", itemClassName)}>{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Usually a good fit" (check) vs "Usually better in-office" (x) two-column
 * comparison per the Home-visits artboard (ATS-111). Independent stacked
 * columns rather than a shared row grid — the artboard's divider lines don't
 * align row-for-row between columns, and it keeps the mobile stack in two
 * readable groups instead of interleaving both lists. */
export function FitChecklist({ rows }: FitChecklistProps) {
  return (
    <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
      <ChecklistColumn
        heading="Usually a good fit"
        headingClassName="text-teal-500"
        icon={<CheckIcon className="h-3.5 w-3.5 text-white" />}
        iconClassName="bg-[#58A0A0]"
        itemClassName="text-ink-900"
        items={rows.map((row) => row.goodFit)}
      />
      <ChecklistColumn
        heading="Usually better in-office"
        headingClassName="text-ink-500"
        icon={<CloseIcon className="h-3.5 w-3.5 text-white" />}
        iconClassName="bg-mute-350"
        itemClassName="text-ink-500"
        items={rows.map((row) => row.inOffice)}
      />
    </div>
  );
}
