import { cn } from "@/lib/cn";
import { LEAD_CONSENT_VERSION, LEAD_CONSENT_WORDING } from "@/lib/leads/contracts";

export function LeadConsent({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <p
      data-consent-version={LEAD_CONSENT_VERSION}
      className={cn("text-xs leading-5", dark ? "text-mute-300" : "text-ink-500", className)}
    >
      {LEAD_CONSENT_WORDING}
    </p>
  );
}
