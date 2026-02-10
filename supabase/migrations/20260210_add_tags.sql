-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Associate posts with tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Policies for public read
CREATE POLICY "Allow public read access to tags"
ON public.tags FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to post_tags"
ON public.post_tags FOR SELECT
TO public
USING (true);

-- Policies for authenticated users (admin can write)
CREATE POLICY "Allow authenticated users to insert tags"
ON public.tags FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tags"
ON public.tags FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete tags"
ON public.tags FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to manage post_tags"
ON public.post_tags FOR ALL
TO authenticated
USING (true);
