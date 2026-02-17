-- Migration: Setup projects-thumbnails storage bucket
-- Description: Creates the bucket and sets up RLS policies for public read and admin write.

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'projects-thumbnails', 'projects-thumbnails', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'projects-thumbnails'
);

-- 2. Delete existing policies for this bucket to avoid conflicts during development
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin CRUD Access" ON storage.objects;

-- 4. Create Policy: Public Read Access
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'projects-thumbnails');

-- 5. Create Policy: Admin CRUD Access
-- Using the same logic as projects RLS (single admin UID)
-- Replace with the actual admin UID from the previous migration context if possible, 
-- or use the auth.uid() check if the admin is the only one who can log in.
-- Based on previous migration: 00000000-0000-0000-0000-000000000000 (placeholder in migration 20260218_upgrade_rls_to_single_admin.sql)
-- Let's use a generic 'authenticated with admin check' or just 'authenticated' if we trust the single admin setup.
-- However, the user's previous migration used: auth.uid() = '59220973-e381-4235-9831-507981da40cc' (example from context)

CREATE POLICY "Admin CRUD Access"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'projects-thumbnails' AND 
    (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID')
)
WITH CHECK (
    bucket_id = 'projects-thumbnails' AND 
    (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID')
);
