import { StudentProfile, ProjectItem, JobOpening, JobApplication, Quest, QuestionBankItem, Mentor, UniversityClassResource, CampusPlacementDrive, NotificationItem } from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std_01',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  headline: 'Aspiring Full Stack Engineer & Distributed Systems Enthusiast',
  degree: 'Bachelor of Technology in Computer Science',
  university: 'Stanford Institute of Technology',
  branch: 'Computer Science & Engineering',
  currentSemester: 7,
  cgpa: 8.84,
  graduationYear: 2027,
  targetRole: 'Full Stack Software Engineer',
  preferredDomains: ['Web Engineering', 'Cloud & Distributed Systems', 'AI & Machine Learning'],
  skills: [
    { name: 'TypeScript', level: 'Advanced', verified: true },
    { name: 'React 19', level: 'Advanced', verified: true },
    { name: 'Node.js & Express', level: 'Advanced', verified: true },
    { name: 'PostgreSQL', level: 'Intermediate', verified: true },
    { name: 'System Design', level: 'Intermediate', verified: false },
    { name: 'Docker & Containers', level: 'Intermediate', verified: false },
    { name: 'Redis Caching', level: 'Beginner', verified: false },
    { name: 'Python', level: 'Intermediate', verified: true },
  ],
  githubUrl: 'https://github.com/alexchen-dev',
  linkedinUrl: 'https://linkedin.com/in/alexchen-tech',
  portfolioUrl: 'https://alexchen.dev',
  bio: 'Passionate about building fast, accessible web applications and distributed backend architectures. Passionate about real-time collaborative systems.',
  xp: 3450,
  level: 6,
  streakDays: 14,
  profileCompletion: 88,
  readiness: {
    jobScore: 82,
    internshipScore: 94,
    domainScore: 88,
    verdict: 'High Placement Potential: Top 8% of graduating batch in Full-Stack proficiency'
  }
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj_1',
    title: 'CloudMesh — Distributed Event-Driven Broker',
    description: 'High-throughput publish-subscribe message broker with zero-copy binary streaming and in-memory ring buffers.',
    problemStatement: 'Existing brokers introduced excessive CPU context switching under burst websocket telemetry.',
    solution: 'Designed an asynchronous event loop with Rust and Node N-API bindings achieving 40k msg/sec throughput.',
    techStack: ['TypeScript', 'Node.js', 'Redis', 'Docker', 'WebSockets'],
    githubUrl: 'https://github.com/alexchen-dev/cloudmesh',
    liveUrl: 'https://cloudmesh-demo.io',
    status: 'Completed',
    date: 'Sep 2026',
    stars: 124,
    readmeScore: 92
  },
  {
    id: 'proj_2',
    title: 'CogniCanvas — Collaborative AI Whiteboard',
    description: 'Multiplayer infinite canvas with real-time vector synchronization and automated diagram synthesis.',
    problemStatement: 'Engineers struggled to rapidly mock cloud system architectures in remote whiteboarding sessions.',
    solution: 'Created an optimistic CRDT-based state engine with web worker offloading.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Canvas API'],
    githubUrl: 'https://github.com/alexchen-dev/cognicanvas',
    liveUrl: 'https://cognicanvas.app',
    status: 'Completed',
    date: 'Jul 2026',
    stars: 87,
    readmeScore: 88
  },
  {
    id: 'proj_3',
    title: 'PulseTelemetry — Microservice Latency Profiler',
    description: 'Autonomous tracer for distributed endpoints with anomaly detection and automated latency heatmaps.',
    problemStatement: 'P99 tail latency in multi-tiered microservices was difficult to attribute to specific database queries.',
    solution: 'Built an eBPF-inspired request tagging middleware and open telemetry bridge.',
    techStack: ['Go', 'TypeScript', 'PostgreSQL', 'Prometheus'],
    githubUrl: 'https://github.com/alexchen-dev/pulse-telemetry',
    status: 'In Progress',
    date: 'Nov 2026',
    stars: 39,
    readmeScore: 78
  }
];

