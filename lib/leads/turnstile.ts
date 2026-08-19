const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Pure response-shape check, separated from the fetch call itself so it's
 * unit-testable without mocking the network — same split as
 * isSuccessfulSheetsResponse in delivery.ts. */
export function isTurnstileSuccess(response: unknown): boolean {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as { success: unknown }).success === true
  );
}

/** Verifies an invisible Cloudflare Turnstile token server-side — the actual
 * bot check; the client only ever produces a token, never a pass/fail
 * verdict. Returns true (skips verification) when TURNSTILE_SECRET_KEY is
 * unset, same dev-safe pattern as RESEND_API_KEY: local/preview
 * environments that haven't configured a Turnstile widget yet aren't
 * blocked from submitting, but production MUST set this or the check is
 * inert. Fails closed (returns false) on any network/response error —
 * unlike a missing secret, an error while a secret IS configured is
 * ambiguous enough that erring toward blocking is the safer default for an
 * anti-abuse check. */
export async function verifyTurnstileToken(token: string, remoteIp: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: remoteIp }),
    });
    if (!response.ok) return false;
    return isTurnstileSuccess(await response.json());
  } catch {
    return false;
  }
}
