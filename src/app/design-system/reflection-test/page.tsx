"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReflectionTestPage() {
  const [takeaway, setTakeaway] = useState("");
  const [surprised, setSurprised] = useState("");
  const [unclear, setUnclear] = useState("");

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
          Reflection, without the redundancy
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Confidence tracking is gone entirely — three tried presentations
          and none of them earned their place. Just the takeaway and two
          open questions now.
        </p>
      </div>

      {/* Everything below mirrors the real Reflection card */}
      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border bg-card p-5 shadow-sm shadow-black/5">
        <h2 className="text-base font-semibold">Reflection</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture what surprised you and what remains unclear.
        </p>

        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Your big takeaway
            <span className="text-sm font-normal text-muted-foreground">
              If you had to explain this to someone in one sentence, what
              would you say?
            </span>
            <input
              className="rounded-xl border bg-background p-3 text-sm font-normal"
              onChange={(event) => setTakeaway(event.target.value)}
              placeholder="In one sentence…"
              value={takeaway}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            What surprised you?
            <textarea
              className="min-h-24 rounded-2xl border bg-background p-3 text-sm font-normal"
              onChange={(event) => setSurprised(event.target.value)}
              value={surprised}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            What is still unclear?
            <textarea
              className="min-h-24 rounded-2xl border bg-background p-3 text-sm font-normal"
              onChange={(event) => setUnclear(event.target.value)}
              value={unclear}
            />
          </label>

          <button
            className="rounded-full bg-muted px-4 py-2.5 text-sm font-semibold"
            type="button"
          >
            Save reflection
          </button>
        </div>
      </div>
    </main>
  );
}
