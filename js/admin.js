// ═══════════════════════════════════════════════
//  DAIANE ROSANA — ADMIN.JS
//  Painel completo de edição do portfólio
//  Com suporte a TODAS as cores ajustáveis
// ═══════════════════════════════════════════════

if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    initAuth();
    initSidebar();
    loadFormValues();
    initColorPickers();
    initHighlightsList();
    initEducationList();
    initActivitiesList();
    initSectionToggles();
    initImageUploads();
    initSaveButton();
    initResetButton();
    initLogoutButton();
    initChangePassword();
  });
}

// ════════════════════════════════
//  SIDEBAR
// ════════════════════════════════
function initSidebar() {
  var buttons = document.querySelectorAll(".sidebar-btn");
  var panels  = document.querySelectorAll(".panel");
  var toggle  = document.getElementById("sidebar-toggle");
  var sidebar = document.getElementById("sidebar");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panelId = "panel-" + btn.getAttribute("data-panel");
      buttons.forEach(function (b) { b.classList.remove("active"); });
      panels.forEach(function (p) { p.classList.add("hidden"); });
      btn.classList.add("active");
      var panel = document.getElementById(panelId);
      if (panel) panel.classList.remove("hidden");
      if (window.innerWidth < 768) sidebar.classList.remove("open");
    });
  });

  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    });
  }
}

// ════════════════════════════════
//  CARREGAR VALORES NOS FORMULÁRIOS
// ════════════════════════════════
function loadFormValues() {
  var D = PORTFOLIO_DATA;

  // Identidade
  setVal("f-name",          D.identity.name);
  setVal("f-role",          D.identity.role);
  setVal("f-subtitle",      D.identity.subtitle);
  setVal("f-meta-title",    D.meta.title);
  setVal("f-meta-desc",     D.meta.description);
  setVal("f-nav-logo-text", D.nav.logoText);
  setVal("f-footer-copy",   D.footer.copy);

  // Tema — todas as cores
  setColorField("f-wine",       D.theme.wine       || "#150810");
  setColorField("f-wine-mid",   D.theme.wineMid    || "#1f0d16");
  setColorField("f-wine-light", D.theme.wineLight  || "#3d1a2a");
  setColorField("f-rose",       D.theme.rose       || "#c4869a");
  setColorField("f-rose-light", D.theme.roseLight  || "#e8b4c4");
  setColorField("f-text-main",  D.theme.textMain   || "#f0dde5");
  setColorField("f-text-muted", D.theme.textMuted  || "#a07080");
  setVal("f-font-body",    D.theme.fontBody   || "Jost");
  setVal("f-font-accent",  D.theme.fontAccent || "Cormorant Garamond");

  // Seções
  setVal("f-about-tag",         D.sections.about.tag);
  setVal("f-about-title",       D.sections.about.title);
  setVal("f-about-text",        D.identity.about);
  setVal("f-education-tag",     D.sections.education.tag);
  setVal("f-education-title",   D.sections.education.title);
  setVal("f-activities-tag",    D.sections.activities.tag);
  setVal("f-activities-title",  D.sections.activities.title);
  setVal("f-contact-tag",       D.sections.contact.tag);
  setVal("f-contact-title",     D.sections.contact.title);
  setVal("f-contact-email",     D.contact.email);
  setVal("f-contact-whatsapp",  D.contact.whatsapp);
  setVal("f-contact-linkedin",  D.contact.linkedin);
  setVal("f-contact-note",      D.contact.note);

  // Toggles
  setCheck("t-about",      D.sections.about.enabled);
  setCheck("t-education",  D.sections.education.enabled);
  setCheck("t-activities", D.sections.activities.enabled);
  setCheck("t-contact",    D.sections.contact.enabled);

  // Imagens
  setSrc("preview-avatar", D.identity.avatarSrc);
  setSrc("preview-logo",   D.identity.logoSrc);
}

function setColorField(baseId, value) {
  var picker = document.getElementById(baseId);
  var text   = document.getElementById(baseId + "-text");
  if (picker) picker.value = value;
  if (text)   text.value   = value;
}

