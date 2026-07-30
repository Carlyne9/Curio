import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Sessions", value: "0" },
  { label: "Hours Focused", value: "0" },
  { label: "Topics Saved", value: "0" }
];

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
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
            MVP One starts with the Research Workspace. The topic wheel can plug into this entry point next.
          </p>
          <Link className="font-medium text-primary" href="/workspace">
            Open workspace
          </Link>
        </CardContent>
      </Card>
    </AppShell>
  );
}
