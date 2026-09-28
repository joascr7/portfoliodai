// ═══════════════════════════════════════════════
//  DAIANE ROSANA — DATA.JS
//  Fonte de dados central do portfólio.
//  Editável via admin.html sem tocar no código.
// ═══════════════════════════════════════════════

var PORTFOLIO_DATA = {
  meta: {
    title: "Daiane Rosana — Apoio Administrativo",
    description: "Portfólio profissional de Daiane Rosana, especialista em Apoio Administrativo."
  },
  identity: {
    name: "Daiane Rosana",
    role: "Apoio Administrativo",
    subtitle: "Profissional dedicada à excelência administrativa",
    about: "Profissional de Apoio Administrativo comprometida com a organização, eficiência e qualidade nas entregas. Atuo com foco em processos, gestão de demandas e suporte integral às equipes nos desafios do cotidiano institucional.",
    avatarSrc: "assets/avatar.jpg",
    logoSrc: "assets/logo.jpg"
  },
  theme: {
    wine:        "#150810",
    wineMid:     "#1f0d16",
    wineLight:   "#3d1a2a",
    rose:        "#c4869a",
    roseLight:   "#e8b4c4",
    textMain:    "#f0dde5",
    textMuted:   "#a07080",
    fontBody:    "Jost",
    fontAccent:  "Cormorant Garamond"
  },
  nav: {
    logoText: "Daiane Rosana"
  },
  sections: {
    about:      { enabled: true,  tag: "Quem sou eu",  title: "Sobre Mim" },
    education:  { enabled: true,  tag: "Qualificação", title: "Formação Acadêmica" },
    activities: { enabled: true,  tag: "O que faço",   title: "Atividades e Responsabilidades" },
    contact:    { enabled: true,  tag: "Fale comigo",  title: "Contato" }
  },
  highlights: [
    { icon: "📋", label: "Gestão de Processos" },
    { icon: "📊", label: "Controle de Planilhas" },
    { icon: "🗂️", label: "Organização Documental" },
    { icon: "🤝", label: "Apoio Institucional" }
  ],
  education: [
    {
      icon: "🎓",
      degree: "Graduação em Pedagogia",
      institution: "UNINOVO",
      status: "Em andamento"
    }
  ],
  activities: [
    {
      icon: "🗂️",
      title: "Gestão de Processos no SEI",
      desc: "Acompanhamento e organização de processos institucionais através do sistema SEI."
    },
    {
      icon: "🔍",
      title: "Verificação de Pendências",
      desc: "Monitoramento e verificação de processos pendentes, garantindo agilidade no fluxo de trabalho."
    },
    {
      icon: "📊",
      title: "Planilhas de Passagem",
      desc: "Atualização sistemática de planilhas de passagem para controle e rastreabilidade das informações."
    },
    {
      icon: "📋",
      title: "Demandas Administrativas",
      desc: "Organização e acompanhamento integral das demandas e fluxos administrativos da instituição."
    },
    {
      icon: "🤝",
      title: "Apoio Setorial",
      desc: "Suporte ativo e colaborativo aos setores nas atividades e rotinas do dia a dia institucional."
    }
  ],
  contact: {
    email: "",
    whatsapp: "",
    linkedin: "",
    emailLabel:    "E-mail",
    whatsappLabel: "WhatsApp",
    linkedinLabel: "LinkedIn",
    note: "Disponível para oportunidades e colaborações profissionais."
  },
  footer: {
    name: "Daiane Rosana",
    copy: "© 2026 — Todos os direitos reservados"
  }
};

// ── Persistência ──
function saveData() {
  try { localStorage.setItem("portfolio_data_v2", JSON.stringify(PORTFOLIO_DATA)); } catch(e) {}
}
function loadData() {
  try {
    const saved = localStorage.getItem("portfolio_data_v2");
    if (saved) {
      const p = JSON.parse(saved);
      // Deep merge apenas nos campos existentes
      ["meta","identity","theme","nav","sections","contact","footer"].forEach(function(k) {
        if (p[k]) Object.assign(PORTFOLIO_DATA[k], p[k]);
      });
      if (p.highlights) PORTFOLIO_DATA.highlights = p.highlights;
      if (p.education)  PORTFOLIO_DATA.education  = p.education;
      if (p.activities) PORTFOLIO_DATA.activities = p.activities;
    }
  } catch(e) { console.warn("Erro ao carregar dados:", e); }
}
loadData();
if (typeof window !== "undefined") {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
