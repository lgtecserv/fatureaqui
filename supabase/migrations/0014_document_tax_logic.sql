-- Adicionar tipo de imposto (tax_type) às tabelas de documentos
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS tax_type TEXT DEFAULT 'IVA';
ALTER TABLE public.document_items ADD COLUMN IF NOT EXISTS tax_type TEXT DEFAULT 'IVA';
