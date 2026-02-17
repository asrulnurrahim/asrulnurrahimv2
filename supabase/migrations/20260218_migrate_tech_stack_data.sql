-- Migration: Migrate tech_stack data
-- Description: Populate technologies and project_technologies from projects.tech_stack

-- 1. Insert unique technologies
INSERT INTO technologies (name)
SELECT DISTINCT unnest(tech_stack)
FROM projects
WHERE tech_stack IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- 2. Link projects to technologies
INSERT INTO project_technologies (project_id, technology_id)
SELECT 
    p.id as project_id,
    t.id as technology_id
FROM projects p
CROSS JOIN unnest(p.tech_stack) AS tech_name
JOIN technologies t ON t.name = tech_name
WHERE p.tech_stack IS NOT NULL
ON CONFLICT (project_id, technology_id) DO NOTHING;

-- Note: 'tech_stack' column is still preserved.
