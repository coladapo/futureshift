const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_CLAUDE_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for large job data

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Claude API proxy endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { messages, system, model, max_tokens, temperature } = req.body;

    console.log('📨 Received analysis request');
    console.log('Model:', model);
    console.log('Messages:', messages.length);

    const response = await anthropic.messages.create({
      model: model || 'claude-sonnet-4-5-20250929',
      max_tokens: max_tokens || 16000,
      temperature: temperature || 1,
      system,
      messages,
    });

    console.log('✅ Claude API response received');
    console.log('Usage:', response.usage);

    res.json(response);
  } catch (error) {
    console.error('❌ Claude API error:', error);

    // Send detailed error info
    res.status(error.status || 500).json({
      error: error.message,
      type: error.type,
      details: error.error?.message || 'Unknown error',
    });
  }
});

// Resume parsing endpoint
app.post('/api/parse-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;

    console.log('📄 Received resume parsing request');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      temperature: 0,
      system: `You are a resume parser. Extract key information from resumes.
Your response must be valid JSON with this structure:
{
  "skills": ["skill1", "skill2"],
  "experience": ["job1", "job2"],
  "education": ["degree1", "degree2"],
  "summary": "brief summary"
}`,
      messages: [
        {
          role: 'user',
          content: `Parse this resume and extract key information:\n\n${resumeText}`,
        },
      ],
    });

    console.log('✅ Resume parsed successfully');

    // Extract JSON from response
    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    res.json({ parsed, raw: response });
  } catch (error) {
    console.error('❌ Resume parsing error:', error);
    res.status(error.status || 500).json({
      error: error.message,
      type: error.type,
      details: error.error?.message || 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/analyze`);
});
