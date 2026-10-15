import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { INITIAL_MENTORS } from '../../../data/mockData';
import {
  Users,
  Star,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Award,
  Sparkles,
  Send,
} from 'lucide-react';

export const MentorshipTab: React.FC = () => {
  const { profile, showToast } = useApp();
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [sessionTopic, setSessionTopic] = useState('System Design & Resume Teardown');
  const [sessionDate, setSessionDate] = useState('2026-10-22');

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Mentorship session booked with ${selectedMentor?.name} for ${sessionDate}! Invitation sent.`);
    setSelectedMentor(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Institutional Mentorship & Alumni Network</h2>
              <p className="text-xs text-slate-400">
                Connect with verified university alumni and senior industry leaders at Google, Vercel, and DeepMind for 1-on-1 career guidance.
              </p>
            </div>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-semibold">
          140+ Alumni in Network
        </span>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {INITIAL_MENTORS.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-3.5">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-white">{m.name}</h3>
                  </div>
                  <p className="text-xs font-medium text-indigo-400">{m.role}</p>
                  <p className="text-[11px] text-slate-400">{m.company}</p>
                </div>
              </div>

              {m.alumniOf && (
                <div className="bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-lg text-[10px] text-emerald-300 font-semibold flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>Alumni: {m.alumniOf}</span>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">{m.bio}</p>

              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1.5">
                  Core Expertise:
                </span>
                <div className="flex flex-wrap gap-1">
                  {m.expertise.map((exp, idx) => (
                    <span key={idx} className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-800">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{m.rating}</span>
                <span className="text-slate-500 text-[10px] font-normal">({m.experienceYears}y exp)</span>
              </div>

              <button
                onClick={() => setSelectedMentor(m)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
              >
                Book 1-on-1 Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <img
                src={selectedMentor.avatar}
                alt={selectedMentor.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/40"
              />
              <div>
                <h3 className="text-sm font-bold text-white">Book Mentorship with {selectedMentor.name}</h3>
                <p className="text-xs text-slate-400">{selectedMentor.role} at {selectedMentor.company}</p>
              </div>
            </div>

            <form onSubmit={handleBookSession} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Session Objective</label>
                <select
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="System Design & Resume Teardown">System Design & Resume Teardown</option>
                  <option value="Mock Coding & Algorithmic Optimization">Mock Coding & Algorithmic Optimization</option>
                  <option value="Placement Referral & Company Insight">Placement Referral & Company Insight</option>
                  <option value="Transition to AI / Cloud Engineering">Transition to AI / Cloud Engineering</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-slate-300 text-[11px]">
                Sessions are 45 minutes and include pre-session resume review and actionable post-meeting action notes.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
