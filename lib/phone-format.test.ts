import { describe, expect, it } from "vitest";

import { formatUsPhoneAsYouType } from "./phone-format";

describe("formatUsPhoneAsYouType", () => {
  it("formats progressively as digits are typed", () => {
    expect(formatUsPhoneAsYouType("9")).toBe("(9");
    expect(formatUsPhoneAsYouType("954")).toBe("(954");
    expect(formatUsPhoneAsYouType("9545")).toBe("(954) 5");
    expect(formatUsPhoneAsYouType("954573")).toBe("(954) 573");
    expect(formatUsPhoneAsYouType("9545737")).toBe("(954) 573-7");
    expect(formatUsPhoneAsYouType("9545737192")).toBe("(954) 573-7192");
  });

  it("strips non-digit characters from pasted input", () => {
    expect(formatUsPhoneAsYouType("(954) 573-7192")).toBe("(954) 573-7192");
    expect(formatUsPhoneAsYouType("954.573.7192")).toBe("(954) 573-7192");
  });

  it("drops a leading country code 1 before formatting", () => {
    expect(formatUsPhoneAsYouType("19545737192")).toBe("(954) 573-7192");
  });

  it("silently caps at 10 digits instead of producing a too-long value", () => {
    expect(formatUsPhoneAsYouType("95457371929999")).toBe("(954) 573-7192");
  });

  it("returns an empty string for empty input", () => {
    expect(formatUsPhoneAsYouType("")).toBe("");
  });
});
