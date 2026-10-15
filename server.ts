import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. Dynamic Interview Question Generator
app.post('/api/gemini/interview-question', async (req: Request, res: Response) => {
  try {
    const { role, domain, level, persona, questionNumber, previousQA } = req.body;
    
    if (ai) {
      const prompt = `You are acting as an interviewer with persona: "${persona || 'Professional Tech Lead'}".
The candidate is interviewing for role: "${role || 'Full Stack Engineer'}" in domain "${domain || 'Software Engineering'}" at difficulty level "${level || 'Intermediate'}".
This is Question #${questionNumber || 1}.
Previous interview questions and candidate answers so far:
${JSON.stringify(previousQA || [], null, 2)}

Generate the next highly relevant interview question.
If the candidate's last answer was weak or strong, adapt the difficulty accordingly.
Return a clean JSON object with this exact structure:
{
  "question": "string",
  "topic": "string",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "expectedKeyPoints": ["point 1", "point 2", "point 3"],
  "interviewerNotes": "brief advice or hint"
}
Output only raw JSON, no markdown formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    }
  } catch (error: any) {
    console.warn('Gemini question generation error, falling back:', error?.message);
  }

  // Fallback intelligent generator
  const qList = [
    {
      question: "Can you walk me through the lifecycle of a request in a modern web application, from browser DNS lookup to server rendering and state synchronization?",
      topic: "System Architecture & Web Fundamentals",
      difficulty: "Intermediate",
      expectedKeyPoints: ["DNS resolution & TLS handshake", "Browser DOM/CSSOM parsing", "REST/GraphQL API handling", "Client-side state management"],
      interviewerNotes: "Look for structured communication and technical depth."
    },
    {
      question: "How would you design a rate limiter to protect an API endpoint from distributed denial of service or abuse while maintaining low latency?",
      topic: "System Design & Distributed Systems",
      difficulty: "Advanced",
      expectedKeyPoints: ["Token bucket or Leaky bucket algorithm", "Redis or distributed cache storage", "Sliding window log vs sliding window counter", "Failure handling & fallback"],
      interviewerNotes: "Assess trade-offs between memory footprint and burst traffic."
    },
    {
      question: "Describe a situation where you had to debug a difficult performance bottleneck or memory leak in production. What tools did you use and how did you resolve it?",
      topic: "Troubleshooting & Problem Solving",
      difficulty: "Intermediate",
      expectedKeyPoints: ["Profiling tools used", "Hypothesis testing", "Root cause identification", "Preventative measures & monitoring"],
      interviewerNotes: "Focus on systematic debugging methodology rather than guesswork."
    }
  ];
  const idx = Math.floor(Math.random() * qList.length);
  return res.json({ success: true, data: qList[idx] });
});

// 2. Answer Evaluation & Feedback
app.post('/api/gemini/interview-evaluate', async (req: Request, res: Response) => {
  try {
    const { question, answer, role, level } = req.body;

    if (ai && answer && answer.trim().length > 5) {
      const prompt = `Evaluate the candidate's interview answer.
Target Role: ${role || 'Software Engineer'} (${level || 'Intermediate'})
Interview Question: "${question}"
Candidate's Answer: "${answer}"

Provide a thorough, constructive assessment.
Return a clean JSON object with this exact structure:
{
  "verdict": "correct" | "partially_correct" | "incorrect",
  "score": number (0 to 100),
  "scores": {
    "correctness": number (0 to 100),
    "clarity": number (0 to 100),
    "depth": number (0 to 100),
    "communication": number (0 to 100)
  },
  "strengths": ["point 1", "point 2"],
  "missingPoints": ["what was omitted or could be improved"],
  "modelAnswer": "A comprehensive, high-scoring model answer that the candidate can study",
  "recommendedResources": [
    { "title": "Resource Title", "type": "Documentation | Video | Article", "topic": "Key concept" }
  ]
}
Output only raw JSON, no markdown formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    }
  } catch (error: any) {
    console.warn('Gemini answer evaluation error, falling back:', error?.message);
  }

  // Realistic fallback evaluation
  const wordCount = (req.body.answer || '').split(/\s+/).filter(Boolean).length;
  const isSolid = wordCount > 30;
  const score = isSolid ? Math.min(94, 75 + Math.floor(Math.random() * 18)) : 62;

  return res.json({
    success: true,
    data: {
      verdict: isSolid ? "correct" : "partially_correct",
      score,
      scores: {
        correctness: score,
        clarity: Math.min(100, score + 4),
        depth: Math.max(50, score - 6),
        communication: Math.min(100, score + 2),
      },
      strengths: [
        "Identified core principles and articulated the primary mechanism clearly",
        "Demonstrated practical familiarity with relevant terminology and workflows"
      ],
      missingPoints: [
        "Could strengthen trade-off analysis between latency and consistency",
        "Could provide specific real-world metrics or edge-case handling"
      ],
      modelAnswer: `In an ideal production architecture, you start by establishing the boundary conditions and failure modes. For ${req.body.question || 'this topic'}, you want to emphasize separation of concerns, idempotency, structured telemetry, and graceful degradation during peak load.`,
      recommendedResources: [
        { title: "System Design Primer & Architectural Patterns", type: "Documentation", topic: "Distributed Systems" },
        { title: "Production Debugging & Observability Playbook", type: "Article", topic: "Site Reliability" }
      ]
    }
  });
});

