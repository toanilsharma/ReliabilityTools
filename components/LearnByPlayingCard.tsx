import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  TrendingUp, 
  Search, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  CheckCircle2 
} from 'lucide-react';
import { trackResultShared } from '../utils/analytics';

interface GameRecommendation {
  gameTitle: string;
  gameSubtitle: string;
  gamePath: string;
  badge: string;
  badgeColor: string;
  headline: string;
  description: string;
  highlights: string[];
  icon: React.ReactNode;
  gradient: string;
  buttonGradient: string;
}

export const getGameForRoute = (pathname: string): GameRecommendation => {
  const clean = pathname.toLowerCase();

  // 1. Weibull & Distributions
  if (
    clean.includes('weibull') || 
    clean.includes('hazard-rate') || 
    clean.includes('confidence-interval') || 
    clean.includes('growth') || 
    clean.includes('warranty') ||
    clean.includes('bearing-life')
  ) {
    return {
      gameTitle: 'Guess the Beta',
      gameSubtitle: 'Weibull Failure Distribution Challenge',
      gamePath: '/play/guess-the-beta/',
      badge: 'Interactive Weibull Challenge',
      badgeColor: 'border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10',
      headline: 'Train Your Weibull Distribution Intuition',
      description: 'Can you spot infant mortality (β < 1), random failures (β = 1), or mechanical wear-out (β > 1) from simulated breakdown histograms? Put your statistical eye to the test in 5 rapid-fire rounds.',
      highlights: ['Simulated failure histograms (N=70)', 'Immediate physics explanations', 'Accuracy scoring up to 5,000 pts'],
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      gradient: 'from-purple-950/40 via-slate-900/60 to-indigo-950/40 border-purple-500/30',
      buttonGradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
    };
  }

  // 2. Failure Analysis, RCA, FMEA & Quality
  if (
    clean.includes('5-why') || 
    clean.includes('fishbone') || 
    clean.includes('fmea') || 
    clean.includes('fta') || 
    clean.includes('pareto') ||
    clean.includes('markov')
  ) {
    return {
      gameTitle: 'RCA Detective',
      gameSubtitle: 'Forensic Equipment Breakdown Mystery',
      gamePath: '/play/rca-detective/',
      badge: 'Forensic Failure Mystery',
      badgeColor: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      headline: 'Solve Real-World Equipment Breakdown Cases',
      description: 'Step into the shoes of a lead reliability forensic investigator. Cross-examine SCADA trends, oil spectrometry reports, and fractography micrographs to uncover physical, human, and organizational root causes.',
      highlights: ['Forensic evidence locker', 'Interactive 5-Why deduction cascades', 'Tri-fold root cause debrief'],
      icon: <Search className="w-6 h-6 text-emerald-400" />,
      gradient: 'from-emerald-950/40 via-slate-900/60 to-teal-950/40 border-emerald-500/30',
      buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
    };
  }

  // 3. Maintenance, Availability, PM, OEE, Spares, LCC & Redundancy
  if (
    clean.includes('availability') || 
    clean.includes('oee') || 
    clean.includes('pm') || 
    clean.includes('downtime-cost') || 
    clean.includes('optimal-replacement') || 
    clean.includes('spares') || 
    clean.includes('lcc') || 
    clean.includes('cost-risk') || 
    clean.includes('rcm-decision') ||
    clean.includes('gearbox') ||
    clean.includes('lubricant-life') ||
    clean.includes('vibration-severity') ||
    clean.includes('k-out-of-n') ||
    clean.includes('rbd') ||
    clean.includes('validator') ||
    clean.includes('eoq')
  ) {
    return {
      gameTitle: 'Uptime Tycoon',
      gameSubtitle: 'Plant Reliability Strategy Simulator',
      gamePath: '/play/uptime-tycoon/',
      badge: '24-Month Plant Simulation',
      badgeColor: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
      headline: 'Run a 10-Asset Factory Line for 24 Months',
      description: 'Put your maintenance strategy to the test! Balance Run-to-Failure, PM, and Condition-Based PdM across 10 machines. Respond to P-F curve warnings and optimize cumulative plant profit and OEE.',
      highlights: ['Monte-Carlo failure simulation', 'P-F curve warning detections', 'End-of-game strategy debrief card'],
      icon: <Gamepad2 className="w-6 h-6 text-cyan-400" />,
      gradient: 'from-cyan-950/40 via-slate-900/60 to-blue-950/40 border-cyan-500/30',
      buttonGradient: 'from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
    };
  }

  // 4. Default / Reliability Terminology & Fundamentals (MTBF, MTTR, SIL, etc.)
  return {
    gameTitle: 'Termle Daily',
    gameSubtitle: 'Daily Reliability Engineering Term Guesser',
    gamePath: '/play/termle/',
    badge: 'Daily Diagnostic Challenge',
    badgeColor: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    headline: 'Challenge Your Reliability Engineering Vocabulary',
    description: 'Guess the daily 4-to-7 letter reliability engineering term in 6 attempts. Clues unlock directly from our glossary data with letter feedback tiles, definitions, and streak counters.',
    highlights: ['Daily ISO 14224 terms', 'Streak tracking & emoji grids', 'No account required'],
    icon: <Flame className="w-6 h-6 text-amber-500" />,
    gradient: 'from-amber-950/40 via-slate-900/60 to-orange-950/40 border-amber-500/30',
    buttonGradient: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
  };
};

interface LearnByPlayingCardProps {
  toolPath?: string;
}

const LearnByPlayingCard: React.FC<LearnByPlayingCardProps> = ({ toolPath }) => {
  const location = useLocation();
  const currentPath = toolPath || location.pathname;
  const game = getGameForRoute(currentPath);

  const handleClick = () => {
    trackResultShared('play_cta_click', game.gameTitle);
  };

  return (
    <div className={`my-8 bg-gradient-to-r ${game.gradient} border rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl relative overflow-hidden group`}>
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider ${game.badgeColor}`}>
              <Sparkles className="w-3.5 h-3.5" /> Learn by Playing
            </span>
            <span className="px-2.5 py-0.5 bg-slate-800/80 text-slate-300 border border-slate-700/60 rounded-full text-[11px] font-semibold">
              Free • Zero Sign-Up
            </span>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
              {game.icon}
              <span>{game.headline}</span>
            </h3>
            <p className="text-xs font-bold text-cyan-400 mt-0.5">
              Featured Game: {game.gameTitle} ({game.gameSubtitle})
            </p>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {game.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {game.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[210px] shrink-0">
          <Link
            to={game.gamePath}
            onClick={handleClick}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r ${game.buttonGradient} font-black rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap text-sm text-center`}
          >
            <span>Play {game.gameTitle}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/play/"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-colors text-center"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Explore All 5 Games</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearnByPlayingCard;
