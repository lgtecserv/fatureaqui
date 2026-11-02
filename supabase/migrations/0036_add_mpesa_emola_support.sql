-- Migration 0036: Add M-Pesa, e-Mola, and stamp fields to companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS mpesa_number VARCHAR(50);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS emola_number VARCHAR(50);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stamp_style VARCHAR(20) DEFAULT 'style1';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS use_digital_stamp BOOLEAN DEFAULT true;
