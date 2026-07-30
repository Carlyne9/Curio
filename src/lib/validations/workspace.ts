import { z } from "zod";

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
  learned: z.string().min(1, "Write what you learned."),
  surprised: z.string().min(1, "Write what surprised you."),
  unclear: z.string().min(1, "Write what remains unclear."),
  confidenceBefore: z.number().min(1).max(5),
  confidenceAfter: z.number().min(1).max(5)
});

export const completeSessionSchema = z.object({
  sessionId: z.string().uuid(),
  reflection: reflectionSchema,
  sourceCount: z.number().min(1, "Add at least one source before finishing.")
});
