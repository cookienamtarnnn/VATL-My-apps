-- ============================================================
-- RLS Policies for `web_apps` table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Enable RLS (if not already enabled)
ALTER TABLE web_apps ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone to SELECT (read) — needed for the public hub
CREATE POLICY "anon_select_web_apps"
  ON web_apps
  FOR SELECT
  TO anon
  USING (true);

-- 3. Block INSERT/UPDATE/DELETE for anon (no policy = denied)
--    The app's Add/Edit/Delete buttons will stop working.
--    Manage entries via Supabase Dashboard instead.

-- 4. Allow service_role full access (for serverless/admin)
CREATE POLICY "service_role_all_web_apps"
  ON web_apps
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- ALTERNATIVE: If you want to keep Add/Edit/Delete in the UI
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
