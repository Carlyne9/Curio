import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: sessions } = await supabase
    .from("research_sessions")
    .select("id, status, duration_minutes")
    .eq("user_id", user?.id ?? "");

  const completedSessions = sessions?.filter((session) => session.status === "completed") ?? [];
  const activeSession = sessions?.find((session) =>
    ["draft", "active", "reflecting"].includes(session.status)
  );
  const focusedMinutes = completedSessions.reduce(
    (total, session) => total + session.duration_minutes,
    0
  );
  const stats = [
    { label: "Sessions", value: String(sessions?.length ?? 0) },
    { label: "Hours Focused", value: (focusedMinutes / 60).toFixed(1) },
    { label: "Saved to Library", value: String(completedSessions.length) }
  ];

  return (
    <AppShell title="Dashboard">
      <p className="-mt-3 text-sm text-muted-foreground">{user?.email}</p>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Next Learning Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Explore why stories are easier to remember than isolated facts, then capture what
            changes in your understanding.
          </p>
          <Link className="font-medium text-primary" href={activeSession ? "/workspace" : "/onboarding"}>
            {activeSession ? "Resume research workspace" : "Spin for a topic"}
          </Link>
        </CardContent>
      </Card>
    </AppShell>
  );
}
