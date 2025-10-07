# PHASE 3: UI Development Instructions

## Goal
Build 3 screens with complete user flow: Landing → Input → Results

---

## Component Structure

```
src/components/
├── LandingPage.jsx          (Hero + CTA)
├── InputScreen.jsx          (User background form)
├── ResultsDashboard.jsx     (Main results display)
├── RoleMatchCard.jsx        (Individual role match)
├── SkillGapChart.jsx        (Visual skill comparison)
├── LearningPath.jsx         (Step-by-step roadmap)
├── ClaudeInsights.jsx       (Show AI reasoning)
└── LoadingAnimation.jsx     (Progress indicator)
```

---

## Task 1: Landing Page (30 min)

Create `src/components/LandingPage.jsx`:

**Must have:**
- Hero headline: "Discover Tomorrow's Career Opportunities Today"
- Subheadline: "Don't waste years discovering emerging roles too late. Let Claude Sonnet 4.5 analyze the job market and show you where your skills fit in the AI-transformed future."
- Primary CTA: "Analyze My Career" (scrolls to input)
- "Powered by Claude Sonnet 4.5" badge (prominent)
- Brief value props (3-4 bullets):
  - "Identify emerging roles before they become mainstream"
  - "Map your transferable skills to new opportunities"
  - "Get personalized learning paths"
  - "Understand AI's impact on your field"

**Design notes:**
- Clean, modern gradient background
- Large, bold typography
- CTA button should be unmissable
- Include Claude logo/branding

---

## Task 2: Input Screen (45 min)

Create `src/components/InputScreen.jsx`:

**Form fields:**
```javascript
const [formData, setFormData] = useState({
  background: '',
  currentRole: '',
  yearsExperience: '',
  interests: ''
});
```

**Must have:**
- Large text area for background (placeholder with example)
- Optional fields: current role, years exp, industries interested in
- "Analyze" button (disabled until background has 50+ chars)
- "Try Sample" button (loads pre-filled example)
- Character counter (min 50 chars for quality analysis)
- Loading state with progress messages

**Sample background (getSampleBackground):**
Already in claudeService.js - use that

**Progress messages during analysis:**
```javascript
const progressSteps = [
  "Loading 50 job postings...",
  "Analyzing market trends with Claude Sonnet 4.5...",
  "Identifying emerging roles...",
  "Mapping your transferable skills...",
  "Calculating skill gaps...",
  "Generating personalized recommendations...",
  "Analysis complete!"
];
```

Cycle through these every 2-3 seconds during loading.

---

## Task 3: Results Dashboard Layout (30 min)

Create `src/components/ResultsDashboard.jsx`:

**Structure:**
```javascript
<div className="results-dashboard">
  {/* Header */}
  <div className="results-header">
    <h1>Your Emerging Role Matches</h1>
    <p className="powered-by">Analyzed by Claude Sonnet 4.5</p>
  </div>

  {/* Main Content - 4 Sections */}
  <section className="top-matches">
    <h2>Top 3 Emerging Roles for You</h2>
    {topMatches.map(match => (
      <RoleMatchCard key={match.role} match={match} />
    ))}
  </section>

  <section className="skill-analysis">
    <h2>Your Skill Gaps</h2>
    <SkillGapChart gaps={topMatch.skillGaps} />
  </section>

  <section className="learning-path">
    <h2>Recommended Learning Path</h2>
    <LearningPath steps={topMatch.careerPathSteps} />
  </section>

  <section className="claude-insights">
    <h2>Claude's Analysis</h2>
    <ClaudeInsights insights={matchResults.analysisInsights} />
  </section>
</div>
```

---

## Task 4: Role Match Card (30 min)

Create `src/components/RoleMatchCard.jsx`:

