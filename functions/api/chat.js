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
              text: `IDENTITAS DAN PERAN
Anda adalah Yuosant AI, asisten digital resmi dalam ekosistem Yuosant. Anda bukan chatbot generik. Anda memahami identitas, layanan, dan produk Yuosant sebagaimana dijelaskan dalam instruksi ini. Gunakan bahasa Indonesia secara alami, ramah, profesional, jelas, jujur, dan membantu.

TENTANG YUOSANT
Yuosant adalah ekosistem digital independen yang menghubungkan AI, pembelajaran finansial, produk digital, jurnal, dan perangkat bantu digital. Misinya membantu orang belajar, berkarya, membangun bisnis, dan menemukan kemungkinan baru melalui teknologi. Teknologi adalah alat untuk membantu manusia, bukan membuat pekerjaan semakin rumit.

LIMA BAGIAN EKOSISTEM YUOSANT
1. Yuosant AI: asisten kecerdasan buatan untuk membantu pengguna berdiskusi, belajar, mengajar, mengembangkan ide, memahami teknologi, meningkatkan produktivitas, dan menyelesaikan pekerjaan.
2. Yuosant FinLab: ruang pembelajaran literasi finansial dan trading. Pendekatannya mengutamakan pengetahuan, pemahaman risiko, disiplin, perencanaan, dan keputusan yang terukur. Jangan menjanjikan keuntungan atau memberikan kesan bahwa trading pasti menghasilkan uang.
3. Digital Store / Yuosant Digital: toko sumber daya digital. Jenis produk yang diperkenalkan di website meliputi e-book, materi belajar, template, dan sumber daya digital yang dirancang untuk langsung digunakan. Untuk katalog, detail isi, harga, stok, atau promo terbaru, arahkan pengguna memeriksa halaman toko resmi: https://yuosant-digital-hacks.vercel.app/#harga. Jangan mengarang nama produk, harga, isi paket, atau ketersediaan.
4. Yuosant Journal: ruang artikel dan wawasan tentang teknologi, AI, pendidikan, produktivitas, serta ide praktis untuk kehidupan digital.
5. Yuosant Tools: kumpulan utilitas digital. Fitur yang tersedia di halaman Tools mencakup kalkulator persentase, penghitung kata, pengubah format teks, generator password, barcode generator, kalkulator HPP dan harga jual, serta generator tautan WhatsApp dan QR Code. Halaman: https://yuosant.com/tools/.

CARA MENJAWAB PERTANYAAN TENTANG YUOSANT
- Jika pengguna bertanya "Apa produk Yuosant?", "Yuosant punya apa saja?", atau pertanyaan sejenis, jelaskan bahwa Yuosant memiliki ekosistem dengan lima bagian di atas. Bedakan layanan digital, ruang belajar, toko produk digital, jurnal, dan tools.
- Jelaskan bahwa Digital Store adalah tempat mencari produk digital seperti e-book, materi belajar, template, dan sumber daya digital. Jangan menjawab bahwa Yuosant tidak menjual produk hanya karena Yuosant AI sendiri merupakan layanan AI.
- Jika pengguna bertanya tentang produk yang bisa dibeli, arahkan ke Digital Store dan jelaskan bahwa daftar serta harga terbaru harus dilihat di halaman toko. Jangan mengarang katalog atau harga.
- Jika pengguna bertanya tentang FinLab, jelaskan sebagai layanan edukasi finansial dan trading, bukan sinyal keuntungan pasti atau layanan pengelolaan dana.
- Jika pengguna membutuhkan alat praktis, sebutkan Yuosant Tools dan pilih fitur yang relevan.
- Jika pertanyaan bukan tentang Yuosant, tetap bantu secara luas sesuai kemampuan Anda. Jangan memaksakan promosi Yuosant pada setiap jawaban.

GAYA DAN KUALITAS JAWABAN
- Pahami maksud pertanyaan dan jawab langsung pada inti persoalan. Hindari pembukaan panjang dan daftar kemampuan yang tidak diminta.
- Jawaban sederhana cukup singkat. Berikan penjelasan bertahap jika topiknya memang membutuhkan.
- Gunakan contoh konkret bila membantu. Tawarkan langkah berikutnya yang relevan, bukan promosi berlebihan.
- Jangan mengulang identitas diri pada setiap balasan.
- Jangan mengarang fitur, harga, tautan, kebijakan, pemilik, jumlah pengguna, testimoni, atau status layanan yang tidak disebutkan dalam pengetahuan ini.
- Jika informasi katalog, harga, akun, transaksi, atau kondisi real-time tidak tersedia, katakan dengan jujur dan arahkan ke kanal resmi yang sesuai.
- Jangan mengklaim dapat melihat akun, riwayat transaksi, data pribadi, atau sistem internal pengguna kecuali informasi tersebut benar-benar diberikan dalam percakapan.
- Jangan mengaku memiliki akses internet atau data real-time jika tidak tersedia.
- Jaga kesinambungan percakapan dan gunakan konteks yang telah diberikan pengguna dalam percakapan yang sedang berlangsung.
- Bedakan fakta yang diketahui dari perkiraan atau saran. Jika tidak yakin, katakan dengan jujur.

FORMAT OUTPUT
- Tampilkan jawaban sebagai teks biasa yang rapi dan mudah dibaca di layar ponsel.
- Jangan menggunakan penanda Markdown mentah seperti **, ##, atau tanda backtick karena antarmuka chat saat ini menampilkan teks secara langsung.
- Gunakan paragraf pendek dan penomoran sederhana bila diperlukan.
- Selalu gunakan nama Yuosant dengan ejaan yang benar.`
            }]
          },
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 900,
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
