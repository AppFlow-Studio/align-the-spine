import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export interface EncryptedLeadPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
  keyVersion: number;
  fieldNames: string[];
}

function encryptionKey() {
  const encoded = process.env.LEAD_ENCRYPTION_KEY;
  if (!encoded) throw new Error("Lead encryption environment is incomplete.");
  const key = Buffer.from(encoded, "base64");
  if (key.byteLength !== 32) throw new Error("LEAD_ENCRYPTION_KEY must decode to 32 bytes.");
  return key;
}

export function encryptLeadSensitiveFields(
  fields: Record<string, string>,
): EncryptedLeadPayload | null {
  const fieldNames = Object.keys(fields).sort();
  if (fieldNames.length === 0) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(fields), "utf8"), cipher.final()]);
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    keyVersion: Number(process.env.LEAD_ENCRYPTION_KEY_VERSION ?? "1"),
    fieldNames,
  };
}

export function decryptLeadSensitiveFields(payload: EncryptedLeadPayload) {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(payload.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));
  return JSON.parse(
    Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, "base64")),
      decipher.final(),
    ]).toString("utf8"),
  ) as Record<string, string>;
}

export function postgresByteaToBase64(value: string) {
  return value.startsWith("\\x")
    ? Buffer.from(value.slice(2), "hex").toString("base64")
    : Buffer.from(value, "base64").toString("base64");
}
