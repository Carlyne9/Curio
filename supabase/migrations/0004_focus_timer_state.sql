alter table public.research_sessions
  add column if not exists focus_ends_at timestamptz,
  add column if not exists break_started_at timestamptz,
  add column if not exists break_ends_at timestamptz,
  add column if not exists break_duration_seconds integer not null default 0,
  add column if not exists break_taken boolean not null default false,
  add column if not exists extension_used boolean not null default false,
  add column if not exists ended_early boolean not null default false,
  add column if not exists focus_finished_at timestamptz,
  add column if not exists actual_focus_seconds integer;

alter table public.research_sessions
  drop constraint if exists research_sessions_break_duration_seconds_check;

alter table public.research_sessions
  add constraint research_sessions_break_duration_seconds_check
  check (break_duration_seconds between 0 and 300);

alter table public.research_sessions
  drop constraint if exists research_sessions_actual_focus_seconds_check;

alter table public.research_sessions
  add constraint research_sessions_actual_focus_seconds_check
  check (actual_focus_seconds is null or actual_focus_seconds >= 0);

update public.research_sessions
set focus_ends_at = started_at + duration_minutes * interval '1 minute'
where focus_ends_at is null
  and started_at is not null
  and status in ('draft', 'active', 'reflecting');

update public.research_sessions
set actual_focus_seconds = duration_minutes * 60
where actual_focus_seconds is null
  and status = 'completed';
