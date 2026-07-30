import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import type { ResearchSessionReviewInput } from "@/types/workspace";

export const aiReviewSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()).min(1),
  gaps: z.array(z.string()).min(1),
  followUpQuestions: z.array(z.string()).min(2).max(3),
  suggestedTopics: z.array(z.string()).min(2).max(3)
});

export type AiReview = z.infer<typeof aiReviewSchema>;

export async function generateResearchSessionReview(input: ResearchSessionReviewInput) {
  const result = await generateObject({
    model: openai("gpt-5-mini"),
    schema: aiReviewSchema,
    prompt: [
      "You are Curio's AI learning coach.",
      "Review the user's learning session.",
      "Be concise, encouraging, and intellectually honest.",
      "Challenge gaps without doing the thinking for the user.",
      `Topic: ${input.topic}`,
      `Challenge: ${input.challenge}`,
      `Notes: ${input.notes}`,
      `Sources: ${input.sources.join(", ")}`,
      `Reflection: ${input.reflection}`
    ].join("\n\n")
  });

  return result.object;
}
