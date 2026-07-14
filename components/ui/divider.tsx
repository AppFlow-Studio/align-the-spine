import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

/** Hairline rule per condition-page-spec §A6. Vertical needs a sized flex/grid parent. */
export function Divider({ orientation = "horizontal", className, ...rest }: DividerProps) {
  return (
    <hr
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      className={cn(
        "border-0 bg-mute-300",
        orientation === "horizontal" ? "h-px w-full" : "h-auto w-px self-stretch",
        className,
      )}
      {...rest}
    />
  );
}
