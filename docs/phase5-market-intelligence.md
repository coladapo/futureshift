# Phase 5: Market Intelligence System

**Status:** ✅ Database & Service Layer Complete | ⏳ Integration Pending

**Vision:** Build FutureShift's institutional knowledge that compounds over time. Not caching - building wisdom.

---

## 🧠 The Big Idea

### What This Is NOT:
- ❌ Temporary caching that expires
- ❌ Per-user data storage
- ❌ Simple query optimization

### What This IS:
- ✅ **Institutional Knowledge** - FutureShift gets smarter with every user
- ✅ **Compound Intelligence** - Market understanding grows over time
- ✅ **Version Tracking** - See how job markets evolve
- ✅ **Shared Wisdom** - All users benefit from accumulated insights

---

## 📊 Two-Tier Data Model

### Tier 1: Market Intelligence (Shared Wisdom)
**Purpose:** FutureShift's collective understanding of job markets

```javascript
{
  id: "uuid",
  version: 1,  // v1, v2, v3... tracking market evolution
  emerging_roles: [
    {
      role: "AI Product Manager",
      demand_score: 0.89,
      growth_rate: 0.45,
      key_skills: ["AI/ML", "Product Strategy", "Data Analysis"],
      salary_range: { min: 120000, max: 180000 }
    }
  ],
  traditional_roles: [...],
  key_insights: [
    "AI transformation affecting 67% of traditional PM roles",
    "Data literacy becoming baseline requirement across roles"
  ],
  skill_trends: {
    "AI/ML": { trend: "rising", velocity: 0.8 },
    "Manual QA": { trend: "declining", velocity: -0.4 }
  },
  analyzed_from: "job_postings.csv",
  job_postings_count: 1247,
  created_at: "2025-10-06T10:00:00Z",
  is_active: true  // Only one active version at a time
}
```

**Key Features:**
- **Versioning:** Track market evolution (v1 → v2 → v3)
- **Single Active Version:** Only one market intelligence is "current"
- **Public Access:** Everyone reads the same shared wisdom (via RLS)
- **Refresh Logic:** Re-analyze when data is >7 days old OR new job data available

### Tier 2: User Role Matches (Personal Analysis)
**Purpose:** Individual career paths linked to market intelligence

```javascript
{
  id: "uuid",
  user_id: "user-123",
  market_intelligence_id: "mi-v5",  // Links to specific market version
  user_background: "7 years as architect, interested in UX...",
  matched_roles: [
    {
      role: "UX Architect",
      matchScore: 0.87,
      reasoning: "Architecture background + design interest...",
      skillGaps: ["Figma", "User Research", "Prototyping"],
      careerPathSteps: [...]
    }
  ],
  skill_gaps: [...],
  learning_paths: [...],
  analysis_insights: {
    transferableSkills: ["Systems thinking", "Visual communication"],
    timeToTransition: "6-9 months",
    confidence: 0.85
  },
  created_at: "2025-10-06T11:30:00Z"
}
```

**Key Features:**
- **Per-User:** Private, secured via RLS
- **Linked to Market Version:** Know which intelligence powered the analysis
- **History Tracking:** See how recommendations evolve as market changes
- **Analytics Ready:** Aggregate to find popular career transitions

---

## 🏗️ Database Schema

### Tables Created

#### `market_intelligence`
- **Primary Key:** `id` (UUID)
- **Unique Constraint:** Only one `is_active = true` row (via partial index)
- **Access:** Public read for authenticated and anonymous users
- **Version Control:** Auto-incrementing version numbers

#### `user_role_matches`
- **Primary Key:** `id` (UUID)
- **Foreign Keys:**
  - `user_id` → `auth.users(id)` ON DELETE CASCADE
  - `market_intelligence_id` → `market_intelligence(id)` ON DELETE SET NULL
- **Access:** Users can only read/write their own data
- **Tracking:** Full career analysis history per user

#### `career_transition_insights` (View)
**Analytics View for Popular Transitions:**
```sql
SELECT
  target_role,
  COUNT(DISTINCT user_id) as user_count,
  AVG(match_score) as avg_match_score,
  common_skill_gaps,
  week
FROM user_role_matches
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY target_role, week
ORDER BY week DESC, user_count DESC;
```

**Use Cases:**
- Show trending career paths
- Identify common skill gaps
- Validate role recommendations
- Marketing insights (e.g., "247 users transitioning to AI PM")

