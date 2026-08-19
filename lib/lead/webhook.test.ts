import { describe, expect, it } from "vitest";

import { mapResendEvent } from "./webhook";

describe("mapResendEvent", () => {
  it("keeps API-accepted distinct from delivered", () => {
    expect(mapResendEvent("email.sent")).toEqual({ deliveryState: "accepted", suppress: false });
    expect(mapResendEvent("email.delivered")).toEqual({
      deliveryState: "delivered",
      suppress: false,
    });
  });

  it("maps delayed/failed without suppressing", () => {
    expect(mapResendEvent("email.delivery_delayed")).toEqual({
      deliveryState: "delayed",
      suppress: false,
    });
    expect(mapResendEvent("email.failed")).toEqual({ deliveryState: "failed", suppress: false });
  });

  it("suppresses on bounce, complaint, and suppression", () => {
    expect(mapResendEvent("email.bounced")?.suppress).toBe(true);
    expect(mapResendEvent("email.complained")?.suppress).toBe(true);
    expect(mapResendEvent("email.suppressed")?.suppress).toBe(true);
  });

  it("ignores unknown event types", () => {
    expect(mapResendEvent("email.opened")).toBeNull();
    expect(mapResendEvent("nonsense")).toBeNull();
  });
});
