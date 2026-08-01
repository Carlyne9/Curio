"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import {
  completeSessionSchema,
  keyClaimInputSchema,
  keyClaimMutationInputSchema,
  notesSchema,
  reflectionInputSchema,
  sourceInputSchema,
  sourceMutationInputSchema,
  workspaceItemDeleteSchema
} from "@/lib/validations/workspace";

export type WorkspaceActionResult = {
  ok: boolean;
  message: string;
};

const startSessionSchema = z.object({
  topicId: z.string().uuid(),
  challengeId: z.string().uuid(),
  difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(10)
    .max(60)
    .refine((value) => value % 5 === 0)
});

const updateSessionSchema = z.object({
  sessionId: z.string().uuid(),
  status: z.enum(["draft", "active", "reflecting"])
});

const timerSessionSchema = z.object({
  sessionId: z.string().uuid()
});

function validationError(error: z.ZodError): WorkspaceActionResult {
  return {
    ok: false,
    message: error.issues[0]?.message ?? "Check the information and try again."
  };
}

async function authenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function startSession(formData: FormData) {
  const input = startSessionSchema.safeParse({
    topicId: formData.get("topicId"),
    challengeId: formData.get("challengeId"),
    difficultyLevel: formData.get("difficultyLevel"),
    durationMinutes: formData.get("durationMinutes")
  });

  if (!input.success) {
    redirect("/onboarding?error=Choose+a+topic+and+a+timer+between+10+and+60+minutes.");
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    redirect("/login");
  }

  const { data: existingSession } = await supabase
    .from("research_sessions")
    .select("id, topic_id")
    .eq("user_id", user.id)
    .in("status", ["draft", "active", "reflecting"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id")
    .eq("id", input.data.challengeId)
    .eq("topic_id", input.data.topicId)
    .maybeSingle();

  if (!challenge) {
    redirect("/onboarding?error=That+topic+is+not+available+yet.");
  }

  const now = new Date().toISOString();
  const focusEndsAt = new Date(
    Date.now() + input.data.durationMinutes * 60 * 1000
  ).toISOString();

  if (existingSession?.topic_id) {
    redirect("/workspace");
  }

  if (existingSession) {
    const { error } = await supabase
      .from("research_sessions")
      .update({
        topic_id: input.data.topicId,
        challenge_id: input.data.challengeId,
        difficulty_level: input.data.difficultyLevel,
        duration_minutes: input.data.durationMinutes,
        status: "active",
        started_at: now,
        focus_ends_at: focusEndsAt,
        break_started_at: null,
        break_ends_at: null,
        break_duration_seconds: 0,
        break_taken: false,
        extension_used: false,
        ended_early: false,
        focus_finished_at: null,
        actual_focus_seconds: null,
        updated_at: now
      })
      .eq("id", existingSession.id)
      .eq("user_id", user.id);

    if (error) {
      redirect("/onboarding?error=We+could+not+start+the+session.");
    }
  } else {
    const { error } = await supabase.from("research_sessions").insert({
      user_id: user.id,
      topic_id: input.data.topicId,
      challenge_id: input.data.challengeId,
      difficulty_level: input.data.difficultyLevel,
      status: "active",
      duration_minutes: input.data.durationMinutes,
      started_at: now,
      focus_ends_at: focusEndsAt,
      updated_at: now
    });

    if (error) {
      redirect("/onboarding?error=We+could+not+start+the+session.");
    }
  }

  revalidatePath("/workspace");
  redirect("/workspace");
}

export async function updateSession(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = updateSessionSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to update this session." };
  }

  const { error } = await supabase
    .from("research_sessions")
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString()
    })
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "The session could not be updated." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Session updated." };
}

