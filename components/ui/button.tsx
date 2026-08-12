import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";

/** Button variants per condition-page-spec §A8. All variants render as a
 * full pill (rounded-full, applied on the shared base classes below) —
 * previously some used a fixed-radius token (r40/r80) or no radius at all;
 * unified for a consistent rounded look site-wide. */
const variants = {
  /* Primary submit: #253067, h64, Poppins 20 white, trailing arrow */
  primary:
    "h-12 gap-3 bg-navy-900 px-6 font-sans text-button text-white hover:bg-navy-700 focus-visible:outline-navy-900",
  /* Teal/calc: #58a0a0, h48, Poppins Medium 16 white, trailing arrow */
  teal: "h-12 gap-3 bg-teal-500 px-6 font-sans text-button font-medium text-white hover:brightness-110 focus-visible:outline-teal-500",
  /* Big CTA: #253067, Poppins 22 white, circular arrow badge left.
   * Scales down below sm so it can't outgrow a 375px viewport (ATS-112).
   * min-h, not h, so a label that wraps in a narrow column (e.g.
   * DoctorProfile's tablet-width text column, ATS-092) grows the pill
   * instead of clipping the wrapped lines against a fixed height. */
  cta: "min-h-14 gap-4 bg-navy-900 px-6 font-sans text-button text-white hover:bg-navy-700 focus-visible:outline-navy-900 sm:min-h-[72px] sm:gap-6 sm:px-8 sm:text-btn-lg",
  /* Glass call-pill: white 15% overlay, phone icon + eyebrow + Poppins 22 white.
   * Scales down below sm — h-16/text-[20px] was applied unconditionally down
   * to 0px, making the pill disproportionately large next to the rest of a
   * mobile Hero (ATS-093 responsive fix). */
  glass:
    "h-12 gap-3 bg-overlay-white-15 px-4 font-sans text-[15px] leading-5 text-white backdrop-blur-sm hover:bg-white/25 focus-visible:outline-white sm:h-16 sm:gap-4 sm:px-6 sm:text-[20px] sm:leading-6 xl:h-[72px] xl:gap-5 xl:px-8 xl:text-btn-lg",
  /* Ghost link ("Book now"): Geist 22 #253067, trailing arrow */
  ghost:
    "gap-2 font-alt text-alt-label text-navy-900 hover:text-navy-700 focus-visible:outline-navy-900",
  /* Nav pill: navy 20% overlay, h52 */
  "nav-pill":
    "h-[52px] gap-2 bg-overlay-navy-20 px-6 font-sans text-nav text-white hover:bg-navy-900 focus-visible:outline-white",
  /* Services-row "Book": solid navy pill, h58, Poppins 20 white, no arrow */
  book: "h-11 px-8 font-sans text-button text-white bg-navy-900 hover:bg-navy-700 focus-visible:outline-navy-900",
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

export function Button({
  variant = "primary",
  eyebrow,
  loading = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center rounded-full transition-colors",
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
          <Spinner className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-navy-900 sm:h-11 sm:w-11"
          >
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
          </span>
        ))}
      {variant === "glass" &&
        (loading ? (
          <Spinner className="h-6 w-6" />
        ) : (
          <PhoneIcon className="size-7 shrink-0 rounded-full bg-teal-500 p-1.5 text-white sm:size-9 sm:p-2 xl:size-11 xl:p-2.5" />
        ))}
      {variant === "glass" && eyebrow ? (
        <span className="flex flex-col items-start text-left">
          <span className="font-alt text-[13px] text-mute-300 xl:text-btn-eyebrow">{eyebrow}</span>
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
          <ArrowRightIcon
            className={cn(
              "shrink-0 transition-transform duration-300 group-hover:translate-x-1",
              arrowSize[variant],
            )}
          />
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
