import { siteConfig } from "@/content/site";
import { isVerified } from "@/content/verified-value";

interface TopStatsBarProps {
  className?: string;
}

/** ATS-E4 (4.3/4.4/4.5/4.7): siteConfig.stats bundles review count,
 * same-day availability, bilingual care, and $0/PIP insurance billing —
 * all unverified claims. Renders nothing until that array is marked
 * verified with real, client-approved values. */
export function TopStatsBar({ className }: TopStatsBarProps) {
  if (!isVerified(siteConfig.stats)) return null;

  return (
    <div className={className}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {siteConfig.stats.value.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 font-sans">
            <dt className="text-stat-label uppercase text-mute-400">{stat.label}</dt>
            <dd className="text-stat-value text-ink-900">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
