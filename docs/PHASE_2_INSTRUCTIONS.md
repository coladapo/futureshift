# PHASE 2: Claude Integration Instructions

## Current Status
Claude Code is testing the API connection. Continue with these tasks:

---

## Task 1: Test Claude API Connection ⏳ IN PROGRESS

Create `src/services/testClaude.js`:
```javascript
import { analyzeJobMarket, matchUserToRoles, getSampleBackground } from './claudeService';
import jobPostingsCSV from '../data/job_postings.csv';

export const testClaudeIntegration = async () => {
  console.log('🧪 Testing Claude API Integration...\n');
  
  try {
    // Test 1: Load CSV
    console.log('📂 Loading job postings CSV...');
    const csvResponse = await fetch('/data/job_postings.csv');
    const csvData = await csvResponse.text();
    console.log(`✅ Loaded ${csvData.split('\n').length - 1} job postings\n`);
    
    // Test 2: Analyze Job Market
    console.log('🔍 Testing analyzeJobMarket()...');
    const marketAnalysis = await analyzeJobMarket(csvData);
    console.log('✅ Market Analysis Complete:');
    console.log(`   - ${marketAnalysis.emergingRoles.length} emerging roles identified`);
    console.log(`   - ${marketAnalysis.keyInsights.length} key insights generated`);
    console.log('\n📊 Sample Emerging Role:', marketAnalysis.emergingRoles[0]);
    console.log('\n💡 Sample Insight:', marketAnalysis.keyInsights[0]);
    
    // Test 3: Match User to Roles
    console.log('\n👤 Testing matchUserToRoles()...');
    const sampleBackground = getSampleBackground();
    const matchResults = await matchUserToRoles(sampleBackground, marketAnalysis);
    console.log('✅ User Matching Complete:');
    console.log(`   - ${matchResults.topMatches.length} top matches found`);
    console.log('\n🎯 Top Match:', matchResults.topMatches[0].role);
    console.log(`   Match Score: ${matchResults.topMatches[0].matchScore}/100`);
    console.log(`   Transferable Skills: ${matchResults.topMatches[0].transferableSkills.join(', ')}`);
    
    console.log('\n✅ ALL TESTS PASSED - Claude integration working!\n');
    
    return {
      marketAnalysis,
      matchResults,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      error: error.message,
      success: false
    };
  }
};
```

Then add test button to App.js temporarily to verify everything works.

---

## Task 2: Verify Output Quality

**Critical Check:** Look at the Claude responses. Are they:
- [ ] Returning valid JSON (no markdown wrapping)
- [ ] Identifying genuinely emerging roles (AI-related, new skill combos)
- [ ] Providing thoughtful match scores (not just generic)
- [ ] Giving specific, actionable skill gaps
- [ ] Including realistic timelines and salary ranges

**If output quality is poor:** Adjust prompts in `claudeService.js` to be more specific.

---

## Task 3: Add Error Handling & Loading States

Create `src/utils/apiHelpers.js`:
```javascript
export const withRetry = async (fn, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

export const handleClaudeError = (error) => {
  if (error.message.includes('rate limit')) {
    return 'API rate limit reached. Please try again in a moment.';
  }
  if (error.message.includes('API key')) {
    return 'Invalid API key. Please check your .env.local file.';
  }
  return 'Analysis failed. Please try again.';
};
```

---

## Task 4: Create Analysis Hook

Create `src/hooks/useClaudeAnalysis.js`:
```javascript
import { useState } from 'react';
import { analyzeJobMarket, matchUserToRoles } from '../services/claudeService';
import { withRetry, handleClaudeError } from '../utils/apiHelpers';

export const useClaudeAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState('');

  const analyze = async (userBackground, csvData) => {
    setLoading(true);
    setError(null);
    setProgress('Loading job market data...');

    try {
      // Step 1: Analyze job market
      setProgress('Analyzing job market trends with Claude Sonnet 4.5...');
      const marketAnalysis = await withRetry(() => analyzeJobMarket(csvData));
      
      // Step 2: Match user to roles
      setProgress('Matching your skills to emerging roles...');
      const matchResults = await withRetry(() => 
        matchUserToRoles(userBackground, marketAnalysis)
      );
      
      setProgress('Analysis complete!');
      setResults({
        marketAnalysis,
        matchResults
      });
      
      return { marketAnalysis, matchResults };
      
    } catch (err) {
      const errorMessage = handleClaudeError(err);
      setError(errorMessage);
      console.error('Analysis error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, results, progress };
};
```

---

## Task 5: Create Results Data Structure

Create `src/utils/resultsFormatter.js`:
```javascript
export const formatMatchResults = (matchResults) => {
  if (!matchResults?.topMatches) return null;

  return {
    topMatches: matchResults.topMatches.map(match => ({
      ...match,
      // Format for display
      matchScoreFormatted: `${match.matchScore}%`,
      transitionTimeFormatted: match.estimatedTransitionTime,
      skillGapsSorted: match.skillGaps.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
    })),
    insights: matchResults.analysisInsights || []
  };
};

export const formatSkillGapsForChart = (skillGaps) => {
  return skillGaps.map(gap => ({
    skill: gap.skill,
    priority: gap.priority === 'high' ? 3 : gap.priority === 'medium' ? 2 : 1,
    timeToLearn: gap.timeToLearn,
    color: gap.priority === 'high' ? '#ef4444' : gap.priority === 'medium' ? '#f59e0b' : '#10b981'
  }));
};
```

---

## Task 6: Update Implementation Plan

When tests pass, update `implementation-plan.md`:
- Mark PHASE 2 tasks as [✅]
- Add notes about any prompt adjustments made
- Record example output quality
- Note API response times
- Set status to "PHASE 3: UI Development"

---

## Success Criteria for Phase 2

- [ ] Claude API connects successfully
- [ ] `analyzeJobMarket()` returns quality emerging roles (5-10 roles)
- [ ] `matchUserToRoles()` returns personalized matches with scores
- [ ] JSON parsing works reliably (no markdown wrappers)
- [ ] Error handling catches API failures gracefully
- [ ] Loading states implemented for UI use
- [ ] Results are formatted and ready for display
- [ ] Test confirms entire flow works end-to-end

---

## If You Encounter Issues

**Problem: API key not working**
→ Double-check `.env.local` has correct key format
→ Restart dev server after adding key

**Problem: JSON parsing fails**
→ Claude might be wrapping JSON in markdown
→ The service already strips ```json``` but verify

**Problem: Poor quality responses**
→ Adjust prompts to be more specific
→ Add examples in prompts
→ Increase max_tokens if needed

**Problem: Rate limits**
→ Add delays between calls
→ Implement retry logic (already in apiHelpers)

---

## When Complete

Add to this file:
```
✅ PHASE 2 COMPLETE - [timestamp]
- analyzeJobMarket() working: [Y/N]
- matchUserToRoles() working: [Y/N]
- Example emerging role: [role name]
- Example match score: [score]
Ready for PHASE 3: UI Development
```
