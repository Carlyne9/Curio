"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ResearchDifficulty } from "@/lib/topics";

import styles from "./duration-picker.module.css";

const STEP_MINUTES = 5;
const ITEM_SPACING = 110;

export const DURATION_CONFIG: Record<
  ResearchDifficulty,
  {
    min: number;
    max: number;
    defaultValue: number;
    quick: readonly number[];
  }
> = {
  beginner: { min: 10, max: 45, defaultValue: 15, quick: [10, 15, 25, 45] },
  intermediate: {
    min: 15,
    max: 60,
    defaultValue: 25,
    quick: [15, 25, 45, 60]
  },
  advanced: { min: 30, max: 90, defaultValue: 45, quick: [30, 45, 60, 90] }
};

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

type DurationPickerProps = {
  difficulty: ResearchDifficulty;
  value: number;
  onChange: (value: number) => void;
};

export function DurationPicker({
  difficulty,
  value,
  onChange
}: DurationPickerProps) {
  const config = DURATION_CONFIG[difficulty];
  const trackRef = useRef<HTMLDivElement>(null);
  const [padding, setPadding] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
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

  // Mounts fresh (or the difficulty's range changes) — settle on the
  // current value, clamped into this difficulty's range. The caller is
  // responsible for resetting `value` to this difficulty's default when
  // the difficulty itself changes (see chooseDifficulty in the parent).
  useEffect(() => {
    if (!trackRef.current || padding === 0) return;
    const clamped = clamp(value, config.min, config.max);
    isProgrammaticScroll.current = true;
    const target = restScrollLeft((clamped - config.min) / STEP_MINUTES);
    trackRef.current.scrollLeft = target;
    setScrollLeft(target);
    if (clamped !== value) onChange(clamped);
    const id = requestAnimationFrame(() => {
      isProgrammaticScroll.current = false;
    });
    return () => cancelAnimationFrame(id);
    // Only re-run when the range itself changes, not on every onChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [padding, config.min, config.max]);

  function handleScroll() {
    if (!trackRef.current || isProgrammaticScroll.current) return;
    const left = trackRef.current.scrollLeft;
    setScrollLeft(left);
    const raw = left / ITEM_SPACING - 0.5;
    const steps = clamp(Math.round(raw), 0, minutesRange.length - 1);
    onChange(config.min + steps * STEP_MINUTES);
  }

  function scrollToValue(next: number) {
    if (!trackRef.current) return;
    trackRef.current.scrollTo({
      left: restScrollLeft((next - config.min) / STEP_MINUTES),
      behavior: "smooth"
    });
  }

  return (
    <div>
      <p className="text-center text-5xl font-semibold tabular-nums sm:text-6xl">
        {value}
        <span className="ml-2 text-xl font-medium text-muted-foreground">
          minutes
        </span>
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {config.quick.map((quickValue) => (
          <button
            aria-pressed={value === quickValue}
            className={
              value === quickValue
                ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                : "rounded-full bg-muted px-4 py-2 text-sm font-semibold"
            }
            key={quickValue}
            onClick={() => scrollToValue(quickValue)}
            type="button"
          >
            {quickValue} min
          </button>
        ))}
      </div>

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
          aria-valuenow={value}
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
            const isSelected = minute === value;

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
    </div>
  );
}
