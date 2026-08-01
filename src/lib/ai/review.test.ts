import { describe, expect, it } from "vitest";

import { normalizeGeneratedReview } from "@/lib/ai/review";

describe("AI review alignment gate", () => {
  it("returns coaching for aligned research", () => {
    const review = normalizeGeneratedReview({
      alignment: "aligned",
      revisionMessage: "",
      summary: "The notes address the assigned topic.",
      strengths: ["Clear explanation", "Relevant claim"],
      gaps: ["Compare another source", "Clarify uncertainty"],
      followUpQuestions: [
        "What evidence is strongest?",
        "What remains uncertain?"
      ]
    });

    expect(review.alignment).toBe("aligned");
    if (review.alignment === "aligned") {
      expect(review.strengths).toHaveLength(2);
      expect(review.followUpQuestions).toHaveLength(2);
    }
  });

  it("strips all feedback when research needs revision", () => {
    const review = normalizeGeneratedReview({
      alignment: "needs_revision",
      revisionMessage: "Revise the notes so they address photosynthesis.",
      summary: "This should not be shown.",
      strengths: ["This should not be shown."],
      gaps: ["This should not be shown."],
      followUpQuestions: ["This should not be shown?"]
    });

    expect(review).toEqual({
      alignment: "needs_revision",
      revisionMessage: "Revise the notes so they address photosynthesis."
    });
  });
});
