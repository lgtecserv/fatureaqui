-- Adiciona o campo de estilo do carimbo à tabela de empresas
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS stamp_style TEXT DEFAULT 'style1';