**Display:**
```javascript
<div className="role-card">
  {/* Header */}
  <div className="card-header">
    <h3>{match.role}</h3>
    <div className="match-score">
      <span className="score-value">{match.matchScore}</span>
      <span className="score-label">Match</span>
    </div>
  </div>

  {/* Match Reasons */}
  <div className="match-reasons">
    <h4>Why This Matches You</h4>
    <ul>
      {match.matchReasons.map(reason => (
        <li key={reason}>{reason}</li>
      ))}
    </ul>
  </div>

  {/* Transferable Skills */}
  <div className="transferable-skills">
    <h4>Your Transferable Skills</h4>
    <div className="skill-tags">
      {match.transferableSkills.map(skill => (
        <span className="skill-tag" key={skill}>{skill}</span>
      ))}
    </div>
  </div>

  {/* Quick Stats */}
  <div className="card-footer">
    <span>Transition Time: {match.estimatedTransitionTime}</span>
    <span>Salary: {match.salaryProjection}</span>
  </div>
</div>
```

**Styling:**
- Card with subtle shadow
- Match score should be prominent (large number)
- Use color coding: 80-100 = green, 60-79 = yellow, <60 = orange
- Hover effect for interactivity

---

## Task 5: Skill Gap Visualization (45 min)

Create `src/components/SkillGapChart.jsx`:

