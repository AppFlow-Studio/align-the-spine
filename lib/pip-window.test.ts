import { describe, expect, it } from "vitest";

import { calculatePipWindow, parseUsDate, PIP_WINDOW_DAYS } from "./pip-window";

const TODAY = new Date(2026, 6, 15); // Jul 15 2026

function daysAgo(days: number) {
  return new Date(2026, 6, 15 - days);
}

describe("calculatePipWindow", () => {
  it("accident today → full window remaining, active", () => {
    const result = calculatePipWindow(daysAgo(0), TODAY);
    expect(result.status).toBe("active");
    expect(result.daysRemaining).toBe(PIP_WINDOW_DAYS);
    expect(result.message).toContain("14 days left");
  });

  it("mid-window → correct days remaining, active", () => {
    const result = calculatePipWindow(daysAgo(5), TODAY);
    expect(result.status).toBe("active");
    expect(result.daysRemaining).toBe(9);
    expect(result.message).toContain("9 days left");
  });

  it("last active day before urgency threshold", () => {
    const result = calculatePipWindow(daysAgo(10), TODAY);
    expect(result.status).toBe("active");
    expect(result.daysRemaining).toBe(4);
  });

  it("3 days left → urgent", () => {
    const result = calculatePipWindow(daysAgo(11), TODAY);
    expect(result.status).toBe("urgent");
    expect(result.daysRemaining).toBe(3);
    expect(result.message).toContain("Only 3 days left");
  });

  it("1 day left → urgent, singular copy", () => {
    const result = calculatePipWindow(daysAgo(13), TODAY);
    expect(result.status).toBe("urgent");
    expect(result.daysRemaining).toBe(1);
    expect(result.message).toContain("Only 1 day left");
  });

  it("day 14 → last day, urgent", () => {
    const result = calculatePipWindow(daysAgo(14), TODAY);
    expect(result.status).toBe("urgent");
    expect(result.daysRemaining).toBe(0);
    expect(result.message).toContain("last day");
  });

  it("day 15 → expired", () => {
    const result = calculatePipWindow(daysAgo(15), TODAY);
    expect(result.status).toBe("expired");
    expect(result.daysRemaining).toBe(-1);
    expect(result.message).toContain("has passed");
  });

  it("long past accident → expired", () => {
    const result = calculatePipWindow(new Date(2025, 0, 1), TODAY);
    expect(result.status).toBe("expired");
  });

  it("future date → future status", () => {
    const result = calculatePipWindow(daysAgo(-1), TODAY);
    expect(result.status).toBe("future");
    expect(result.message).toContain("future");
  });

  it("ignores time of day — late-night accident date still counts as its calendar day", () => {
    const accident = new Date(2026, 6, 10, 23, 59);
    const today = new Date(2026, 6, 15, 0, 1);
    expect(calculatePipWindow(accident, today).daysRemaining).toBe(9);
  });

  it("counts calendar days across month boundaries", () => {
    const result = calculatePipWindow(new Date(2026, 5, 30), TODAY); // Jun 30
    expect(result.daysRemaining).toBe(PIP_WINDOW_DAYS - 15);
    expect(result.status).toBe("expired");
  });
});

describe("parseUsDate", () => {
  it("parses a valid mm/dd/yyyy date", () => {
    const date = parseUsDate("07/04/2026");
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(6);
    expect(date?.getDate()).toBe(4);
  });

  it("accepts single-digit month and day", () => {
    expect(parseUsDate("7/4/2026")).not.toBeNull();
  });

  it("rejects incomplete input", () => {
    expect(parseUsDate("07/04")).toBeNull();
    expect(parseUsDate("07/04/26")).toBeNull();
    expect(parseUsDate("")).toBeNull();
  });

  it("rejects impossible dates instead of rolling them over", () => {
    expect(parseUsDate("02/30/2026")).toBeNull();
    expect(parseUsDate("13/01/2026")).toBeNull();
    expect(parseUsDate("00/10/2026")).toBeNull();
    expect(parseUsDate("04/31/2026")).toBeNull();
  });

  it("rejects non-date text", () => {
    expect(parseUsDate("yesterday")).toBeNull();
  });
});