// ════════════════════════════════
//  COLOR PICKERS — SINCRONIZAÇÃO
// ════════════════════════════════
var COLOR_FIELDS = [
  { id: "f-wine",       themeKey: "wine" },
  { id: "f-wine-mid",   themeKey: "wineMid" },
  { id: "f-wine-light", themeKey: "wineLight" },
  { id: "f-rose",       themeKey: "rose" },
  { id: "f-rose-light", themeKey: "roseLight" },
  { id: "f-text-main",  themeKey: "textMain" },
  { id: "f-text-muted", themeKey: "textMuted" }
];

function initColorPickers() {
  COLOR_FIELDS.forEach(function (f) {
    var picker = document.getElementById(f.id);
    var text   = document.getElementById(f.id + "-text");
    if (!picker || !text) return;

    picker.addEventListener("input", function () {
      text.value = picker.value;
      updatePreview();
    });
    text.addEventListener("input", function () {
      if (/^#[0-9A-Fa-f]{6}$/.test(text.value)) {
        picker.value = text.value;
        updatePreview();
      }
    });
  });
}

function updatePreview() {
  var rose = document.getElementById("f-rose");
  var roseLight = document.getElementById("f-rose-light");
  var wineMid = document.getElementById("f-wine-mid");
  var textMain = document.getElementById("f-text-main");
  var textMuted = document.getElementById("f-text-muted");
  if (!rose) return;

  var r = rose.value;
  var rl = roseLight ? roseLight.value : "#e8b4c4";
  var wm = wineMid ? wineMid.value : "#1f0d16";
  var tm = textMain ? textMain.value : "#f0dde5";
  var tmu = textMuted ? textMuted.value : "#a07080";

  var preview = document.querySelector(".theme-preview");
  if (preview) {
    preview.style.background = wm;
    preview.style.borderColor = r + "44";
  }
  var tag = document.querySelector(".tp-tag");
  if (tag) { tag.style.color = r; tag.style.borderColor = r + "44"; tag.style.background = r + "22"; }
  var title = document.querySelector(".tp-title");
  if (title) title.style.color = tm;
  var text = document.querySelector(".tp-text");
  if (text) text.style.color = tmu;
  var badge = document.querySelector(".tp-badge");
  if (badge) { badge.style.color = rl; badge.style.borderColor = r + "44"; badge.style.background = r + "22"; }
}

// ════════════════════════════════
//  DESTAQUES
// ════════════════════════════════
function initHighlightsList() {
  renderList("highlights-list", PORTFOLIO_DATA.highlights, renderHighlightItem);
  var btn = document.getElementById("btn-add-highlight");
  if (btn) btn.addEventListener("click", function () {
    PORTFOLIO_DATA.highlights.push({ icon: "⭐", label: "Novo Destaque" });
    renderList("highlights-list", PORTFOLIO_DATA.highlights, renderHighlightItem);
  });
}
function renderHighlightItem(item, index) {
  return '<div class="list-item">' +
    '<button class="btn-remove" onclick="removeItem(\'highlights\',' + index + ')">✕ Remover</button>' +
    '<div class="list-item-row">' +
      '<div class="form-group">' +
        '<label class="form-label">Ícone (emoji)</label>' +
        '<input type="text" class="form-input" value="' + escHtml(item.icon) + '" oninput="PORTFOLIO_DATA.highlights[' + index + '].icon=this.value" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Texto</label>' +
        '<input type="text" class="form-input" value="' + escHtml(item.label) + '" oninput="PORTFOLIO_DATA.highlights[' + index + '].label=this.value" />' +
      '</div>' +
    '</div></div>';
}

