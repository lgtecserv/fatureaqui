-- ============================================================
-- FatureAqui — Migration: Security Hardening Phase 2
-- ============================================================

-- 1. STORAGE LIMITS
-- Restrict assets and receipts to 3MB and only allow specific image/pdf types.
-- NOTE: In Supabase, bucket policies can be updated via the storage API or SQL.
-- If file_size_limit or allowed_mime_types columns do not exist (older Supabase instances), this might fail,
-- but standard Supabase instances support them.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'storage' AND table_name = 'buckets' AND column_name = 'file_size_limit') THEN
    UPDATE storage.buckets 
    SET file_size_limit = 3145728, -- 3MB
        allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf']
    WHERE id IN ('assets', 'receipts');
  END IF;
END $$;


-- 2. DOCUMENT IMMUTABILITY
-- Prevent users from tampering with documents that have already been emitted.
-- Exception: Changing status to 'cancelado' is allowed.
CREATE OR REPLACE FUNCTION prevent_emitted_document_tampering()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN := false;
BEGIN
  -- Admins can bypass (if needed for support fixes)
  IF auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com') THEN
    is_admin := true;
  END IF;

  IF NOT is_admin THEN
    -- If the old document was emitted or canceled
    IF OLD.status IN ('emitido', 'cancelado') THEN
      
      -- If they are just canceling an emitted invoice, we must ensure they didn't alter critical values
      IF OLD.status = 'emitido' AND NEW.status = 'cancelado' THEN
        IF NEW.total != OLD.total OR NEW.subtotal != OLD.subtotal OR NEW.client_name != OLD.client_name THEN
           RAISE EXCEPTION 'Fraude Detetada: Não pode alterar os valores financeiros nem o cliente de uma fatura emitida. Apenas a pode cancelar.';
        END IF;
      ELSE
        -- Any other update to an emitted or canceled document is blocked
        RAISE EXCEPTION 'Conformidade: Documentos emitidos ou cancelados são finais e não podem ser alterados.';
      END IF;

    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_prevent_emitted_document_tampering ON public.documents;
CREATE TRIGGER tr_prevent_emitted_document_tampering
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION prevent_emitted_document_tampering();


-- 3. LOCK DOWN NOTIFICATIONS
-- Drop the permissive insert policy and restrict to admin or server triggers
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;

-- We don't recreate a public insert policy because notifications should be inserted 
-- automatically by Postgres Triggers (which run with SECURITY DEFINER) or by the Admin.
CREATE POLICY "Admins can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com'));
