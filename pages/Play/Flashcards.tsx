import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  RotateCw, 
  CheckCircle2, 
  BookOpen, 
  ArrowLeft, 
  Filter, 
  Sparkles, 
  Trophy, 
  HelpCircle,
  X,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { GLOSSARY_TERMS, GlossaryTerm } from '../../constants';
import { 
  getFlashcardStats, 
  recordFlashcardReview, 
  ReviewRating, 
  FlashcardStats 
} from '../../utils/playStorage';
import { trackGameCompleted, trackStreakExtended, trackResultShared } from '../../utils/analytics';

const Flashcards: React.FC = () => {
  const [stats, setStats] = useState<FlashcardStats>(() => getFlashcardStats());
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionReviews, setSessionReviews] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Filter glossary terms
  const terms: GlossaryTerm[] = React.useMemo(() => {
    let list = GLOSSARY_TERMS;
    if (categoryFilter !== 'All') {
      list = list.filter(t => t.category === categoryFilter);
    }
    // Sort so cards that are due or unreviewed come first
    const todayStr = new Date().toISOString().slice(0, 10);
    return [...list].sort((a, b) => {
      const stateA = stats.cards[a.term];
      const stateB = stats.cards[b.term];
      const dueA = stateA ? stateA.dueDate <= todayStr : true;
      const dueB = stateB ? stateB.dueDate <= todayStr : true;
      if (dueA && !dueB) return -1;
      if (!dueA && dueB) return 1;
      return 0;
    });
  }, [categoryFilter, stats.cards]);

  const currentTerm = terms[currentIndex] || terms[0];
  const currentCardState = currentTerm ? stats.cards[currentTerm.term] : null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: ReviewRating) => {
    if (!currentTerm) return;

    const { stats: updatedStats, streakExtended } = recordFlashcardReview(currentTerm.term, rating);
    setStats(updatedStats);
    setSessionReviews(prev => prev + 1);

    if (streakExtended) {
      trackStreakExtended(updatedStats.studyStreakDays, 'flashcards');
    }

    // Advance to next card
    setIsFlipped(false);
    if (currentIndex + 1 < terms.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
      trackGameCompleted('flashcards', sessionReviews + 1, {
        mastered: updatedStats.cardsMastered,
        totalReviews: updatedStats.totalReviews
      });
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        else if (e.key === '2') handleRate('hard');
        else if (e.key === '3') handleRate('good');
        else if (e.key === '4') handleRate('easy');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, terms]);

  const shareText = `Reliability Glossary Flashcards: ${stats.studyStreakDays}🔥 Day Streak!\n` +
    `Mastered ${stats.cardsMastered} industrial reliability terms using spaced repetition.\n` +
    `Study: https://reliabilitytools.co.in/play/flashcards`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      trackResultShared('copy_flashcards', 'Flashcards');
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <SEO 
        title="Reliability Flashcards - Spaced Repetition Terminology | Reliability Tools"
        description="Master 50+ industrial reliability engineering terms with SuperMemo SM-2 spaced repetition flashcards and daily study streaks."
        canonicalUrl="https://reliabilitytools.co.in/play/flashcards/"
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link 
          to="/play" 
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Hub
        </Link>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-500" />
            RELIABILITY FLASHCARDS
          </h1>
          <p className="text-[11px] text-slate-400">SM-2 Spaced Repetition Retention System</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 text-xs font-black shadow-sm"
            title={`${stats.studyStreakDays} Day Consecutive Study Streak`}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{stats.studyStreakDays} 🔥</span>
          </div>

          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="How Spaced Repetition Works"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Counter Ribbon */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-lg font-black text-slate-900 dark:text-white">{sessionReviews}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">This Session</div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-lg font-black text-emerald-500">{stats.cardsMastered}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Mastered (14d+)</div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-lg font-black text-cyan-500">{stats.totalReviews}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">All-Time Reviews</div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['All', 'Maintenance', 'Statistics', 'General'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
          Card {currentIndex + 1} / {terms.length}
        </span>
      </div>

      {/* 3D Flip Flashcard */}
      <div 
        onClick={handleFlip}
        className="w-full h-80 cursor-pointer perspective select-none"
      >
        <div 
          className={`w-full h-full relative transition-transform duration-500 rounded-3xl shadow-xl transform-style-3d border ${
            isFlipped 
              ? 'rotate-y-180 bg-slate-900 border-slate-700 text-white' 
              : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-cyan-500/50'
          }`}
        >
          {/* Card Front */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between backface-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40 rounded-lg text-xs font-bold uppercase tracking-wider">
                {currentTerm?.category}
              </span>
              {currentCardState && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Interval: {currentCardState.intervalDays}d • Due: {currentCardState.dueDate}
                </span>
              )}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {currentTerm?.term}
              </h2>
              <p className="text-xs text-slate-400">Reliability Terminology</p>
            </div>

            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-xl">
                <RotateCw className="w-3.5 h-3.5" /> Click or press Space to reveal definition
              </span>
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between backface-hidden rotate-y-180 bg-slate-900 rounded-3xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {currentTerm?.term} — Definition
              </span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">
                {currentTerm?.category}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                {currentTerm?.definition}
              </p>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              Rate your recall below to schedule next review interval
            </div>
          </div>
        </div>
      </div>

      {/* SM-2 Recall Rating Buttons (Active when flipped) */}
      {isFlipped ? (
        <div className="space-y-2 animate-fadeIn">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            How well did you know this?
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleRate('again')}
              className="p-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center"
            >
              <span>🔴 Again</span>
              <span className="text-[10px] opacity-75 font-normal">1 Day</span>
            </button>
            <button
              onClick={() => handleRate('hard')}
              className="p-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center"
            >
              <span>🟡 Hard</span>
              <span className="text-[10px] opacity-75 font-normal">~2 Days</span>
            </button>
            <button
              onClick={() => handleRate('good')}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center"
            >
              <span>🟢 Good</span>
              <span className="text-[10px] opacity-75 font-normal">~5 Days</span>
            </button>
            <button
              onClick={() => handleRate('easy')}
              className="p-3 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center"
            >
              <span>🔵 Easy</span>
              <span className="text-[10px] opacity-75 font-normal">~9+ Days</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Shortcuts: Space to flip</span>
          <span>Ratings 1-4 when revealed</span>
        </div>
      )}

      {/* Share Progress Box */}
      <div className="p-4 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {stats.studyStreakDays} Day Learning Streak
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {stats.cardsMastered} terms retained in long-term memory
            </div>
          </div>
        </div>

        <button
          onClick={copyShare}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedShare ? 'Copied!' : 'Share Streak'}</span>
        </button>
      </div>

      {/* How Spaced Repetition Works Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500" /> SuperMemo SM-2 Algorithm
              </h3>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Our flashcards use the proven <strong>SuperMemo SM-2 spaced repetition algorithm</strong> to cement reliability concepts into permanent memory before they fade.
              </p>
              <div className="space-y-1.5">
                <div><strong>🔴 Again:</strong> Card reset to 1 day. Use if you forgot the definition completely.</div>
                <div><strong>🟡 Hard:</strong> Review soon with a modest 1.2x interval bump.</div>
                <div><strong>🟢 Good:</strong> Standard interval expansion based on ease factor.</div>
                <div><strong>🔵 Easy:</strong> Multiplies interval up to 14+ days. Flags card as Mastered!</div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl text-amber-900 dark:text-amber-200">
                🔥 <strong>Study Streak Flame:</strong> Study at least 1 card daily to maintain and extend your flame streak!
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
