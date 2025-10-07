# FutureShift Implementation Plan
**Deadline:** October 7, 2025 at 9am ET
**Time Remaining:** ~20 hours
**Status:** ✅ PHASE 1 COMPLETE

---

## REALITY CHECK: 20-Hour MVP Scope

### ✅ MUST HAVE (Core Demo)
- [✅] Single-page React app with 3 screens
- [✅] Sample dataset (50 job postings - manually collected)
- [ ] Claude 4.5 API integration (2-3 key analyses)
- [ ] Basic results display with visualizations
- [ ] Working demo deployed to Vercel
- [ ] Contest submission post with screenshots

### ❌ CUT FOR MVP
- Resume upload (just text input)
- Multiple personas/samples (1-2 max)
- Complex visualizations (keep it simple)
- User accounts/saving
- Real-time scraping
- Mobile optimization (responsive is enough)

---

## Hour-by-Hour Build Plan

### PHASE 1: Foundation & Data (Hours 1-4) ✅ COMPLETE
**Goal:** Project setup + sample data ready

- [✅] **Hour 1: Project Setup**
  - [✅] `npx create-react-app futureshift`
  - [✅] Install dependencies: `@anthropic-ai/sdk recharts tailwindcss`
  - [✅] Configure Tailwind (downgraded to v3.4.1 for CRA compatibility)
  - [✅] Create basic file structure
  - [✅] Set up .env with Claude API key

- [✅] **Hours 2-4: Data Collection**
  - [✅] Manually collect 50 job postings (researched and compiled)
  - [✅] Focus: 20 traditional + 20 emerging + 10 hybrid
  - [✅] Industries: Tech, Design, Marketing
  - [✅] Create CSV: title, company, description, skills, date, category
  - [✅] Test CSV loads correctly

**Deliverable:** ✅ Project runs locally at http://localhost:3000, CSV with 50 job postings loads successfully

**Completed:** October 6, 2025 at 3:15pm ET
**Notes:**
- Had to downgrade Tailwind from v4 to v3.4.1 for CRA compatibility
- Successfully compiled 50 diverse job postings across emerging and traditional roles
- App displays "Loaded 50 job postings" confirming data integration works

---

### PHASE 2: Claude Integration (Hours 5-9) ✅ COMPLETE
**Goal:** Core AI analysis working

- [✅] **Hour 5: Claude Service Setup**
  - [✅] Create `services/claudeService.js`
  - [✅] Test basic API connection
  - [✅] Implement error handling

- [✅] **Hours 6-7: Job Market Analysis**
  - [✅] Write `analyzeJobMarket()` function
  - [✅] Craft prompt for emerging role identification
  - [✅] Test with sample CSV
  - [✅] Parse JSON response
  - [✅] Verify output quality

- [✅] **Hours 8-9: User Matching**
  - [✅] Write `matchUserToRoles()` function
  - [✅] Craft prompt for skill matching
  - [✅] Test with sample user background
  - [✅] Handle skill gap analysis
  - [✅] Verify match scores make sense

**Deliverable:** ✅ Claude Sonnet 4.5 returns quality analysis for test inputs

**Completed:** October 6, 2025 at 3:45pm ET
**Results:**
- Successfully analyzed 47 job postings
- Identified 13 emerging roles (AI Safety Researcher, Prompt Engineer, Conversational AI Designer, etc.)
- Identified 12 traditional roles with AI evolution notes
- Generated 12 key market insights
- User matching: 92% match score for Conversational AI Designer (sample user)
- Both functions tested and working perfectly
- Results saved in test-results.json for UI development reference

---

### PHASE 3: UI Development (Hours 10-15) ✅ COMPLETE
**Goal:** Functional UI with data flow

- [✅] **Hour 10: Landing Page**
  - [✅] Hero section with value prop
  - [✅] Simple CTA button
  - [✅] Brief "How it works"
  - [✅] "Powered by Claude 4.5" badge

- [✅] **Hours 11-12: Input Screen**
  - [✅] Text area for background
  - [✅] Simple form (current role, years exp, interests)
  - [✅] Sample background button (pre-fill for demo)
  - [✅] "Analyze" button with loading state

- [✅] **Hours 13-15: Results Dashboard**
  - [✅] Section 1: Top 3 emerging role matches
    - Cards with match scores
    - Transferable skills list
    - "Why this matches" explanation
  - [✅] Section 2: Skill gap visualization (simple bar chart)
  - [✅] Section 3: Learning path (ordered list)
  - [✅] "Claude's Analysis" callout showing reasoning

**Deliverable:** ✅ Complete user flow works end-to-end

