import Image from "next/image";

import { cn } from "@/lib/cn";

const sizes = {
  sm: 48,
  md: 64,
  lg: 96,
} as const;

export interface AvatarProps {
  src: string;
  alt: string;
  size?: keyof typeof sizes;
  className?: string;
}

/** Circular photo (Dr. Abe, reviewers). */
export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const px = sizes[size];
  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}
