import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

const notice = document.querySelector("#notice");
const form = document.querySelector("#reset-form");
const submit = document.querySelector("#submit");
const passwordInput = document.querySelector("#password");
const confirmInput = document.querySelector("#confirm");

const client = (!SUPABASE_URL.includes("GANTI_") && !SUPABASE_PUBLISHABLE_KEY.includes("GANTI_"))
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

let recoveryReady = false;
function message(text, error = false) {
  notice.textContent = text;
  notice.hidden = false;
  notice.classList.toggle("error", error);
}
function setFormEnabled(enabled) {
  recoveryReady = enabled;
  passwordInput.disabled = !enabled;
  confirmInput.disabled = !enabled;
  submit.disabled = !enabled;
}

async function verifyRecoverySession() {
  if (!client) {
    setFormEnabled(false);
    message("Layanan pemulihan belum dikonfigurasi. Hubungi administrator Yuosant.", true);
    return;
  }
  try {
    // Supabase exchanges the recovery token in the URL for a session.
    // Wait for that session before allowing updateUser to change a password.
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    if (!data.session) {
      setFormEnabled(false);
      message("Tautan pemulihan tidak valid atau sudah kedaluwarsa. Kembali ke halaman masuk dan minta tautan baru.", true);
      return;
    }
    setFormEnabled(true);
    message("Tautan pemulihan terverifikasi. Silakan buat kata sandi baru.");
  } catch (error) {
    setFormEnabled(false);
    message(error.message || "Tautan pemulihan tidak dapat diverifikasi. Silakan minta tautan baru.", true);
  }
}

if (client) {
  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY" && session) {
      setFormEnabled(true);
      message("Tautan pemulihan terverifikasi. Silakan buat kata sandi baru.");
    }
  });
  await verifyRecoverySession();
} else {
  setFormEnabled(false);
  message("Backend belum dikonfigurasi untuk Yuosant ID.", true);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client || !recoveryReady) {
    message("Sesi pemulihan tidak tersedia. Minta tautan pemulihan baru melalui halaman masuk.", true);
    return;
  }
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  if (password.length < 8) return message("Kata sandi minimal 8 karakter.", true);
  if (password !== confirm) return message("Kedua kata sandi belum sama.", true);

  submit.disabled = true;
  try {
    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError || !session) throw new Error("Sesi pemulihan sudah berakhir. Minta tautan pemulihan baru.");
    const { error } = await client.auth.updateUser({ password });
    if (error) throw error;
    message("Kata sandi berhasil diperbarui. Silakan kembali ke halaman masuk dan login dengan kata sandi baru.");
    form.reset();
    setFormEnabled(false);
    await client.auth.signOut();
  } catch (error) {
    message(error.message || "Kata sandi belum berhasil diperbarui. Periksa tautan pemulihan dan coba lagi.", true);
    submit.disabled = false;
  }
});
