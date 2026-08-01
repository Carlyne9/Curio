"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInWithGoogle, type AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

type AuthFormProps = {
  action: (
    state: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>;
  alternateHref: "/login" | "/sign-up";
  alternateLabel: string;
  initialMessage?: string;
  oauthNext: "/dashboard" | "/onboarding";
  submitLabel: string;
};

const initialState: AuthActionState = {
  status: "idle",
  message: ""
};

export function AuthForm({
  action,
  alternateHref,
  alternateLabel,
  initialMessage,
  oauthNext,
  submitLabel
}: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [googleState, googleAction, isGooglePending] = useActionState(
    signInWithGoogle,
    initialState
  );
  const message = state.message || initialMessage;
  const isError = state.status === "error" || Boolean(initialMessage);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <label className="grid gap-2 text-sm font-medium">
          Email address
          <input
            autoComplete="email"
            className="rounded-2xl border bg-background px-4 py-3 font-normal"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Password
          <input
            autoComplete={
              alternateHref === "/login" ? "new-password" : "current-password"
            }
            className="rounded-2xl border bg-background px-4 py-3 font-normal"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </label>

        {message ? (
          <p
            aria-live="polite"
            className={
              isError ? "text-sm text-destructive" : "text-sm text-primary"
            }
          >
            {message}
          </p>
        ) : null}

        <Button
          className="w-full"
          disabled={isPending || isGooglePending}
          type="submit"
        >
          {isPending ? "Please wait…" : submitLabel}
        </Button>
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={googleAction} className="space-y-3">
        <input name="next" type="hidden" value={oauthNext} />
        <Button
          className="w-full"
          disabled={isPending || isGooglePending}
          type="submit"
          variant="secondary"
        >
          <span
            aria-hidden="true"
            className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-bold"
          >
            G
          </span>
          {isGooglePending ? "Opening Google…" : "Continue with Google"}
        </Button>
        {googleState.message ? (
          <p aria-live="polite" className="text-sm text-destructive">
            {googleState.message}
          </p>
        ) : null}
      </form>

      <Link
        className="block text-center text-sm font-medium text-muted-foreground hover:text-foreground"
        href={alternateHref}
      >
        {alternateLabel}
      </Link>
    </div>
  );
}
