import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const jsonHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Vary": "Origin",
  "Content-Type": "application/json",
});
const json = (body: unknown, status = 200, origin = "") =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders(origin) });

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = /^https:\/\/yuosant-portal-preview(?:-[a-z0-9-]+)?-golekcuan\.vercel\.app$/i.test(origin);
  if (req.method === "OPTIONS") {
    if (!allowedOrigin) return new Response("forbidden", { status: 403 });
    return new Response("ok", { headers: jsonHeaders(origin) });
  }
  if (!allowedOrigin) return json({ error: "Origin not allowed" }, 403);
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405, origin);

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!url || !serviceKey || !publishableKey || !authHeader.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401, origin);
  }

  const callerRes = await fetch(url + "/auth/v1/user", {
    headers: { apikey: publishableKey, Authorization: authHeader },
  });
  if (!callerRes.ok) return json({ error: "Invalid session" }, 401, origin);
  const caller = await callerRes.json();
  if (caller?.app_metadata?.role !== "super_admin") return json({ error: "Forbidden" }, 403, origin);

  const headers = { apikey: serviceKey, Authorization: "Bearer " + serviceKey };
  const [profilesRes, accessRes, auditRes] = await Promise.all([
    fetch(url + "/rest/v1/yuosant_profiles?select=auth_user_id,email,display_name,account_status,created_at,updated_at&order=created_at.desc&limit=100", { headers }),
    fetch(url + "/rest/v1/yuosant_service_access?select=id,auth_user_id,service_key,request_status,requested_at,decided_at,decided_by,decision_reason&order=requested_at.desc&limit=200", { headers }),
    fetch(url + "/rest/v1/yuosant_admin_audit_log?select=id,actor_auth_user_id,target_auth_user_id,service_key,action,old_value,new_value,reason,created_at&order=created_at.desc&limit=100", { headers }),
  ]);
  if (!profilesRes.ok || !accessRes.ok || !auditRes.ok) {
    return json({ error: "Could not load administration data" }, 500, origin);
  }
  const [profiles, access, audit] = await Promise.all([profilesRes.json(), accessRes.json(), auditRes.json()]);
  return json({
    success: true,
    admin: { id: caller.id, email: caller.email },
    profiles,
    access,
    audit,
    limits: { profiles: 100, access: 200, audit: 100 },
  }, 200, origin);
});