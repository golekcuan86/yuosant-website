import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";
const notice = document.querySelector("#notice");
const form = document.querySelector("#reset-form");
const submit = document.querySelector("#submit");
const client = (!SUPABASE_URL.includes("GANTI_") && !SUPABASE_PUBLISHABLE_KEY.includes("GANTI_"))
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;
function message(text, error = false) { notice.textContent = text; notice.hidden = false; notice.classList.toggle("error", error); }
if (!client) message("Backend belum dikonfigurasi untuk Yuosant ID.", true);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client) return;
  const password = document.querySelector("#password").value;
  const confirm = document.querySelector("#confirm").value;
  if (password.length < 8) return message("Kata sandi minimal 8 karakter.", true);
  if (password !== confirm) return message("Kedua kata sandi belum sama.", true);
  submit.disabled = true;
  try {
    const { error } = await client.auth.updateUser({ password });
    if (error) throw error;
    message("Kata sandi berhasil diperbarui. Silakan kembali dan masuk.");
    form.reset();
  } catch (error) {
    message(error.message || "Tautan pemulihan tidak valid atau sudah kedaluwarsa.", true);
  } finally { submit.disabled = false; }
});