-- Migration: Upgrade RLS to Single Admin (Hardcoded UID)
-- Description:
-- 1. Drop existing write policies for projects, technologies, project_technologies
-- 2. Create new write policies that restrict access to a specific UID
-- 
-- REPLACE 'REPLACE_WITH_YOUR_ADMIN_UID' with your actual Supabase User ID.

-- ==========================================
-- 1. Projects
-- ==========================================
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;

CREATE POLICY "Admin can insert projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');

CREATE POLICY "Admin can update projects"
ON projects FOR UPDATE
USING (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');

CREATE POLICY "Admin can delete projects"
ON projects FOR DELETE
USING (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');


-- ==========================================
-- 2. Technologies
-- ==========================================
DROP POLICY IF EXISTS "Admins can manage technologies" ON technologies;

CREATE POLICY "Admin can insert technologies"
ON technologies FOR INSERT
WITH CHECK (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');

CREATE POLICY "Admin can update technologies"
ON technologies FOR UPDATE
USING (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');

CREATE POLICY "Admin can delete technologies"
ON technologies FOR DELETE
USING (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');


-- ==========================================
-- 3. Project Technologies
-- ==========================================
DROP POLICY IF EXISTS "Admins can manage project_technologies" ON project_technologies;

CREATE POLICY "Admin can insert project_technologies"
ON project_technologies FOR INSERT
WITH CHECK (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');

CREATE POLICY "Admin can update project_technologies"
ON project_technologies FOR UPDATE
USING (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');

CREATE POLICY "Admin can delete project_technologies"
ON project_technologies FOR DELETE
USING (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UID');
