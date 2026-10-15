import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  Volume2,
  GraduationCap,
  Briefcase,
  Code,
  Compass,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mode?: string;
}

export const AITutorTab: React.FC = () => {
  const { profile, showToast } = useApp();

  const [mode, setMode] = useState<'subject_teacher' | 'interview_coach' | 'career_coach' | 'code_explainer'>('subject_teacher');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'assistant',
      text: `Hello ${profile.name}! I am your AI Career & Academic Tutor. I can explain complex computer science concepts, review code architectures, or coach you on behavioral interview frameworks like STAR. What would you like to explore today?`,
      timestamp: 'Just now',
      mode: 'subject_teacher',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode,
          role: profile.targetRole,
          history: messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
      showToast('AI Tutor responded with fallback guidance');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      showToast('Playing voice response');
    }
  };

  const starterPrompts = [
    { title: 'Explain Raft Consensus', mode: 'subject_teacher', prompt: 'Can you explain the Raft consensus algorithm step-by-step with leader election and log replication?' },
    { title: 'STAR Behavioral Framework', mode: 'interview_coach', prompt: 'Teach me how to structure an answer for "Tell me about a time you handled a difficult technical disagreement" using STAR.' },
    { title: 'Career Strategy for SDE', mode: 'career_coach', prompt: 'What skills should a 2027 Computer Science graduate prioritize to stand out for Tier-1 Tech Internships?' },
    { title: 'Debug Memory Leaks', mode: 'code_explainer', prompt: 'How do I detect and eliminate closure-related memory leaks in React useEffect and EventListeners?' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Persona Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Conversational AI Tutor & Mentor</h2>
              <p className="text-xs text-slate-400">
                Context-aware multimodal intelligence tuned for university curricula, code explanations, and placement coaching.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap">
          {[
            { id: 'subject_teacher', label: 'Subject Teacher', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { id: 'interview_coach', label: 'Interview Coach', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'code_explainer', label: 'Code Explainer', icon: <Code className="w-3.5 h-3.5" /> },
            { id: 'career_coach', label: 'Career Coach', icon: <Compass className="w-3.5 h-3.5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === item.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Starter Prompts Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Suggested Topics:</span>
        {starterPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setMode(p.mode as any);
              handleSendMessage(p.prompt);
            }}
            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs whitespace-nowrap transition-colors"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="hover:text-indigo-400 p-0.5"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 flex-shrink-0 mt-0.5"
                />
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-44 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>AI Tutor is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask a question in ${mode.replace('_', ' ')} mode...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