**Completed:** October 6, 2025 at 4:30pm ET
**Components Created:**
- LandingPage.jsx - Hero with gradient, value props, Claude branding
- InputScreen.jsx - Form with validation, character counter, sample loader
- LoadingAnimation.jsx - Spinner with progress steps and fun facts
- ResultsDashboard.jsx - Main results layout with all sections
- RoleMatchCard.jsx - Individual role cards with match scores and stats
- SkillGapChart.jsx - Recharts bar chart with priority coloring
- LearningPath.jsx - Timeline-style roadmap
- ClaudeInsights.jsx - Expandable analysis callout
- useClaudeAnalysis.js - Hook for managing analysis state

**Status:** App compiling successfully at http://localhost:3000
All components render without errors

---

### PHASE 4: Polish & Demo Prep (Hours 16-18)
**Goal:** Contest-ready demo

- [ ] **Hour 16: Visual Polish**
  - [ ] Consistent styling with Tailwind
  - [ ] Add transitions/animations (subtle)
  - [ ] Ensure responsive (desktop first, mobile ok)
  - [ ] Loading states with progress messages

- [ ] **Hour 17: Demo Features**
  - [ ] "Try Sample" button (1-2 pre-loaded personas)
  - [ ] Clear Claude 4.5 branding throughout
  - [ ] Show analysis sophistication visibly
  - [ ] Add interesting stats/facts

- [ ] **Hour 18: Testing & Fixes**
  - [ ] Test complete flow 3+ times
  - [ ] Fix any bugs
  - [ ] Test with different inputs
  - [ ] Verify all API calls work

**Deliverable:** Bug-free demo ready to deploy

---

### PHASE 5: Deploy & Document (Hours 19-20)
**Goal:** Submitted to contest

- [ ] **Hour 19: Deployment**
  - [ ] Deploy to Vercel
  - [ ] Test production build
  - [ ] Verify Claude API works in prod
  - [ ] Test from mobile device
  - [ ] Capture final URL

- [ ] **Hour 20: Contest Submission**
  - [ ] Take 4-5 key screenshots:
    - Landing page
    - Input screen with sample
    - Results dashboard (top matches)
    - Skill gap visualization
    - "Claude's analysis" detail
  - [ ] Write submission post (300-500 words)
  - [ ] Record 2-min demo video (optional but recommended)
  - [ ] Post before deadline (9am ET)

**Deliverable:** Submission posted ✅

---

## Key Technical Decisions

### Data Format (CSV)
```csv
title,company,description,skills,date_posted,category,salary_range
"AI Safety Researcher","Anthropic","...","Python,ML,Ethics","2025-09-15","emerging","$180k-$250k"
```

### Claude Prompts (2 Main Functions)

**1. analyzeJobMarket(csvData)**
- Input: Full CSV string
- Output: JSON with emergingRoles[], decliningRoles[], insights[]
- Emphasis: Growth patterns, skill combinations, why roles are emerging

**2. matchUserToRoles(userBackground, emergingRoles)**
- Input: User text + analyzed roles
- Output: JSON with topMatches[] including matchScore, transferableSkills[], skillGaps[], learningPath[]
- Emphasis: Personalization, realistic transitions, actionable steps

### Visualization Strategy
- **Simple:** Use Recharts BarChart for skill gaps (have vs need)
- **Avoid:** Complex radar charts, animated graphs (time sink)
- **Focus:** Clear data presentation over fancy visuals

---

## Progress Tracking

### Status Legend
- [ ] Not Started
- [🏗️] In Progress
- [✅] Complete
- [⏭️] Skipped (out of scope)

### Current Phase: **PHASE 4 - POLISH & DEMO PREP**
Last Updated: October 6, 2025 at 4:30pm ET

---

## Critical Reminders

1. **Don't over-engineer** - Simple working demo > complex broken one
2. **Claude is the star** - Make AI intelligence visible throughout
3. **Cut features ruthlessly** - 20 hours goes fast
4. **Test early, test often** - Don't save testing for end
5. **Document as you go** - Screenshots during dev, not after
6. **Deploy early** - Don't wait until hour 19
7. **Time-box everything** - Move on if stuck > 30 min

---

## Emergency Cuts (If Running Behind)

Priority order for cutting features:
1. ~~Multiple sample personas~~ → Just 1
2. ~~Learning path visualization~~ → Simple list
3. ~~Video demo~~ → Screenshots only
4. ~~Mobile polish~~ → Desktop only
5. ~~Complex charts~~ → Simple lists/numbers

---

## Success Criteria

**Minimum viable submission:**
- ✅ Demo works end-to-end without errors
- ✅ Claude 4.5 generates intelligent analysis
- ✅ Results are visually clear and compelling
- ✅ Submission post tells the story
- ✅ Posted before deadline

**Stretch goals (if time allows):**
- Video demo
- Multiple sample personas
- Advanced visualizations
- Mobile optimization

---

## Notes Section
*Use this space to track decisions, blockers, learnings as we build*

