import { supabase } from './supabaseClient';

/**
 * Market Intelligence Service
 * Manages FutureShift's accumulated wisdom about job markets and career transitions
 */

/**
 * Get the latest active market intelligence
 * This is the shared wisdom that all users leverage
 */
export const getActiveMarketIntelligence = async () => {
  try {
    const { data, error } = await supabase
      .from('market_intelligence')
      .select('*')
      .eq('is_active', true)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 or 1 rows

    if (error) {
      throw error;
    }

    return data; // Will be null if no rows found
  } catch (error) {
    console.error('Error fetching market intelligence:', error);
    return null;
  }
};

/**
 * Save new market intelligence (deactivates previous version)
 * Called after analyzing job market data with Claude
 */
export const saveMarketIntelligence = async (marketData, metadata = {}) => {
  try {
    // Get the next version number
    const { data: latestVersion } = await supabase
      .from('market_intelligence')
      .select('version')
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle() to handle empty table

    const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

    // Deactivate current active version
    await supabase
      .from('market_intelligence')
      .update({ is_active: false })
      .eq('is_active', true);

    // Insert new active version
    const { data, error } = await supabase
      .from('market_intelligence')
      .insert({
        version: nextVersion,
        emerging_roles: marketData.emergingRoles || [],
        traditional_roles: marketData.traditionalRoles || [],
        key_insights: marketData.keyInsights || [],
        skill_trends: marketData.skillTrends || {},
        analyzed_from: metadata.source || 'job_postings.csv',
        job_postings_count: metadata.count || 0,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Market intelligence v${nextVersion} saved as active`);
    return data;
  } catch (error) {
    console.error('Error saving market intelligence:', error);
    throw error;
  }
};

/**
 * Check if market intelligence needs refresh
 * Returns true if no intelligence exists or if it's older than threshold
 */
export const shouldRefreshMarketIntelligence = async (maxAgeDays = 7) => {
  const activeIntel = await getActiveMarketIntelligence();

  if (!activeIntel) {
    console.log('ℹ️  No market intelligence found - needs initial analysis');
    return true;
  }

  const ageInDays = (Date.now() - new Date(activeIntel.created_at)) / (1000 * 60 * 60 * 24);

  if (ageInDays > maxAgeDays) {
    console.log(`ℹ️  Market intelligence is ${Math.floor(ageInDays)} days old - refresh recommended`);
    return true;
  }

  console.log(`✅ Using market intelligence v${activeIntel.version} (${Math.floor(ageInDays)} days old)`);
  return false;
};

/**
 * Save user's personalized role matches
 * Links personal analysis to the market intelligence version used
 */
export const saveUserRoleMatches = async (userId, marketIntelId, matchData) => {
  try {
    const { data, error } = await supabase
      .from('user_role_matches')
      .insert({
        user_id: userId,
        market_intelligence_id: marketIntelId,
        user_background: matchData.userBackground,
        matched_roles: matchData.matchResults?.topMatches || [],
        skill_gaps: matchData.matchResults?.topMatches?.[0]?.skillGaps || [],
        learning_paths: matchData.matchResults?.topMatches?.[0]?.careerPathSteps || [],
        analysis_insights: matchData.matchResults?.analysisInsights || {}
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ User role matches saved');
    return data;
  } catch (error) {
    console.error('Error saving user role matches:', error);
    throw error;
  }
};

/**
 * Get user's analysis history
 */
export const getUserRoleMatchHistory = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('user_role_matches')
      .select(`
        *,
        market_intelligence (
          version,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching user role match history:', error);
    return [];
  }
};

/**
 * Get career transition insights (analytics)
 * Shows which career paths are most popular
 */
export const getCareerTransitionInsights = async () => {
  try {
    const { data, error } = await supabase
      .from('career_transition_insights')
      .select('*')
      .limit(20);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching career insights:', error);
    return [];
  }
};

/**
 * Calculate hash of CSV data to detect changes
 * Simple implementation - in production use proper hashing
 */
export const hashJobData = (csvData) => {
  // Simple hash - in production use crypto.subtle.digest
  let hash = 0;
  for (let i = 0; i < csvData.length; i++) {
    const char = csvData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};
