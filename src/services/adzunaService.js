/**
 * Adzuna Job API Service
 * Fetches real job postings from Adzuna's job search API
 *
 * API Docs: https://developer.adzuna.com/docs/search
 */

const ADZUNA_APP_ID = process.env.REACT_APP_ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.REACT_APP_ADZUNA_API_KEY;

// Adzuna API base URL (US market)
const BASE_URL = 'https://api.adzuna.com/v1/api/jobs/us/search';

/**
 * Fetch job postings from Adzuna
 * @param {Object} options - Search options
 * @param {string} options.query - Search query (e.g., "AI product designer")
 * @param {string} options.location - Location (e.g., "San Francisco")
 * @param {number} options.resultsPerPage - Number of results (default: 50, max: 50)
 * @param {number} options.page - Page number (default: 1)
 * @returns {Promise<Array>} - Array of job postings
 */
export const fetchJobs = async ({
  query = '',
  location = '',
  resultsPerPage = 50,
  page = 1
} = {}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_API_KEY,
      results_per_page: resultsPerPage,
      what: query,
      where: location,
      page: page
    });

    const url = `${BASE_URL}/${page}?${params}`;

    console.log('🔍 Fetching jobs from Adzuna...', { query, location, page });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log(`✅ Fetched ${data.results?.length || 0} jobs from Adzuna`);

    return data.results || [];
  } catch (error) {
    console.error('❌ Error fetching jobs from Adzuna:', error);
    throw error;
  }
};

/**
 * Extract search keywords from user background using simple keyword matching
 * This helps fetch relevant job categories based on what the user does
 */
const extractJobKeywords = (userBackground) => {
  const background = userBackground.toLowerCase();
  const keywords = [];

  // Skill/role keywords mapping - covers ALL major career fields
  const keywordMap = {
    // Design & Creative
    'design': ['product designer', 'UX designer', 'UI designer', 'graphic designer'],
    'ux': ['UX designer', 'product designer', 'user researcher'],
    'ui': ['UI designer', 'product designer'],
    'creative': ['creative director', 'graphic designer', 'art director'],
    'architect': ['architect', 'architectural designer', 'interior designer'],
    'interior design': ['interior designer', 'architect'],

    // Engineering & Development
    'engineer': ['software engineer', 'engineer', 'technical lead'],
    'developer': ['software developer', 'web developer', 'programmer'],
    'frontend': ['frontend developer', 'react developer', 'web developer'],
    'backend': ['backend developer', 'API developer', 'database engineer'],
    'full stack': ['full stack developer', 'software engineer'],
    'mobile': ['mobile developer', 'iOS developer', 'Android developer'],
    'software': ['software engineer', 'software developer', 'programmer'],

    // Data & AI
    'data': ['data scientist', 'data analyst', 'data engineer'],
    'ai': ['AI engineer', 'machine learning engineer', 'AI researcher'],
    'machine learning': ['machine learning engineer', 'AI engineer', 'data scientist'],
    'analytics': ['data analyst', 'business analyst', 'analytics manager'],

    // Business & Marketing
    'marketing': ['digital marketing', 'content marketing', 'marketing manager'],
    'product manager': ['product manager', 'product owner', 'program manager'],
    'business': ['business analyst', 'strategy consultant', 'business manager'],
    'sales': ['sales executive', 'account manager', 'business development'],
    'consultant': ['strategy consultant', 'business consultant', 'management consultant'],

    // Education & Training
    'teacher': ['teacher', 'instructor', 'education coordinator', 'online educator'],
    'education': ['education coordinator', 'instructional designer', 'teacher'],
    'professor': ['professor', 'lecturer', 'academic advisor'],
    'trainer': ['corporate trainer', 'learning specialist', 'instructor'],
    'tutor': ['tutor', 'online instructor', 'education specialist'],

    // Healthcare & Medical
    'nurse': ['nurse', 'registered nurse', 'healthcare coordinator'],
    'doctor': ['physician', 'medical doctor', 'healthcare provider'],
    'healthcare': ['healthcare administrator', 'medical coordinator', 'nurse'],
    'medical': ['medical assistant', 'healthcare coordinator', 'clinical specialist'],
    'therapy': ['therapist', 'physical therapist', 'occupational therapist'],

    // Finance & Accounting
    'accountant': ['accountant', 'financial analyst', 'bookkeeper'],
    'finance': ['financial analyst', 'finance manager', 'investment analyst'],
    'banking': ['banker', 'financial advisor', 'loan officer'],
    'accounting': ['accountant', 'tax specialist', 'financial controller'],

    // Legal & Compliance
    'lawyer': ['attorney', 'legal counsel', 'paralegal'],
    'legal': ['legal counsel', 'compliance officer', 'paralegal'],
    'attorney': ['attorney', 'legal advisor', 'corporate counsel'],

    // Hospitality & Service
    'chef': ['chef', 'cook', 'culinary specialist'],
    'hospitality': ['hospitality manager', 'hotel manager', 'event coordinator'],
    'restaurant': ['restaurant manager', 'food service manager', 'chef'],
    'hotel': ['hotel manager', 'hospitality coordinator', 'front desk manager'],

    // Manufacturing & Operations
    'manufacturing': ['manufacturing engineer', 'operations manager', 'production supervisor'],
    'operations': ['operations manager', 'logistics coordinator', 'supply chain manager'],
    'supply chain': ['supply chain manager', 'logistics coordinator', 'procurement specialist'],
    'logistics': ['logistics coordinator', 'supply chain analyst', 'warehouse manager'],

    // HR & Recruitment
    'hr': ['HR manager', 'human resources specialist', 'talent acquisition'],
    'recruiter': ['recruiter', 'talent acquisition specialist', 'HR coordinator'],
    'human resources': ['HR specialist', 'people operations', 'talent manager'],

    // Customer Service & Support
    'customer service': ['customer service representative', 'support specialist', 'client success manager'],
    'support': ['customer support', 'technical support', 'help desk specialist'],

    // Emerging Tech
    'blockchain': ['blockchain developer', 'web3 developer', 'crypto analyst'],
    'web3': ['web3 developer', 'blockchain developer', 'smart contract developer'],
    'cloud': ['cloud engineer', 'devops engineer', 'AWS architect'],
    'devops': ['devops engineer', 'cloud architect', 'site reliability engineer'],
    'security': ['cybersecurity analyst', 'security engineer', 'information security specialist']
  };

  // Find matching keywords in user background
  for (const [keyword, queries] of Object.entries(keywordMap)) {
    if (background.includes(keyword)) {
      keywords.push(...queries);
    }
  }

  // Remove duplicates
  return [...new Set(keywords)];
};

