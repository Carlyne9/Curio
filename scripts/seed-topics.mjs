import { readFile } from "node:fs/promises";

import { createClient } from "@supabase/supabase-js";

const seeds = JSON.parse(
  await readFile(new URL("../src/data/topic-seeds.json", import.meta.url), "utf8")
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase URL or service-role key.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const { error: topicError } = await supabase.from("topics").upsert(
  seeds.map((topic) => ({
    id: topic.id,
    title: topic.title,
    category: topic.category,
    difficulty: topic.difficulty,
    duration_minutes: 25
  }))
);

if (topicError) {
  throw topicError;
}

const { error: challengeError } = await supabase.from("challenges").upsert(
  seeds.map((topic) => ({
    id: topic.challengeId,
    topic_id: topic.id,
    prompt: topic.challenge
  }))
);

if (challengeError) {
  throw challengeError;
}

console.log(`Seeded ${seeds.length} Curio topics and challenges.`);
