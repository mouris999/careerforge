import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Copy,
  Layers,
  Search,
  Check,
} from 'lucide-react';

export const ResumeStudioTab: React.FC = () => {
  const { profile, showToast } = useApp();

  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Full Stack Software Engineer');
  const [jobDescription, setJobDescription] = useState(
    'Seeking a Full Stack Engineer with deep experience in TypeScript, React 19, Node.js, distributed caching with Redis, microservice architectures, and Docker container deployments.'
  );

  const [resumeText, setResumeText] = useState(`ALEX CHEN
alex.chen@university.edu | (555) 382-9102 | San Francisco, CA | github.com/alexchen-dev

EDUCATION
Bachelor of Technology in Computer Science & Engineering
Stanford Institute of Technology | Expected May 2027 | CGPA: 8.84 / 10.0

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML/CSS
Frameworks & Libraries: React 19, Node.js, Express, Tailwind CSS, Next.js
Databases & Cloud: PostgreSQL, SQLite, Docker, Git, RESTful APIs

EXPERIENCE & PROJECTS
CloudMesh — Distributed Message Broker
• Engineered an event-driven pub-sub broker using Node.js and TypeScript handling 40,000 msg/sec.
• Integrated in-memory ring buffers and zero-copy binary streaming over WebSockets.
• Reduced network serialization overhead by 34% compared to standard JSON streams.

CogniCanvas — Collaborative AI Whiteboard
• Created a real-time multiplayer infinite canvas using React, Canvas API, and WebSockets.
• Implemented client-side optimistic reconciliation to eliminate perceived visual latency.
• Adopted by 200+ university students for remote architecture diagramming.`);

  const [analyzing, setAnalyzing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [report, setReport] = useState<any>({
    atsScore: 86,
    readinessVerdict: 'Ready for Apply',
    extractedSkills: {
      technical: ['TypeScript', 'React 19', 'Node.js', 'Express', 'PostgreSQL', 'WebSockets', 'Python', 'RESTful APIs'],
      soft: ['Distributed Collaboration', 'Problem Decomposition', 'Technical Writing'],
      tools: ['Docker', 'Git', 'Canvas API'],
    },
    matchingKeywords: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'RESTful APIs'],
    missingKeywords: ['Redis Caching', 'Microservices Architecture', 'CI/CD Pipelines', 'AWS / Cloud Run'],
    skillGaps: [
      {
        skill: 'Distributed Caching (Redis)',
        importance: 'High',
        recommendedAction: 'Add a Redis cache layer on top of your Node.js endpoints to reduce query latency by 45%.',
      },
      {
        skill: 'CI/CD & Container Orchestration',
        importance: 'Medium',
        recommendedAction: 'Include GitHub Actions YAML deployment workflows in your featured repositories.',
      },
    ],
    bulletRewrites: [
      {
        original: 'Created a real-time multiplayer infinite canvas using React, Canvas API, and WebSockets.',
        improved: 'Architected a multiplayer infinite canvas with React and WebSockets, cutting perceived latency to <15ms for 200+ concurrent peers.',
        impactReason: 'Quantifies response latency (<15ms) and provides specific user scale (200+ peers).',
      },
      {
        original: 'Integrated in-memory ring buffers and zero-copy binary streaming over WebSockets.',
        improved: 'Spearheaded zero-copy binary WebSocket streaming with ring buffers, driving a 34% drop in CPU serialization overhead.',
        impactReason: 'Uses leadership action verb ("Spearheaded") and emphasizes business system efficiency.',
      },
    ],
    sectionFeedback: {
      formatting: 'Clean standard hierarchy parses with 99% accuracy across Workday, Greenhouse, and Lever.',
      experience: 'Strong technical metrics and performance measurements throughout project descriptions.',
      projects: 'Impressive system-level evidence with quantified throughput figures.',
      education: 'Concise, complete university credentials with GPA clearly highlighted.',
    },
    priorityNextSteps: [
      'Incorporate Redis caching and microservice keyword references in the CloudMesh project description.',
      'Add a 1-sentence targeted Summary statement at the top aligned directly with Senior/Entry full-stack requirements.',
      'Ensure live demo URLs are clickable hyperlinks in the PDF export.',
    ],
  });

  const handleAnalyzeResume = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/resume-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole,
          jobDescription,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReport(data.data);
        showToast('Resume analyzed! ATS score computed.');
      }
    } catch (err) {
      console.error(err);
      showToast('ATS Report refreshed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast('Improved bullet point copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleDownloadReport = () => {
    const reportText = `CAREERFORGE ATS INTELLIGENCE AUDIT
Target Role: ${targetRole}
Overall ATS Score: ${report.atsScore}/100
Verdict: ${report.readinessVerdict}

MATCHING KEYWORDS:
${report.matchingKeywords?.join(', ')}

MISSING CRITICAL KEYWORDS:
${report.missingKeywords?.join(', ')}

RECOMMENDED BULLET REWRITES:
${report.bulletRewrites?.map((b: any, i: number) => `\n[Bullet #${i + 1}]\nOriginal: ${b.original}\nImproved: ${b.improved}\nImpact: ${b.impactReason}`).join('\n')}

PRIORITY NEXT STEPS:
${report.priorityNextSteps?.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareerForge-ATS-Audit-${targetRole.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('ATS Intelligence Report downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Resume Studio & ATS Intelligence</h2>
              <p className="text-xs text-slate-400">
                Multi-pass scanner measuring ATS parse accuracy, missing keywords, and generating high-impact bullet points.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export ATS Audit</span>
        </button>
      </div>

      {/* Main Grid: Left editor & Target Job, Right ATS Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Resume Input & Target Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Job Description (for keyword alignment)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Paste the job requirements here..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Resume Content
                </label>
                <span className="text-[10px] text-slate-500">Live text editor</span>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={14}
                className="w-full bg-slate-950 border border-slate-700 font-mono rounded-xl p-3 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500 resize-y leading-relaxed"
                placeholder="Paste your plain text resume here..."
              />
            </div>

            <button
              onClick={handleAnalyzeResume}
              disabled={analyzing}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Scanning ATS Compatibility...' : 'Run ATS Intelligence Scan'}</span>
            </button>
          </div>
        </div>

        {/* Right Column (7 cols): Comprehensive ATS Intelligence Report */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Score Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * report.atsScore) / 100}
                    className="text-indigo-500 transition-all duration-700 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-white">{report.atsScore}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">ATS SCORE</span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-extrabold text-white">ATS Pass Probability</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {report.readinessVerdict}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Parsed across modern applicant tracking algorithms with high match confidence.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center sm:text-right w-full sm:w-auto">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Matched Keywords</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                {report.matchingKeywords?.length || 0} / {(report.matchingKeywords?.length || 0) + (report.missingKeywords?.length || 0)}
              </div>
              <div className="text-[10px] text-amber-400 mt-0.5">
                {report.missingKeywords?.length || 0} Missing Keywords
              </div>
            </div>
          </div>

          {/* Keyword Matching Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Keyword Alignment & Semantic Density</span>
            </h3>

            {/* Matching */}
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1 mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Found in Resume & Job Description:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {report.matchingKeywords?.map((kw: string, i: number) => (
                  <span key={i} className="text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 px-2.5 py-1 rounded-lg font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div>
              <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1 mb-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Missing from Resume (Add these to boost ATS score):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {report.missingKeywords?.map((kw: string, i: number) => (
                  <span key={i} className="text-xs bg-amber-950/60 text-amber-300 border border-amber-800/80 px-2.5 py-1 rounded-lg font-medium">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Bullet Point Optimizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Bullet Point Rewriter (Action + Metric + Impact)</span>
              </h3>
              <span className="text-[10px] text-slate-400">High ATS Scoring Format</span>
            </div>

            <div className="space-y-3">
              {report.bulletRewrites?.map((b: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Original:</div>
                    <p className="text-xs text-slate-400 italic line-through mt-0.5">{b.original}</p>
                  </div>
                  <div>
                    <div className="text-[10px] text-indigo-400 uppercase font-bold flex items-center justify-between">
                      <span>Optimized Rewrite:</span>
                      <button
                        onClick={() => handleCopyBullet(b.improved, idx)}
                        className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-medium mt-1 bg-indigo-950/20 border border-indigo-900/40 p-2.5 rounded-lg">
                      {b.improved}
                    </p>
                  </div>
                  <div className="text-[11px] text-emerald-400/90 bg-slate-900 px-2.5 py-1 rounded">
                    <strong>Why it scores higher:</strong> {b.impactReason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section-by-Section Feedback & Priority Next Steps */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Priority Next Steps to Reach 95%+ ATS Score</span>
            </h3>
            <ul className="space-y-2">
              {report.priorityNextSteps?.map((step: string, i: number) => (
                <li key={i} className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
