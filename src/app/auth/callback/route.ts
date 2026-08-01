import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error");
  const source = requestUrl.searchParams.get("source");
  const requestedPath = requestUrl.searchParams.get("next");
  const nextPath =
    requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/dashboard";

  if (code && !authError) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
    }
  }

  const authPageUrl = new URL(
    nextPath === "/onboarding" ? "/sign-up" : "/login",
    requestUrl.origin
  );
  authPageUrl.searchParams.set(
    "error",
    source === "google"
      ? "Google sign-in was cancelled or could not be completed. Please try again."
      : "The confirmation link was invalid or expired."
  );
  return NextResponse.redirect(authPageUrl);
}
