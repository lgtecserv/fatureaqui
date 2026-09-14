-- ============================================================
-- FatureAqui — Migration: ERP Phase 3 (Sales & Stock Integration)
-- ============================================================

-- 1. ADD COLUMNS FOR WAREHOUSE AND VARIANT
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL;

ALTER TABLE public.document_items
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL;

-- 2. STORED PROCEDURE: PROCESS INVOICE STOCK
-- This function will deduct stock and insert stock movements when a document is emitted
CREATE OR REPLACE FUNCTION process_invoice_stock(
  p_document_id UUID
) RETURNS void AS $$
DECLARE
  v_company_id UUID;
  v_warehouse_id UUID;
  v_status TEXT;
  v_doc_type TEXT;
  v_item RECORD;
BEGIN
  -- Get Document details
  SELECT company_id, warehouse_id, status, type INTO v_company_id, v_warehouse_id, v_status, v_doc_type
  FROM public.documents
  WHERE id = p_document_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Document not found.';
  END IF;

  -- Only process stock for Invoices and Cash Sales that are emitted
  IF v_status != 'emitido' OR v_doc_type NOT IN ('FT', 'VD', 'FR') THEN
    RETURN;
  END IF;

  -- If no warehouse was selected but we have products, we can't deduct stock
  -- We'll allow it to pass but it won't affect stock if warehouse is null

  IF v_warehouse_id IS NOT NULL THEN
    -- Loop through items and update stock for 'produto' type
    FOR v_item IN (
      SELECT * FROM public.document_items 
      WHERE document_id = p_document_id AND type = 'produto' AND variant_id IS NOT NULL
    ) LOOP
      
      -- Update Stock Inventory (Allow negative for flexibility)
      INSERT INTO public.stock_inventory (company_id, warehouse_id, variant_id, quantity)
      VALUES (v_company_id, v_warehouse_id, v_item.variant_id, -v_item.quantity)
      ON CONFLICT (warehouse_id, variant_id)
      DO UPDATE SET 
        quantity = stock_inventory.quantity - EXCLUDED.quantity,
        last_updated_at = NOW();

      -- Record Stock Movement
      INSERT INTO public.stock_movements (
        company_id, variant_id, from_warehouse_id, to_warehouse_id, type, quantity, reference_doc_type, reference_doc_id
      ) VALUES (
        v_company_id, v_item.variant_id, v_warehouse_id, NULL, 'OUT', v_item.quantity, 'invoice', p_document_id
      );

    END LOOP;
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
