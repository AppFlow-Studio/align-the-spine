import { describe, expect, it } from "vitest";

import { buildLeadFormSchema, type LeadFieldConfig } from "./lead-form-schema";

function schemaFor(field: LeadFieldConfig) {
  return buildLeadFormSchema([field]);
}

describe("phone validation", () => {
  const schema = schemaFor({ name: "phone", label: "Phone", type: "tel" });

  it("accepts a well-formed 10-digit US number in common formats", () => {
    expect(schema.safeParse({ phone: "(954) 573-7192" }).success).toBe(true);
    expect(schema.safeParse({ phone: "954-573-7192" }).success).toBe(true);
    expect(schema.safeParse({ phone: "9545737192" }).success).toBe(true);
  });

  it("accepts 11 digits only with a leading country code 1", () => {
    expect(schema.safeParse({ phone: "19545737192" }).success).toBe(true);
    expect(schema.safeParse({ phone: "29545737192" }).success).toBe(false);
  });

  it("rejects too few digits", () => {
    expect(schema.safeParse({ phone: "123" }).success).toBe(false);
    expect(schema.safeParse({ phone: "954-5737" }).success).toBe(false);
  });

  it("rejects too many digits — doesn't just check punctuation shape", () => {
    expect(schema.safeParse({ phone: "9545737192999" }).success).toBe(false);
  });

  it("rejects letters and other non-phone characters", () => {
    expect(schema.safeParse({ phone: "call-me-maybe" }).success).toBe(false);
  });

  it("rejects a raw string over the length ceiling before it even reaches format checks", () => {
    expect(schema.safeParse({ phone: "9".repeat(50) }).success).toBe(false);
  });
});

describe("email validation", () => {
  const schema = schemaFor({ name: "email", label: "Email", type: "email" });

  it("accepts a well-formed email, trimming surrounding whitespace", () => {
    const parsed = schema.safeParse({ email: "  patient@example.com  " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe("patient@example.com");
  });

  it("rejects malformed email addresses", () => {
    expect(schema.safeParse({ email: "not-an-email" }).success).toBe(false);
    expect(schema.safeParse({ email: "missing@tld" }).success).toBe(false);
    expect(schema.safeParse({ email: "@example.com" }).success).toBe(false);
  });

  it("rejects header-injection attempts (newlines can't survive the email format check)", () => {
    expect(schema.safeParse({ email: "a@b.com\nBcc: evil@example.com" }).success).toBe(false);
  });

  it("rejects an email over the RFC practical length ceiling", () => {
    const tooLong = `${"a".repeat(250)}@example.com`;
    expect(schema.safeParse({ email: tooLong }).success).toBe(false);
  });
});

describe("required vs optional fields", () => {
  it("rejects an empty required field", () => {
    const schema = schemaFor({ name: "firstName", label: "First Name" });
    expect(schema.safeParse({ firstName: "" }).success).toBe(false);
    expect(schema.safeParse({ firstName: "   " }).success).toBe(false);
  });

  it("allows an empty optional field but still validates format when filled in", () => {
    const schema = schemaFor({
      name: "email",
      label: "Email",
      type: "email",
      required: false,
    });
    expect(schema.safeParse({ email: "" }).success).toBe(true);
    expect(schema.safeParse({ email: "not-an-email" }).success).toBe(false);
    expect(schema.safeParse({ email: "ok@example.com" }).success).toBe(true);
  });
});

describe("generic text fields", () => {
  it("trims whitespace and enforces a length ceiling", () => {
    const schema = schemaFor({ name: "firstName", label: "First Name" });
    const parsed = schema.safeParse({ firstName: "  Maria  " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.firstName).toBe("Maria");
    expect(schema.safeParse({ firstName: "a".repeat(200) }).success).toBe(false);
  });

  it("caps a textarea at a much longer ceiling than a plain text field", () => {
    const schema = schemaFor({ name: "message", label: "Message", type: "textarea" });
    expect(schema.safeParse({ message: "a".repeat(1000) }).success).toBe(true);
    expect(schema.safeParse({ message: "a".repeat(3000) }).success).toBe(false);
  });
});

describe("zip validation", () => {
  const schema = schemaFor({ name: "zip", label: "Zip Code", type: "zip" });

  it("accepts 5-digit and ZIP+4 formats", () => {
    expect(schema.safeParse({ zip: "33441" }).success).toBe(true);
    expect(schema.safeParse({ zip: "33441-1234" }).success).toBe(true);
  });

  it("rejects malformed ZIP codes", () => {
    expect(schema.safeParse({ zip: "abc" }).success).toBe(false);
    expect(schema.safeParse({ zip: "1234" }).success).toBe(false);
  });
});
