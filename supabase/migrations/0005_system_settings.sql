-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pro_price DECIMAL(12, 2) NOT NULL DEFAULT 499.00,
  mpesa_number TEXT,
  mpesa_name TEXT,
  bank_nib TEXT,
  bank_name TEXT,
  bank_account TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Insert default row (id = 1 UUID)
INSERT INTO public.system_settings (id, pro_price, mpesa_number, mpesa_name, bank_nib, bank_name, bank_account)
VALUES ('00000000-0000-0000-0000-000000000001', 499.00, '840000000', 'Nome M-Pesa Fictício', '000000000000000000000', 'Banco Fictício', '123456789')
ON CONFLICT (id) DO NOTHING;

-- Policies
-- Everyone can read settings
CREATE POLICY "Anyone can view system settings" ON public.system_settings FOR SELECT USING (true);

-- Only Admin can update
CREATE POLICY "Admins can update system settings" ON public.system_settings FOR UPDATE USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');
