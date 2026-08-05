-- 0019_storage_security.sql
-- Restrict file types and file sizes to prevent storage abuse and malicious uploads

-- 1. Restrict 'assets' bucket
UPDATE storage.buckets
SET allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'],
    file_size_limit = 5242880 -- 5MB in bytes
WHERE id = 'assets';

-- 2. Restrict 'receipts' bucket
UPDATE storage.buckets
SET allowed_mime_types = array['image/jpeg', 'image/png', 'application/pdf'],
    file_size_limit = 5242880 -- 5MB in bytes
WHERE id = 'receipts';
