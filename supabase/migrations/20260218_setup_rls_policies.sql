-- Migration: Setup RLS policies for projects, technologies, and project_technologies
-- Description: 
-- 1. Enable RLS on all tables
-- 2. Projects: Public read for published, Admin read all, Admin write all
-- 3. Technologies: Public read all, Admin write all
-- 4. Project_Technologies: Public read all, Admin write all

-- 1. Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;

-- 2. Policies for 'projects'
-- Public can view published projects
DROP POLICY IF EXISTS "Public can view published projects" ON projects;
CREATE POLICY "Public can view published projects" 
ON projects FOR SELECT 
USING (status = 'published');

-- Authenticated users (admin) can view all projects
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects" 
ON projects FOR SELECT 
USING (auth.role() = 'authenticated');

-- Authenticated users (admin) can insert/update/delete
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
CREATE POLICY "Admins can manage projects" 
ON projects FOR ALL 
USING (auth.role() = 'authenticated');


-- 3. Policies for 'technologies'
-- Public can view all technologies (needed for filtering and display)
DROP POLICY IF EXISTS "Public can view technologies" ON technologies;
CREATE POLICY "Public can view technologies" 
ON technologies FOR SELECT 
USING (true);

-- Authenticated users (admin) can manage technologies
DROP POLICY IF EXISTS "Admins can manage technologies" ON technologies;
CREATE POLICY "Admins can manage technologies" 
ON technologies FOR ALL 
USING (auth.role() = 'authenticated');


-- 4. Policies for 'project_technologies'
-- Public can view all project_technologies
DROP POLICY IF EXISTS "Public can view project_technologies" ON project_technologies;
CREATE POLICY "Public can view project_technologies" 
ON project_technologies FOR SELECT 
USING (true);

-- Authenticated users (admin) can manage project_technologies
DROP POLICY IF EXISTS "Admins can manage project_technologies" ON project_technologies;
CREATE POLICY "Admins can manage project_technologies" 
ON project_technologies FOR ALL 
USING (auth.role() = 'authenticated');
