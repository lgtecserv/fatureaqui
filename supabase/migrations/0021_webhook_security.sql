-- ============================================================
-- FatureAqui — Migration: Webhook Security Update
-- ============================================================

-- Atualizar a função TRIGGER para enviar o cabeçalho X-Internal-Secret
CREATE OR REPLACE FUNCTION notify_webhook_dispatcher()
RETURNS TRIGGER AS $$
DECLARE
  company_id_val UUID;
  internal_secret TEXT := 'fatureaqui_internal_secret_9f8b7c6d5e4f3a2b1'; -- Passaporte interno de segurança
BEGIN
  -- Determine company_id from record
  IF TG_OP = 'DELETE' THEN
    company_id_val := OLD.company_id;
  ELSE
    company_id_val := NEW.company_id;
  END IF;

  -- Fire asynchronous HTTP request using pg_net to our Edge Function
  -- Incluímos o cabeçalho X-Internal-Secret para provar à Edge Function que a chamada vem da Base de Dados
  PERFORM net.http_post(
    url := 'https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/webhook-dispatcher',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Internal-Secret', internal_secret
    ),
    body := json_build_object(
      'action', TG_OP,
      'table', TG_TABLE_NAME,
      'company_id', company_id_val,
      'record', (CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END)
    )::jsonb
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