// ════════════════════════════════
//  FORMAÇÃO
// ════════════════════════════════
function initEducationList() {
  renderList("education-list", PORTFOLIO_DATA.education, renderEduItem);
  var btn = document.getElementById("btn-add-edu");
  if (btn) btn.addEventListener("click", function () {
    PORTFOLIO_DATA.education.push({ icon: "🎓", degree: "Nova Formação", institution: "Instituição", status: "Concluído" });
    renderList("education-list", PORTFOLIO_DATA.education, renderEduItem);
  });
}
function renderEduItem(item, index) {
  return '<div class="list-item">' +
    '<button class="btn-remove" onclick="removeItem(\'education\',' + index + ')">✕ Remover</button>' +
    '<div class="list-item-row">' +
      '<div class="form-group"><label class="form-label">Ícone</label>' +
        '<input type="text" class="form-input" value="' + escHtml(item.icon) + '" oninput="PORTFOLIO_DATA.education[' + index + '].icon=this.value" /></div>' +
      '<div class="form-group"><label class="form-label">Curso / Grau</label>' +
        '<input type="text" class="form-input" value="' + escHtml(item.degree) + '" oninput="PORTFOLIO_DATA.education[' + index + '].degree=this.value" /></div>' +
      '<div class="form-group"><label class="form-label">Instituição</label>' +
        '<input type="text" class="form-input" value="' + escHtml(item.institution) + '" oninput="PORTFOLIO_DATA.education[' + index + '].institution=this.value" /></div>' +
      '<div class="form-group"><label class="form-label">Status</label>' +
        '<input type="text" class="form-input" value="' + escHtml(item.status) + '" oninput="PORTFOLIO_DATA.education[' + index + '].status=this.value" /></div>' +
    '</div></div>';
}

// ════════════════════════════════
//  ATIVIDADES
// ════════════════════════════════
function initActivitiesList() {
  renderList("activities-list", PORTFOLIO_DATA.activities, renderActivityItem);
  var btn = document.getElementById("btn-add-activity");
  if (btn) btn.addEventListener("click", function () {
    PORTFOLIO_DATA.activities.push({ icon: "📌", title: "Nova Atividade", desc: "Descrição da atividade." });
    renderList("activities-list", PORTFOLIO_DATA.activities, renderActivityItem);
  });
}
function renderActivityItem(item, index) {
  return '<div class="list-item">' +
    '<button class="btn-remove" onclick="removeItem(\'activities\',' + index + ')">✕ Remover</button>' +
    '<div class="list-item-row">' +
      '<div class="form-group"><label class="form-label">Ícone</label>' +
        '<input type="text" class="form-input" value="' + escHtml(item.icon) + '" oninput="PORTFOLIO_DATA.activities[' + index + '].icon=this.value" /></div>' +
      '<div class="form-group"><label class="form-label">Título</label>' +
        '<input type="text" class="form-input" value="' + escHtml(item.title) + '" oninput="PORTFOLIO_DATA.activities[' + index + '].title=this.value" /></div>' +
    '</div>' +
    '<div class="list-item-row full">' +
      '<div class="form-group"><label class="form-label">Descrição</label>' +
        '<textarea class="form-input" rows="2" oninput="PORTFOLIO_DATA.activities[' + index + '].desc=this.value">' + escHtml(item.desc) + '</textarea></div>' +
    '</div></div>';
}

// ════════════════════════════════
//  LISTAS GENÉRICAS
// ════════════════════════════════
function renderList(containerId, arr, renderFn) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = arr.map(function (item, i) { return renderFn(item, i); }).join("");
}
function removeItem(key, index) {
  PORTFOLIO_DATA[key].splice(index, 1);
  if (key === "highlights") renderList("highlights-list", PORTFOLIO_DATA.highlights, renderHighlightItem);
  if (key === "education")  renderList("education-list",  PORTFOLIO_DATA.education,  renderEduItem);
  if (key === "activities") renderList("activities-list", PORTFOLIO_DATA.activities, renderActivityItem);
}
function escHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ════════════════════════════════
//  TOGGLES DE SEÇÕES
// ════════════════════════════════
function initSectionToggles() {
  ["about","education","activities","contact"].forEach(function (key) {
    var el = document.getElementById("t-" + key);
    if (el) el.addEventListener("change", function () {
      PORTFOLIO_DATA.sections[key].enabled = el.checked;
    });
  });
}

