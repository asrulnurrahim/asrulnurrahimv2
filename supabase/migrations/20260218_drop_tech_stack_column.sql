-- Migration: Drop tech_stack column
-- Description: Remove the legacy tech_stack (TEXT[]) column as it has been fully migrated to technologies table

ALTER TABLE projects DROP COLUMN IF EXISTS tech_stack;
