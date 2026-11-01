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
          emailRedirectTo: new URL("/auth/index.html?verified=1", window.location.origin).href
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
  const [{ data: profile, error: profileError }, { data: access, error: accessError }] = await Promise.all([
    supabase.from("yuosant_profiles").select("account_status,display_name").eq("auth_user_id", user.id).maybeSingle(),
    supabase.from("yuosant_service_access")
      .select("service_key,request_status,requested_at")
      .eq("auth_user_id", user.id)
  ]);
  if (profileError || accessError || !profile) {
    showNotice("Login berhasil, tetapi status akun atau akses belum dapat dimuat. Silakan muat ulang atau hubungi administrator.", true);
    return;
  }
  if (profile.account_status !== "active") {
    const accountMessage = profile.account_status === "suspended"
      ? "Akun Anda sedang ditangguhkan. Hubungi administrator Yuosant."
      : "Akun Yuosant ID Anda dinonaktifkan. Hubungi administrator.";
    document.querySelector(".panel").innerHTML = `
      <div class="notice error">${escapeHtml(accountMessage)}</div>
      <h2>Akses akun dihentikan</h2>
      <p class="muted">Layanan Yuosant tidak dapat dibuka dari akun ini.</p>
      <button class="logout-button" id="logout" type="button">Keluar</button>`;
    document.querySelector("#logout").addEventListener("click", async () => {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) showNotice(safeError(logoutError), true);
      else window.location.reload();
    });
    return;
  }
  const states = Object.fromEntries((access || []).map((row) => [row.service_key, row.request_status]));
  const serviceCard = (key, label, destination) => {
    const status = states[key];
    const approved = status === "approved";
    const pending = status === "pending";
    const rejected = status === "rejected";
    const statusText = approved ? "Akses disetujui" : pending ? "Menunggu persetujuan" : rejected ? "Permintaan ditolak" : status === "revoked" ? "Akses dicabut" : "Belum memiliki akses";
    const action = approved
      ? `<a class="request-button" href="${destination}" target="_blank" rel="noopener noreferrer">Buka ${label} ↗</a>`
      : pending
        ? '<span class="access-pending">Menunggu keputusan administrator</span>'
        : rejected || status === "revoked"
          ? `<button class="request-button" data-request="${key}">Ajukan ulang</button>`
          : `<button class="request-button" data-request="${key}">Minta akses</button>`;
    return `<article class="service-access-card">
      <div class="service-access-top"><strong>${label}</strong><span class="service-status ${approved ? "is-approved" : pending ? "is-pending" : ""}">${statusText}</span></div>
      <div class="service-access-bottom">${action}</div>
    </article>`;
  };
  document.querySelector(".panel").innerHTML = `
    <div class="notice">Berhasil masuk sebagai ${escapeHtml(user.email || "")}</div>
    <a class="home-link panel-home-link" href="/">← Kembali ke Beranda Yuosant</a>
    ${user.app_metadata?.role === "super_admin" ? '<p><a class="text-button" href="./admin.html">Buka Dashboard Super Admin →</a></p>' : ""}
    <h2>Dashboard Yuosant ID</h2>
    <p class="muted">Halo ${escapeHtml(profile.display_name || user.email || "Pengguna")}. Email terverifikasi dan akun aktif. Pilih layanan yang sudah disetujui administrator.</p>
    <p class="muted access-note">Akses Yuosant AI dan Yuosant FinLab hanya dapat dilakukan melalui Dashboard Yuosant ID setelah login dan mendapat persetujuan administrator.</p>
    <div class="service-access-list">
      ${serviceCard("yuosant_ai", "Yuosant AI", "https://ai.yuosant.com")}
      ${serviceCard("yuosant_finlab", "Yuosant FinLab", "https://finlab.yuosant.com")}
    </div>
    <button class="logout-button" id="logout" type="button">Keluar</button>
    <p class="fineprint">Tombol layanan hanya tersedia setelah persetujuan. Setiap aplikasi tetap wajib memeriksa hak akses pada backend-nya.</p>`;
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
  const button = document.querySelector(`[data-request="${serviceKey}"]`);
  if (button) button.disabled = true;
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.email_confirmed_at) throw new Error("Verifikasi email diperlukan sebelum meminta akses.");
    const { data, error } = await supabase.functions.invoke("request-service-access", { body: { service_key: serviceKey } });
    if (error) throw error;
    if (!data?.success || data.request_status !== "pending") throw new Error(data?.error || "Pengajuan akses belum berhasil. Silakan coba lagi.");
    showNotice("Permintaan akses berhasil dikirim. Akses aktif setelah disetujui administrator.");
    await renderSession();
  } catch (error) {
    showNotice(safeError(error), true);
    if (button) button.disabled = false;
  }
}

const params = new URLSearchParams(window.location.search);
if (params.get("verified") === "1") showNotice("Email berhasil diverifikasi. Silakan masuk ke Yuosant ID untuk melanjutkan.");
if (params.has("code")) showNotice("Tautan autentikasi sedang diproses. Jika verifikasi gagal, minta tautan baru.");
if (configured()) {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) setTimeout(() => renderSession().catch((error) => showNotice(safeError(error), true)), 0);
  });
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) renderSession().catch((error) => showNotice(safeError(error), true));
  });
}