export const INITIAL_JOBS: JobOpening[] = [
  {
    id: 'job_1',
    title: 'Software Development Engineer Intern',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'San Francisco, CA / Remote',
    workMode: 'Remote',
    type: 'Internship',
    salaryOrStipend: '$55 / hour + Housing Allowance',
    isPaid: true,
    experienceLevel: 'Student / Fresher',
    domain: 'FinTech & Payments Infrastructure',
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'Distributed Systems'],
    description: 'Join our Core Infrastructure engineering group to build resilient payment gateway primitives used by millions of businesses worldwide.',
    deadline: 'Oct 30, 2026',
    applicantsCount: 42,
    isVerified: true,
    postedDate: '3 days ago'
  },
  {
    id: 'job_2',
    title: 'Junior Full Stack Engineer',
    company: 'Linear Systems',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    location: 'New York, NY',
    workMode: 'Hybrid',
    type: 'Full-time',
    salaryOrStipend: '$115,000 - $135,000 / year + Equity',
    isPaid: true,
    experienceLevel: 'Entry Level',
    domain: 'Productivity & Developer Tools',
    requiredSkills: ['TypeScript', 'React', 'Tailwind CSS', 'PostgreSQL'],
    description: 'Build keyboard-first, ultra-responsive issue tracking and roadmap tools with real-time sync engines.',
    deadline: 'Nov 15, 2026',
    applicantsCount: 78,
    isVerified: true,
    postedDate: '5 days ago'
  },
  {
    id: 'job_3',
    title: 'AI Systems & Cloud Engineer',
    company: 'Anthropic Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'Seattle, WA / Remote',
    workMode: 'Remote',
    type: 'Full-time',
    salaryOrStipend: '$140,000 - $165,000 / year',
    isPaid: true,
    experienceLevel: 'Entry Level',
    domain: 'Artificial Intelligence & Safety',
    requiredSkills: ['Python', 'Docker', 'Distributed Systems', 'REST APIs'],
    description: 'Scale model serving pipelines, cluster orchestration, and high-throughput evaluation harnesses for frontier AI.',
    deadline: 'Nov 02, 2026',
    applicantsCount: 61,
    isVerified: true,
    postedDate: '1 week ago'
  },
  {
    id: 'job_4',
    title: 'Frontend Engineering Intern',
    company: 'Figma',
    companyLogo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=120&q=80',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    type: 'Internship',
    salaryOrStipend: '$52 / hour',
    isPaid: true,
    experienceLevel: 'Student / Fresher',
    domain: 'Design Systems & Graphics',
    requiredSkills: ['TypeScript', 'React', 'WebGL', 'UI/UX'],
    description: 'Work with our Editor team on canvas performance, design tool primitives, and collaborative real-time editing.',
    deadline: 'Nov 10, 2026',
    applicantsCount: 95,
    isVerified: true,
    postedDate: '2 days ago'
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    jobTitle: 'Software Development Engineer Intern',
    company: 'Stripe',
    appliedDate: 'Oct 11, 2026',
    status: 'Shortlisted',
    matchScore: 94,
    candidateName: 'Alex Chen',
    candidateEmail: 'alex.chen@university.edu',
    candidateCgpa: 8.84,
    notes: 'Exceptional open source projects with distributed systems focus. Cleared automated resume screening.',
    interviewScheduledDate: 'Oct 24, 2026 at 10:00 AM PST'
  },
  {
    id: 'app_2',
    jobId: 'job_2',
    jobTitle: 'Junior Full Stack Engineer',
    company: 'Linear Systems',
    appliedDate: 'Oct 08, 2026',
    status: 'Assessment',
    matchScore: 89,
    candidateName: 'Alex Chen',
    candidateEmail: 'alex.chen@university.edu',
    candidateCgpa: 8.84,
    notes: 'Take-home engineering challenge link sent. Due on Oct 19.'
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q_1',
    title: 'Master the STAR Method',
    type: 'daily',
    category: 'interview',
    description: 'Complete 1 behavioral mock interview focusing on leadership and technical conflict resolution.',
    xpReward: 150,
    progress: 1,
    maxProgress: 1,
    completed: true
  },
  {
    id: 'q_2',
    title: 'P99 Latency Debugger',
    type: 'daily',
    category: 'coding',
    description: 'Solve the LRU Cache and Rate Limiting challenge in the Learning Hub Code Sandbox.',
    xpReward: 200,
    progress: 0,
    maxProgress: 1,
    completed: false
  },
  {
    id: 'q_3',
    title: 'ATS Resume Polish',
    type: 'weekly',
    category: 'resume',
    description: 'Incorporate 3 missing keywords identified by the AI ATS Scanner into your resume.',
    xpReward: 300,
    progress: 2,
    maxProgress: 3,
    completed: false
  },
  {
    id: 'q_4',
    title: 'Virtual Chemistry Lab Maestro',
    type: 'weekly',
    category: 'project',
    description: 'Perform the Acid-Base Titration reaction in the VR Lab and achieve over 90% endpoint accuracy.',
    xpReward: 250,
    progress: 1,
    maxProgress: 1,
    completed: true
  }
];

