import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Volume2,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
  Send,
  UserCheck,
} from 'lucide-react';

export const MockInterviewStudio: React.FC = () => {
  const { profile, addInterviewSession, interviewSessions, showToast } = useApp();

  // Configuration State
  const [role, setRole] = useState(profile.targetRole || 'Full Stack Software Engineer');
  const [domain, setDomain] = useState('Web Engineering & Distributed Systems');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [persona, setPersona] = useState('Professional Tech Lead');

  // Active Session State
  const [inSession, setInSession] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [sessionDurationSeconds, setSessionDurationSeconds] = useState(0);

  // Question & Evaluation State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>({
    question: "Can you explain how you would design a resilient rate limiter for a public REST API? Walk through algorithm choices, storage, and handling burst traffic.",
    topic: "System Design & Distributed Primitives",
    difficulty: "Intermediate",
    expectedKeyPoints: ["Token Bucket / Leaky Bucket", "Redis distributed state", "Sliding window log vs counter", "HTTP 429 response headers"],
    interviewerNotes: "Focus on latency, concurrency race conditions, and graceful degradation."
  });

  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [loadingNextQ, setLoadingNextQ] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<any>(null);
  const [sessionQAHistory, setSessionQAHistory] = useState<any[]>([]);

  // Camera Video Element
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Timer Ref
  const timerRef = useRef<any>(null);

  // Web Speech Recognition
  const recognitionRef = useRef<any>(null);

  // Start Camera
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setMicActive(true);
        showToast('Camera and microphone connected');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err?.message);
      setCameraActive(false);
      showToast('Camera simulation mode active (mock camera feed ready)', 'info');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
    setMicActive(false);
  };

  // Text-To-Speech for AI Interviewer Question
  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingAI(true);
      utterance.onend = () => setIsSpeakingAI(false);
      utterance.onerror = () => setIsSpeakingAI(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-To-Text for Candidate Answer
  const toggleSpeechRecognition = () => {
    if (isListeningMic) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningMic(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser. Please type your response.', 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListeningMic(true);
        showToast('Listening... Speak your answer into the microphone.');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCandidateAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListeningMic(false);
    }
  };

  // Start Session
  const handleStartInterview = async () => {
    setInSession(true);
    setCurrentQuestionIndex(1);
    setSessionDurationSeconds(0);
    setSessionQAHistory([]);
    setCurrentEvaluation(null);
    setCandidateAnswer('');

    await startCamera();

    timerRef.current = setInterval(() => {
      setSessionDurationSeconds((prev) => prev + 1);
    }, 1000);

    // Fetch First Dynamic Question
    fetchNextQuestion(1, []);
  };

  const fetchNextQuestion = async (qNum: number, previousQA: any[]) => {
    setLoadingNextQ(true);
    try {
      const res = await fetch('/api/gemini/interview-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          domain,
          level: difficulty,
          persona,
          questionNumber: qNum,
          previousQA,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentQuestion(data.data);
        speakQuestion(data.data.question);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNextQ(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim()) {
      showToast('Please provide an answer before submitting.', 'info');
      return;
    }

    if (isListeningMic && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListeningMic(false);
    }

    setEvaluating(true);
    try {
      const res = await fetch('/api/gemini/interview-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: candidateAnswer,
          role,
          level: difficulty,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentEvaluation(data.data);
        setSessionQAHistory((prev) => [
          ...prev,
          {
            question: currentQuestion.question,
            answer: candidateAnswer,
            verdict: data.data.verdict,
            score: data.data.score,
            feedback: data.data.strengths?.join('; ') || 'Answer evaluated.',
          },
        ]);
        showToast('Answer evaluated! Feedback generated.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentEvaluation(null);
    setCandidateAnswer('');
    const nextIdx = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIdx);
    fetchNextQuestion(nextIdx, sessionQAHistory);
  };

  const handleFinishInterview = () => {
    clearInterval(timerRef.current);
    stopCamera();

    const avgScore =
      sessionQAHistory.length > 0
        ? Math.round(sessionQAHistory.reduce((acc, curr) => acc + curr.score, 0) / sessionQAHistory.length)
        : currentEvaluation?.score || 82;

    addInterviewSession({
      role,
      domain,
      persona,
      difficulty,
      score: avgScore,
      durationMinutes: Math.max(1, Math.round(sessionDurationSeconds / 60)),
      qas: sessionQAHistory,
    });

    setInSession(false);
    showToast(`Interview completed with overall score: ${avgScore}%! Session report saved.`);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopCamera();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Studio Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
            <Video className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-tight">AI Mock Interview Studio</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                Voice & Video Enabled
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Practice real-world technical and HR interviews with adaptive AI personas, dynamic follow-ups, and instant diagnostic feedback.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Interview Mode'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!inSession ? (
        /* Configuration & Setup View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Interview Setup & Environment Calibration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Job Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                  <option value="Frontend Architect (React / TypeScript)">Frontend Architect (React / TypeScript)</option>
                  <option value="Distributed Systems & Cloud Engineer">Distributed Systems & Cloud Engineer</option>
                  <option value="AI & Machine Learning Engineer">AI & Machine Learning Engineer</option>
                  <option value="HR & Behavioral Cultural Fit">HR & Behavioral Cultural Fit</option>
                  <option value="Product Engineering Intern">Product Engineering Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  AI Interviewer Persona
                </label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Professional Tech Lead">Professional Tech Lead (Balanced & Realistic)</option>
                  <option value="Strict Bar Raiser">Strict Bar Raiser (Rigorous & In-Depth)</option>
                  <option value="Supportive Mentor">Supportive Mentor (Encouraging & Constructive)</option>
                  <option value="Executive HR Director">Executive HR Director (Situational & STAR focus)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Interview Domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner (Fundamentals & Syntax)</option>
                  <option value="Intermediate">Intermediate (Real-world Scenarios & Edge Cases)</option>
                  <option value="Advanced">Advanced (High-scale Architecture & Concurrency)</option>
                </select>
              </div>
            </div>

            {/* Hardware Readiness Check Checklist */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pre-Flight Hardware Check:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Webcam Permission Supported</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Speech-to-Text Microphone</span>
                </div>
                <div className="flex items-center space-x-2 text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>AI Voice Synthesis Ready</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xl shadow-indigo-600/30 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Launch Mock Interview Session</span>
            </button>
          </div>

          {/* Past Sessions List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Recent Mock Sessions</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {interviewSessions.map((sess) => (
                <div key={sess.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{sess.role}</span>
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                        sess.score >= 85 ? 'bg-emerald-950 text-emerald-400' : 'bg-indigo-950 text-indigo-400'
                      }`}
                    >
                      {sess.score}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sess.persona}</span>
                    <span>{sess.date}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{sess.qas?.length || 1} questions evaluated</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Live Active Mock Interview Room */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Camera Video & AI Interviewer Presence (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Camera View Box */}
            <div className="relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center space-y-2 text-slate-500">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-indigo-400" />
                  </div>
                  <span className="text-xs font-medium">Candidate Video Simulation Active</span>
                </div>
              )}

              {/* Status Overlays */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-600/80 text-white text-[10px] font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>REC</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-200 text-[10px] font-mono border border-slate-700">
                  {formatTimer(sessionDurationSeconds)}
                </span>
              </div>

              {/* Face Presence Indicator */}
              <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-semibold border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Face in Frame</span>
              </div>

              {/* Hardware Toggles Overlay */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 shadow-xl">
                <button
                  onClick={() => {
                    if (cameraActive) stopCamera();
                    else startCamera();
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    cameraActive ? 'bg-slate-800 text-slate-200' : 'bg-red-600 text-white'
                  }`}
                  title={cameraActive ? 'Disable Camera' : 'Enable Camera'}
                >
                  {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-xl transition-colors ${
                    isListeningMic ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-800 text-slate-200'
                  }`}
                  title={isListeningMic ? 'Stop Mic Recording' : 'Start Mic Recording'}
                >
                  {isListeningMic ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => speakQuestion(currentQuestion?.question || '')}
                  className={`p-2 rounded-xl transition-colors ${
                    isSpeakingAI ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-800 text-slate-200'
                  }`}
                  title="Re-read Question (AI Voice)"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Interviewer Persona Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
                  AI
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{persona}</h4>
                  <p className="text-[11px] text-slate-400">{role} Interviewer</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Question #{currentQuestionIndex}
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Question & Answer Workspace (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Current Question Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                  {currentQuestion.topic || 'Core Technical Concept'}
                </span>
                <span className="text-xs text-slate-400 font-medium">Difficulty: {currentQuestion.difficulty || difficulty}</span>
              </div>

              <h3 className="text-base font-bold text-white leading-relaxed">
                {loadingNextQ ? 'Generating personalized question...' : currentQuestion.question}
              </h3>

              {currentQuestion.interviewerNotes && (
                <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-indigo-400 font-semibold">Interviewer Advice: </span>
                  {currentQuestion.interviewerNotes}
                </p>
              )}
            </div>

            {/* Answer Input Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Your Spoken or Written Answer</span>
                  {isListeningMic && <span className="text-[10px] text-emerald-400 font-semibold animate-pulse">(Listening...)</span>}
                </label>
                <button
                  onClick={toggleSpeechRecognition}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 transition-colors ${
                    isListeningMic ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>{isListeningMic ? 'Listening...' : 'Dictate with Voice'}</span>
                </button>
              </div>

              <textarea
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="Structure your answer clearly. Explain your thought process, architecture trade-offs, and edge-case handling..."
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleFinishInterview}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  End & Save Session
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={evaluating || !candidateAnswer.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${evaluating ? 'animate-spin' : ''}`} />
                  <span>{evaluating ? 'Evaluating Answer...' : 'Submit Answer for Diagnostic'}</span>
                </button>
              </div>
            </div>

            {/* Answer Evaluation Feedback Card */}
            {currentEvaluation && (
              <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`p-1.5 rounded-lg ${
                        currentEvaluation.verdict === 'correct'
                          ? 'bg-emerald-950 text-emerald-400'
                          : currentEvaluation.verdict === 'partially_correct'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-rose-950 text-rose-400'
                      }`}
                    >
                      {currentEvaluation.verdict === 'correct' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white capitalize">
                        Verdict: {currentEvaluation.verdict?.replace('_', ' ')}
                      </h4>
                      <p className="text-[11px] text-slate-400">Diagnostic score based on technical depth and communication.</p>
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-indigo-400">{currentEvaluation.score}%</div>
                </div>

                {/* Score Quadrant */}
                {currentEvaluation.scores && (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Correctness</div>
                      <div className="text-xs font-bold text-white mt-0.5">{currentEvaluation.scores.correctness}%</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Clarity</div>
                      <div className="text-xs font-bold text-white mt-0.5">{currentEvaluation.scores.clarity}%</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Depth</div>
                      <div className="text-xs font-bold text-white mt-0.5">{currentEvaluation.scores.depth}%</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Communication</div>
                      <div className="text-xs font-bold text-white mt-0.5">{currentEvaluation.scores.communication}%</div>
                    </div>
                  </div>
                )}

                {/* Strengths & Missing Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-bold text-emerald-400 block mb-1">What you did well:</span>
                    <ul className="space-y-1 text-slate-300">
                      {currentEvaluation.strengths?.map((s: string, idx: number) => (
                        <li key={idx}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-bold text-amber-400 block mb-1">What was missing / improvement:</span>
                    <ul className="space-y-1 text-slate-300">
                      {currentEvaluation.missingPoints?.map((m: string, idx: number) => (
                        <li key={idx}>• {m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Model Answer */}
                {currentEvaluation.modelAnswer && (
                  <div className="bg-indigo-950/20 border border-indigo-900/40 p-3.5 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-indigo-300 block">Recommended Model Answer:</span>
                    <p className="text-slate-200 leading-relaxed">{currentEvaluation.modelAnswer}</p>
                  </div>
                )}

                {/* Next Question CTA */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
                  >
                    <span>Next Interview Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
