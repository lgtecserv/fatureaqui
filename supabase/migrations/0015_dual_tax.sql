-- Migration for Dual Tax Logic (IVA and ISPC)
-- Allowing a document to have both IVA and ISPC applied globally on the taxable base.

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS has_iva BOOLEAN DEFAULT true;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS has_ispc BOOLEAN DEFAULT false;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS iva_rate DECIMAL(5, 2) DEFAULT 16;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS ispc_rate DECIMAL(5, 2) DEFAULT 3;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS total_ispc DECIMAL(12, 2) DEFAULT 0;
