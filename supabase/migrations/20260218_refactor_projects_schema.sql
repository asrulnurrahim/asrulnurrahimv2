-- Migration: Refactor projects schema (non-destructive)
-- Description: Add new columns if they do not exist: thumbnail_path, live_url, repo_url, is_featured, published_at

-- 1. Add thumbnail_path (TEXT NULL)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'thumbnail_path') THEN
        ALTER TABLE projects ADD COLUMN thumbnail_path TEXT NULL;
    END IF;
END $$;

-- 2. Add live_url (TEXT NULL)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'live_url') THEN
        ALTER TABLE projects ADD COLUMN live_url TEXT NULL;
    END IF;
END $$;

-- 3. Add repo_url (TEXT NULL)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'repo_url') THEN
        ALTER TABLE projects ADD COLUMN repo_url TEXT NULL;
    END IF;
END $$;

-- 4. Add is_featured (BOOLEAN NOT NULL DEFAULT false)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'is_featured') THEN
        ALTER TABLE projects ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- 5. Add published_at (TIMESTAMPTZ NULL)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'published_at') THEN
        ALTER TABLE projects ADD COLUMN published_at TIMESTAMPTZ NULL;
    END IF;
END $$;

-- Note: No columns dropped, no data reset. 'tech_stack' is untouched.
