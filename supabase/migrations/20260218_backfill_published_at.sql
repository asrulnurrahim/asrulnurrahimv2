-- Migration: Backfill published_at for published projects
-- Description: Set published_at = created_at where it is NULL and status is 'published'

UPDATE projects
SET published_at = created_at
WHERE status = 'published'
  AND published_at IS NULL;
