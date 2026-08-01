import Link from "next/link";

import { ResearchWorkspaceShell } from "@/components/workspace/research-workspace-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  buildDifficultyChallenge,
  type ResearchDifficulty
} from "@/lib/topics";

type WorkspacePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export default async function WorkspacePage({
  searchParams
}: WorkspacePageProps) {
  const { error: pageError } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: session, error: sessionError } = await supabase
    .from("research_sessions")
    .select(
      "id, status, duration_minutes, difficulty_level, started_at, focus_ends_at, break_ends_at, break_taken, extension_used, ended_early, focus_finished_at, topic_id, challenge_id"
    )
    .eq("user_id", user.id)
    .in("status", ["draft", "active", "reflecting"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sessionError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>We could not open your workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">
              Refresh the page or try again shortly.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
        <Card className="w-full">
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Discover Mode
            </p>
            <CardTitle className="mt-3 text-3xl">
              Choose what Curio should uncover next.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Pick a field, spin for a topic, then choose how long you want to
              focus.
            </p>
            {pageError ? (
              <p className="text-sm text-destructive">{pageError}</p>
            ) : null}
            <Link
              className="inline-block font-medium text-primary"
              href="/onboarding"
            >
              Open the topic wheel
            </Link>
            <Link
              className="block text-sm font-medium text-muted-foreground"
              href="/dashboard"
            >
              Back to dashboard
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [
    { data: note },
    { data: sources },
    { data: keyClaims },
    { data: reflection },
    { data: aiFeedback },
    { data: attachments },
    { data: topic },
    { data: challenge }
  ] = await Promise.all([
    supabase
      .from("notes")
      .select("content_text, content_json")
      .eq("session_id", session.id)
      .maybeSingle(),
    supabase
      .from("sources")
      .select("id, title, url, note")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("key_claims")
      .select("id, claim, confidence_level, source_id")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("reflections")
      .select(
        "learned, surprised, unclear, confidence_before, confidence_after"
      )
      .eq("session_id", session.id)
      .maybeSingle(),
    supabase
      .from("ai_feedback")
      .select("summary, strengths, gaps, follow_up_questions")
      .eq("session_id", session.id)
      .maybeSingle(),
    supabase
      .from("note_attachments")
      .select("id, storage_path, file_name, mime_type, size_bytes")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true }),
    session.topic_id
      ? supabase
          .from("topics")
          .select("title, category, difficulty")
          .eq("id", session.topic_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    session.challenge_id
      ? supabase
          .from("challenges")
          .select("prompt")
          .eq("id", session.challenge_id)
          .maybeSingle()
      : Promise.resolve({ data: null })
  ]);

  return (
    <ResearchWorkspaceShell
      initialAiReview={(() => {
        if (!aiFeedback) {
          return null;
        }

        const strengths = toStringArray(aiFeedback.strengths);
        const gaps = toStringArray(aiFeedback.gaps);
        const followUpQuestions = toStringArray(aiFeedback.follow_up_questions);

        return strengths.length || gaps.length || followUpQuestions.length
          ? {
              alignment: "aligned" as const,
              summary: aiFeedback.summary,
              strengths,
              gaps,
              followUpQuestions
            }
          : {
              alignment: "needs_revision" as const,
              revisionMessage: aiFeedback.summary
            };
      })()}
      initialKeyClaims={keyClaims ?? []}
      initialAttachments={(attachments ?? []).map((attachment) => ({
        id: attachment.id,
        storagePath: attachment.storage_path,
        fileName: attachment.file_name,
        mimeType: attachment.mime_type,
        sizeBytes: attachment.size_bytes
      }))}
      initialNotes={note?.content_text ?? ""}
      initialNotesJson={note?.content_json ?? null}
      initialReflection={
        reflection
          ? {
              learned: reflection.learned,
              surprised: reflection.surprised,
              unclear: reflection.unclear,
              confidenceBefore: reflection.confidence_before,
              confidenceAfter: reflection.confidence_after
            }
          : null
      }
      initialSources={sources ?? []}
      session={{
        id: session.id,
        durationMinutes: session.duration_minutes,
        startedAt: session.started_at,
        focusEndsAt: session.focus_ends_at,
        breakEndsAt: session.break_ends_at,
        breakTaken: session.break_taken,
        extensionUsed: session.extension_used,
        endedEarly: session.ended_early,
        focusFinishedAt: session.focus_finished_at,
        status: session.status
      }}
      topic={{
        title: topic?.title ?? "Open research session",
        category: topic?.category ?? "Curiosity",
        difficulty: (session.difficulty_level ??
          "beginner") as ResearchDifficulty,
        challenge: buildDifficultyChallenge(
          challenge?.prompt ??
            "Collect evidence, explain the idea simply, and capture one insight.",
          (session.difficulty_level ?? "beginner") as ResearchDifficulty
        )
      }}
    />
  );
}
