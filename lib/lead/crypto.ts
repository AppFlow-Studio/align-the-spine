/**
 * Server-only encryption for sensitive lead fields (`message`, `accidentDate`).
 * AES-256-GCM (authenticated) with a per-record random IV. The ciphertext
 * bundle is `iv(12) || authTag(16) || ciphertext`, base64-encoded, stored in
 * leads.sensitive_payload. The key lives only in the app environment
 * (LEAD_ENCRYPTION_KEY) and never enters the database, so a database compromise
 * alone cannot recover the plaintext.
 */
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

import { getEncryptionKey } from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/** Encrypts a small JSON object to a base64 bundle. Throws if the key is
 * missing/invalid (callers treat that as "cannot store sensitive data"). */
export function encryptSensitive(value: Record<string, unknown>): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

/** Decrypts a bundle produced by encryptSensitive. Throws on a tampered/invalid
 * bundle (GCM auth failure) or a wrong key. */
export function decryptSensitive(bundleBase64: string): Record<string, unknown> {
  const key = getEncryptionKey();
  const bundle = Buffer.from(bundleBase64, "base64");
  const iv = bundle.subarray(0, IV_LENGTH);
  const tag = bundle.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = bundle.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8")) as Record<string, unknown>;
}

/**
 * Keyed (HMAC-SHA256) hash of a client IP for the consent receipt — evidence
 * that a submission came from a network identifier without ever storing the raw
 * IP. Keyed with the encryption key so it can't be reversed with a plain
 * rainbow table. Returns null when no key is configured (receipt stores no IP
 * rather than a weak hash).
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  try {
    const key = getEncryptionKey();
    return createHmac("sha256", key).update(ip).digest("hex");
  } catch {
    return null;
  }
}
