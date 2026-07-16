-- Add e-Mola fields to system_settings table
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS emola_number TEXT,
ADD COLUMN IF NOT EXISTS emola_name TEXT;

-- Update the default row with some dummy data if needed
UPDATE public.system_settings 
SET emola_number = '860000000', emola_name = 'Nome e-Mola Fictício'
WHERE id = '00000000-0000-0000-0000-000000000001';
