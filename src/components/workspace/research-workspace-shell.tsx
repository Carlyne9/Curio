"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import {
  Brain,
  CheckCircle2,
  CircleAlert,
  CircleStop,
  Clock3,
  Coffee,
  ExternalLink,
  Info,
  Library,
  LoaderCircle,
  MessageCircleQuestion,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X
} from "lucide-react";

import {
  addFiveMinutes,
  addKeyClaim,
  addSource,
  autosaveNotes,
  completeSession,
  deleteKeyClaim,
  deleteSource,
  endMidpointBreak,
  finishFocusEarly,
  generateAiReview,
  takeMidpointBreak,
  submitReflection,
  updateKeyClaim,
  updateSource
} from "@/app/(app)/workspace/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HandwrittenNoteUpload,
  type NoteAttachment
} from "@/components/workspace/handwritten-note-upload";
import { RichTextNotes } from "@/components/workspace/rich-text-notes";
import type { AiReview } from "@/lib/ai/review";
import type { ResearchDifficulty } from "@/lib/topics";
import type { JSONContent } from "@tiptap/react";

type ResearchWorkspaceShellProps = {
  initialAiReview: AiReview | null;
  initialAttachments: NoteAttachment[];
  initialKeyClaims: Array<{
    id: string;
    claim: string;
    confidence_level: "low" | "medium" | "high";
    source_id: string | null;
  }>;
  initialNotes: string;
  initialNotesJson: unknown;
  initialReflection: {
    learned: string;
    surprised: string;
    unclear: string;
    confidenceBefore: number;
    confidenceAfter: number;
  } | null;
  initialSources: Array<{
    id: string;
    title: string;
    url: string;
    note: string | null;
  }>;
  session: {
    id: string;
    durationMinutes: number;
    startedAt: string | null;
    focusEndsAt: string | null;
    breakEndsAt: string | null;
    breakTaken: boolean;
    extensionUsed: boolean;
    endedEarly: boolean;
    focusFinishedAt: string | null;
    status: "draft" | "active" | "reflecting" | "completed";
  };
  topic: {
    title: string;
    category: string;
    difficulty: ResearchDifficulty;
    challenge: string;
  };
};

