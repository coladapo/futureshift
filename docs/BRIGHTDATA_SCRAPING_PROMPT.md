# BrightData Job Scraping Prompt for Claude Desktop

Copy and paste this entire prompt into **Claude Desktop** (where BrightData MCP is configured):

---

## 🎯 Mission: Scrape Fresh Job Market Data for FutureShift

I need you to scrape **real, live job postings** from multiple job boards and save them in a specific CSV format for my career analysis app.

### 📋 Requirements:

**Target Job Boards:**
1. **We Work Remotely** (https://weworkremotely.com)
   - Categories: Design, Development, Product, Marketing, Data & Analytics
2. **Remote OK** (https://remoteok.com)
   - Focus on: AI/ML, Product Design, Software Engineering, Data Science
3. **AngelList** (https://wellfound.com/jobs)
   - Filter: Remote jobs, AI/Tech companies
4. **Built In** (https://builtin.com)
   - Focus on: Emerging tech roles

### 🎯 Job Categories to Scrape (120 jobs total):

**Emerging AI-Era Roles (40 jobs):**
- AI Product Designer
- Machine Learning Engineer
- AI Research Scientist
- Prompt Engineer
- AI Product Manager
- LLM Engineer
- AI Ethics Specialist
- Generative AI Designer
- AI Training Specialist
- ML Ops Engineer
- Computer Vision Engineer
- NLP Engineer
- AI Solutions Architect
- Robotics Engineer
- AI Content Strategist

**Traditional Roles Being Transformed (40 jobs):**
- Product Designer (AI-augmented)
- Software Engineer (AI-focused)
- Data Analyst (AI tools)
- Marketing Manager (AI platforms)
- Content Writer (AI-assisted)
- UX Researcher (AI insights)
- Business Analyst (AI analytics)
- Project Manager (AI project tools)
- Sales Engineer (AI sales tools)
- Customer Success (AI automation)

**Hybrid/Cross-Functional Roles (40 jobs):**
- Design Engineer
- Full Stack AI Developer
- Product-Led Growth Manager
- DevRel Engineer
- Growth Product Designer
- Technical Product Manager
- Data Product Manager
- Platform Engineer
- Developer Experience Engineer
- Technical Writer (AI/ML focus)

### 📊 CSV Output Format:

**File Location:** `/Users/wivak/puo-jects/____active/futureshift/public/data/job_postings.csv`

**Required Columns:**
```csv
title,company,description,skills,category,salary_min,salary_max,location,type
```

**Column Specifications:**

1. **title** - Exact job title from posting
2. **company** - Company name
3. **description** - Full job description (keep it under 500 words, preserve key details about responsibilities and AI/tech stack)
4. **skills** - Comma-separated list of required skills (e.g., "Figma,React,AI Design Tools,Prototyping,User Research")
5. **category** - One of: "Emerging AI", "Traditional Transformed", "Hybrid", "Design", "Engineering", "Product", "Data", "Marketing"
6. **salary_min** - Minimum salary (numeric, e.g., 120000)
7. **salary_max** - Maximum salary (numeric, e.g., 180000)
8. **location** - Location (e.g., "Remote", "San Francisco, CA", "New York, NY")
9. **type** - Employment type: "Full-time", "Contract", "Part-time"

### 🚨 Critical Rules:

1. **Current Jobs Only** - Posted within the last 30 days
2. **Real Data** - Must be actual job postings, not generated/fake data
3. **Diversity** - Mix of company sizes (startups, mid-size, enterprise)
4. **Salary Range** - Focus on jobs with salary ranges between $80k-$300k
5. **Remote-Friendly** - Prioritize remote or hybrid roles
6. **AI/Tech Focus** - All jobs should relate to tech/AI transformation
7. **No Duplicates** - Each job should be unique
8. **Accurate Salaries** - If salary not listed, use reasonable 2025 market rate for that role/location

### 🎨 Diversity Mix:

**Company Types:**
- 30% Startups (0-50 employees)
- 40% Growth companies (50-500 employees)
- 30% Enterprise (500+ employees)

**Geographic Distribution:**
- 40% Fully Remote
- 20% US West Coast (SF, Seattle, LA)
- 20% US East Coast (NYC, Boston)
- 10% US Central (Austin, Denver, Chicago)
- 10% International (UK, Canada, Europe)

### 📝 CSV Formatting Rules:

1. **Header row** must be exact: `title,company,description,skills,category,salary_min,salary_max,location,type`
2. **Escape commas** in descriptions with quotes: `"Senior Designer, AI Products"`
3. **No line breaks** in description field - replace with spaces
4. **UTF-8 encoding**
5. **No trailing commas**
6. **Exactly 120 jobs** (plus header row = 121 lines total)

### ✅ Validation Checklist:

Before saving the file, verify:
- [ ] Exactly 121 lines (1 header + 120 jobs)
- [ ] All 9 columns present in every row
- [ ] No empty required fields (title, company, description)
- [ ] Salary values are numeric only (no "$" or "," characters)
- [ ] Skills are comma-separated within the field
- [ ] Descriptions are detailed but under 500 words
- [ ] All jobs are real, current postings from the last 30 days
- [ ] Mix of seniority levels (junior, mid, senior, staff, principal)

### 🔄 Weekly Update Process:

**For future updates:**
1. Run this same prompt weekly
2. Replace old CSV with fresh data
3. Keep the same format/structure
4. Update jobs to reflect current market (remove old postings, add new ones)
5. Maintain the 40/40/40 split (Emerging/Traditional/Hybrid)

### 📌 Example Row:

```csv
AI Product Designer,Anthropic,"We're looking for an AI Product Designer to shape the future of AI interfaces. You'll work on Claude's user experience, designing intuitive ways for people to interact with advanced AI. Responsibilities include user research, prototyping AI-native UX patterns, collaborating with ML engineers, and defining design systems for AI products. You'll need deep expertise in product design, understanding of LLM capabilities, and experience designing for AI/ML products.","Figma,React,Prototyping,User Research,AI/ML Understanding,Design Systems,Python,Interaction Design",Emerging AI,160000,220000,San Francisco CA,Full-time
```

### 🚀 Action Items:

1. **Use BrightData MCP** to scrape the job boards listed above
2. **Parse and structure** the data according to the CSV format
3. **Validate** the output against the checklist
4. **Save** to `/Users/wivak/puo-jects/____active/futureshift/public/data/job_postings.csv`
5. **Confirm** the file was created successfully with 121 lines

### 💬 After Completion, Report:

- Total jobs scraped: __
- Jobs per category breakdown
- Any issues encountered
- Average salary ranges found
- Company size distribution
- Geographic distribution
- File location confirmed

---

## 🎯 Ready to Start?

Please confirm you understand the requirements, then begin scraping using BrightData MCP. Let me know when the CSV file is ready!
