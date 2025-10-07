import React from 'react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-6 fade-in">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-0">
            <span className="pr-1">future</span><span className="inline-block pl-2 pr-12 py-1 bg-white text-gray-900 rounded-lg shadow-lg font-bold">shift</span>
          </h2>
        </div>

        {/* Claude Badge - Glassmorphic */}
        <div className="mb-8 inline-flex items-center gap-2 glass-badge fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
          </svg>
          Powered by Claude Sonnet 4.5
        </div>

        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight fade-in">
          Discover Tomorrow's Career
          <br />
          <span className="text-gray-300">
            Opportunities Today
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Don't waste years discovering emerging roles too late. Let Claude Sonnet 4.5
          analyze the job market and show you where your skills fit in the AI-transformed future.
        </p>

        {/* CTA Button - Glassmorphic Primary */}
        <button
          onClick={onGetStarted}
          className="glass-button-primary px-12 py-4 text-lg mb-16"
        >
          Analyze My Career
        </button>

        {/* Value Props - Glassmorphic Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-16">
          <div className="glass-card glass-hover p-6 slide-up">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-white mb-2">Identify Emerging Roles</h3>
            <p className="text-gray-400 text-sm">
              Discover new career opportunities before they become mainstream
            </p>
          </div>

          <div className="glass-card glass-hover p-6 slide-up-delay-1">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-white mb-2">Map Transferable Skills</h3>
            <p className="text-gray-400 text-sm">
              See how your existing skills translate to emerging roles
            </p>
          </div>

          <div className="glass-card glass-hover p-6 slide-up-delay-2">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-white mb-2">Get Personalized Paths</h3>
            <p className="text-gray-400 text-sm">
              Receive actionable learning roadmaps tailored to your background
            </p>
          </div>

          <div className="glass-card glass-hover p-6 slide-up-delay-3">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-white mb-2">Understand AI's Impact</h3>
            <p className="text-gray-400 text-sm">
              Learn how AI is transforming careers in your field
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 text-sm text-gray-600">
          <p>Analyzed by Claude Sonnet 4.5 • Based on 50+ real job postings • Updated for 2025</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
