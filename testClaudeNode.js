// Node.js test script for Claude API
// Run with: node testClaudeNode.js

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const apiKey = process.env.REACT_APP_CLAUDE_API_KEY;

if (!apiKey) {
  console.error('❌ REACT_APP_CLAUDE_API_KEY not found in .env.local');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey });

async function testClaudeIntegration() {
  console.log('🚀 Testing Claude API Integration...\n');

  try {
    // Test 1: Load CSV data
    console.log('📊 Step 1: Loading job postings CSV...');
    const csvData = fs.readFileSync('./public/data/job_postings.csv', 'utf-8');
    console.log(`✅ Loaded ${csvData.split('\n').length - 1} job postings\n`);

    // Test 2: Analyze job market
    console.log('🔍 Step 2: Analyzing job market with Claude Sonnet 4.5...');
    console.log('(This may take 10-30 seconds...)\n');

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 16000,
      messages: [{
        role: "user",
        content: `You are a job market analyst. Analyze these job postings and identify trends:

${csvData}

Provide analysis in this JSON format (respond with ONLY valid JSON, no markdown):
{
  "emergingRoles": [
    {
      "title": "Role title",
      "growthIndicators": "why this is emerging",
      "numberOfPostings": 0,
      "keySkills": ["skill1", "skill2"],
      "salaryRange": "$XXk-YYk",
      "whyEmerging": "detailed explanation",
      "exampleCompanies": ["company1", "company2"]
    }
  ],
  "traditionalRoles": [
    {
      "title": "Role title",
      "evolutionNote": "how AI is changing this role"
    }
  ],
  "keyInsights": [
    "insight about skill trends",
    "insight about AI transformation",
    "insight about career paths"
  ]
}

Focus on:
1. Roles that combine AI/ML with traditional domains
2. New skill combinations that didn't exist 2 years ago
3. How AI is transforming traditional roles
4. Realistic salary ranges based on the data`
      }]
    });

    const responseText = message.content[0].text;
    const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const marketAnalysis = JSON.parse(jsonText);

    console.log('✅ Job Market Analysis Complete!');
    console.log(`   - Found ${marketAnalysis.emergingRoles.length} emerging roles`);
    console.log(`   - Found ${marketAnalysis.traditionalRoles?.length || 0} traditional roles`);
    console.log(`   - Generated ${marketAnalysis.keyInsights.length} key insights\n`);

    console.log('📋 Top 5 Emerging Roles:');
    marketAnalysis.emergingRoles.slice(0, 5).forEach((role, i) => {
      console.log(`   ${i + 1}. ${role.title} (${role.numberOfPostings} postings)`);
      console.log(`      ${role.whyEmerging.substring(0, 120)}...`);
    });
    console.log();

    // Test 3: Match user to roles
    console.log('👤 Step 3: Matching sample user to roles...');
    const userBackground = `I'm a product designer with 7 years of experience in architecture and 3 years in UX/UI design.

Skills: Figma, user research, prototyping, design systems, spatial design, 3D modeling (Rhino, SketchUp), visual communication, stakeholder management.

Looking to: Explore how AI is transforming design roles and what new opportunities might be emerging at the intersection of design and AI.

Industries interested in: Tech, AI/ML companies, design tools, creative software.`;

    const matchMessage = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8000,
      messages: [{
        role: "user",
        content: `User background:
${userBackground}

Emerging roles identified:
${JSON.stringify(marketAnalysis.emergingRoles, null, 2)}

Analyze which emerging roles best match this user's background. Consider:
1. Direct skill transferability
2. Industry/domain knowledge overlap
3. Career trajectory alignment
4. Learning curve feasibility

Return ONLY valid JSON (no markdown):
{
  "topMatches": [
    {
      "role": "role title",
      "matchScore": 85,
      "matchReasons": [
        "specific reason based on user background",
        "another specific reason"
      ],
      "transferableSkills": ["skill1", "skill2"],
      "skillGaps": [
        {
          "skill": "skill name",
          "priority": "high",
          "timeToLearn": "2-3 months",
          "reasoning": "why this skill is needed"
        }
      ],
      "careerPathSteps": [
        "Immediate: action to take now",
        "Short-term (3-6 months): next steps",
        "Long-term (6-12 months): final steps"
      ],
      "estimatedTransitionTime": "6-9 months",
      "salaryProjection": "$XXk-YYk"
    }
  ],
  "analysisInsights": [
    "Why Claude thinks this path is viable for this user",
    "Unique transferable skills identified",
    "Potential challenges to be aware of"
  ]
}`
      }]
    });

    const matchResponseText = matchMessage.content[0].text;
    const matchJsonText = matchResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const matchResults = JSON.parse(matchJsonText);

    console.log('✅ User Matching Complete!');
    console.log(`   - Found ${matchResults.topMatches.length} top matches\n`);

    console.log('🎯 Top 3 Matches:');
    matchResults.topMatches.slice(0, 3).forEach((match, i) => {
      console.log(`   ${i + 1}. ${match.role} (${match.matchScore}% match)`);
      console.log(`      Transferable: ${match.transferableSkills.slice(0, 3).join(', ')}`);
      console.log(`      Transition: ${match.estimatedTransitionTime}`);
      console.log(`      Salary: ${match.salaryProjection}`);
    });
    console.log();

    // Save results
    console.log('💾 Step 4: Saving results...');
    const testResults = {
      marketAnalysis,
      matchResults,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('test-results.json', JSON.stringify(testResults, null, 2));
    console.log('✅ Results saved to: test-results.json\n');

    console.log('🎉 ALL TESTS PASSED!\n');
    console.log('Claude Sonnet 4.5 is working perfectly!');
    console.log('Ready to integrate into React app (PHASE 3)\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    process.exit(1);
  }
}

testClaudeIntegration();
