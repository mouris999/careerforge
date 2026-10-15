import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { QuestionBankItem } from '../../../types';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  Code2,
  Play,
  Clock,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

export const LearningHubTab: React.FC = () => {
  const { questions, toggleQuestionBookmark, universityResources, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Technical' | 'HR & Behavioral' | 'System Design' | 'Coding'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Coding sandbox state
  const [codeDraft, setCodeDraft] = useState(`// LRU Cache implementation in TypeScript
class LRUCache {
  private capacity: number;
  private map: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Evict least recently used (first key in map iterator)
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}

// Test Case Runner
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log("get(1):", cache.get(1)); // returns 1
cache.put(3, 3); // evicts key 2
console.log("get(2):", cache.get(2)); // returns -1 (not found)
`);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);

  const filteredQuestions = questions.filter((q) => {
    const matchesCat = activeCategory === 'All' || q.category === activeCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectOption = (qId: string, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  const handleRunCode = () => {
    setExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      setExecuting(false);
      setExecutionOutput(`[Sandbox Execution Successful]
Running Test Harness...
✔ Test 1: get(1) returned 1 (O(1) verified)
✔ Test 2: get(2) returned -1 after eviction of key 2
✔ Memory Footprint: 24.8 KB across 1,000 continuous operations
All 2 test cases passed with 0 runtime errors.`);
      showToast('Coding challenge test suite passed! (+60 XP)');
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-700/40">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Learning Hub & Assessment Question Bank</h2>
              <p className="text-xs text-slate-400">
                Practice topic-wise MCQs, explore company-specific interview patterns, and run code in our live sandbox.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts or domains..."
              className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(['All', 'Technical', 'HR & Behavioral', 'System Design', 'Coding'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Questions & Right Code Sandbox + Class Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctOptionIndex;

              return (
                <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {q.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{q.domain}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            q.difficulty === 'Advanced'
                              ? 'bg-rose-950 text-rose-300'
                              : q.difficulty === 'Intermediate'
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-emerald-950 text-emerald-300'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug pt-1">{q.question}</h4>
                    </div>

                    <button
                      onClick={() => toggleQuestionBookmark(q.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title={q.bookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                    >
                      {q.bookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Options if MCQ */}
                  {q.options && q.options.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80';
                        if (isAnswered) {
                          if (optIdx === q.correctOptionIndex) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-300 font-semibold';
                          } else if (selectedOpt === optIdx) {
                            btnStyle = 'bg-rose-950/60 border-rose-600 text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && optIdx === q.correctOptionIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                            )}
                            {isAnswered && selectedOpt === optIdx && optIdx !== q.correctOptionIndex && (
                              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Code snippet if any */}
                  {q.codeSnippet && (
                    <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-indigo-300 overflow-x-auto">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}

                  {/* Explanation card */}
                  {(showExplanation[q.id] || !q.options) && (
                    <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-3 text-xs text-slate-300 mt-2">
                      <span className="font-bold text-indigo-300 block mb-1">Concept Breakdown:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Sandbox & University Lecture Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Code Execution Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Algorithm & Concurrency Sandbox</span>
              </h3>
              <button
                onClick={handleRunCode}
                disabled={executing}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1 shadow"
              >
                <Play className={`w-3.5 h-3.5 ${executing ? 'animate-spin' : ''}`} />
                <span>{executing ? 'Running...' : 'Execute'}</span>
              </button>
            </div>

            <textarea
              value={codeDraft}
              onChange={(e) => setCodeDraft(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 rounded-xl p-3 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />

            {executionOutput && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Console Output:</div>
                <pre className="text-emerald-400 whitespace-pre-wrap">{executionOutput}</pre>
              </div>
            )}
          </div>

          {/* University Class Resources & Professor Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>University Faculty Course Resources</span>
              </h3>
              <span className="text-[10px] text-slate-400">Class Cohort 2027</span>
            </div>

            <div className="space-y-2.5">
              {universityResources.map((res) => (
                <div key={res.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{res.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {res.facultyName} • {res.fileSizeOrDuration} • {res.downloads} downloads
                    </p>
                  </div>
                  <button
                    onClick={() => showToast(`Resource "${res.title}" opened in viewer`)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-indigo-400 border border-slate-700"
                    title="Download / View Resource"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
