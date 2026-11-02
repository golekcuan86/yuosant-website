(() => {
  const launcher = document.getElementById("yuosant-chat-launcher");
  const panel = document.getElementById("yuosant-chat-panel");
  if (!launcher || !panel) return;

  const close = panel.querySelector(".yc-close");
  const log = panel.querySelector(".yc-log");
  const form = panel.querySelector(".yc-compose");
  const input = panel.querySelector(".yc-input");
  const send = panel.querySelector(".yc-send");
  const history = [];

  function addMessage(text, who) {
    const bubble = document.createElement("div");
    bubble.className = "yc-message " + who;
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function toggle(open) {
    panel.classList.toggle("is-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Permintaan belum berhasil.");
      pending.textContent = data.answer;
      history.push({ role: "assistant", content: data.answer });
    } catch (error) {
      pending.textContent = error.message || "Terjadi kendala. Silakan coba lagi.";
      history.pop();
    } finally {
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
