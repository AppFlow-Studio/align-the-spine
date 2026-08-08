import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface StatChipRowProps {
  className?: string;
}

/** Inline stat-chip row sharing TopStatsBar's data (siteConfig.stats) with a
 * glass-pill treatment for dark hero backgrounds, per condition-page-spec §B2. */
export function StatChipRow({ className }: StatChipRowProps) {
  if (!siteConfig.statsVerified) return null;

  return (
    <dl className={cn("flex flex-wrap gap-3", className)}>
      {siteConfig.stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5 bg-overlay-white-15 px-4 py-2">
          <dt className="font-sans text-stat-label uppercase text-mute-300">{stat.label}</dt>
          <dd className="font-sans text-stat-value text-white">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