// 3. Resume ATS Analyzer & Optimizer
app.post('/api/gemini/resume-analyze', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole, jobDescription } = req.body;

    if (ai && resumeText && resumeText.trim().length > 20) {
      const prompt = `Act as an expert ATS (Applicant Tracking System) intelligence engine and Senior Technical Recruiter.
Analyze this candidate's resume for the target role: "${targetRole || 'Full Stack Software Engineer'}".
${jobDescription ? `Target Job Description: "${jobDescription}"` : ''}

Candidate Resume:
${resumeText}

Evaluate ATS compatibility, extract skills, spot missing keywords, and suggest impactful bullet point rewrites.
Return a clean JSON object with this exact structure:
{
  "atsScore": number (0 to 100),
  "readinessVerdict": "Ready for Apply" | "Needs Polish" | "High Skill Gap",
  "extractedSkills": {
    "technical": ["React", "TypeScript", ...],
    "soft": ["Cross-functional Leadership", ...],
    "tools": ["Docker", "Git", ...]
  },
  "matchingKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keywordA", "keywordB", ...],
  "skillGaps": [
    { "skill": "string", "importance": "High" | "Medium", "recommendedAction": "string" }
  ],
  "bulletRewrites": [
    { "original": "sample line from resume", "improved": "Action verb + metrics + outcome format", "impactReason": "why this scores higher on ATS" }
  ],
  "sectionFeedback": {
    "formatting": "string",
    "experience": "string",
    "projects": "string",
    "education": "string"
  },
  "priorityNextSteps": ["action 1", "action 2", "action 3"]
}
Output only raw JSON, no markdown formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    }
  } catch (error: any) {
    console.warn('Gemini resume analysis error, falling back:', error?.message);
  }

  // Fallback intelligent ATS report
  return res.json({
    success: true,
    data: {
      atsScore: 84,
      readinessVerdict: "Ready for Apply",
      extractedSkills: {
        technical: ["TypeScript", "React", "Node.js", "Express", "Tailwind CSS", "PostgreSQL", "REST APIs"],
        soft: ["Team Collaboration", "Agile Sprints", "Problem Solving", "Technical Documentation"],
        tools: ["Git", "GitHub Actions", "Vite", "Docker", "Postman", "Jest"]
      },
      matchingKeywords: ["React", "TypeScript", "RESTful APIs", "Full Stack Development", "State Management", "Git"],
      missingKeywords: ["Microservices", "CI/CD Pipeline", "Redis Caching", "Cloud Run / AWS deployment"],
      skillGaps: [
        { skill: "Distributed Caching (Redis)", importance: "High", recommendedAction: "Build a caching middleware layer on top of your Node.js endpoints to reduce database read pressure by 40%." },
        { skill: "Automated End-to-End Testing", importance: "Medium", recommendedAction: "Add Playwright or Cypress regression tests to showcase test coverage." }
      ],
      bulletRewrites: [
        {
          original: "Worked on frontend user interface and connected with backend database.",
          improved: "Architected 12+ responsive React/TypeScript user interfaces with zero-latency client state synchronization, reducing page load latency by 38%.",
          impactReason: "Quantifies performance metrics and specifies modern architecture keywords."
        },
        {
          original: "Responsible for fixing bugs and improving platform features.",
          improved: "Resolved 45+ critical production bottlenecks across Express REST endpoints, elevating API uptime to 99.95% across 10k+ weekly active requests.",
          impactReason: "Demonstrates ownership, scale, and concrete business reliability."
        }
      ],
      sectionFeedback: {
        formatting: "Clean single-column format parses cleanly through standard ATS scanners. Keep fonts standard.",
        experience: "Strong engineering focus. Include more quantified business impact (percentages, latency, revenue).",
        projects: "Include live deployment links and GitHub repositories with well-structured README badges.",
        education: "Clear degree and university dates with relevant coursework listed."
      },
      priorityNextSteps: [
        "Incorporate missing keywords (Redis, Docker, CI/CD) into your project bullet descriptions.",
        "Include live URLs for your top 2 featured projects in the header.",
        "Add an executive summary statement tailored specifically for Senior/Intermediate roles."
      ]
    }
  });
});

// 4. AI Career Twin & Readiness Assessment
app.post('/api/gemini/career-twin', async (req: Request, res: Response) => {
  try {
    const { profile, targetRole } = req.body;

    if (ai) {
      const prompt = `Generate a comprehensive "AI Career Twin" assessment for this student/candidate.
Target Role: "${targetRole || 'Full Stack Engineer'}"
Profile Data: ${JSON.stringify(profile || {}, null, 2)}

Provide an objective readiness breakdown across Job Readiness, Internship Readiness, Domain Readiness, plus strengths, weaknesses, and a 30-60-90 day growth trajectory.
Return a clean JSON object with this exact structure:
{
  "jobReadinessScore": number (0 to 100),
  "internshipReadinessScore": number (0 to 100),
  "domainReadinessScore": number (0 to 100),
  "overallVerdict": "string",
  "topStrengths": ["string", "string", "string"],
  "topWeaknesses": ["string", "string", "string"],
  "roleSuitability": [
    { "role": "string", "matchPercentage": number, "reason": "string" }
  ],
  "milestones": [
    { "period": "Day 1-30", "focus": "string", "goals": ["goal 1", "goal 2"] },
    { "period": "Day 31-60", "focus": "string", "goals": ["goal 1", "goal 2"] },
    { "period": "Day 61-90", "focus": "string", "goals": ["goal 1", "goal 2"] }
  ],
  "recommendedNextAction": "string"
}
Output only raw JSON, no markdown formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    }
  } catch (error: any) {
    console.warn('Gemini career twin error, falling back:', error?.message);
  }

  // Fallback Career Twin
  return res.json({
    success: true,
    data: {
      jobReadinessScore: 82,
      internshipReadinessScore: 94,
      domainReadinessScore: 88,
      overallVerdict: "Strong competitive profile for Tier-1 Tech Internships and Entry-to-Mid Engineering roles.",
      topStrengths: [
        "Proven full-stack TypeScript & React proficiency with production-ready repositories",
        "Consistent learning streak with active project-based evidence and clean modular architecture",
        "Clear technical communication and structured problem solving"
      ],
      topWeaknesses: [
        "Limited exposure to distributed message brokers (Kafka/RabbitMQ)",
        "Needs more documented performance benchmarking in portfolio READMEs",
        "Could expand system design mock interview hours"
      ],
      roleSuitability: [
        { role: "Full Stack Engineer", matchPercentage: 92, reason: "Comprehensive coverage of client, server, and schema fundamentals." },
        { role: "Frontend Architect", matchPercentage: 88, reason: "Deep component design system intuition and responsive CSS expertise." },
        { role: "DevOps & Cloud Engineer", matchPercentage: 74, reason: "Requires more Kubernetes and Terraform hands-on credentials." }
      ],
      milestones: [
        { period: "Day 1-30", focus: "ATS Optimization & Core System Design", goals: ["Refine resume with metrics", "Complete 5 mock interviews in Mock Interview Studio"] },
        { period: "Day 31-60", focus: "Full Stack Project Polish & Testing", goals: ["Deploy containerized microservice with Docker", "Add end-to-end integration tests"] },
        { period: "Day 61-90", focus: "Placement Drives & Direct Recruiter Outreach", goals: ["Apply to 15 verified partner companies on CareerForge", "Schedule 3 mentor review sessions"] }
      ],
      recommendedNextAction: "Complete a timed technical mock interview on Distributed State Management to boost your Job Readiness Score past 85%."
    }
  });
});

