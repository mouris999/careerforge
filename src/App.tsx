import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { StudentDashboard } from './components/student/StudentDashboard';
import { UniversityDashboard } from './components/university/UniversityDashboard';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { CheckCircle2, AlertCircle, Info, Sparkles, Heart } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { role, toast } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        {/* Navigation Header */}
        <Header />

        {/* Dynamic Portal View based on active role */}
        <div className="animate-in fade-in duration-200">
          {role === 'student' && <StudentDashboard />}
          {role === 'university' && <UniversityDashboard />}
          {role === 'company' && <CompanyDashboard />}
        </div>
      </div>

      {/* Unified Platform Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 mt-16 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white text-sm">CareerForge</span>
            <span>—</span>
            <span>Autonomous Career Intelligence & Institutional Placement Ecosystem</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-500">
            <span>Student Portal</span>
            <span>•</span>
            <span>University Workspace</span>
            <span>•</span>
            <span>ATS Hiring Suite</span>
          </div>
        </div>
      </footer>

      {/* Global Floating Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
          <span className="text-slate-100">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
