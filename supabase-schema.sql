create extension if not exists pgcrypto;

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  device_profile_id text unique,
  display_name text not null,
  turma text default '',
  escola text default '',
  avatar text default '',
  pin_hint text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_progress (
  profile_id uuid primary key references public.student_profiles(id) on delete cascade,
  total_xp integer not null default 0,
  streak integer not null default 0,
  last_played_at timestamptz,
  operation_progress jsonb not null default '{}'::jsonb,
  achievements jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.session_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  source_device_profile_id text,
  operation text not null,
  level_name text default '',
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  score integer not null default 0,
  duration_seconds integer not null default 0,
  summary jsonb not null default '{}'::jsonb,
  played_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_student_profiles_auth_user_id
  on public.student_profiles(auth_user_id);

create index if not exists idx_student_profiles_device_profile_id
  on public.student_profiles(device_profile_id);

create index if not exists idx_session_history_profile_id
  on public.session_history(profile_id);

create index if not exists idx_session_history_played_at
  on public.session_history(played_at desc);

alter table public.student_profiles enable row level security;
alter table public.student_progress enable row level security;
alter table public.session_history enable row level security;

drop policy if exists profile_select_own on public.student_profiles;
create policy profile_select_own
on public.student_profiles
for select
to authenticated
using (auth.uid() = auth_user_id);

drop policy if exists profile_insert_own on public.student_profiles;
create policy profile_insert_own
on public.student_profiles
for insert
to authenticated
with check (auth.uid() = auth_user_id);

drop policy if exists profile_update_own on public.student_profiles;
create policy profile_update_own
on public.student_profiles
for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

drop policy if exists progress_select_own on public.student_progress;
create policy progress_select_own
on public.student_progress
for select
to authenticated
using (
  exists (
    select 1
    from public.student_profiles p
    where p.id = student_progress.profile_id
      and p.auth_user_id = auth.uid()
  )
);

drop policy if exists progress_insert_own on public.student_progress;
create policy progress_insert_own
on public.student_progress
for insert
to authenticated
with check (
  exists (
    select 1
    from public.student_profiles p
    where p.id = student_progress.profile_id
      and p.auth_user_id = auth.uid()
  )
);

drop policy if exists progress_update_own on public.student_progress;
create policy progress_update_own
on public.student_progress
for update
to authenticated
using (
  exists (
    select 1
    from public.student_profiles p
    where p.id = student_progress.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.student_profiles p
    where p.id = student_progress.profile_id
      and p.auth_user_id = auth.uid()
  )
);

drop policy if exists sessions_select_own on public.session_history;
create policy sessions_select_own
on public.session_history
for select
to authenticated
using (
  exists (
    select 1
    from public.student_profiles p
    where p.id = session_history.profile_id
      and p.auth_user_id = auth.uid()
  )
);

drop policy if exists sessions_insert_own on public.session_history;
create policy sessions_insert_own
on public.session_history
for insert
to authenticated
with check (
  exists (
    select 1
    from public.student_profiles p
    where p.id = session_history.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_student_profiles_updated_at on public.student_profiles;
create trigger trg_student_profiles_updated_at
before update on public.student_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_progress_updated_at on public.student_progress;
create trigger trg_student_progress_updated_at
before update on public.student_progress
for each row execute function public.set_updated_at();
