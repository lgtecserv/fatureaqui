-- ============================================================
-- FatureAqui — Migration: ERP Phase 2.5 (Stock Reservations & Purchase Processing)
-- ============================================================

-- 1. ADD RESERVED QUANTITY TO STOCK INVENTORY
ALTER TABLE public.stock_inventory
ADD COLUMN IF NOT EXISTS reserved_quantity DECIMAL(12, 2) NOT NULL DEFAULT 0;

-- 2. STORED PROCEDURE: PROCESS PURCHASE ORDER
-- This function will update stock and insert stock movements when a purchase order is received.
CREATE OR REPLACE FUNCTION process_purchase_order_receipt(
  p_purchase_order_id UUID
) RETURNS void AS $$
DECLARE
  v_company_id UUID;
  v_destination_warehouse_id UUID;
  v_item RECORD;
  v_current_stock DECIMAL;
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
    INSERT INTO public.stock_inventory (company_id, warehouse_id, variant_id, quantity)
    VALUES (v_company_id, v_destination_warehouse_id, v_item.variant_id, v_item.quantity)
    ON CONFLICT (warehouse_id, variant_id)
    DO UPDATE SET 
      quantity = stock_inventory.quantity + EXCLUDED.quantity,
      last_updated_at = NOW();

    -- Record Stock Movement
    INSERT INTO public.stock_movements (
      company_id, variant_id, from_warehouse_id, to_warehouse_id, type, quantity, reference_doc_type, reference_doc_id
    ) VALUES (
      v_company_id, v_item.variant_id, NULL, v_destination_warehouse_id, 'IN', v_item.quantity, 'purchase_order', p_purchase_order_id
    );

    -- Update received quantity on PO Item
    UPDATE public.purchase_order_items
    SET received_quantity = quantity
    WHERE id = v_item.id;

  END LOOP;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
