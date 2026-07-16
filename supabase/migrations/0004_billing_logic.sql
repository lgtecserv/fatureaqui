-- Add valid_until column to subscriptions, defaulting to 30 days from creation
ALTER TABLE public.subscriptions 
ADD COLUMN valid_until TIMESTAMPTZ DEFAULT (NOW() + interval '30 days');

-- Update existing subscriptions to have 30 days from their created_at if they don't have valid_until
UPDATE public.subscriptions 
SET valid_until = created_at + interval '30 days'
WHERE valid_until IS NULL;
