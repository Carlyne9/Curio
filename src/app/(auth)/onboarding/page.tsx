import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Onboarding</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Build your first learning loop.</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        Curio will guide new users through choosing a topic, starting a timer, capturing notes, and reflecting before saving.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/workspace">Start preview session</Link>
        </Button>
      </div>
    </main>
  );
}
