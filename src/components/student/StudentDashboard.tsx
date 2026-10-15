import React, { useState } from 'react';
import {
  User,
  Sparkles,
  FileText,
  Video,
  Trophy,
  BookOpen,
  Compass,
  Briefcase,
  Github,
  Bot,
  Users,
  Award,
  FlaskConical,
  TrendingUp,
  Lock,
} from 'lucide-react';

import { OverviewTab } from './tabs/OverviewTab';
import { CareerTwinTab } from './tabs/CareerTwinTab';
import { ResumeStudioTab } from './tabs/ResumeStudioTab';
import { MockInterviewStudio } from './tabs/MockInterviewStudio';
import { SkillQuestTab } from './tabs/SkillQuestTab';
import { LearningHubTab } from './tabs/LearningHubTab';
import { RoadmapsTab } from './tabs/RoadmapsTab';
import { JobsTab } from './tabs/JobsTab';
import { PortfolioTab } from './tabs/PortfolioTab';
import { AITutorTab } from './tabs/AITutorTab';
import { StudyTogetherTab } from './tabs/StudyTogetherTab';
import { MentorshipTab } from './tabs/MentorshipTab';
import { VirtualLabTab } from './tabs/VirtualLabTab';
import { StudentAnalyticsTab } from './tabs/StudentAnalyticsTab';
import { VaultSettingsTab } from './tabs/VaultSettingsTab';

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview & Profile', icon: <User className="w-4 h-4" /> },
    { id: 'career_twin', label: 'AI Career Twin', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
    { id: 'resume', label: 'Resume & ATS', icon: <FileText className="w-4 h-4" /> },
    { id: 'interview', label: 'Mock Interview Studio', icon: <Video className="w-4 h-4 text-emerald-400" /> },
    { id: 'quests', label: 'Skill Quests', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
    { id: 'learning', label: 'Learning Hub & Sandbox', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'roadmaps', label: 'Career Roadmaps', icon: <Compass className="w-4 h-4" /> },
    { id: 'jobs', label: 'Jobs & Internships', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Projects & GitHub', icon: <Github className="w-4 h-4" /> },
    { id: 'tutor', label: 'AI Tutor & Mentor', icon: <Bot className="w-4 h-4 text-indigo-400" /> },
    { id: 'study_together', label: 'Study Together Room', icon: <Users className="w-4 h-4 text-emerald-400" /> },
    { id: 'mentorship', label: 'Mentors & Alumni', icon: <Award className="w-4 h-4" /> },
    { id: 'virtual_lab', label: 'VR & Simulation Lab', icon: <FlaskConical className="w-4 h-4 text-rose-400" /> },
    { id: 'analytics', label: 'Career Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'vault', label: 'Vault & Privacy', icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Horizontal Scrollable Nav Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-100 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Render Container */}
      <main className="min-h-[600px]">
        {activeTab === 'overview' && <OverviewTab onNavigateTab={setActiveTab} />}
        {activeTab === 'career_twin' && <CareerTwinTab onNavigateTab={setActiveTab} />}
        {activeTab === 'resume' && <ResumeStudioTab />}
        {activeTab === 'interview' && <MockInterviewStudio />}
        {activeTab === 'quests' && <SkillQuestTab />}
        {activeTab === 'learning' && <LearningHubTab />}
        {activeTab === 'roadmaps' && <RoadmapsTab />}
        {activeTab === 'jobs' && <JobsTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'tutor' && <AITutorTab />}
        {activeTab === 'study_together' && <StudyTogetherTab />}
        {activeTab === 'mentorship' && <MentorshipTab />}
        {activeTab === 'virtual_lab' && <VirtualLabTab />}
        {activeTab === 'analytics' && <StudentAnalyticsTab />}
        {activeTab === 'vault' && <VaultSettingsTab />}
      </main>
    </div>
  );
};
