import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  MessageCircleQuestion
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type LibrarySessionPageProps = {
  params: Promise<{ sessionId: string }>;
};

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function LibrarySessionPage({
  params
}: LibrarySessionPageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: session } = await supabase
    .from("research_sessions")
    .select(
      "id, topic_id, challenge_id, duration_minutes, difficulty_level, completed_at, actual_focus_seconds, ended_early"
    )
    .eq("id", sessionId)
    .eq("user_id", user?.id ?? "")
    .eq("status", "completed")
    .maybeSingle();

  if (!session) {
    notFound();
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
      .select("content_text")
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

  const attachmentsWithUrls = await Promise.all(
    (attachments ?? []).map(async (attachment) => {
      const { data } = await supabase.storage
        .from("session-notes")
        .createSignedUrl(attachment.storage_path, 60 * 15);

      return { ...attachment, signedUrl: data?.signedUrl ?? "" };
    })
  );
  const sourceById = new Map(sources?.map((source) => [source.id, source]));
  const strengths = toStringArray(aiFeedback?.strengths);
  const gaps = toStringArray(aiFeedback?.gaps);
  const followUpQuestions = toStringArray(aiFeedback?.follow_up_questions);
  const aiNeedsRevision =
    Boolean(aiFeedback) &&
    !strengths.length &&
    !gaps.length &&
    !followUpQuestions.length;
  const completedAt = session.completed_at
    ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
        new Date(session.completed_at)
      )
    : "Recently";
  const focusedMinutes = Math.max(
    1,
    Math.round(
      (session.actual_focus_seconds ?? session.duration_minutes * 60) / 60
    )
  );

  return (
    <AppShell title={topic?.title ?? "Research session"}>
      <Button asChild variant="ghost">
        <Link href="/library">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back to Library
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {topic?.category ?? "Curiosity"} · {completedAt}
          </p>
          <CardTitle className="mt-2 text-2xl">Session overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <p className="text-sm font-semibold">Research challenge</p>
            <p className="mt-2 leading-7 text-muted-foreground">
              {challenge?.prompt ?? "Explore and explain the selected topic."}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-muted p-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Difficulty</dt>
              <dd className="mt-1 font-semibold">
                {titleCase(session.difficulty_level)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Focus</dt>
              <dd className="mt-1 font-semibold">{focusedMinutes} min</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Sources</dt>
              <dd className="mt-1 font-semibold">{sources?.length ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Finished</dt>
              <dd className="mt-1 font-semibold">
                {session.ended_early ? "Early" : "On timer"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Research notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {note?.content_text ||
                (attachmentsWithUrls.length
                  ? "This session used handwritten notes."
                  : "No notes were saved.")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Handwritten notes</CardTitle>
          </CardHeader>
          <CardContent>
            {attachmentsWithUrls.length ? (
              <ul className="space-y-3">
                {attachmentsWithUrls.map((attachment) => (
                  <li
                    className="flex flex-col items-stretch gap-3 rounded-2xl border bg-background p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    key={attachment.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {attachment.file_name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {(attachment.size_bytes / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    {attachment.signedUrl ? (
                      <Button
                        asChild
                        className="w-full sm:w-auto"
                        variant="secondary"
                      >
                        <a
                          href={attachment.signedUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <FileText
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Open
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Unavailable
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No handwritten notes were uploaded.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {sources?.length ? (
              <ol className="space-y-4">
                {sources.map((source, index) => (
                  <li
                    className="rounded-2xl border bg-background p-4"
                    key={source.id}
                  >
                    <p className="text-sm font-semibold">
                      {index + 1}. {source.title}
                    </p>
                    {source.note ? (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {source.note}
                      </p>
                    ) : null}
                    <a
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
                      href={source.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Visit source
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">
                No sources were saved.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key claims</CardTitle>
          </CardHeader>
          <CardContent>
            {keyClaims?.length ? (
              <ul className="space-y-4">
                {keyClaims.map((keyClaim) => {
                  const linkedSource = keyClaim.source_id
                    ? sourceById.get(keyClaim.source_id)
                    : null;

                  return (
                    <li
                      className="rounded-2xl border bg-background p-4"
                      key={keyClaim.id}
                    >
                      <p className="text-sm leading-6">{keyClaim.claim}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {titleCase(keyClaim.confidence_level)} confidence
                        {linkedSource ? ` · ${linkedSource.title}` : ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No key claims were saved.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          {reflection ? (
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["What I learned", reflection.learned],
                ["What surprised me", reflection.surprised],
                ["What remains unclear", reflection.unclear]
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {value}
                  </p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground md:col-span-3">
                Confidence changed from {reflection.confidence_before}/5 to{" "}
                {reflection.confidence_after}/5.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reflection was saved.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
            AI Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {!aiFeedback ? (
            <p className="text-sm text-muted-foreground">
              No AI review was generated.
            </p>
          ) : aiNeedsRevision ? (
            <div className="rounded-2xl border border-accent bg-accent/10 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <CircleAlert className="h-4 w-4" aria-hidden="true" />
                Revision requested
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {aiFeedback.summary}
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-semibold">Session summary</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {aiFeedback.summary}
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                    Strengths
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {strengths.map((strength) => (
                      <li key={strength}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <CircleAlert className="h-4 w-4" aria-hidden="true" />
                    Gaps
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {gaps.map((gap) => (
                      <li key={gap}>• {gap}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <MessageCircleQuestion
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                    Follow-up questions
                  </p>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                    {followUpQuestions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
