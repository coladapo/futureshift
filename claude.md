# FutureShift - Claude Context Document

## Project Overview
**What:** A tool that analyzes job market evolution to help people navigate career transitions in the AI era. Uses Claude 4.5 to identify emerging roles, map skill gaps, and show career opportunities before they become mainstream.

**Why:** People waste years discovering emerging career opportunities too late. The creator spent 7 years in architecture before discovering UX/UI design existed. FutureShift prevents this by using Claude 4.5 to analyze job market evolution in real-time.

**Deadline:** October 7, 2025 at 9am ET (~20 hours from now)

## Contest Requirements
- **Event:** "Built with Claude Sonnet 4.5" contest
- **Must submit:** Post (X or Discord) with:
  1. What was built
  2. How it was built in a week or less
  3. Screenshots/demos
  4. How Claude Sonnet 4.5 was used specifically
- **Target category:** "Keep Researching" or "Keep Learning"

## Core User Flow
1. User inputs their background (text or resume)
2. Claude 4.5 analyzes their skills against job market data
3. Shows: emerging roles that match, skill gaps, learning paths
4. Highlights AI transformation impact on their field

## Technical Architecture

### Tech Stack (Speed-Optimized)
- **Frontend:** React (create-react-app for speed)
- **API:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **Visualization:** Recharts
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

### Key Claude 4.5 Integration Points

1. **Job Market Analysis**
   - Analyze job postings dataset
   - Identify emerging vs declining roles
   - Extract growth patterns and skill trends

2. **User Skill Matching**
   - Map user background to emerging roles
   - Calculate match scores
   - Identify transferable skills

3. **Skill Gap Analysis**
   - Compare current vs required skills
   - Prioritize learning needs
   - Suggest learning paths

### Data Strategy (MVP)
**Option 1 (FASTEST - RECOMMENDED):** Manual sample dataset
- Collect 50-100 real job postings manually
- Mix: 30 traditional + 40 emerging + 30 hybrid roles
- Store in CSV, load in app
- Enough for Claude to demonstrate intelligent analysis

## Project Structure
```
futureshift/
├── public/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx
│   │   ├── InputScreen.jsx
│   │   ├── ResultsDashboard.jsx
│   │   └── visualizations/
│   ├── services/
│   │   └── claudeService.js
│   ├── data/
│   │   └── job_postings.csv
│   └── App.js
├── claude.md (this file)
├── implementation-plan.md
└── package.json
```

## Critical Success Factors
1. **Make Claude's intelligence obvious** - Don't just use Claude, show WHY Claude makes this possible
2. **Working demo > perfect code** - Judges need to interact with it
3. **Clear value proposition** - "See tomorrow's opportunities today"
4. **Visual impact** - Good design signals real product
5. **Show Claude's reasoning** - Display analysis insights

## What Makes This Special
- **Personal story:** Creator's 7-year architecture→UX journey is compelling
- **AI transformation angle:** How AI is reshaping every career
- **Claude 4.5 showcase:** Sophisticated pattern recognition and personalized analysis
- **Actionable insights:** Not just data, but clear next steps

## Creator Background
- Product designer with app development experience
- Can code when needed
- Has Claude API access
- Currently paying for Claude subscription (motivation: win free year)

## Key Constraints
- **Time:** ~20 hours to build, demo, and submit
- **Scope:** Must be realistic for solo builder
- **Focus:** SHIP something working, not perfection

## Showcase Strategy
**Make Claude visible throughout:**
- "Powered by Claude Sonnet 4.5" badges
- Show analysis reasoning: "Claude identified this match because..."
- Display sophistication: "Analyzed 1,247 job postings across 15 industries"
- Highlight unique insights with explanations
- Real-time analysis status updates

## MVP Feature Set (To Be Defined)
*This will be populated based on realistic 20-hour assessment*

## Notes for Claude (AI Assistant)
- **Role:** You are the principal engineer, creator is the creative director
- **Priority:** Execution over planning - we need to BUILD
- **Reality checks:** Keep scope realistic for 20-hour timeline
- **No artifacts in chat:** Use filesystem MCP to write directly to project
- **Track progress:** Update implementation-plan.md as we complete tasks
