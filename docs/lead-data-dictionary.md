# Lead data dictionary

| Entity                    | Purpose                                                                 | Sensitive-data rule                                              |
| ------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `form_definitions`        | Immutable-by-version application form contract and consent wording      | No lead data                                                     |
| `lead_submissions`        | Source-of-truth lead, normalized contact JSON, status, priority, intent | No message, exact accident date, diagnosis, claim, or narrative  |
| `lead_attribution`        | Allowlisted first-party campaign/click/session attribution              | Paths contain no query strings; referrer is host-only; no raw IP |
| `lead_sensitive_payloads` | AES-256-GCM ciphertext, IV, tag, key version, and field-name manifest   | Service role only; no UI exposes it                              |
| `lead_consent_receipts`   | Exact wording/version/channel/granted state at submission               | Append-only through ingestion                                    |
| `lead_status_events`      | Status timeline with actor and reason (unused without an admin UI)      | Reasons must not contain clinical detail                         |
| `lead_rate_limits`        | Hourly HMAC-derived request fingerprint and count                       | No raw address                                                   |
| `lead_delivery_outbox`    | Durable Resend/Sheets event, ownership, retry/dead-letter state         | Payload is identifiers only                                      |
| `lead_delivery_attempts`  | One audit row per claimed provider attempt                              | Sanitized errors only                                            |

The eight form IDs are `heroEval`, `accidentEval`, `contactUs`, `carAccident`,
`reviewsEval`, `contact`, `eligibility`, and `booking`, all initially version 1.
