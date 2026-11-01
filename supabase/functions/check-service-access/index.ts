import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!["GET", "POST"].includes(req.method)) return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const publicKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
  const authorization = req.headers.get("Authorization") ?? "";
  if (!url || !serviceKey || !publicKey || !authorization.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const userResponse = await fetch(url + "/auth/v1/user", {
    headers: { apikey: publicKey, Authorization: authorization },
  });
  if (!userResponse.ok) return json({ error: "Invalid session" }, 401);
  const user = await userResponse.json();
  if (!user?.id || !user.email_confirmed_at) {
    return json({ allowed: false, reason: "email_not_verified" }, 200);
  }

  let serviceKeyName = new URL(req.url).searchParams.get("service_key");
  if (req.method === "POST") {
    try {
      serviceKeyName = (await req.json())?.service_key ?? serviceKeyName;
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
  }
  if (!["yuosant_ai", "yuosant_finlab"].includes(serviceKeyName ?? "")) {
    return json({ error: "Invalid service_key" }, 400);
  }

  const headers = { apikey: serviceKey, Authorization: "Bearer " + serviceKey };
  const profileResponse = await fetch(
    url + "/rest/v1/yuosant_profiles?auth_user_id=eq." + encodeURIComponent(user.id) + "&select=account_status",
    { headers },
  );
  const profiles = await profileResponse.json();
  if (!profileResponse.ok || !profiles?.length) {
    return json({ allowed: false, reason: "profile_missing" }, 200);
  }
  if (profiles[0].account_status !== "active") {
    return json({ allowed: false, reason: "account_" + profiles[0].account_status }, 200);
  }

  // Claim paid Scalev orders waiting for the buyer to register.
  // Failure to claim must not block the normal access lookup.
  try {
    await fetch(url + "/rest/v1/rpc/yuosant_claim_paid_orders", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ p_user_id: user.id }),
    });
  } catch {
    // Continue with the current access state if the claim RPC is unavailable.
  }

  const accessResponse = await fetch(
    url + "/rest/v1/yuosant_service_access?auth_user_id=eq." + encodeURIComponent(user.id) +
      "&service_key=eq." + serviceKeyName + "&select=request_status,expires_at",
    { headers },
  );
  const access = await accessResponse.json();
  if (!accessResponse.ok) return json({ error: "Access lookup failed" }, 500);

  const row = access?.[0];
  const approved = row?.request_status === "approved";
  const expired = approved && row?.expires_at != null &&
    new Date(row.expires_at).getTime() <= Date.now();
  const allowed = approved && !expired;

  return json({
    allowed,
    reason: allowed ? "approved" : expired ? "expired" : (row?.request_status ?? "not_requested"),
    expires_at: allowed ? (row?.expires_at ?? null) : null,
  });
});
