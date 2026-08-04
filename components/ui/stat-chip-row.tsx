import { siteConfig } from "@/content/site";
import { isVerified } from "@/content/verified-value";
import { cn } from "@/lib/cn";

export interface StatChipRowProps {
  className?: string;
}

/** Inline stat-chip row sharing TopStatsBar's data (siteConfig.stats) with a
 * glass-pill treatment for dark hero backgrounds, per condition-page-spec §B2.
 * ATS-E4 (4.3/4.4/4.5/4.7): renders nothing until siteConfig.stats is
 * marked verified — see TopStatsBar's doc comment. */
export function StatChipRow({ className }: StatChipRowProps) {
  if (!isVerified(siteConfig.stats)) return null;

  return (
    <dl className={cn("flex flex-wrap gap-3", className)}>
      {siteConfig.stats.value.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5 bg-overlay-white-15 px-4 py-2">
          <dt className="font-sans text-stat-label uppercase text-mute-300">{stat.label}</dt>
          <dd className="font-sans text-stat-value text-white">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
