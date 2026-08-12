import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "h-10 w-10 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-16 w-16 [&_svg]:h-6 [&_svg]:w-6",
} as const;

interface ArrowButtonOwnProps {
  size?: keyof typeof sizes;
  label: string;
  className?: string;
}

type ArrowButtonProps = ArrowButtonOwnProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">)
  );

export function ArrowButton({ size = "md", label, className, ...rest }: ArrowButtonProps) {
  const classes = cn(
    "group inline-flex shrink-0 items-center justify-center rounded-full bg-navy-900 text-white",
    "transition-colors hover:bg-navy-700",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900",
    "disabled:pointer-events-none disabled:opacity-50",
    sizes[size],
    className,
  );
  const arrow = (
    <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
  );

  if (rest.href !== undefined) {
    return (
      <a
        className={classes}
        aria-label={label}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {arrow}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      aria-label={label}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {arrow}
    </button>
  );
}
