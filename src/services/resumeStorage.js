import { supabase } from './supabaseClient';

/**
 * Upload resume file to Supabase Storage
 * @param {File} file - The resume file to upload
 * @param {string} userId - The user's ID
 * @param {string} parsedText - The Claude-parsed resume text
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadResume = async (file, userId, parsedText) => {
  try {
    // Create a unique file name: userId/timestamp_originalName
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Never overwrite - keep all versions
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    // Add resume to history table
    await addResumeToHistory(userId, urlData.publicUrl, file.name, parsedText);

    return urlData.publicUrl;

  } catch (error) {
    console.error('Resume upload error:', error);
    throw new Error(`Failed to upload resume: ${error.message}`);
  }
};

/**
 * Add resume to history table (keeps all versions, never deletes)
 */
const addResumeToHistory = async (userId, resumeUrl, originalFileName, parsedText) => {
  // First, mark all previous resumes as not latest
  await supabase
    .from('resumes')
    .update({ is_latest: false })
    .eq('user_id', userId)
    .eq('is_latest', true);

  // Then insert the new resume as latest
  const { error } = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      resume_url: resumeUrl,
      resume_filename: originalFileName,
      resume_text: parsedText,
      is_latest: true
    });

  if (error) {
    console.error('Error adding resume to history:', error);
    throw error;
  }
};

/**
 * Get user's latest resume data
 */
export const getLatestResume = async (userId) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_latest', true)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching latest resume:', error);
    throw error;
  }

  return data;
};

/**
 * Get all resume versions for a user
 */
export const getAllResumes = async (userId) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching resume history:', error);
    throw error;
  }

  return data;
};
