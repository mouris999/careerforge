import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Compass,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const RoadmapsTab: React.FC = () => {
  const { profile, updateProfile, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<'fullstack' | 'devops' | 'ai' | 'security'>('fullstack');
  const [selectedTier, setSelectedTier] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'fs_1': true,
    'fs_2': true,
    'fs_3': true,
    'fs_4': false,
    'fs_5': false,
  });

  const toggleStep = (stepId: string) => {
    const nextVal = !completedSteps[stepId];
    setCompletedSteps((prev) => ({ ...prev, [stepId]: nextVal }));
    if (nextVal) {
      updateProfile({ xp: profile.xp + 50 });
      showToast('Roadmap milestone marked complete! (+50 XP)');
    }
  };

  const roadmapsData: Record<string, any> = {
    fullstack: {
      title: 'Full Stack Software Engineer',
      overview: 'End-to-end modern web and distributed applications engineering.',
      estimatedHours: '160 Hours',
      prerequisites: 'Basic JavaScript/Python and HTML/CSS knowledge',
      recommendedCert: 'AWS Certified Developer Associate / Meta Front-End Professional',
      tiers: {
        beginner: [
          { id: 'fs_b1', title: 'Modern JavaScript & TypeScript Typing', duration: '20 hrs', desc: 'ESNext, async/await, closures, interfaces, and strict compiler settings.', free: true },
          { id: 'fs_b2', title: 'React 19 & Component Architecture', duration: '30 hrs', desc: 'Hooks (useState, use, useEffect), Context, React Compiler, and state primitives.', free: true },
          { id: 'fs_b3', title: 'Node.js & Express REST APIs', duration: '25 hrs', desc: 'HTTP methods, routing, middleware patterns, validation, and error handling.', free: true },
        ],
        intermediate: [
          { id: 'fs_1', title: 'Relational Database Modeling with PostgreSQL', duration: '30 hrs', desc: 'Indexes, B-Trees, transactions, ACID properties, and ORM query optimization.', free: true },
          { id: 'fs_2', title: 'Distributed In-Memory Caching with Redis', duration: '20 hrs', desc: 'Cache-aside pattern, rate limiters, session stores, and TTL eviction policies.', free: true },
          { id: 'fs_3', title: 'Containerization & Docker Orchestration', duration: '25 hrs', desc: 'Multi-stage Dockerfiles, docker-compose, image optimization, and volume mounts.', free: true },
          { id: 'fs_4', title: 'Real-Time WebSockets & Event Streaming', duration: '25 hrs', desc: 'Bi-directional protocols, heartbeat ping/pong, and reconnection backoff.', free: false },
          { id: 'fs_5', title: 'End-to-End Testing & CI/CD Pipelines', duration: '20 hrs', desc: 'Playwright automation, GitHub Actions matrix builds, and deployment verification.', free: true },
        ],
        advanced: [
          { id: 'fs_a1', title: 'Microservices & Distributed Event Brokers (Kafka)', duration: '40 hrs', desc: 'Event sourcing, CQRS pattern, partitions, consumer groups, and idempotency.', free: false },
          { id: 'fs_a2', title: 'Distributed Consensus & System Design', duration: '45 hrs', desc: 'CAP theorem, Raft protocol, partition tolerance, and high availability design.', free: true },
        ],
      },
    },
    devops: {
      title: 'Cloud & Distributed Systems SRE',
      overview: 'Infrastructure as Code, container orchestration, and reliability engineering.',
      estimatedHours: '190 Hours',
      prerequisites: 'Linux CLI & basic networking fundamentals',
      recommendedCert: 'CKA (Certified Kubernetes Administrator)',
      tiers: {
        beginner: [
          { id: 'do_b1', title: 'Linux Kernel Internals & Shell Scripting', duration: '25 hrs', desc: 'Processes, namespaces, cgroups, file systems, and bash automation.', free: true },
        ],
        intermediate: [
          { id: 'do_i1', title: 'Kubernetes Cluster Management & Pod Lifecycle', duration: '40 hrs', desc: 'Deployments, services, ingress controllers, ConfigMaps, and Helm charts.', free: true },
          { id: 'do_i2', title: 'Infrastructure as Code with Terraform', duration: '30 hrs', desc: 'Declarative resource provisioning, state locking, and modular infrastructure.', free: true },
        ],
        advanced: [
          { id: 'do_a1', title: 'Site Reliability Engineering & eBPF Telemetry', duration: '50 hrs', desc: 'SLO/SLI budgeting, kernel observability, anomaly alerts, and chaos engineering.', free: false },
        ],
      },
    },
    ai: {
      title: 'AI & Machine Learning Systems',
      overview: 'Frontier model serving, LLM orchestration, and tensor pipelines.',
      estimatedHours: '180 Hours',
      prerequisites: 'Linear algebra, multivariable calculus, and Python',
      recommendedCert: 'Google Cloud Professional Machine Learning Engineer',
      tiers: {
        beginner: [
          { id: 'ai_b1', title: 'Python, NumPy & Scientific Computing', duration: '25 hrs', desc: 'Vectorized operations, broadcasting, memory layouts, and data processing.', free: true },
        ],
        intermediate: [
          { id: 'ai_i1', title: 'Deep Learning & PyTorch Modeling', duration: '45 hrs', desc: 'Backpropagation, transformers, attention mechanisms, and custom loss functions.', free: true },
          { id: 'ai_i2', title: 'LLM Prompt Engineering & Function Calling', duration: '30 hrs', desc: 'Retrieval Augmented Generation (RAG), vector embeddings, and agentic workflows.', free: true },
        ],
        advanced: [
          { id: 'ai_a1', title: 'Distributed Training & vLLM Model Serving', duration: '50 hrs', desc: 'PagedAttention, tensor parallelism, quantization (AWQ/GPTQ), and GPU optimization.', free: false },
        ],
      },
    },
    security: {
      title: 'Cybersecurity & Application Security',
      overview: 'Defensive engineering, vulnerability assessment, and zero-trust identity.',
      estimatedHours: '150 Hours',
      prerequisites: 'Networking (TCP/IP, TLS) & Web architecture',
      recommendedCert: 'CompTIA Security+ / CEH',
      tiers: {
        beginner: [
          { id: 'sec_b1', title: 'Network Security & TLS 1.3 Cryptography', duration: '20 hrs', desc: 'Public key infrastructure, cipher suites, handshakes, and certificate authorities.', free: true },
        ],
        intermediate: [
          { id: 'sec_i1', title: 'OWASP Top 10 & Web Exploit Mitigation', duration: '35 hrs', desc: 'XSS, CSRF, SQL Injection, SSRF, and strict Content Security Policies (CSP).', free: true },
        ],
        advanced: [
          { id: 'sec_a1', title: 'Zero Trust Architecture & Threat Modeling', duration: '40 hrs', desc: 'mTLS identity, OAuth 2.0 PKCE, RBAC least privilege, and container security.', free: true },
        ],
      },
    },
  };

  const currentRoadmap = roadmapsData[selectedRole];
  const steps = currentRoadmap.tiers[selectedTier] || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Interactive Career Roadmaps</h2>
              <p className="text-xs text-slate-400">
                Industry-mapped learning paths with step-by-step milestones, prerequisite checks, and certified resources.
              </p>
            </div>
          </div>
        </div>

        {/* Domain Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'fullstack', label: 'Full Stack' },
            { id: 'devops', label: 'Cloud & DevOps' },
            { id: 'ai', label: 'AI & ML' },
            { id: 'security', label: 'Cybersecurity' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === r.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap Overview Meta Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">{currentRoadmap.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentRoadmap.overview}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-1.5 text-indigo-300">
              <Clock className="w-3.5 h-3.5" />
              <span>Est. {currentRoadmap.estimatedHours}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <Award className="w-3.5 h-3.5" />
              <span>{currentRoadmap.recommendedCert}</span>
            </div>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Difficulty Phase:</span>
          {(['beginner', 'intermediate', 'advanced'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedTier === tier
                  ? 'bg-slate-100 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Step by Step Milestones Path */}
      <div className="space-y-4">
        {steps.map((step: any, index: number) => {
          const isDone = !!completedSteps[step.id];

          return (
            <div
              key={step.id}
              className={`bg-slate-900 border rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone ? 'border-emerald-900/60 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isDone ? 'bg-emerald-500 text-slate-950 shadow' : 'border border-slate-700 text-transparent hover:border-indigo-400'
                  }`}
                  title={isDone ? 'Mark Incomplete' : 'Mark Milestone Complete'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-slate-400">Step {index + 1}</span>
                    <h4 className={`text-sm font-bold ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                      {step.title}
                    </h4>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                        step.free ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}
                    >
                      {step.free ? 'Free Resource' : 'Paid / Advanced'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 pl-10 sm:pl-0 flex-shrink-0">
                <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{step.duration}</span>
                </span>
                <button
                  onClick={() => showToast(`Resource guide for "${step.title}" opened!`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-slate-700"
                >
                  <span>Start Module</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