export const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: 'qb_1',
    question: 'In React 19, what is the primary benefit of the `use()` hook compared to traditional `useEffect` data fetching?',
    category: 'Technical',
    domain: 'Frontend Engineering',
    difficulty: 'Intermediate',
    options: [
      'It executes synchronously before the browser repaints the layout tree.',
      'It can be called conditionally within loops and conditionals, unwrapping Promises and Context during render.',
      'It automatically memoizes all component child props without useMemo.',
      'It replaces Redux store dispatchers.'
    ],
    correctOptionIndex: 1,
    explanation: 'React 19’s `use` API can be called inside conditional statements and loops, enabling direct Promise resolution inside render alongside Suspense boundaries.',
    bookmarked: true
  },
  {
    id: 'qb_2',
    question: 'How does an ACID-compliant database enforce Isolation between concurrent transactions at the "Read Committed" isolation level?',
    category: 'Technical',
    domain: 'Database Systems',
    difficulty: 'Advanced',
    options: [
      'By acquiring exclusive table locks for the duration of every transaction.',
      'By only reading committed row versions (via MVCC snapshot) while holding write locks until transaction completion.',
      'By disallowing any simultaneous write transactions.',
      'By executing all transactions sequentially on a single thread.'
    ],
    correctOptionIndex: 1,
    explanation: 'Read Committed level prevents Dirty Reads by ensuring queries only see changes committed before the query began, typically using Multi-Version Concurrency Control (MVCC).',
    bookmarked: false
  },
  {
    id: 'qb_3',
    question: 'Describe a time when you realized a critical feature was going to miss its release deadline. How did you communicate and adjust?',
    category: 'HR & Behavioral',
    domain: 'Engineering Leadership',
    difficulty: 'Intermediate',
    explanation: 'Use the STAR format: Explain early warning signals, proactive transparent communication with stakeholders, ruthless prioritization of MVP scope, and lessons learned.',
    bookmarked: true
  },
  {
    id: 'qb_4',
    question: 'Implement an LRU Cache with O(1) get and O(1) put operations.',
    category: 'Coding',
    domain: 'Data Structures & Algorithms',
    difficulty: 'Advanced',
    codeSnippet: `class LRUCache {\n  private capacity: number;\n  // Use Hash Map + Doubly Linked List\n  constructor(capacity: number) {\n    this.capacity = capacity;\n  }\n  get(key: number): number {\n    // O(1) retrieval\n    return -1;\n  }\n  put(key: number, value: number): void {\n    // O(1) insertion & eviction\n  }\n}`,
    explanation: 'Combine a hash map for key-to-node O(1) lookups with a doubly linked list where the most recently accessed nodes are moved to the head and the tail is evicted when capacity is reached.',
    bookmarked: false
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'm_1',
    name: 'Sarah Lin, PhD',
    role: 'Principal Staff Engineer',
    company: 'Google Cloud Platform',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    expertise: ['Distributed Systems', 'Kubernetes', 'System Design', 'Tech Lead Coaching'],
    experienceYears: 12,
    availability: 'Available this Thursday',
    rating: 4.95,
    alumniOf: 'Stanford Institute of Technology',
    bio: 'Mentored 140+ engineers. Passionate about helping students break into high-scale cloud infrastructure roles.'
  },
  {
    id: 'm_2',
    name: 'Marcus Vance',
    role: 'Head of Engineering',
    company: 'Vercel / Next.js Core',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    expertise: ['Web Performance', 'React Architecture', 'Edge Functions', 'Startup Hiring'],
    experienceYears: 9,
    availability: 'Next Tuesday at 4 PM',
    rating: 4.92,
    bio: 'Former early engineer at 2 YC startups. I provide unfiltered resume teardowns and live mock coding interviews.'
  },
  {
    id: 'm_3',
    name: 'Elena Rostova',
    role: 'Senior Staff ML Engineer',
    company: 'DeepMind',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    expertise: ['Large Language Models', 'PyTorch', 'Model Optimization', 'Research to Production'],
    experienceYears: 8,
    availability: 'Fridays 3 PM PST',
    rating: 4.98,
    alumniOf: 'Stanford Institute of Technology',
    bio: 'Helping candidates transition into AI/ML research engineering and competitive placement tracks.'
  }
];

