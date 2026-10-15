import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FlaskConical,
  Flame,
  Thermometer,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Award,
} from 'lucide-react';

export const VirtualLabTab: React.FC = () => {
  const { profile, updateProfile, showToast } = useApp();

  // Mode: 3D/VR vs Browser 2D
  const [labMode, setLabMode] = useState<'browser' | 'vr'>('browser');

  // Selected Experiment
  const [experiment, setExperiment] = useState<'titration' | 'displacement' | 'catalysis'>('titration');

  // Interactive Reagent & Apparatus State
  const [beakerLiquidColor, setBeakerLiquidColor] = useState('rgba(236, 72, 153, 0.7)'); // Magenta (phenolphthalein + base)
  const [buretteVolume, setBuretteVolume] = useState(50); // mL
  const [beakerVolume, setBeakerVolume] = useState(25); // mL
  const [temperature, setTemperature] = useState(24); // °C
  const [burnerActive, setBurnerActive] = useState(false);
  const [reactionProgress, setReactionProgress] = useState(0); // 0 to 100%
  const [bubbles, setBubbles] = useState<Array<{ x: number; y: number; r: number }>>([]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Reset experiment
  const resetLab = (exp: 'titration' | 'displacement' | 'catalysis') => {
    setExperiment(exp);
    setReactionProgress(0);
    setBurnerActive(false);
    setQuizAnswer(null);
    setQuizSubmitted(false);

    if (exp === 'titration') {
      setBeakerLiquidColor('rgba(236, 72, 153, 0.75)'); // pink/magenta
      setBuretteVolume(50);
      setBeakerVolume(25);
      setTemperature(24);
    } else if (exp === 'displacement') {
      setBeakerLiquidColor('rgba(59, 130, 246, 0.8)'); // deep blue CuSO4
      setBeakerVolume(40);
      setTemperature(24);
    } else if (exp === 'catalysis') {
      setBeakerLiquidColor('rgba(241, 245, 249, 0.5)'); // clear H2O2
      setBeakerVolume(30);
      setTemperature(22);
    }
    showToast(`Loaded experiment: ${exp.toUpperCase()}`);
  };

  // Add Titrant / Reactant
  const handleAddReagent = () => {
    if (experiment === 'titration') {
      if (buretteVolume > 0) {
        setBuretteVolume((prev) => Math.max(0, prev - 5));
        setBeakerVolume((prev) => prev + 5);
        setReactionProgress((prev) => {
          const next = Math.min(100, prev + 20);
          if (next >= 80) {
            // End point reached: Solution turns completely clear!
            setBeakerLiquidColor('rgba(241, 245, 249, 0.4)');
            setTemperature(26.5);
          } else if (next >= 40) {
            setBeakerLiquidColor('rgba(244, 114, 182, 0.4)');
          }
          return next;
        });
        showToast('Titrated 5 mL HCl into NaOH beaker.');
      }
    } else if (experiment === 'displacement') {
      setReactionProgress((prev) => {
        const next = Math.min(100, prev + 25);
        if (next >= 75) {
          // Color changes to pale green FeSO4
          setBeakerLiquidColor('rgba(16, 185, 129, 0.75)');
          setTemperature(28);
        } else if (next >= 50) {
          setBeakerLiquidColor('rgba(6, 148, 162, 0.75)');
        }
        return next;
      });
      showToast('Iron filings immersed into Copper(II) Sulfate solution.');
    } else if (experiment === 'catalysis') {
      // Rapid exothermic gas bubbles
      setReactionProgress(100);
      setTemperature(58); // hot
      setBeakerLiquidColor('rgba(251, 191, 36, 0.6)');
      showToast('Potassium Iodide catalyst added! Rapid O2 gas evolved.');
    }
  };

  // Canvas Animation Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particleList: Array<{ x: number; y: number; vy: number; r: number }> = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lab Table Surface
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 280, canvas.width, 100);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 280);
      ctx.lineTo(canvas.width, 280);
      ctx.stroke();

      // Draw Bunsen Burner if active
      if (burnerActive) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(180, 260, 40, 20); // burner base
        // Flame
        ctx.fillStyle = 'rgba(59, 130, 246, 0.85)';
        ctx.beginPath();
        ctx.moveTo(190, 260);
        ctx.quadraticCurveTo(200, 220 + Math.random() * 10, 210, 260);
        ctx.fill();
        ctx.fillStyle = 'rgba(234, 179, 8, 0.8)';
        ctx.beginPath();
        ctx.moveTo(195, 260);
        ctx.quadraticCurveTo(200, 235 + Math.random() * 5, 205, 260);
        ctx.fill();
      }

      // Draw Beaker (Center x: 300, y: 150 to 280)
      const bx = 280;
      const by = 150;
      const bw = 140;
      const bh = 130;

      // Beaker Glass outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, by + bh);
      ctx.quadraticCurveTo(bx + bw / 2, by + bh + 10, bx + bw, by + bh);
      ctx.lineTo(bx + bw, by);
      ctx.stroke();

      // Liquid inside beaker
      const liquidHeight = (beakerVolume / 60) * (bh - 15);
      const ly = by + bh - liquidHeight;

      ctx.fillStyle = beakerLiquidColor;
      ctx.beginPath();
      ctx.moveTo(bx + 3, ly);
      ctx.lineTo(bx + 3, by + bh);
      ctx.quadraticCurveTo(bx + bw / 2, by + bh + 8, bx + bw - 3, by + bh);
      ctx.lineTo(bx + bw - 3, ly);
      ctx.closePath();
      ctx.fill();

      // Measurement graduation marks on beaker
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      for (let mark = 1; mark <= 4; mark++) {
        const my = by + bh - mark * 24;
        ctx.beginPath();
        ctx.moveTo(bx + 3, my);
        ctx.lineTo(bx + 18, my);
        ctx.stroke();
      }

      // Draw Burette above beaker if titration
      if (experiment === 'titration') {
        const ux = 340;
        const uy = 20;
        const uw = 20;
        const uh = 120;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(ux, uy, uw, uh);

        // Burette Liquid
        const bLiquidHeight = (buretteVolume / 50) * (uh - 10);
        ctx.fillStyle = 'rgba(241, 245, 249, 0.5)';
        ctx.fillRect(ux + 2, uy + uh - bLiquidHeight, uw - 4, bLiquidHeight);

        // Tip
        ctx.beginPath();
        ctx.moveTo(ux + 5, uy + uh);
        ctx.lineTo(ux + 10, uy + uh + 15);
        ctx.lineTo(ux + 15, uy + uh);
        ctx.stroke();

        // Droplet animation if reaction in progress
        if (reactionProgress > 0 && reactionProgress < 100) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(ux + 10, uy + uh + 20 + ((Date.now() / 8) % 30), 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Bubbles for Catalysis
      if (experiment === 'catalysis' && reactionProgress > 0) {
        if (Math.random() < 0.4) {
          particleList.push({
            x: bx + 15 + Math.random() * (bw - 30),
            y: by + bh - 5,
            vy: 1.5 + Math.random() * 2,
            r: 2 + Math.random() * 3,
          });
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        particleList.forEach((p, idx) => {
          p.y -= p.vy;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        particleList = particleList.filter((p) => p.y > ly);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [experiment, beakerLiquidColor, buretteVolume, beakerVolume, burnerActive, reactionProgress]);

  const handleCompleteQuiz = () => {
    setQuizSubmitted(true);
    if (quizAnswer === 1) {
      updateProfile({ xp: profile.xp + 100 });
      showToast('Correct! You earned +100 XP for mastering Virtual Lab simulation.');
    } else {
      showToast('Incorrect answer. Review the reaction explanation and try again.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <FlaskConical className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">VR & Interactive Simulation Lab</h2>
              <p className="text-xs text-slate-400">
                Interactive physical apparatus simulation supporting reaction kinetics, color change titrations, and virtual equipment.
              </p>
            </div>
          </div>
        </div>

        {/* Experiment Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'titration', label: 'Acid-Base Titration' },
            { id: 'displacement', label: 'Metal Displacement' },
            { id: 'catalysis', label: 'Catalytic Decomposition' },
          ].map((exp) => (
            <button
              key={exp.id}
              onClick={() => resetLab(exp.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                experiment === exp.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {exp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Canvas Apparatus (8 cols) & Reagent Controls + Quiz (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Display (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Apparatus Stage: {experiment.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                Live Simulation
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1 text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Thermometer className="w-3.5 h-3.5" />
                <span>{temperature}°C</span>
              </div>
              <button
                onClick={() => resetLab(experiment)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                title="Reset Apparatus"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Component */}
          <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={320}
              className="w-full h-[320px] max-w-full"
            />
          </div>

          {/* Experiment Steps Instruction Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-1.5">
            <span className="font-bold text-indigo-400 block">Procedure Instructions:</span>
            {experiment === 'titration' && (
              <p className="text-slate-300">
                1. Observe 25 mL of 0.1M NaOH with phenolphthalein indicator (bright magenta).<br />
                2. Click <strong>"Add Titrant (5 mL HCl)"</strong> to dispense hydrochloric acid from the burette.<br />
                3. When the neutralization equivalence point is reached (pH 7.0), observe the solution turn completely clear!
              </p>
            )}
            {experiment === 'displacement' && (
              <p className="text-slate-300">
                1. Blue Copper(II) Sulfate solution (CuSO4) contains Cu²⁺ ions.<br />
                2. Add Iron (Fe) filings to observe single displacement: Fe + CuSO4 → FeSO4 + Cu.<br />
                3. The solution turns pale green while reddish copper metal deposits on the surface.
              </p>
            )}
            {experiment === 'catalysis' && (
              <p className="text-slate-300">
                1. Hydrogen peroxide decomposes slowly: 2H2O2 → 2H2O + O2.<br />
                2. Adding Potassium Iodide (KI) drops the activation energy, triggering violent oxygen bubbling and exothermic heating.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Reagent Controls & Post-Lab Quiz (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Controls Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Reagent & Equipment Controls
            </h3>

            <div className="space-y-3">
              <button
                onClick={handleAddReagent}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {experiment === 'titration'
                    ? 'Dispense 5 mL HCl Titrant'
                    : experiment === 'displacement'
                    ? 'Immerse Iron (Fe) Metal'
                    : 'Add Potassium Iodide (KI)'}
                </span>
              </button>

              <button
                onClick={() => {
                  setBurnerActive(!burnerActive);
                  setTemperature((prev) => (burnerActive ? 24 : prev + 15));
                  showToast(burnerActive ? 'Bunsen burner extinguished' : 'Bunsen burner ignited');
                }}
                className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition-all ${
                  burnerActive
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Flame className={`w-4 h-4 ${burnerActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{burnerActive ? 'Turn Off Bunsen Burner' : 'Ignite Bunsen Burner'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Reaction Progress:</span>
                <span className="text-white font-bold">{reactionProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${reactionProgress}%` }} />
              </div>
            </div>
          </div>

          {/* Post-Lab Assessment Quiz */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Lab Comprehension Check</span>
              </h3>
              <span className="text-[10px] text-amber-400 font-bold">+100 XP</span>
            </div>

            <p className="text-xs text-slate-200">
              Why does phenolphthalein become colorless when excess HCl is titrated into NaOH?
            </p>

            <div className="space-y-2 pt-1 text-xs">
              {[
                'The indicator precipitates out of the aqueous phase as solid crystals.',
                'The pH drops below 8.2, shifting the equilibrium to the protonated colorless lactone form.',
                'The boiling point elevation evaporates the indicator dye.',
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    quizAnswer === i
                      ? 'bg-indigo-950 border-indigo-500 text-indigo-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={handleCompleteQuiz}
              disabled={quizAnswer === null || quizSubmitted}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow"
            >
              {quizSubmitted ? 'Quiz Evaluated ✓' : 'Submit Lab Answer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
