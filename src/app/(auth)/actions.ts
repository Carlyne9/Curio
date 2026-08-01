"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

const authSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Your password must be at least 8 characters.")
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
    return initialErrorState(credentials.error.issues[0]?.message ?? "Check your login details.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials.data);

  if (error) {
    return initialErrorState("We could not log you in. Check your email and password.");
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
    return initialErrorState(credentials.error.issues[0]?.message ?? "Check your account details.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...credentials.data,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/onboarding`
    }
  });

  if (error) {
    return initialErrorState(error.message);
  }

  if (data.session) {
    redirect("/onboarding");
  }

  return {
    status: "success",
    message: "Check your inbox to confirm your email, then continue to Curio."
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
