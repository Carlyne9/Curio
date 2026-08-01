import Link from "next/link";

import { signUp } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 sm:px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your Curio account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Start with one focused research session. Your library grows from
            there.
          </p>
          <AuthForm
            action={signUp}
            alternateHref="/login"
            alternateLabel="Already have an account? Log in"
            submitLabel="Create account"
          />
          <Link
            className="block text-center text-xs text-muted-foreground"
            href="/"
          >
            Back to home
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
