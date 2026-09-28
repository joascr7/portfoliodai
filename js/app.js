// ═══════════════════════════════════════════════
//  DAIANE ROSANA — APP.JS
//  Renderização do portfólio a partir do PORTFOLIO_DATA
// ═══════════════════════════════════════════════

if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    renderPortfolio();
    initPetals();
    initNavbar();
    initHamburger();
    requestAnimationFrame(function () {
      requestAnimationFrame(initScrollReveal);
    });

    // Sincronização sob demanda com Supabase (com cache)
    if (typeof loadFromSupabase === "function") {
      loadFromSupabase().then(function (remoteData) {
        if (remoteData && typeof remoteData === "object") {
          applyRemoteData(remoteData);
          renderPortfolio();
          requestAnimationFrame(initScrollReveal);
        }
      }).catch(function () {});
    }
  });
}

function applyRemoteData(p) {
  if (!p) return;
  ["meta","identity","theme","nav","sections","contact","footer"].forEach(function (k) {
    if (p[k]) Object.assign(PORTFOLIO_DATA[k], p[k]);
  });
  // Só sobrescreve arrays se o dado remoto tiver itens (evita apagar cards por salvamento acidental vazio)
  if (p.highlights && p.highlights.length > 0) PORTFOLIO_DATA.highlights = p.highlights;
  if (p.education  && p.education.length  > 0) PORTFOLIO_DATA.education  = p.education;
  if (p.activities && p.activities.length > 0) PORTFOLIO_DATA.activities = p.activities;
}

// ════════════════════════════════
//  RENDERIZAÇÃO PRINCIPAL
// ════════════════════════════════
function renderPortfolio() {
  var D = PORTFOLIO_DATA;

  // Meta
  document.title = D.meta.title;
  var md = document.getElementById("page-meta-desc");
  if (md) md.setAttribute("content", D.meta.description);

  // Tema — aplicar variáveis CSS
  applyTheme(D.theme);

  // Navbar
  setText("nav-logo-text", D.nav.logoText);
  setSrc("nav-logo-img", D.identity.logoSrc);

  // Hero
  setText("hero-badge", D.identity.role);
  setText("hero-name", D.identity.name);
  setText("hero-role-text", D.identity.role.toUpperCase());
  setText("hero-subtitle", D.identity.subtitle);
  setSrc("hero-avatar", D.identity.avatarSrc);

  // Sobre
  toggleSection("about", D.sections.about.enabled);
  setText("about-tag", D.sections.about.tag);
  setText("about-title", D.sections.about.title);
  setSrc("about-photo", D.identity.avatarSrc);
  setText("about-text", D.identity.about);

  // Destaques
  var hl = document.getElementById("about-highlights");
  if (hl) {
    hl.innerHTML = D.highlights.map(function (h) {
      return '<div class="highlight-item"><span class="highlight-icon">' + h.icon + '</span><span class="highlight-label">' + h.label + '</span></div>';
    }).join("");
  }

  // Formação
  toggleSection("education", D.sections.education.enabled);
  setText("education-tag", D.sections.education.tag);
  setText("education-title", D.sections.education.title);
  var eduCards = document.getElementById("edu-cards");
  if (eduCards) {
    eduCards.innerHTML = D.education.map(function (e, i) {
      return '<div class="edu-card" id="edu-card-' + i + '">' +
        '<div class="edu-card-icon">' + e.icon + '</div>' +
        '<div class="edu-card-body">' +
          '<div class="edu-card-degree">' + e.degree + '</div>' +
          '<div class="edu-card-institution">' + e.institution + '</div>' +
          '<div class="edu-card-status">' + e.status + '</div>' +
        '</div></div>';
    }).join("");
  }

  // Atividades
  toggleSection("activities", !D.sections || !D.sections.activities || D.sections.activities.enabled !== false);
  setText("activities-tag", D.sections.activities.tag);
  setText("activities-title", D.sections.activities.title);
  var grid = document.getElementById("activities-grid");
  if (grid) {
    grid.innerHTML = D.activities.map(function (a, i) {
      return '<div class="activity-card" id="activity-' + i + '">' +
        '<span class="activity-icon">' + a.icon + '</span>' +
        '<h3 class="activity-title">' + a.title + '</h3>' +
        '<p class="activity-desc">' + a.desc + '</p></div>';
    }).join("");
  }

  // Contato
  toggleSection("contact", D.sections.contact.enabled);
  setText("contact-tag", D.sections.contact.tag);
  setText("contact-title", D.sections.contact.title);
  setText("contact-note", D.contact.note);

  var emailEl = document.getElementById("contact-email");
  if (emailEl) {
    emailEl.href = D.contact.email ? "mailto:" + D.contact.email : "#";
    emailEl.style.display = D.contact.email ? "" : "none";
  }
  setText("contact-email-label", D.contact.emailLabel || "E-mail");

  var waEl = document.getElementById("contact-whatsapp");
  if (waEl) {
    waEl.href = D.contact.whatsapp ? "https://wa.me/" + D.contact.whatsapp.replace(/\D/g, "") : "#";
    waEl.style.display = D.contact.whatsapp ? "" : "none";
  }
  setText("contact-whatsapp-label", D.contact.whatsappLabel || "WhatsApp");

  var liEl = document.getElementById("contact-linkedin");
  if (liEl) {
    liEl.href = D.contact.linkedin ? "https://linkedin.com/in/" + D.contact.linkedin : "#";
    liEl.style.display = D.contact.linkedin ? "" : "none";
  }
  setText("contact-linkedin-label", D.contact.linkedinLabel || "LinkedIn");

  // Rodapé
  setText("footer-name", D.footer.name);
  setText("footer-copy", D.footer.copy);
  setSrc("footer-logo", D.identity.logoSrc);
}

