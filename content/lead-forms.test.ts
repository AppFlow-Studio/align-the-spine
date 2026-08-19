import { describe, expect, it } from "vitest";

import { leadFormVariants } from "./lead-forms";

const CORE_REQUIRED_FIELDS = ["firstName", "lastName", "phone", "email", "carAccident"];

describe("lead form field uniformity", () => {
  it("every form collects the same core field set, all required", () => {
    for (const [variant, config] of Object.entries(leadFormVariants)) {
      for (const name of CORE_REQUIRED_FIELDS) {
        const field = config.fields.find((f) => f.name === name);
        expect(field, `${variant} is missing "${name}"`).toBeDefined();
        expect(field?.required, `${variant}'s "${name}" must be required`).not.toBe(false);
      }
    }
  });

  it("has no leftover single-field Name (superseded by firstName/lastName)", () => {
    for (const [variant, config] of Object.entries(leadFormVariants)) {
      expect(
        config.fields.some((f) => f.name === "name"),
        `${variant} still has a bare "name" field`,
      ).toBe(false);
    }
  });
});
