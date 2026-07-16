-- O bucket 'receipts' foi criado originalmente como privado (public = false).
-- Para o Super Administrador conseguir ver o comprovativo ao clicar no link 'Ver Ficheiro',
-- o bucket precisa de ser público. A segurança é mantida porque os nomes dos ficheiros são códigos aleatórios (ex: 74ur1m.png).

UPDATE storage.buckets
SET public = true
WHERE id = 'receipts';
