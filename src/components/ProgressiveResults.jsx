import React from 'react';

const ProgressiveResults = ({ progress, partialResults }) => {
  const { stage, marketAnalysis, marketIntelligenceVersion, usingCache } = progress;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Progress */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Analyzing Your Career Path
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm">
            <StageIndicator
              label="Market Intelligence"
              active={stage === 'market'}
              complete={['matching', 'complete'].includes(stage)}
            />
            <div className="w-12 h-0.5 bg-gray-700" />
            <StageIndicator
              label="Personalized Matching"
              active={stage === 'matching'}
              complete={stage === 'complete'}
            />
          </div>
        </div>

        {/* Market Intelligence Section */}
        {marketAnalysis && (
          <div className="mb-8">
            <SectionHeader
              title="💼 Market Insights"
              status={stage === 'market' ? 'loading' : 'complete'}
            />
            <div className="glass-card p-6">
              {/* Intelligence Version Badge */}
              <div className="mb-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full text-sm text-blue-300">
                  {usingCache ? '⚡ Using cached intelligence' : '🔄 Fresh analysis'}
                </span>
                {marketIntelligenceVersion && (
                  <span className="text-sm text-gray-400">
                    Market Intelligence v{marketIntelligenceVersion}
                  </span>
                )}
              </div>

              {/* Key Insights */}
              {marketAnalysis.keyInsights && marketAnalysis.keyInsights.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Key Market Insights</h3>
                  <ul className="space-y-2">
                    {marketAnalysis.keyInsights.slice(0, 5).map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-gray-300">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Emerging Roles Preview */}
              {marketAnalysis.emergingRoles && marketAnalysis.emergingRoles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Emerging Roles Identified</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {marketAnalysis.emergingRoles.slice(0, 6).map((role, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-white bg-opacity-5 rounded-lg border border-gray-700"
                      >
                        <div className="text-sm font-medium text-white">{role.role || role.title}</div>
                        {role.growthRate && (
                          <div className="text-xs text-green-400 mt-1">
                            +{Math.round(role.growthRate * 100)}% growth
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Matching Section */}
        {stage === 'matching' && (
          <div className="mb-8">
            <SectionHeader
              title="🎯 Your Personalized Matches"
              status="loading"
            />
            <div className="glass-card p-8">
              <div className="space-y-6">
                {/* Animated progress steps */}
                <div className="space-y-4">
                  <MatchingStep
                    label="Analyzing your skills and experience"
                    status="complete"
                  />
                  <MatchingStep
                    label="Matching against emerging role requirements"
                    status="active"
                  />
                  <MatchingStep
                    label="Calculating skill gaps and transition paths"
                    status="pending"
                  />
                  <MatchingStep
                    label="Generating personalized insights"
                    status="pending"
                  />
                </div>

                {/* Claude animation */}
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <div className="w-16 h-16 glass-spinner mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">
                      Claude Sonnet 4.5 is analyzing {marketAnalysis?.emergingRoles?.length || 18} emerging roles...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complete - Show Full Results */}
        {stage === 'complete' && partialResults && (
          <div className="mb-8">
            <SectionHeader
              title="🎯 Your Top Matches"
              status="complete"
            />
            <div className="space-y-4">
              {partialResults.matchResults?.topMatches?.slice(0, 3).map((match, index) => (
                <div key={index} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{match.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-400">Match Score:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${match.matchScore * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {Math.round(match.matchScore * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{match.reasoning}</p>

                  {/* Skill Gaps Preview */}
                  {match.skillGaps && match.skillGaps.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-gray-500">Skills to develop:</span>
                      {match.skillGaps.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-orange-500 bg-opacity-10 border border-orange-500 rounded text-xs text-orange-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idle state */}
        {stage === 'idle' && (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <p className="text-gray-400">Starting analysis...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Stage Indicator Component
const StageIndicator = ({ label, active, complete }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
          complete
            ? 'bg-green-500 border-green-500'
            : active
            ? 'border-blue-500 bg-blue-500 bg-opacity-20 animate-pulse'
            : 'border-gray-600 bg-gray-800'
        }`}
      >
        {complete ? (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : active ? (
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        ) : (
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
        )}
      </div>
      <span
        className={`text-sm font-medium ${
          complete ? 'text-green-400' : active ? 'text-blue-400' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, status }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {status === 'loading' && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Analyzing...</span>
        </div>
      )}
      {status === 'complete' && (
        <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
};

// Matching Step Component
const MatchingStep = ({ label, status }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          status === 'complete'
            ? 'bg-green-500'
            : status === 'active'
            ? 'bg-blue-500 animate-pulse'
            : 'bg-gray-700'
        }`}
      >
        {status === 'complete' ? (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : status === 'active' ? (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        ) : (
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        )}
      </div>
      <span
        className={`text-sm ${
          status === 'complete'
            ? 'text-green-400'
            : status === 'active'
            ? 'text-blue-400 font-medium'
            : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default ProgressiveResults;
