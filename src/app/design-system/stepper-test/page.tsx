"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";

const STEP_LABELS = ["Field", "Difficulty", "Topic", "Timer"];

export default function StepperTestPage() {
  const [current, setCurrent] = useState(0);

  function goNext() {
    setCurrent((step) => Math.min(step + 1, STEP_LABELS.length - 1));
  }

  function goBack() {
    setCurrent((step) => Math.max(step - 1, 0));
  }

  function reset() {
    setCurrent(0);
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-2xl">
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
          A stepper that shows itself, not its label.
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          No &ldquo;Step 1 of 4&rdquo; text. The current step&apos;s bar
          stretches out while you&apos;re on it; finishing it collapses the
          bar back down and fills it solid purple. Click through with the
          buttons below to see the transition — this is exactly the
          interaction, not just a static state.
        </p>

        <div className="mt-12 flex items-center justify-center gap-2">
          {STEP_LABELS.map((label, index) => {
            const isCompleted = index < current;
            const isActive = index === current;

            return (
              <motion.span
                animate={{ width: isActive ? 64 : 32 }}
                aria-label={`${label}${isCompleted ? " (completed)" : isActive ? " (in progress)" : ""}`}
                className={
                  isCompleted || isActive
                    ? "h-2 rounded-full bg-primary transition-colors duration-300"
                    : "h-2 rounded-full bg-muted transition-colors duration-300"
                }
                key={label}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          {STEP_LABELS.map((label, index) => (
            <span
              className={
                index === current ? "font-semibold text-foreground" : ""
              }
              key={label}
            >
              {label}
              {index < STEP_LABELS.length - 1 ? (
                <span className="px-2 text-border">/</span>
              ) : null}
            </span>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            className="rounded-full border px-4 py-2 text-sm font-medium disabled:opacity-40"
            disabled={current === 0}
            onClick={goBack}
            type="button"
          >
            Back
          </button>
          {current < STEP_LABELS.length - 1 ? (
            <button
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={goNext}
              type="button"
            >
              <Check aria-hidden="true" className="h-4 w-4" />
              Complete &amp; next
            </button>
          ) : (
            <button
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={reset}
              type="button"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
