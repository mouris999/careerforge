import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, UniversitySubRole, CompanySubRole } from '../../types';
import {
  Sparkles,
  GraduationCap,
  Building2,
  Briefcase,
  Flame,
  Award,
  Bell,
  CheckCircle2,
  ChevronDown,
  Layers,
  Search,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    universitySubRole,
    setUniversitySubRole,
    companySubRole,
    setCompanySubRole,
    profile,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSubRoleMenu, setShowSubRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    student: { label: 'Student Portal', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-indigo-600 text-white' },
    university: { label: 'University Portal', icon: <Building2 className="w-4 h-4" />, color: 'bg-emerald-600 text-white' },
    company: { label: 'Company Portal', icon: <Briefcase className="w-4 h-4" />, color: 'bg-amber-600 text-white' },
  };

  const uniSubRoleLabels: Record<UniversitySubRole, string> = {
    admin: 'Institution Admin',
    placement_officer: 'Placement Officer',
    faculty: 'Faculty / Professor Workspace',
  };

  const compSubRoleLabels: Record<CompanySubRole, string> = {
    recruiter: 'Senior Recruiter / ATS',
    interviewer: 'Technical Interviewer',
    admin: 'Hiring Team Admin',
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                CareerForge
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                AI Ecosystem
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Unified Career, Placement & Hiring Intelligence</p>
          </div>
        </div>

        {/* Center: Main Dashboard Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['student', 'university', 'company'] as UserRole[]).map((r) => {
            const isSelected = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? `${roleLabels[r].color} shadow-md`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {roleLabels[r].icon}
                <span className="hidden md:inline">{roleLabels[r].label.replace(' Portal', '')}</span>
                <span className="md:hidden capitalize">{r}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Sub-role selector & Student status badges & Notifications */}
        <div className="flex items-center space-x-3">
          {/* Sub-Role Selector for University */}
          {role === 'university' && (
            <div className="relative">
              <button
                onClick={() => setShowSubRoleMenu(!showSubRoleMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 text-xs font-medium hover:bg-emerald-900/40"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="max-w-[130px] truncate">{uniSubRoleLabels[universitySubRole]}</span>
                <ChevronDown className="w-3 h-3 text-emerald-400" />
              </button>
              {showSubRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch University Access:
                  </div>
                  {(['faculty', 'placement_officer', 'admin'] as UniversitySubRole[]).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setUniversitySubRole(sub);
                        setShowSubRoleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between ${
                        universitySubRole === sub
                          ? 'bg-emerald-600/20 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{uniSubRoleLabels[sub]}</span>
                      {universitySubRole === sub && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-Role Selector for Company */}
          {role === 'company' && (
            <div className="relative">
              <button
                onClick={() => setShowSubRoleMenu(!showSubRoleMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/80 text-xs font-medium hover:bg-amber-900/40"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="max-w-[130px] truncate">{compSubRoleLabels[companySubRole]}</span>
                <ChevronDown className="w-3 h-3 text-amber-400" />
              </button>
              {showSubRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Recruiter Role:
                  </div>
                  {(['recruiter', 'interviewer', 'admin'] as CompanySubRole[]).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setCompanySubRole(sub);
                        setShowSubRoleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between ${
                        companySubRole === sub
                          ? 'bg-amber-600/20 text-amber-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{compSubRoleLabels[sub]}</span>
                      {companySubRole === sub && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Student Gamification Badges */}
          {role === 'student' && (
            <div className="hidden lg:flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-amber-400 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{profile.streakDays}d Streak</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-indigo-400 font-medium">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>Lvl {profile.level} ({profile.xp} XP)</span>
              </div>
            </div>
          )}

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-700/60"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Notifications ({notifications.length})</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationRead(item.id)}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        item.read ? 'bg-slate-900/60 opacity-80' : 'bg-indigo-950/20'
                      } hover:bg-slate-800`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile avatar pill */}
          <div className="flex items-center space-x-2 pl-1 border-l border-slate-800">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">{profile.name}</div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {role === 'student' ? 'Student' : role === 'university' ? 'Faculty Admin' : 'Tech Recruiter'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
