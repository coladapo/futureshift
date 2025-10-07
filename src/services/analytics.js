import { supabase } from './supabaseClient';

/**
 * Track user interactions for career shift insights
 */

/**
 * Track when a user clicks on a role match card
 */
export const trackRoleClick = async (analysisId, roleData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // Only track for logged-in users

  await logInteraction(user.id, analysisId, 'role_click', {
    role_title: roleData.title,
    match_score: roleData.matchScore,
    company: roleData.company,
    skills_matched: roleData.skillsMatched?.length || 0
  });
};

/**
 * Track when a user expands skill gaps
 */
export const trackSkillGapExpand = async (analysisId, skillData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await logInteraction(user.id, analysisId, 'skill_expand', {
    skill_count: skillData.length,
    top_skills: skillData.slice(0, 3).map(s => s.skill)
  });
};

/**
 * Track when a user clicks on a learning path
 */
export const trackLearningPathClick = async (analysisId, learningData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await logInteraction(user.id, analysisId, 'learning_path_click', {
    resource_title: learningData.title,
    resource_type: learningData.type,
    resource_url: learningData.url
  });
};

/**
 * Track time spent on results page
 */
export const trackTimeOnResults = async (analysisId, timeSpent) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await logInteraction(user.id, analysisId, 'time_on_results', {
    seconds: timeSpent,
    minutes: Math.round(timeSpent / 60)
  });
};

/**
 * Track when user scrolls to bottom (full engagement)
 */
export const trackFullPageView = async (analysisId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await logInteraction(user.id, analysisId, 'full_page_view', {
    engaged: true
  });
};

/**
 * Generic interaction logger
 */
const logInteraction = async (userId, analysisId, eventType, eventData) => {
  try {
    const { error } = await supabase
      .from('user_interactions')
      .insert({
        user_id: userId,
        analysis_id: analysisId,
        event_type: eventType,
        event_data: eventData
      });

    if (error) {
      console.error('Analytics error:', error);
    }
  } catch (err) {
    // Silently fail - analytics shouldn't break the app
    console.error('Failed to log interaction:', err);
  }
};

/**
 * Get career shift insights (for admin/analytics dashboard)
 */
export const getCareerShiftInsights = async (startDate, endDate) => {
  const { data, error } = await supabase
    .from('career_shift_insights')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }

  return data;
};
