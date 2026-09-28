// ═══════════════════════════════════════════════════════════════════
//  DAIANE ROSANA — SUPABASE CLIENT (OTIMIZADO PARA CONSUMO MÍNIMO)
//  - Sem polling (zero chamadas automáticas em loop)
//  - Sem Realtime (zero consumo de websockets/mensagens)
//  - Cache inteligente no navegador (reduz requisições ao banco)
//  - Uma única consulta pontual por sessão
// ═══════════════════════════════════════════════════════════════════

const SUPABASE_CONFIG = {
  url: "https://hiajsyehskhqylvpynxn.supabase.co",
  // A chave anon pública pode ser definida aqui ou configurada pelo Painel Admin
  anonKey: ""
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

// ── Carregar do Supabase com Cache ──
async function loadFromSupabase(forceRefresh) {
  var client = getSupabaseClient();
  if (!client) return null;

  // Cache de 5 minutos no sessionStorage para evitar requisições a cada F5 do mesmo usuário
  var cacheKey = "portfolio_supabase_cache_time";
  var lastFetch = sessionStorage.getItem(cacheKey);
  var now = Date.now();
  
  if (!forceRefresh && lastFetch && (now - parseInt(lastFetch, 10)) < 300000) {
    // Menos de 5 minutos da última busca, usa o cache local
    return null;
  }

  try {
    var response = await client
      .from("portfolio_config")
      .select("data")
      .eq("id", "daiane")
      .maybeSingle();

    if (response.error) {
      console.warn("[Supabase] Aviso ao buscar dados:", response.error.message);
      return null;
    }

    if (response.data && response.data.data && typeof response.data.data === "object") {
      sessionStorage.setItem(cacheKey, String(now));
      return response.data.data;
    }
  } catch (err) {
    console.warn("[Supabase] Erro de rede:", err);
  }
  return null;
}

// ── Salvar no Supabase (Apenas sob demanda do Admin) ──
async function saveToSupabase(portfolioData) {
  var client = getSupabaseClient();
  if (!client) {
    throw new Error("Chave do Supabase (anon key) não configurada.");
  }

  var response = await client
    .from("portfolio_config")
    .upsert({
      id: "daiane",
      data: portfolioData,
      updated_at: new Date().toISOString()
    });

  if (response.error) {
    throw new Error(response.error.message);
  }

  // Invalida cache local
  sessionStorage.removeItem("portfolio_supabase_cache_time");
  return true;
}

if (typeof window !== "undefined") {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.getSupabaseClient = getSupabaseClient;
  window.loadFromSupabase = loadFromSupabase;
  window.saveToSupabase = saveToSupabase;
}
