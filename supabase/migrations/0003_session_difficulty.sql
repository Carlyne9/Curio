alter table public.research_sessions
  add column if not exists difficulty_level text not null default 'beginner';

alter table public.research_sessions
  drop constraint if exists research_sessions_difficulty_level_check;

alter table public.research_sessions
  add constraint research_sessions_difficulty_level_check
  check (difficulty_level in ('beginner', 'intermediate', 'advanced'));
