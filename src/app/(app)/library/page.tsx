import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: sessions } = await supabase
    .from("research_sessions")
    .select("id, duration_minutes, completed_at, topic_id")
    .eq("user_id", user?.id ?? "")
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  const sessionIds = sessions?.map((session) => session.id) ?? [];
  const topicIds = [
    ...new Set(sessions?.flatMap((session) => (session.topic_id ? [session.topic_id] : [])) ?? [])
  ];
  const [{ data: notes }, { data: sources }, { data: topics }] = sessionIds.length
    ? await Promise.all([
        supabase.from("notes").select("session_id, content_text").in("session_id", sessionIds),
        supabase.from("sources").select("session_id").in("session_id", sessionIds),
        topicIds.length
          ? supabase.from("topics").select("id, title, category").in("id", topicIds)
          : Promise.resolve({ data: [] })
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const noteBySession = new Map(notes?.map((note) => [note.session_id, note.content_text]));
  const sourceCountBySession = new Map<string, number>();
  const topicById = new Map(topics?.map((topic) => [topic.id, topic]));

  sources?.forEach((source) => {
    sourceCountBySession.set(
      source.session_id,
      (sourceCountBySession.get(source.session_id) ?? 0) + 1
    );
  });

  return (
    <AppShell title="Library">
      {sessions?.length ? (
        <section className="grid gap-4 md:grid-cols-2">
          {sessions.map((session) => {
            const note = noteBySession.get(session.id) ?? "";
            const topic = session.topic_id ? topicById.get(session.topic_id) : null;
            const completedAt = session.completed_at
              ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                  new Date(session.completed_at)
                )
              : "Recently";

            return (
              <Card key={session.id}>
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {topic?.category ?? "Curiosity"} · {completedAt}
                  </p>
                  <CardTitle className="mt-2 text-xl">
                    {topic?.title ?? "Completed research session"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {note || "A completed Curio research session."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.duration_minutes} minutes · {sourceCountBySession.get(session.id) ?? 0}{" "}
                    sources
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No saved sessions yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Finish your first research loop and it will appear here with your notes and sources.
            </p>
            <Link className="font-medium text-primary" href="/onboarding">
              Spin for a topic
            </Link>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
