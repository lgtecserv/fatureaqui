-- Migration 0033_community_comments_replies.sql

-- Add parent_id to support threaded comments (replies)
ALTER TABLE public.community_comments
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE;

-- Create an index to quickly load replies for a comment
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON public.community_comments(parent_id);
