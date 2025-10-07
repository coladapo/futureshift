-- Fix RLS policies for market_intelligence
-- Allow authenticated users to insert new market intelligence

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role can insert market intelligence" ON market_intelligence;

-- Allow service role and authenticated users to insert market intelligence
-- In production, you'd want to restrict this to admin users only
CREATE POLICY "Authenticated users can insert market intelligence"
  ON market_intelligence
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also allow updates to deactivate old versions
DROP POLICY IF EXISTS "Authenticated users can update market intelligence" ON market_intelligence;
CREATE POLICY "Authenticated users can update market intelligence"
  ON market_intelligence
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
