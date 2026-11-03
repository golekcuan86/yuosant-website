const MODEL = "gemini-3.1-flash-lite";
const MAX_BODY_BYTES = 20_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 6_000;
const ALLOWED_HOSTNAMES = new Set([
  "yuosant.com",
  "www.yuosant.com",
  "d6e45164.yuosant-website.pages.dev",
  "feature-yuosant-gemini-chat-prototype.yuosant-website.pages.dev",
  "feature-yuosant-gemini-chat.yuosant-website.pages.dev",
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function getAllowedHostname(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && ALLOWED_HOSTNAMES.has(host) ? host : null;
  } catch {
    return null;
  }
}

async function verifyTurnstile(token, secret, hostname, remoteIp) {
  const form = new URLSearchParams({ secret, response: token });
  if (remoteIp) form.set("remoteip", remoteIp);

  let response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
    });
  } catch {
    return false;
  }

  if (!response.ok) return false;
  const result = await response.json().catch(() => null);
  return result?.success === true && result?.hostname === hostname;
}

export async function onRequestPost({ request, env }) {
  const requestId = request.headers.get("cf-ray") || crypto.randomUUID();
  const startedAt = Date.now();
  console.log("[yuosant-chat] request-start", {
    requestId,
    method: request.method,
    url: new URL(request.url).pathname,
    origin: request.headers.get("Origin"),
    colo: request.cf?.colo || null,
  });
  try {
    const hostname = getAllowedHostname(request);
    console.log("[yuosant-chat] origin-check", { requestId, allowed: Boolean(hostname), hostname });
    if (!hostname) return json({ error: "Origin tidak diizinkan." }, 403);
    if (!env.GEMINI_API_KEY) return json({ error: "Konfigurasi AI belum tersedia." }, 503);
    if (!env.TURNSTILE_SECRET_KEY) return json({ error: "Perlindungan keamanan belum dikonfigurasi." }, 503);

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_BODY_BYTES) return json({ error: "Pesan terlalu besar." }, 413);

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Format permintaan tidak valid." }, 400);
    }

    if (typeof payload.turnstileToken !== "string" || !payload.turnstileToken) {
      return json({ error: "Selesaikan verifikasi keamanan terlebih dahulu." }, 400);
    }

    console.log("[yuosant-chat] turnstile-start", { requestId });
    const verified = await verifyTurnstile(
      payload.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      hostname,
      request.headers.get("CF-Connecting-IP")
    );
    console.log("[yuosant-chat] turnstile-result", { requestId, verified, elapsedMs: Date.now() - startedAt });
    if (!verified) return json({ error: "Verifikasi keamanan gagal atau kedaluwarsa. Silakan verifikasi lagi." }, 403);

    if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
      return json({ error: "Tuliskan pesan terlebih dahulu." }, 400);
    }

    const messages = payload.messages.slice(-MAX_MESSAGES).map((item) => {
      const role = item?.role === "assistant" ? "model" : "user";
      const text = typeof item?.content === "string" ? item.content.trim().slice(0, MAX_MESSAGE_CHARS) : "";
      return { role, parts: [{ text }] };
    }).filter((item) => item.parts[0].text);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return json({ error: "Pesan terakhir harus berasal dari pengguna." }, 400);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    let upstream;
    console.log("[yuosant-chat] gemini-start", { requestId, model: MODEL, messageCount: messages.length });
    try {
      upstream = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "Anda adalah Yuosant AI, asisten digital yang ramah, jelas, jujur, dan membantu dalam bahasa Indonesia. Bantu pengguna belajar, mengajar, teknologi, produktivitas, dan ide bisnis. Jawab terstruktur dan ringkas. Jika tidak yakin, katakan dengan jujur. Jangan mengaku memiliki akses internet atau data real-time jika tidak tersedia."
            }]
          },
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 700,
          },
        }),
      });
    } catch (error) {
      console.error("Gemini API fetch failed:", {
        message: error instanceof Error ? error.message : String(error),
        requestId: request.headers.get("cf-ray") || null,
      });
      return json({ error: "Layanan AI tidak dapat dihubungi. Coba lagi sebentar." }, 502);
    }

    console.log("[yuosant-chat] gemini-response", {
      requestId,
      status: upstream.status,
      ok: upstream.ok,
      elapsedMs: Date.now() - startedAt,
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("Gemini API returned an error:", {
        httpStatus: upstream.status,
        providerStatus: result?.error?.status || null,
        providerMessage: result?.error?.message || null,
        requestId: request.headers.get("cf-ray") || null,
      });
      const status = upstream.status === 429 ? 429 : 502;
      return json({
        error: upstream.status === 429
          ? "Kuota atau batas permintaan AI sedang tercapai. Coba lagi nanti."
          : "Yuosant AI belum dapat menjawab saat ini.",
      }, status);
    }

    const answer = result?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!answer) return json({ error: "AI belum menghasilkan jawaban. Silakan coba lagi." }, 502);
    console.log("[yuosant-chat] request-success", { requestId, elapsedMs: Date.now() - startedAt });
    return json({ answer, model: MODEL });
  } catch (error) {
    console.error("[yuosant-chat] runtime-error", {
      requestId,
      elapsedMs: Date.now() - startedAt,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
    });
    return json({
      error: "Terjadi kesalahan internal pada layanan chat. Silakan coba lagi.",
      requestId: request.headers.get("cf-ray") || null,
    }, 500);
  }
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  return json({ error: "Metode tidak diizinkan." }, 405);
}
