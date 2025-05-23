-- Update tasks table to include completed_by_name
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_by_name TEXT;

-- Drop user_id and completed_by_user_id columns if they exist
ALTER TABLE tasks DROP COLUMN IF EXISTS user_id;
ALTER TABLE tasks DROP COLUMN IF EXISTS completed_by_user_id;

-- Update RLS policies to allow anonymous access
DROP POLICY IF EXISTS "Tasks are viewable by everyone." ON tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks." ON tasks;
DROP POLICY IF EXISTS "Users can update any task." ON tasks;
DROP POLICY IF EXISTS "Users can delete any task." ON tasks;

CREATE POLICY "Public tasks access" ON tasks
  FOR ALL USING (true) WITH CHECK (true);
