import Link from "next/link";

import { login } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 sm:px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in to Curio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Continue building your knowledge library.
          </p>
          <AuthForm
            action={login}
            alternateHref="/sign-up"
            alternateLabel="New to Curio? Create an account"
            initialMessage={error}
            oauthNext="/dashboard"
            submitLabel="Log in"
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
