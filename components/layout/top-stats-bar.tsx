import { getVerifiedStats } from "@/content/site";

interface TopStatsBarProps {
  className?: string;
}

/** Stat row built from getVerifiedStats() (content/site.ts) — each claim is
 * individually gated (SEO Foundation Phase 1: they used to share one
 * blanket boolean, which is how a still-unverified review count and a
 * banned "$0 with PIP" claim ended up publishing alongside genuinely
 * approved values). Renders nothing at all once every claim is unverified,
 * and only the individually-verified stats otherwise — never a placeholder
 * or an empty grid cell for the rest. */
export function TopStatsBar({ className }: TopStatsBarProps) {
  const stats = getVerifiedStats();

  if (stats.length === 0) return null;

  return (
    <div className={className}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 font-sans">
            <dt className="text-stat-label uppercase text-mute-400">{stat.label}</dt>
            <dd className="text-stat-value text-ink-900">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
