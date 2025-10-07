import React, { useState } from 'react';

const ClaudeInsights = ({ insights }) => {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="glass-card-strong p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center text-gray-900 font-bold">
          C
        </div>
        <h3 className="text-xl font-bold text-white">
          Claude Sonnet 4.5's Analysis
        </h3>
      </div>

      {/* Insights */}
      <div className="space-y-3 mb-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 glass-card p-4 border border-gray-700">
            <span className="text-2xl flex-shrink-0">💡</span>
            <p className="text-gray-300 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>

      {/* Methodology Toggle */}
      <button
        onClick={() => setShowMethodology(!showMethodology)}
        className="w-full text-left glass-card p-4 glass-hover border border-gray-700"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">
            How Claude analyzed this
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${showMethodology ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {showMethodology && (
          <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 leading-relaxed">
            <p>
              Claude Sonnet 4.5 analyzed <strong className="text-gray-300">95 job postings</strong> across traditional, emerging, and hybrid roles.
              It identified pattern in skill requirements, growth indicators, and market trends.
            </p>
            <p className="mt-2">
              Then, it mapped your background against these roles, calculating transferability scores
              based on skills, domain knowledge, and career trajectory. Finally, it generated personalized
              recommendations and learning paths tailored specifically to your experience.
            </p>
          </div>
        )}
      </button>

      {/* Powered Badge */}
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by Anthropic's Claude Sonnet 4.5
      </div>
    </div>
  );
};

export default ClaudeInsights;
