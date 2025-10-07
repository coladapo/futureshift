-- Market Intelligence System
-- This builds FutureShift's institutional knowledge about job markets

-- Market Intelligence: Shared wisdom about emerging roles and trends
CREATE TABLE IF NOT EXISTS market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version INTEGER NOT NULL,

  -- Market data
  emerging_roles JSONB NOT NULL,
  traditional_roles JSONB,
  key_insights JSONB,
  skill_trends JSONB,

  -- Metadata
  analyzed_from TEXT NOT NULL,  -- e.g., "job_postings_v1.csv"
  job_postings_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- User Role Matches: Personal career analysis linked to market intelligence
CREATE TABLE IF NOT EXISTS user_role_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  market_intelligence_id UUID REFERENCES market_intelligence(id) ON DELETE SET NULL,

  -- Personal matching data
  user_background TEXT NOT NULL,
  matched_roles JSONB NOT NULL,
  skill_gaps JSONB,
  learning_paths JSONB,
  analysis_insights JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_intelligence_active ON market_intelligence(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_market_intelligence_version ON market_intelligence(version DESC);
CREATE INDEX IF NOT EXISTS idx_user_role_matches_user_id ON user_role_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_matches_created_at ON user_role_matches(created_at DESC);

-- Ensure only one active version at a time using partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_intelligence ON market_intelligence(is_active) WHERE is_active = true;

-- RLS Policies
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_matches ENABLE ROW LEVEL SECURITY;

-- Market intelligence is public (everyone can read shared wisdom)
DROP POLICY IF EXISTS "Anyone can read market intelligence" ON market_intelligence;
CREATE POLICY "Anyone can read market intelligence"
  ON market_intelligence
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only authenticated users can read their own matches
DROP POLICY IF EXISTS "Users can read their own role matches" ON user_role_matches;
CREATE POLICY "Users can read their own role matches"
  ON user_role_matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only authenticated users can insert their own matches
DROP POLICY IF EXISTS "Users can insert their own role matches" ON user_role_matches;
CREATE POLICY "Users can insert their own role matches"
  ON user_role_matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Analytics view: Career transition patterns
CREATE OR REPLACE VIEW career_transition_insights AS
SELECT
  urm.matched_roles->0->>'role' as target_role,
  COUNT(DISTINCT urm.user_id) as user_count,
  AVG((urm.matched_roles->0->>'matchScore')::float) as avg_match_score,
  jsonb_agg(DISTINCT urm.skill_gaps->0) as common_skill_gaps,
  DATE_TRUNC('week', urm.created_at) as week
FROM user_role_matches urm
WHERE urm.created_at > NOW() - INTERVAL '90 days'
GROUP BY target_role, DATE_TRUNC('week', urm.created_at)
ORDER BY week DESC, user_count DESC;

COMMENT ON TABLE market_intelligence IS 'Shared market intelligence about emerging roles and trends. This is FutureShift''s accumulated wisdom.';
COMMENT ON TABLE user_role_matches IS 'Personal career analysis results linked to market intelligence version.';
COMMENT ON VIEW career_transition_insights IS 'Analytics showing which career transitions are most popular and their success patterns.';
