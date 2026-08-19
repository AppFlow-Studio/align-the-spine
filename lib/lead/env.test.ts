import { afterEach, describe, expect, it } from "vitest";

import {
  getEncryptionKey,
  getLeadEmailConfig,
  includeSensitiveInEmail,
  isSupabaseConfigured,
} from "./env";

const ENV_KEYS = [
  "LEAD_EMAIL_INCLUDE_SENSITIVE",
  "LEAD_ENCRYPTION_KEY",
  "LEAD_EMAIL_FROM",
  "LEAD_EMAIL_REPLY_TO",
  "LEAD_NOTIFICATION_TO",
  "LEAD_NOTIFICATION_CC",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

afterEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});

describe("includeSensitiveInEmail (fail closed)", () => {
  it("is true only for the exact string 'true'", () => {
    process.env.LEAD_EMAIL_INCLUDE_SENSITIVE = "true";
    expect(includeSensitiveInEmail()).toBe(true);
  });

  it.each(["false", "1", "yes", "TRUE", "", undefined])("is false for %s", (value) => {
    if (value === undefined) delete process.env.LEAD_EMAIL_INCLUDE_SENSITIVE;
    else process.env.LEAD_EMAIL_INCLUDE_SENSITIVE = value;
    expect(includeSensitiveInEmail()).toBe(false);
  });
});

describe("getEncryptionKey", () => {
  it("accepts a 32-byte base64 key", () => {
    process.env.LEAD_ENCRYPTION_KEY = Buffer.alloc(32, 3).toString("base64");
    expect(getEncryptionKey().length).toBe(32);
  });

  it("accepts a 64-char hex key", () => {
    process.env.LEAD_ENCRYPTION_KEY = "a".repeat(64);
    expect(getEncryptionKey().length).toBe(32);
  });

  it("throws on a wrong-length key", () => {
    process.env.LEAD_ENCRYPTION_KEY = Buffer.alloc(16, 3).toString("base64");
    expect(() => getEncryptionKey()).toThrow();
  });
});

describe("getLeadEmailConfig", () => {
  it("parses the CC list and required fields", () => {
    process.env.LEAD_EMAIL_FROM = "A <a@chirobackpain.com>";
    process.env.LEAD_EMAIL_REPLY_TO = "a@chirobackpain.com";
    process.env.LEAD_NOTIFICATION_TO = "office@chirobackpain.com";
    process.env.LEAD_NOTIFICATION_CC = "one@x.com, two@x.com";
    const config = getLeadEmailConfig();
    expect(config.notificationCc).toEqual(["one@x.com", "two@x.com"]);
    expect(config.notificationTo).toBe("office@chirobackpain.com");
  });

  it("throws when a required field is missing", () => {
    process.env.LEAD_EMAIL_FROM = "A <a@chirobackpain.com>";
    expect(() => getLeadEmailConfig()).toThrow();
  });
});

describe("isSupabaseConfigured", () => {
  it("is false unless both URL and key are set", () => {
    expect(isSupabaseConfigured()).toBe(false);
    process.env.SUPABASE_URL = "https://x.supabase.co";
    expect(isSupabaseConfigured()).toBe(false);
    process.env.SUPABASE_SERVICE_ROLE_KEY = "svc";
    expect(isSupabaseConfigured()).toBe(true);
  });
});
