import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Sparkles,
  Flame,
  Award,
  Trophy,
  CheckCircle,
  Clock,
  Compass,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';

export const SkillQuestTab: React.FC = () => {
  const { profile, quests, completeQuest, showToast } = useApp();
  const [filterCategory, setFilterCategory] = useState<'all' | 'interview' | 'coding' | 'resume' | 'project'>('all');

  const filteredQuests = filterCategory === 'all'
    ? quests
    : quests.filter((q) => q.category === filterCategory);

  const xpToNextLevel = (profile.level * 600) - profile.xp;
  const levelProgress = Math.max(0, Math.min(100, Math.round(((600 - xpToNextLevel) / 600) * 100)));

  const badges = [
    { title: 'STAR Method Master', desc: 'Completed 5 behavioral mock interviews with >85% score', icon: '🏆', unlocked: true },
    { title: 'ATS 90+ Club', desc: 'Achieved a 90%+ ATS resume compatibility score', icon: '🎯', unlocked: true },
    { title: 'Lab Virtuoso', desc: 'Mastered virtual chemistry acid-base titration', icon: '🧪', unlocked: true },
    { title: 'Open Source Vanguard', desc: 'Linked 3 active GitHub repositories with live demos', icon: '⚡', unlocked: true },
    { title: 'Conqueror of Concurrency', desc: 'Passed advanced distributed systems mock interview', icon: '🛡️', unlocked: false },
    { title: '30-Day Focus Titan', desc: 'Completed 30 consecutive days of learning streaks', icon: '🔥', unlocked: false },
  ];

  const leaderboard = [
    { rank: 1, name: 'Siddharth Rao', college: 'Stanford Institute of Tech', xp: 4890, level: 8, isUser: false },
    { rank: 2, name: 'Maya Lin', college: 'MIT CS Department', xp: 4420, level: 7, isUser: false },
    { rank: 3, name: 'Alex Chen (You)', college: 'Stanford Institute of Tech', xp: profile.xp, level: profile.level, isUser: true },
    { rank: 4, name: 'Daniel Kim', college: 'UC Berkeley EECS', xp: 3200, level: 6, isUser: false },
    { rank: 5, name: 'Priya Sharma', college: 'Georgia Tech Computing', xp: 2950, level: 5, isUser: false },
  ];

  return (
    <div className="space-y-6">
      {/* Top Gamification Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-600/40">
                <Trophy className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Skill Quest Engine</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                Season 4 Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Turn your placement preparation into structured daily quests. Earn XP, maintain your streak, level up, and unlock elite badges verified for recruiters.
            </p>
          </div>

          {/* Player Level & XP Gauge */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 w-full lg:w-80 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
                <span className="text-xs font-bold text-amber-400">{profile.streakDays} Day Streak!</span>
              </div>
              <span className="text-xs font-extrabold text-indigo-400">Level {profile.level}</span>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Total XP: <strong className="text-white">{profile.xp}</strong></span>
                <span className="text-slate-400">{xpToNextLevel > 0 ? `${xpToNextLevel} XP to Lvl ${profile.level + 1}` : 'Max Level'}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Grid & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Quests (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'all', label: 'All Quests' },
                { id: 'interview', label: 'Interview' },
                { id: 'coding', label: 'Coding' },
                { id: 'resume', label: 'Resume' },
                { id: 'project', label: 'Projects' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterCategory === tab.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Completed: {quests.filter((q) => q.completed).length} / {quests.length}
            </span>
          </div>

          {/* Quests List */}
          <div className="space-y-3">
            {filteredQuests.map((quest) => (
              <div
                key={quest.id}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all ${
                  quest.completed ? 'border-emerald-900/60 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          quest.type === 'daily'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {quest.type} Quest
                      </span>
                      <h4 className="text-sm font-bold text-white">{quest.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{quest.description}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-extrabold text-amber-400 block">+{quest.xpReward} XP</span>
                    {quest.completed ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 mt-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Claimed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => completeQuest(quest.id)}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                      >
                        Complete Quest
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Progress: {quest.progress} / {quest.maxProgress}
                  </span>
                  <div className="w-48 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${quest.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Badges & Achievements Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Unlocked Milestones & Credentials</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((b, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    b.unlocked
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-slate-950/40 border-slate-800/40 opacity-50'
                  }`}
                >
                  <div>
                    <div className="text-2xl mb-1.5">{b.icon}</div>
                    <div className="text-xs font-bold text-slate-200">{b.title}</div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{b.desc}</p>
                  </div>
                  <span
                    className={`text-[9px] font-bold mt-2 inline-block ${
                      b.unlocked ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {b.unlocked ? '✓ Verified Unlocked' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Peer Leaderboard (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Batch Leaderboard</span>
              </h3>
              <span className="text-[10px] text-slate-400">Weekly Refresh</span>
            </div>

            <div className="space-y-2.5">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    item.isUser
                      ? 'bg-indigo-950/40 border-indigo-700/60 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        item.rank === 1
                          ? 'bg-amber-500 text-slate-950'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.college}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-amber-400">{item.xp} XP</span>
                    <span className="text-[10px] text-slate-500 block">Lvl {item.level}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              Leaderboard compares demonstrated assessment points with consenting classmates from your graduating batch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