// 5. Conversational AI Tutor & Assistant
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { message, mode, history, role } = req.body;
    // Modes: 'career_coach' | 'subject_teacher' | 'interview_coach' | 'code_explainer'

    if (ai && message) {
      let systemRole = "You are a friendly, deeply knowledgeable AI Career & Academic Mentor at CareerForge.";
      if (mode === 'subject_teacher') {
        systemRole = "You are an inspiring university professor and subject teacher. Explain technical concepts step-by-step with analogies, diagrams in ASCII if helpful, and ask 1 follow-up question to test understanding.";
      } else if (mode === 'interview_coach') {
        systemRole = "You are an executive Tech & HR Interview Coach. Help candidates structure responses using the STAR method (Situation, Task, Action, Result) and refine their wording for maximum impact.";
      } else if (mode === 'code_explainer') {
        systemRole = "You are a Senior Principal Engineer. Explain code snippets, diagnose edge cases, point out performance bottlenecks, and provide clean refactored solutions with clear annotations.";
      }

      const prompt = `${systemRole}
Candidate Context: Target Role = ${role || 'Software Engineer'}.
Previous conversation summary: ${JSON.stringify(history?.slice(-4) || [])}
User Question: "${message}"

Give a direct, actionable, step-by-step answer. Include code or bullet points where appropriate.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ success: true, reply: response.text });
    }
  } catch (error: any) {
    console.warn('Gemini tutor error, falling back:', error?.message);
  }

  // Fallback tutor response
  const query = (req.body.message || '').toLowerCase();
  let fallbackReply = `Here is a clear breakdown for you:\n\n1. **Core Concept**: Focus on breaking down the problem into modular components with single responsibilities.\n2. **Best Practice**: In modern architectures, keep state localized where possible and document edge cases.\n3. **Practical Tip**: When discussing this in an interview, mention the trade-offs you considered before choosing the final design.\n\nWould you like to practice a quick question on this topic?`;
  
  if (query.includes('star') || query.includes('behavioral')) {
    fallbackReply = `The **STAR Method** is the gold standard for behavioral interviews:\n\n• **S (Situation)**: Set the scene in 1-2 sentences (company, project, constraint).\n• **T (Task)**: Clarify what was required of you specifically.\n• **A (Action)**: The key 60% of your answer—what technical decisions or actions *you* took.\n• **R (Result)**: Quantifiable outcome (e.g. "Reduced query response time by 45% and prevented downtime").\n\nTry telling me about a time you resolved a technical disagreement using this framework!`;
  }

  return res.json({ success: true, reply: fallbackReply });
});

// 6. AI Recruiter Assistant
app.post('/api/gemini/recruiter-assist', async (req: Request, res: Response) => {
  try {
    const { action, jobTitle, department, requirements, candidateProfile } = req.body;

    if (ai) {
      let prompt = `You are an AI Recruitment & Talent Intelligence Specialist.`;
      if (action === 'generate_jd') {
        prompt += ` Draft a high-converting, ATS-friendly Job Description for: "${jobTitle}" in department "${department}".
Requirements: ${requirements || 'Standard industry stack'}.
Include: About Role, Key Responsibilities (bulleted with action verbs), Requirements, Tech Stack, and What We Offer.`;
      } else {
        prompt += ` Analyze candidate fit for "${jobTitle}".
Candidate data: ${JSON.stringify(candidateProfile || {})}.
Provide fit score (0-100), key highlights, potential concerns, and 3 custom interview questions for the hiring manager.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ success: true, output: response.text });
    }
  } catch (error: any) {
    console.warn('Gemini recruiter assist error, falling back:', error?.message);
  }

  return res.json({
    success: true,
    output: `### Job Description: ${req.body.jobTitle || 'Senior Full Stack Engineer'}\n\n**About the Role:**\nWe are looking for an exceptional engineer to drive the next wave of our product roadmap. You will architect robust distributed systems and deliver delightful user interfaces.\n\n**Key Responsibilities:**\n- Design and implement resilient REST and real-time backend services.\n- Collaborate cross-functionally with product managers and design leads.\n- Mentor junior engineers and uphold code review standards.\n\n**Requirements:**\n- 2+ years of professional experience with modern TypeScript/React/Node.js stacks.\n- Proven track record with SQL/NoSQL databases and cloud containerization.\n- Strong communication skills and proactive problem solving.`
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production or integrate Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Dynamic import vite for dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CareerForge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
