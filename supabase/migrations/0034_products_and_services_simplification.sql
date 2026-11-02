-- ============================================================
-- FatureAqui — Migration: Products & Services Simplification
-- ============================================================

-- Add unit to document_items if not exists
ALTER TABLE public.document_items
ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'un';

-- Add default_quantity to products if not exists
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS default_quantity DECIMAL(10, 2) DEFAULT 1;
