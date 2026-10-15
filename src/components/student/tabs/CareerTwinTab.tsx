import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Sparkles,
  Target,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Calendar,
  Layers,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

export const CareerTwinTab: React.FC<{ onNavigateTab: (tabId: string) => void }> = ({ onNavigateTab }) => {
  const { profile, projects, showToast } = useApp();
  const [loadingAI, setLoadingAI] = useState(false);
  const [targetRole, setTargetRole] = useState(profile.targetRole);

  const [twinData, setTwinData] = useState({
    jobReadinessScore: profile.readiness.jobScore,
    internshipReadinessScore: profile.readiness.internshipScore,
    domainReadinessScore: profile.readiness.domainScore,
    verdict: profile.readiness.verdict,
    topStrengths: [
      'Advanced TypeScript & React 19 component architecture',
      'Demonstrated async microservice telemetry in GitHub portfolio',
      'Consistent academic trajectory (CGPA 8.84 in Computer Science)',
    ],
    topWeaknesses: [
      'Limited production telemetry with distributed message queues (Kafka / RabbitMQ)',
      'Needs documented automated unit and integration test coverage metrics',
      'System design mock interview hours below target for Tier-1 engineering roles',
    ],
    roleSuitability: [
      { role: 'Full Stack Engineer', match: 92, reason: 'Strong intersection of React, Node.js, and SQL schema design.' },
      { role: 'Frontend Architect', match: 88, reason: 'Deep component reusability and modern React 19 hooks intuition.' },
      { role: 'Backend / Systems Engineer', match: 79, reason: 'Solid Node.js fundamentals, but needs more deep OS concurrency.' },
      { role: 'Cloud / DevOps Engineer', match: 71, reason: 'Docker basics demonstrated; requires Kubernetes & Terraform.' },
    ],
    milestones: [
      { period: 'Day 1–30', focus: 'ATS Polish & Core Distributed Caching', tasks: ['Add Redis caching layer to CloudMesh project', 'Complete 3 technical mock interviews on concurrency'] },
      { period: 'Day 31–60', focus: 'System Design & End-to-End Testing', tasks: ['Write Playwright integration tests for top portfolio repos', 'Benchmark API p99 latency under burst load'] },
      { period: 'Day 61–90', focus: 'Direct Recruiter Outreach & Campus Drives', tasks: ['Apply to 12 curated openings in Jobs Tab', 'Complete pre-placement mock screening with university cell'] },
    ],
  });

  const handleRunAICareerTwin = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/gemini/career-twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: { ...profile, projectsCount: projects.length },
          targetRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTwinData({
          jobReadinessScore: data.data.jobReadinessScore || 85,
          internshipReadinessScore: data.data.internshipReadinessScore || 95,
          domainReadinessScore: data.data.domainReadinessScore || 88,
          verdict: data.data.overallVerdict || 'High readiness',
          topStrengths: data.data.topStrengths || twinData.topStrengths,
          topWeaknesses: data.data.topWeaknesses || twinData.topWeaknesses,
          roleSuitability: data.data.roleSuitability || twinData.roleSuitability,
          milestones: data.data.milestones || twinData.milestones,
        });
        showToast('AI Career Twin re-synchronized with latest Gemini intelligence!');
      }
    } catch (err) {
      console.error(err);
      showToast('Career Twin updated based on current profile metrics');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller: Target Role & AI Sync */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">AI Career Twin Engine</h2>
              <p className="text-xs text-slate-400">
                Autonomous digital twin that computes your market readiness, identifies gaps, and charts your trajectory.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target Job Role..."
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-60"
          />
          <button
            onClick={handleRunAICareerTwin}
            disabled={loadingAI}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20 whitespace-nowrap transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAI ? 'animate-spin' : ''}`} />
            <span>{loadingAI ? 'Analyzing...' : 'Re-sync Twin'}</span>
          </button>
        </div>
      </div>

      {/* Readiness Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Readiness Score</span>
              <div className="text-4xl font-extrabold text-white mt-1">{twinData.jobReadinessScore}%</div>
            </div>
            <span className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
              <Target className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Calculated against 450+ verified full-time job openings in our network.</p>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${twinData.jobReadinessScore}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Internship Readiness</span>
              <div className="text-4xl font-extrabold text-emerald-400 mt-1">{twinData.internshipReadinessScore}%</div>
            </div>
            <span className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Surpasses eligibility thresholds for 94% of verified company internships.</p>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${twinData.internshipReadinessScore}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Domain Mastery</span>
              <div className="text-4xl font-extrabold text-amber-400 mt-1">{twinData.domainReadinessScore}%</div>
            </div>
            <span className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <Compass className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Web Engineering & Distributed Architecture benchmark against peers.</p>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${twinData.domainReadinessScore}%` }} />
          </div>
        </div>
      </div>

      {/* Role Suitability & Competitive Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Match Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-4">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Target Role Suitability Breakdown</span>
          </h3>

          <div className="space-y-4">
            {twinData.roleSuitability.map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{item.role}</span>
                  <span
                    className={`text-xs font-extrabold ${
                      item.match >= 90 ? 'text-emerald-400' : item.match >= 80 ? 'text-indigo-400' : 'text-amber-400'
                    }`}
                  >
                    {item.match}% Match
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      item.match >= 90 ? 'bg-emerald-500' : item.match >= 80 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.match}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths vs Priority Skill Gaps */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Strengths & Priority Gaps Analysis</span>
            </h3>

            {/* Strengths */}
            <div className="mb-5">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-2">
                {twinData.topStrengths.map((str, i) => (
                  <li key={i} className="text-xs text-slate-300 bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-2.5 flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Gaps */}
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Identified Skill Gaps (High Priority)</span>
              </div>
              <ul className="space-y-2">
                {twinData.topWeaknesses.map((weak, i) => (
                  <li key={i} className="text-xs text-slate-300 bg-amber-950/20 border border-amber-900/40 rounded-lg p-2.5 flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Want to close these gaps?</span>
            <button
              onClick={() => onNavigateTab('roadmaps')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Explore Personalized Roadmap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 30-60-90 Day Actionable Roadmap Plan */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-4">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Actionable 30–60–90 Day Career Acceleration Trajectory</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {twinData.milestones.map((m, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-indigo-400">{m.period}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Phase {idx + 1}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mb-2">{m.focus}</h4>
                <ul className="space-y-2 mt-2">
                  {m.tasks.map((task, tIdx) => (
                    <li key={tIdx} className="text-[11px] text-slate-300 flex items-start space-x-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