export async function takeMidpointBreak(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = timerSessionSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again before taking a break." };
  }

  const { data: session, error: sessionError } = await supabase
    .from("research_sessions")
    .select("duration_minutes, started_at, focus_ends_at, break_taken")
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (sessionError || !session?.started_at || !session.focus_ends_at) {
    return { ok: false, message: "The timer could not start a break." };
  }

  if (session.break_taken) {
    return { ok: false, message: "The midpoint break has already been used." };
  }

  const now = Date.now();
  const startedAt = new Date(session.started_at).getTime();
  const halfwayAt = startedAt + (session.duration_minutes * 60 * 1000) / 2;
  const currentFocusEnd = new Date(session.focus_ends_at).getTime();

  if (now < halfwayAt) {
    return { ok: false, message: "The break unlocks halfway through the focus session." };
  }

  if (now >= currentFocusEnd) {
    return { ok: false, message: "Focus time has already ended." };
  }

  const breakMinutes = Math.min(5, Math.max(2, Math.round(session.duration_minutes * 0.1)));
  const breakDurationSeconds = breakMinutes * 60;
  const breakEndsAt = new Date(now + breakDurationSeconds * 1000).toISOString();
  const focusEndsAt = new Date(
    currentFocusEnd + breakDurationSeconds * 1000
  ).toISOString();

  const { error } = await supabase
    .from("research_sessions")
    .update({
      break_started_at: new Date(now).toISOString(),
      break_ends_at: breakEndsAt,
      break_duration_seconds: breakDurationSeconds,
      break_taken: true,
      focus_ends_at: focusEndsAt,
      updated_at: new Date(now).toISOString()
    })
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "The break could not be started." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: `${breakMinutes}-minute break started.` };
}

export async function endMidpointBreak(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = timerSessionSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to resume focus." };
  }

  const { data: session } = await supabase
    .from("research_sessions")
    .select("break_started_at, break_ends_at, focus_ends_at")
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!session?.break_started_at || !session.break_ends_at || !session.focus_ends_at) {
    return { ok: false, message: "There is no active break to end." };
  }

  const now = Date.now();
  const breakEndsAt = new Date(session.break_ends_at).getTime();

  if (now >= breakEndsAt) {
    return { ok: true, message: "Break complete. Focus resumed." };
  }

  const unusedBreakSeconds = Math.ceil((breakEndsAt - now) / 1000);
  const usedBreakSeconds = Math.max(
    0,
    Math.floor((now - new Date(session.break_started_at).getTime()) / 1000)
  );
  const adjustedFocusEnd = new Date(
    new Date(session.focus_ends_at).getTime() - unusedBreakSeconds * 1000
  ).toISOString();

  const { error } = await supabase
    .from("research_sessions")
    .update({
      break_ends_at: new Date(now).toISOString(),
      break_duration_seconds: usedBreakSeconds,
      focus_ends_at: adjustedFocusEnd,
      updated_at: new Date(now).toISOString()
    })
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "Focus could not be resumed." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Break ended. Focus resumed." };
}

export async function addFiveMinutes(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = timerSessionSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to extend the session." };
  }

  const { data: session } = await supabase
    .from("research_sessions")
    .select("focus_ends_at, extension_used, focus_finished_at")
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!session?.focus_ends_at || session.focus_finished_at) {
    return { ok: false, message: "This focus session can no longer be extended." };
  }

  if (session.extension_used) {
    return { ok: false, message: "The five-minute extension has already been used." };
  }

  const now = Date.now();

  if (now < new Date(session.focus_ends_at).getTime()) {
    return { ok: false, message: "The extension becomes available when the timer ends." };
  }

  const { error } = await supabase
    .from("research_sessions")
    .update({
      focus_ends_at: new Date(now + 5 * 60 * 1000).toISOString(),
      extension_used: true,
      status: "active",
      updated_at: new Date(now).toISOString()
    })
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "Five minutes could not be added." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Five minutes added." };
}

