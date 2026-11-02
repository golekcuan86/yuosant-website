-- Apply only to a dedicated Yuosant ID Supabase project after review.
-- Supabase Auth manages credentials in auth.users; never store raw passwords.
create extension if not exists pgcrypto;

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

-- Users can read their own profile. Profile edits should be added with column-level grants
-- or a trusted server function so account_status cannot be changed by the client.
create policy "profile read own" on public.yuosant_profiles
  for select to authenticated using (auth.uid() = auth_user_id);
create policy "profile insert own" on public.yuosant_profiles
  for insert to authenticated with check (auth.uid() = auth_user_id and account_status = 'active');
-- Users may see their own service requests and submit a pending request.
-- Existing requests cannot be reset by users; an admin must decide rejected/revoked requests.
create policy "access read own" on public.yuosant_service_access
  for select to authenticated using (auth.uid() = auth_user_id);
create policy "access request own" on public.yuosant_service_access
  for insert to authenticated with check (
    auth.uid() = auth_user_id and request_status = 'pending'
    and decided_at is null and decided_by is null
  );

-- Deliberately no client-side UPDATE/DELETE policy for service access or audit log.
-- Admin decisions must be implemented by a trusted server-side function/Edge Function
-- that verifies a server-controlled admin claim, updates the row, and inserts audit log.
-- Service authorization must be checked by the service backend using trusted claims/data.
-- Do not treat a frontend status badge or hidden link as an authorization barrier.
