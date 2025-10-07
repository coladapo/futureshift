import React, { useState, useEffect } from 'react';
import { getUserAnalyses, deleteAnalysis } from '../services/supabaseClient';

const AnalysisHistory = ({ onLoadAnalysis, onClose }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const data = await getUserAnalyses();
      setAnalyses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await deleteAnalysis(id);
      setAnalyses(analyses.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete analysis: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 glass-backdrop flex items-center justify-center z-50 p-4">
      <div className="glass-card-strong max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Your Career Analyses</h2>
            <p className="text-gray-400 mt-1">View and manage your saved analyses</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="glass-spinner h-12 w-12 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your analyses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white font-semibold">{error}</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-white font-semibold mb-2">No analyses yet</p>
              <p className="text-gray-400">Run your first career analysis to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => {
                const topMatch = analysis.match_results?.topMatches?.[0];
                const matchCount = analysis.match_results?.topMatches?.length || 0;

                return (
                  <div
                    key={analysis.id}
                    className="glass-card glass-hover p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {formatDate(analysis.created_at)}
                          </span>
                          {topMatch && (
                            <span className="glass-badge bg-green-900 bg-opacity-30 text-green-300">
                              {topMatch.matchScore}% Top Match
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">
                          {topMatch ? topMatch.role : 'Career Analysis'}
                        </h3>

                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {analysis.user_background.substring(0, 150)}...
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {matchCount} {matchCount === 1 ? 'role match' : 'role matches'}
                          </span>
                          <span>•</span>
                          <span>
                            {analysis.market_analysis?.emergingRoles?.length || 0} emerging roles analyzed
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => onLoadAnalysis(analysis)}
                          className="glass-button-primary px-4 py-2 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(analysis.id)}
                          className="glass-button px-4 py-2 text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;
