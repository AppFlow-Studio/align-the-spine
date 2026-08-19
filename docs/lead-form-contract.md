# LeadForm props contract (ATS-030)

`components/ui/lead-form.tsx` is the single config-driven form engine for every
lead form on the site. Page tickets consume it via the variant presets in
`content/lead-forms.ts` — do not build one-off forms.

## Quick start

```tsx
import { LeadForm } from "@/components/ui/lead-form";
import { leadFormVariants } from "@/content/lead-forms";

<LeadForm heading="Schedule Your Evaluation" {...leadFormVariants.heroEval} />;
```

Inside a Hero, pass fields through `HeroProps["form"]` instead (defaults to the
hero-eval variant when `fields` is omitted):

```tsx
<Hero form={{ heading, submitLabel, fields: leadFormVariants.carAccident.fields }} ... />
```

## `LeadFormProps`

| Prop             | Type                                        | Required | Notes                                                                                                   |
| ---------------- | ------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `heading`        | `string`                                    | yes      | Rendered as an `<h2>` above the fields.                                                                 |
| `variant`        | `string`                                    | no       | Variant key for server-side validation in `/api/lead`; defaults to `"heroEval"`. Presets include it.    |
| `fields`         | `LeadFieldConfig[]`                         | yes      | Drives both rendering and the derived zod schema.                                                       |
| `submitLabel`    | `string`                                    | yes      | CTA text on the submit button.                                                                          |
| `onSubmit`       | `(values: LeadFormValues) => Promise<void>` | no       | Overrides the default submission (POST `/api/lead` → redirect `/thank-you`). Success then shows inline. |
| `successMessage` | `string`                                    | no       | Inline success text for the `onSubmit`-override path. Defaults to "Thanks — we'll be in touch shortly." |
| `fieldVariant`   | `"dark" \| "light"`                         | no       | Field styling surface; defaults to `"dark"` (hero panels).                                              |
| `className`      | `string`                                    | no       | Merged onto the `<form>`.                                                                               |

Always single-step — every field renders at once, on every surface including
mobile. A prior two-step ("Continue" then reveal the rest) variant was removed
sitewide (ATS-147): with 3-5 fields per variant, splitting them added friction
without a real conversion payoff.

`LeadFormValues` is `Record<string, string>` keyed by each field's `name`.

## `LeadFieldConfig`

| Key            | Type                                                            | Default  | Notes                                                                 |
| -------------- | --------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| `name`         | `string`                                                        | —        | Key in the submitted values object.                                   |
| `label`        | `string`                                                        | —        | Visible field label.                                                  |
| `type`         | `"text" \| "tel" \| "email" \| "zip" \| "select" \| "textarea"` | `"text"` | `zip` renders a numeric text input with ZIP validation.               |
| `required`     | `boolean`                                                       | `true`   | Optional fields still format-validate (tel/email/zip) when filled in. |
| `half`         | `boolean`                                                       | `false`  | Half-width fields pair up side by side in the two-column grid.        |
| `options`      | `{ label: string; value: string }[]`                            | —        | Required for `type: "select"`.                                        |
| `placeholder`  | `string`                                                        | —        | For selects this becomes the disabled first option.                   |
| `autoComplete` | `string`                                                        | —        | Forwarded to the input.                                               |

## Variant presets (`content/lead-forms.ts`)

Each preset is `{ fields, submitLabel }`; spread it into `<LeadForm />`. Every
variant except `booking` carries a shared, optional `carAccident` select
("Is this related to a car accident?", Yes/No) — `booking`'s own "Reason for
Visit" select serves the same purpose via its "Accident" option instead of a
redundant second question. `lib/analytics.ts`'s `classifyLeadPriority` reads
whichever of the two is present to flag a lead high-priority for Ads/triage —
see that file's doc comment for the exact precedence.

| Variant        | Fields                                                                         | Submit label                        |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `heroEval`     | First, Last, Phone, Email, car-accident?                                       | Schedule My Evaluation              |
| `accidentEval` | First, Last, Phone, Email, Date of Accident (no car-accident?)                 | Schedule My Evaluation              |
| `carAccident`  | First, Last, Phone, Email, car-accident?                                       | Schedule My Car Accident Evaluation |
| `contactUs`    | Name, Phone, Email, car-accident?, Message                                     | Send Message                        |
| `contact`      | First, Last, Email, Phone, Zip, car-accident?, Best Time to Contact (optional) | Contact Us                          |
| `eligibility`  | First, Last, Phone, Zip, car-accident? (no email)                              | Check Eligibility                   |
| `booking`      | First, Phone, Last, Reason for Visit (select, incl. "Accident")                | Schedule My Evaluation              |

The `booking` variant is consumed by `BookingForm`
(`components/sections/booking-form.tsx`) on /book rather than `<LeadForm />` —
same schema, same `/api/lead` pipeline.

## Validation & states

