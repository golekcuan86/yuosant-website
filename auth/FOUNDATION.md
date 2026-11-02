# Yuosant ID Authentication Foundation

Status: development foundation only. Not deployed; no production authentication, DNS, database, or service login was changed.

## Product rules (approved)
- Email + password as the first login method; email verification and password recovery are required.
- A verified account is not automatically authorized to use Yuosant AI or Yuosant FinLab.
- Each service has its own access request and status: pending, approved, rejected, or revoked.
- Only the trusted administrator can approve/reject/revoke service access. Never accept role or approval values supplied by the client.
- Admin operations must be enforced server-side and recorded in an audit log.
- Users with pending, rejected, or revoked access must be denied by the target service backend, not just hidden behind a portal button.
- Keep current Internet Identity login and existing AI conversation data intact while migration is designed and tested.

## Foundation data model
See `schema.postgres.sql` for a provider-neutral PostgreSQL draft. It is not applied to any database. Before implementation, choose a dedicated auth provider/database and configure secrets only in the development environment.

## Required service contract
A service integration must verify a trusted session/token server-side and check the current entitlement for that service. The UI redirect is not an authorization control. The integration must fail closed when the identity/entitlement service is unavailable.

Suggested conceptual contract:
- `GET /me`: authenticated account and profile.
- `GET /me/access`: service entitlements and request states.
- `POST /access-requests`: create or refresh a request for an allowlisted service.
- Admin-only server action: approve/reject/revoke a request, with actor, target, service, old/new status, timestamp, and reason logged.
- Service-side authorization: require a verified account and an approved, non-revoked entitlement for the requested service.

These are contracts, not deployed endpoints.

## Security requirements
- Use a mature authentication provider; never store raw passwords or implement custom password hashing casually.
- Verify email and use secure, httpOnly, sameSite cookies or provider-managed secure sessions.
- Rate-limit sign-in, registration, verification resend, and recovery.
- Protect mutations against CSRF where cookie sessions are used.
- Validate all inputs server-side; enforce least privilege and deny by default.
- Do not let users set their own role, admin status, approval status, or entitlement.
- Do not expose provider secrets or service-role keys in browser code.
- Log admin decisions without logging passwords, reset tokens, or session secrets.
- Provide account deletion/export policy, backup, incident response, and rollback plan.

## Implementation sequence
1. Select a dedicated authentication provider and database, with cost and ownership confirmed.
2. Build registration, verification, login/logout, recovery, profile, and session handling in development.
3. Build a central admin approval queue with per-service access management.
4. Test authorization at the backend, including direct URL/API bypass attempts and revoked access.
5. Integrate one service at a time, preserving existing login and data until migration is approved.
6. Production rollout only after explicit approval, tests, backup, and rollback readiness.

## Explicitly out of scope for this branch
- No production deployment or DNS changes.
- No use of the Ruang Belajar Supabase project as Yuosant ID storage.
- No replacement of Internet Identity in Yuosant AI or FinLab.
- No claim of working SSO until each service validates the identity and entitlement server-side.
