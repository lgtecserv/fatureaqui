-- ============================================================
-- FatureAqui — Migration: ERP Phase 4 (Batches & Warehouses)
-- ============================================================

-- 1. MODIFY WAREHOUSES
ALTER TABLE public.warehouses
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'armazem' CHECK (type IN ('armazem', 'loja'));

-- 2. CREATE PRODUCT BATCHES
CREATE TABLE IF NOT EXISTS public.product_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  batch_number TEXT NOT NULL,
  manufacture_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(variant_id, batch_number)
);

-- ENABLE RLS FOR BATCHES
ALTER TABLE public.product_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage product batches for their company" ON public.product_batches FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = product_batches.company_id AND user_id = auth.uid())
);

-- 3. MODIFY STOCK INVENTORY
ALTER TABLE public.stock_inventory
ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES public.product_batches(id) ON DELETE CASCADE;

-- Drop the old unique constraint (requires knowing its name, usually stock_inventory_warehouse_id_variant_id_key)
ALTER TABLE public.stock_inventory DROP CONSTRAINT IF EXISTS stock_inventory_warehouse_id_variant_id_key;

-- Add partial unique indexes to simulate UNIQUE(warehouse_id, variant_id, batch_id) treating NULLs as a single value
CREATE UNIQUE INDEX IF NOT EXISTS stock_inventory_with_batch_idx ON public.stock_inventory (warehouse_id, variant_id, batch_id) WHERE batch_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS stock_inventory_no_batch_idx ON public.stock_inventory (warehouse_id, variant_id) WHERE batch_id IS NULL;


-- 4. MODIFY STOCK MOVEMENTS
ALTER TABLE public.stock_movements
ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES public.product_batches(id) ON DELETE SET NULL;


-- 5. MODIFY ORDER ITEMS
ALTER TABLE public.purchase_order_items
ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES public.product_batches(id) ON DELETE SET NULL;

ALTER TABLE public.document_items
ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES public.product_batches(id) ON DELETE SET NULL;


-- 6. UPDATE RPC process_purchase_order_receipt
CREATE OR REPLACE FUNCTION process_purchase_order_receipt(
  p_purchase_order_id UUID
) RETURNS void AS $$
DECLARE
  v_company_id UUID;
  v_destination_warehouse_id UUID;
  v_item RECORD;
BEGIN
  -- Get Purchase Order details
  SELECT company_id, destination_warehouse_id INTO v_company_id, v_destination_warehouse_id
  FROM public.purchase_orders
  WHERE id = p_purchase_order_id AND status = 'draft';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Purchase order not found or already processed.';
  END IF;

  IF v_destination_warehouse_id IS NULL THEN
    RAISE EXCEPTION 'Destination warehouse is required to receive stock.';
  END IF;

  -- Update Purchase Order status
  UPDATE public.purchase_orders
  SET status = 'received', updated_at = NOW()
  WHERE id = p_purchase_order_id;

  -- Loop through items and update stock
  FOR v_item IN (SELECT * FROM public.purchase_order_items WHERE purchase_order_id = p_purchase_order_id) LOOP
    
    -- Insert or Update Stock Inventory
    IF v_item.batch_id IS NULL THEN
        INSERT INTO public.stock_inventory (company_id, warehouse_id, variant_id, batch_id, quantity)
        VALUES (v_company_id, v_destination_warehouse_id, v_item.variant_id, NULL, v_item.quantity)
        ON CONFLICT (warehouse_id, variant_id) WHERE batch_id IS NULL
        DO UPDATE SET quantity = stock_inventory.quantity + EXCLUDED.quantity, last_updated_at = NOW();
    ELSE
        INSERT INTO public.stock_inventory (company_id, warehouse_id, variant_id, batch_id, quantity)
        VALUES (v_company_id, v_destination_warehouse_id, v_item.variant_id, v_item.batch_id, v_item.quantity)
        ON CONFLICT (warehouse_id, variant_id, batch_id) WHERE batch_id IS NOT NULL
        DO UPDATE SET quantity = stock_inventory.quantity + EXCLUDED.quantity, last_updated_at = NOW();
    END IF;

    -- Record Stock Movement
    INSERT INTO public.stock_movements (
      company_id, variant_id, batch_id, from_warehouse_id, to_warehouse_id, type, quantity, reference_doc_type, reference_doc_id
    ) VALUES (
      v_company_id, v_item.variant_id, v_item.batch_id, NULL, v_destination_warehouse_id, 'IN', v_item.quantity, 'purchase_order', p_purchase_order_id
    );

    -- Update received quantity on PO Item
    UPDATE public.purchase_order_items
    SET received_quantity = quantity
    WHERE id = v_item.id;

  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. UPDATE RPC process_invoice_stock (FIFO logic for batches)
