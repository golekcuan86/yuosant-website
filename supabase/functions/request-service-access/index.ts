import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const allowedOriginPattern = /^https:\/\/(?:yuosant-portal-preview(?:-[a-z0-9-]+)?-golekcuan\.vercel\.app|yuosant\.com|www\.yuosant\.com)$/i;
const headers = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
  "Content-Type": "application/json",
});
const json = (body: unknown, status = 200, origin = "") =>
  new Response(JSON.stringify(body), { status, headers: headers(origin) });

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  if (req.method === "OPTIONS") {
    if (!allowedOriginPattern.test(origin)) return new Response("forbidden", { status: 403 });
    return new Response("ok", { headers: headers(origin) });
  }
  if (!allowedOriginPattern.test(origin)) return json({ error: "Origin not allowed" }, 403, origin);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const publicKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
  const authorization = req.headers.get("Authorization") ?? "";
  if (!url || !serviceKey || !publicKey || !authorization.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401, origin);
  }

  const userResponse = await fetch(url + "/auth/v1/user", {
    headers: { apikey: publicKey, Authorization: authorization },
  });
  if (!userResponse.ok) return json({ error: "Invalid session" }, 401, origin);
  const user = await userResponse.json();
  if (!user?.id || !user.email_confirmed_at) return json({ error: "Verified email required" }, 403, origin);

  let body: { service_key?: string };
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400, origin); }
  const serviceKeyName = body?.service_key;
  if (!["yuosant_ai", "yuosant_finlab"].includes(serviceKeyName ?? "")) {
    return json({ error: "Invalid service_key" }, 400, origin);
  }

  const rpcResponse = await fetch(url + "/rest/v1/rpc/request_service_access", {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: "Bearer " + serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_user_id: user.id, p_service_key: serviceKeyName }),
  });
  const result = await rpcResponse.json().catch(() => null);
  if (!rpcResponse.ok) {
    const message = typeof result?.message === "string" ? result.message : "Access request could not be processed";
    const conflict = /already pending|already approved/i.test(message);
    return json({ success: false, error: message }, conflict ? 409 : 400, origin);
  }
  return json({ success: true, request_status: result?.request_status ?? "pending", requested_at: result?.requested_at ?? null }, 200, origin);
});
