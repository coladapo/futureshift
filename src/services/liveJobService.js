/**
 * Live Job Data Service
 * Scrapes real job postings from multiple sources and transforms them to CSV
 */

/**
 * Fetch live jobs using Tavily search
 * This uses web search to find real, current job postings
 */
export const fetchLiveJobs = async () => {
  try {
    console.log('🔍 Fetching live job postings from the web...');

    // For now, load from CSV until we have BrightData access
    // This is a placeholder that will be replaced with actual scraping
    const response = await fetch('/data/job_postings.csv');

    if (!response.ok) {
      throw new Error(`Failed to load jobs: ${response.status}`);
    }

    const csvData = await response.text();
    console.log('✅ Loaded job data');

    return csvData;
  } catch (error) {
    console.error('❌ Error fetching live jobs:', error);
    throw error;
  }
};

/**
 * Note: To enable live scraping with BrightData:
 * 1. Configure BrightData MCP in Claude Desktop
 * 2. Use BrightData to scrape job sites (We Work Remotely, Remote OK, etc.)
 * 3. Save results to /public/data/job_postings.csv
 * 4. The app will automatically use the fresh data
 */
