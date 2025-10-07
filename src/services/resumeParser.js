/* eslint-disable */
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up the worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Extract text from PDF or DOCX resume files
 * @param {File} file - The resume file to parse
 * @returns {Promise<string>} - Extracted text content
 */
export const extractResumeText = async (file) => {
  const fileType = file.name.toLowerCase();

  try {
    let rawText;

    if (fileType.endsWith('.pdf')) {
      rawText = await extractPdfText(file);
    } else if (fileType.endsWith('.docx') || fileType.endsWith('.doc')) {
      rawText = await extractDocxText(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }

    // Use Claude to intelligently reformat the text
    return await reformatWithClaude(rawText);
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

/**
 * Extract text from PDF file using PDF.js
 */
const extractPdfText = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    if (!fullText || fullText.trim().length === 0) {
      throw new Error('No text found in PDF. The PDF might be scanned or image-based.');
    }

    return cleanResumeText(fullText);
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

/**
 * Extract text from DOCX file
 */
const extractDocxText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  if (!result.value || result.value.trim().length === 0) {
    throw new Error('No text found in document.');
  }

  return cleanResumeText(result.value);
};

/**
 * Clean and format extracted resume text
 */
const cleanResumeText = (text) => {
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .replace(/\t+/g, ' ') // Replace tabs with spaces
    .replace(/ {2,}/g, ' ') // Remove excessive spaces
    .trim();
};

/**
 * Use Claude Haiku to reformat messy resume/LinkedIn text into a clean career summary
 * Using Haiku 3.5 for cost optimization (~90% cheaper than Sonnet)
 */
const reformatWithClaude = async (rawText) => {
  try {
    const response = await fetch(`${API_URL}/api/parse-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: rawText })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Resume parsing failed');
    }

    const data = await response.json();
    return data.parsed?.summary || cleanResumeText(rawText);
  } catch (error) {
    console.error('Claude reformatting error:', error);
    // Fall back to the cleaned raw text if Claude fails
    return cleanResumeText(rawText);
  }
};
