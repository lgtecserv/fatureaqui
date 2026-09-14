-- ============================================================
-- FatureAqui — Migration: Marketing Campaigns History
-- ============================================================

CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  audience TEXT NOT NULL,
  sent_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Allow only admins to select
CREATE POLICY "Admins can view marketing campaigns" 
  ON public.marketing_campaigns 
  FOR SELECT 
  USING (auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com'));

-- Allow only admins to insert
CREATE POLICY "Admins can insert marketing campaigns" 
  ON public.marketing_campaigns 
  FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com'));
