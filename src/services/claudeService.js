// Services for Claude API Integration
// Model: claude-sonnet-4-5-20250929

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true, // Note: For demo purposes only. In production, use a backend API.
});

/**
 * Analyze job market data to identify emerging roles, declining roles, and trends
 * @param {string} csvData - Raw CSV string of job postings
 * @returns {Promise<Object>} Analysis results with emergingRoles, insights, etc.
 */
export const analyzeJobMarket = async (csvData) => {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 16000,
      messages: [{
        role: "user",
        content: `You are a job market analyst. Analyze these job postings and identify trends:

${csvData}

Provide analysis in this JSON format (respond with ONLY valid JSON, no markdown):
{
  "emergingRoles": [
    {
      "title": "Role title",
      "growthIndicators": "why this is emerging",
      "numberOfPostings": 0,
      "keySkills": ["skill1", "skill2"],
      "salaryRange": "$XXk-YYk",
      "whyEmerging": "detailed explanation",
      "exampleCompanies": ["company1", "company2"]
    }
  ],
  "traditionalRoles": [
    {
      "title": "Role title",
      "evolutionNote": "how AI is changing this role"
    }
  ],
  "keyInsights": [
    "insight about skill trends",
    "insight about AI transformation",
    "insight about career paths"
  ]
}

Focus on:
1. Roles that combine AI/ML with traditional domains
2. New skill combinations that didn't exist 2 years ago
3. How AI is transforming traditional roles
4. Realistic salary ranges based on the data`
      }]
    });
    
    // Parse the response
    const responseText = message.content[0].text;
    
    // Remove markdown code blocks if present
    const jsonText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error analyzing job market:', error);
    throw new Error('Failed to analyze job market. Please try again.');
  }
};

/**
 * Match user background to emerging roles and provide personalized insights
 * @param {string} userBackground - User's career background and skills
 * @param {Object} marketAnalysis - Results from analyzeJobMarket
 * @returns {Promise<Object>} Personalized match results
 */
export const matchUserToRoles = async (userBackground, marketAnalysis) => {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8000,
      messages: [{
        role: "user",
        content: `User background:
${userBackground}

Emerging roles identified:
${JSON.stringify(marketAnalysis.emergingRoles, null, 2)}

Analyze which emerging roles best match this user's background. Consider:
1. Direct skill transferability
2. Industry/domain knowledge overlap
3. Career trajectory alignment
4. Learning curve feasibility

Return ONLY valid JSON (no markdown):
{
  "topMatches": [
    {
      "role": "role title",
      "matchScore": 85,
      "matchReasons": [
        "specific reason based on user background",
        "another specific reason"
      ],
      "transferableSkills": ["skill1", "skill2"],
      "skillGaps": [
        {
          "skill": "skill name",
          "priority": "high",
          "timeToLearn": "2-3 months",
          "reasoning": "why this skill is needed"
        }
      ],
      "careerPathSteps": [
        "Immediate: action to take now",
        "Short-term (3-6 months): next steps",
        "Long-term (6-12 months): final steps"
      ],
      "estimatedTransitionTime": "6-9 months",
      "salaryProjection": "$XXk-YYk"
    }
  ],
  "analysisInsights": [
    "Why Claude thinks this path is viable for this user",
    "Unique transferable skills identified",
    "Potential challenges to be aware of"
  ]
}`
      }]
    });
    
    const responseText = message.content[0].text;
    const jsonText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error matching user to roles:', error);
    throw new Error('Failed to match user to roles. Please try again.');
  }
};

/**
 * Sample personas for demo purposes
 */
export const samplePersonas = [
  {
    name: "Architecture → UX Designer",
    background: `I'm a product designer with 7 years of experience in architecture and 3 years in UX/UI design.

Skills: Figma, user research, prototyping, design systems, spatial design, 3D modeling (Rhino, SketchUp), visual communication, stakeholder management.

Looking to: Explore how AI is transforming design roles and what new opportunities might be emerging at the intersection of design and AI.

Industries interested in: Tech, AI/ML companies, design tools, creative software.`
  },
  {
    name: "Marketing Professional",
    background: `I'm a digital marketing manager with 10 years of experience in B2B SaaS marketing. Recently fascinated by AI-powered marketing tools and want to explore emerging roles.

Skills: Content strategy, SEO/SEM, marketing automation (HubSpot, Marketo), data analytics, campaign management, copywriting, social media strategy, A/B testing.

Looking to: Understand how AI is reshaping marketing and discover new career paths at the intersection of marketing and AI/automation.

Industries interested in: MarTech, AI companies, growth-stage startups, marketing agencies.`
  },
  {
    name: "Software Engineer",
    background: `I'm a full-stack software engineer with 5 years of experience building web applications. Curious about transitioning into AI/ML roles and emerging tech positions.

Skills: JavaScript/TypeScript, React, Node.js, Python, PostgreSQL, API design, cloud platforms (AWS), git, agile methodologies, problem-solving.

Looking to: Pivot toward AI/ML engineering, understand what skills I need to develop, and identify realistic transition paths.

Industries interested in: AI/ML companies, tech startups, research labs, developer tools.`
  }
];

/**
 * Get sample user background for demo purposes
 * @param {number} index - Index of persona to return (0, 1, or 2)
 */
export const getSampleBackground = (index = 0) => {
  return samplePersonas[index]?.background || samplePersonas[0].background;
};
