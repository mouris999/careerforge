import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Lock,
  FileText,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Bell,
  Upload,
} from 'lucide-react';

export const VaultSettingsTab: React.FC = () => {
  const { profile, showToast } = useApp();

  const [visibility, setVisibility] = useState<'public' | 'university_only' | 'private'>('public');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);

  const [vaultFiles, setVaultFiles] = useState([
    { id: '1', name: 'Alex_Chen_Resume_2026_ATS.pdf', size: '240 KB', type: 'Resume', verified: true, date: 'Oct 12, 2026' },
    { id: '2', name: 'Official_Transcripts_Sem1_Sem6.pdf', size: '1.2 MB', type: 'Transcript', verified: true, date: 'Sep 28, 2026' },
    { id: '3', name: 'AWS_Certified_Developer_Badge.pdf', size: '480 KB', type: 'Certificate', verified: true, date: 'Aug 14, 2026' },
  ]);

  const handleUploadFile = () => {
    const newFile = {
      id: `doc_${Date.now()}`,
      name: `Document_Upload_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
      size: '350 KB',
      type: 'Certificate',
      verified: true,
      date: 'Just now',
    };
    setVaultFiles((prev) => [newFile, ...prev]);
    showToast('New credential uploaded to secure Document Vault!');
  };

  const handleDeleteFile = (id: string) => {
    setVaultFiles((prev) => prev.filter((f) => f.id !== id));
    showToast('File removed from Document Vault.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Document Vault & Privacy Controls</h2>
              <p className="text-xs text-slate-400">
                Encrypted repository for verified marksheets, resumes, and certificates with recruiter sharing controls.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleUploadFile}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Main Grid: Vault Files & Privacy Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vault Documents (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Stored Credentials & Files ({vaultFiles.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400">AES-256 Storage Simulation</span>
          </div>

          <div className="space-y-3">
            {vaultFiles.map((file) => (
              <div key={file.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/60">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{file.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {file.type} • {file.size} • Uploaded {file.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.verified && (
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 flex items-center space-x-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Privacy & Notification Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Visibility Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Profile Sharing & Recruiter Visibility</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { id: 'public', title: 'Open to All Recruiters', desc: 'Verified companies can discover your profile, resume, and test scores.' },
                { id: 'university_only', title: 'University Placement Cell Only', desc: 'Visible only to authorized campus recruiters coordinated by placement cell.' },
                { id: 'private', title: 'Private & Anonymous', desc: 'Your profile is hidden until you explicitly submit an application.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setVisibility(opt.id as any);
                    showToast(`Profile visibility updated to: ${opt.title}`);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    visibility === opt.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-slate-200">{opt.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-normal">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Email alerts on recruiter interview scheduling</span>
                <input
                  type="checkbox"
                  checked={interviewReminders}
                  onChange={(e) => {
                    setInterviewReminders(e.target.checked);
                    showToast('Notification preference saved');
                  }}
                  className="rounded text-indigo-600 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Daily Quest streak reminder</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => {
                    setEmailAlerts(e.target.checked);
                    showToast('Notification preference saved');
                  }}
                  className="rounded text-indigo-600 focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
