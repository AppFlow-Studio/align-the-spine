import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/** Minimal, dependency-free avatar primitives (Avatar / AvatarImage /
 * AvatarFallback) matching the shadcn/ui avatar API that the kibo-ui
 * `Stories` component expects. Kept separate from this repo's own
 * "@/components/ui/avatar" (a single-image Avatar with a different prop
 * shape) so neither clobbers the other. */
export function Avatar({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

export type AvatarImageProps = ComponentProps<"img"> & { alt?: string };

export function AvatarImage({ className, alt = "", ...props }: AvatarImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- avatar primitives are framework-agnostic
    <img alt={alt} className={cn("aspect-square size-full object-cover", className)} {...props} />
  );
}

export function AvatarFallback({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-black/10",
        className,
      )}
      {...props}
    />
  );
}
