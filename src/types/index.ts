export type UserRole = 'student' | 'university' | 'company';
export type UniversitySubRole = 'admin' | 'placement_officer' | 'faculty';
export type CompanySubRole = 'recruiter' | 'interviewer' | 'admin';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  degree: string;
  university: string;
  branch: string;
  currentSemester: number;
  cgpa: number;
  graduationYear: number;
  targetRole: string;
  preferredDomains: string[];
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; verified: boolean }[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  bio: string;
  xp: number;
  level: number;
  streakDays: number;
  profileCompletion: number;
  readiness: {
    jobScore: number;
    internshipScore: number;
    domainScore: number;
    verdict: string;
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  status: 'In Progress' | 'Completed' | 'Planned';
  date: string;
  stars?: number;
  readmeScore?: number;
}

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  type: 'Full-time' | 'Internship' | 'Contract';
  salaryOrStipend: string;
  isPaid: boolean;
  experienceLevel: 'Student / Fresher' | 'Entry Level' | 'Mid Level' | 'Senior';
  domain: string;
  requiredSkills: string[];
  description: string;
  deadline: string;
  applicantsCount: number;
  isVerified: boolean;
  postedDate: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected';
  matchScore: number;
  candidateName: string;
  candidateEmail: string;
  candidateCgpa: number;
  notes?: string;
  interviewScheduledDate?: string;
}

export interface InterviewSession {
  id: string;
  date: string;
  role: string;
  domain: string;
  persona: string;
  difficulty: string;
  score: number;
  durationMinutes: number;
  qas: {
    question: string;
    answer: string;
    verdict: 'correct' | 'partially_correct' | 'incorrect';
    score: number;
    feedback: string;
  }[];
}

export interface Quest {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'milestone';
  category: 'interview' | 'coding' | 'resume' | 'project';
  description: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

export interface QuestionBankItem {
  id: string;
  question: string;
  category: 'Technical' | 'HR & Behavioral' | 'System Design' | 'Coding';
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  bookmarked: boolean;
  codeSnippet?: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  expertise: string[];
  experienceYears: number;
  availability: string;
  rating: number;
  alumniOf?: string;
  bio: string;
}

export interface UniversityClassResource {
  id: string;
  title: string;
  subject: string;
  facultyName: string;
  type: 'PDF' | 'Video' | 'Notes' | 'Quiz';
  date: string;
  fileSizeOrDuration: string;
  downloads: number;
  url?: string;
}

export interface CampusPlacementDrive {
  id: string;
  companyName: string;
  roleTitle: string;
  packageLPA: string;
  eligibilityCriteria: string;
  driveDate: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  registeredCount: number;
  shortlistedCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'application' | 'interview' | 'quest' | 'university' | 'general';
  read: boolean;
}
