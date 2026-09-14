-- ============================================================
-- FatureAqui — Migration: ERP Phase 1 (Products & Suppliers)
-- ============================================================

-- 1. SUPPLIERS
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nuit TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  country TEXT DEFAULT 'Moçambique',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'produto', -- 'produto' or 'servico'
  unit_of_measure TEXT DEFAULT 'un',
  has_variants BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  tax_rate DECIMAL(5,2) DEFAULT 16.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT,
  barcode TEXT,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(12, 2),
  attributes JSONB DEFAULT '{}'::jsonb, -- e.g. {"color": "Red", "size": "M"}
  is_active BOOLEAN NOT NULL DEFAULT true,
  min_stock_level INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Suppliers
CREATE POLICY "Users can manage suppliers for their company" ON public.suppliers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = suppliers.company_id AND user_id = auth.uid())
);

-- Product Categories
CREATE POLICY "Users can manage categories for their company" ON public.product_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = product_categories.company_id AND user_id = auth.uid())
);

-- Products
CREATE POLICY "Users can manage products for their company" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = products.company_id AND user_id = auth.uid())
);

-- Product Variants
CREATE POLICY "Users can manage variants for their company" ON public.product_variants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.companies c ON p.company_id = c.id
    WHERE p.id = product_variants.product_id AND c.user_id = auth.uid()
  )
);
