import { redirect } from "next/navigation";

import { TopicDiscovery } from "@/components/onboarding/topic-discovery";
import { createClient } from "@/lib/supabase/server";

type OnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await searchParams;
  return <TopicDiscovery error={error} />;
}
