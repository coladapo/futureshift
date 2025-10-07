✅ **PHASE 1 COMPLETE - October 6, 2025 at 3:15pm ET**
Ready for PHASE 2: Claude Integration

---

# Instructions for Claude Code

## Context
Building FutureShift for "Built with Claude Sonnet 4.5" contest. Deadline: Oct 7, 2025 9am ET (~20 hours).

## Current Status
- Project directory exists: `/Users/wivak/puo-jects/____active/futureshift`
- No React app created yet
- Planning docs ready: `claude.md`, `implementation-plan.md`

## Your Mission
Execute PHASE 1 completely autonomously. The human will not be copying/pasting terminal output. You have full control.

---

## PHASE 1 TASKS - Execute in Order

### Task 1: Create React App Properly
```bash
cd /Users/wivak/puo-jects/____active/futureshift
npx create-react-app . --template cra-template
```

**If directory not empty error:**
```bash
# Just create in subdirectory then move files
npx create-react-app temp-app
mv temp-app/* .
mv temp-app/.gitignore .
rm -rf temp-app
```

### Task 2: Install Dependencies
```bash
npm install @anthropic-ai/sdk recharts tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Task 3: Configure Tailwind
Edit `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Replace `src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Task 4: Create Project Structure
```bash
mkdir -p src/components src/services src/data
```

### Task 5: Move Files to Correct Locations
```bash
# Move Claude service
mv claudeService.js src/services/

# Move and rename CSV
mv job_postings_template.csv src/data/job_postings.csv
```

### Task 6: Create .env.local
Create `.env.local` with placeholder:
```
REACT_APP_CLAUDE_API_KEY=sk-ant-api03-your-key-here
```

### Task 7: Collect Job Postings Data
**This is critical - spend time here**

The CSV at `src/data/job_postings.csv` has 5 entries. You need to add 45 more for a total of 50.

**Strategy:**
1. Use web search to find real job postings
2. Mix of:
   - 20 traditional roles (Software Engineer, Designer, Product Manager, etc.)
   - 20 emerging roles (AI Safety Researcher, Prompt Engineer, AI Integration Specialist, etc.)
   - 10 hybrid/evolving roles (Product Designer with AI focus, Full Stack Engineer + ML, etc.)
3. Focus on Tech, Design, Marketing industries
4. Extract: title, company, brief description (2-3 sentences), key skills (comma-separated), recent date, category, salary range

**Append to** `src/data/job_postings.csv` (don't replace existing entries)

### Task 8: Create Basic App.js
Replace `src/App.js` with a simple test that loads the CSV:
```javascript
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/job_postings.csv')
      .then(r => r.text())
      .then(text => {
        console.log('CSV loaded:', text.split('\n').length, 'lines');
        setData(text);
      })
      .catch(err => console.error('Error loading CSV:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        FutureShift
      </h1>
      <p className="text-gray-600">
        {data ? `Loaded ${data.split('\n').length - 1} job postings` : 'Loading...'}
      </p>
    </div>
  );
}

export default App;
```

### Task 9: Move CSV to Public Folder
```bash
# CSV needs to be in public for fetch to work
mv src/data/job_postings.csv public/data/
mkdir -p public/data
mv src/data/job_postings.csv public/data/
```

### Task 10: Test Everything Works
```bash
npm start
```

Should open browser showing "Loaded X job postings"

### Task 11: Update Progress
Edit `implementation-plan.md`:
- Mark PHASE 1 tasks as complete ✅
- Add timestamp and notes about any issues encountered
- Set "Current Phase: PHASE 2"

---

## Success Criteria
- [ ] React app runs without errors
- [ ] Tailwind CSS working (test with some utility classes)
- [ ] CSV loads with 50 job postings
- [ ] Claude service file in correct location
- [ ] .env.local created (human will add real API key)
- [ ] implementation-plan.md updated

## Notes for Claude Code
- You have full autonomy - execute all commands
- If you encounter errors, debug and fix them yourself
- Use web search to find real job postings for the CSV
- Be thorough with the job postings data - quality matters
- Update implementation-plan.md when done so Claude Desktop knows progress

## When Complete
Add a note to the top of this file:
```
✅ PHASE 1 COMPLETE - [timestamp]
Ready for PHASE 2: Claude Integration
```

---

**GO! Execute everything above autonomously.**
