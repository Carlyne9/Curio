import { describe, expect, it } from "vitest";

import {
  calculateActualFocusSeconds,
  getMidpointBreakMinutes,
  getTimerProgress,
  getTimerSnapshot,
  isMidpointBreakEligible
} from "@/lib/timer";

describe("focus timer", () => {
  it("scales midpoint breaks between two and five minutes", () => {
    expect(getMidpointBreakMinutes(10)).toBe(2);
    expect(getMidpointBreakMinutes(25)).toBe(3);
    expect(getMidpointBreakMinutes(60)).toBe(5);
  });

  it("keeps break time out of remaining focus time", () => {
    const snapshot = getTimerSnapshot({
      breakEndsAt: "2026-08-01T12:12:00.000Z",
      durationMinutes: 25,
      focusEndsAt: "2026-08-01T12:27:00.000Z",
      focusFinishedAt: null,
      nowMs: Date.parse("2026-08-01T12:10:00.000Z"),
      startedAt: "2026-08-01T12:00:00.000Z"
    });

    expect(snapshot).toEqual({
      breakSecondsRemaining: 120,
      focusSecondsRemaining: 900,
      isOnBreak: true
    });
  });

  it("unlocks only one midpoint break after halfway", () => {
    expect(
      isMidpointBreakEligible({
        breakPromptDismissed: false,
        breakTaken: false,
        durationMinutes: 20,
        focusEnded: false,
        isOnBreak: false,
        secondsRemaining: 600
      })
    ).toBe(true);
    expect(
      isMidpointBreakEligible({
        breakPromptDismissed: false,
        breakTaken: true,
        durationMinutes: 20,
        focusEnded: false,
        isOnBreak: false,
        secondsRemaining: 500
      })
    ).toBe(false);
  });

  it("clamps progress and subtracts used break time", () => {
    expect(getTimerProgress(1200, 600)).toBe(50);
    expect(getTimerProgress(1200, -10)).toBe(100);
    expect(
      calculateActualFocusSeconds({
        breakDurationSeconds: 180,
        breakStartedAt: "2026-08-01T12:10:00.000Z",
        nowMs: Date.parse("2026-08-01T12:20:00.000Z"),
        startedAt: "2026-08-01T12:00:00.000Z"
      })
    ).toBe(1020);
  });
});