// ════════════════════════════════
//  UPLOAD DE IMAGENS
// ════════════════════════════════
function initImageUploads() {
  setupImageUpload("upload-avatar", "preview-avatar", function (dataUrl) {
    PORTFOLIO_DATA.identity.avatarSrc = dataUrl;
    showToastAdmin("Avatar carregado! Salve para aplicar.", "success");
  });
  setupImageUpload("upload-logo", "preview-logo", function (dataUrl) {
    PORTFOLIO_DATA.identity.logoSrc = dataUrl;
    showToastAdmin("Logo carregada! Salve para aplicar.", "success");
  });
}
function setupImageUpload(inputId, previewId, onLoad) {
  var input   = document.getElementById(inputId);
  var preview = document.getElementById(previewId);
  if (!input || !preview) return;
  input.addEventListener("change", function () {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      onLoad(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}

// ════════════════════════════════
//  SALVAR TUDO
// ════════════════════════════════
function initSaveButton() {
  var btn = document.getElementById("btn-save-all");
  if (btn) btn.addEventListener("click", saveAll);
}

function saveAll() {
  var D = PORTFOLIO_DATA;

  // Identidade
  D.identity.name     = getVal("f-name");
  D.identity.role     = getVal("f-role");
  D.identity.subtitle = getVal("f-subtitle");
  D.identity.about    = getVal("f-about-text");
  D.meta.title        = getVal("f-meta-title");
  D.meta.description  = getVal("f-meta-desc");
  D.nav.logoText      = getVal("f-nav-logo-text");
  D.footer.copy       = getVal("f-footer-copy");

  // Tema — todas as cores
  COLOR_FIELDS.forEach(function (f) {
    var picker = document.getElementById(f.id);
    if (picker) D.theme[f.themeKey] = picker.value;
  });
  D.theme.fontBody   = getVal("f-font-body");
  D.theme.fontAccent = getVal("f-font-accent");

  // Textos das seções
  D.sections.about.tag         = getVal("f-about-tag");
  D.sections.about.title       = getVal("f-about-title");
  D.sections.education.tag     = getVal("f-education-tag");
  D.sections.education.title   = getVal("f-education-title");
  D.sections.activities.tag    = getVal("f-activities-tag");
  D.sections.activities.title  = getVal("f-activities-title");
  D.sections.contact.tag       = getVal("f-contact-tag");
  D.sections.contact.title     = getVal("f-contact-title");

  // Contato
  D.contact.email     = getVal("f-contact-email");
  D.contact.whatsapp  = getVal("f-contact-whatsapp");
  D.contact.linkedin  = getVal("f-contact-linkedin");
  D.contact.note      = getVal("f-contact-note");

  // Toggles
  D.sections.about.enabled      = document.getElementById("t-about").checked;
  D.sections.education.enabled  = document.getElementById("t-education").checked;
  D.sections.activities.enabled = document.getElementById("t-activities").checked;
  D.sections.contact.enabled    = document.getElementById("t-contact").checked;

  // Salvar no localStorage
  try {
    localStorage.setItem("portfolio_data_v2", JSON.stringify(D));
    showToastAdmin("✅ Alterações salvas com sucesso!", "success");
  } catch (e) {
    showToastAdmin("❌ Erro ao salvar: " + e.message, "error");
  }
}

// ════════════════════════════════
//  RESTAURAR PADRÃO
// ════════════════════════════════
function initResetButton() {
  var btn = document.getElementById("btn-reset");
  if (!btn) return;
  btn.addEventListener("click", function () {
    if (confirm("Tem certeza? Todas as alterações salvas serão perdidas.")) {
      localStorage.removeItem("portfolio_data_v2");
      showToastAdmin("Padrão restaurado. Recarregando...", "success");
      setTimeout(function () { location.reload(); }, 1200);
    }
  });
}

// ════════════════════════════════
//  UTILITÁRIOS
// ════════════════════════════════
function getVal(id) { var el = document.getElementById(id); return el ? el.value : ""; }
function setVal(id, val) { var el = document.getElementById(id); if (el && val !== undefined) el.value = val; }
function setCheck(id, val) { var el = document.getElementById(id); if (el) el.checked = !!val; }
function setSrc(id, src) { var el = document.getElementById(id); if (el && src) el.src = src; }

function showToastAdmin(msg, type) {
  type = type || "success";
  var t = document.getElementById("toast-admin");
  if (!t) return;
  t.textContent = msg;
  t.className = "toast-admin show " + type;
  setTimeout(function () { t.classList.remove("show"); }, 3500);
}

// ════════════════════════════════
//  AUTENTICAÇÃO & SEGURANÇA
// ════════════════════════════════
var DEFAULT_PASS_HASH = "876df126fa559f3a922b78b78f2c703201f724002ee25f752ed1a0cdcbe92a28"; // daiane2026

async function sha256(text) {
  try {
    var enc = new TextEncoder().encode(text);
    var buf = await crypto.subtle.digest("SHA-256", enc);
    var arr = Array.from(new Uint8Array(buf));
    return arr.map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  } catch (e) {
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return String(hash);
  }
}

function getStoredPassHash() {
  return localStorage.getItem("admin_password_hash") || DEFAULT_PASS_HASH;
}

function initAuth() {
  var overlay = document.getElementById("auth-overlay");
  var form    = document.getElementById("auth-form");
  var input   = document.getElementById("auth-password");
  var errEl   = document.getElementById("auth-error");

  if (!overlay) return;

  var isAuth = sessionStorage.getItem("admin_authenticated") === "true";
  if (isAuth) {
    overlay.classList.add("hidden");
  } else {
    overlay.classList.remove("hidden");
    if (input) setTimeout(function () { input.focus(); }, 150);
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var pass = input.value.trim();
      if (!pass) {
        showAuthError("Digite sua senha de acesso.");
        return;
      }
      var hashed = await sha256(pass);
      var currentHash = getStoredPassHash();

      if (hashed === currentHash) {
        sessionStorage.setItem("admin_authenticated", "true");
        overlay.classList.add("hidden");
        if (errEl) errEl.textContent = "";
        input.value = "";
        showToastAdmin("🔓 Acesso liberado! Bem-vinda.", "success");
      } else {
        showAuthError("Senha incorreta. Verifique e tente novamente.");
        input.select();
      }
    });
  }

  function showAuthError(msg) {
    if (errEl) errEl.textContent = msg;
    input.style.borderColor = "#ff4d6d";
    setTimeout(function () { input.style.borderColor = ""; }, 1600);
  }
}

function initLogoutButton() {
  var btn = document.getElementById("btn-logout");
  if (!btn) return;
  btn.addEventListener("click", function () {
    sessionStorage.removeItem("admin_authenticated");
    var overlay = document.getElementById("auth-overlay");
    if (overlay) overlay.classList.remove("hidden");
    var input = document.getElementById("auth-password");
    if (input) {
      input.value = "";
      input.focus();
    }
    showToastAdmin("🔒 Painel bloqueado.", "info");
  });
}

function initChangePassword() {
  var btn = document.getElementById("btn-change-password");
  if (!btn) return;
  btn.addEventListener("click", async function () {
    var curr    = getVal("f-curr-pass").trim();
    var newP    = getVal("f-new-pass").trim();
    var confirm = getVal("f-confirm-pass").trim();

    if (!curr) {
      showToastAdmin("Informe a senha atual.", "error");
      return;
    }
    var hashedCurr = await sha256(curr);
    var currentStored = getStoredPassHash();

    if (hashedCurr !== currentStored) {
      showToastAdmin("A senha atual digitada está incorreta.", "error");
      return;
    }
    if (newP.length < 6) {
      showToastAdmin("A nova senha deve ter pelo menos 6 caracteres.", "error");
      return;
    }
    if (newP !== confirm) {
      showToastAdmin("A confirmação da senha não coincide.", "error");
      return;
    }

    var hashedNew = await sha256(newP);
    localStorage.setItem("admin_password_hash", hashedNew);

    setVal("f-curr-pass", "");
    setVal("f-new-pass", "");
    setVal("f-confirm-pass", "");

    showToastAdmin("🔑 Senha alterada com sucesso!", "success");
  });
}
