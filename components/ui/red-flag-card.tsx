import { cn } from "@/lib/cn";

export interface RedFlagCardProps {
  title: string;
  bullets: string[];
  className?: string;
}

/** RedFlagCard per condition-page-spec §B3: rgba(88,160,160,0.12) box, r20,
 * title Geist SemiBold 25 navy-900, teal-dot bullets Geist 23. */
export function RedFlagCard({ title, bullets, className }: RedFlagCardProps) {
  return (
    <div className={cn("rounded-20 bg-overlay-teal-12 p-8", className)}>
      <p className="font-alt text-faq-q text-navy-900">{title}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2.5 h-[11px] w-[11px] shrink-0 rounded-full bg-teal-500"
            />
            <span className="font-alt text-redflag-bullet text-ink-900">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
