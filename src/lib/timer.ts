type TimerSnapshotInput = {
  breakEndsAt: string | null;
  durationMinutes: number;
  focusEndsAt: string | null;
  focusFinishedAt: string | null;
  nowMs: number;
  startedAt: string;
};

type BreakEligibilityInput = {
  breakPromptDismissed: boolean;
  breakTaken: boolean;
  durationMinutes: number;
  focusEnded: boolean;
  isOnBreak: boolean;
  secondsRemaining: number;
};

type ActualFocusInput = {
  breakDurationSeconds: number;
  breakStartedAt: string | null;
  nowMs: number;
  startedAt: string;
};

export function getTimerSnapshot({
  breakEndsAt,
  durationMinutes,
  focusEndsAt,
  focusFinishedAt,
  nowMs,
  startedAt
}: TimerSnapshotInput) {
  const fallbackFocusEnd =
    new Date(startedAt).getTime() + durationMinutes * 60 * 1000;
  const resolvedFocusEnd = focusEndsAt
    ? new Date(focusEndsAt).getTime()
    : fallbackFocusEnd;
  const resolvedBreakEnd = breakEndsAt ? new Date(breakEndsAt).getTime() : 0;
  const breakSecondsRemaining = Math.max(
    0,
    Math.ceil((resolvedBreakEnd - nowMs) / 1000)
  );
  const isOnBreak = breakSecondsRemaining > 0 && !focusFinishedAt;
  const focusSecondsRemaining = Math.max(
    0,
    Math.ceil((resolvedFocusEnd - nowMs) / 1000) -
      (isOnBreak ? breakSecondsRemaining : 0)
  );

  return { breakSecondsRemaining, focusSecondsRemaining, isOnBreak };
}

export function getMidpointBreakMinutes(durationMinutes: number) {
  return Math.min(5, Math.max(2, Math.round(durationMinutes * 0.1)));
}

export function isMidpointBreakEligible({
  breakPromptDismissed,
  breakTaken,
  durationMinutes,
  focusEnded,
  isOnBreak,
  secondsRemaining
}: BreakEligibilityInput) {
  return (
    !breakTaken &&
    !breakPromptDismissed &&
    !focusEnded &&
    !isOnBreak &&
    secondsRemaining <= (durationMinutes * 60) / 2
  );
}

export function getTimerProgress(
  plannedFocusSeconds: number,
  secondsRemaining: number
) {
  if (plannedFocusSeconds <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      ((plannedFocusSeconds - secondsRemaining) / plannedFocusSeconds) * 100
    )
  );
}

export function calculateActualFocusSeconds({
  breakDurationSeconds,
  breakStartedAt,
  nowMs,
  startedAt
}: ActualFocusInput) {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((nowMs - new Date(startedAt).getTime()) / 1000)
  );
  const usedBreakSeconds = breakStartedAt
    ? Math.min(
        breakDurationSeconds,
        Math.max(
          0,
          Math.floor((nowMs - new Date(breakStartedAt).getTime()) / 1000)
        )
      )
    : 0;

  return Math.max(0, elapsedSeconds - usedBreakSeconds);
}
