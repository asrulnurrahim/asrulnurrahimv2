-- Add views column to posts table if it doesn't exist
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS views BIGINT DEFAULT 0;

-- Create a function to atomically increment view count
CREATE OR REPLACE FUNCTION public.increment_page_view(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts
  SET views = views + 1
  WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
