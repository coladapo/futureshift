import { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import InputScreen from './components/InputScreen';
import ResultsDashboard from './components/ResultsDashboard';
import LoadingAnimation from './components/LoadingAnimation';
import ProgressiveResults from './components/ProgressiveResults';
import AuthModal from './components/AuthModal';
import AnalysisHistory from './components/AnalysisHistory';
import Toast from './components/Toast';
import { useClaudeAnalysis } from './hooks/useClaudeAnalysis';
import { supabase } from './services/supabaseClient';
import { migrateAnonymousData, hasAnonymousData } from './services/dataMigration';

function App() {
  const [screen, setScreen] = useState('landing'); // landing, input, loading, results
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [toast, setToast] = useState(null);
  const { analyze, results, error, loadResults, progress } = useClaudeAnalysis();
  const hasMigrated = useRef(false); // Track if we've already migrated

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.id || 'no user');
      setUser(session?.user ?? null);

      // Handle sign in
      if (event === 'SIGNED_IN') {
        showToast('Welcome back! 👋', 'success');

        // Migrate anonymous data (for OAuth and email confirmation)
        if (session?.user && !hasMigrated.current && hasAnonymousData()) {
          console.log('🔄 OAuth sign-in detected - migrating anonymous data');
          hasMigrated.current = true;
          // Run migration in background - don't block UI
          migrateAnonymousData(session.user.id).catch(err => {
            console.error('Migration failed:', err);
          });
        }
      }

      // Handle sign out
      if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out, resetting app state');
        showToast('Signed out successfully', 'success');
        setUser(null);
        setScreen('landing');
        hasMigrated.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAnalyze = async (userBackground) => {
    setScreen('loading');

    try {
      // Import CSV job service
      const { loadJobsFromCSV } = await import('./services/csvJobService');

      console.log('📊 Loading job market data...');

      // Load jobs from CSV file
      const csvData = await loadJobsFromCSV();

      console.log(`✅ Job data loaded, analyzing with Claude...`);

      // Analyze with Claude
      await analyze(userBackground, csvData);
      setScreen('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Analysis failed: ' + err.message + '\n\nPlease try again.');
      setScreen('input'); // Go back to input on error
    }
  };

  const handleReset = () => {
    setScreen('landing');
  };

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    console.log('🚪 Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
        throw error;
      }
      console.log('✅ Signed out successfully');
      // Force page reload to clear all state
      window.location.reload();
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      alert('Failed to sign out: ' + error.message);
    }
  };

  const handleLoadAnalysis = (analysis) => {
    // Transform saved analysis back to results format
    const loadedResults = {
      marketAnalysis: analysis.market_analysis,
      matchResults: analysis.match_results,
      userBackground: analysis.user_background,
      timestamp: analysis.created_at
    };

    // Load the results into the hook
    loadResults(loadedResults);
    setShowHistory(false);
    setScreen('results');
  };

  return (
    <div className="app">
      {/* Auth/User menu - shown on all screens except loading */}
      {screen !== 'loading' && (
        <>
          {/* Desktop Navigation */}
          <div className="hidden md:flex fixed top-4 right-4 z-40 items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => setShowHistory(true)}
                  className="glass-button"
                >
                  My Analyses
                </button>
                <button
                  onClick={handleSignOut}
                  className="glass-button"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="glass-button-primary px-6 py-2"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Navigation - Hamburger Menu */}
          <div className="md:hidden fixed top-4 right-4 z-40">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="glass-button p-2"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Mobile Menu Dropdown */}
            {showMobileMenu && (
              <div className="absolute top-12 right-0 glass-card p-4 min-w-[160px]">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setShowHistory(true);
                        setShowMobileMenu(false);
                      }}
                      className="glass-button w-full text-sm px-4 py-2"
                    >
                      My Analyses
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setShowMobileMenu(false);
                      }}
                      className="glass-button w-full text-sm px-4 py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="glass-button-primary w-full text-sm px-4 py-2"
                  >
                    Get Started
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {screen === 'landing' && (
        <LandingPage onGetStarted={() => setScreen('input')} />
      )}

      {screen === 'input' && (
        <InputScreen onAnalyze={handleAnalyze} />
      )}

      {screen === 'loading' && (
        <>
          {/* Show progressive results if we have partial data */}
          {progress.stage !== 'idle' ? (
            <ProgressiveResults progress={progress} partialResults={results} />
          ) : (
            <LoadingAnimation />
          )}
        </>
      )}

      {screen === 'results' && results && (
        <ResultsDashboard
          matchResults={results.matchResults}
          marketAnalysis={results.marketAnalysis}
          analysisId={results.analysisId}
          onAnalyzeAgain={handleReset}
          marketIntelligenceVersion={progress.marketIntelligenceVersion}
          usingCache={progress.usingCache}
        />
      )}

      {error && screen !== 'loading' && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Analysis History Modal */}
      {showHistory && (
        <AnalysisHistory
          onLoadAnalysis={handleLoadAnalysis}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