export const INITIAL_UNIVERSITY_RESOURCES: UniversityClassResource[] = [
  {
    id: 'res_1',
    title: 'CS 401 — Advanced Distributed Consensus & Raft Protocol',
    subject: 'Distributed Systems',
    facultyName: 'Prof. David Karger',
    type: 'PDF',
    date: 'Oct 12, 2026',
    fileSizeOrDuration: '4.8 MB',
    downloads: 182
  },
  {
    id: 'res_2',
    title: 'CS 305 — Operating System Kernel Schedulers & Concurrency',
    subject: 'Operating Systems',
    facultyName: 'Dr. Aris Thorne',
    type: 'Notes',
    date: 'Oct 09, 2026',
    fileSizeOrDuration: '12 Pages',
    downloads: 240
  },
  {
    id: 'res_3',
    title: 'CS 490 — High-Performance Web Graphics & GPU Shaders',
    subject: 'Computer Graphics',
    facultyName: 'Prof. Elena Rostova',
    type: 'Video',
    date: 'Oct 04, 2026',
    fileSizeOrDuration: '54 mins',
    downloads: 145
  }
];

export const INITIAL_CAMPUS_DRIVES: CampusPlacementDrive[] = [
  {
    id: 'drv_1',
    companyName: 'Stripe International',
    roleTitle: 'Software Development Engineer (Campus Cohort 2027)',
    packageLPA: '$140,000 / year',
    eligibilityCriteria: 'CGPA >= 8.0, No active backlogs, CSE/ECE branches',
    driveDate: 'Nov 04, 2026',
    status: 'Upcoming',
    registeredCount: 164,
    shortlistedCount: 38
  },
  {
    id: 'drv_2',
    companyName: 'Datadog Observability',
    roleTitle: 'Cloud Infrastructure & SRE Associate',
    packageLPA: '$125,000 / year',
    eligibilityCriteria: 'CGPA >= 7.5, Strong Linux & Networking knowledge',
    driveDate: 'Nov 12, 2026',
    status: 'Upcoming',
    registeredCount: 112,
    shortlistedCount: 24
  },
  {
    id: 'drv_3',
    companyName: 'Bloomberg LP',
    roleTitle: 'Software Engineer — Financial Systems',
    packageLPA: '$135,000 / year',
    eligibilityCriteria: 'CGPA >= 8.2, Strong C++ / TypeScript fundamentals',
    driveDate: 'Oct 18, 2026',
    status: 'Active',
    registeredCount: 210,
    shortlistedCount: 45
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n_1',
    title: 'Interview Scheduled by Stripe',
    message: 'Your Technical Screen for the Software Development Engineer Intern role has been scheduled for Oct 24 at 10:00 AM PST.',
    timestamp: '2 hours ago',
    type: 'interview',
    read: false
  },
  {
    id: 'n_2',
    title: 'Campus Placement Drive Announced',
    message: 'Datadog has published the eligibility list for the upcoming 2027 recruitment drive. You are marked eligible.',
    timestamp: '5 hours ago',
    type: 'university',
    read: false
  },
  {
    id: 'n_3',
    title: 'Daily Quest Streak Maintained!',
    message: 'You have logged in for 14 consecutive days. +50 bonus XP added to your Career Twin.',
    timestamp: '1 day ago',
    type: 'quest',
    read: true
  }
];
