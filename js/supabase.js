// ═══════════════════════════════════════════════════════════════════
//  DAIANE ROSANA — SUPABASE CLIENT (OTIMIZADO PARA CONSUMO MÍNIMO)
//  - Sem polling (zero chamadas automáticas em loop)
//  - Sem Realtime (zero consumo de websockets/mensagens)
//  - Cache inteligente no navegador (reduz requisições ao banco)
//  - Uma única consulta pontual por sessão
// ═══════════════════════════════════════════════════════════════════

const SUPABASE_CONFIG = {
  url: "https://hiajsyehskhqylvpynxn.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpYWpzeWVoc2tocXlsdnB5bnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTA5NTUsImV4cCI6MjEwNjE4Njk1NX0.GrzGKOXkt9D0EHCcXmkYEyvcCEAuNyfZXfOsPc7pB3c"
};

var _supabaseClient = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;

  var key = SUPABASE_CONFIG.anonKey || localStorage.getItem("supabase_anon_key");
  if (!key || !SUPABASE_CONFIG.url || typeof window.supabase === "undefined") {
    return null;
  }

  try {
    _supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, key, {
      auth: { persistSession: false },
      realtime: { enabled: false } // Desativa conexões realtime desnecessárias
    });
    return _supabaseClient;
  } catch (e) {
    console.warn("[Supabase] Erro ao instanciar cliente:", e);
    return null;
  }
}

// ── Constantes de Cache ──
var CACHE_DATA_KEY       = "portfolio_cache_data_v1";
var CACHE_UPDATED_AT_KEY = "portfolio_cache_updated_at";
var CACHE_LAST_CHECK_KEY = "portfolio_cache_last_check";
var CACHE_TTL_MS         = 15 * 60 * 1000; // 15 minutos sem bater no Supabase

// ── Carregar do Supabase com Cache Inteligente (Economia de 99% de Egress/Logs) ──
async function loadFromSupabase(forceRefresh) {
  var client = getSupabaseClient();
  if (!client) {
    return getLocalCacheData();
  }

  var now = Date.now();
  var lastCheck = parseInt(localStorage.getItem(CACHE_LAST_CHECK_KEY) || "0", 10);
  var cachedData = getLocalCacheData();
  var cachedUpdatedAt = localStorage.getItem(CACHE_UPDATED_AT_KEY);

  // 1. Se o cache for recente (< 15 min) e temos dados locais, NÃO faz requisição
  if (!forceRefresh && cachedData && (now - lastCheck) < CACHE_TTL_MS) {
    var remainingMin = Math.round((CACHE_TTL_MS - (now - lastCheck)) / 60000);
    console.log("[Supabase] ⚡ Cache local ativo (" + remainingMin + " min restantes). Zero requisições.");
    return cachedData;
  }

  console.log("[Supabase] Verificando versão dos dados...");

  try {
    // 2. Consulta ultraleve: busca APENAS o 'updated_at' (~40 bytes vs 128KB do JSON completo)
    var checkRes = await client
      .from("portfolio_config")
      .select("updated_at")
      .eq("id", "daiane")
      .maybeSingle();

    if (checkRes.error) {
      console.warn("[Supabase] Aviso ao checar versão:", checkRes.error.message);
      return cachedData;
    }

    if (!checkRes.data) {
      return cachedData;
    }

    var serverUpdatedAt = checkRes.data.updated_at;

    // 3. Se a data de modificação for idêntica ao cache, renova TTL e NÃO baixa o JSON pesado
    if (cachedData && cachedUpdatedAt && cachedUpdatedAt === serverUpdatedAt) {
      console.log("[Supabase] ✅ Dados inalterados no banco. Reutilizando cache local (0 bytes de egress).");
      localStorage.setItem(CACHE_LAST_CHECK_KEY, String(now));
      return cachedData;
    }

    // 4. Houve alteração no banco (ou primeira visita): baixa os dados completos
    console.log("[Supabase] 🔄 Nova versão detectada! Baixando dados atualizados...");
    var response = await client
      .from("portfolio_config")
      .select("data, updated_at")
      .eq("id", "daiane")
      .maybeSingle();

    if (response.error) {
      console.warn("[Supabase] Erro ao baixar dados:", response.error.message);
      return cachedData;
    }

    if (response.data && response.data.data && typeof response.data.data === "object") {
      var freshData = response.data.data;
      saveLocalCache(freshData, response.data.updated_at || serverUpdatedAt);
      console.log("[Supabase] ✅ Dados atualizados e armazenados em cache local com sucesso!");
      return freshData;
    }
  } catch (err) {
    console.warn("[Supabase] Erro de conexão:", err);
  }

  return cachedData;
}

function getLocalCacheData() {
  try {
    var raw = localStorage.getItem(CACHE_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveLocalCache(data, updatedAt) {
  try {
    localStorage.setItem(CACHE_DATA_KEY, JSON.stringify(data));
    if (updatedAt) localStorage.setItem(CACHE_UPDATED_AT_KEY, updatedAt);
    localStorage.setItem(CACHE_LAST_CHECK_KEY, String(Date.now()));
  } catch (e) {}
}

// ── Salvar no Supabase (Apenas sob demanda do Admin) ──
async function saveToSupabase(portfolioData) {
  var client = getSupabaseClient();
  if (!client) {
    console.error("[Supabase] Cliente não disponível. Verifique a chave anon.");
    throw new Error("Cliente Supabase não disponível. Verifique a chave anon.");
  }

  console.log("[Supabase] Iniciando upsert...");
  var nowIso = new Date().toISOString();

  var response = await client
    .from("portfolio_config")
    .upsert({
      id: "daiane",
      data: portfolioData,
      updated_at: nowIso
    }, { onConflict: "id" });

  if (response.error) {
    console.error("[Supabase] Erro no upsert:", response.error);
    throw new Error(response.error.message + (response.error.hint ? " | " + response.error.hint : ""));
  }

  // Atualiza cache local imediatamente para que a visualização seja instantânea
  saveLocalCache(portfolioData, nowIso);
  console.log("[Supabase] ✅ Salvo com sucesso e cache local atualizado!");
  return true;
}

// ── Diagnóstico: verificar se o dado foi salvo no Supabase ──
async function checkSupabaseData() {
  var client = getSupabaseClient();
  if (!client) { console.warn("[Diagnóstico] Cliente não disponível."); return null; }
  var res = await client.from("portfolio_config").select("updated_at, data").eq("id", "daiane").maybeSingle();
  if (res.error) { console.error("[Diagnóstico] Erro:", res.error); return null; }
  console.log("[Diagnóstico] Dado no Supabase — atualizado em:", res.data && res.data.updated_at);
  console.log("[Diagnóstico] Conteúdo:", res.data && res.data.data);
  return res.data;
}

if (typeof window !== "undefined") {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.getSupabaseClient = getSupabaseClient;
  window.loadFromSupabase = loadFromSupabase;
  window.saveToSupabase = saveToSupabase;
  window.checkSupabaseData = checkSupabaseData;
}
