export async function onRequestPost({ request, env }) {
  try {
    const hostname = getAllowedHostname(request);
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

    const verified = await verifyTurnstile(
      payload.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      hostname,
      request.headers.get("CF-Connecting-IP")
    );
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
    } catch {
      return json({ error: "Layanan AI tidak dapat dihubungi. Coba lagi sebentar." }, 502);
    }

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
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
    return json({ answer, model: MODEL });
  } catch (error) {
    console.error("Yuosant chat function runtime error:", error);
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
