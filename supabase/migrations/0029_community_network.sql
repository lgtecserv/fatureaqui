-- Migration 0029_community_network.sql

-- Posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Likes table
CREATE TABLE IF NOT EXISTS public.community_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Chat Tables
CREATE TABLE IF NOT EXISTS public.community_chats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    participant1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    participant2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(participant1_id, participant2_id)
);

CREATE TABLE IF NOT EXISTS public.community_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id UUID REFERENCES public.community_chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Policies for Posts
CREATE POLICY "Users can view all posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Policies for Likes
CREATE POLICY "Users can view all likes" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "Users can add likes" ON public.community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove likes" ON public.community_likes FOR DELETE USING (auth.uid() = user_id);

-- Policies for Comments
CREATE POLICY "Users can view all comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.community_comments FOR DELETE USING (auth.uid() = user_id);

-- Policies for Chats
CREATE POLICY "Users can view their chats" ON public.community_chats FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can create chats" ON public.community_chats FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Policies for Messages
CREATE POLICY "Users can view messages in their chats" ON public.community_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.community_chats WHERE id = chat_id AND (participant1_id = auth.uid() OR participant2_id = auth.uid()))
);
CREATE POLICY "Users can send messages" ON public.community_messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.community_chats WHERE id = chat_id AND (participant1_id = auth.uid() OR participant2_id = auth.uid()))
);
CREATE POLICY "Users can update message read status" ON public.community_messages FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.community_chats WHERE id = chat_id AND (participant1_id = auth.uid() OR participant2_id = auth.uid()))
);

-- Storage for community images
insert into storage.buckets (id, name, public)
values ('community_images', 'community_images', true)
on conflict (id) do nothing;

create policy "Community images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'community_images' );

create policy "Users can upload community images"
  on storage.objects for insert
  with check ( bucket_id = 'community_images' AND auth.uid() = owner );

create policy "Users can update their community images"
  on storage.objects for update
  using ( bucket_id = 'community_images' AND auth.uid() = owner );

create policy "Users can delete their community images"
  on storage.objects for delete
  using ( bucket_id = 'community_images' AND auth.uid() = owner );
