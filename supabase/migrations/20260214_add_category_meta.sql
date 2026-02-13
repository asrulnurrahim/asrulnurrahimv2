-- Add description and color columns to categories table
ALTER TABLE categories
ADD COLUMN description TEXT,
ADD COLUMN color VARCHAR(50);

-- Update RLS policies if necessary (assuming public read access is already enabled)
-- No changes needed if existing policies cover new columns