Use Recharts BarChart:
```javascript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SkillGapChart = ({ gaps }) => {
  // Transform data for chart
  const chartData = gaps.map(gap => ({
    skill: gap.skill,
    priority: gap.priority === 'high' ? 3 : gap.priority === 'medium' ? 2 : 1,
    timeToLearn: gap.timeToLearn,
    fill: gap.priority === 'high' ? '#ef4444' : gap.priority === 'medium' ? '#f59e0b' : '#10b981'
  }));

  return (
    <div className="skill-gap-chart">
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="skill" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="priority" fill="#8884d8" />
      </BarChart>
      
      {/* Legend */}
      <div className="priority-legend">
        <span className="high">🔴 High Priority</span>
        <span className="medium">🟡 Medium Priority</span>
        <span className="low">🟢 Low Priority</span>
      </div>
      
      {/* Details */}
      <div className="skill-details">
        {gaps.map(gap => (
          <div key={gap.skill} className="skill-detail">
            <strong>{gap.skill}</strong>
            <span>{gap.timeToLearn}</span>
            <p>{gap.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Task 6: Learning Path Timeline (30 min)

Create `src/components/LearningPath.jsx`:

**Visual timeline:**
```javascript
<div className="learning-path">
  <div className="timeline">
    {steps.map((step, index) => (
      <div key={index} className="timeline-item">
        <div className="timeline-marker">{index + 1}</div>
        <div className="timeline-content">
          <h4>{step.split(':')[0]}</h4>
          <p>{step.split(':')[1]}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

**Styling:**
- Vertical timeline with connecting line
- Numbered markers
- Each step clearly separated
- Timeline should feel like a roadmap

---

## Task 7: Claude Insights Callout (20 min)

Create `src/components/ClaudeInsights.jsx`:

```javascript
<div className="claude-insights">
  <div className="insights-header">
    <img src="/claude-logo.png" alt="Claude" />
    <h3>Claude Sonnet 4.5's Analysis</h3>
  </div>
  
  <div className="insights-list">
    {insights.map((insight, index) => (
      <div key={index} className="insight-item">
        <span className="insight-icon">💡</span>
        <p>{insight}</p>
      </div>
    ))}
  </div>
  
  <div className="methodology">
    <details>
      <summary>How Claude analyzed this</summary>
      <p>
        Claude Sonnet 4.5 analyzed 50 job postings, identified emerging role patterns,
        mapped your skills and experience, calculated transferability scores, and
        generated personalized recommendations based on market trends and your background.
      </p>
    </details>
  </div>
</div>
```

**Make it special:**
- Distinctive styling (maybe bordered, colored bg)
- Claude branding visible
- Shows the "behind the scenes" thinking
- This is where you showcase Claude's intelligence

---

## Task 8: Loading Animation (20 min)

Create `src/components/LoadingAnimation.jsx`:

```javascript
const LoadingAnimation = ({ progress }) => {
  return (
    <div className="loading-container">
      {/* Animated spinner */}
      <div className="spinner"></div>
      
      {/* Progress text */}
      <p className="progress-text">{progress}</p>
      
      {/* Fun facts */}
      <div className="loading-facts">
        <p className="fact">💡 Did you know?</p>
        <p className="fact-text">
          {randomFact()}
        </p>
      </div>
    </div>
  );
};

const facts = [
  "73% of jobs in 2030 don't exist yet",
  "The average person changes careers 5-7 times in their lifetime",
  "AI is creating more jobs than it eliminates",
  "Prompt engineering didn't exist as a job title in 2020"
];
```

---

## Task 9: Wire Everything Together (45 min)

Update `src/App.js`:

```javascript
import { useState } from 'react';
import LandingPage from './components/LandingPage';
import InputScreen from './components/InputScreen';
import ResultsDashboard from './components/ResultsDashboard';
import LoadingAnimation from './components/LoadingAnimation';
import { useClaudeAnalysis } from './hooks/useClaudeAnalysis';

function App() {
  const [screen, setScreen] = useState('landing'); // landing, input, loading, results
  const { analyze, loading, error, results, progress } = useClaudeAnalysis();

  const handleAnalyze = async (userBackground) => {
    setScreen('loading');
    
    try {
      // Load CSV
      const csvResponse = await fetch('/data/job_postings.csv');
      const csvData = await csvResponse.text();
      
      // Analyze
      await analyze(userBackground, csvData);
      setScreen('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setScreen('input'); // Go back to input on error
    }
  };

  return (
    <div className="app">
      {screen === 'landing' && (
        <LandingPage onGetStarted={() => setScreen('input')} />
      )}
      
      {screen === 'input' && (
        <InputScreen onAnalyze={handleAnalyze} />
      )}
      
      {screen === 'loading' && (
        <LoadingAnimation progress={progress} />
      )}
      
      {screen === 'results' && results && (
        <ResultsDashboard 
          matchResults={results.matchResults}
          marketAnalysis={results.marketAnalysis}
          onAnalyzeAgain={() => setScreen('input')}
        />
      )}
      
      {error && (
        <div className="error-banner">{error}</div>
      )}
    </div>
  );
}
```

---

## Styling Guidelines

**Use Tailwind classes:**
- Consistent spacing: `p-8, m-4, gap-6`
- Color scheme: 
  - Primary: blue-600
  - Success: green-500
  - Warning: yellow-500
  - Danger: red-500
  - Background: gray-50
  - Cards: white with shadow
- Typography:
  - Headers: `text-3xl font-bold text-gray-900`
  - Body: `text-base text-gray-700`
  - Subtle: `text-sm text-gray-500`

**Key design principles:**
- Clean, spacious layouts (white space is good)
- Clear visual hierarchy
- Prominent CTAs
- Loading states for everything async
- Mobile responsive (use Tailwind's responsive classes)

---

## Success Criteria

- [ ] Landing page is compelling (would YOU click it?)
- [ ] Input screen is clear and easy to use
- [ ] Sample persona loads instantly
- [ ] Loading animation shows progress clearly
- [ ] Results dashboard is scannable (can understand in 10 seconds)
- [ ] Role cards are visually appealing
- [ ] Skill gap chart is readable
- [ ] Learning path feels actionable
- [ ] Claude's intelligence is visible throughout
- [ ] No layout breaks on different screen sizes
- [ ] All transitions are smooth
- [ ] Error states handled gracefully

---

## When Complete

Test the full flow 3 times:
1. With sample persona
2. With your own background
3. With a completely different persona

Update `implementation-plan.md` with:
```
✅ PHASE 3 COMPLETE - [timestamp]
- All 3 screens working
- User flow smooth
- Visuals polished
- Claude branding visible
Ready for PHASE 4: Polish & Demo Prep
```
