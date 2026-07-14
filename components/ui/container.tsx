import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element, defaults to div. */
  as?: ElementType;
}

/** Fluid page container per condition-page-spec §E: 1568px max, 24→80px gutters.
 * Wraps the `.container` utility defined in globals.css. */
export function Container({ as: Tag = "div", className, ...rest }: ContainerProps) {
  return <Tag className={cn("container", className)} {...rest} />;
}
