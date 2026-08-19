/**
 * Resend transactional send (via fetch, matching the rest of the codebase) with
 * a stable idempotency key and transient/permanent error classification. API
 * acceptance is treated as `sent/accepted`, NOT final delivery — the webhook
 * (email.delivered/bounced/…) advances the real delivery state later.
 *
 * No open/click tracking is requested and the templates carry no tracked links
 * or UTM params; open/click tracking must also be OFF at the Resend domain
 * level for the patient acknowledgment (see docs).
 */
import { getResendApiKey, getSenderConfig } from "./env";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Overrides the configured Reply-To (office notification uses the patient's
   * email when valid). */
  replyTo?: string;
  cc?: string[];
  /** Stable per-outbox key: ats/office-lead/{id} | ats/patient-ack/{id}. */
  idempotencyKey: string;
}

export interface SendResult {
  externalId: string | null;
}

/** Thrown by sendResendEmail; `permanent` decides retry vs dead-letter. */
export class ResendSendError extends Error {
  permanent: boolean;
  status?: number;
  constructor(message: string, permanent: boolean, status?: number) {
    super(message);
    this.name = "ResendSendError";
    this.permanent = permanent;
    this.status = status;
  }
}

/** 4xx (except 401/403/429) = permanent: a malformed request or bad recipient
 * won't succeed on retry. 401/403 (auth/config), 429 (rate limit), and 5xx or
 * network errors = transient. */
function classify(status: number): boolean {
  if (status === 401 || status === 403 || status === 429) return false; // transient
  if (status >= 400 && status < 500) return true; // permanent
  return false; // 5xx transient
}

/** Redacts anything that looks like an email address from a provider error
 * before it's persisted/logged. */
export function sanitizeError(raw: string): string {
  return raw.replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, "[email]").slice(0, 1000);
}

export async function sendResendEmail(input: SendEmailInput): Promise<SendResult> {
  const apiKey = getResendApiKey();
  const { from, replyTo: defaultReplyTo } = getSenderConfig();

  let response: Response;
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        reply_to: input.replyTo ?? defaultReplyTo,
        ...(input.cc && input.cc.length > 0 ? { cc: input.cc } : {}),
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
  } catch (error) {
    // Network failure — always transient.
    throw new ResendSendError(
      sanitizeError(error instanceof Error ? error.message : "network error"),
      false,
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ResendSendError(
      sanitizeError(`Resend ${response.status}: ${body}`),
      classify(response.status),
      response.status,
    );
  }

  const data = (await response.json().catch(() => ({}))) as { id?: string };
  return { externalId: data.id ?? null };
}
