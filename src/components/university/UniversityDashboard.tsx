import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversitySubRole } from '../../types';
import {
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  Plus,
  Search,
  Download,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const UniversityDashboard: React.FC = () => {
  const {
    universitySubRole,
    setUniversitySubRole,
    profile,
    campusDrives,
    addCampusDrive,
    universityResources,
    addUniversityResource,
    questions,
    addQuestion,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'faculty_workspace' | 'placement_cell' | 'assessments'>('overview');

  // Modals
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showUploadResourceModal, setShowUploadResourceModal] = useState(false);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);

  // New Drive Form
  const [driveCompany, setDriveCompany] = useState('');
  const [driveRole, setDriveRole] = useState('');
  const [drivePackage, setDrivePackage] = useState('');
  const [driveCriteria, setDriveCriteria] = useState('CGPA >= 8.0, Computer Science & Engineering');
  const [driveDate, setDriveDate] = useState('2026-11-20');

  // New Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState('Distributed Systems');
  const [resType, setResType] = useState<'PDF' | 'Notes' | 'Video' | 'Quiz'>('PDF');
  const [resSize, setResSize] = useState('3.5 MB');

  // New Quiz Question Form
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizDomain, setQuizDomain] = useState('Distributed Systems');
  const [quizDifficulty, setQuizDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  // Sample student directory data
  const studentDirectory = [
    { id: '1', name: profile.name, branch: 'Computer Science', sem: 7, cgpa: profile.cgpa, readiness: profile.readiness.jobScore, status: 'Eligible for Tier-1 Drives' },
    { id: '2', name: 'Maya Lin', branch: 'Computer Science', sem: 7, cgpa: 9.12, readiness: 95, status: 'Placed (Google SDE)' },
    { id: '3', name: 'Daniel Kim', branch: 'Information Technology', sem: 7, cgpa: 8.45, readiness: 82, status: 'Shortlisted (Linear)' },
    { id: '4', name: 'Priya Sharma', branch: 'Computer Science', sem: 7, cgpa: 8.78, readiness: 88, status: 'Eligible for Tier-1 Drives' },
    { id: '5', name: 'James Wilson', branch: 'Electrical & CS', sem: 7, cgpa: 7.21, readiness: 64, status: 'Academic Intervention Alert' },
  ];

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveCompany || !driveRole) return;
    addCampusDrive({
      companyName: driveCompany,
      roleTitle: driveRole,
      packageLPA: drivePackage || '$130,000 / year',
      eligibilityCriteria: driveCriteria,
      driveDate,
      status: 'Upcoming',
    });
    setDriveCompany('');
    setDriveRole('');
    setShowDriveModal(false);
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle) return;
    addUniversityResource({
      title: resTitle,
      subject: resSubject,
      facultyName: 'Prof. David Karger',
      type: resType,
      fileSizeOrDuration: resSize,
    });
    setResTitle('');
    setShowUploadResourceModal(false);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestion || !opt0 || !opt1) return;
    addQuestion({
      question: quizQuestion,
      category: 'Technical',
      domain: quizDomain,
      difficulty: quizDifficulty,
      options: [opt0, opt1, opt2, opt3].filter(Boolean),
      correctOptionIndex: correctIdx,
      explanation: explanation || 'Standard university evaluation concept.',
    });
    setQuizQuestion('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExplanation('');
    setShowCreateQuizModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* University Portal Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Stanford Institute of Technology</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Institutional Workspace
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Department of Computer Science & Placement Management System (PMS)
            </p>
          </div>
        </div>

        {/* Sub-Role Context Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 font-semibold px-2">Access:</span>
          {(['admin', 'placement_officer', 'faculty'] as UniversitySubRole[]).map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setUniversitySubRole(sub);
                showToast(`Switched to: ${sub === 'faculty' ? 'Faculty Workspace' : sub === 'placement_officer' ? 'Placement Cell' : 'Admin'}`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                universitySubRole === sub
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sub === 'faculty' ? 'Faculty / Professor' : sub === 'placement_officer' ? 'Placement Cell' : 'Institution Admin'}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Institution Overview', icon: <Building2 className="w-4 h-4" /> },
          { id: 'students', label: 'Student Directory & Cohorts', icon: <Users className="w-4 h-4" /> },
          { id: 'faculty_workspace', label: 'Faculty / Professor Workspace', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'placement_cell', label: 'Placement Cell & Campus Drives', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'assessments', label: 'Cohort Skill Gap Assessments', icon: <Sparkles className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Institutional KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Enrolled Seniors</span>
              <div className="text-3xl font-extrabold text-white mt-1">1,480</div>
              <p className="text-[11px] text-emerald-400 mt-1">Class of 2027 Placement Ready</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Placement Rate</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">91.4%</div>
              <p className="text-[11px] text-slate-400 mt-1">+4.2% YoY increase</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Campus CTC</span>
              <div className="text-3xl font-extrabold text-indigo-400 mt-1">$134,000</div>
              <p className="text-[11px] text-indigo-300 mt-1">Top offer: $210,000</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Partner Companies</span>
              <div className="text-3xl font-extrabold text-amber-400 mt-1">54</div>
              <p className="text-[11px] text-amber-300 mt-1">Including Stripe, Datadog, Linear</p>
            </div>
          </div>

          {/* Department Placement Readiness Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Department-Wise Placement Readiness Indicators</span>
              </h3>
              <span className="text-xs text-slate-400">Class Cohort 2027</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { dept: 'Computer Science & Engineering', students: 480, readyPct: 94, placedCount: 162 },
                { dept: 'Information Systems & Cloud', students: 360, readyPct: 88, placedCount: 114 },
                { dept: 'Artificial Intelligence & Data', students: 240, readyPct: 91, placedCount: 88 },
              ].map((d, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{d.dept}</h4>
                    <span className="text-xs font-extrabold text-emerald-400">{d.readyPct}% Ready</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${d.readyPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{d.students} Students</span>
                    <span className="text-emerald-400 font-semibold">{d.placedCount} Placed to Date</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Students Directory */}
      {activeTab === 'students' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Student Directory & Placement Readiness
              </h3>
              <p className="text-xs text-slate-400">Live roster verified with student mock interview and ATS records.</p>
            </div>
            <button
              onClick={() => showToast('Student directory exported to CSV!')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Roster CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Branch & Sem</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Job Readiness</th>
                  <th className="py-3 px-4">Placement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {studentDirectory.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-850/50">
                    <td className="py-3.5 px-4 font-bold text-white">{st.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{st.branch} • Sem {st.sem}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-400">{st.cgpa}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-emerald-400">{st.readiness}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          st.status.includes('Placed')
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : st.status.includes('Alert')
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Faculty / Professor Workspace */}
      {activeTab === 'faculty_workspace' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-700/40">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Professor David Karger's Teaching Workspace</h3>
                  <p className="text-xs text-slate-400">Courses: CS 401 (Distributed Systems) & CS 305 (Operating Systems)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowUploadResourceModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Lecture Notes / PDF</span>
              </button>
              <button
                onClick={() => setShowCreateQuizModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Create Quiz Question</span>
              </button>
            </div>
          </div>

          {/* Published Resources & Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Shared Course Materials ({universityResources.length})</span>
              </h4>
              <div className="space-y-3">
                {universityResources.map((res) => (
                  <div key={res.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">{res.title}</h5>
                      <p className="text-[10px] text-slate-400">{res.subject} • {res.fileSizeOrDuration} • {res.downloads} student downloads</p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Intervention Alerts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Academic Support & Intervention Alerts (2 Students)</span>
              </h4>
              <div className="space-y-3">
                <div className="bg-amber-950/20 border border-amber-900/60 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">James Wilson (Roll #4092)</span>
                    <span className="text-[10px] font-bold text-amber-400">Readiness: 64%</span>
                  </div>
                  <p className="text-slate-300">Missed 2 consecutive mock interviews. Recommended 1-on-1 tutoring session.</p>
                </div>
                <div className="bg-amber-950/20 border border-amber-900/60 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Sophia Miller (Roll #4114)</span>
                    <span className="text-[10px] font-bold text-amber-400">Readiness: 68%</span>
                  </div>
                  <p className="text-slate-300">Struggles with Distributed Concurrency module. Assigned extra question set.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Placement Cell & Campus Drives */}
      {activeTab === 'placement_cell' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Campus Recruitment Drives (Placement Season 2026-27)</h3>
              <p className="text-xs text-slate-400">Coordinate on-campus and virtual hiring drives with verified employer partners.</p>
            </div>

            <button
              onClick={() => setShowDriveModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Campus Drive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {campusDrives.map((drive) => (
              <div key={drive.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{drive.companyName}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">{drive.roleTitle}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {drive.status}
                    </span>
                  </div>

                  <div className="mt-3 text-xs space-y-1 text-slate-300">
                    <div><strong>CTC / Compensation:</strong> {drive.packageLPA}</div>
                    <div><strong>Eligibility:</strong> {drive.eligibilityCriteria}</div>
                    <div className="text-slate-400"><strong>Drive Date:</strong> {drive.driveDate}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{drive.registeredCount} Registered</span>
                  <span className="text-indigo-400 font-bold">{drive.shortlistedCount} Shortlisted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Cohort Skill Gap Assessments */}
      {activeTab === 'assessments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Batch-Wide Skill Gap & Pre-Placement Training Report
            </h3>
            <span className="text-xs text-slate-400">Synthesized from 840+ mock interview submissions</span>
          </div>

          <div className="space-y-4">
            {[
              { topic: 'Distributed Caching (Redis & Memcached)', passRate: 64, action: 'Scheduled 2-part weekend masterclass on in-memory architectures' },
              { topic: 'System Design: Rate Limiting & Message Queues', passRate: 71, action: 'Added interactive coding challenges to student question bank' },
              { topic: 'STAR Behavioral Framework & Leadership', passRate: 88, action: 'Alumni peer mock review sessions ongoing' },
              { topic: 'React 19 & TypeScript State Management', passRate: 92, action: 'Exceeding target readiness threshold across batch' },
            ].map((gap, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-white">{gap.topic}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        gap.passRate >= 80 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}
                    >
                      {gap.passRate}% Cohort Pass Rate
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Action Plan: {gap.action}</p>
                </div>

                <button
                  onClick={() => showToast(`Assigned booster training for "${gap.topic}" to batch!`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold whitespace-nowrap shadow"
                >
                  Assign Booster Training
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Schedule Drive */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Schedule Campus Recruitment Drive</h3>
            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={driveCompany}
                  onChange={(e) => setDriveCompany(e.target.value)}
                  placeholder="e.g. Stripe International"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={driveRole}
                  onChange={(e) => setDriveRole(e.target.value)}
                  placeholder="e.g. SDE Campus Cohort 2027"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Package CTC</label>
                  <input
                    type="text"
                    value={drivePackage}
                    onChange={(e) => setDrivePackage(e.target.value)}
                    placeholder="$140,000 / year"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Drive Date</label>
                  <input
                    type="date"
                    value={driveDate}
                    onChange={(e) => setDriveDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={driveCriteria}
                  onChange={(e) => setDriveCriteria(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Publish Campus Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Resource */}
      {showUploadResourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Share Lecture Resource</h3>
            <form onSubmit={handleUploadResource} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. CS 401 — Raft Protocol Consensus Notes"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Format Type</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Notes">Notes</option>
                    <option value="Video">Video</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadResourceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Upload & Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Quiz */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create Quiz Question</h3>
            <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Prompt</label>
                <textarea
                  required
                  rows={2}
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  placeholder="e.g. What condition causes split votes in Raft consensus?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Domain</label>
                  <input
                    type="text"
                    value={quizDomain}
                    onChange={(e) => setQuizDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Multiple Choice Options (Select Correct Index)</label>
                {[opt0, opt1, opt2, opt3].map((val, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === idx}
                      onChange={() => setCorrectIdx(idx)}
                      className="text-emerald-500"
                    />
                    <input
                      type="text"
                      required={idx < 2}
                      value={idx === 0 ? opt0 : idx === 1 ? opt1 : idx === 2 ? opt2 : opt3}
                      onChange={(e) => {
                        if (idx === 0) setOpt0(e.target.value);
                        else if (idx === 1) setOpt1(e.target.value);
                        else if (idx === 2) setOpt2(e.target.value);
                        else setOpt3(e.target.value);
                      }}
                      placeholder={`Option #${idx + 1}`}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Explanation</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Why this answer is correct..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateQuizModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Publish to Question Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
