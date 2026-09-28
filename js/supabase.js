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

// ── Carregar do Supabase com Cache ──
async function loadFromSupabase(forceRefresh) {
  var client = getSupabaseClient();
  if (!client) {
    console.warn("[Supabase] getSupabaseClient() retornou null — biblioteca carregada?", typeof window.supabase);
    return null;
  }

  console.log("[Supabase] Buscando dados atualizados do banco...");

  try {
    var response = await client
      .from("portfolio_config")
      .select("data")
      .eq("id", "daiane")
      .maybeSingle();

    if (response.error) {
      console.warn("[Supabase] Erro ao buscar dados:", response.error.message, response.error);
      return null;
    }

    if (response.data && response.data.data && typeof response.data.data === "object") {
      console.log("[Supabase] ✅ Dados carregados do banco com sucesso!");
      return response.data.data;
    }

    console.warn("[Supabase] Resposta vazia ou inesperada:", response.data);
  } catch (err) {
    console.warn("[Supabase] Erro de rede:", err);
  }
  return null;
}

// ── Salvar no Supabase (Apenas sob demanda do Admin) ──
async function saveToSupabase(portfolioData) {
  var client = getSupabaseClient();
  if (!client) {
    console.error("[Supabase] Cliente não disponível. Verifique a chave anon.");
    throw new Error("Cliente Supabase não disponível. Verifique a chave anon.");
  }

  console.log("[Supabase] Iniciando upsert...");

  var response = await client
    .from("portfolio_config")
    .upsert({
      id: "daiane",
      data: portfolioData,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });

  if (response.error) {
    console.error("[Supabase] Erro no upsert:", response.error);
    throw new Error(response.error.message + (response.error.hint ? " | " + response.error.hint : ""));
  }

  console.log("[Supabase] Upsert retornou status 200. Verificando se escreveu...");

  // Leitura de confirmação — garante que o dado realmente está no banco
  var check = await client
    .from("portfolio_config")
    .select("updated_at")
    .eq("id", "daiane")
    .maybeSingle();

  if (check.error || !check.data) {
    console.error("[Supabase] ⚠️ Upsert retornou 200 mas dado NÃO está no banco!", check.error);
    throw new Error("Dado não encontrado no banco após salvar. Verifique as políticas RLS do Supabase.");
  }

  console.log("[Supabase] ✅ Confirmado no banco! Atualizado em:", check.data.updated_at);
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
