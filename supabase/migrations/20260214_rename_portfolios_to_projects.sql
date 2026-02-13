-- Migration: Rename portfolios to projects
-- Description: Standardize database table name to match frontend terminology.

ALTER TABLE portfolios RENAME TO projects;

-- Note: In a real environment, you might also need to update RLS policies if they were specifically named.
-- However, for the scope of this project, a simple rename is the first step.
