-- ============================================================
-- FatureAqui — Migration: Security Hardening (Billing & Plans)
-- ============================================================

-- 1. SUBSCRIPTIONS SECURITY
-- Prevent users from giving themselves an active Pro plan or extending valid_until
CREATE OR REPLACE FUNCTION check_subscription_security()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN := false;
BEGIN
  -- Check if user is admin
  IF auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com') THEN
    is_admin := true;
  END IF;

  -- If the operation is done by a non-admin (e.g., normal user)
  IF NOT is_admin THEN
    
    -- Block modifications to valid_until
    IF TG_OP = 'UPDATE' AND NEW.valid_until IS DISTINCT FROM OLD.valid_until THEN
      RAISE EXCEPTION 'Acesso negado: utilizadores não podem alterar a validade (valid_until) da subscrição.';
    END IF;

    -- If inserting or updating to a PRO plan, status MUST be 'pendente' (cannot be 'ativo' or 'active')
    IF NEW.plan_type = 'pro' AND NEW.status IN ('ativo', 'active') THEN
      RAISE EXCEPTION 'Acesso negado: não pode ativar o plano Pro sem aprovação do administrador.';
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_prevent_subscription_tampering ON public.subscriptions;
CREATE TRIGGER tr_prevent_subscription_tampering
BEFORE INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION check_subscription_security();


-- 2. DOCUMENTS BILLING LIMITS ENFORCEMENT
-- Prevent users from inserting documents beyond their free plan limit or expired trial
CREATE OR REPLACE FUNCTION check_document_limits()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_company_created_at TIMESTAMPTZ;
  v_plan_type TEXT;
  v_sub_status TEXT;
  v_valid_until TIMESTAMPTZ;
  
  v_free_plan_docs_limit INT;
  v_trial_days INT;
  v_maintenance_mode BOOLEAN;
  
  v_days_since_reg INT;
  v_docs_this_month INT;
  v_start_of_month DATE;
  v_end_of_month DATE;
BEGIN
  -- Allow admins to bypass
  IF auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com') THEN
    RETURN NEW;
  END IF;

  -- Get user_id and company creation date
  SELECT user_id, created_at INTO v_user_id, v_company_created_at
  FROM public.companies WHERE id = NEW.company_id;

  -- Get system settings
  SELECT free_plan_docs_limit, trial_days, maintenance_mode
  INTO v_free_plan_docs_limit, v_trial_days, v_maintenance_mode
  FROM public.system_settings 
  WHERE id = '00000000-0000-0000-0000-000000000001';

  -- Check maintenance mode
  IF v_maintenance_mode THEN
    RAISE EXCEPTION 'O sistema encontra-se em manutenção.';
  END IF;

  -- Get subscription info
  SELECT plan_type, status, valid_until
  INTO v_plan_type, v_sub_status, v_valid_until
  FROM public.subscriptions WHERE user_id = v_user_id;

  -- Check if user has active PRO plan
  IF v_plan_type = 'pro' AND v_sub_status IN ('ativo', 'active') AND v_valid_until > NOW() THEN
    -- Pro users have unlimited access
    RETURN NEW;
  END IF;

  -- FREE PLAN LOGIC (or expired pro)
  
  -- 1. Check Trial Days
  v_days_since_reg := DATE_PART('day', NOW() - v_company_created_at);
  IF v_trial_days IS NULL THEN v_trial_days := 30; END IF;
  
  IF v_days_since_reg > v_trial_days THEN
    RAISE EXCEPTION 'O seu período de utilização gratuita expirou. Faça upgrade para o plano Pro.';
  END IF;

  -- 2. Check Document Limit
  v_start_of_month := date_trunc('month', NOW())::DATE;
  v_end_of_month := (date_trunc('month', NOW()) + interval '1 month' - interval '1 day')::DATE;

  SELECT COUNT(*) INTO v_docs_this_month
  FROM public.documents
  WHERE company_id = NEW.company_id
  AND date >= v_start_of_month AND date <= v_end_of_month;

  IF v_free_plan_docs_limit > 0 AND v_docs_this_month >= v_free_plan_docs_limit THEN
    RAISE EXCEPTION 'Atingiu o limite de % documentos gratuitos deste mês. Faça upgrade para o plano Pro.', v_free_plan_docs_limit;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_enforce_billing_limits ON public.documents;
CREATE TRIGGER tr_enforce_billing_limits
BEFORE INSERT ON public.documents
FOR EACH ROW EXECUTE FUNCTION check_document_limits();
