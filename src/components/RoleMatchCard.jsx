import React from 'react';
import { trackRoleClick } from '../services/analytics';

const RoleMatchCard = ({ match, rank, analysisId }) => {
  const handleCardClick = () => {
    // Track user interaction
    trackRoleClick(analysisId, {
      title: match.role,
      matchScore: match.matchScore,
      company: match.company || 'N/A',
      skillsMatched: match.keySkills || []
    });
  };
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-900 bg-opacity-30 border-green-700';
    if (score >= 60) return 'text-yellow-400 bg-yellow-900 bg-opacity-30 border-yellow-700';
    return 'text-orange-400 bg-orange-900 bg-opacity-30 border-orange-700';
  };

  const scoreColorClass = getScoreColor(match.matchScore);

  return (
    <div className="glass-card glass-hover p-6" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-gray-500">#{rank}</span>
            <h3 className="text-2xl font-bold text-white">{match.role}</h3>
          </div>
        </div>

        <div className={`flex flex-col items-center px-4 py-3 rounded-lg border-2 ${scoreColorClass}`}>
          <span className="text-3xl font-bold">{match.matchScore}</span>
          <span className="text-xs font-medium uppercase">Match</span>
        </div>
      </div>

      {/* Match Reasons */}
      <div className="mb-4">
        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
          <span>✨</span> Why This Matches You
        </h4>
        <ul className="space-y-1">
          {match.matchReasons.map((reason, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Transferable Skills */}
      <div className="mb-4">
        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
          <span>💪</span> Your Transferable Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {match.transferableSkills.map((skill) => (
            <span
              key={skill}
              className="glass-badge bg-gray-800 bg-opacity-50 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="text-sm">
          <span className="text-gray-500">Transition Time: </span>
          <span className="font-medium text-white">{match.estimatedTransitionTime}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Expected Salary: </span>
          <span className="font-medium text-green-400">{match.salaryProjection}</span>
        </div>
      </div>
    </div>
  );
};

export default RoleMatchCard;