export async function finishFocusEarly(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = timerSessionSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to end focus." };
  }

  const { data: session } = await supabase
    .from("research_sessions")
    .select("started_at, break_started_at, break_ends_at, break_duration_seconds")
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!session?.started_at) {
    return { ok: false, message: "The focus session could not be ended." };
  }

  const now = Date.now();
  const elapsedSeconds = Math.max(
    0,
    Math.floor((now - new Date(session.started_at).getTime()) / 1000)
  );
  const breakSeconds =
    session.break_started_at && session.break_ends_at
      ? Math.min(
          session.break_duration_seconds,
          Math.max(0, Math.floor((now - new Date(session.break_started_at).getTime()) / 1000))
        )
      : 0;
  const actualFocusSeconds = Math.max(0, elapsedSeconds - breakSeconds);
  const timestamp = new Date(now).toISOString();

  const { error } = await supabase
    .from("research_sessions")
    .update({
      status: "reflecting",
      focus_ends_at: timestamp,
      focus_finished_at: timestamp,
      actual_focus_seconds: actualFocusSeconds,
      ended_early: true,
      updated_at: timestamp
    })
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "Focus could not be ended early." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Focus ended. Your notes are safe—time to reflect." };
}

export async function autosaveNotes(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = notesSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to save your notes." };
  }

  const { data: existingNote, error: lookupError } = await supabase
    .from("notes")
    .select("id")
    .eq("session_id", parsed.data.sessionId)
    .maybeSingle();

  if (lookupError) {
    return { ok: false, message: "Your notes could not be checked." };
  }

  const now = new Date().toISOString();
  const notePayload = {
    content_json: parsed.data.contentJson ?? { type: "text", content: parsed.data.content },
    content_text: parsed.data.content,
    updated_at: now
  };

  const { error } = existingNote
    ? await supabase.from("notes").update(notePayload).eq("id", existingNote.id)
    : await supabase.from("notes").insert({
        session_id: parsed.data.sessionId,
        ...notePayload
      });

  if (error) {
    return { ok: false, message: "Your notes could not be saved." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Notes saved." };
}

export async function addSource(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = sourceInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to add a source." };
  }

  const { error } = await supabase.from("sources").insert({
    session_id: parsed.data.sessionId,
    title: parsed.data.title,
    url: parsed.data.url,
    note: parsed.data.note || null
  });

  if (error) {
    return { ok: false, message: "That source could not be saved." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Source added." };
}

export async function updateSource(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = sourceMutationInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to update this source." };
  }

  const { data: updatedSource, error } = await supabase
    .from("sources")
    .update({
      title: parsed.data.title,
      url: parsed.data.url,
      note: parsed.data.note || null
    })
    .eq("id", parsed.data.sourceId)
    .eq("session_id", parsed.data.sessionId)
    .select("id")
    .maybeSingle();

  if (error || !updatedSource) {
    return { ok: false, message: "That source could not be updated." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Source updated." };
}

export async function deleteSource(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = workspaceItemDeleteSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to delete this source." };
  }

  const { data: deletedSource, error } = await supabase
    .from("sources")
    .delete()
    .eq("id", parsed.data.itemId)
    .eq("session_id", parsed.data.sessionId)
    .select("id")
    .maybeSingle();

  if (error || !deletedSource) {
    return { ok: false, message: "That source could not be deleted." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Source deleted." };
}

export async function addKeyClaim(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = keyClaimInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to add a key claim." };
  }

  const { error } = await supabase.from("key_claims").insert({
    session_id: parsed.data.sessionId,
    claim: parsed.data.claim,
    source_id: parsed.data.sourceId || null,
    confidence_level: parsed.data.confidenceLevel
  });

  if (error) {
    return { ok: false, message: "That key claim could not be saved." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Key claim added." };
}

export async function updateKeyClaim(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = keyClaimMutationInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to update this key claim." };
  }

  const { data: updatedKeyClaim, error } = await supabase
    .from("key_claims")
    .update({
      claim: parsed.data.claim,
      source_id: parsed.data.sourceId || null,
      confidence_level: parsed.data.confidenceLevel
    })
    .eq("id", parsed.data.keyClaimId)
    .eq("session_id", parsed.data.sessionId)
    .select("id")
    .maybeSingle();

  if (error || !updatedKeyClaim) {
    return { ok: false, message: "That key claim could not be updated." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Key claim updated." };
}

export async function deleteKeyClaim(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = workspaceItemDeleteSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to delete this key claim." };
  }

  const { data: deletedKeyClaim, error } = await supabase
    .from("key_claims")
    .delete()
    .eq("id", parsed.data.itemId)
    .eq("session_id", parsed.data.sessionId)
    .select("id")
    .maybeSingle();

  if (error || !deletedKeyClaim) {
    return { ok: false, message: "That key claim could not be deleted." };
  }

  revalidatePath("/workspace");
  return { ok: true, message: "Key claim deleted." };
}

export async function submitReflection(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = reflectionInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to save your reflection." };
  }

  const { error } = await supabase.from("reflections").upsert(
    {
      session_id: parsed.data.sessionId,
      learned: parsed.data.learned,
      surprised: parsed.data.surprised,
      unclear: parsed.data.unclear,
      confidence_before: parsed.data.confidenceBefore,
      confidence_after: parsed.data.confidenceAfter
    },
    { onConflict: "session_id" }
  );

  if (error) {
    return { ok: false, message: "Your reflection could not be saved." };
  }

  await supabase
    .from("research_sessions")
    .update({ status: "reflecting", updated_at: new Date().toISOString() })
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id);

  revalidatePath("/workspace");
  return { ok: true, message: "Reflection saved." };
}

export async function generateAiReview(): Promise<WorkspaceActionResult> {
  return { ok: false, message: "AI review is coming in the next MVP slice." };
}

export async function completeSession(input: unknown): Promise<WorkspaceActionResult> {
  const parsed = completeSessionSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, message: "Log in again to finish this session." };
  }

  const [
    { count: sourceCount },
    { data: reflection },
    { data: note },
    { count: attachmentCount },
    { data: session }
  ] = await Promise.all([
    supabase
      .from("sources")
      .select("id", { count: "exact", head: true })
      .eq("session_id", parsed.data.sessionId),
    supabase
      .from("reflections")
      .select("id")
      .eq("session_id", parsed.data.sessionId)
      .maybeSingle(),
    supabase
      .from("notes")
      .select("content_text")
      .eq("session_id", parsed.data.sessionId)
      .maybeSingle(),
    supabase
      .from("note_attachments")
      .select("id", { count: "exact", head: true })
      .eq("session_id", parsed.data.sessionId),
    supabase
      .from("research_sessions")
      .select(
        "duration_minutes, focus_ends_at, focus_finished_at, actual_focus_seconds, extension_used"
      )
      .eq("id", parsed.data.sessionId)
      .eq("user_id", user.id)
      .maybeSingle()
  ]);

  if (!session) {
    return { ok: false, message: "The focus session could not be found." };
  }

  const focusHasEnded =
    Boolean(session.focus_finished_at) ||
    (session.focus_ends_at && Date.now() >= new Date(session.focus_ends_at).getTime());

  if (!focusHasEnded) {
    return {
      ok: false,
      message: "Finish the focus timer or use End focus early before completing the session."
    };
  }

  if (!note?.content_text.trim() && !attachmentCount) {
    return { ok: false, message: "Add at least one note before finishing." };
  }

  if (!sourceCount) {
    return { ok: false, message: "Add at least one source before finishing." };
  }

  if (!reflection) {
    return { ok: false, message: "Complete your reflection before finishing." };
  }

  const now = new Date().toISOString();
  const actualFocusSeconds =
    session.actual_focus_seconds ??
    session.duration_minutes * 60 +
      (session.extension_used ? 5 * 60 : 0);
  const { error } = await supabase
    .from("research_sessions")
    .update({
      status: "completed",
      completed_at: now,
      focus_finished_at: session.focus_finished_at ?? now,
      actual_focus_seconds: actualFocusSeconds,
      updated_at: now
    })
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: "The session could not be completed." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/library");
  revalidatePath("/workspace");
  return { ok: true, message: "Session saved to your library." };
}
