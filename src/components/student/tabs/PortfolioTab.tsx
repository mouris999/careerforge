import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProjectItem } from '../../../types';
import {
  Github,
  Plus,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Award,
  Globe,
  Star,
  Search,
  Code,
  FileText,
  Lightbulb,
} from 'lucide-react';

export const PortfolioTab: React.FC = () => {
  const { projects, addProject, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [analyzingRepo, setAnalyzingRepo] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [status, setStatus] = useState<'In Progress' | 'Completed' | 'Planned'>('Completed');

  // Hackathon Showcase Data
  const hackathonWinners = [
    {
      title: 'AegisDNS — Zero-Trust Edge Threat Interceptor',
      hackathon: 'ETHDenver & Cloudflare Security Hackathon (1st Place)',
      tech: ['Rust', 'WebAssembly', 'DNS-over-HTTPS', 'TypeScript'],
      summary: 'Autonomous DNS filter intercepting malicious payloads with edge WASM sandboxing and <2ms overhead.',
      takeaway: 'Focus on high throughput benchmarks and an instant 1-click live demo in the README.',
    },
    {
      title: 'NeuroScribe — Multi-Modal Clinical Scribe',
      hackathon: 'Google Cloud Frontier AI Global Challenge (Grand Prize)',
      tech: ['Gemini 3.8 Flash', 'Next.js', 'WebRTC', 'FastAPI'],
      summary: 'Real-time conversational audio transcription converting doctor-patient dialogue into FHIR EHR records.',
      takeaway: 'Quantified metrics: 99.4% medical entity extraction accuracy and HIPAA-compliant mock encryption.',
    },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showToast('Please provide a title and description.', 'info');
      return;
    }

    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProject({
      title,
      description,
      problemStatement: problemStatement || 'High latency and unoptimized synchronization across distributed clients.',
      solution: solution || 'Engineered an asynchronous worker queue with in-memory caching.',
      techStack: techStack.length > 0 ? techStack : ['TypeScript', 'React', 'Node.js'],
      githubUrl: githubUrl || 'https://github.com/alexchen-dev/project',
      liveUrl,
      status,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setProblemStatement('');
    setSolution('');
    setTechStackInput('');
    setGithubUrl('');
    setLiveUrl('');
    setShowAddModal(false);
  };

  const handleAnalyzeReadme = (projId: string) => {
    setAnalyzingRepo(projId);
    setTimeout(() => {
      setAnalyzingRepo(null);
      showToast('GitHub README analyzed: Score 92/100 (Clean architecture diagram + CI badge detected)');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <Github className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Project Portfolio & Innovation Discovery</h2>
              <p className="text-xs text-slate-400">
                Showcase verified engineering projects with problem-solution framing, GitHub repository analysis, and hackathon winner case studies.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Main Grid: Projects List & Hackathon Inspiration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Projects Showcase (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-sm sm:text-base font-bold text-white">{proj.title}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{proj.date} • {proj.techStack.join(', ')}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {proj.stars !== undefined && (
                      <span className="flex items-center space-x-1 text-xs text-amber-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{proj.stars}</span>
                      </span>
                    )}
                    <button
                      onClick={() => handleAnalyzeReadme(proj.id)}
                      disabled={analyzingRepo === proj.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-850 text-indigo-400 border border-slate-800 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{analyzingRepo === proj.id ? 'Auditing...' : 'Audit README'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                {/* Structured Problem & Solution Framing for Recruiters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-rose-400 block mb-1">Problem Statement:</span>
                    <p className="text-slate-300">{proj.problemStatement}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">Technical Solution:</span>
                    <p className="text-slate-300">{proj.solution}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repo</span>
                    </a>
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-semibold"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hackathon Winners & Project Idea Generator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hackathon Winners Research */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Global Hackathon Winner Analysis</span>
            </h3>

            <div className="space-y-3">
              {hackathonWinners.map((winner, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{winner.title}</h4>
                    <span className="text-[10px] text-amber-400 font-semibold">{winner.hackathon}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{winner.summary}</p>
                  <div className="bg-slate-900 p-2 rounded-lg text-[10px] text-emerald-300 border border-slate-800">
                    <strong>Winning Factor:</strong> {winner.takeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Project Idea Prompt */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Lightbulb className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Need a Breakthrough Project?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recruiters prioritize projects that showcase distributed concurrency, telemetry metrics, and clear trade-off rationale over generic CRUD apps.
            </p>
            <button
              onClick={() => showToast('Suggested idea: Build an eBPF request tracer with WebSocket streaming visualizer!')}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
            >
              Generate Tailored Project Idea
            </button>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Project to Career Portfolio</h3>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Engine"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Overview Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief synopsis of what the project achieves..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Problem Statement</label>
                  <input
                    type="text"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Specific bottleneck addressed"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Technical Solution</label>
                  <input
                    type="text"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Key architectural mechanism"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="TypeScript, React, Docker, Redis"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://demo.app"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save to Portfolio (+150 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
