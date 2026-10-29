-- Migration 0030_community_multiple_images.sql
ALTER TABLE public.community_posts
ADD COLUMN image_urls JSONB DEFAULT '[]'::jsonb;
