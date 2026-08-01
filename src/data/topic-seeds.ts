import topicSeedData from "@/data/topic-seeds.json";

export type TopicSeed = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  challengeId: string;
  challenge: string;
};

export const topicSeeds = topicSeedData as TopicSeed[];

export const topicCategories = [...new Set(topicSeeds.map((topic) => topic.category))];
