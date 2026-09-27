import React, { useState } from 'react';
import { 
  Gamepad2, 
  TrendingUp, 
  BookOpen, 
  Flame, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  Target,
  Share2,
  Copy,
  Check,
  Building2,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { 
  getTermleStats, 
  getGuessBetaStats, 
  getFlashcardStats, 
  getPlayerProfile 
} from '../../utils/playStorage';
import { trackResultShared } from '../../utils/analytics';

const PlayHub: React.FC = () => {
  const [profile] = useState(() => getPlayerProfile());
  const [termleStats] = useState(() => getTermleStats());
  const [betaStats] = useState(() => getGuessBetaStats());
  const [flashcardStats] = useState(() => getFlashcardStats());
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const totalStreak = Math.max(termleStats.currentStreak, flashcardStats.studyStreakDays);

  const shareText = `Explore the Reliability Engineering Play Hub! 🎮\n` +
    `• Uptime Tycoon (24-Month Plant Reliability Simulation)\n` +
    `• Termle (Daily Word Guesser)\n` +
    `• Guess the Beta (Weibull Histogram Challenge)\n` +
    `• Spaced-Repetition Glossary Flashcards\n` +
    `Play: https://reliabilitytools.co.in/play`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      trackResultShared('copy_play_hub', 'Play Hub');
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEO 
        title="Play Hub - Reliability Engineering Games & Challenges | Reliability Tools"
        description="Master reliability physics, failure distributions, and terminology through gamified daily puzzles, Weibull histogram estimation, and spaced repetition flashcards."
        canonicalUrl="https://reliabilitytools.co.in/play/"
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 rounded-full text-xs font-bold text-cyan-600 dark:text-cyan-400">
          <Gamepad2 className="w-4 h-4" /> Gamified Reliability Training Suite
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Reliability Engineering <span className="text-cyan-600 dark:text-cyan-400">Play Hub</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Sharpen your asset failure intuition through interactive simulation games, daily diagnostic challenges, and scientifically proven spaced repetition flashcards.
        </p>

        {/* Global Streak & Leaderboard Quick Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl text-amber-600 dark:text-amber-400 text-xs font-black shadow-sm">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>Active Streak: {totalStreak} Days</span>
          </div>

          <Link
            to="/play/leaderboard"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm border border-slate-700 hover:border-cyan-500/50"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>View Local Leaderboard</span>
          </Link>

          <button
            onClick={copyShare}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-all shadow-sm border border-slate-200 dark:border-slate-700"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? 'Copied Link!' : 'Share Play Hub'}</span>
          </button>
        </div>
      </div>

      {/* Flagship Simulation: Uptime Tycoon */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 border border-cyan-500/30 rounded-3xl p-8 lg:p-10 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Flagship Simulation
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-black uppercase tracking-wider">
                24-Month Plant Horizon
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-black uppercase tracking-wider">
                Zero Backend • Local Storage
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <Building2 className="w-8 h-8 text-cyan-400" />
                Uptime Tycoon
              </h2>
              <p className="text-sm font-bold text-cyan-400 mt-1">
                Industrial Plant Reliability & Maintenance Strategy Simulator
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Take the helm as Plant Reliability Director! Command a 10-asset manufacturing line over 24 simulated months. 
              Assign strategies (<strong>Run-to-Failure</strong>, <strong>Time-Based PM</strong>, <strong>Condition-Based PdM</strong>, or <strong>Capital Redesign</strong>) to navigate hidden <strong>Weibull failure physics</strong>, respond to real-time <strong>P-F curve warnings</strong>, and maximize cumulative plant profit and OEE.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Asset Fleet</span>
                <strong className="text-sm text-white font-mono">10 Machines</strong>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Failure Engine</span>
                <strong className="text-sm text-cyan-400 font-mono">Monte-Carlo</strong>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Warning System</span>
                <strong className="text-sm text-amber-400 font-mono">P-F Detection</strong>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Debrief & Proof</span>
                <strong className="text-sm text-emerald-400 font-mono">1200×630 Card</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
            <Link
              to="/play/uptime-tycoon"
              className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center gap-2 group text-center"
            >
              <span>Play Uptime Tycoon</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/play/leaderboard"
              className="px-6 py-3 bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-xs rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2 text-center"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Plant Scorecards</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Play Games Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Daily Challenges & Flashcards
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quick 2-minute daily training puzzles to sharpen your failure intuition
          </p>
        </div>
      </div>

      {/* Three Games Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Game 1: Termle */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between group space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 fill-amber-500" />
              </span>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                Daily Game
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Termle
              </h2>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                Daily Reliability Term Guesser
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Test your engineering vocabulary. Guess the daily 4-to-7 letter reliability term in <strong>6 attempts</strong>. Progressive clues unlock directly from our glossary data!
            </p>

            {/* Feature Bullets */}
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>6 Attempts with letter feedback tiles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Definitions & engineering category hints</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Emoji-grid shareable scores with streaks</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">Current Streak:</span>
              <strong className="text-amber-500 font-mono font-black">{termleStats.currentStreak} Days 🔥</strong>
            </div>

            <Link
              to="/play/termle"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Play Today's Puzzle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Game 2: Guess the Beta */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-purple-500/50 transition-all flex flex-col justify-between group space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </span>
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                5-Round Challenge
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Guess the Beta
              </h2>
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                Weibull Failure Distribution Challenge
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Analyze simulated equipment breakdown histograms across 5 rounds. Estimate the shape parameter <strong>(β)</strong> and characteristic life <strong>(η)</strong>, followed by deep physics explanations.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Simulated failure histograms (N=70)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Physics explanations (Infant vs Random vs Wear)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Scoring up to 5,000 pts with accuracy ratings</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">High Score:</span>
              <strong className="text-purple-500 font-mono font-black">{betaStats.highScore} / 5000 Pts</strong>
            </div>

            <Link
              to="/play/guess-the-beta"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl transition-all shadow-md hover:shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <span>Launch 5-Round Game</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Game 3: Glossary Flashcards */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between group space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </span>
              <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                Retention Engine
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Glossary Cards
              </h2>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                SM-2 Spaced Repetition System
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Master 50+ industrial reliability engineering terms. Uses the scientifically proven <strong>SuperMemo SM-2 algorithm</strong> to schedule reviews before memories decay!
            </p>

            {/* Feature Bullets */}
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>SuperMemo SM-2 interval scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Daily study streak flame 🔥 tracker</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Interactive 3D flip card with keyboard shortcuts</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">Mastered Terms:</span>
              <strong className="text-emerald-500 font-mono font-black">{flashcardStats.cardsMastered} / 52</strong>
            </div>

            <Link
              to="/play/flashcards"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-2xl transition-all shadow-md hover:shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <span>Review Deck</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Leaderboard Callout Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Play Hub Leaderboard</span>
          </div>
          <h3 className="text-2xl font-black">Track Your High Scores & Study Records</h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            All game records, streak counters, and performance stats are preserved privately in your browser's localStorage. Set your custom engineering call-sign and share your scorecards.
          </p>
        </div>

        <Link
          to="/play/leaderboard"
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-2xl transition-colors whitespace-nowrap shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <span>Open Leaderboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default PlayHub;
