"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleStop,
  Clock3,
  Coffee,
  X
} from "lucide-react";

type MockState = "normal" | "halfway" | "onBreak" | "complete";

const STATE_LABELS: Record<MockState, string> = {
  normal: "Normal (before halfway)",
  halfway: "Halfway reached",
  onBreak: "On break",
  complete: "Focus complete"
};

const RESEARCH_POINTERS = ["Immune memory", "Vaccine types", "Protection mechanism"];

export default function FocusHeaderTestPage() {
  const [mockState, setMockState] = useState<MockState>("halfway");
  const [breakDismissed, setBreakDismissed] = useState(false);
  const [showDismiss, setShowDismiss] = useState(false);

  const showHalfwayCard = mockState === "halfway" && !breakDismissed;
  const showOnBreak = mockState === "onBreak";
  const progress =
    mockState === "normal"
      ? 28
      : mockState === "halfway"
        ? 50
        : mockState === "onBreak"
          ? 50
          : 100;
  const timeLabel =
    mockState === "onBreak" ? "05:00" : mockState === "complete" ? "00:00" : "10:00";

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-3xl">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          href="/design-system"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to design system
        </Link>

        <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Test page · not part of the system
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Focus session header, decluttered
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          No eyebrow, no &ldquo;FOCUS&rdquo; caption, no essay-length
          challenge text — just the question, what to research, and the
          timer.
        </p>
      </div>

      {/* Test harness only — not part of the real screen */}
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-dashed p-4 text-center">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Test control (not shown to users) — simulates where the timer is in
          the session
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {(Object.keys(STATE_LABELS) as MockState[]).map((state) => (
            <button
              aria-pressed={mockState === state}
              className={
                mockState === state
                  ? "rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                  : "rounded-full border px-4 py-2 text-sm font-semibold text-muted-foreground"
              }
              key={state}
              onClick={() => {
                setMockState(state);
                setBreakDismissed(false);
              }}
              type="button"
            >
              {STATE_LABELS[state]}
            </button>
          ))}
        </div>
      </div>

      {/* Everything below mirrors the real workspace header — no test controls here */}
      <div className="mx-auto mt-10 max-w-3xl">
        <button
          aria-label="Back to dashboard"
          className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition hover:border-primary hover:text-primary"
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <header className="rounded-[2rem] border bg-card p-5 shadow-sm shadow-black/5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                How do vaccines train the immune system?
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Research this
                </span>
                {RESEARCH_POINTERS.map((pointer) => (
                  <span
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    key={pointer}
                  >
                    {pointer}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-3 rounded-full bg-muted px-4 py-3 sm:w-auto">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <Clock3 aria-hidden="true" className="h-5 w-5 text-primary" />
              </span>
              <span className="text-2xl font-semibold tabular-nums">
                {timeLabel}
              </span>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              aria-label={`${progress}% of focus session elapsed`}
              className="h-full rounded-full bg-primary transition-[width]"
              role="progressbar"
              style={{ width: `${progress}%` }}
            />
          </div>

          {showOnBreak ? (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Coffee aria-hidden="true" className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Midpoint break in progress</p>
                  <p className="text-sm text-muted-foreground">
                    Step away briefly. Focus time is paused until this break
                    ends.
                  </p>
                </div>
              </div>
              <button
                className="rounded-full border border-primary bg-transparent px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                type="button"
              >
                Resume focus
              </button>
            </div>
          ) : null}

          {showHalfwayCard ? (
            <div
              className="group relative mt-4 rounded-2xl border bg-background p-4"
              onClick={() => setShowDismiss((prev) => !prev)}
              onMouseEnter={() => setShowDismiss(true)}
              onMouseLeave={() => setShowDismiss(false)}
            >
              <button
                aria-label="Dismiss"
                className={
                  showDismiss
                    ? "absolute -right-2 -top-2 flex h-6 w-6 scale-100 items-center justify-center rounded-full border bg-card text-muted-foreground opacity-100 shadow-sm transition-all duration-150 hover:text-foreground"
                    : "absolute -right-2 -top-2 flex h-6 w-6 scale-75 items-center justify-center rounded-full border bg-card text-muted-foreground opacity-0 shadow-sm transition-all duration-150"
                }
                onClick={(event) => {
                  event.stopPropagation();
                  setBreakDismissed(true);
                }}
                type="button"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Coffee
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 text-primary"
                  />
                  <div>
                    <p className="font-semibold">You are halfway there</p>
                    <p className="text-sm text-muted-foreground">
                      Take a 5-minute break, or keep going.
                    </p>
                  </div>
                </div>
                <button
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  type="button"
                >
                  Take a 5-minute break
                </button>
              </div>
            </div>
          ) : null}

          {mockState !== "complete" && !showOnBreak ? (
            <div className="mt-3 flex justify-end">
              <button
                className="inline-flex items-center gap-2 text-xs text-muted-foreground/60 transition hover:text-muted-foreground"
                type="button"
              >
                <CircleStop aria-hidden="true" className="h-3.5 w-3.5" />
                End focus early
              </button>
            </div>
          ) : null}
        </header>
      </div>
    </main>
  );
}
