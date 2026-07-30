"use server";

import { completeSessionSchema, keyClaimSchema, reflectionSchema, sourceSchema } from "@/lib/validations/workspace";

export async function startSession() {
  throw new Error("startSession is not implemented yet.");
}

export async function updateSession() {
  throw new Error("updateSession is not implemented yet.");
}

export async function autosaveNotes() {
  throw new Error("autosaveNotes is not implemented yet.");
}

export async function addSource(input: unknown) {
  const source = sourceSchema.parse(input);

  throw new Error(`addSource is not implemented yet: ${source.title}`);
}

export async function addKeyClaim(input: unknown) {
  const keyClaim = keyClaimSchema.parse(input);

  throw new Error(`addKeyClaim is not implemented yet: ${keyClaim.claim}`);
}

export async function submitReflection(input: unknown) {
  const reflection = reflectionSchema.parse(input);

  throw new Error(`submitReflection is not implemented yet: ${reflection.learned}`);
}

export async function generateAiReview() {
  throw new Error("generateAiReview is not implemented yet.");
}

export async function completeSession(input: unknown) {
  const session = completeSessionSchema.parse(input);

  throw new Error(`completeSession is not implemented yet: ${session.sessionId}`);
}
