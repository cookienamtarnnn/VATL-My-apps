-- ============================================================
-- RLS Policies for `web_apps` table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Enable RLS (if not already enabled)
ALTER TABLE web_apps ENABLE ROW LEVEL SECURITY;

-- 2. Add active column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'web_apps' AND column_name = 'active'
    ) THEN
        ALTER TABLE web_apps ADD COLUMN active boolean DEFAULT true;
    END IF;
END $$;

-- 3. Allow anyone to SELECT active apps (needed for the public hub)
-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS anon_select_active_web_apps ON web_apps;
CREATE POLICY anon_select_active_web_apps
  ON web_apps
  FOR SELECT
  TO anon
  USING (active = true);

-- 4. Allow anon UPDATE on active column (for toggle/filter in UI)
DROP POLICY IF EXISTS anon_update_active_web_apps ON web_apps;
CREATE POLICY anon_update_active_web_apps
  ON web_apps
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Allow service_role full access (for serverless/admin)
DROP POLICY IF EXISTS service_role_all_web_apps ON web_apps;
CREATE POLICY service_role_all_web_apps
  ON web_apps
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Alternative: If you want to keep Add/Edit/Delete in the UI
-- ============================================================
-- Option A: Add auth (require login for mutations)
--   - Create auth users in Supabase
--   - Add policies like:
--     CREATE POLICY "authenticated_insert" ON web_apps
--       FOR INSERT TO authenticated WITH CHECK (true);
--
-- Option B: Serverless function (Vercel/Netlify function)
--   - Move mutations to a function using service_role key
--   - Keep anon SELECT only
--   - Call the function from the browser
--
-- Option C: IP Restriction (if internal network only)
--   - Use Supabase Network Restrictions
--   - Less secure, depends on network
