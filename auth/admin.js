import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
});
const $ = (selector) => document.querySelector(selector);
let profiles = [];
let accessRows = [];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
function notify(message, error = false) {
  const node = $("#notice");
  node.textContent = message;
  node.hidden = false;
  node.classList.toggle("error", error);
}
function labelStatus(status) {
  return ({ pending: "Menunggu", approved: "Disetujui", rejected: "Ditolak", revoked: "Dicabut", active: "Aktif", suspended: "Ditangguhkan", disabled: "Dinonaktifkan" })[status] || status;
}
function dateLabel(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

async function loadDashboard() {
  $("#refresh").disabled = true;
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("Sesi tidak valid. Silakan masuk kembali.");
    const user = userData.user;
    $("#admin-email").textContent = user.email || "";
    if (user.app_metadata?.role !== "super_admin") {
      throw new Error("Akun ini tidak memiliki hak Super Admin. Keluar lalu masuk kembali untuk memperbarui sesi.");
    }
    const { data, error } = await supabase.functions.invoke("admin-list-access-requests", { method: "GET" });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error || "Data administrasi gagal dimuat.");
    profiles = data.profiles || [];
    accessRows = data.access || [];
    render();
  } catch (error) {
    notify(error.message || "Terjadi kesalahan saat memuat dashboard.", true);
    $("#requests").innerHTML = '<div class="empty">Data belum dapat ditampilkan.</div>';
    $("#accounts").innerHTML = '<div class="empty">Data belum dapat ditampilkan.</div>';
  } finally {
    $("#refresh").disabled = false;
  }
}

function render() {
  const pending = accessRows.filter((row) => row.request_status === "pending").length;
  const approved = accessRows.filter((row) => row.request_status === "approved").length;
  $("#stats").innerHTML = [
    [profiles.length, "Akun terdaftar"],
    [pending, "Menunggu keputusan"],
    [approved, "Akses disetujui"]
  ].map(([count, label]) => '<div class="stat"><strong>' + count + '</strong><span>' + label + '</span></div>').join("");

  const filter = $("#filter").value;
  const shown = accessRows.filter((row) => filter === "all" || row.request_status === filter);
  $("#requests").innerHTML = shown.length ? shown.map((row) => {
    const profile = profiles.find((item) => item.auth_user_id === row.auth_user_id) || {};
    const service = row.service_key === "yuosant_ai" ? "Yuosant AI" : "Yuosant FinLab";
    const actions = row.request_status === "pending"
      ? '<button class="action approve" data-action="approve_access" data-user="' + escapeHtml(row.auth_user_id) + '" data-service="' + escapeHtml(row.service_key) + '">Setujui</button><button class="action reject" data-action="reject_access" data-user="' + escapeHtml(row.auth_user_id) + '" data-service="' + escapeHtml(row.service_key) + '">Tolak</button>'
      : row.request_status === "approved"
        ? '<button class="action reject" data-action="revoke_access" data-user="' + escapeHtml(row.auth_user_id) + '" data-service="' + escapeHtml(row.service_key) + '">Cabut akses</button>'
        : '<span class="pill">Tidak ada tindakan</span>';
    return '<article class="admin-card"><div class="admin-card-head"><strong>' + escapeHtml(profile.display_name || "Tanpa nama") + '<br><span class="meta">' + escapeHtml(profile.email || row.auth_user_id) + '</span></strong><span class="pill">' + labelStatus(row.request_status) + '</span></div><p class="meta">' + service + ' · Diajukan ' + dateLabel(row.requested_at) + '</p><div class="actions">' + actions + '</div></article>';
  }).join("") : '<div class="empty">Tidak ada permintaan pada filter ini.</div>';

  $("#accounts").innerHTML = profiles.length ? profiles.map((profile) => {
    const action = profile.account_status === "active"
      ? '<button class="action suspend" data-action="suspend_account" data-user="' + escapeHtml(profile.auth_user_id) + '">Tangguhkan akun</button>'
      : profile.account_status === "suspended"
        ? '<button class="action approve" data-action="reactivate_account" data-user="' + escapeHtml(profile.auth_user_id) + '">Aktifkan kembali</button>'
        : '<span class="pill">Nonaktif</span>';
    return '<article class="admin-card"><div class="admin-card-head"><strong>' + escapeHtml(profile.display_name || "Tanpa nama") + '<br><span class="meta">' + escapeHtml(profile.email || profile.auth_user_id) + '</span></strong><span class="pill">' + labelStatus(profile.account_status) + '</span></div><p class="meta">Terdaftar ' + dateLabel(profile.created_at) + '</p><div class="actions">' + action + '</div></article>';
  }).join("") : '<div class="empty">Belum ada akun.</div>';
}

async function performAction(button) {
  const action = button.dataset.action;
  const target_user_id = button.dataset.user;
  const service_key = button.dataset.service;
  const reason = window.prompt("Alasan keputusan (opsional):", "");
  if (reason === null) return;
  button.disabled = true;
  try {
    const { data, error } = await supabase.functions.invoke("manage-service-access", {
      body: { action, target_user_id, service_key, reason: reason.trim() || null }
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error || "Tindakan tidak berhasil.");
    notify("Keputusan berhasil disimpan dan dicatat.");
    await loadDashboard();
  } catch (error) {
    notify(error.message || "Tindakan gagal. Silakan coba lagi.", true);
    button.disabled = false;
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (button) performAction(button);
});
$("#filter").addEventListener("change", render);
$("#refresh").addEventListener("click", loadDashboard);
loadDashboard();