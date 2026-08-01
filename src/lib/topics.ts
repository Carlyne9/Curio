export type ResearchDifficulty = "beginner" | "intermediate" | "advanced";

export const researchDifficulties: Array<{
  value: ResearchDifficulty;
  label: string;
  description: string;
}> = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Build a clear foundation with approachable explanations."
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Compare evidence, explanations, and meaningful trade-offs."
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Evaluate competing evidence and defend your own synthesis."
  }
];

const difficultyInstructions: Record<ResearchDifficulty, string> = {
  beginner: "Focus on the core ideas and explain them simply.",
  intermediate: "Compare evidence and identify meaningful trade-offs.",
  advanced: "Evaluate competing evidence and form a defensible synthesis."
};

export function buildDifficultyChallenge(
  challenge: string,
  difficulty: ResearchDifficulty
) {
  return `${difficultyInstructions[difficulty]} ${challenge}`;
}
