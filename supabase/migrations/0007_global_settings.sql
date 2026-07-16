-- Add Global Settings fields to system_settings table
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS app_name TEXT DEFAULT 'FatureAqui',
ADD COLUMN IF NOT EXISTS support_email TEXT DEFAULT 'suporte@fatureaqui.com',
ADD COLUMN IF NOT EXISTS support_phone TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS free_plan_docs_limit INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS default_tax_rate DECIMAL(5, 2) DEFAULT 16.00,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MZN',
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS privacy_url TEXT DEFAULT '';

-- Update the default row with initial data if needed
UPDATE public.system_settings 
SET app_name = 'FatureAqui'
WHERE id = '00000000-0000-0000-0000-000000000001' AND app_name IS NULL;
