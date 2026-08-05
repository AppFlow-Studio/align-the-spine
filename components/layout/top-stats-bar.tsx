import { siteConfig } from "@/content/site";

interface TopStatsBarProps {
  className?: string;
}

/** Reviews/Visits/When it applies/Bilingual care/Insurance stat row, per
 * client-approved values in siteConfig.stats (content/site.ts). */
export function TopStatsBar({ className }: TopStatsBarProps) {
  return (
    <div className={className}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {siteConfig.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 font-sans">
            <dt className="text-stat-label uppercase text-mute-400">{stat.label}</dt>
            <dd className="text-stat-value text-ink-900">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
