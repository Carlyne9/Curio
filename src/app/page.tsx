import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <nav className="flex items-center justify-between">
        <span className="text-lg font-semibold">Curio</span>
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground"
        >
          Log in
        </Link>
      </nav>

      <section className="flex flex-1 flex-col justify-center py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Curious on purpose
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-7xl">
          Turn a spark of curiosity into a lasting knowledge library.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Curio guides you through focused research, reflection, AI coaching,
          and review — without turning learning into another messy folder of
          forgotten notes.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/sign-up">Start learning</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/login">Open your library</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
