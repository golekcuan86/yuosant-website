-- Yuosant ID core schema. Applied to dedicated project aaprcsapvaacghuajfns.
create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.yuosant_profiles (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  account_status text not null default 'active'
    check (account_status in ('active','suspended','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.yuosant_service_access (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  service_key text not null check (service_key in ('yuosant_ai','yuosant_finlab')),
  request_status text not null default 'pending'
    check (request_status in ('pending','approved','rejected','revoked')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id) on delete set null,
  decision_reason text,
  unique (auth_user_id, service_key)
);

create table if not exists public.yuosant_admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_auth_user_id uuid not null references auth.users(id),
  target_auth_user_id uuid not null references auth.users(id),
  service_key text check (service_key is null or service_key in ('yuosant_ai','yuosant_finlab')),
  action text not null check (action in ('approve_access','reject_access','revoke_access','suspend_account','reactivate_account')),
  old_value jsonb,
  new_value jsonb,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.yuosant_profiles enable row level security;
alter table public.yuosant_service_access enable row level security;
alter table public.yuosant_admin_audit_log enable row level security;

create policy "profile read own" on public.yuosant_profiles
  for select to authenticated using ((select auth.uid()) = auth_user_id);
create policy "access read own" on public.yuosant_service_access
  for select to authenticated using ((select auth.uid()) = auth_user_id);
create policy "access request own" on public.yuosant_service_access
  for insert to authenticated with check (
    (select auth.uid()) = auth_user_id and request_status = 'pending'
    and decided_at is null and decided_by is null
  );

revoke all on public.yuosant_profiles from anon, authenticated;
grant select on public.yuosant_profiles to authenticated;
revoke all on public.yuosant_service_access from anon, authenticated;
grant select, insert on public.yuosant_service_access to authenticated;
revoke all on public.yuosant_admin_audit_log from anon, authenticated;

create or replace function private.handle_new_yuosant_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.yuosant_profiles (auth_user_id, email, display_name)
  values (new.id, coalesce(new.email, ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), ''))
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;
revoke all on function private.handle_new_yuosant_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created_yuosant on auth.users;
create trigger on_auth_user_created_yuosant after insert on auth.users
for each row execute function private.handle_new_yuosant_user();

create index if not exists yuosant_service_access_decided_by_idx
  on public.yuosant_service_access (decided_by);
create index if not exists yuosant_admin_audit_actor_idx
  on public.yuosant_admin_audit_log (actor_auth_user_id);
create index if not exists yuosant_admin_audit_target_idx
  on public.yuosant_admin_audit_log (target_auth_user_id);
