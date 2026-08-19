import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { decryptSensitive, encryptSensitive, hashIp } from "./crypto";

const KEY_B64 = Buffer.alloc(32, 7).toString("base64");

describe("sensitive-field crypto", () => {
  beforeEach(() => {
    process.env.LEAD_ENCRYPTION_KEY = KEY_B64;
  });
  afterEach(() => {
    delete process.env.LEAD_ENCRYPTION_KEY;
  });

  it("round-trips an object", () => {
    const value = { message: "rear-ended on I-95", accidentDate: "2026-08-10" };
    const bundle = encryptSensitive(value);
    expect(bundle).not.toContain("rear-ended");
    expect(decryptSensitive(bundle)).toEqual(value);
  });

  it("produces a different ciphertext each time (random IV)", () => {
    const a = encryptSensitive({ message: "same" });
    const b = encryptSensitive({ message: "same" });
    expect(a).not.toEqual(b);
  });

  it("rejects a tampered bundle (GCM auth)", () => {
    const bundle = encryptSensitive({ message: "hi" });
    const bytes = Buffer.from(bundle, "base64");
    bytes[bytes.length - 1] ^= 0xff;
    expect(() => decryptSensitive(bytes.toString("base64"))).toThrow();
  });

  it("throws when the key is the wrong length", () => {
    process.env.LEAD_ENCRYPTION_KEY = "too-short";
    expect(() => encryptSensitive({ message: "hi" })).toThrow();
  });

  it("hashIp is deterministic and never returns the raw IP", () => {
    const h = hashIp("203.0.113.5");
    expect(h).toBe(hashIp("203.0.113.5"));
    expect(h).not.toContain("203.0.113.5");
    expect(hashIp(null)).toBeNull();
  });

  it("hashIp returns null without a key", () => {
    delete process.env.LEAD_ENCRYPTION_KEY;
    expect(hashIp("203.0.113.5")).toBeNull();
  });
});
