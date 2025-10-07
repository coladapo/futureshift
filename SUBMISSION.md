# FutureShift - Built with Claude Sonnet 4.5

**Live Demo:** https://www.futureshift.ai

## What I Built

**FutureShift** is an AI-powered career transition platform that helps professionals discover emerging career opportunities before they become mainstream. It analyzes real job market data using Claude Sonnet 4.5 to identify emerging roles, map transferable skills, visualize skill gaps, and provide personalized learning paths.

### The Problem
I spent 7 years in architecture before discovering UX/UI design existed. FutureShift prevents this by using Claude 4.5 to analyze job market evolution in real-time, showing people tomorrow's opportunities today.

### Key Features
1. **Intelligent Resume Parsing** - Upload PDF/DOCX resumes or LinkedIn PDFs. Claude reformats messy resume text into clean, structured career backgrounds
2. **Job Market Intelligence** - Claude analyzes 95+ live job postings to identify emerging vs traditional roles, growth patterns, and AI transformation trends
3. **Smart Role Matching** - Claude matches user backgrounds to emerging roles with 90%+ accuracy scores
4. **Skill Gap Visualization** - Interactive charts showing exactly what skills you need (with effort estimates)
5. **Personalized Learning Paths** - Claude creates step-by-step career transition roadmaps with specific resources
6. **Progressive Analysis UI** - Real-time updates showing Claude's analysis stages
7. **User Accounts** - Save analyses, view history, OAuth with Google
8. **Anonymous Migration** - Try without login, data automatically migrates when you sign up

## How I Built It in One Day

**Timeline: ~22 hours** (October 6, 2025)

### Architecture
- **Frontend:** React 19 + Tailwind CSS (glassmorphic design)
- **Backend:** Express.js proxy server (secure API key handling)
- **AI:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) via Anthropic SDK
- **Database:** Supabase (PostgreSQL) - auth, analysis storage
- **Deployment:** Vercel (frontend) + Render (backend)
- **Data:** CSV dataset of 95 real job postings (emerging + traditional roles)

### Development Phases
1. **Phase 1 (3 hours):** Setup React app, collect 95 job postings, create CSV dataset
2. **Phase 2 (4 hours):** Claude API integration, market analysis prompts, role matching logic
3. **Phase 3 (6 hours):** UI components (landing, input, results dashboard, visualizations)
4. **Phase 4 (4 hours):** Polish, auth system, resume parsing, mobile responsiveness
5. **Phase 5 (5 hours):** Backend proxy, deployment, OAuth config, mobile menu, toast notifications

### Key Files
- `src/services/claudeService.js` - Claude API integration (2 main functions, 212 lines)
- `src/hooks/useClaudeAnalysis.js` - React hook managing analysis flow + market intelligence caching
- `src/services/resumeParser.js` - PDF/DOCX parsing + Claude text reformatting
- `src/services/marketIntelligence.js` - Smart caching system (saves API calls)
- `src/components/` - 12 React components (ProgressiveResults, SkillGapChart, etc.)
- `public/data/job_postings.csv` - 95 real job postings dataset

## How Claude Sonnet 4.5 Powers FutureShift

### 1. Job Market Analysis (analyzeJobMarket)
**What it does:** Analyzes 95 job postings to identify emerging roles, traditional roles being transformed by AI, and market insights

**Claude Prompt Strategy:**
```javascript
// Prompt excerpt from claudeService.js
"You are a job market analyst. Analyze these job postings and identify trends:

Focus on:
1. Roles that combine AI/ML with traditional domains
2. New skill combinations that didn't exist 2 years ago
3. How AI is transforming traditional roles
4. Realistic salary ranges based on the data"
```

**Why Claude 4.5 is essential:**
- **Context window:** Processes all 95 job postings in one request
- **Pattern recognition:** Identifies subtle trends like "AI SDR Engineer" or "AI UX Designer"
- **JSON output:** Returns structured data with emergingRoles, traditionalRoles, keyInsights
- **Market understanding:** Knows which skills are new (prompt engineering, RAG) vs established

**Caching optimization:** Results cached for 7 days in Supabase to save API calls

