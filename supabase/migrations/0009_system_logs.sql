-- Create system_logs table
CREATE TABLE public.system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID, -- Pode ser null se a ação não estiver diretamente ligada a um utilziador, ou se não for fácil extrair no trigger
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for system_logs
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Apenas os admins podem VER os logs. Ninguém pode INSERIR manualmente, apenas os Triggers geram logs.
CREATE POLICY "Admins can view system logs" ON public.system_logs FOR SELECT USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');


-- -------------------------------------------------------------
-- TRIGGER 1: Novas empresas registadas
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_new_company()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.system_logs (event_type, description, user_id)
  VALUES (
    'company_registered', 
    'Nova empresa registada: ' || NEW.name || ' (' || NEW.email || ')',
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_company_created
  AFTER INSERT ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION log_new_company();


-- -------------------------------------------------------------
-- TRIGGER 2: Pedidos de Subscrição / Aprovações
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_subscription_change()
RETURNS TRIGGER AS $$
DECLARE
  company_name TEXT;
BEGIN
  -- Tenta obter o nome da empresa
  SELECT name INTO company_name FROM public.companies WHERE user_id = NEW.user_id;
  IF company_name IS NULL THEN
    company_name := 'Empresa Desconhecida';
  END IF;

  -- Se for um novo pedido (INSERT) e o status for 'pendente'
  IF TG_OP = 'INSERT' AND NEW.status = 'pendente' THEN
    INSERT INTO public.system_logs (event_type, description, user_id)
    VALUES (
      'subscription_requested', 
      'Pedido de subscrição (Plano ' || NEW.plan_type || ') enviado por: ' || company_name,
      NEW.user_id
    );
  END IF;

  -- Se for uma atualização (UPDATE) de status
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'ativo' THEN
      INSERT INTO public.system_logs (event_type, description, user_id)
      VALUES (
        'subscription_approved', 
        'Subscrição Aprovada (Plano ' || NEW.plan_type || ') para a empresa: ' || company_name,
        NEW.user_id
      );
    ELSIF NEW.status = 'cancelado' THEN
      INSERT INTO public.system_logs (event_type, description, user_id)
      VALUES (
        'subscription_cancelled', 
        'Subscrição Cancelada/Expirada para a empresa: ' || company_name,
        NEW.user_id
      );
    ELSIF NEW.status = 'pendente' THEN
      INSERT INTO public.system_logs (event_type, description, user_id)
      VALUES (
        'subscription_requested', 
        'Novo pedido de subscrição (Renovação) (Plano ' || NEW.plan_type || ') enviado por: ' || company_name,
        NEW.user_id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION log_subscription_change();


-- -------------------------------------------------------------
-- TRIGGER 3: Alteração de Configurações Globais
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_settings_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.system_logs (event_type, description, user_id)
  VALUES (
    'settings_updated', 
    'As configurações globais do sistema foram alteradas pelo Super Admin.',
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_settings_updated
  AFTER UPDATE ON public.system_settings
  FOR EACH ROW
  -- Só regista se houve de facto alguma mudança nos valores (para evitar logs de atualizações vazias)
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION log_settings_change();
