-- ============================================================
-- FatureAqui — Migration: Clients Table
-- ============================================================

-- CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nuit TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  notes TEXT,
  total_invoiced DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users can manage clients for their company" ON public.clients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = clients.company_id AND user_id = auth.uid())
);

-- INDEX for faster queries
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON public.clients(company_id);
CREATE INDEX IF NOT EXISTS idx_clients_nuit ON public.clients(nuit);