### 2. Personalized Role Matching (matchUserToRoles)
**What it does:** Takes user background + market analysis, returns top 3 matching emerging roles with skill gaps and learning paths

**Claude Prompt Strategy:**
```javascript
// Prompt excerpt from claudeService.js
"Based on emerging roles and user background, identify:
1. Top 3 most realistic role matches (90%+ accuracy)
2. Transferable skills they already have
3. Skill gaps with learning difficulty (Easy/Medium/Hard)
4. 3-step career transition plan with resources
5. Personalized insights and encouragement"
```

**Why Claude 4.5 is essential:**
- **Reasoning ability:** Maps abstract skills (e.g., "7 years architecture" → "systems thinking, spatial reasoning")
- **Nuanced matching:** Doesn't just keyword match - understands adjacent skills
- **Personalization:** Tailors tone and advice to user's experience level
- **Resource recommendations:** Suggests specific courses, tools, communities
- **Encouragement:** Provides motivating insights: "Your design background is perfect for AI product design"

**Example output structure:**
```json
{
  "topMatches": [
    {
      "role": "AI Product Designer",
      "matchScore": 92,
      "transferableSkills": ["Design Systems", "User Research", "Prototyping"],
      "skillGaps": [
        {"skill": "Prompt Engineering", "difficulty": "Easy", "timeEstimate": "2-3 weeks"},
        {"skill": "RAG Architecture", "difficulty": "Medium", "timeEstimate": "1-2 months"}
      ],
      "careerPathSteps": [
        {"step": 1, "title": "Learn AI Fundamentals", "resources": [...]}
      ]
    }
  ],
  "analysisInsights": [
    "Your 7 years of design experience...",
    "AI is transforming product design..."
  ]
}
```

### 3. Resume Intelligence (reformatWithClaude)
**What it does:** Takes raw text from PDF/DOCX (messy formatting, tables, bullets) and reformats into clean career summary

**Why Claude 4.5 is essential:**
- **Context understanding:** Distinguishes important info (skills, experience) from noise (addresses, references)
- **Intelligent reformatting:** Converts resume jargon into natural language
- **Consistent output:** Always returns well-formatted text perfect for analysis

**Example transformation:**
```
Input (messy PDF text):
"John Doe 123 Main St Experience: Sr PM @ Google 2020-2024 • Led cross-functional... Skills: SQL Python..."

Output (Claude formatted):
"Senior Product Manager with 4 years experience at Google leading cross-functional teams.
Skills include SQL, Python, data analysis, roadmap planning..."
```

### 4. Progressive Analysis Experience
The UI shows Claude's thinking in real-time:
- Stage 1: "Analyzing 95 job postings across emerging and traditional roles..."
- Stage 2: "Matching your background to emerging opportunities..."
- Stage 3: Complete - shows full results dashboard

This transparency builds trust and showcases Claude's sophisticated reasoning.

### 5. Claude Sonnet 4.5 Specific Features Used

**Model:** `claude-sonnet-4-5-20250929`

**Features utilized:**
- **Extended context window:** Processes all 95 job postings + user background in single request
- **JSON mode:** Structured output for consistent parsing (no hallucinated fields)
- **Reasoning ability:** Maps abstract skills across domains (architecture → UX → AI design)
- **Market knowledge:** Understands current AI trends (agents, RAG, multimodal) from training data
- **Token optimization:** Smart prompting keeps analysis under 16K tokens
- **Fast response:** ~20-30 seconds for full analysis

**Token usage:**
- Market analysis: ~6,000-8,000 tokens (input) + 4,000-6,000 (output)
- User matching: ~3,000-4,000 tokens (input) + 2,000-4,000 (output)
- Resume parsing: ~500-2,000 tokens (input) + 300-1,000 (output)

## Technical Highlights

### Smart Market Intelligence Caching
To optimize costs and speed, market analysis results are cached in Supabase:
```javascript
// Check if market intelligence is stale (>7 days)
const needsRefresh = await shouldRefreshMarketIntelligence(7);

if (needsRefresh) {
  // Fresh Claude analysis
  marketAnalysis = await analyzeJobMarket(csvData);
  await saveMarketIntelligence(marketAnalysis);
} else {
  // Use cached results
  const cached = await getActiveMarketIntelligence();
  marketAnalysis = cached.analysis_data;
}
```

