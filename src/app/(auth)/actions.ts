"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";

import { env } from "@/lib/env";
import {
  getGoogleAuthErrorMessage,
  getLoginErrorMessage,
  getSignUpErrorMessage,
  signUpConfirmationMessage
} from "@/lib/auth/messages";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

const authSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Your password must be at least 8 characters.")
});

const oauthSchema = z.object({
  next: z.enum(["/dashboard", "/onboarding"]).default("/dashboard")
});

const initialErrorState = (message: string): AuthActionState => ({
  status: "error",
  message
});

export async function login(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const credentials = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!credentials.success) {
    return initialErrorState(
      credentials.error.issues[0]?.message ?? "Check your login details."
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials.data);

  if (error) {
    return initialErrorState(getLoginErrorMessage(error));
  }

  redirect("/dashboard");
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const credentials = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!credentials.success) {
    return initialErrorState(
      credentials.error.issues[0]?.message ?? "Check your account details."
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...credentials.data,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/onboarding`
    }
  });

  if (error) {
    return initialErrorState(getSignUpErrorMessage(error));
  }

  if (data.session) {
    redirect("/onboarding");
  }

  return {
    status: "success",
    message: signUpConfirmationMessage
  };
}

export async function signInWithGoogle(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const oauthOptions = oauthSchema.safeParse({
    next: formData.get("next") || undefined
  });

  if (!oauthOptions.success) {
    return initialErrorState(
      "Google sign-in could not be started. Please try again."
    );
  }

  const callbackUrl = new URL("/auth/callback", env.NEXT_PUBLIC_SITE_URL);
  callbackUrl.searchParams.set("next", oauthOptions.data.next);
  callbackUrl.searchParams.set("source", "google");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString()
    }
  });

  if (error || !data.url) {
    return initialErrorState(
      error
        ? getGoogleAuthErrorMessage(error)
        : "Google sign-in could not be started. Please try again."
    );
  }

  redirect(data.url as Route);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
