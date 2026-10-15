import React, { useState } from 'react';
import { Scene as TempleNightSceneCard } from '../../../components/common/Scene';
import { useApp } from '../../../context/AppContext';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Sparkles,
  TrendingUp,
  Calendar,
  CheckCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const OverviewTab: React.FC<{ onNavigateTab: (tabId: string) => void }> = ({ onNavigateTab }) => {
  const { profile, updateProfile, projects, applications, quests } = useApp();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(profile.bio);

  const completedQuestsCount = quests.filter((q) => q.completed).length;

  return (
    <div className="space-y-6">
      {/* Hero Banner with Career Twin Readiness Glance */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Student</span>
                </span>
              </div>
              <p className="text-slate-300 text-sm font-medium mt-0.5">{profile.headline}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{profile.degree}</span>
                </span>
                <span>•</span>
                <span>{profile.university}</span>
                <span>•</span>
                <span className="text-indigo-300 font-semibold">Semester {profile.currentSemester} (CGPA {profile.cgpa})</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center min-w-[95px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Job Ready</div>
              <div className="text-2xl font-extrabold text-indigo-400 mt-0.5">{profile.readiness.jobScore}%</div>
              <div className="text-[10px] text-emerald-400 font-medium">Top 8% batch</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center min-w-[95px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Intern Ready</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{profile.readiness.internshipScore}%</div>
              <div className="text-[10px] text-slate-400">High Match</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center min-w-[95px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Profile Comp.</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{profile.profileCompletion}%</div>
              <div className="text-[10px] text-slate-400">+12% to complete</div>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-xl">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Profile Completion Checklist</span>
              <span className="text-amber-400 font-bold">{profile.profileCompletion}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profile.profileCompletion}%` }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('resume')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Scan Resume</span>
            </button>
            <button
              onClick={() => onNavigateTab('interview')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
            >
              <span>Practice Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Skill Highlights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio & Career Objectives */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Executive Summary & Objectives</span>
              </h2>
              {isEditingBio ? (
                <button
                  onClick={() => {
                    updateProfile({ bio: newBio });
                    setIsEditingBio(false);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Save Bio
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Edit Bio
                </button>
              )}
            </div>
            {isEditingBio ? (
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">{profile.bio}</p>
            )}

            {/* Target Role & Social links */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Target Role:</span>
                <span className="font-semibold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/60">
                  {profile.targetRole}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-slate-400 hover:text-emerald-300 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </a>
              </div>
            </div>
          </div>

          {/* Academic Semester Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Academic Semester Performance</span>
              </h2>
              <span className="text-xs text-slate-400">Graduating Class of {profile.graduationYear}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { sem: 'Sem 1', gpa: '8.4', status: 'Passed' },
                { sem: 'Sem 2', gpa: '8.6', status: 'Passed' },
                { sem: 'Sem 3', gpa: '8.7', status: 'Passed' },
                { sem: 'Sem 4', gpa: '8.9', status: 'Passed' },
                { sem: 'Sem 5', gpa: '9.0', status: 'Passed' },
                { sem: 'Sem 6', gpa: '8.9', status: 'Passed' },
                { sem: 'Sem 7 (Current)', gpa: '8.84', status: 'Ongoing' },
                { sem: 'Sem 8', gpa: '—', status: 'Upcoming' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[11px] font-semibold text-slate-400">{item.sem}</span>
                  <div className="text-base font-extrabold text-white mt-0.5">{item.gpa}</div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-medium mt-1 inline-block ${
                      item.status === 'Ongoing'
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                        : item.status === 'Passed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Proficiency Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Demonstrated Skills & Proficiency</span>
              </h2>
              <button
                onClick={() => onNavigateTab('learning')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Verify via Assessment →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {profile.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{skill.name}</span>
                    {skill.verified ? (
                      <span className="text-[9px] font-semibold text-emerald-400 flex items-center" title="Verified by Assessment">
                        <CheckCircle className="w-3 h-3 text-emerald-400 mr-0.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500">Self-reported</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        skill.level === 'Expert'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : skill.level === 'Advanced'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          : skill.level === 'Intermediate'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Applications, Quests & Projects */}
        <div className="space-y-6">
          {/* Active Job Applications */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Job Applications ({applications.length})</span>
              </h2>
              <button
                onClick={() => onNavigateTab('jobs')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Browse Jobs →
              </button>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{app.jobTitle}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{app.company} • Applied {app.appliedDate}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Interview'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : app.status === 'Shortlisted'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  {app.interviewScheduledDate && (
                    <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-800/60">
                      <Calendar className="w-3 h-3" />
                      <span>{app.interviewScheduledDate}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quests Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Active Quests ({completedQuestsCount}/{quests.length})</span>
              </h2>
              <button
                onClick={() => onNavigateTab('quests')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                View Quests →
              </button>
            </div>

            <div className="space-y-2.5">
              {quests.slice(0, 3).map((quest) => (
                <div key={quest.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{quest.title}</span>
                    <span className="text-[10px] font-bold text-amber-400">+{quest.xpReward} XP</span>
                  </div>
                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${quest.completed ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Featured Projects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Github className="w-4 h-4 text-indigo-400" />
                <span>Featured Projects ({projects.length})</span>
              </h2>
              <button
                onClick={() => onNavigateTab('portfolio')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Manage Portfolio →
              </button>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 2).map((proj) => (
                <div key={proj.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-200 hover:text-indigo-400 transition-colors">
                      {proj.title}
                    </h4>
                    {proj.stars !== undefined && proj.stars > 0 && (
                      <span className="text-[10px] font-semibold text-amber-400">★ {proj.stars}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {proj.techStack.map((t, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Temple Night Scene */}
      <TempleNightSceneCard />
    </div>
  );
};
