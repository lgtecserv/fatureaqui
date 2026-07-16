-- 1. Criar a storage bucket para logotipos se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir leitura pública de qualquer logo
CREATE POLICY "Logos are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'logos');

-- 3. Permitir que utilizadores autenticados façam upload
CREATE POLICY "Users can upload logos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'logos' 
  AND auth.role() = 'authenticated'
);

-- 4. Permitir que utilizadores autenticados atualizem logos existentes
CREATE POLICY "Users can update logos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'logos' 
  AND auth.role() = 'authenticated'
);

-- 5. Permitir que utilizadores autenticados apaguem logos
CREATE POLICY "Users can delete logos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'logos' 
  AND auth.role() = 'authenticated'
);
