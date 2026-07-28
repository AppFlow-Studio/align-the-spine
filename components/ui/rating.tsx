import { StarIcon } from "@/components/ui/icons/star";
import { cn } from "@/lib/cn";

export interface RatingProps {
  /** 0–5 stars, defaults to full marks. */
  value?: number;
  /** Review count shown after the stars (e.g. 152). */
  count?: number;
  className?: string;
  /** Filled-star color, defaults to teal-500 (light surfaces). */
  filledClassName?: string;
  /** Empty-star color, defaults to mute-300. */
  emptyClassName?: string;
}

/** Star row + optional review count. */
export function Rating({
  value = 5,
  count,
  className,
  filledClassName = "text-teal-500",
  emptyClassName = "text-mute-300",
}: RatingProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      role="img"
      aria-label={`Rated ${value} out of 5 stars${count !== undefined ? ` from ${count} reviews` : ""}`}
    >
      <span className="inline-flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            className={cn("h-5 w-5", i < value ? filledClassName : emptyClassName)}
          />
        ))}
      </span>
      {count !== undefined && (
        <span aria-hidden="true" className="font-sans text-stat-label text-ink-500">
          {count}
        </span>
      )}
    </span>
  );
}
