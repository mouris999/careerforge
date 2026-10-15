import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Edit3,
  Trash2,
  Download,
  Send,
  MessageSquare,
  Headphones,
  Sparkles,
} from 'lucide-react';

export const StudyTogetherTab: React.FC = () => {
  const { profile, showToast } = useApp();

  // Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');

  // Ambient Audio State (Synthesized Ambient using Web Audio API)
  const [activeSound, setActiveSound] = useState<'none' | 'lofi' | 'rain' | 'whitenoise'>('none');
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<any>(null);

  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(3);

  // Chat State
  const [activeChannel, setActiveChannel] = useState<'#interview-prep' | '#system-design' | '#internship-leads'>('#interview-prep');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: '1', user: 'Maya Lin', text: 'Anyone reviewing the Raft leader election paper before tomorrow’s screening?', time: '10:14 AM' },
    { id: '2', user: 'Siddharth Rao', text: 'Yes! Don’t forget to study how randomized split vote timeouts prevent perpetual ties.', time: '10:16 AM' },
    { id: '3', user: 'Daniel Kim', text: 'Stripe recruiter just updated the application portal statuses today!', time: '10:20 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Pomodoro Ticker
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            if (timerMode === 'focus') {
              showToast('Pomodoro Focus session complete! Take a 5-minute break.');
              setTimerMode('break');
              return 5 * 60;
            } else {
              showToast('Break finished! Ready to focus again.');
              setTimerMode('focus');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerMode]);

  // Ambient Audio Player using synthetic Web Audio
  const playAmbientSound = (type: 'none' | 'lofi' | 'rain' | 'whitenoise') => {
    // Stop current sound
    if (soundNodeRef.current) {
      try {
        soundNodeRef.current.stop?.();
        soundNodeRef.current.disconnect?.();
      } catch (e) {}
      soundNodeRef.current = null;
    }

    if (type === 'none') {
      setActiveSound('none');
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'rain' || type === 'whitenoise') {
        // Pink / White noise generator
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2 + white * 0.5362) * (type === 'rain' ? 0.04 : 0.02);
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.4;
        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();
        soundNodeRef.current = whiteNoise;
      } else if (type === 'lofi') {
        // Lofi warm chord oscillator
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(196, ctx.currentTime); // G3
        gain.gain.value = 0.08;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        soundNodeRef.current = osc;
      }

      setActiveSound(type);
      showToast(`Playing ambient focus audio: ${type}`);
    } catch (err) {
      console.warn('Audio synthesis issue:', err);
      setActiveSound('none');
    }
  };

  useEffect(() => {
    return () => {
      if (soundNodeRef.current) {
        try {
          soundNodeRef.current.stop?.();
        } catch (e) {}
      }
    };
  }, []);

  // Whiteboard drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showToast('Whiteboard canvas cleared');
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `CareerForge-Whiteboard-${Date.now()}.png`;
    link.href = image;
    link.click();
    showToast('Whiteboard drawing saved as PNG!');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: `chat_${Date.now()}`,
        user: `${profile.name} (You)`,
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Shared Pomodoro & Ambient Player */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Study Together & Peer Community</h2>
              <p className="text-xs text-slate-400">
                Synchronized Pomodoro focus sessions, ambient sound generators, interactive whiteboard, and study channels.
              </p>
            </div>
          </div>
        </div>

        {/* Pomodoro & Ambient Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pomodoro Timer Pill */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 flex items-center space-x-3">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">
                {timerMode === 'focus' ? 'Focus Session' : 'Rest Break'}
              </div>
              <div className="text-lg font-mono font-extrabold text-white">{formatTime(pomodoroSeconds)}</div>
            </div>
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                title={timerRunning ? 'Pause Timer' : 'Start Timer'}
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setPomodoroSeconds(25 * 60);
                  setTimerMode('focus');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Reset Pomodoro"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ambient Music Generator Pill */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center space-x-2">
            <Headphones className="w-4 h-4 text-indigo-400" />
            <select
              value={activeSound}
              onChange={(e) => playAmbientSound(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
            >
              <option value="none">Sound: Off</option>
              <option value="lofi">Lofi Warm Synth</option>
              <option value="rain">Gentle Rain Shower</option>
              <option value="whitenoise">Deep White Noise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Whiteboard (7 cols) & Right Discord-style Study Channels (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collaborative Whiteboard Canvas */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                System Design Whiteboard
              </h3>
            </div>

            {/* Whiteboard Controls */}
            <div className="flex items-center space-x-2">
              {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map((c) => (
                <button
                  key={c}
                  onClick={() => setBrushColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    brushColor === c ? 'scale-125 border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}

              <div className="h-4 w-px bg-slate-800 mx-1" />

              <button
                onClick={clearCanvas}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                title="Clear Canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={exportCanvas}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
                title="Export Image"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
            <canvas
              ref={canvasRef}
              width={650}
              height={360}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-[360px] cursor-crosshair"
            />
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-600 pointer-events-none">
              Click & drag to sketch architecture diagrams
            </div>
          </div>
        </div>

        {/* Study Group Community Channels */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-[440px] justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Study Channels</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>12 Active Peers</span>
              </span>
            </div>

            {/* Channel Tabs */}
            <div className="flex space-x-1 mt-3">
              {(['#interview-prep', '#system-design', '#internship-leads'] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    activeChannel === ch ? 'bg-slate-800 text-indigo-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-indigo-300">{msg.user}</span>
                    <span className="text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-300">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="pt-2 flex items-center space-x-2 border-t border-slate-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message ${activeChannel}...`}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
