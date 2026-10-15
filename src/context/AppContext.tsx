import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UniversitySubRole,
  CompanySubRole,
  StudentProfile,
  ProjectItem,
  JobOpening,
  JobApplication,
  Quest,
  QuestionBankItem,
  UniversityClassResource,
  CampusPlacementDrive,
  NotificationItem,
  InterviewSession,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_QUESTS,
  INITIAL_QUESTIONS,
  INITIAL_UNIVERSITY_RESOURCES,
  INITIAL_CAMPUS_DRIVES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  universitySubRole: UniversitySubRole;
  setUniversitySubRole: (subRole: UniversitySubRole) => void;
  companySubRole: CompanySubRole;
  setCompanySubRole: (subRole: CompanySubRole) => void;
  
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  
  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id' | 'date'>) => void;
  
  jobs: JobOpening[];
  addJob: (job: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>) => void;
  
  applications: JobApplication[];
  applyToJob: (job: JobOpening) => boolean;
  updateApplicationStatus: (appId: string, status: JobApplication['status'], notes?: string, interviewDate?: string) => void;
  
  quests: Quest[];
  completeQuest: (questId: string) => void;
  
  questions: QuestionBankItem[];
  toggleQuestionBookmark: (qId: string) => void;
  addQuestion: (q: Omit<QuestionBankItem, 'id' | 'bookmarked'>) => void;
  
  universityResources: UniversityClassResource[];
  addUniversityResource: (res: Omit<UniversityClassResource, 'id' | 'date' | 'downloads'>) => void;
  
  campusDrives: CampusPlacementDrive[];
  addCampusDrive: (drive: Omit<CampusPlacementDrive, 'id' | 'registeredCount' | 'shortlistedCount'>) => void;
  
  interviewSessions: InterviewSession[];
  addInterviewSession: (session: Omit<InterviewSession, 'id' | 'date'>) => void;
  
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation Role
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('cf_role') as UserRole) || 'student';
  });

  const [universitySubRole, setUniversitySubRoleState] = useState<UniversitySubRole>(() => {
    return (localStorage.getItem('cf_uni_subrole') as UniversitySubRole) || 'faculty';
  });

  const [companySubRole, setCompanySubRoleState] = useState<CompanySubRole>(() => {
    return (localStorage.getItem('cf_comp_subrole') as CompanySubRole) || 'recruiter';
  });

  // Data Collections with LocalStorage caching
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('cf_profile');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('cf_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [jobs, setJobs] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem('cf_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('cf_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('cf_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [questions, setQuestions] = useState<QuestionBankItem[]>(() => {
    const saved = localStorage.getItem('cf_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [universityResources, setUniversityResources] = useState<UniversityClassResource[]>(() => {
    const saved = localStorage.getItem('cf_uni_resources');
    return saved ? JSON.parse(saved) : INITIAL_UNIVERSITY_RESOURCES;
  });

  const [campusDrives, setCampusDrives] = useState<CampusPlacementDrive[]>(() => {
    const saved = localStorage.getItem('cf_campus_drives');
    return saved ? JSON.parse(saved) : INITIAL_CAMPUS_DRIVES;
  });

  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(() => {
    const saved = localStorage.getItem('cf_interview_sessions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'sess_1',
        date: 'Oct 12, 2026',
        role: 'Full Stack Engineer',
        domain: 'Web Engineering',
        persona: 'Professional Tech Lead',
        difficulty: 'Intermediate',
        score: 86,
        durationMinutes: 18,
        qas: [
          {
            question: "How do you approach client-server state synchronization in a high-frequency real-time web app?",
            answer: "I use optimistic UI updates backed by WebSocket event ordering and idempotent REST fallbacks. In high contention, CRDTs or operational transforms help.",
            verdict: "correct",
            score: 90,
            feedback: "Strong grasp of latency masking and conflict resolution."
          }
        ]
      }
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cf_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cf_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('cf_uni_subrole', universitySubRole);
  }, [universitySubRole]);

  useEffect(() => {
    localStorage.setItem('cf_comp_subrole', companySubRole);
  }, [companySubRole]);

  useEffect(() => {
    localStorage.setItem('cf_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('cf_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('cf_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('cf_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('cf_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('cf_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('cf_uni_resources', JSON.stringify(universityResources));
  }, [universityResources]);

  useEffect(() => {
    localStorage.setItem('cf_campus_drives', JSON.stringify(campusDrives));
  }, [campusDrives]);

  useEffect(() => {
    localStorage.setItem('cf_interview_sessions', JSON.stringify(interviewSessions));
  }, [interviewSessions]);

  useEffect(() => {
    localStorage.setItem('cf_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3800);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    showToast('Career Profile updated successfully');
  };

  const addProject = (item: Omit<ProjectItem, 'id' | 'date'>) => {
    const newProj: ProjectItem = {
      ...item,
      id: `proj_${Date.now()}`,
      date: 'Just now',
      stars: 0,
      readmeScore: 85,
    };
    setProjects((prev) => [newProj, ...prev]);
    // Boost XP and profile completion
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + 150,
      profileCompletion: Math.min(100, prev.profileCompletion + 4),
    }));
    showToast(`Project "${newProj.title}" added to portfolio! (+150 XP)`);
  };

  const addJob = (job: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>) => {
    const newJob: JobOpening = {
      ...job,
      id: `job_${Date.now()}`,
      applicantsCount: 0,
      postedDate: 'Just now',
    };
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Job listing "${newJob.title}" published!`);
  };

  const applyToJob = (job: JobOpening): boolean => {
    const existing = applications.find((a) => a.jobId === job.id);
    if (existing) {
      showToast('You have already applied for this opening', 'info');
      return false;
    }

    const newApp: JobApplication = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Applied',
      matchScore: Math.floor(82 + Math.random() * 16),
      candidateName: profile.name,
      candidateEmail: profile.email,
      candidateCgpa: profile.cgpa,
      notes: 'Direct application through CareerForge 1-click gateway.',
    };

    setApplications((prev) => [newApp, ...prev]);
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    // Award XP to student
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + 80,
    }));

    showToast(`Application submitted to ${job.company}! (+80 XP)`);
    return true;
  };

  const updateApplicationStatus = (
    appId: string,
    status: JobApplication['status'],
    notes?: string,
    interviewDate?: string
  ) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            status,
            notes: notes !== undefined ? notes : a.notes,
            interviewScheduledDate: interviewDate !== undefined ? interviewDate : a.interviewScheduledDate,
          };
        }
        return a;
      })
    );

    // If scheduled an interview, create notification
    if (status === 'Interview' && interviewDate) {
      const targetApp = applications.find((a) => a.id === appId);
      if (targetApp) {
        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}`,
            title: `Interview Scheduled with ${targetApp.company}`,
            message: `Interview slot confirmed for ${interviewDate}. Practice in Mock Interview Studio!`,
            timestamp: 'Just now',
            type: 'interview',
            read: false,
          },
          ...prev,
        ]);
      }
    }

    showToast(`Applicant status updated to: ${status}`);
  };

  const completeQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          const reward = q.xpReward;
          setProfile((p) => {
            const nextXp = p.xp + reward;
            const nextLevel = Math.floor(nextXp / 600) + 1;
            return {
              ...p,
              xp: nextXp,
              level: Math.max(p.level, nextLevel),
              streakDays: p.streakDays + 1,
            };
          });
          showToast(`Quest Completed: ${q.title}! (+${reward} XP)`);
          return { ...q, progress: q.maxProgress, completed: true };
        }
        return q;
      })
    );
  };

  const toggleQuestionBookmark = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, bookmarked: !q.bookmarked } : q))
    );
  };

  const addQuestion = (q: Omit<QuestionBankItem, 'id' | 'bookmarked'>) => {
    const newQ: QuestionBankItem = {
      ...q,
      id: `qb_${Date.now()}`,
      bookmarked: false,
    };
    setQuestions((prev) => [newQ, ...prev]);
    showToast('Question successfully added to university question bank!');
  };

  const addUniversityResource = (res: Omit<UniversityClassResource, 'id' | 'date' | 'downloads'>) => {
    const newRes: UniversityClassResource = {
      ...res,
      id: `res_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      downloads: 1,
    };
    setUniversityResources((prev) => [newRes, ...prev]);
    showToast(`Lecture Resource "${newRes.title}" shared with students!`);
  };

  const addCampusDrive = (drive: Omit<CampusPlacementDrive, 'id' | 'registeredCount' | 'shortlistedCount'>) => {
    const newDrive: CampusPlacementDrive = {
      ...drive,
      id: `drv_${Date.now()}`,
      registeredCount: 0,
      shortlistedCount: 0,
    };
    setCampusDrives((prev) => [newDrive, ...prev]);
    showToast(`Campus Placement Drive for ${newDrive.companyName} created!`);
  };

  const addInterviewSession = (session: Omit<InterviewSession, 'id' | 'date'>) => {
    const newSession: InterviewSession = {
      ...session,
      id: `sess_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setInterviewSessions((prev) => [newSession, ...prev]);
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + 120,
      readiness: {
        ...prev.readiness,
        jobScore: Math.min(99, Math.round((prev.readiness.jobScore * 3 + session.score) / 4)),
      },
    }));
    showToast(`Mock Interview session saved! (+120 XP)`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole: setRoleState,
        universitySubRole,
        setUniversitySubRole: setUniversitySubRoleState,
        companySubRole,
        setCompanySubRole: setCompanySubRoleState,
        profile,
        updateProfile,
        projects,
        addProject,
        jobs,
        addJob,
        applications,
        applyToJob,
        updateApplicationStatus,
        quests,
        completeQuest,
        questions,
        toggleQuestionBookmark,
        addQuestion,
        universityResources,
        addUniversityResource,
        campusDrives,
        addCampusDrive,
        interviewSessions,
        addInterviewSession,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
