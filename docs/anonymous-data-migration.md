# Anonymous User Data Migration System

## Overview
The anonymous data migration system allows users to try FutureShift without creating an account, then seamlessly migrate all their data (resume uploads and career analyses) to their account when they sign up or sign in.

## Why This Matters
- **Frictionless onboarding**: Users can start immediately without sign-up barriers
- **Zero data loss**: Everything they create anonymously is preserved
- **Better data collection**: More users will try the app, and those who sign up retain their data
- **Career insights**: We can track career evolution from anonymous exploration to authenticated commitment

## Architecture

### Storage Keys
```javascript
const STORAGE_KEYS = {
  RESUME_FILE: 'futureshift_anonymous_resume_file',      // Base64 encoded file
  RESUME_TEXT: 'futureshift_anonymous_resume_text',      // Claude-parsed text
  RESUME_FILENAME: 'futureshift_anonymous_resume_filename', // Original filename
  ANALYSES: 'futureshift_anonymous_analyses',             // Array of analyses
};
```

### User Flow

#### 1. Anonymous User Journey
```
User uploads resume (anonymous)
  ↓
Resume parsed with Claude AI
  ↓
Saved to localStorage
  ├─ File (base64)
  ├─ Parsed text
  └─ Filename
  ↓
User runs career analysis
  ↓
Analysis saved to localStorage array
```

#### 2. Sign-Up/Sign-In Migration
```
User creates account or signs in
  ↓
Check: hasAnonymousData()?
  ↓ (yes)
migrateAnonymousData(userId)
  ├─ Convert base64 → File
  ├─ Upload to Supabase Storage
  ├─ Save to resumes table
  ├─ Save analyses to career_analyses
  └─ Clear localStorage
  ↓
User sees all their data in account
```

## Implementation Details

### 1. Data Migration Service (`/src/services/dataMigration.js`)

#### Core Functions

**`saveAnonymousResume(file, parsedText)`**
- Converts file to base64 for localStorage storage
- Stores file, parsed text, and filename
- Returns a Promise for async handling

```javascript
export const saveAnonymousResume = async (file, parsedText) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      localStorage.setItem(STORAGE_KEYS.RESUME_FILE, reader.result);
      localStorage.setItem(STORAGE_KEYS.RESUME_TEXT, parsedText);
      localStorage.setItem(STORAGE_KEYS.RESUME_FILENAME, file.name);
      resolve();
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};
```

**`saveAnonymousAnalysis(analysisData)`**
- Appends analysis to localStorage array
- Adds timestamp for tracking
- Used when user runs analysis without account

```javascript
export const saveAnonymousAnalysis = (analysisData) => {
  const existingAnalyses = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.ANALYSES) || '[]'
  );
  existingAnalyses.push({
    ...analysisData,
    savedAt: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(existingAnalyses));
};
```

**`migrateAnonymousData(userId)`**
- Main migration orchestrator
- Migrates resumes and analyses
- Clears localStorage on success
- Returns success/error status

```javascript
export const migrateAnonymousData = async (userId) => {
  try {
    await migrateResume(userId);
    await migrateAnalyses(userId);
    clearAnonymousData();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

**`hasAnonymousData()`**
- Checks if migration is needed
- Used to show migration UI state
- Returns boolean

### 2. Resume Upload Integration (`/src/components/InputScreen.jsx`)

```javascript
const handleResumeUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setUploadingResume(true);
  try {
    // Extract and reformat text from resume using Claude
    const text = await extractResumeText(file);
    setBackground(text);

    // Upload file to Supabase Storage (if user is logged in)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Authenticated: Save to Supabase
      await uploadResume(file, user.id, text);
    } else {
      // Anonymous: Save to localStorage for migration
      await saveAnonymousResume(file, text);
    }
  } catch (error) {
    alert('Failed to parse resume: ' + error.message);
  } finally {
    setUploadingResume(false);
  }
};
```

### 3. Analysis Integration (`/src/hooks/useClaudeAnalysis.js`)

```javascript
// In analyze() function:
try {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Authenticated: Save to Supabase
    const savedAnalysis = await saveAnalysis(analysisData);
    analysisId = savedAnalysis.id;
  } else {
    // Anonymous: Save to localStorage for migration
    saveAnonymousAnalysis(analysisData);
  }
} catch (e) {
  // Fallback to localStorage
  saveAnonymousAnalysis(analysisData);
}
```

### 4. Auth Modal Integration (`/src/components/AuthModal.jsx`)

#### Email/Password Sign-Up
```javascript
if (data.session) {
  setMessage('Account created successfully!');

  // Migrate any anonymous data if it exists
  if (hasAnonymousData()) {
    setMessage('Account created! Migrating your data...');
    await migrateAnonymousData(data.user.id);
  }

  setTimeout(() => {
    onAuthSuccess(data.user);
    onClose();
  }, 1500);
}
```

#### Email/Password Sign-In
```javascript
setMessage('Signed in successfully!');