export function ResearchWorkspaceShell({
  initialAiReview,
  initialAttachments,
  initialKeyClaims,
  initialNotes,
  initialNotesJson,
  initialReflection,
  initialSources,
  session,
  topic
}: ResearchWorkspaceShellProps) {
  const router = useRouter();
  const sourcesSectionRef = useRef<HTMLDivElement>(null);
  const notesSectionRef = useRef<HTMLDivElement>(null);
  const reflectionSectionRef = useRef<HTMLDivElement>(null);
  const movedToReflectionRef = useRef(false);
  const autosaveTimeoutRef = useRef<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isAiReviewPending, startAiReviewTransition] = useTransition();
  const [aiReview, setAiReview] = useState<AiReview | null>(initialAiReview);
  const [aiFailureMessage, setAiFailureMessage] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  const [notesJson, setNotesJson] = useState<JSONContent | undefined>(
    initialNotesJson &&
      typeof initialNotesJson === "object" &&
      "type" in initialNotesJson &&
      (initialNotesJson as { type?: unknown }).type === "doc"
      ? (initialNotesJson as JSONContent)
      : undefined
  );
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [editingSourceTitle, setEditingSourceTitle] = useState("");
  const [editingSourceUrl, setEditingSourceUrl] = useState("");
  const [editingSourceNote, setEditingSourceNote] = useState("");
  const [claim, setClaim] = useState("");
  const [claimSourceId, setClaimSourceId] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [editingKeyClaimId, setEditingKeyClaimId] = useState<string | null>(
    null
  );
  const [editingClaim, setEditingClaim] = useState("");
  const [editingClaimSourceId, setEditingClaimSourceId] = useState("");
  const [editingConfidenceLevel, setEditingConfidenceLevel] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [learned, setLearned] = useState(initialReflection?.learned ?? "");
  const [surprised, setSurprised] = useState(
    initialReflection?.surprised ?? ""
  );
  const [unclear, setUnclear] = useState(initialReflection?.unclear ?? "");
  const [confidenceBefore, setConfidenceBefore] = useState(
    initialReflection?.confidenceBefore ?? 3
  );
  const [confidenceAfter, setConfidenceAfter] = useState(
    initialReflection?.confidenceAfter ?? 3
  );
  const [message, setMessage] = useState("Session ready.");
  const [secondsRemaining, setSecondsRemaining] = useState(
    session.durationMinutes * 60
  );
  const [breakSecondsRemaining, setBreakSecondsRemaining] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakPromptDismissed, setBreakPromptDismissed] = useState(false);

  useEffect(() => {
    if (!session.startedAt) {
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const fallbackFocusEnd =
        new Date(session.startedAt as string).getTime() +
        session.durationMinutes * 60 * 1000;
      const focusEnd = session.focusEndsAt
        ? new Date(session.focusEndsAt).getTime()
        : fallbackFocusEnd;
      const breakEnd = session.breakEndsAt
        ? new Date(session.breakEndsAt).getTime()
        : 0;
      const currentBreakSeconds = Math.max(
        0,
        Math.ceil((breakEnd - now) / 1000)
      );
      const breakIsActive = currentBreakSeconds > 0 && !session.focusFinishedAt;
      const currentFocusSeconds = Math.max(
        0,
        Math.ceil((focusEnd - now) / 1000) -
          (breakIsActive ? currentBreakSeconds : 0)
      );

      setBreakSecondsRemaining(currentBreakSeconds);
      setIsOnBreak(breakIsActive);
      setSecondsRemaining(currentFocusSeconds);
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timer);
  }, [
    session.breakEndsAt,
    session.durationMinutes,
    session.focusEndsAt,
    session.focusFinishedAt,
    session.startedAt
  ]);

  useEffect(
    () => () => {
      if (autosaveTimeoutRef.current) {
        window.clearTimeout(autosaveTimeoutRef.current);
      }
    },
    []
  );

  const displayedSeconds = isOnBreak ? breakSecondsRemaining : secondsRemaining;
  const formattedTime = `${String(Math.floor(displayedSeconds / 60)).padStart(2, "0")}:${String(
    displayedSeconds % 60
  ).padStart(2, "0")}`;
  const focusEnded =
    Boolean(session.focusFinishedAt) || (!isOnBreak && secondsRemaining === 0);
  const breakMinutes = Math.min(
    5,
    Math.max(2, Math.round(session.durationMinutes * 0.1))
  );
  const plannedFocusSeconds =
    session.durationMinutes * 60 + (session.extensionUsed ? 5 * 60 : 0);
  const breakEligible =
    !session.breakTaken &&
    !breakPromptDismissed &&
    !focusEnded &&
    !isOnBreak &&
    secondsRemaining <= (session.durationMinutes * 60) / 2;
  const timerProgress = Math.max(
    0,
    Math.min(
      100,
      ((plannedFocusSeconds - secondsRemaining) / plannedFocusSeconds) * 100
    )
  );

  useEffect(() => {
    if (!focusEnded || movedToReflectionRef.current) {
      return;
    }

    movedToReflectionRef.current = true;
    window.setTimeout(() => {
      reflectionSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 250);
  }, [focusEnded]);

  const hasNotes = Boolean(notes.trim()) || initialAttachments.length > 0;
  const hasSources = initialSources.length > 0;
  const hasReflection = Boolean(
    learned.trim() && surprised.trim() && unclear.trim()
  );
  const missingRequirements = [
    !hasNotes ? "a note or handwritten upload" : null,
    !hasSources ? "one source" : null,
    !hasReflection ? "all three reflection answers" : null
  ].filter((requirement): requirement is string => Boolean(requirement));
  const completionHint =
    focusEnded && missingRequirements.length
      ? `Still needed: ${missingRequirements.join(", ")}.`
      : "Session ready.";
  const checklist = [
    { label: "Start timer", complete: Boolean(session.startedAt) },
    { label: "Add notes", complete: hasNotes },
    { label: "Add one source", complete: hasSources },
    { label: "Reflect", complete: hasReflection },
    { label: "Review AI feedback", complete: Boolean(aiReview) }
  ];

  function saveNotes() {
    if (autosaveTimeoutRef.current) {
      window.clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }

    startTransition(async () => {
      const result = await autosaveNotes({
        sessionId: session.id,
        content: notes,
        contentJson: notesJson
      });
      setMessage(result.message);
    });
  }

  function handleNotesChange(contentText: string, contentJson: JSONContent) {
    setNotes(contentText);
    setNotesJson(contentJson);
    setMessage("Autosaving notes…");

    if (autosaveTimeoutRef.current) {
      window.clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = window.setTimeout(() => {
      startTransition(async () => {
        const result = await autosaveNotes({
          sessionId: session.id,
          content: contentText,
          contentJson
        });
        setMessage(result.message);
        autosaveTimeoutRef.current = null;
      });
    }, 1200);
  }

  function handleTakeBreak() {
    startTransition(async () => {
      const result = await takeMidpointBreak({ sessionId: session.id });
      setMessage(result.message);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  function handleResumeFocus() {
    startTransition(async () => {
      const result = await endMidpointBreak({ sessionId: session.id });
      setMessage(result.message);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  function handleAddFiveMinutes() {
    startTransition(async () => {
      const result = await addFiveMinutes({ sessionId: session.id });
      setMessage(result.message);

      if (result.ok) {
        movedToReflectionRef.current = false;
        router.refresh();
      }
    });
  }

  function handleFinishFocusEarly() {
    const confirmed = window.confirm(
      "End focus early and move to reflection? Your notes will be kept."
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const notesResult = await autosaveNotes({
        sessionId: session.id,
        content: notes,
        contentJson: notesJson
      });

      if (!notesResult.ok) {
        setMessage(notesResult.message);
        return;
      }

      const result = await finishFocusEarly({ sessionId: session.id });
      setMessage(result.message);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  function handleAddSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await addSource({
        sessionId: session.id,
        title: sourceTitle,
        url: sourceUrl,
        note: sourceNote
      });
      setMessage(result.message);

      if (result.ok) {
        setSourceTitle("");
        setSourceUrl("");
        setSourceNote("");
        router.refresh();
      }
    });
  }

  function beginSourceEdit(
    source: ResearchWorkspaceShellProps["initialSources"][number]
  ) {
    setEditingSourceId(source.id);
    setEditingSourceTitle(source.title);
    setEditingSourceUrl(source.url);
    setEditingSourceNote(source.note ?? "");
  }

  function cancelSourceEdit() {
    setEditingSourceId(null);
    setEditingSourceTitle("");
    setEditingSourceUrl("");
    setEditingSourceNote("");
  }

  function handleUpdateSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingSourceId) {
      return;
    }

    startTransition(async () => {
      const result = await updateSource({
        sessionId: session.id,
        sourceId: editingSourceId,
        title: editingSourceTitle,
        url: editingSourceUrl,
        note: editingSourceNote
      });
      setMessage(result.message);

      if (result.ok) {
        cancelSourceEdit();
        router.refresh();
      }
    });
  }

  function handleDeleteSource(
    source: ResearchWorkspaceShellProps["initialSources"][number]
  ) {
    if (!window.confirm(`Delete “${source.title}” from this session?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteSource({
        sessionId: session.id,
        itemId: source.id
      });
      setMessage(result.message);

      if (result.ok) {
        if (editingSourceId === source.id) {
          cancelSourceEdit();
        }
        router.refresh();
      }
    });
  }

  function handleAddClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await addKeyClaim({
        sessionId: session.id,
        claim,
        sourceId: claimSourceId || undefined,
        confidenceLevel
      });
      setMessage(result.message);

      if (result.ok) {
        setClaim("");
        setClaimSourceId("");
        router.refresh();
      }
    });
  }

  function beginKeyClaimEdit(
    keyClaim: ResearchWorkspaceShellProps["initialKeyClaims"][number]
  ) {
    setEditingKeyClaimId(keyClaim.id);
    setEditingClaim(keyClaim.claim);
    setEditingClaimSourceId(keyClaim.source_id ?? "");
    setEditingConfidenceLevel(keyClaim.confidence_level);
  }

  function cancelKeyClaimEdit() {
    setEditingKeyClaimId(null);
    setEditingClaim("");
    setEditingClaimSourceId("");
    setEditingConfidenceLevel("medium");
  }

  function handleUpdateKeyClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingKeyClaimId) {
      return;
    }

    startTransition(async () => {
      const result = await updateKeyClaim({
        sessionId: session.id,
        keyClaimId: editingKeyClaimId,
        claim: editingClaim,
        sourceId: editingClaimSourceId || undefined,
        confidenceLevel: editingConfidenceLevel
      });
      setMessage(result.message);

      if (result.ok) {
        cancelKeyClaimEdit();
        router.refresh();
      }
    });
  }

  function handleDeleteKeyClaim(
    keyClaim: ResearchWorkspaceShellProps["initialKeyClaims"][number]
  ) {
    if (!window.confirm("Delete this key claim from the session?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteKeyClaim({
        sessionId: session.id,
        itemId: keyClaim.id
      });
      setMessage(result.message);

      if (result.ok) {
        if (editingKeyClaimId === keyClaim.id) {
          cancelKeyClaimEdit();
        }
        router.refresh();
      }
    });
  }

  function saveReflection() {
    startTransition(async () => {
      const result = await submitReflection({
        sessionId: session.id,
        learned,
        surprised,
        unclear,
        confidenceBefore,
        confidenceAfter
      });
      setMessage(result.message);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  function requestAiReview() {
    if (!focusEnded || !hasReflection) {
      setMessage(
        "Finish focus and complete all reflection questions before requesting AI review."
      );
      reflectionSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    setAiFailureMessage("");
    startAiReviewTransition(async () => {
      setMessage("Preparing your AI review…");
      const notesResult = await autosaveNotes({
        sessionId: session.id,
        content: notes,
        contentJson: notesJson
      });

      if (!notesResult.ok) {
        setMessage(notesResult.message);
        return;
      }

      const reflectionResult = await submitReflection({
        sessionId: session.id,
        learned,
        surprised,
        unclear,
        confidenceBefore,
        confidenceAfter
      });

      if (!reflectionResult.ok) {
        setMessage(reflectionResult.message);
        reflectionSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        return;
      }

      const result = await generateAiReview({ sessionId: session.id });
      setMessage(result.message);

      if (result.ok && result.review) {
        setAiReview(result.review);
        setAiFailureMessage("");
        router.refresh();
      } else if (result.fallback) {
        setAiFailureMessage(result.message);
      }
    });
  }

  function finishSession() {
    if (missingRequirements.length) {
      setMessage(`Before finishing, add ${missingRequirements.join(", ")}.`);

      const firstIncompleteSection = !hasNotes
        ? notesSectionRef.current
        : !hasSources
          ? sourcesSectionRef.current
          : reflectionSectionRef.current;

      firstIncompleteSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    startTransition(async () => {
      const notesResult = await autosaveNotes({
        sessionId: session.id,
        content: notes,
        contentJson: notesJson
      });

      if (!notesResult.ok) {
        setMessage(notesResult.message);
        return;
      }

      const reflectionResult = await submitReflection({
        sessionId: session.id,
        learned,
        surprised,
        unclear,
        confidenceBefore,
        confidenceAfter
      });

      if (!reflectionResult.ok) {
        setMessage(reflectionResult.message);
        return;
      }

      const result = await completeSession({ sessionId: session.id });
      setMessage(result.message);

      if (result.ok) {
        router.push("/library");
        router.refresh();
      }
    });
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <header className="rounded-[2rem] border bg-card p-5 shadow-sm shadow-black/5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                  {topic.category} ·{" "}
                  <span className="capitalize">{topic.difficulty}</span>
                </p>
                <Link
                  className="text-sm text-muted-foreground"
                  href="/dashboard"
                >
                  Back to dashboard
                </Link>
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                {topic.title}
              </h1>
              <p className="mt-2 max-w-3xl text-muted-foreground">
                Challenge: {topic.challenge}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-muted px-4 py-3">
              <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {isOnBreak
                    ? "Break"
                    : focusEnded
                      ? "Focus complete"
                      : "Focus"}
                </span>
                <span className="text-2xl font-semibold tabular-nums">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              aria-label={`${Math.round(timerProgress)}% of focus session elapsed`}
              className="h-full rounded-full bg-primary transition-[width]"
              role="progressbar"
              style={{ width: `${timerProgress}%` }}
            />
          </div>
          {isOnBreak ? (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Coffee
                  className="mt-0.5 h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Midpoint break in progress</p>
                  <p className="text-sm text-muted-foreground">
                    Step away briefly. Focus time is paused until this break
                    ends.
                  </p>
                </div>
              </div>
              <Button
                disabled={isPending}
                onClick={handleResumeFocus}
                type="button"
                variant="secondary"
              >
                Resume focus
              </Button>
            </div>
          ) : breakEligible ? (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Coffee
                  className="mt-0.5 h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">You are halfway there</p>
                  <p className="text-sm text-muted-foreground">
                    Take one optional {breakMinutes}-minute break, or keep your
                    momentum.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={isPending}
                  onClick={handleTakeBreak}
                  type="button"
                  variant="secondary"
                >
                  Take {breakMinutes}-minute break
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => setBreakPromptDismissed(true)}
                  type="button"
                  variant="ghost"
                >
                  Keep focusing
                </Button>
              </div>
            </div>
          ) : null}
          {!focusEnded && !isOnBreak ? (
            <div className="mt-3 flex justify-end">
              <Button
                className="text-muted-foreground"
                disabled={isPending}
                onClick={handleFinishFocusEarly}
                type="button"
                variant="ghost"
              >
                <CircleStop className="mr-2 h-4 w-4" aria-hidden="true" />
                End focus early
              </Button>
            </div>
          ) : null}
        </header>

        <section className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="space-y-5">
            <div ref={sourcesSectionRef}>
              <Card>
                <CardHeader>
                  <CardTitle>Sources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {initialSources.length ? (
                    initialSources.map((source) =>
                      editingSourceId === source.id ? (
                        <form
                          className="grid gap-2 rounded-2xl border bg-background p-3"
                          key={source.id}
                          onSubmit={handleUpdateSource}
                        >
                          <input
                            aria-label="Source title"
                            className="rounded-xl border bg-background px-3 py-2 text-sm"
                            onChange={(event) =>
                              setEditingSourceTitle(event.target.value)
                            }
                            required
                            value={editingSourceTitle}
                          />
                          <input
                            aria-label="Source URL"
                            className="rounded-xl border bg-background px-3 py-2 text-sm"
                            onChange={(event) =>
                              setEditingSourceUrl(event.target.value)
                            }
                            required
                            type="url"
                            value={editingSourceUrl}
                          />
                          <input
                            aria-label="Source note"
                            className="rounded-xl border bg-background px-3 py-2 text-sm"
                            onChange={(event) =>
                              setEditingSourceNote(event.target.value)
                            }
                            placeholder="Why it matters (optional)"
                            value={editingSourceNote}
                          />
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 px-3"
                              disabled={isPending}
                              type="submit"
                              variant="secondary"
                            >
                              Save changes
                            </Button>
                            <Button
                              aria-label="Cancel source editing"
                              className="px-3"
                              disabled={isPending}
                              onClick={cancelSourceEdit}
                              type="button"
                              variant="ghost"
                            >
                              <X className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div
                          className="rounded-2xl bg-muted p-3 text-sm"
                          key={source.id}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <a
                              className="min-w-0 font-medium hover:text-primary"
                              href={source.url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <span className="break-words">
                                {source.title}
                              </span>
                              <ExternalLink
                                className="ml-1 inline h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            </a>
                            <div className="flex shrink-0">
                              <button
                                aria-label={`Edit ${source.title}`}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
                                disabled={isPending}
                                onClick={() => beginSourceEdit(source)}
                                type="button"
                              >
                                <Pencil
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                aria-label={`Delete ${source.title}`}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-background hover:text-destructive"
                                disabled={isPending}
                                onClick={() => handleDeleteSource(source)}
                                type="button"
                              >
                                <Trash2
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                          {source.note ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {source.note}
                            </p>
                          ) : null}
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Add the first source you trust.
                    </p>
                  )}
                  <form
                    className="grid gap-2 border-t pt-3"
                    onSubmit={handleAddSource}
                  >
                    <input
                      className="rounded-xl border bg-background px-3 py-2 text-sm"
                      onChange={(event) => setSourceTitle(event.target.value)}
                      placeholder="Source title"
                      required
                      value={sourceTitle}
                    />
                    <input
                      className="rounded-xl border bg-background px-3 py-2 text-sm"
                      onChange={(event) => setSourceUrl(event.target.value)}
                      placeholder="https://…"
                      required
                      type="url"
                      value={sourceUrl}
                    />
                    <input
                      className="rounded-xl border bg-background px-3 py-2 text-sm"
                      onChange={(event) => setSourceNote(event.target.value)}
                      placeholder="Why it matters (optional)"
                      value={sourceNote}
                    />
                    <Button
                      disabled={isPending}
                      type="submit"
                      variant="secondary"
                    >
                      Add source
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Claims</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {initialKeyClaims.map((keyClaim) =>
                  editingKeyClaimId === keyClaim.id ? (
                    <form
                      className="grid gap-2 rounded-2xl border bg-background p-3"
                      key={keyClaim.id}
                      onSubmit={handleUpdateKeyClaim}
                    >
                      <textarea
                        aria-label="Key claim"
                        className="min-h-20 rounded-xl border bg-background px-3 py-2 text-sm"
                        onChange={(event) =>
                          setEditingClaim(event.target.value)
                        }
                        required
                        value={editingClaim}
                      />
                      <select
                        aria-label="Linked source"
                        className="rounded-xl border bg-background px-3 py-2 text-sm"
                        onChange={(event) =>
                          setEditingClaimSourceId(event.target.value)
                        }
                        value={editingClaimSourceId}
                      >
                        <option value="">No linked source</option>
                        {initialSources.map((source) => (
                          <option key={source.id} value={source.id}>
                            {source.title}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label="Confidence level"
                        className="rounded-xl border bg-background px-3 py-2 text-sm"
                        onChange={(event) =>
                          setEditingConfidenceLevel(
                            event.target.value as "low" | "medium" | "high"
                          )
                        }
                        value={editingConfidenceLevel}
                      >
                        <option value="low">Low confidence</option>
                        <option value="medium">Medium confidence</option>
                        <option value="high">High confidence</option>
                      </select>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 px-3"
                          disabled={isPending}
                          type="submit"
                          variant="secondary"
                        >
                          Save changes
                        </Button>
                        <Button
                          aria-label="Cancel key claim editing"
                          className="px-3"
                          disabled={isPending}
                          onClick={cancelKeyClaimEdit}
                          type="button"
                          variant="ghost"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div
                      className="rounded-2xl bg-muted p-3 text-sm"
                      key={keyClaim.id}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p>{keyClaim.claim}</p>
                        <div className="flex shrink-0">
                          <button
                            aria-label="Edit key claim"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
                            disabled={isPending}
                            onClick={() => beginKeyClaimEdit(keyClaim)}
                            type="button"
                          >
                            <Pencil
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            aria-label="Delete key claim"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-background hover:text-destructive"
                            disabled={isPending}
                            onClick={() => handleDeleteKeyClaim(keyClaim)}
                            type="button"
                          >
                            <Trash2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-xs capitalize text-muted-foreground">
                        {keyClaim.confidence_level} confidence
                        {keyClaim.source_id
                          ? ` · ${
                              initialSources.find(
                                (source) => source.id === keyClaim.source_id
                              )?.title ?? "Linked source"
                            }`
                          : null}
                      </p>
                    </div>
                  )
                )}
                <form
                  className="grid gap-2 border-t pt-3"
                  onSubmit={handleAddClaim}
                >
                  <textarea
                    className="min-h-20 rounded-xl border bg-background px-3 py-2 text-sm"
                    onChange={(event) => setClaim(event.target.value)}
                    placeholder="Capture a claim in your own words"
                    required
                    value={claim}
                  />
                  <select
                    className="rounded-xl border bg-background px-3 py-2 text-sm"
                    onChange={(event) => setClaimSourceId(event.target.value)}
                    value={claimSourceId}
                  >
                    <option value="">No linked source</option>
                    {initialSources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.title}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-xl border bg-background px-3 py-2 text-sm"
                    onChange={(event) =>
                      setConfidenceLevel(
                        event.target.value as "low" | "medium" | "high"
                      )
                    }
                    value={confidenceLevel}
                  >
                    <option value="low">Low confidence</option>
                    <option value="medium">Medium confidence</option>
                    <option value="high">High confidence</option>
                  </select>
                  <Button
                    disabled={isPending}
                    type="submit"
                    variant="secondary"
                  >
                    Add claim
                  </Button>
                </form>
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-5">
            <div ref={notesSectionRef}>
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <RichTextNotes
                      initialContent={initialNotesJson}
                      initialText={initialNotes}
                      onChange={handleNotesChange}
                    />
                    <HandwrittenNoteUpload
                      attachments={initialAttachments}
                      sessionId={session.id}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div ref={reflectionSectionRef}>
              <Card>
                <CardHeader>
                  <CardTitle>Reflection</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {focusEnded ? (
                    <div className="flex flex-col gap-3 rounded-2xl bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          {session.endedEarly
                            ? "Focus ended early"
                            : "Focus complete"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your notes are safe. Capture what changed in your
                          understanding.
                        </p>
                      </div>
                      {!session.endedEarly && !session.extensionUsed ? (
                        <Button
                          disabled={isPending}
                          onClick={handleAddFiveMinutes}
                          type="button"
                          variant="secondary"
                        >
                          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                          Add 5 minutes
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <div
                      className="flex items-start gap-3 border-l-4 border-primary bg-primary/5 px-4 py-3"
                      role="note"
                    >
                      <Info
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          About reflection
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Use this section to capture what you learned, what
                          surprised you, what remains unclear, and how your
                          confidence changed.
                        </p>
                      </div>
                    </div>
                  )}
                  <label className="grid gap-2 text-sm font-medium">
                    What did you learn?
                    <textarea
                      className="min-h-24 rounded-2xl border bg-background p-3 font-normal"
                      onChange={(event) => setLearned(event.target.value)}
                      value={learned}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    What surprised you?
                    <textarea
                      className="min-h-24 rounded-2xl border bg-background p-3 font-normal"
                      onChange={(event) => setSurprised(event.target.value)}
                      value={surprised}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    What is still unclear?
                    <textarea
                      className="min-h-24 rounded-2xl border bg-background p-3 font-normal"
                      onChange={(event) => setUnclear(event.target.value)}
                      value={unclear}
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      Confidence before
                      <select
                        className="rounded-xl border bg-background px-3 py-2 font-normal"
                        onChange={(event) =>
                          setConfidenceBefore(Number(event.target.value))
                        }
                        value={confidenceBefore}
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <option key={value} value={value}>
                            {value} / 5
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Confidence after
                      <select
                        className="rounded-xl border bg-background px-3 py-2 font-normal"
                        onChange={(event) =>
                          setConfidenceAfter(Number(event.target.value))
                        }
                        value={confidenceAfter}
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <option key={value} value={value}>
                            {value} / 5
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <Button
                    disabled={isPending}
                    onClick={saveReflection}
                    type="button"
                    variant="secondary"
                  >
                    Save reflection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Session Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklist.map((item) => (
                  <div
                    className="flex items-center gap-3 text-sm"
                    key={item.label}
                  >
                    <span
                      aria-hidden="true"
                      className={
                        item.complete
                          ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                          : "h-5 w-5 rounded-full border"
                      }
                    >
                      {item.complete ? "✓" : null}
                    </span>
                    {item.label}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
                  AI Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {aiReview ? (
                  aiReview.alignment === "needs_revision" ? (
                    <>
                      <div className="rounded-2xl border border-accent bg-accent/10 p-4">
                        <p className="flex items-center gap-2 font-semibold">
                          <CircleAlert className="h-4 w-4" aria-hidden="true" />
                          Revise your research notes
                        </p>
                        <p className="mt-2 leading-6 text-muted-foreground">
                          {aiReview.revisionMessage}
                        </p>
                      </div>
                      <Button
                        className="w-full"
                        disabled={isAiReviewPending}
                        onClick={requestAiReview}
                        type="button"
                        variant="secondary"
                      >
                        {isAiReviewPending ? (
                          <LoaderCircle
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : null}
                        Review revised notes
                      </Button>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          Session Summary
                        </p>
                        <p className="mt-2 leading-6 text-muted-foreground">
                          {aiReview.summary}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 font-semibold">
                          <CheckCircle2
                            className="h-4 w-4 text-primary"
                            aria-hidden="true"
                          />
                          Strengths
                        </p>
                        <ul className="mt-2 space-y-2 text-muted-foreground">
                          {aiReview.strengths.map((strength) => (
                            <li className="flex gap-2" key={strength}>
                              <span aria-hidden="true">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 font-semibold">
                          <CircleAlert
                            className="h-4 w-4 text-accent-foreground"
                            aria-hidden="true"
                          />
                          Gaps to explore
                        </p>
                        <ul className="mt-2 space-y-2 text-muted-foreground">
                          {aiReview.gaps.map((gap) => (
                            <li className="flex gap-2" key={gap}>
                              <span aria-hidden="true">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 font-semibold">
                          <MessageCircleQuestion
                            className="h-4 w-4 text-primary"
                            aria-hidden="true"
                          />
                          Follow-up questions
                        </p>
                        <ol className="mt-2 list-decimal space-y-2 pl-5 text-muted-foreground">
                          {aiReview.followUpQuestions.map((question) => (
                            <li key={question}>{question}</li>
                          ))}
                        </ol>
                      </div>
                      <Button
                        className="w-full"
                        disabled={isAiReviewPending}
                        onClick={requestAiReview}
                        type="button"
                        variant="secondary"
                      >
                        {isAiReviewPending ? (
                          <LoaderCircle
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : null}
                        Refresh review
                      </Button>
                    </>
                  )
                ) : (
                  <>
                    <p className="leading-6 text-muted-foreground">
                      Curio first checks that your typed or handwritten notes
                      and supporting claims match the research topic. Aligned
                      work receives strengths, knowledge gaps, and follow-up
                      questions; unrelated work is returned for revision.
                    </p>
                    {!focusEnded ? (
                      <p className="text-xs text-muted-foreground">
                        AI review unlocks when focus ends.
                      </p>
                    ) : !hasReflection ? (
                      <p className="text-xs text-muted-foreground">
                        Complete all three reflection questions to unlock your
                        review.
                      </p>
                    ) : null}
                    {aiFailureMessage ? (
                      <div className="border-l-4 border-accent bg-accent/20 px-3 py-2 text-muted-foreground">
                        {aiFailureMessage}
                      </div>
                    ) : null}
                    <Button
                      className="w-full"
                      disabled={
                        isAiReviewPending || !focusEnded || !hasReflection
                      }
                      onClick={requestAiReview}
                      type="button"
                      variant="secondary"
                    >
                      {isAiReviewPending ? (
                        <LoaderCircle
                          className="mr-2 h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                      )}
                      {isAiReviewPending
                        ? "Reviewing session…"
                        : "Generate AI review"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      AI feedback is optional. You can finish and save the
                      session if it is unavailable.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </aside>
        </section>

        <footer className="sticky bottom-4 flex flex-col gap-3 rounded-[2rem] border bg-card/95 p-3 shadow-lg shadow-black/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div
            aria-live="polite"
            className="flex items-center gap-2 px-3 text-sm text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            {isPending
              ? "Saving…"
              : message === "Session ready."
                ? completionHint
                : message}
          </div>
          <div className="flex gap-2">
            <Button
              disabled={isPending}
              onClick={saveNotes}
              type="button"
              variant="secondary"
            >
              <Library className="mr-2 h-4 w-4" aria-hidden="true" />
              Save Draft
            </Button>
            <Button
              disabled={isPending || !focusEnded}
              onClick={finishSession}
              type="button"
            >
              {focusEnded ? "Finish Session" : "Finish after focus"}
            </Button>
          </div>
        </footer>
      </div>
    </main>
  );
}