CREATE OR REPLACE FUNCTION process_invoice_stock(
  p_document_id UUID
) RETURNS void AS $$
DECLARE
  v_company_id UUID;
  v_warehouse_id UUID;
  v_status TEXT;
  v_doc_type TEXT;
  v_item RECORD;
  v_qty_to_deduct DECIMAL;
  v_batch_record RECORD;
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

  IF v_warehouse_id IS NOT NULL THEN
    FOR v_item IN (
      SELECT * FROM public.document_items 
      WHERE document_id = p_document_id AND type = 'produto' AND variant_id IS NOT NULL
    ) LOOP
      
      v_qty_to_deduct := v_item.quantity;

      -- If item has specific batch, deduct from that batch directly
      IF v_item.batch_id IS NOT NULL THEN
        UPDATE public.stock_inventory 
        SET quantity = quantity - v_qty_to_deduct, last_updated_at = NOW()
        WHERE warehouse_id = v_warehouse_id AND variant_id = v_item.variant_id AND batch_id = v_item.batch_id;

        IF NOT FOUND THEN
          INSERT INTO public.stock_inventory (company_id, warehouse_id, variant_id, batch_id, quantity)
          VALUES (v_company_id, v_warehouse_id, v_item.variant_id, v_item.batch_id, -v_qty_to_deduct);
        END IF;

        INSERT INTO public.stock_movements (
          company_id, variant_id, batch_id, from_warehouse_id, to_warehouse_id, type, quantity, reference_doc_type, reference_doc_id
        ) VALUES (
          v_company_id, v_item.variant_id, v_item.batch_id, v_warehouse_id, NULL, 'OUT', v_qty_to_deduct, 'invoice', p_document_id
        );
      ELSE
        -- FIFO Deduction: Loop through available batches ordered by expiry_date or created_at
        FOR v_batch_record IN (
          SELECT si.*, pb.expiry_date 
          FROM public.stock_inventory si
          LEFT JOIN public.product_batches pb ON si.batch_id = pb.id
          WHERE si.warehouse_id = v_warehouse_id AND si.variant_id = v_item.variant_id AND si.quantity > 0
          ORDER BY pb.expiry_date ASC NULLS LAST, si.last_updated_at ASC
        ) LOOP
          IF v_qty_to_deduct <= 0 THEN
            EXIT;
          END IF;

          DECLARE
            v_deducted DECIMAL;
          BEGIN
            IF v_batch_record.quantity >= v_qty_to_deduct THEN
              v_deducted := v_qty_to_deduct;
            ELSE
              v_deducted := v_batch_record.quantity;
            END IF;

            -- Deduct from this batch
            IF v_batch_record.batch_id IS NULL THEN
                UPDATE public.stock_inventory SET quantity = quantity - v_deducted, last_updated_at = NOW()
                WHERE warehouse_id = v_warehouse_id AND variant_id = v_item.variant_id AND batch_id IS NULL;
            ELSE
                UPDATE public.stock_inventory SET quantity = quantity - v_deducted, last_updated_at = NOW()
                WHERE warehouse_id = v_warehouse_id AND variant_id = v_item.variant_id AND batch_id = v_batch_record.batch_id;
            END IF;

            -- Record Movement
            INSERT INTO public.stock_movements (
              company_id, variant_id, batch_id, from_warehouse_id, to_warehouse_id, type, quantity, reference_doc_type, reference_doc_id
            ) VALUES (
              v_company_id, v_item.variant_id, v_batch_record.batch_id, v_warehouse_id, NULL, 'OUT', v_deducted, 'invoice', p_document_id
            );

            v_qty_to_deduct := v_qty_to_deduct - v_deducted;
          END;
        END LOOP;

        -- If still qty left (sold more than we have in positive stock), just deduct from generic stock (batch_id = NULL)
        IF v_qty_to_deduct > 0 THEN
          UPDATE public.stock_inventory SET quantity = quantity - v_qty_to_deduct, last_updated_at = NOW()
          WHERE warehouse_id = v_warehouse_id AND variant_id = v_item.variant_id AND batch_id IS NULL;

          IF NOT FOUND THEN
            INSERT INTO public.stock_inventory (company_id, warehouse_id, variant_id, batch_id, quantity)
            VALUES (v_company_id, v_warehouse_id, v_item.variant_id, NULL, -v_qty_to_deduct);
          END IF;

          INSERT INTO public.stock_movements (
            company_id, variant_id, batch_id, from_warehouse_id, to_warehouse_id, type, quantity, reference_doc_type, reference_doc_id
          ) VALUES (
            v_company_id, v_item.variant_id, NULL, v_warehouse_id, NULL, 'OUT', v_qty_to_deduct, 'invoice', p_document_id
          );
        END IF;
      END IF;

    END LOOP;
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
