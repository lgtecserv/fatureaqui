-- Adicionar coluna 'notes' à tabela de subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS notes TEXT;
