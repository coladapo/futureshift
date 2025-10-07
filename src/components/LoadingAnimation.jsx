import React, { useState, useEffect } from 'react';

const facts = [
  "73% of jobs in 2030 don't exist yet",
  "The average person changes careers 5-7 times in their lifetime",
  "AI is creating more jobs than it eliminates",
  "Prompt engineering didn't exist as a job title in 2020",
  "Over 1 billion jobs will be transformed by AI by 2030"
];

const progressSteps = [
  "Loading 95 job postings...",
  "Analyzing market trends with Claude Sonnet 4.5...",
  "Identifying emerging roles...",
  "Mapping your transferable skills...",
  "Calculating skill gaps...",
  "Generating personalized recommendations...",
];

const LoadingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFact] = useState(() => facts[Math.floor(Math.random() * facts.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < progressSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 glass-spinner"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Text */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Analyzing Your Career Path
        </h2>
        <p className="text-lg text-gray-300 font-medium mb-8 h-7 transition-all">
          {progressSteps[currentStep]}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {progressSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index <= currentStep
                  ? 'w-8 bg-gray-300'
                  : 'w-2 bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Fun Fact */}
        <div className="glass-card p-6">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-semibold text-white mb-2">Did you know?</h3>
          <p className="text-gray-400">{currentFact}</p>
        </div>

        {/* Powered by */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Powered by Claude Sonnet 4.5</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
