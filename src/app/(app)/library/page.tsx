import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LibraryPage() {
  return (
    <AppShell title="Library">
      <Card>
        <CardHeader>
          <CardTitle>No saved sessions yet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Completed research sessions will appear here immediately after the completion flow.
          </p>
          <Link className="font-medium text-primary" href="/workspace">
            Start a research session
          </Link>
        </CardContent>
      </Card>
    </AppShell>
  );
}
