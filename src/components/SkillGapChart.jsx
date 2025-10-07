import React from 'react';

const SkillGapChart = ({ gaps }) => {
  const getPriorityColor = (priority) => {
    if (priority === 'high') return {
      bg: 'bg-red-500',
      border: 'border-red-500',
      text: 'text-red-400',
      bgLight: 'bg-red-900 bg-opacity-30'
    };
    if (priority === 'medium') return {
      bg: 'bg-yellow-500',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      bgLight: 'bg-yellow-900 bg-opacity-30'
    };
    return {
      bg: 'bg-green-500',
      border: 'border-green-500',
      text: 'text-green-400',
      bgLight: 'bg-green-900 bg-opacity-30'
    };
  };

  const getPriorityNumber = (priority) => {
    if (priority === 'high') return '1';
    if (priority === 'medium') return '2';
    return '3';
  };

  // Sort by priority (high -> medium -> low)
  const sortedGaps = [...gaps].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        📊 Skill Gaps for {gaps[0]?.role || 'This Role'}
      </h3>

      {/* Visual Priority Bars */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-400 mb-4">Skill Gap Analysis</h4>
        <div className="space-y-3">
          {sortedGaps.map((gap, index) => {
            const colors = getPriorityColor(gap.priority);
            const priorityNum = getPriorityNumber(gap.priority);

            return (
              <div key={index} className="group">
                {/* Skill name and time */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white text-sm font-bold`}>
                      {priorityNum}
                    </span>
                    <span className="font-medium text-white">{gap.skill}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bgLight} ${colors.text} border ${colors.border}`}>
                    {gap.timeToLearn}
                  </span>
                </div>

                {/* Reasoning */}
                <div className="ml-11 text-sm text-gray-400">
                  {gap.reasoning}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">1</div>
          <span className="text-sm text-gray-300">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">2</div>
          <span className="text-sm text-gray-300">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">3</div>
          <span className="text-sm text-gray-300">Low Priority</span>
        </div>
      </div>
    </div>
  );
};

export default SkillGapChart;
