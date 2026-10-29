-- Migration 0032_admin_community_policies.sql

-- Admins can manage everything in the community
CREATE POLICY "Admins can manage all community_posts" ON public.community_posts
FOR ALL USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');

CREATE POLICY "Admins can manage all community_comments" ON public.community_comments
FOR ALL USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');

CREATE POLICY "Admins can manage all community_chats" ON public.community_chats
FOR ALL USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');

CREATE POLICY "Admins can manage all community_messages" ON public.community_messages
FOR ALL USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');

-- Permitir que a comunidade veja as fotos oficias de posts publicos
CREATE POLICY "Public community images are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'community_images');
