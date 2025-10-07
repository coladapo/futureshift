import React from 'react';
import RoleMatchCard from './RoleMatchCard';
import SkillGapChart from './SkillGapChart';
import LearningPath from './LearningPath';
import ClaudeInsights from './ClaudeInsights';

const ResultsDashboard = ({ matchResults, marketAnalysis, analysisId, onAnalyzeAgain }) => {
  const topMatch = matchResults.topMatches[0];

  // Calculate stats from actual analysis
  const totalSkills = matchResults.topMatches.reduce((acc, match) =>
    acc + match.transferableSkills.length, 0
  );
  const emergingRoles = marketAnalysis?.emergingRoles?.length || matchResults.topMatches.length;
  const totalJobsAnalyzed = marketAnalysis?.totalJobsAnalyzed || 95; // From CSV data

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onAnalyzeAgain}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Analysis
        </button>

        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center gap-2 glass-badge mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
            </svg>
            Analyzed by Claude Sonnet 4.5
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Your Emerging Role Matches
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Based on your background and analysis of {totalJobsAnalyzed} live job postings across emerging and traditional roles,
            here are your personalized career opportunities.
          </p>

          {/* Stats Banner */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="glass-card p-4">
              <div className="text-3xl font-bold text-white mb-1">{emergingRoles}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Emerging Roles</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-3xl font-bold text-white mb-1">{totalSkills}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Skills Analyzed</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-white mb-1">4.5</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Claude Sonnet</div>
            </div>
          </div>
        </div>

        {/* Top Matches Section */}
        <section className="mb-12 fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">
            🎯 Top {matchResults.topMatches.length} Emerging Roles for You
          </h2>
          <div className="space-y-6">
            {matchResults.topMatches.map((match, index) => (
              <div key={match.role} className={index === 0 ? 'slide-up' : index === 1 ? 'slide-up-delay-1' : 'slide-up-delay-2'}>
                <RoleMatchCard match={match} rank={index + 1} analysisId={analysisId} />
              </div>
            ))}
          </div>
        </section>

        {/* Skill Analysis Section */}
        <section className="mb-12 fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">
            📊 Skill Gaps for {topMatch.role}
          </h2>
          <SkillGapChart gaps={topMatch.skillGaps} />
        </section>

        {/* Learning Path Section */}
        <section className="mb-12 fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">
            🛤️ Your Recommended Learning Path
          </h2>
          <LearningPath steps={topMatch.careerPathSteps} />
        </section>

        {/* Claude Insights Section */}
        <section className="mb-12 fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">
            🤖 Claude's Personalized Analysis
          </h2>
          <ClaudeInsights insights={matchResults.analysisInsights} />
        </section>

        {/* Market Insights */}
        {marketAnalysis && marketAnalysis.keyInsights && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              💼 Key Market Insights
            </h2>
            <div className="glass-card p-6">
              <ul className="space-y-3">
                {marketAnalysis.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-gray-400 flex-shrink-0">•</span>
                    <span className="text-gray-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="text-center">
          <button
            onClick={onAnalyzeAgain}
            className="glass-button-primary px-8 py-3"
          >
            Analyze Another Career Path
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            This analysis is based on current job market data and is for informational purposes only.
            Always research specific roles and companies independently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
