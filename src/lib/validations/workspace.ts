import { z } from "zod";

export const sessionIdSchema = z
  .string()
  .uuid("The research session is invalid.");

export const sourceSchema = z.object({
  title: z.string().min(1, "Add a source title."),
  url: z.string().url("Add a valid URL."),
  note: z.string().optional()
});

export const keyClaimSchema = z.object({
  claim: z.string().min(1, "Capture the claim."),
  sourceId: z.string().uuid().optional(),
  confidenceLevel: z.enum(["low", "medium", "high"])
});

export const reflectionSchema = z.object({
  learned: z.string().min(1, "Write your big takeaway."),
  surprised: z.string().min(1, "Write what surprised you."),
  unclear: z.string().min(1, "Write what remains unclear.")
});

export const completeSessionSchema = z.object({
  sessionId: z.string().uuid()
});

export const notesSchema = z.object({
  sessionId: sessionIdSchema,
  content: z.string().max(100_000, "Your notes are too long to save."),
  contentJson: z.unknown().optional()
});

export const sourceInputSchema = sourceSchema.extend({
  sessionId: sessionIdSchema
});

export const sourceMutationInputSchema = sourceInputSchema.extend({
  sourceId: z.string().uuid("The source is invalid.")
});

export const keyClaimInputSchema = keyClaimSchema.extend({
  sessionId: sessionIdSchema
});

export const keyClaimMutationInputSchema = keyClaimInputSchema.extend({
  keyClaimId: z.string().uuid("The key claim is invalid.")
});

export const workspaceItemDeleteSchema = z.object({
  sessionId: sessionIdSchema,
  itemId: z.string().uuid("The workspace item is invalid.")
});

export const reflectionInputSchema = reflectionSchema.extend({
  sessionId: sessionIdSchema
});