### Indexes Created
```sql
-- Fast lookup of active intelligence
CREATE INDEX idx_market_intelligence_active
  ON market_intelligence(is_active) WHERE is_active = true;

-- Version history queries
CREATE INDEX idx_market_intelligence_version
  ON market_intelligence(version DESC);

-- User match lookups
CREATE INDEX idx_user_role_matches_user_id
  ON user_role_matches(user_id);

-- Recent analysis queries
CREATE INDEX idx_user_role_matches_created_at
  ON user_role_matches(created_at DESC);

-- Enforce single active version
CREATE UNIQUE INDEX idx_unique_active_intelligence
  ON market_intelligence(is_active) WHERE is_active = true;
```

### Security (RLS Policies)

#### Market Intelligence (Public)
```sql
-- Everyone can read shared wisdom
CREATE POLICY "Anyone can read market intelligence"
  ON market_intelligence
  FOR SELECT
  TO authenticated, anon
  USING (true);
```

#### User Role Matches (Private)
```sql
-- Users can only read their own matches
CREATE POLICY "Users can read their own role matches"
  ON user_role_matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can only insert their own matches
CREATE POLICY "Users can insert their own role matches"
  ON user_role_matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

## 🔧 Service Layer API

Created: `/src/services/marketIntelligence.js`

### Core Functions

#### `getActiveMarketIntelligence()`
Get the current shared market wisdom.

```javascript
const intel = await getActiveMarketIntelligence();
// Returns: { version: 5, emerging_roles: [...], ... } or null
```

**Use Case:** Before user analysis, check if we have market intelligence

#### `saveMarketIntelligence(marketData, metadata)`
Save new market intelligence version, deactivate previous.

```javascript
await saveMarketIntelligence({
  emergingRoles: [...],
  traditionalRoles: [...],
  keyInsights: [...],
  skillTrends: {...}
}, {
  source: 'job_postings_v2.csv',
  count: 1523
});
// Auto-increments version, deactivates old active version
```

**Use Case:** After analyzing job data with Claude, save as new intelligence

#### `shouldRefreshMarketIntelligence(maxAgeDays = 7)`
Check if market intelligence needs refresh.

```javascript
const needsRefresh = await shouldRefreshMarketIntelligence(7);
// true if: no intelligence exists OR active intel > 7 days old
```

**Use Case:** Decide whether to re-analyze job market or use cached intelligence

#### `saveUserRoleMatches(userId, marketIntelId, matchData)`
Save user's personal analysis linked to market version.

```javascript
await saveUserRoleMatches(
  'user-123',
  'mi-uuid-v5',
  {
    userBackground: "...",
    matchResults: {
      topMatches: [...],
      analysisInsights: {...}
    }
  }
);
```

**Use Case:** After personalizing analysis for user, save their results

#### `getUserRoleMatchHistory(userId, limit = 10)`
Get user's analysis history.

```javascript
const history = await getUserRoleMatchHistory('user-123', 5);
// Returns last 5 analyses with linked market intelligence versions
```

**Use Case:** Show "Your Past Analyses" feature, track career evolution

#### `getCareerTransitionInsights()`
Get analytics on popular career transitions.

```javascript
const insights = await getCareerTransitionInsights();
// Returns: [{ target_role, user_count, avg_match_score, ... }]
```

**Use Case:** Marketing ("247 users exploring AI PM"), validate recommendations

---

## 🔄 Workflow Integration

### Current Flow (Before Phase 5)
```
User clicks "Analyze"
  → Load CSV (5s)
  → Call Claude: Analyze market (20s)
  → Call Claude: Match user (15s)
  → Show results

Total: 40s per user, every user re-analyzes market
```

### New Flow (After Phase 5)
```
User clicks "Analyze"
  → Check shouldRefreshMarketIntelligence()

  IF needs refresh (first user OR >7 days old):
    → Load CSV (5s)
    → Call Claude: Analyze market (20s)
    → saveMarketIntelligence() ✅ Save shared wisdom

  ELSE:
    → getActiveMarketIntelligence() ⚡ Instant

  → Call Claude: Match user to intelligence (15s)
  → saveUserRoleMatches() ✅ Save personal analysis
  → Show results

