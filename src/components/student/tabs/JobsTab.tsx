import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { JobOpening } from '../../../types';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Send,
  Building,
  ArrowRight,
} from 'lucide-react';

export const JobsTab: React.FC = () => {
  const { jobs, applications, applyToJob, profile, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'browse' | 'applied'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState<'All' | 'Remote' | 'Hybrid' | 'On-site'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Full-time' | 'Internship'>('All');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesWorkMode = workModeFilter === 'All' || job.workMode === workModeFilter;
    const matchesType = typeFilter === 'All' || job.type === typeFilter;

    return matchesSearch && matchesWorkMode && matchesType;
  });

  const hasApplied = (jobId: string) => {
    return applications.some((app) => app.jobId === jobId);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <Briefcase className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Jobs & Internship Opportunities</h2>
              <p className="text-xs text-slate-400">
                Verified tech openings directly connected to our recruiter talent network with automated eligibility checks.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Browse vs Application Tracker */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'browse' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Browse Openings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'applied' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        /* Browse View */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, company, or skills..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="All">All Locations</option>
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="All">All Positions</option>
                <option value="Internship">Internship Only</option>
                <option value="Full-time">Full-time Only</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              const applied = hasApplied(job.id);
              // Calculate eligibility
              const matchedSkillsCount = job.requiredSkills.filter((s) =>
                profile.skills.some((ps) => ps.name.toLowerCase().includes(s.toLowerCase()))
              ).length;
              const matchPercent = Math.min(98, Math.round((matchedSkillsCount / job.requiredSkills.length) * 100));

              return (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white">{job.title}</h3>
                          {job.isVerified && (
                            <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Recruiter</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                          <span className="font-semibold text-slate-300">{job.company}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{job.location}</span>
                          </span>
                          <span>•</span>
                          <span>{job.salaryOrStipend}</span>
                        </div>
                      </div>
                    </div>

                    {/* Eligibility Badge & 1-Click Apply */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Candidate Fit</span>
                        <span
                          className={`text-xs font-extrabold ${
                            matchPercent >= 80 ? 'text-emerald-400' : 'text-indigo-400'
                          }`}
                        >
                          {matchPercent}% Match
                        </span>
                      </div>

                      {applied ? (
                        <span className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold flex items-center space-x-1 border border-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => applyToJob(job)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>1-Click Apply</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-semibold mr-1">Required:</span>
                      {job.requiredSkills.map((skill, sIdx) => {
                        const candidateHas = profile.skills.some((ps) =>
                          ps.name.toLowerCase().includes(skill.toLowerCase())
                        );
                        return (
                          <span
                            key={sIdx}
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              candidateHas
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                            }`}
                          >
                            {skill} {candidateHas ? '✓' : ''}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                      <span>Posted {job.postedDate}</span>
                      <span>•</span>
                      <span>{job.applicantsCount} Applicants</span>
                      <span>•</span>
                      <span className="text-amber-400">Deadline: {job.deadline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Application Status Tracking View */
        <div className="space-y-4">
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{app.jobTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {app.company} • Applied on {app.appliedDate}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      app.status === 'Interview'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : app.status === 'Shortlisted'
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        : app.status === 'Assessment'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Current Stage: {app.status}
                  </span>
                </div>

                {app.interviewScheduledDate && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>
                      <strong>Interview Confirmed:</strong> {app.interviewScheduledDate}
                    </span>
                  </div>
                )}

                {app.notes && (
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-semibold block mb-0.5">Recruiter Notes:</span>
                    {app.notes}
                  </p>
                )}

                {/* Visual Pipeline Progress */}
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                  {['Applied', 'Under Review', 'Shortlisted', 'Assessment', 'Interview', 'Offer'].map((st, i) => {
                    const isPassed =
                      (app.status === 'Offer' && i <= 5) ||
                      (app.status === 'Interview' && i <= 4) ||
                      (app.status === 'Assessment' && i <= 3) ||
                      (app.status === 'Shortlisted' && i <= 2) ||
                      (app.status === 'Under Review' && i <= 1) ||
                      (app.status === 'Applied' && i === 0);

                    return (
                      <div key={st} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-3 h-3 rounded-full mb-1 ${
                            isPassed ? 'bg-indigo-500 ring-2 ring-indigo-500/30' : 'bg-slate-800'
                          }`}
                        />
                        <span className={`hidden sm:inline ${isPassed ? 'text-indigo-300 font-bold' : ''}`}>{st}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
