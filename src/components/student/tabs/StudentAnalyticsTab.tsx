import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  TrendingUp,
  Download,
  Award,
  BookOpen,
  Target,
  ShieldCheck,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export const StudentAnalyticsTab: React.FC = () => {
  const { profile, interviewSessions, applications, showToast } = useApp();

  const handleExportReport = () => {
    const reportContent = `CAREERFORGE COMPREHENSIVE STUDENT ANALYTICS REPORT
Candidate: ${profile.name}
Degree: ${profile.degree} (${profile.university})
CGPA: ${profile.cgpa} | Current Semester: ${profile.currentSemester}
Target Role: ${profile.targetRole}

READINESS BREAKDOWN:
• Job Readiness: ${profile.readiness.jobScore}%
• Internship Readiness: ${profile.readiness.internshipScore}%
• Domain Mastery: ${profile.readiness.domainScore}%

INTERVIEW PROGRESSION:
${interviewSessions.map((s, i) => `#${i + 1} (${s.date}): ${s.role} - Score: ${s.score}%`).join('\n')}

ACTIVE APPLICATIONS: ${applications.length}
CURRENT QUEST LEVEL: Level ${profile.level} (${profile.xp} XP)
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareerForge-Analytics-${profile.name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Comprehensive Analytics Report exported!');
  };

  const semesterTrend = [
    { sem: 'Sem 1', gpa: 8.4, pct: 84 },
    { sem: 'Sem 2', gpa: 8.6, pct: 86 },
    { sem: 'Sem 3', gpa: 8.7, pct: 87 },
    { sem: 'Sem 4', gpa: 8.9, pct: 89 },
    { sem: 'Sem 5', gpa: 9.0, pct: 90 },
    { sem: 'Sem 6', gpa: 8.9, pct: 89 },
    { sem: 'Sem 7', gpa: 8.84, pct: 88.4 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Student Career Analytics & Growth</h2>
              <p className="text-xs text-slate-400">
                Longitudinal telemetry tracking academic trajectory, mock interview scores, ATS improvements, and domain readiness.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Career Growth Report</span>
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Overall CGPA</span>
          <div className="text-3xl font-extrabold text-white mt-1">{profile.cgpa}</div>
          <p className="text-[11px] text-emerald-400 mt-1">Consistent first-class distinction</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Interview Average</span>
          <div className="text-3xl font-extrabold text-indigo-400 mt-1">86%</div>
          <p className="text-[11px] text-slate-400 mt-1">Across {interviewSessions.length} sessions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">ATS Resume Index</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">86/100</div>
          <p className="text-[11px] text-emerald-400 mt-1">+14 pts over baseline</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Applications</span>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{applications.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">1 Interview confirmed</p>
        </div>
      </div>

      {/* Academic Semester Trend Bar Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Academic Performance Across Semesters (GPA Scale 10.0)</span>
          </h3>
          <span className="text-xs text-slate-400">Target: &gt;8.5 for placement tier</span>
        </div>

        <div className="pt-4 flex items-end justify-between h-44 gap-2">
          {semesterTrend.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-bold text-white">{item.gpa}</span>
              <div className="w-full max-w-[42px] bg-slate-950 rounded-t-xl overflow-hidden h-32 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-emerald-400 rounded-t-xl transition-all duration-700"
                  style={{ height: `${(item.gpa / 10) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{item.sem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Progression & Skill Competency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Interview Progression */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Interview Performance History</span>
          </h3>

          <div className="space-y-3">
            {interviewSessions.map((sess, idx) => (
              <div key={sess.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{sess.role}</h4>
                    <p className="text-[10px] text-slate-400">{sess.persona} • {sess.date}</p>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-400">{sess.score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${sess.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Competency Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Verified Domain Competency</span>
          </h3>

          <div className="space-y-3">
            {[
              { skill: 'Frontend & React 19 State Management', score: 94 },
              { skill: 'Distributed Backend & RESTful Services', score: 90 },
              { skill: 'Database Optimization & SQL Modeling', score: 82 },
              { skill: 'System Design & High-Concurrency Primitives', score: 78 },
              { skill: 'Containerization & Cloud CI/CD', score: 72 },
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-medium">{s.skill}</span>
                  <span className="text-indigo-400 font-bold">{s.score}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-2 rounded-full ${
                      s.score >= 90 ? 'bg-emerald-500' : s.score >= 80 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
