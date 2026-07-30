import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in to Curio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Authentication wiring will connect here during the persistence slice.
          </p>
          <Button asChild className="w-full">
            <Link href="/dashboard">Continue to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
