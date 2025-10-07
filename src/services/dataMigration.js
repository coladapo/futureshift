import { supabase } from './supabaseClient';
import { uploadResume } from './resumeStorage';

/**
 * Migrate anonymous user data to authenticated account on sign-up
 */

const STORAGE_KEYS = {
  RESUME_FILE: 'futureshift_anonymous_resume_file',
  RESUME_TEXT: 'futureshift_anonymous_resume_text',
  RESUME_FILENAME: 'futureshift_anonymous_resume_filename',
  ANALYSES: 'futureshift_anonymous_analyses',
};

/**
 * Save anonymous resume upload to localStorage
 */
export const saveAnonymousResume = async (file, parsedText) => {
  try {
    // Convert file to base64 for localStorage storage
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64 = reader.result;

        localStorage.setItem(STORAGE_KEYS.RESUME_FILE, base64);
        localStorage.setItem(STORAGE_KEYS.RESUME_TEXT, parsedText);
        localStorage.setItem(STORAGE_KEYS.RESUME_FILENAME, file.name);

        console.log('✅ Resume saved to localStorage for migration');
        resolve();
      };

      reader.onerror = () => {
        console.error('Failed to save resume to localStorage');
        reject(reader.error);
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error saving anonymous resume:', error);
  }
};

/**
 * Save anonymous analysis to localStorage
 */
export const saveAnonymousAnalysis = (analysisData) => {
  try {
    const existingAnalyses = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ANALYSES) || '[]'
    );

    existingAnalyses.push({
      ...analysisData,
      savedAt: new Date().toISOString()
    });

    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(existingAnalyses));
    console.log('✅ Analysis saved to localStorage for migration');
  } catch (error) {
    console.error('Error saving anonymous analysis:', error);
  }
};

/**
 * Migrate all anonymous data to authenticated user account
 */
export const migrateAnonymousData = async (userId) => {
  console.log('🔄 Starting data migration for user:', userId);

  try {
    // Migrate resume (don't fail if this fails)
    try {
      console.log('📄 Attempting resume migration...');
      await migrateResume(userId);
      console.log('✅ Resume migration completed');
    } catch (resumeError) {
      console.warn('⚠️  Resume migration failed (continuing anyway):', resumeError.message);
    }

    // Migrate analyses
    try {
      console.log('📊 Attempting analyses migration...');
      await migrateAnalyses(userId);
      console.log('✅ Analyses migration completed');
    } catch (analysisError) {
      console.warn('⚠️  Analyses migration failed (continuing anyway):', analysisError.message);
    }

    // Clear localStorage after successful migration
    clearAnonymousData();

    console.log('✅ Data migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Data migration failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Migrate resume from localStorage to Supabase
 */
const migrateResume = async (userId) => {
  const base64File = localStorage.getItem(STORAGE_KEYS.RESUME_FILE);
  const resumeText = localStorage.getItem(STORAGE_KEYS.RESUME_TEXT);
  const filename = localStorage.getItem(STORAGE_KEYS.RESUME_FILENAME);

  if (!base64File || !resumeText || !filename) {
    console.log('ℹ️  No resume to migrate');
    return;
  }

  try {
    console.log('📤 Converting resume file...');
    // Convert base64 back to File object with timeout
    const response = await fetch(base64File);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    console.log('✅ Resume file converted, uploading to Supabase...');

    // Upload to Supabase with timeout
    const uploadPromise = uploadResume(file, userId, resumeText);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Resume upload timeout after 10s')), 10000)
    );

    await Promise.race([uploadPromise, timeoutPromise]);
    console.log('✅ Resume migrated successfully');
  } catch (error) {
    console.error('Failed to migrate resume:', error);
    throw error;
  }
};

/**
 * Migrate analyses from localStorage to Supabase
 */
const migrateAnalyses = async (userId) => {
  const analysesJson = localStorage.getItem(STORAGE_KEYS.ANALYSES);

  if (!analysesJson) {
    console.log('ℹ️  No analyses to migrate');
    return;
  }

  try {
    const analyses = JSON.parse(analysesJson);
    console.log(`📊 Migrating ${analyses.length} analysis/analyses...`);

    for (const analysis of analyses) {
      console.log('💾 Inserting analysis into database...');
      const insertPromise = supabase.from('career_analyses').insert({
        user_id: userId,
        user_background: analysis.userBackground,
        market_analysis: analysis.marketAnalysis,
        match_results: analysis.matchResults,
        created_at: analysis.savedAt || new Date().toISOString()
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Analysis insert timeout after 10s')), 10000)
      );

      await Promise.race([insertPromise, timeoutPromise]);
    }

    console.log(`✅ Migrated ${analyses.length} analysis/analyses`);
  } catch (error) {
    console.error('Failed to migrate analyses:', error);
    throw error;
  }
};

/**
 * Clear anonymous data from localStorage after migration
 */
const clearAnonymousData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('✅ Anonymous data cleared from localStorage');
};

/**
 * Check if there's anonymous data to migrate
 */
export const hasAnonymousData = () => {
  return (
    localStorage.getItem(STORAGE_KEYS.RESUME_FILE) !== null ||
    localStorage.getItem(STORAGE_KEYS.ANALYSES) !== null
  );
};
