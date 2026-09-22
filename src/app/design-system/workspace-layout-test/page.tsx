"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bold,
  Brain,
  CheckCircle2,
  Info,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Sparkles,
  Undo2,
  Upload
} from "lucide-react";

type NoteTab = "typed" | "handwritten";
type CoachPreview = "before" | "after";

const CHECKLIST = [
  { label: "Start timer", complete: true },
  { label: "Add notes", complete: false },
  { label: "Add one source", complete: false },
  { label: "Reflect", complete: false },
  { label: "Review AI feedback", complete: false }
];

export default function WorkspaceLayoutTestPage() {
  const [noteTab, setNoteTab] = useState<NoteTab>("typed");
  const [coachPreview, setCoachPreview] = useState<CoachPreview>("before");
  const [showCoachInfo, setShowCoachInfo] = useState(false);
  const completedCount = CHECKLIST.filter((item) => item.complete).length;

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
          Workspace layout, restructured
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Bigger input areas for Sources and Key Claims, notes and
          handwritten uploads sharing one panel as tabs instead of stacking,
          a condensed checklist, and the AI Coach collapsed to a slim bar
          until there&apos;s actually something to show.
        </p>
      </div>

      {/* Test harness only — not part of the real screen */}
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-dashed p-4 text-center">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Test control (not shown to users) — preview the AI Coach before vs.
          after a review exists
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {(["before", "after"] as CoachPreview[]).map((state) => (
            <button
              aria-pressed={coachPreview === state}
              className={
                coachPreview === state
                  ? "rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                  : "rounded-full border px-4 py-2 text-sm font-semibold text-muted-foreground"
              }
              key={state}
              onClick={() => setCoachPreview(state)}
              type="button"
            >
              {state === "before" ? "No AI review yet" : "AI review generated"}
            </button>
          ))}
        </div>
      </div>

      {/* Everything below mirrors the real workspace — no test controls here */}
      <div className="mx-auto mt-10 max-w-[1400px]">
        <div className="grid gap-5 lg:grid-cols-[300px_1fr_280px]">
          {/* Left: Sources + Key Claims */}
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/5">
              <h2 className="text-base font-semibold">Sources</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add the first source you trust.
              </p>
              <div className="mt-4 space-y-3">
                <input
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  placeholder="Source title"
                />
                <input
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  placeholder="https://…"
                />
                <textarea
                  className="w-full resize-y rounded-xl border bg-background px-3 py-2 text-sm"
                  placeholder="Why it matters (optional)"
                  rows={3}
                />
                <button
                  className="w-full rounded-full bg-muted px-4 py-2.5 text-sm font-semibold"
                  type="button"
                >
                  Add source
                </button>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/5">
              <h2 className="text-base font-semibold">Key Claims</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Short, source-backed assertions — quality over quantity.
              </p>
              <div className="mt-4 space-y-3">
                <textarea
                  className="w-full resize-y rounded-xl border bg-background px-3 py-2 text-sm"
                  placeholder="Capture a claim in your own words"
                  rows={5}
                />
                <select className="w-full rounded-xl border bg-background px-3 py-2 text-sm">
                  <option>No linked source</option>
                </select>
                <select className="w-full rounded-xl border bg-background px-3 py-2 text-sm">
                  <option>Medium confidence</option>
                </select>
                <button
                  className="w-full rounded-full bg-muted px-4 py-2.5 text-sm font-semibold"
                  type="button"
                >
                  Add claim
                </button>
              </div>
            </div>
          </div>

          {/* Center: Notes, with Handwritten as a tab instead of a stacked block */}
          <div className="flex flex-col rounded-3xl border bg-card p-5 shadow-sm shadow-black/5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Notes</h2>
              <div className="flex gap-1 rounded-full bg-muted p-1">
                <button
                  className={
                    noteTab === "typed"
                      ? "rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-sm"
                      : "rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                  }
                  onClick={() => setNoteTab("typed")}
                  type="button"
                >
                  Typed
                </button>
                <button
                  className={
                    noteTab === "handwritten"
                      ? "rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-sm"
                      : "rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                  }
                  onClick={() => setNoteTab("handwritten")}
                  type="button"
                >
                  Handwritten
                </button>
              </div>
            </div>

            {noteTab === "typed" ? (
              <div className="mt-4 flex flex-1 flex-col overflow-hidden rounded-2xl border bg-background">
                <div className="flex items-center gap-1 border-b px-3 py-2 text-muted-foreground">
                  <span className="px-1 text-xs font-semibold">H2</span>
                  <Bold aria-hidden="true" className="h-4 w-4" />
                  <Italic aria-hidden="true" className="h-4 w-4" />
                  <List aria-hidden="true" className="h-4 w-4" />
                  <ListOrdered aria-hidden="true" className="h-4 w-4" />
                  <Quote aria-hidden="true" className="h-4 w-4" />
                  <Link2 aria-hidden="true" className="h-4 w-4" />
                  <span className="mx-1 h-4 w-px bg-border" />
                  <Undo2 aria-hidden="true" className="h-4 w-4" />
                  <Redo2 aria-hidden="true" className="h-4 w-4" />
                </div>
                <div className="min-h-[420px] flex-1 p-4 text-muted-foreground">
                  Start with one insight, question, or idea you want to
                  understand.
                </div>
              </div>
            ) : (
              <div className="mt-4 flex min-h-[420px] flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-background p-6 text-center">
                <Upload aria-hidden="true" className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium">Add photos or a PDF</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Each file stays private to this session.
                </p>
                <button
                  className="rounded-full bg-muted px-4 py-2 text-sm font-semibold"
                  type="button"
                >
                  Upload pages
                </button>
              </div>
            )}
          </div>

          {/* Right: condensed checklist + collapsed AI Coach */}
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border bg-card p-4 shadow-sm shadow-black/5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-4 w-4 text-primary"
                  />
                  Checklist
                </h2>
                <span className="text-xs font-medium text-muted-foreground">
                  {completedCount}/{CHECKLIST.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(completedCount / CHECKLIST.length) * 100}%`
                  }}
                />
              </div>
              <div className="mt-3 space-y-2">
                {CHECKLIST.map((item) => (
                  <div
                    className="flex items-center gap-2.5 text-sm"
                    key={item.label}
                  >
                    <span
                      aria-hidden="true"
                      className={
                        item.complete
                          ? "flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
                          : "h-4 w-4 rounded-full border"
                      }
                    >
                      {item.complete ? "✓" : null}
                    </span>
                    <span
                      className={
                        item.complete ? "text-muted-foreground line-through" : ""
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {coachPreview === "before" ? (
              <div className="sticky top-5 rounded-3xl border bg-card p-4 shadow-sm shadow-black/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain aria-hidden="true" className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">AI Coach</span>
                  </div>
                  <div className="relative">
                    <button
                      aria-label="What does AI Coach do?"
                      className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                      onClick={() => setShowCoachInfo((prev) => !prev)}
                      type="button"
                    >
                      <Info aria-hidden="true" className="h-4 w-4" />
                    </button>
                    {showCoachInfo ? (
                      <div className="absolute right-0 top-7 z-10 w-64 rounded-xl border bg-card p-3 text-xs leading-5 text-muted-foreground shadow-lg">
                        Curio checks that your notes and claims match the
                        topic, then returns strengths, knowledge gaps, and
                        follow-up questions. Unlocks after focus ends and all
                        three reflection questions are answered.
                      </div>
                    ) : null}
                  </div>
                </div>
                <button
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  disabled
                  type="button"
                >
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  Generate AI review
                </button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Unlocks when focus ends and reflection is complete.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border bg-card p-4 shadow-sm shadow-black/5">
                <div className="flex items-center gap-2">
                  <Brain aria-hidden="true" className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">AI Coach</span>
                </div>
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      Session Summary
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Solid grasp of the core mechanism, with room to compare
                      vaccine types more directly.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Strengths
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Clear explanation of immune memory.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Gaps to explore
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      mRNA vs. inactivated vaccine trade-offs.
                    </p>
                  </div>
                </div>
                <button
                  className="mt-4 w-full rounded-full bg-muted px-4 py-2.5 text-sm font-semibold"
                  type="button"
                >
                  Refresh review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
