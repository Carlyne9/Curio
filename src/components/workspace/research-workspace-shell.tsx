import { Brain, CheckCircle2, Clock3, Library, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const checklist = ["Start timer", "Add notes", "Add one source", "Reflect", "Review AI feedback"];
const sources = ["Product management discovery notes", "Learning science overview"];
const keyClaims = ["Active recall beats passive review", "Reflection improves long-term retention"];

export function ResearchWorkspaceShell() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <header className="rounded-[2rem] border bg-card p-5 shadow-sm shadow-black/5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Research Mode
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Why do people remember stories better than facts?
              </h1>
              <p className="mt-2 max-w-3xl text-muted-foreground">
                Challenge: collect evidence, explain the idea simply, and write one surprising insight.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-muted px-4 py-3">
              <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-2xl font-semibold tabular-nums">25:00</span>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sources.map((source) => (
                  <div key={source} className="rounded-2xl bg-muted p-3 text-sm">
                    {source}
                  </div>
                ))}
                <Button className="w-full" variant="secondary">
                  Add source
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Claims</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {keyClaims.map((claim) => (
                  <div key={claim} className="rounded-2xl bg-muted p-3 text-sm">
                    {claim}
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          <Card className="min-h-[34rem]">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[28rem] rounded-[1.5rem] border bg-background p-5 text-muted-foreground">
                Start with one insight, question, or thing you want to understand.
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  Session Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklist.map((item) => (
                  <label key={item} className="flex items-center gap-3 text-sm">
                    <input type="checkbox" className="h-4 w-4 accent-primary" />
                    {item}
                  </label>
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
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>When you're ready, I can summarize, question, or challenge your understanding.</p>
                <Button className="w-full" variant="secondary">
                  Ask for a nudge
                </Button>
              </CardContent>
            </Card>
          </aside>
        </section>

        <footer className="sticky bottom-4 flex flex-col gap-3 rounded-full border bg-card/95 p-3 shadow-lg shadow-black/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 px-3 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            Saved just now
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Library className="mr-2 h-4 w-4" aria-hidden="true" />
              Save Draft
            </Button>
            <Button>Finish Session</Button>
          </div>
        </footer>
      </div>
    </main>
  );
}