/**
 * Fetch diverse job postings across multiple categories
 * Uses user background to determine relevant categories
 */
export const fetchDiverseJobMarket = async (userBackground = '') => {
  try {
    console.log('📊 Fetching diverse job market data...');

    let categories = [];

    if (userBackground) {
      // Extract relevant keywords from user background
      const userKeywords = extractJobKeywords(userBackground);

      if (userKeywords.length > 0) {
        console.log(`🎯 Detected user interests: ${userKeywords.slice(0, 3).join(', ')}...`);

        // Use top 5 user-related categories + 5 diverse categories for market context
        categories = [
          ...userKeywords.slice(0, 5).map(query => ({ query, location: '' })),
          // Always include these for market diversity
          { query: 'AI machine learning', location: '' },
          { query: 'product designer UX', location: '' },
          { query: 'data scientist', location: '' },
          { query: 'software engineer', location: '' },
          { query: 'digital marketing', location: '' }
        ];
      }
    }

    // Fallback to default categories if no user keywords found
    if (categories.length === 0) {
      console.log('📋 Using default job categories');
      categories = [
        { query: 'AI machine learning', location: '' },
        { query: 'product designer UX', location: '' },
        { query: 'data scientist', location: '' },
        { query: 'software engineer', location: '' },
        { query: 'digital marketing', location: '' },
        { query: 'blockchain web3', location: '' },
        { query: 'devops cloud', location: '' },
        { query: 'cybersecurity', location: '' },
        { query: 'business analyst', location: '' },
        { query: 'project manager', location: '' }
      ];
    }

    // Remove duplicates
    const uniqueCategories = Array.from(
      new Map(categories.map(cat => [cat.query, cat])).values()
    ).slice(0, 10); // Limit to 10 categories max

    console.log(`🔍 Fetching jobs across ${uniqueCategories.length} categories...`);

    // Fetch 10 jobs from each category
    const jobPromises = uniqueCategories.map(category =>
      fetchJobs({ ...category, resultsPerPage: 10 })
    );

    const results = await Promise.all(jobPromises);

    // Flatten and deduplicate
    const allJobs = results.flat();
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [job.id, job])).values()
    );

    console.log(`✅ Fetched ${uniqueJobs.length} unique jobs across ${uniqueCategories.length} categories`);

    return uniqueJobs;
  } catch (error) {
    console.error('❌ Error fetching diverse job market:', error);
    throw error;
  }
};

/**
 * Transform Adzuna job format to our internal format
 * for Claude analysis
 */
export const transformJobsForAnalysis = (jobs) => {
  return jobs.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company?.display_name || 'Unknown',
    location: job.location?.display_name || 'Remote',
    description: job.description,
    category: job.category?.label || 'Other',
    created: job.created,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    contract_type: job.contract_type || 'full_time',
    url: job.redirect_url
  }));
};

/**
 * Convert jobs to CSV format for Claude analysis
 */
export const jobsToCSV = (jobs) => {
  const headers = ['title', 'company', 'location', 'description', 'category', 'salary_min', 'salary_max'];

  const rows = jobs.map(job =>
    headers.map(header => {
      const value = job[header] || '';
      // Escape quotes and wrap in quotes if contains comma
      return typeof value === 'string' && value.includes(',')
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};
