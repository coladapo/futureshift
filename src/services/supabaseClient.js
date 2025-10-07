// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

/**
 * Save career analysis to database
 * @param {Object} analysisData - The analysis data to save
 * @returns {Promise<Object>} Saved analysis with ID
 */
export const saveAnalysis = async (analysisData) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be logged in to save analysis');
  }

  const { data, error } = await supabase
    .from('career_analyses')
    .insert([
      {
        user_id: user.id,
        user_background: analysisData.userBackground,
        market_analysis: analysisData.marketAnalysis,
        match_results: analysisData.matchResults,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get all analyses for current user
 * @returns {Promise<Array>} Array of user's analyses
 */
export const getUserAnalyses = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be logged in to view analyses');
  }

  const { data, error } = await supabase
    .from('career_analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Get single analysis by ID
 * @param {string} analysisId - The analysis ID
 * @returns {Promise<Object>} Analysis data
 */
export const getAnalysis = async (analysisId) => {
  const { data, error } = await supabase
    .from('career_analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete analysis
 * @param {string} analysisId - The analysis ID to delete
 * @returns {Promise<void>}
 */
export const deleteAnalysis = async (analysisId) => {
  const { error } = await supabase
    .from('career_analyses')
    .delete()
    .eq('id', analysisId);

  if (error) throw error;
};
