import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { cn } from "@/lib/cn";

/** Button variants per condition-page-spec §A8. */
const variants = {
  /* Primary submit: #253067, h64, r40, Poppins 20 white, trailing arrow */
  primary:
    "h-16 gap-3 rounded-40 bg-navy-900 px-8 font-sans text-button text-white hover:bg-navy-700 focus-visible:outline-navy-900",
  /* Teal/calc: #58a0a0, h64, r40, Poppins Medium 20 white, trailing arrow */
  teal: "h-16 gap-3 rounded-40 bg-teal-500 px-8 font-sans text-button font-medium text-white hover:brightness-110 focus-visible:outline-teal-500",
  /* Big CTA: #253067, h99, r80, Poppins 35 white, circular arrow badge left */
  cta: "h-[99px] gap-6 rounded-80 bg-navy-900 px-10 font-sans text-btn-lg text-white hover:bg-navy-700 focus-visible:outline-navy-900",
  /* Glass call-pill: white 15% overlay, h112, r80, phone icon + eyebrow + Poppins 35 white */
  glass:
    "h-20 gap-4 rounded-80 bg-overlay-white-15 px-6 font-sans text-[26px] leading-8 text-white backdrop-blur-sm hover:bg-white/25 focus-visible:outline-white xl:h-28 xl:gap-5 xl:px-10 xl:text-btn-lg",
  /* Ghost link ("Book now"): Geist 22 #253067, trailing arrow */
  ghost:
    "gap-2 font-alt text-alt-label text-navy-900 hover:text-navy-700 focus-visible:outline-navy-900",
  /* Nav pill: navy 20% overlay, h52, r40 */
  "nav-pill":
    "h-[52px] gap-2 rounded-40 bg-overlay-navy-20 px-6 font-sans text-nav text-white hover:bg-navy-900 focus-visible:outline-white",
} as const;

const arrowSize = {
  primary: "h-5 w-5",
  teal: "h-5 w-5",
  cta: "h-6 w-6",
  glass: "",
  ghost: "h-5 w-5",
  "nav-pill": "h-4 w-4",
} as const;

interface ButtonOwnProps {
  variant?: keyof typeof variants;
  /** Small muted line above the label — glass call-pill only (Geist 20 #cdcdcd). */
  eyebrow?: string;
  loading?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = ButtonOwnProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">)
  );

function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}

export function Button({
  variant = "primary",
  eyebrow,
  loading = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    loading && "pointer-events-none opacity-70",
    variants[variant],
    className,
  );

  const content = (
    <>
      {variant === "cta" &&
        (loading ? (
          <Spinner className="h-8 w-8" />
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-navy-900"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </span>
        ))}
      {variant === "glass" &&
        (loading ? (
          <Spinner className="h-8 w-8" />
        ) : (
          <PhoneIcon className="h-7 w-7 shrink-0 xl:h-9 xl:w-9" />
        ))}
      {variant === "glass" && eyebrow ? (
        <span className="flex flex-col items-start text-left">
          <span className="font-alt text-[16px] text-mute-300 xl:text-btn-eyebrow">{eyebrow}</span>
          <span>{children}</span>
        </span>
      ) : (
        <span>{children}</span>
      )}
      {(variant === "primary" ||
        variant === "teal" ||
        variant === "ghost" ||
        variant === "nav-pill") &&
        (loading ? (
          <Spinner className={arrowSize[variant]} />
        ) : (
          <ArrowRightIcon className={cn("shrink-0", arrowSize[variant])} />
        ))}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorRest } = rest as {
      href: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} aria-busy={loading || undefined} {...anchorRest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      aria-busy={loading || undefined}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      disabled={loading || (rest as ButtonHTMLAttributes<HTMLButtonElement>).disabled}
    >
      {content}
    </button>
  );
}