- Schema per variant is derived from its fields config via
  `buildLeadFormSchema` (zod + `@hookform/resolvers`, `lib/lead-form-schema.ts`):
  every field is trimmed and length-capped regardless of type; required
  fields must be non-empty after trimming. `tel` requires a real 10-digit US
  number (11 with a leading country code 1) — counted by digit, not just
  punctuation shape — and `components/ui/lead-form.tsx` formats it
  as-you-type via `lib/phone-format.ts`. `email` uses zod's built-in
  validator with a 254-char ceiling (this also closes an email-header-
  injection path through `/api/lead`'s `reply_to`). `zip` enforces
  5-digit/ZIP+4.
- Errors render inline under each field through the ATS-021 primitives
  (`Input` / `Select` / `Textarea`), with `aria-invalid` + `aria-describedby`.
- Submit button shows a loading spinner and is disabled while submitting; a
  failed `onSubmit` renders a retryable error line, success resets the form and
  shows `successMessage`.

## Submission pipeline (ATS-031)

Every valid submit sends a stable client submission UUID, form ID/version,
strictly validated values, path-only source page, consent version, and an
allowlisted attribution object to `/api/lead`. The route applies origin,
content-type, 16 KiB size, honeypot, rate-limit, and strict schema checks. It
normalizes contact data, AES-256-GCM encrypts `message` and `accidentDate`, and
calls the service-only transactional ingestion RPC.

Success is returned only after Supabase durably commits the lead, attribution,
consent receipt, initial status event, and Resend/Sheets outbox records. Only
then does the browser emit a non-PII conversion event and navigate to
`/thank-you`. Resend and Google Sheets are retryable downstream destinations;
they are never the source of truth and their failure does not invalidate the
lead. See `docs/lead-crm-operations.md`.

## Spam guard

Four independent layers, in the order `/api/lead` checks them:

1. **Origin allowlist** (`isAllowedLeadOrigin`) — real 403. A request from
   the wrong origin is a CSRF/misconfiguration concern, not spam.
2. **US-only geoblock** (`isAllowedLeadGeo`, `lib/leads/request.ts`) — reads
   Vercel's own edge `x-vercel-ip-country` header (no third-party IP
   lookup, no added latency). Only present on Vercel's production/preview
   edge network — absent in local dev or any other hosting, where it
   allows everything rather than blocking every local/non-Vercel
   submission. The practice has one office in Deerfield Beach, FL, so
   there's no legitimate reason for a non-US submission. Real 403
   (`error: "region_not_supported"`), not a fake success — a geo mismatch
   can hit an actual visitor (traveling, a VPN, a misreported edge region),
   unlike the honeypot below, so they need to see the rejection rather than
   think a dropped submission went through (owner direction: fail loudly).
3. **Honeypot** — a visually hidden "website" input sits outside
   react-hook-form. If a bot fills it, the client fakes success without
   POSTing, and `/api/lead` independently fakes success (200) for direct
   POSTs with a filled honeypot. This one stays silent deliberately: no
   genuine visitor can ever trigger it (it's invisible and no real person
   fills a field they can't see), so there's no false-positive risk to warn
   anyone about — only a bot blindly filling every field ever reaches it.
4. **Invisible Cloudflare Turnstile** (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` /
   `TURNSTILE_SECRET_KEY`) — `lib/leads/turnstile-client.ts` renders one
   `size: "invisible"` widget site-wide (mounted once by
   `components/analytics/turnstile-script.tsx`) and fetches a fresh,
   single-use token per submit; `submitLead()` (`lib/leads/client.ts`) is
   the one function every form on the site calls through, so this lives
   there rather than being duplicated per form. `/api/lead` verifies the
   token server-side via `verifyTurnstileToken`
   (`lib/leads/turnstile.ts`) — a real browser essentially never fails
   this, so a failure is treated as a strong bot signal, but "almost never"
   isn't "never" (an ad-blocker or a slow connection can block the script
   for a real visitor too) — real 403 (`error: "bot_check_failed"`), same
   fail-loudly reasoning as the geoblock. No checkbox, no visible step for
   a legitimate visitor in the normal case; Cloudflare's own risk engine
   can still escalate to a visible interactive challenge for a
   higher-risk session, same as any Turnstile deployment.

A blocked geo/Turnstile request surfaces through `submitLead()`'s existing
generic throw → each form's already-existing "Something went wrong. Please
try again." error state — no new per-error-code messaging, so a bot probing
the endpoint still can't distinguish which of the two it hit.

Both keys are dev-safe when unset: `TURNSTILE_SECRET_KEY` unset skips
server-side verification entirely (inert, not blocking), and
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset makes the client send an empty
token. **Production must set both real keys** (Cloudflare dashboard >
Turnstile > Add widget > mode "Invisible") or the check does nothing.
Cloudflare's public, always-pass test keys
(`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) are
safe for local dev before a real widget exists.
