-- ============================================================
-- FatureAqui — Migration: ERP Phase 2 (Warehouses & Stock)
-- ============================================================

-- 1. WAREHOUSES
CREATE TABLE IF NOT EXISTS public.warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STOCK INVENTORY (Current balances)
CREATE TABLE IF NOT EXISTS public.stock_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity DECIMAL(12, 2) NOT NULL DEFAULT 0,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(warehouse_id, variant_id)
);

-- 3. STOCK MOVEMENTS (History of all changes)
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  from_warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL, -- Null if supplier receipt
  to_warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL, -- Null if sale/loss
  type TEXT NOT NULL, -- 'IN' (purchase), 'OUT' (sale), 'TRANSFER', 'ADJUSTMENT'
  quantity DECIMAL(12, 2) NOT NULL,
  reference_doc_type TEXT, -- e.g., 'invoice', 'purchase_order', 'manual'
  reference_doc_id UUID, -- links to document.id or purchase_order.id
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PURCHASE ORDERS (Notas de Encomenda / Compras a fornecedores)
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  destination_warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sent', 'received', 'cancelled'
  order_number TEXT,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PURCHASE ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  quantity DECIMAL(12, 2) NOT NULL,
  received_quantity DECIMAL(12, 2) NOT NULL DEFAULT 0,
  unit_cost DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Warehouses
CREATE POLICY "Users can manage warehouses for their company" ON public.warehouses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = warehouses.company_id AND user_id = auth.uid())
);

-- Stock Inventory
CREATE POLICY "Users can manage stock inventory for their company" ON public.stock_inventory FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = stock_inventory.company_id AND user_id = auth.uid())
);

-- Stock Movements
CREATE POLICY "Users can manage stock movements for their company" ON public.stock_movements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = stock_movements.company_id AND user_id = auth.uid())
);

-- Purchase Orders
CREATE POLICY "Users can manage purchase orders for their company" ON public.purchase_orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = purchase_orders.company_id AND user_id = auth.uid())
);

-- Purchase Order Items
CREATE POLICY "Users can manage purchase order items for their company" ON public.purchase_order_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.purchase_orders p
    JOIN public.companies c ON p.company_id = c.id
    WHERE p.id = purchase_order_items.purchase_order_id AND c.user_id = auth.uid()
  )
);
