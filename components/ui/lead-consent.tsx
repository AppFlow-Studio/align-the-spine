import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { cn } from "@/lib/cn";
import {
  LEAD_CONSENT_VERSION,
  LEAD_CONSENT_WORDING,
  LEAD_CONSENT_WORDING_ES,
  LEAD_CONSENT_WORDING_PT,
} from "@/lib/leads/contracts";

const CONSENT_WORDING: Record<Locale, string> = {
  en: LEAD_CONSENT_WORDING,
  es: LEAD_CONSENT_WORDING_ES,
  pt: LEAD_CONSENT_WORDING_PT,
  ht: LEAD_CONSENT_WORDING,
};

/** The consent line shown above every lead form. `data-consent-version` is
 * the same in both languages on purpose — the Spanish text is the same
 * consent, translated, not a different agreement (see
 * LEAD_CONSENT_WORDING_ES). */
export function LeadConsent({
  dark = false,
  className,
  locale = DEFAULT_LOCALE,
}: {
  dark?: boolean;
  className?: string;
  locale?: Locale;
}) {
  return (
    <p
      data-consent-version={LEAD_CONSENT_VERSION}
      className={cn("text-xs leading-5", dark ? "text-mute-300" : "text-ink-500", className)}
    >
      {CONSENT_WORDING[locale]}
    </p>
  );
}