// Migrate any anonymous data if it exists
if (hasAnonymousData()) {
  setMessage('Signed in! Migrating your data...');
  await migrateAnonymousData(data.user.id);
}

setTimeout(() => {
  onAuthSuccess(data.user);
  onClose();
}, 1000);
```

### 5. OAuth Integration (`/src/App.js`)

OAuth flows redirect back to the app, so we handle migration in the `onAuthStateChange` listener:

```javascript
const hasMigrated = useRef(false); // Prevent duplicate migrations

useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setUser(session?.user ?? null);

      // Migrate anonymous data on sign-in (for OAuth and email confirmation)
      if (event === 'SIGNED_IN' && session?.user && !hasMigrated.current && hasAnonymousData()) {
        console.log('🔄 OAuth sign-in detected - migrating anonymous data');
        hasMigrated.current = true;
        await migrateAnonymousData(session.user.id);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

## Database Schema Impact

### Resumes Table
```sql
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_url TEXT NOT NULL,
  resume_filename TEXT NOT NULL,
  resume_text TEXT,           -- Migrated from localStorage
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  is_latest BOOLEAN DEFAULT true
);
```

### Career Analyses Table
```sql
CREATE TABLE IF NOT EXISTS career_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_background TEXT NOT NULL,
  market_analysis JSONB,
  match_results JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Migration Process Details

### Resume Migration
1. **Retrieve** base64 file, parsed text, and filename from localStorage
2. **Convert** base64 → Blob → File object
3. **Upload** to Supabase Storage (`resumes/{userId}/{timestamp}.{ext}`)
4. **Save** metadata to `resumes` table with `is_latest = true`
5. **Preserve** Claude-parsed text to avoid re-parsing (saves API costs)

### Analysis Migration
1. **Retrieve** analyses array from localStorage
2. **Insert** each analysis into `career_analyses` table
3. **Preserve** original timestamps from `savedAt` field
4. **Link** to user via `user_id` foreign key

### Cleanup
After successful migration:
- Remove `futureshift_anonymous_resume_file`
- Remove `futureshift_anonymous_resume_text`
- Remove `futureshift_anonymous_resume_filename`
- Remove `futureshift_anonymous_analyses`

## User Experience

### Anonymous User
1. Lands on FutureShift
2. Uploads resume → ✅ Saved to localStorage
3. Runs analysis → ✅ Saved to localStorage
4. Sees results immediately
5. No friction, no barriers

### Migration Experience
1. Clicks "Get Started" or "Sign In"
2. Completes auth flow
3. Sees message: "Account created! Migrating your data..."
4. Automatically redirected with all data intact
5. Can view history, saved analyses, and uploaded resume

## Error Handling

### Resume Migration Errors
```javascript
try {
  await uploadResume(file, userId, resumeText);
  console.log('✅ Resume migrated successfully');
} catch (error) {
  console.error('Failed to migrate resume:', error);
  throw error; // Will be caught by parent migrateAnonymousData()
}
```

### Analysis Migration Errors
```javascript
try {
  for (const analysis of analyses) {
    await supabase.from('career_analyses').insert({
      user_id: userId,
      user_background: analysis.userBackground,
      market_analysis: analysis.marketAnalysis,
      match_results: analysis.matchResults,
      created_at: analysis.savedAt || new Date().toISOString()
    });
  }
  console.log(`✅ Migrated ${analyses.length} analysis/analyses`);
} catch (error) {
  console.error('Failed to migrate analyses:', error);
  throw error;
}
```

### Migration Failure Handling
- If migration fails, localStorage data is **preserved**
- User can retry by signing in again
- Error message logged to console
- Future: Could show retry UI to user

## Benefits

### For Users
- **No signup friction**: Try before committing
- **Zero data loss**: Everything is preserved
- **Seamless transition**: From anonymous to authenticated
- **Privacy-friendly**: Data only sent to server when they choose

### For Product
- **Higher conversion**: More users try the app
- **Better retention**: Users invested in their data are more likely to sign up
- **Data collection**: Track career shift patterns even for anonymous users
- **Cost optimization**: Claude-parsed text saved, not re-processed

### For Analytics
- **Anonymous exploration**: See which features drive signups
- **Conversion funnel**: Track anonymous → authenticated journey
- **Career insights**: Understand which career paths are most popular
- **Feature usage**: Identify high-value features before user commits

## Future Enhancements

### Potential Improvements
1. **Migration status UI**: Show progress bar during migration
2. **Retry mechanism**: Allow users to retry failed migrations
3. **Conflict resolution**: Handle case where user already has data
4. **Anonymous history**: Show "Your unsaved analyses" prompt before signup
5. **localStorage limits**: Warn users if approaching 5MB localStorage limit
6. **Partial migration**: Migrate what succeeds, report what fails
7. **Migration analytics**: Track migration success rates

### Technical Debt
- Currently no UI feedback during OAuth migration
- No handling for localStorage quota exceeded errors
- Could add compression for stored analyses (reduce size)
- Migration is all-or-nothing (could be incremental)

## Testing Checklist

### Manual Testing Steps

#### Anonymous Resume Upload
- [ ] Upload PDF resume as anonymous user
- [ ] Verify text appears in textarea
- [ ] Check localStorage for base64 file
- [ ] Check localStorage for parsed text
- [ ] Check localStorage for filename

#### Anonymous Analysis
- [ ] Run analysis as anonymous user
- [ ] Verify results display
- [ ] Check localStorage for analysis data
- [ ] Run second analysis
- [ ] Verify both analyses in localStorage array

#### Email/Password Sign-Up Migration
- [ ] Upload resume + run analysis anonymously
- [ ] Create new account
- [ ] Verify "Migrating your data..." message
- [ ] Check resume in "My Analyses"
- [ ] Verify localStorage is cleared

#### Email/Password Sign-In Migration
- [ ] Upload resume anonymously
- [ ] Sign in to existing account
- [ ] Verify data migrates
- [ ] Check analysis history

#### OAuth (Google) Migration
- [ ] Upload resume anonymously
- [ ] Click "Continue with Google"
- [ ] Complete OAuth flow
- [ ] Verify data appears in account
- [ ] Verify localStorage cleared

#### Edge Cases
- [ ] Sign up with no anonymous data (should not error)
- [ ] Sign up twice (should not duplicate data)
- [ ] Very large resume (test localStorage limits)
- [ ] Multiple analyses (test array handling)

## Console Messages

Throughout the migration, helpful console messages track progress:

```
✅ Resume saved to localStorage for migration
✅ Analysis saved to localStorage for migration
🔄 Starting data migration for user: [user-id]
✅ Resume migrated successfully
✅ Migrated 2 analysis/analyses
✅ Anonymous data cleared from localStorage
✅ Data migration completed successfully
```

Or on failure:
```
❌ Data migration failed: [error message]
```

## Code Files Reference

| File | Purpose | Key Functions |
|------|---------|---------------|
| `src/services/dataMigration.js` | Core migration logic | `saveAnonymousResume()`, `saveAnonymousAnalysis()`, `migrateAnonymousData()` |
| `src/components/InputScreen.jsx` | Resume upload handling | `handleResumeUpload()` |
| `src/hooks/useClaudeAnalysis.js` | Analysis storage | `analyze()` |
| `src/components/AuthModal.jsx` | Email/password auth migration | `handleSubmit()` |
| `src/App.js` | OAuth migration | `useEffect()` with `onAuthStateChange` |

## Summary

The anonymous data migration system provides a frictionless onboarding experience while ensuring zero data loss. Users can explore FutureShift immediately, and when they're ready to commit, all their work seamlessly transitions to their account. This increases conversion while maintaining user trust and data integrity.
