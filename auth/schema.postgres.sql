-- Yuosant ID data model draft (PostgreSQL)
-- NOT APPLIED to any database. Requires provider/architecture approval.
-- Authentication credentials should be managed by a trusted auth provider,
-- not stored in these application tables.

create extension if not exists pgcrypto;

create table if not exists public.yuosant_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null,
  display_name text,
  phone text,
  avatar_url text,
  account_status text not null default 'active'
    check (account_status in ('active', 'suspended', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.yuosant_service_access (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null,
  service_key text not null
    check (service_key in ('yuosant_ai', 'yuosant_finlab')),
  request_status text not null default 'pending'
    check (request_status in ('pending', 'approved', 'rejected', 'revoked')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid,
  decision_reason text,
  unique (auth_user_id, service_key)
);

create index if not exists yuosant_service_access_status_idx
  on public.yuosant_service_access (service_key, request_status, requested_at);

create table if not exists public.yuosant_admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_auth_user_id uuid not null,
  target_auth_user_id uuid not null,
  service_key text
    check (service_key is null or service_key in ('yuosant_ai', 'yuosant_finlab')),
  action text not null
    check (action in ('approve_access', 'reject_access', 'revoke_access',
                      'suspend_account', 'reactivate_account', 'change_role')),
  old_value jsonb,
  new_value jsonb,
  reason text,
  created_at timestamptz not null default now()
);

-- IMPORTANT:
-- 1. Do not apply until a dedicated database/auth provider is approved.
-- 2. Enable row-level security and write explicit policies before exposing tables.
-- 3. Never permit users to update their own service_access status or admin rights.
-- 4. Approval mutations must be performed by a trusted server-side admin function
--    after checking the actor's administrator permission.
-- 5. Use auth provider's immutable user ID as auth_user_id and verify email status
--    through the provider's trusted server-side claims/API.
