import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your Curio account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sign-up UI and Supabase Auth actions will be added after the static UX slice.
          </p>
          <Button asChild className="w-full">
            <Link href="/onboarding">Preview onboarding</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
