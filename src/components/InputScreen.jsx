import React, { useState } from 'react';
import { samplePersonas, getSampleBackground } from '../services/claudeService';
import { extractResumeText } from '../services/resumeParser';
import { uploadResume } from '../services/resumeStorage';
import { saveAnonymousResume } from '../services/dataMigration';
import { supabase } from '../services/supabaseClient';

const InputScreen = ({ onAnalyze }) => {
  const [background, setBackground] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const charCount = background.length;
  const isValid = charCount >= 50;

  const handleLoadSample = (index) => {
    setBackground(getSampleBackground(index));
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      // Extract and reformat text from resume using Claude
      const text = await extractResumeText(file);
      setBackground(text);

      // Upload file to Supabase Storage (if user is logged in)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          // Save both the file AND the parsed text to avoid re-parsing
          await uploadResume(file, user.id, text);
          console.log('Resume saved to your account');
        } catch (uploadError) {
          console.error('Failed to save resume to account:', uploadError);
          // Don't show error to user - the text extraction still worked
        }
      } else {
        // Save to localStorage for migration on sign-up
        try {
          await saveAnonymousResume(file, text);
        } catch (saveError) {
          console.error('Failed to save to localStorage:', saveError);
          // Don't show error to user - the text extraction still worked
        }
      }
    } catch (error) {
      alert('Failed to parse resume: ' + error.message);
    } finally {
      setUploadingResume(false);
    }
  };


  const handleAnalyze = async () => {
    if (!isValid) return;

    setIsAnalyzing(true);
    try {
      await onAnalyze(background);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Tell Us About Your Background
          </h1>
          <p className="text-lg text-gray-400">
            Share your experience, skills, and interests. The more detail you provide,
            the better Claude can match you to emerging roles.
          </p>
        </div>

        {/* Form */}
        <div className="glass-card-strong p-8">
          {/* Main Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Background <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="• Your current role and years of experience&#10;• Key skills and tools you use&#10;• Industries or domains you're interested in&#10;• What you're looking to explore next"
                className="w-full h-64 glass-input resize-none"
                disabled={isAnalyzing}
              />

              {/* Sample Pills - Only show when textarea is empty */}
              {!background && (
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 items-center">
                  {samplePersonas.map((persona, index) => (
                    <button
                      key={index}
                      onClick={() => handleLoadSample(index)}
                      className="px-3 py-1 text-xs rounded-full bg-white bg-opacity-5 hover:bg-opacity-10 border border-gray-700 text-gray-300 hover:text-white transition-all"
                      disabled={isAnalyzing}
                    >
                      {persona.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Character Counter */}
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-sm ${charCount >= 50 ? 'text-green-400' : 'text-gray-500'}`}>
                {charCount} characters {charCount < 50 && `(${50 - charCount} more needed)`}
              </span>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or upload your resume:
            </label>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
              disabled={isAnalyzing || uploadingResume}
            />
            <label
              htmlFor="resume-upload"
              className={`glass-button w-full py-3 text-center cursor-pointer flex items-center justify-center gap-2 ${
                uploadingResume ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploadingResume ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Parsing resume...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Resume (PDF or DOCX)
                </>
              )}
            </label>
          </div>

          {/* LinkedIn PDF Import */}
          <div className="mb-6">
            <div className="glass-card p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>How to import from LinkedIn:</strong>
                  </p>
                  <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Go to your LinkedIn profile</li>
                    <li>Click "Resources" → "Save to PDF"</li>
                    <li>Upload the PDF using the resume upload button above</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!isValid || isAnalyzing}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              isValid && !isAnalyzing
                ? 'glass-button-primary'
                : 'glass-button opacity-50 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze My Career Path'
            )}
          </button>

          {/* Powered by */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              Analysis powered by <span className="font-semibold text-gray-300">Claude Sonnet 4.5</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputScreen;
