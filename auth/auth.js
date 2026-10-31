import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configure these values in auth/config.js for a dedicated Yuosant ID project.
// Never put a Supabase service-role key in browser code.
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

const form = document.querySelector("#auth-form");
const notice = document.querySelector("#notice");
const title = document.querySelector("#form-title");
const description = document.querySelector("#form-description");
const nameWrap = document.querySelector("#name-wrap");
const nameInput = document.querySelector("#name");
const passwordInput = document.querySelector("#password");
const submit = document.querySelector("#submit");
const forgot = document.querySelector("#forgot");
const tabs = [...document.querySelectorAll(".tab")];
let mode = "login";
let supabase = null;

function showNotice(message, error = false) {
  notice.textContent = message;
  notice.hidden = false;
  notice.classList.toggle("error", error);
}
function clearNotice() { notice.hidden = true; notice.textContent = ""; }
function setMode(next) {
  mode = next;
  clearNotice();
  tabs.forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  nameWrap.hidden = mode !== "signup";
  nameInput.required = mode === "signup";
  passwordInput.autocomplete = mode === "signup" ? "new-password" : "current-password";
  title.textContent = mode === "signup" ? "Buat Yuosant ID" : "Selamat datang kembali";
  description.textContent = mode === "signup"
    ? "Daftar menggunakan email aktif. Kami akan mengirim tautan verifikasi."
    : "Masuk menggunakan email dan kata sandi.";
  submit.textContent = mode === "signup" ? "Buat akun" : "Masuk ke Yuosant ID";
  forgot.hidden = mode !== "login";
}
tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.mode)));

function configured() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY ||
      SUPABASE_URL.includes("GANTI_") || SUPABASE_PUBLISHABLE_KEY.includes("GANTI_")) {
    showNotice("Konfigurasi backend belum diisi. Hubungkan halaman ini ke proyek Supabase Yuosant ID khusus terlebih dahulu.", true);
    return false;
  }
  if (!supabase) supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
  return true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearNotice();
  if (!configured()) return;
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const password = passwordInput.value;
  submit.disabled = true;
  try {
    if (mode === "signup") {
      const displayName = nameInput.value.trim();
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: new URL("./index.html?verified=1", window.location.href).href
        }
      });
      if (error) throw error;
      if (data.session) {
        showNotice("Akun berhasil dibuat. Periksa email untuk menyelesaikan verifikasi sebelum melanjutkan.");
      } else {
        showNotice("Pendaftaran diterima. Buka email Anda dan klik tautan verifikasi untuk mengaktifkan akun.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await renderSession();
    }
  } catch (error) {
    showNotice(safeError(error), true);
  } finally {
    submit.disabled = false;
  }
});

forgot.addEventListener("click", async () => {
  clearNotice();
  if (!configured()) return;
  const email = document.querySelector("#email").value.trim().toLowerCase();
  if (!email) {
    showNotice("Isi email terlebih dahulu, lalu tekan Lupa kata sandi.", true);
    return;
  }
  try {
    const redirectTo = new URL("./reset.html", window.location.href).href;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
    showNotice("Jika email terdaftar, tautan pemulihan akan dikirim. Periksa kotak masuk dan folder spam.");
  } catch (error) {
    showNotice(safeError(error), true);
  }
});

function safeError(error) {
  const message = String(error?.message || "");
  if (/invalid login credentials/i.test(message)) return "Email atau kata sandi tidak cocok.";
  if (/email not confirmed/i.test(message)) return "Email belum diverifikasi. Buka tautan verifikasi yang dikirim ke email Anda.";
  if (/password should be at least/i.test(message)) return "Kata sandi minimal 8 karakter.";
  if (/rate limit/i.test(message)) return "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.";
  return message || "Permintaan belum berhasil. Periksa koneksi dan konfigurasi backend.";
}

async function renderSession() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) return;
  if (!user.email_confirmed_at) {
    showNotice("Email Anda belum diverifikasi. Periksa email untuk mengaktifkan akun.", true);
    return;
  }
  // UI display only. Service authorization must always be checked by a trusted backend.
  const { data: access, error: accessError } = await supabase
    .from("yuosant_service_access")
    .select("service_key,request_status,requested_at")
    .eq("auth_user_id", user.id);
  if (accessError) {
    showNotice("Login berhasil, tetapi status akses belum dapat dimuat. Pastikan migrasi database sudah diterapkan.", true);
    return;
  }
  const states = Object.fromEntries((access || []).map((row) => [row.service_key, row.request_status]));
  const statusLabel = (key) => ({
    approved: "Disetujui",
    pending: "Menunggu persetujuan",
    rejected: "Ditolak",
    revoked: "Akses dicabut"
  }[states[key]] || "Belum mengajukan akses");
  document.querySelector(".panel").innerHTML = `
    <div class="notice">Berhasil masuk sebagai ${escapeHtml(user.email || "")}</div>
    <h2>Dashboard Yuosant ID</h2>
    <p class="muted">Akun Anda terverifikasi. Hak akses layanan tetap memerlukan persetujuan admin.</p>
    <div class="access-row"><strong>Yuosant AI</strong><span>${statusLabel("yuosant_ai")}</span><button data-request="yuosant_ai">Minta akses</button></div>
    <div class="access-row"><strong>Yuosant FinLab</strong><span>${statusLabel("yuosant_finlab")}</span><button data-request="yuosant_finlab">Minta akses</button></div>
    <button class="primary" id="logout" type="button">Keluar</button>
    <p class="fineprint">Status di sini hanya untuk tampilan. Setiap layanan wajib memvalidasi akses di backend masing-masing.</p>`;
  document.querySelectorAll("[data-request]").forEach((button) => button.addEventListener("click", () => requestAccess(button.dataset.request)));
  document.querySelector("#logout").addEventListener("click", async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) showNotice(safeError(logoutError), true);
    else window.location.reload();
  });
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
async function requestAccess(serviceKey) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email_confirmed_at) throw new Error("Verifikasi email diperlukan sebelum meminta akses.");
    const { error } = await supabase.from("yuosant_service_access").upsert({
      auth_user_id: user.id, service_key: serviceKey, request_status: "pending",
      requested_at: new Date().toISOString(), decided_at: null, decided_by: null, decision_reason: null
    }, { onConflict: "auth_user_id,service_key" });
    if (error) throw error;
    showNotice("Permintaan akses dikirim. Akses belum aktif sampai admin menyetujuinya.");
    await renderSession();
  } catch (error) {
    showNotice(safeError(error), true);
  }
}

const params = new URLSearchParams(window.location.search);
if (params.get("verified") === "1") showNotice("Tautan email telah dibuka. Anda dapat mencoba masuk.");
if (params.has("code")) showNotice("Tautan autentikasi terdeteksi. Jika verifikasi gagal, minta tautan baru.");
if (configured()) {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) setTimeout(() => renderSession().catch((error) => showNotice(safeError(error), true)), 0);
  });
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) renderSession().catch((error) => showNotice(safeError(error), true));
  });
}
