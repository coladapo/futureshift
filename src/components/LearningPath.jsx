import React from 'react';

const LearningPath = ({ steps }) => {
  return (
    <div className="glass-card p-6">
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-500 via-gray-400 to-gray-500"></div>

        {/* Timeline Items */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const [timeframe, ...actionParts] = step.split(':');
            const action = actionParts.join(':').trim();

            return (
              <div key={index} className="relative pl-12">
                {/* Marker */}
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-300 text-gray-900 flex items-center justify-center font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                {/* Content */}
                <div>
                  <h4 className="font-bold text-lg text-white mb-1">
                    {timeframe.trim()}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
