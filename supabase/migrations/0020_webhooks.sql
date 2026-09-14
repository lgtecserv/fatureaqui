-- ============================================================
-- FatureAqui — Migration: Webhooks
-- ============================================================

-- EXTENSION: Ativar pg_net se não estiver ativa
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Tabela WEBHOOKS
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  secret TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users can manage webhooks for their company" ON public.webhooks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companies WHERE id = webhooks.company_id AND user_id = auth.uid())
);

-- INDEX for faster queries
CREATE INDEX IF NOT EXISTS idx_webhooks_company_id ON public.webhooks(company_id);

-- TRIGGER FUNCTION to dispatch webhook to Edge Function
CREATE OR REPLACE FUNCTION notify_webhook_dispatcher()
RETURNS TRIGGER AS $$
DECLARE
  company_id_val UUID;
BEGIN
  -- Determine company_id from record
  IF TG_OP = 'DELETE' THEN
    company_id_val := OLD.company_id;
  ELSE
    company_id_val := NEW.company_id;
  END IF;

  -- Fire asynchronous HTTP request using pg_net to our Edge Function
  -- Note: Supabase edge functions URL starts with 'https://[PROJECT_REF].supabase.co/functions/v1/'
  -- We pass the company_id, event type and record. The Edge Function will query the webhooks table and send the actual payload.
  PERFORM net.http_post(
    url := 'https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/webhook-dispatcher',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'action', TG_OP,
      'table', TG_TABLE_NAME,
      'company_id', company_id_val,
      'record', (CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END)
    )::jsonb
  );
  
  RETURN NULL; -- AFTER triggers can return NULL
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- GATILHOS
CREATE TRIGGER on_document_changed
  AFTER INSERT OR UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_webhook_dispatcher();

CREATE TRIGGER on_client_changed
  AFTER INSERT OR UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION notify_webhook_dispatcher();
