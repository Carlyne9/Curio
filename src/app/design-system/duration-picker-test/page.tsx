"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import styles from "./duration-picker-test.module.css";

type ResearchDifficulty = "beginner" | "intermediate" | "advanced";

const STEP_MINUTES = 5;
const ITEM_SPACING = 110;

const DIFFICULTY_CONFIG: Record<
  ResearchDifficulty,
  {
    label: string;
    min: number;
    max: number;
    defaultValue: number;
    quick: readonly number[];
  }
> = {
  beginner: {
    label: "Beginner",
    min: 10,
    max: 45,
    defaultValue: 15,
    quick: [10, 15, 25, 45]
  },
  intermediate: {
    label: "Intermediate",
    min: 15,
    max: 60,
    defaultValue: 25,
    quick: [15, 25, 45, 60]
  },
  advanced: {
    label: "Advanced",
    min: 30,
    max: 90,
    defaultValue: 45,
    quick: [30, 45, 60, 90]
  }
};

const DIFFICULTY_ORDER: ResearchDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced"
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * With scroll-snap-align: center and no scroll-padding, an item at index
 * `steps` comes to rest at (steps + 0.5) * ITEM_SPACING — not
 * steps * ITEM_SPACING — because the snap point is the item's own center,
 * which sits half an item-width in from where the item starts.
 */
function restScrollLeft(steps: number) {
  return (steps + 0.5) * ITEM_SPACING;
}

export default function DurationPickerTestPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [padding, setPadding] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [difficulty, setDifficulty] = useState<ResearchDifficulty>(
    "intermediate"
  );
  const config = DIFFICULTY_CONFIG[difficulty];
  const [duration, setDuration] = useState(config.defaultValue);
  const isProgrammaticScroll = useRef(false);

  const minutesRange = useMemo(
    () =>
      Array.from(
        { length: (config.max - config.min) / STEP_MINUTES + 1 },
        (_, i) => config.min + i * STEP_MINUTES
      ),
    [config.max, config.min]
  );

  useEffect(() => {
    function measure() {
      if (trackRef.current) {
        setPadding(trackRef.current.offsetWidth / 2);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Difficulty (or the initial measurement) changed: jump to that level's
  // default and recenter in one step, reading the new config directly
  // instead of the (possibly still-stale, pre-re-render) `duration` state.
  useEffect(() => {
    if (!trackRef.current || padding === 0) return;
    const nextDefault = DIFFICULTY_CONFIG[difficulty].defaultValue;
    const nextMin = DIFFICULTY_CONFIG[difficulty].min;
    setDuration(nextDefault);
    isProgrammaticScroll.current = true;
    const target = restScrollLeft((nextDefault - nextMin) / STEP_MINUTES);
    trackRef.current.scrollLeft = target;
    setScrollLeft(target);
    const id = requestAnimationFrame(() => {
      isProgrammaticScroll.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [padding, difficulty]);

  function handleScroll() {
    if (!trackRef.current || isProgrammaticScroll.current) return;
    const left = trackRef.current.scrollLeft;
    setScrollLeft(left);
    const raw = left / ITEM_SPACING - 0.5;
    const steps = clamp(Math.round(raw), 0, minutesRange.length - 1);
    setDuration(config.min + steps * STEP_MINUTES);
  }

  function scrollToValue(value: number) {
    if (!trackRef.current) return;
    trackRef.current.scrollTo({
      left: restScrollLeft((value - config.min) / STEP_MINUTES),
      behavior: "smooth"
    });
  }

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
          Timer picker, adapted to difficulty
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          No selector, no explanation — the wheel&apos;s range, default, and
          quick badges just quietly come from whichever difficulty was
          already chosen back in step 2.
        </p>
      </div>

      {/* Test harness only — lets us preview all three configs here. Not part of the real screen. */}
      <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed p-4 text-center">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Test control (not shown to users) — simulates the difficulty
          already picked in step 2
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {DIFFICULTY_ORDER.map((level) => (
            <button
              aria-pressed={difficulty === level}
              className={
                difficulty === level
                  ? "rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                  : "rounded-full border px-4 py-2 text-sm font-semibold text-muted-foreground"
              }
              key={level}
              onClick={() => setDifficulty(level)}
              type="button"
            >
              {DIFFICULTY_CONFIG[level].label}
            </button>
          ))}
        </div>
      </div>

      {/* Everything below mirrors the real "Step 4 of 4" screen — no difficulty control here */}
      <div className="mx-auto mt-10 max-w-2xl text-center">
        <p className="text-5xl font-semibold tabular-nums sm:text-6xl">
          {duration}
          <span className="ml-2 text-xl font-medium text-muted-foreground">
            minutes
          </span>
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {config.quick.map((value) => (
            <button
              aria-pressed={duration === value}
              className={
                duration === value
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full bg-muted px-4 py-2 text-sm font-semibold"
              }
              key={value}
              onClick={() => scrollToValue(value)}
              type="button"
            >
              {value} min
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal wheel — spans wide, 120px off each edge on large screens */}
      <div className="relative mx-4 mt-10 sm:mx-8 lg:mx-[120px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-primary/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent"
        />

        <div
          aria-label="Session duration in minutes"
          aria-valuemax={config.max}
          aria-valuemin={config.min}
          aria-valuenow={duration}
          className={`${styles.noScrollbar} flex h-24 snap-x snap-mandatory items-center overflow-x-auto scroll-smooth`}
          onScroll={handleScroll}
          ref={trackRef}
          role="slider"
          style={{ paddingLeft: padding, paddingRight: padding }}
          tabIndex={0}
        >
          {minutesRange.map((minute, index) => {
            const itemCenter = restScrollLeft(index);
            const distance = Math.abs(itemCenter - scrollLeft);
            const t = clamp(distance / (ITEM_SPACING * 1.8), 0, 1);
            const scale = 1 - 0.45 * t;
            const opacity = 1 - 0.72 * t;
            const isSelected = minute === duration;

            return (
              <div
                className="flex shrink-0 snap-center items-center justify-center"
                key={minute}
                style={{ width: ITEM_SPACING }}
              >
                <span
                  className={
                    isSelected
                      ? "font-semibold tabular-nums text-primary"
                      : "font-semibold tabular-nums text-foreground"
                  }
                  style={{
                    fontSize: 34,
                    transform: `scale(${scale})`,
                    opacity,
                    transition: "transform 0.05s linear, opacity 0.05s linear"
                  }}
                >
                  {minute}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-center">
        <button
          className="w-full max-w-md rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          type="button"
        >
          Start focus session
        </button>
      </div>
    </main>
  );
}