// ════════════════════════════════
//  APLICAR TEMA
// ════════════════════════════════
function applyTheme(t) {
  var r = document.documentElement;
  if (t.wine)      r.style.setProperty("--wine", t.wine);
  if (t.wineMid)   r.style.setProperty("--wine-mid", t.wineMid);
  if (t.wineLight) r.style.setProperty("--wine-light", t.wineLight);
  if (t.rose)      r.style.setProperty("--rose", t.rose);
  if (t.roseLight) r.style.setProperty("--rose-light", t.roseLight);
  if (t.textMain)  r.style.setProperty("--text-main", t.textMain);
  if (t.textMuted) r.style.setProperty("--text-muted", t.textMuted);
  if (t.rose) {
    var a = hexToRgba(t.rose, 0.14);
    var b = hexToRgba(t.rose, 0.22);
    var c = hexToRgba(t.rose, 0.08);
    r.style.setProperty("--rose-muted", a);
    r.style.setProperty("--rose-border", b);
    r.style.setProperty("--shimmer", c);
    r.style.setProperty("--shadow-rose", "0 6px 30px " + hexToRgba(t.rose, 0.28));
  }
  if (t.fontBody)   r.style.setProperty("--font-body", "'" + t.fontBody + "', 'Jost', system-ui, sans-serif");
  if (t.fontAccent) r.style.setProperty("--font-accent", "'" + t.fontAccent + "', 'Cormorant Garamond', Georgia, serif");
}

function hexToRgba(hex, alpha) {
  try {
    var r2 = parseInt(hex.slice(1,3),16);
    var g  = parseInt(hex.slice(3,5),16);
    var b  = parseInt(hex.slice(5,7),16);
    return "rgba(" + r2 + "," + g + "," + b + "," + alpha + ")";
  } catch(e) { return "rgba(196,134,154," + alpha + ")"; }
}

// ════════════════════════════════
//  PÉTALAS ANIMADAS
// ════════════════════════════════
function initPetals() {
  var container = document.getElementById("hero-petals");
  if (!container) return;
  var petals = ["🌸","🌺","✿","❀","🌷","❁"];
  for (var i = 0; i < 18; i++) {
    (function(idx) {
      var p = document.createElement("span");
      p.className = "petal";
      p.textContent = petals[Math.floor(Math.random() * petals.length)];
      p.style.left = Math.random() * 100 + "%";
      p.style.top  = (Math.random() * 20 - 20) + "%";
      p.style.fontSize = (Math.random() * 14 + 8) + "px";
      p.style.animationDuration = (Math.random() * 12 + 10) + "s";
      p.style.animationDelay    = (Math.random() * 15) + "s";
      p.style.opacity = "0";
      container.appendChild(p);
    })(i);
  }
}

// ════════════════════════════════
//  NAVBAR COM SCROLL
// ════════════════════════════════
function initNavbar() {
  var nav = document.getElementById("navbar");
  var links = document.querySelectorAll(".nav-link[href^='#']");
  var sections = [];
  links.forEach(function (l) {
    var t = l.getAttribute("href");
    if (t && t.startsWith("#")) {
      var sec = document.querySelector(t);
      if (sec) sections.push({ el: sec, link: l });
    }
  });
  window.addEventListener("scroll", function () {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
    var sy = window.scrollY + 100;
    sections.forEach(function (s) {
      var top = s.el.offsetTop;
      var bot = top + s.el.offsetHeight;
      s.link.classList.toggle("active", sy >= top && sy < bot);
    });
  }, { passive: true });
}

// ════════════════════════════════
//  MENU HAMBÚRGUER
// ════════════════════════════════
function initHamburger() {
  var btn   = document.getElementById("nav-hamburger");
  var links = document.getElementById("nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", function () {
    var open = btn.classList.toggle("open");
    links.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      btn.classList.remove("open");
      links.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

// ════════════════════════════════
//  SCROLL REVEAL
// ════════════════════════════════
function initScrollReveal() {
  var targets = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  targets.forEach(function (el) { observer.observe(el); });
}

// ════════════════════════════════
//  UTILITÁRIOS
// ════════════════════════════════
function setText(id, val) {
  var el = document.getElementById(id);
  if (el && val !== undefined) el.textContent = val;
}
function setSrc(id, src) {
  var el = document.getElementById(id);
  if (el && src) el.src = src;
}
function toggleSection(id, enabled) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle("section-hidden", !enabled);
}
function showToast(msg, duration) {
  duration = duration || 3000;
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, duration);
}

// Atalho reservado para o administrador (Ctrl + Shift + A)
document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
    window.location.href = "admin.html";
  }
});