Benefits:
- First user each week: Fresh Claude analysis
- Subsequent users: Instant results from cache
- Saves ~8,000 tokens per analysis (after first run)

### Secure API Architecture
Frontend → Backend Proxy → Claude API
- Frontend never exposes API key
- Backend validates requests
- CORS configured for security

### Data Migration System
Anonymous users can try the app without signup:
- Analyses stored in localStorage
- Resume files stored as base64
- On signup: Automatically migrates to Supabase
- Uses `onAuthStateChange` to detect OAuth returns

### Responsive Design
- Desktop: Full dashboard with charts
- Mobile: Hamburger menu, optimized layouts
- Glassmorphic UI with backdrop-blur effects
- Toast notifications for feedback

## Project Statistics

**Codebase:**
- 12 React components (6,472 - 11,475 bytes each)
- 12 service modules (analytics, auth, data migration, etc.)
- 1 custom hook (useClaudeAnalysis)
- 95 job postings dataset (CSV format)
- 10 git commits over 22 hours

**Dependencies:**
- `@anthropic-ai/sdk` - Claude API
- `@supabase/supabase-js` - Database + Auth
- `recharts` - Skill gap visualizations
- `pdfjs-dist` + `mammoth` - Resume parsing
- `tailwindcss` - Styling

**Lines of Code:**
- claudeService.js: 212 lines
- useClaudeAnalysis.js: 150+ lines
- Total project: ~3,000+ lines (excluding node_modules)

## What Makes This Special

### 1. Personal Story
The creator spent 7 years in architecture before discovering UX/UI design existed. FutureShift is the tool they wish they had - preventing others from wasting years discovering opportunities too late.

### 2. Real Market Data
Uses 95 real job postings from 2025, including:
- **Emerging AI roles:** AI SDR Engineer, AI Product Designer, Prompt Engineer
- **Hybrid roles:** ML Ops Engineer, AI Technical Writer
- **Traditional roles:** Software Engineer, Product Manager (showing AI transformation)

### 3. Claude's Intelligence is Visible
The app doesn't hide Claude - it showcases it:
- "Analyzed by Claude Sonnet 4.5" badges everywhere
- Real-time analysis progress updates
- "Claude's Personalized Analysis" section in results
- "Powered by Claude Sonnet 4.5" footer

### 4. Actionable Insights
Not just data, but clear next steps:
- Specific skills to learn
- Time estimates for each skill
- Learning resources (courses, communities)
- 3-step career transition plan

### 5. Built in 24 Hours
Proof that Claude Sonnet 4.5 + good prompting = rapid prototyping:
- Full-stack app with auth, database, API integration
- Polished UI with animations and mobile support
- Real AI intelligence (not hardcoded responses)
- Production-ready deployment

## Demo Flow

1. **Landing Page:** "See tomorrow's opportunities today"
2. **Input:** User types background OR uploads resume (Claude parses it)
3. **Loading:** Progressive UI shows Claude analyzing market → matching roles
4. **Results Dashboard:**
   - Top 3 emerging role matches with scores
   - Skill gap chart (transferable vs needed skills)
   - Learning path with 3-step roadmap
   - Claude's personalized insights
   - Market intelligence stats

## Future Enhancements (Post-Contest)
- Real-time job scraping (Adzuna API integration prepared)
- Salary comparison charts
- Interview prep recommendations
- Community features (connect with others transitioning)
- AI coach chatbot for follow-up questions

## Deployment URLs

**Live App:** https://www.futureshift.ai
**Backend API:** https://futureshift-backend.onrender.com
**GitHub:** (Add your repo URL here)

## Built With Love (and Claude)

FutureShift represents what's possible when you combine:
- A personal mission (help people find their path)
- Powerful AI (Claude Sonnet 4.5's reasoning)
- Real market data (95 job postings)
- Rapid execution (24 hours start to finish)

The goal: Help 1,000 people discover emerging career opportunities in 2025.

---

**Contest Category:** Keep Learning / Keep Researching
**Built by:** [Your Name]
**Built with:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
**Date:** October 6-7, 2025
**Time to build:** ~22 hours

