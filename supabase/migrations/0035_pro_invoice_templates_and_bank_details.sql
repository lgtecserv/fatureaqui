-- Migration 0035: Pro Invoice Templates and Bank Details
-- Adds support for multiple invoice templates, custom units, and banking details

-- 1. Ensure products has default_quantity
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS default_quantity DECIMAL(10, 2) DEFAULT 1;

-- 2. Ensure document_items has unit
ALTER TABLE public.document_items ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'un';

-- 3. Add invoice_template and bank details to companies
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS invoice_template TEXT DEFAULT 'classic';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS bank_account TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS bank_iban TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS bank_holder TEXT;

-- Comments
COMMENT ON COLUMN public.companies.invoice_template IS 'Selected invoice template layout: classic (wave), corporate, modern, geometric, boutique';
COMMENT ON COLUMN public.companies.bank_name IS 'Primary bank name for invoice payment instructions';
COMMENT ON COLUMN public.companies.bank_account IS 'Account number for invoice payment instructions';
COMMENT ON COLUMN public.companies.bank_iban IS 'IBAN or NIB for invoice payment instructions';
