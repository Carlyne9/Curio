export type SessionStatus = "draft" | "active" | "reflecting" | "completed";

export type ConfidenceLevel = "low" | "medium" | "high";
export type ResearchDifficulty = "beginner" | "intermediate" | "advanced";

export type ResearchSession = {
  id: string;
  userId: string;
  topicId: string;
  challengeId: string;
  status: SessionStatus;
  durationMinutes: number;
  difficultyLevel: ResearchDifficulty;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Source = {
  id: string;
  sessionId: string;
  title: string;
  url: string;
  note?: string;
  createdAt: string;
};

export type KeyClaim = {
  id: string;
  sessionId: string;
  claim: string;
  sourceId?: string;
  confidenceLevel: ConfidenceLevel;
  createdAt: string;
};

export type Reflection = {
  learned: string;
  surprised: string;
  unclear: string;
};

export type ResearchSessionReviewInput = {
  attachments: Array<{
    data: Uint8Array;
    fileName: string;
    mimeType: string;
  }>;
  topic: string;
  challenge: string;
  notes: string;
  sources: string[];
  keyClaims: string[];
  reflection: string;
};
