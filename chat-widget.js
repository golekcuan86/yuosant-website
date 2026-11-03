(() => {
  const launcher = document.getElementById("yuosant-chat-launcher");
  const panel = document.getElementById("yuosant-chat-panel");
  if (!launcher || !panel) return;

  const SITE_KEY = "0x4AAAAAAFw5PATIBtqlfdty";
  const close = panel.querySelector(".yc-close");
  const log = panel.querySelector(".yc-log");
  const form = panel.querySelector(".yc-compose");
  const input = panel.querySelector(".yc-input");
  const send = panel.querySelector(".yc-send");
  const challenge = panel.querySelector("#yc-turnstile");
  const history = [];
  let turnstileWidgetId = null;
  let turnstileToken = "";
  let turnstileLoading = null;
  let tokenWaiter = null;

  function addMessage(text, who) {
    const bubble = document.createElement("div");
    bubble.className = "yc-message " + who;
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function loadTurnstile() {
    if (window.turnstile) return Promise.resolve();
    if (turnstileLoading) return turnstileLoading;

    turnstileLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Komponen verifikasi gagal dimuat. Periksa koneksi lalu buka ulang chat."));
      document.head.appendChild(script);
    });
    return turnstileLoading;
  }

  async function renderTurnstile() {
    if (turnstileWidgetId !== null || !challenge) return;
    challenge.textContent = "Memuat verifikasi keamanan…";
    try {
      await loadTurnstile();
      challenge.textContent = "";
      turnstileWidgetId = window.turnstile.render(challenge, {
        sitekey: SITE_KEY,
        theme: "light",
        appearance: "always",
        callback: (token) => {
          turnstileToken = token;
          challenge.setAttribute("data-status", "verified");
          if (tokenWaiter) {
            clearTimeout(tokenWaiter.timer);
            tokenWaiter.resolve(token);
            tokenWaiter = null;
          }
        },
        "expired-callback": () => {
          turnstileToken = "";
          challenge.setAttribute("data-status", "waiting");
        },
        "error-callback": () => {
          turnstileToken = "";
          challenge.setAttribute("data-status", "error");
          if (tokenWaiter) {
            clearTimeout(tokenWaiter.timer);
            tokenWaiter.reject(new Error("Verifikasi keamanan gagal. Silakan coba lagi."));
            tokenWaiter = null;
          }
        },
      });
    } catch (error) {
      challenge.textContent = error.message;
    }
  }

  function waitForTurnstileToken() {
    if (turnstileToken) return Promise.resolve(turnstileToken);
    if (tokenWaiter) return tokenWaiter.promise;

    let resolveWaiter;
    let rejectWaiter;
    const promise = new Promise((resolve, reject) => {
      resolveWaiter = resolve;
      rejectWaiter = reject;
    });
    const timer = setTimeout(() => {
      if (!tokenWaiter) return;
      tokenWaiter = null;
      rejectWaiter(new Error("Verifikasi belum selesai. Centang verifikasi keamanan, lalu coba kirim lagi."));
    }, 30000);
    tokenWaiter = { promise, resolve: resolveWaiter, reject: rejectWaiter, timer };
    return promise;
  }

  async function getTurnstileToken() {
    await renderTurnstile();
    if (turnstileToken) return turnstileToken;
    return waitForTurnstileToken();
  }

  function resetTurnstile() {
    turnstileToken = "";
    if (turnstileWidgetId !== null && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId);
    }
  }

  function toggle(open) {
    panel.classList.toggle("is-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    if (open) {
      input.focus();
      renderTurnstile();
    }
  }

  launcher.addEventListener("click", () => toggle(!panel.classList.contains("is-open")));
  close.addEventListener("click", () => toggle(false));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || send.disabled) return;
    addMessage(text, "user");
    history.push({ role: "user", content: text });
    input.value = "";
    send.disabled = true;
    send.textContent = "…";
    const pending = addMessage("Yuosant AI sedang berpikir…", "bot");

    try {
      const token = await getTurnstileToken();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-12),
          turnstileToken: token,
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const responseText = await response.text();

      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
          `Server mengirim respons bukan JSON (HTTP ${response.status}, ${contentType || "content-type tidak tersedia"}). Periksa endpoint atau deployment API.`
        );
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Respons server berformat JSON tidak valid (HTTP ${response.status}).`);
      }

      if (!response.ok) throw new Error(data.error || `Permintaan gagal (HTTP ${response.status}).`);
      if (typeof data.answer !== "string" || !data.answer.trim()) {
        throw new Error("Server berhasil merespons, tetapi jawaban AI tidak ditemukan.");
      }

      pending.textContent = data.answer;
      history.push({ role: "assistant", content: data.answer });
    } catch (error) {
      pending.textContent = error.message || "Terjadi kendala. Silakan coba lagi.";
      history.pop();
    } finally {
      resetTurnstile();
      send.disabled = false;
      send.textContent = "Kirim";
      input.focus();
      log.scrollTop = log.scrollHeight;
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
})();
