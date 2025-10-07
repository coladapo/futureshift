import { useState } from 'react';
import { analyzeJobMarket, matchUserToRoles } from '../services/claudeService';
import { saveAnalysis, supabase } from '../services/supabaseClient';
import { saveAnonymousAnalysis } from '../services/dataMigration';
import {
  getActiveMarketIntelligence,
  shouldRefreshMarketIntelligence,
  saveMarketIntelligence,
  saveUserRoleMatches
} from '../services/marketIntelligence';

export const useClaudeAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState({
    stage: 'idle', // 'idle', 'market', 'matching', 'complete'
    marketAnalysis: null,
    marketIntelligenceVersion: null,
    usingCache: false
  });

  const analyze = async (userBackground, csvData) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setProgress({ stage: 'idle', marketAnalysis: null, marketIntelligenceVersion: null, usingCache: false });

    try {
      let marketAnalysis;
      let marketIntelligenceId = null;
      let intelligenceVersion = null;

      // Step 1: Check if we need to refresh market intelligence
      setProgress({ stage: 'market', marketAnalysis: null, marketIntelligenceVersion: null, usingCache: false });
      const needsRefresh = await shouldRefreshMarketIntelligence(7);

      if (needsRefresh) {
        console.log('📊 Analyzing job market (first time or >7 days old)...');
        // Fresh market analysis needed
        marketAnalysis = await analyzeJobMarket(csvData);

        // Save as new market intelligence
        const savedIntel = await saveMarketIntelligence(marketAnalysis, {
          source: 'job_postings.csv',
          count: csvData?.split('\n').length || 0
        });
        marketIntelligenceId = savedIntel.id;
        intelligenceVersion = savedIntel.version;
        console.log(`✅ Market intelligence v${savedIntel.version} saved`);

        // Update progress with market analysis results
        setProgress({
          stage: 'market',
          marketAnalysis,
          marketIntelligenceVersion: intelligenceVersion,
          usingCache: false
        });
      } else {
        console.log('⚡ Using cached market intelligence...');
        // Use existing market intelligence
        const activeIntel = await getActiveMarketIntelligence();
        marketIntelligenceId = activeIntel.id;
        intelligenceVersion = activeIntel.version;

        // Convert stored intelligence back to expected format
        marketAnalysis = {
          emergingRoles: activeIntel.emerging_roles,
          traditionalRoles: activeIntel.traditional_roles,
          keyInsights: activeIntel.key_insights,
          skillTrends: activeIntel.skill_trends
        };
        console.log(`✅ Using market intelligence v${activeIntel.version} (${Math.floor((Date.now() - new Date(activeIntel.created_at)) / (1000 * 60 * 60 * 24))} days old)`);

        // Update progress - cached intelligence loads instantly
        setProgress({
          stage: 'market',
          marketAnalysis,
          marketIntelligenceVersion: intelligenceVersion,
          usingCache: true
        });
      }

      // Step 2: Match user to roles (always personalized)
      setProgress({
        stage: 'matching',
        marketAnalysis,
        marketIntelligenceVersion: intelligenceVersion,
        usingCache: needsRefresh ? false : true
      });
      const matchResults = await matchUserToRoles(userBackground, marketAnalysis);

      // Store results
      const analysisData = {
        marketAnalysis,
        matchResults,
        timestamp: new Date().toISOString(),
        userBackground,
        marketIntelligenceId
      };

      // Save to database
      let analysisId = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Save to new user_role_matches table
          await saveUserRoleMatches(user.id, marketIntelligenceId, {
            userBackground,
            matchResults
          });

          // Also save to old analysis table for backward compatibility
          const savedAnalysis = await saveAnalysis(analysisData);
          analysisId = savedAnalysis.id;
          console.log('✅ Analysis saved to Supabase:', analysisId);
        } else {
          console.log('ℹ️  User not logged in - saving to localStorage for migration');
          saveAnonymousAnalysis(analysisData);
        }
      } catch (e) {
        console.warn('Could not save to Supabase:', e.message);
        // Fallback to localStorage for migration
        saveAnonymousAnalysis(analysisData);
      }

      // Add analysis ID to results for tracking
      analysisData.analysisId = analysisId;

      // Mark as complete
      setProgress({
        stage: 'complete',
        marketAnalysis,
        marketIntelligenceVersion: intelligenceVersion,
        usingCache: needsRefresh ? false : true
      });

      setResults(analysisData);

      return analysisData;
    } catch (err) {
      const errorMessage = err.message || 'Analysis failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
    setLoading(false);
    setProgress({ stage: 'idle', marketAnalysis: null, marketIntelligenceVersion: null, usingCache: false });
  };

  const loadResults = (loadedResults) => {
    setResults(loadedResults);
  };

  return {
    analyze,
    reset,
    loadResults,
    loading,
    error,
    results,
    progress
  };
};
