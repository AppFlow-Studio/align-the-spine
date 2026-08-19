/**
 * Server-only, fail-closed reader for the lead-platform environment contract
 * (see .env.example). None of these values may be exposed to the client, so
 * this module must never be imported from a "use client" component. Getters
 * throw at *call time* (not module load) when a required secret is missing, so
 * an unprovisioned environment fails a single request loudly instead of
 * crashing the whole build — callers catch and degrade (store the lead, skip
 * the email; return 503; etc.).
 */

/** Throws if this ever gets pulled into a browser bundle. Cheap belt-and-braces
 * on top of never importing it from a client component. */
function assertServer(): void {
  if (typeof window !== "undefined") {
    throw new Error("lib/lead/env.ts is server-only and must not run in the browser.");
  }
}

function readRequired(name: string): string {
  assertServer();
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function readOptional(name: string): string | undefined {
  assertServer();
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: readRequired("SUPABASE_URL"),
    serviceRoleKey: readRequired("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

/** True when the durable CRM can be reached — used to fail a lead submission
 * closed (503, no false success) rather than silently dropping it to email. */
export function isSupabaseConfigured(): boolean {
  return Boolean(readOptional("SUPABASE_URL") && readOptional("SUPABASE_SERVICE_ROLE_KEY"));
}

export function getResendApiKey(): string {
  return readRequired("RESEND_API_KEY");
}

export function getResendWebhookSecret(): string {
  return readRequired("RESEND_WEBHOOK_SECRET");
}

export interface SenderConfig {
  from: string;
  replyTo: string;
}

/** Just the sender identity — decoupled from the office recipient so the send
 * path (deliver.ts) doesn't require LEAD_NOTIFICATION_TO. */
export function getSenderConfig(): SenderConfig {
  return {
    from: readRequired("LEAD_EMAIL_FROM"),
    replyTo: readRequired("LEAD_EMAIL_REPLY_TO"),
  };
}

export interface LeadEmailConfig {
  from: string;
  replyTo: string;
  notificationTo: string;
  notificationCc: string[];
}

export function getLeadEmailConfig(): LeadEmailConfig {
  const cc = readOptional("LEAD_NOTIFICATION_CC");
  return {
    from: readRequired("LEAD_EMAIL_FROM"),
    replyTo: readRequired("LEAD_EMAIL_REPLY_TO"),
    notificationTo: readRequired("LEAD_NOTIFICATION_TO"),
    notificationCc: cc
      ? cc
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [],
  };
}

/**
 * Sensitive-field email gate. Fails closed: returns true ONLY for the exact
 * string "true". Unset, empty, "1", "yes", "TRUE", or any malformed value all
 * resolve to false, so decrypting `message`/`accidentDate` into an email can
 * never be enabled by accident.
 */
export function includeSensitiveInEmail(): boolean {
  assertServer();
  return process.env.LEAD_EMAIL_INCLUDE_SENSITIVE === "true";
}

/**
 * 32-byte AES-256 key for sensitive-payload encryption. Accepts base64 or
 * 64-char hex; throws on any length other than 32 bytes so a truncated key
 * can't silently weaken encryption.
 */
export function getEncryptionKey(): Buffer {
  const raw = readRequired("LEAD_ENCRYPTION_KEY");
  let key: Buffer;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    key = Buffer.from(raw, "hex");
  } else {
    key = Buffer.from(raw, "base64");
  }
  if (key.length !== 32) {
    throw new Error("LEAD_ENCRYPTION_KEY must decode to exactly 32 bytes (base64 or 64-char hex).");
  }
  return key;
}

export function isEncryptionConfigured(): boolean {
  try {
    getEncryptionKey();
    return true;
  } catch {
    return false;
  }
}

export function getWorkerSecret(): string {
  return readRequired("LEAD_DELIVERY_WORKER_SECRET");
}

export function getAdminPassword(): string {
  return readRequired("ADMIN_DASHBOARD_PASSWORD");
}
