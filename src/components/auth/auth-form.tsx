"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

type AuthFormProps = {
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  alternateHref: "/login" | "/sign-up";
  alternateLabel: string;
  initialMessage?: string;
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
  submitLabel
}: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const message = state.message || initialMessage;
  const isError = state.status === "error" || Boolean(initialMessage);

  return (
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
          autoComplete={alternateHref === "/login" ? "new-password" : "current-password"}
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
          className={isError ? "text-sm text-destructive" : "text-sm text-primary"}
        >
          {message}
        </p>
      ) : null}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Please wait…" : submitLabel}
      </Button>

      <Link
        className="block text-center text-sm font-medium text-muted-foreground hover:text-foreground"
        href={alternateHref}
      >
        {alternateLabel}
      </Link>
    </form>
  );
}
