/**
 * CSV Job Data Service
 * Loads job postings from CSV file
 */

/**
 * Load jobs from CSV file
 * @returns {Promise<string>} - CSV data as string
 */
export const loadJobsFromCSV = async () => {
  try {
    console.log('📊 Loading jobs from CSV file...');

    // Fetch the CSV file from public directory
    const response = await fetch('/data/job_postings.csv');

    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }

    const csvData = await response.text();
    console.log(`✅ Loaded CSV data (${csvData.length} characters)`);

    return csvData;
  } catch (error) {
    console.error('❌ Error loading CSV:', error);
    throw error;
  }
};
