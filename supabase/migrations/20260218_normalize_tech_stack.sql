-- Migration: Normalize tech_stack
-- Description: Create technologies and project_technologies tables to replace array column (eventually)

-- 1. Create technologies table
CREATE TABLE IF NOT EXISTS technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for technologies
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for technologies (adjust as needed, defaulting to public read)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'technologies' AND policyname = 'Public read access for technologies'
    ) THEN
        CREATE POLICY "Public read access for technologies" ON technologies FOR SELECT USING (true);
    END IF;
END $$;


-- 2. Create project_technologies junction table
CREATE TABLE IF NOT EXISTS project_technologies (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (project_id, technology_id)
);

-- Enable RLS for project_technologies
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for project_technologies (adjust as needed, defaulting to public read)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'project_technologies' AND policyname = 'Public read access for project_technologies'
    ) THEN
        CREATE POLICY "Public read access for project_technologies" ON project_technologies FOR SELECT USING (true);
    END IF;
END $$;


-- 3. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_technologies_project_id ON project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_technologies_technology_id ON project_technologies(technology_id);

-- Note: 'tech_stack' column in 'projects' is untouched. use another migration to backfill or drop.
