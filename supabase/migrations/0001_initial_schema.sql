-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  nuit TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Moçambique',
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  primary_color TEXT DEFAULT '#02664D',
  secondary_color TEXT DEFAULT '#1E2A38',
  signature_url TEXT,
  stamp_url TEXT,
  currency TEXT DEFAULT 'MZN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'free', -- free, pro
  status TEXT NOT NULL DEFAULT 'active', -- active, pending, rejected
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. DOCUMENT COUNTERS
CREATE TABLE public.document_counters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  year INTEGER NOT NULL,
  last_sequence INTEGER NOT NULL DEFAULT 0,
  UNIQUE(company_id, doc_type, year)
);

-- 4. DOCUMENTS
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  number TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'rascunho',
  date DATE NOT NULL,
  time TIME NOT NULL,
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_nuit TEXT,
  client_phone TEXT,
  client_email TEXT,
  client_address TEXT,
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_discount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_iva DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  observations TEXT,
  payment_terms TEXT,
  payment_method TEXT,
  amount_received DECIMAL(12, 2),
  change DECIMAL(12, 2),
  due_date DATE,
  payment_deadline DATE,
  expected_payment DATE,
  invoice_number TEXT,
  invoice_date DATE,
  amount_paid DECIMAL(12, 2),
  payment_date DATE,
  reference_invoice TEXT,
  reference_date DATE,
  reason TEXT,
  adjustment_value DECIMAL(12, 2),
  validity TEXT,
  delivery_deadline DATE,
  commercial_terms TEXT,
  origin TEXT,
  destination TEXT,
  driver TEXT,
  vehicle_plate TEXT,
  expected_delivery DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, type, sequence, year)
);

-- 5. DOCUMENT ITEMS
CREATE TABLE public.document_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'produto',
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  iva_rate DECIMAL(5, 2) NOT NULL DEFAULT 16,
  discount_type TEXT NOT NULL DEFAULT 'percentagem',
  discount_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
  line_total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_items ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES
-- Companies: user can only see/update their own
CREATE POLICY "Users can view their own company" ON public.companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own company" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own company" ON public.companies FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions: users can see their own, admin can see all
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'lgtecserv.com@gmail.com');
CREATE POLICY "Users can insert their own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'lgtecserv.com@gmail.com');
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR ALL USING (auth.jwt() ->> 'email' = 'lgtecserv.com@gmail.com');

-- Document Counters: based on company user_id
CREATE POLICY "Users can manage counters for their company" ON public.document_counters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = document_counters.company_id AND user_id = auth.uid())
);

-- Documents: based on company user_id
CREATE POLICY "Users can manage documents for their company" ON public.documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = documents.company_id AND user_id = auth.uid())
);

-- Document Items: based on document's company user_id
CREATE POLICY "Users can manage items for their company" ON public.document_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.companies c ON d.company_id = c.id
    WHERE d.id = document_items.document_id AND c.user_id = auth.uid()
  )
);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false) ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
-- Assets
CREATE POLICY "Assets are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'assets');
CREATE POLICY "Users can upload their own assets." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own assets." ON storage.objects FOR UPDATE USING (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own assets." ON storage.objects FOR DELETE USING (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Receipts
CREATE POLICY "Users can upload their own receipts." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins can view all receipts." ON storage.objects FOR SELECT USING (bucket_id = 'receipts' AND auth.jwt() ->> 'email' = 'lgtecserv.com@gmail.com');