First user: 40s (same as before)
Subsequent users: 15s (62% faster! 🚀)
```

---

## 📈 Benefits

### Performance
- **62% faster for most users** (15s vs 40s)
- **Reduced Claude API costs** (1 market analysis instead of N)
- **Scalable** - 1000 users share same market intelligence

### Intelligence
- **Compound Learning** - Market understanding improves over time
- **Version History** - Track how job markets evolve
- **Analytics** - See which transitions are popular
- **Consistency** - All users see same emerging roles

### User Experience
- **Faster results** for 2nd+ users
- **Historical tracking** - "Here's how your path evolved"
- **Social proof** - "247 users exploring this role"
- **Confidence** - "Based on analysis of 1,523 job postings"

---

## 🧪 Testing Strategy

### Manual Tests

1. **First User (Fresh Intelligence)**
   ```
   1. Delete all market_intelligence rows
   2. Run analysis for User A
   3. Verify: New market_intelligence row created (v1, is_active=true)
   4. Verify: user_role_matches row created, linked to v1
   5. Check timing: Should take ~40s
   ```

2. **Second User (Cached Intelligence)**
   ```
   1. Immediately run analysis for User B
   2. Verify: No new market_intelligence row (still v1)
   3. Verify: New user_role_matches row for User B, linked to v1
   4. Check timing: Should take ~15s
   ```

3. **Refresh Logic (Old Intelligence)**
   ```
   1. Manually set active intelligence created_at to 8 days ago
   2. Run analysis for User C
   3. Verify: New market_intelligence row created (v2, is_active=true)
   4. Verify: Old v1 set to is_active=false
   5. Verify: User C's match links to v2
   ```

4. **Analytics View**
   ```
   1. Query career_transition_insights view
   2. Verify: Shows aggregated transition data
   3. Check: user_count, avg_match_score, common_skill_gaps
   ```

### Database Validation

```sql
-- Check active intelligence
SELECT * FROM market_intelligence WHERE is_active = true;
-- Should return exactly 1 row

-- Check version progression
SELECT version, created_at, is_active
FROM market_intelligence
ORDER BY version DESC;

-- Check user matches
SELECT
  u.email,
  urm.matched_roles->0->>'role' as top_role,
  mi.version
FROM user_role_matches urm
JOIN auth.users u ON u.id = urm.user_id
JOIN market_intelligence mi ON mi.id = urm.market_intelligence_id
ORDER BY urm.created_at DESC;

-- Check analytics
SELECT * FROM career_transition_insights
WHERE week > NOW() - INTERVAL '30 days';
```

---

## 🚀 Next Steps

### Immediate (Required for Phase 5)

1. **Update `useClaudeAnalysis.js`**
   - Import market intelligence functions
   - Check `shouldRefreshMarketIntelligence()` before analysis
   - Use `getActiveMarketIntelligence()` instead of analyzing market
   - Call `saveMarketIntelligence()` after market analysis
   - Call `saveUserRoleMatches()` after user analysis

2. **Update Claude Prompts**
   - Modify to accept pre-analyzed market intelligence
   - Focus user analysis on matching to existing intelligence
   - Reduce redundant market analysis in prompts

3. **Add Version Display**
   - Show "Based on Market Intelligence v5 (analyzed 2 days ago)"
   - Display "Analyzed from 1,523 job postings"

### Future Enhancements

1. **Admin Dashboard**
   - View all market intelligence versions
   - Manually trigger refresh
   - See analytics on user matches

2. **Progressive Intelligence**
   - Start with small dataset (50 jobs)
   - Add more data over time
   - Track how accuracy improves

3. **Smart Refresh**
   - Auto-refresh when new job data uploaded
   - Notify users when market intelligence updates
   - Compare old vs new recommendations

4. **Historical Comparison**
   - "Your match in v3 vs v7"
   - Show how recommendations evolved
   - Track market changes over time

---

## 📁 Files Modified/Created

### Created
- `/supabase/migrations/004_market_intelligence.sql` - Database schema
- `/src/services/marketIntelligence.js` - Service layer
- `/scripts/apply-migration.js` - Migration helper (for reference)
- `/docs/phase5-market-intelligence.md` - This documentation

### To Modify
- `/src/hooks/useClaudeAnalysis.js` - Integrate intelligence system
- `/src/services/claudeService.js` - Update prompts to use intelligence
- `/src/components/ResultsDashboard.jsx` - Show version info

---

## 💡 Key Insights

### Why This Matters
FutureShift isn't just analyzing job markets - it's building an ever-growing knowledge base about career evolution. Each user contributes to and benefits from this shared wisdom.

### Unique Value Prop
> "FutureShift has analyzed 1,523 job postings across 15 industries. Our Market Intelligence v7 was updated 2 days ago. 247 users have already explored AI Product Manager roles through our platform."

This is **institutional knowledge**, not caching. This is what makes FutureShift special.

---

## ✅ Migration Applied

Database migration successfully applied to Supabase project `futureshift` (ID: `fmiovcrugdxehyzpkeqe`).

Tables and policies are live and ready for integration.
