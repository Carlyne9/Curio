create extension if not exists "pgcrypto";

create type public.session_status as enum ('draft', 'active', 'reflecting', 'completed');
create type public.confidence_level as enum ('low', 'medium', 'high');

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  difficulty text not null default 'Beginner',
  duration_minutes integer not null default 25,
  created_at timestamptz not null default now()
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  prompt text not null,
  created_at timestamptz not null default now()
);

create table public.research_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  challenge_id uuid references public.challenges(id) on delete set null,
  status public.session_status not null default 'draft',
  duration_minutes integer not null default 25,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.research_sessions(id) on delete cascade,
  content_json jsonb not null default '{}'::jsonb,
  content_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.research_sessions(id) on delete cascade,
  title text not null,
  url text not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.key_claims (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.research_sessions(id) on delete cascade,
  claim text not null,
  source_id uuid references public.sources(id) on delete set null,
  confidence_level public.confidence_level not null default 'medium',
  created_at timestamptz not null default now()
);

create table public.reflections (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.research_sessions(id) on delete cascade,
  learned text not null,
  surprised text not null,
  unclear text not null,
  confidence_before integer not null check (confidence_before between 1 and 5),
  confidence_after integer not null check (confidence_after between 1 and 5),
  created_at timestamptz not null default now()
);

create table public.ai_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.research_sessions(id) on delete cascade,
  summary text not null,
  strengths jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  follow_up_questions jsonb not null default '[]'::jsonb,
  suggested_topics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.topics enable row level security;
alter table public.challenges enable row level security;
alter table public.research_sessions enable row level security;
alter table public.notes enable row level security;
alter table public.sources enable row level security;
alter table public.key_claims enable row level security;
alter table public.reflections enable row level security;
alter table public.ai_feedback enable row level security;

create policy "Anyone can read topics"
  on public.topics for select
  using (true);

create policy "Anyone can read challenges"
  on public.challenges for select
  using (true);

create policy "Users manage own sessions"
  on public.research_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own notes"
  on public.notes for all
  using (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = notes.session_id
      and research_sessions.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = notes.session_id
      and research_sessions.user_id = auth.uid()
    )
  );

create policy "Users manage own sources"
  on public.sources for all
  using (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = sources.session_id
      and research_sessions.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = sources.session_id
      and research_sessions.user_id = auth.uid()
    )
  );

create policy "Users manage own key claims"
  on public.key_claims for all
  using (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = key_claims.session_id
      and research_sessions.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = key_claims.session_id
      and research_sessions.user_id = auth.uid()
    )
  );

create policy "Users manage own reflections"
  on public.reflections for all
  using (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = reflections.session_id
      and research_sessions.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = reflections.session_id
      and research_sessions.user_id = auth.uid()
    )
  );

create policy "Users manage own ai feedback"
  on public.ai_feedback for all
  using (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = ai_feedback.session_id
      and research_sessions.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.research_sessions
      where research_sessions.id = ai_feedback.session_id
      and research_sessions.user_id = auth.uid()
    )
  );
