-- Adicionar a opção para ligar/desligar o carimbo digital
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS use_digital_stamp BOOLEAN DEFAULT true;
