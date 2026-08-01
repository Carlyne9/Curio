import type { Route } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { matchesLibraryFilters } from "@/lib/library";
import { createClient } from "@/lib/supabase/server";

type LibraryPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
  }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const filters = await searchParams;
  const query = typeof filters.q === "string" ? filters.q.trim() : "";
  const selectedCategory =
    typeof filters.category === "string" ? filters.category.trim() : "";
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: sessions } = await supabase
    .from("research_sessions")
    .select(
      "id, duration_minutes, actual_focus_seconds, completed_at, topic_id"
    )
    .eq("user_id", user?.id ?? "")
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  const sessionIds = sessions?.map((session) => session.id) ?? [];
  const topicIds = [
    ...new Set(
      sessions?.flatMap((session) =>
        session.topic_id ? [session.topic_id] : []
      ) ?? []
    )
  ];
  const [{ data: notes }, { data: sources }, { data: topics }] =
    sessionIds.length
      ? await Promise.all([
          supabase
            .from("notes")
            .select("session_id, content_text")
            .in("session_id", sessionIds),
          supabase
            .from("sources")
            .select("session_id")
            .in("session_id", sessionIds),
          topicIds.length
            ? supabase
                .from("topics")
                .select("id, title, category")
                .in("id", topicIds)
            : Promise.resolve({ data: [] })
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];

  const noteBySession = new Map(
    notes?.map((note) => [note.session_id, note.content_text])
  );
  const sourceCountBySession = new Map<string, number>();
  const topicById = new Map(topics?.map((topic) => [topic.id, topic]));
  const categories = [
    ...new Set(topics?.map((topic) => topic.category) ?? [])
  ].sort();

  sources?.forEach((source) => {
    sourceCountBySession.set(
      source.session_id,
      (sourceCountBySession.get(source.session_id) ?? 0) + 1
    );
  });

  const filteredSessions = (sessions ?? []).filter((session) => {
    const topic = session.topic_id ? topicById.get(session.topic_id) : null;
    const note = noteBySession.get(session.id) ?? "";

    return matchesLibraryFilters({
      notes: note,
      query,
      selectedCategory,
      topicCategory: topic?.category,
      topicTitle: topic?.title
    });
  });

  return (
    <AppShell title="Library">
      <Card>
        <CardContent className="pt-5">
          <form
            className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_auto]"
            method="get"
          >
            <label className="grid gap-2 text-sm font-medium">
              Search saved research
              <span className="relative">
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  className="w-full rounded-2xl border bg-background py-2.5 pl-10 pr-4 font-normal"
                  defaultValue={query}
                  name="q"
                  placeholder="Topic, category, or notes"
                  type="search"
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Category
              <select
                className="rounded-2xl border bg-background px-4 py-2.5 font-normal"
                defaultValue={selectedCategory}
                name="category"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end gap-2">
              <Button className="flex-1 md:flex-none" type="submit">
                Search
              </Button>
              {query || selectedCategory ? (
                <Button asChild variant="ghost">
                  <Link href="/library">Clear</Link>
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {filteredSessions.length ? (
        <>
          <p className="text-sm text-muted-foreground">
            {filteredSessions.length} saved session
            {filteredSessions.length === 1 ? "" : "s"}
          </p>
          <section className="grid gap-4 md:grid-cols-2">
            {filteredSessions.map((session) => {
              const note = noteBySession.get(session.id) ?? "";
              const topic = session.topic_id
                ? topicById.get(session.topic_id)
                : null;
              const completedAt = session.completed_at
                ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                    new Date(session.completed_at)
                  )
                : "Recently";
              const focusedMinutes = Math.max(
                1,
                Math.round(
                  (session.actual_focus_seconds ??
                    session.duration_minutes * 60) / 60
                )
              );

              return (
                <Card className="flex h-full flex-col" key={session.id}>
                  <CardHeader>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {topic?.category ?? "Curiosity"} · {completedAt}
                    </p>
                    <CardTitle className="mt-2 text-xl">
                      {topic?.title ?? "Completed research session"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col space-y-4">
                    <p className="line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
                      {note ||
                        "A completed Curio research session with handwritten notes."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {focusedMinutes} focused minutes ·{" "}
                      {sourceCountBySession.get(session.id) ?? 0} sources
                    </p>
                    <Button asChild className="w-full" variant="secondary">
                      <Link href={`/library/${session.id}` as Route}>
                        Open session
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        </>
      ) : sessions?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No sessions match those filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Try a broader keyword or return to all saved sessions.
            </p>
            <Link className="font-medium text-primary" href="/library">
              Clear library filters
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No saved sessions yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Finish your first research loop and it will appear here with your
              notes and sources.
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
