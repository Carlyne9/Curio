create table if not exists public.note_attachments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.research_sessions(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null check (
    mime_type in (
      'application/pdf',
      'image/heic',
      'image/heif',
      'image/jpeg',
      'image/png',
      'image/webp'
    )
  ),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  extracted_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists note_attachments_session_id_idx
  on public.note_attachments(session_id);

alter table public.note_attachments enable row level security;

drop policy if exists "Users manage own note attachments" on public.note_attachments;

create policy "Users manage own note attachments"
  on public.note_attachments
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.research_sessions
      where research_sessions.id = note_attachments.session_id
        and research_sessions.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.research_sessions
      where research_sessions.id = note_attachments.session_id
        and research_sessions.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users upload own session notes" on storage.objects;
drop policy if exists "Users read own session notes" on storage.objects;
drop policy if exists "Users update own session notes" on storage.objects;
drop policy if exists "Users delete own session notes" on storage.objects;

create policy "Users upload own session notes"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'session-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and exists (
      select 1
      from public.research_sessions
      where research_sessions.id::text = (storage.foldername(name))[2]
        and research_sessions.user_id = (select auth.uid())
    )
  );

create policy "Users read own session notes"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'session-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and exists (
      select 1
      from public.research_sessions
      where research_sessions.id::text = (storage.foldername(name))[2]
        and research_sessions.user_id = (select auth.uid())
    )
  );

create policy "Users update own session notes"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'session-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and exists (
      select 1
      from public.research_sessions
      where research_sessions.id::text = (storage.foldername(name))[2]
        and research_sessions.user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'session-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and exists (
      select 1
      from public.research_sessions
      where research_sessions.id::text = (storage.foldername(name))[2]
        and research_sessions.user_id = (select auth.uid())
    )
  );

create policy "Users delete own session notes"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'session-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and exists (
      select 1
      from public.research_sessions
      where research_sessions.id::text = (storage.foldername(name))[2]
        and research_sessions.user_id = (select auth.uid())
    )
  );
