import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanySubRole, JobApplication, JobOpening } from '../../types';
import {
  Briefcase,
  Users,
  Search,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  FileText,
  UserCheck,
  Send,
  Building,
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const {
    companySubRole,
    setCompanySubRole,
    jobs,
    addJob,
    applications,
    updateApplicationStatus,
    profile,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'candidates' | 'ats' | 'interviews'>('overview');

  // Modals & Panels
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [interviewDateInput, setInterviewDateInput] = useState('Oct 24, 2026 at 10:00 AM PST');
  const [recruiterNotesInput, setRecruiterNotesInput] = useState('');

  // AI JD Generator
  const [generatingJD, setGeneratingJD] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Core Infrastructure');
  const [newJobLocation, setNewJobLocation] = useState('San Francisco, CA');
  const [newJobWorkMode, setNewJobWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [newJobType, setNewJobType] = useState<'Full-time' | 'Internship'>('Full-time');
  const [newJobSalary, setNewJobSalary] = useState('$130,000 - $155,000 / year');
  const [newJobSkills, setNewJobSkills] = useState('TypeScript, React, Node.js, Redis, Docker');
  const [newJobDescription, setNewJobDescription] = useState('');

  const handleGenerateAIJD = async () => {
    if (!newJobTitle) {
      showToast('Please enter a Job Title first.', 'info');
      return;
    }
    setGeneratingJD(true);
    try {
      const res = await fetch('/api/gemini/recruiter-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_jd',
          jobTitle: newJobTitle,
          department: newJobDept,
          requirements: newJobSkills,
        }),
      });
      const data = await res.json();
      if (data.success && data.output) {
        setNewJobDescription(data.output);
        showToast('AI drafted high-converting job description!');
      }
    } catch (err) {
      console.error(err);
      showToast('Generated job description template');
    } finally {
      setGeneratingJD(false);
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobDescription) return;

    addJob({
      title: newJobTitle,
      company: 'Linear Systems',
      companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
      location: newJobLocation,
      workMode: newJobWorkMode,
      type: newJobType,
      salaryOrStipend: newJobSalary,
      isPaid: true,
      experienceLevel: 'Entry Level',
      domain: newJobDept,
      requiredSkills: newJobSkills.split(',').map((s) => s.trim()).filter(Boolean),
      description: newJobDescription,
      deadline: 'Nov 30, 2026',
      isVerified: true,
    });

    setNewJobTitle('');
    setNewJobDescription('');
    setShowCreateJobModal(false);
  };

  const pipelineStages: JobApplication['status'][] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Company Portal Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-600/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Linear Systems & Partner Hiring Portal</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                Verified Employer
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Talent Acquisition, Applicant Tracking System (ATS) & Technical Interview Scorecards
            </p>
          </div>
        </div>

        {/* Recruiter Role Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 font-semibold px-2">Role:</span>
          {(['recruiter', 'interviewer', 'admin'] as CompanySubRole[]).map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setCompanySubRole(sub);
                showToast(`Switched to: ${sub === 'recruiter' ? 'Senior Recruiter' : sub === 'interviewer' ? 'Technical Interviewer' : 'Hiring Admin'}`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                companySubRole === sub
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sub === 'recruiter' ? 'Recruiter' : sub === 'interviewer' ? 'Tech Interviewer' : 'Admin'}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Company Overview & Metrics', icon: <Building className="w-4 h-4" /> },
          { id: 'jobs', label: 'Job & Internship Management', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'ats', label: 'Applicant Tracking System (ATS)', icon: <Users className="w-4 h-4" /> },
          { id: 'candidates', label: 'Candidate Discovery & Search', icon: <Search className="w-4 h-4" /> },
          { id: 'interviews', label: 'Interview Studio & Scorecards', icon: <Calendar className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Openings</span>
              <div className="text-3xl font-extrabold text-white mt-1">{jobs.length}</div>
              <p className="text-[11px] text-emerald-400 mt-1">Across 3 engineering teams</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Applicants</span>
              <div className="text-3xl font-extrabold text-amber-400 mt-1">{applications.length + 142}</div>
              <p className="text-[11px] text-slate-400 mt-1">12 awaiting initial screening</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Interviews Scheduled</span>
              <div className="text-3xl font-extrabold text-indigo-400 mt-1">8</div>
              <p className="text-[11px] text-indigo-300 mt-1">Next: Oct 24 at 10:00 AM</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Time-to-Hire</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">14.2 Days</div>
              <p className="text-[11px] text-emerald-400 mt-1">42% faster via CareerForge ATS</p>
            </div>
          </div>

          {/* Hiring Funnel Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Hiring Pipeline Conversion Funnel</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
              {[
                { stage: 'Applied', count: 144, pct: '100%' },
                { stage: 'Under Review', count: 86, pct: '59.7%' },
                { stage: 'Shortlisted', count: 42, pct: '29.1%' },
                { stage: 'Assessment', count: 28, pct: '19.4%' },
                { stage: 'Interview', count: 14, pct: '9.7%' },
                { stage: 'Offer Sent', count: 6, pct: '4.1%' },
              ].map((f, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <div className="text-xs font-bold text-white">{f.stage}</div>
                  <div className="text-xl font-extrabold text-amber-400 mt-1">{f.count}</div>
                  <span className="text-[10px] text-slate-400 font-semibold">{f.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Job & Internship Management */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Live Job & Internship Vacancies ({jobs.length})</h3>
              <p className="text-xs text-slate-400">Post vacancies that sync instantaneously with student candidate feeds.</p>
            </div>

            <button
              onClick={() => setShowCreateJobModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Vacancy</span>
            </button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{job.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {job.company} • {job.location} ({job.workMode}) • {job.salaryOrStipend}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-800">
                      {job.applicantsCount} Applicants
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('ats');
                        showToast(`Opened ATS for ${job.title}`);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      View Pipeline
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills.map((s, idx) => (
                    <span key={idx} className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ATS (Applicant Tracking System Kanban) */}
      {activeTab === 'ats' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">ATS Applicant Tracking Pipeline</h3>
              <p className="text-xs text-slate-400">
                Move applicants across hiring stages, schedule interviews, and log private scorecard evaluations.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {applications.length} Total Active Applicants
            </span>
          </div>

          {/* Pipeline Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineStages.slice(0, 6).map((stage) => {
              const stageApps = applications.filter((a) => a.status === stage);

              return (
                <div key={stage} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-3 min-h-[380px] flex flex-col">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300">{stage}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-amber-400">
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {stageApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedApplication(app);
                          setRecruiterNotesInput(app.notes || '');
                        }}
                        className="bg-slate-950 border border-slate-800 hover:border-amber-600/60 p-3 rounded-xl cursor-pointer transition-all shadow-sm space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{app.candidateName}</h5>
                          <span className="text-[10px] font-extrabold text-emerald-400">{app.matchScore}%</span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{app.jobTitle}</p>
                        <div className="text-[9px] text-slate-500 flex justify-between">
                          <span>CGPA: {app.candidateCgpa}</span>
                          <span>{app.appliedDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Candidate Discovery */}
      {activeTab === 'candidates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Student Talent Discovery & Skill Matching
              </h3>
              <p className="text-xs text-slate-400">
                Directly source graduating candidates with verified code sandbox and mock interview assessments.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search skills, degree, CGPA..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              { name: profile.name, college: profile.university, gpa: profile.cgpa, skills: ['TypeScript', 'React 19', 'PostgreSQL', 'Docker'], score: 94, avatar: profile.avatar },
              { name: 'Maya Lin', college: 'MIT Computer Science', gpa: 9.12, skills: ['Python', 'PyTorch', 'Distributed Systems'], score: 96, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
              { name: 'Daniel Kim', college: 'Stanford Institute of Tech', gpa: 8.45, skills: ['Go', 'Kubernetes', 'Prometheus'], score: 88, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
            ].map((cand, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-start space-x-3.5 justify-between">
                <div className="flex items-start space-x-3">
                  <img src={cand.avatar} alt={cand.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{cand.name}</h4>
                    <p className="text-[11px] text-slate-400">{cand.college} (CGPA {cand.gpa})</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cand.skills.map((s, i) => (
                        <span key={i} className="text-[9px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-extrabold text-emerald-400 block">{cand.score}% Fit</span>
                  <button
                    onClick={() => showToast(`Invited ${cand.name} to interview!`)}
                    className="mt-2 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold shadow"
                  >
                    Invite to Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Interviews */}
      {activeTab === 'interviews' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Upcoming Scheduled Interviews & Scorecards</span>
            </h3>
            <span className="text-xs text-slate-400">Google Meet / Video Room Integrated</span>
          </div>

          <div className="space-y-3">
            {applications.filter((a) => a.status === 'Interview').map((app) => (
              <div key={app.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">{app.candidateName} — {app.jobTitle}</h4>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    Slot: {app.interviewScheduledDate || 'Oct 24, 2026 at 10:00 AM PST'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Interviewer: Senior Technical Lead • Duration: 45m</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => showToast(`Launching evaluation scorecard for ${app.candidateName}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                  >
                    Open Scorecard
                  </button>
                  <button
                    onClick={() => showToast(`Joining interview session room with ${app.candidateName}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                  >
                    Join Video Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Job */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create New Job or Internship Vacancy</h3>
              <button
                type="button"
                onClick={handleGenerateAIJD}
                disabled={generatingJD}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1 shadow"
              >
                <Sparkles className={`w-3.5 h-3.5 ${generatingJD ? 'animate-spin' : ''}`} />
                <span>{generatingJD ? 'Drafting...' : 'AI Auto-Draft JD'}</span>
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Mode</label>
                  <select
                    value={newJobWorkMode}
                    onChange={(e) => setNewJobWorkMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role Type</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={newJobSkills}
                  onChange={(e) => setNewJobSkills(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Description</label>
                <textarea
                  required
                  rows={6}
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  placeholder="Click 'AI Auto-Draft JD' or write description..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateJobModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Publish Opening to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Candidate Action & ATS Stage Changer */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{selectedApplication.candidateName}</h3>
                <p className="text-xs text-slate-400">
                  {selectedApplication.jobTitle} • {selectedApplication.candidateEmail}
                </p>
              </div>
              <span className="text-sm font-extrabold text-emerald-400">
                {selectedApplication.matchScore}% Match
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Move Hiring Stage</label>
                <div className="grid grid-cols-3 gap-2">
                  {pipelineStages.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, st, recruiterNotesInput, interviewDateInput);
                        setSelectedApplication(null);
                      }}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-bold ${
                        selectedApplication.status === st
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Interview Date & Time Slot</label>
                <input
                  type="text"
                  value={interviewDateInput}
                  onChange={(e) => setInterviewDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Private Recruiter Notes</label>
                <textarea
                  rows={3}
                  value={recruiterNotesInput}
                  onChange={(e) => setRecruiterNotesInput(e.target.value)}
                  placeholder="Notes visible to hiring team members..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateApplicationStatus(
                      selectedApplication.id,
                      selectedApplication.status,
                      recruiterNotesInput,
                      interviewDateInput
                    );
                    setSelectedApplication(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Save Applicant Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
