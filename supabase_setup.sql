-- ═══════════════════════════════════════════════════════════
-- DAIANE ROSANA PORTFÓLIO — SUPABASE CONFIGURAÇÃO INICIAL
-- Execute este script no SQL Editor do painel Supabase
-- ═══════════════════════════════════════════════════════════

-- 1. Criação da tabela otimizada com JSONB (1 linha para todo o portfólio)
-- Isso garante consumo MÍNIMO de banco de dados e egress no plano gratuito.
CREATE TABLE IF NOT EXISTS public.portfolio_config (
  id TEXT PRIMARY KEY DEFAULT 'daiane',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitação de Segurança por Nível de Linha (RLS)
ALTER TABLE public.portfolio_config ENABLE ROW LEVEL SECURITY;

-- 3. Política de Leitura Pública (Qualquer visitante pode visualizar o portfólio)
DROP POLICY IF EXISTS "Permitir leitura publica" ON public.portfolio_config;
CREATE POLICY "Permitir leitura publica"
ON public.portfolio_config
FOR SELECT
TO public
USING (true);

-- 4. Política de Atualização (Permite salvar alterações feitas pelo painel admin)
DROP POLICY IF EXISTS "Permitir atualizacao" ON public.portfolio_config;
CREATE POLICY "Permitir atualizacao"
ON public.portfolio_config
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 5. Inserir registro inicial caso não exista
INSERT INTO public.portfolio_config (id, data)
VALUES (
  'daiane',
  '{"status": "initialized"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
