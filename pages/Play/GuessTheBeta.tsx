import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  ArrowLeft,
  Info,
  Zap,
  Flame,
  MessageCircle,
  Linkedin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { saveGuessBetaGame, getGuessBetaStats } from '../../utils/playStorage';
import { trackGameCompleted, trackResultShared } from '../../utils/analytics';

// Failure Physics Beta Regimes
export type BetaRegime = 'infant' | 'random' | 'moderate_wear' | 'rapid_wear';

interface BetaRegimeOption {
  id: BetaRegime;
  label: string;
  rangeText: string;
  icon: string;
  description: string;
  minBeta: number;
  maxBeta: number;
}

const REGIME_OPTIONS: BetaRegimeOption[] = [
  {
    id: 'infant',
    label: 'Infant Mortality',
    rangeText: 'β < 1.0',
    icon: '👶',
    description: 'Decreasing failure rate. Burn-in defects, quality issues, or improper installation.',
    minBeta: 0.45,
    maxBeta: 0.92
  },
  {
    id: 'random',
    label: 'Random Failures',
    rangeText: 'β ≈ 1.0 (0.95 - 1.15)',
    icon: '⚡',
    description: 'Constant hazard rate (Exponential). Caused by external shocks, lightning, human error.',
    minBeta: 0.95,
    maxBeta: 1.15
  },
  {
    id: 'moderate_wear',
    label: 'Moderate Wear-Out',
    rangeText: '1.2 < β ≤ 2.5',
    icon: '⚙️',
    description: 'Increasing failure rate. Rolling-element bearings, minor fatigue, belt wear.',
    minBeta: 1.35,
    maxBeta: 2.45
  },
  {
    id: 'rapid_wear',
    label: 'Rapid Wear-Out',
    rangeText: 'β > 2.5',
    icon: '⏳',
    description: 'Steep aging and degradation. Thermal fatigue, corrosion, end-of-life wear.',
    minBeta: 2.8,
    maxBeta: 4.8
  }
];

interface RoundData {
  roundNumber: number;
  trueRegime: BetaRegime;
  trueBeta: number;
  trueEta: number; // Characteristic life
  failures: number[];
  histogramBins: { xStart: number; xEnd: number; count: number }[];
  maxCount: number;
  maxTime: number;
}

/**
 * Generates synthetic failure data from ground truth Weibull distribution
 */
function generateRoundData(roundNumber: number): RoundData {
  // Select random regime
  const regimeOption = REGIME_OPTIONS[Math.floor(Math.random() * REGIME_OPTIONS.length)];
  const trueBeta = Number((regimeOption.minBeta + Math.random() * (regimeOption.maxBeta - regimeOption.minBeta)).toFixed(2));
  
  // Random eta between 1,500 and 12,000 hours
  const baseEta = [2500, 4800, 6500, 8800, 11000][Math.floor(Math.random() * 5)];
  const trueEta = Math.round(baseEta + (Math.random() - 0.5) * 1200);

  // Sample 70 failures using Inverse Transform Sampling: t = eta * (-ln(1-u))^(1/beta)
  const sampleCount = 70;
  const failures: number[] = [];
  for (let i = 0; i < sampleCount; i++) {
    const u = 0.01 + Math.random() * 0.97;
    const t = trueEta * Math.pow(-Math.log(1 - u), 1 / trueBeta);
    failures.push(Math.round(t));
  }
  failures.sort((a, b) => a - b);

  // Group into 12 histogram bins
  const maxTime = Math.ceil(failures[failures.length - 1] * 1.08);
  const numBins = 12;
  const binWidth = maxTime / numBins;

  const histogramBins: { xStart: number; xEnd: number; count: number }[] = [];
  for (let b = 0; b < numBins; b++) {
    const xStart = Math.round(b * binWidth);
    const xEnd = Math.round((b + 1) * binWidth);
    const count = failures.filter(t => t >= xStart && (b === numBins - 1 ? t <= xEnd : t < xEnd)).length;
    histogramBins.push({ xStart, xEnd, count });
  }

  const maxCount = Math.max(1, ...histogramBins.map(b => b.count));

  return {
    roundNumber,
    trueRegime: regimeOption.id,
    trueBeta,
    trueEta,
    failures,
    histogramBins,
    maxCount,
    maxTime
  };
}

const TOTAL_ROUNDS = 5;

const GuessTheBeta: React.FC = () => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [rounds, setRounds] = useState<RoundData[]>(() => [generateRoundData(1)]);
  
  // Player inputs for current round
  const [selectedRegime, setSelectedRegime] = useState<BetaRegime | null>(null);
  const [guessedEta, setGuessedEta] = useState<number>(5000);
  
  // Evaluation state
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [roundScores, setRoundScores] = useState<{
    round: number;
    regimeCorrect: boolean;
    betaPts: number;
    etaPts: number;
    totalPts: number;
  }[]>([]);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [stats, setStats] = useState(() => getGuessBetaStats());
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const currentRound = rounds[currentRoundIndex];

  // Adjust default guessedEta slider range when round changes
  useEffect(() => {
    if (currentRound) {
      setGuessedEta(Math.round(currentRound.maxTime * 0.55));
      setSelectedRegime(null);
      setIsEvaluated(false);
    }
  }, [currentRoundIndex]);

  const handleEvaluate = () => {
    if (!selectedRegime || isEvaluated) return;

    const isRegimeCorrect = selectedRegime === currentRound.trueRegime;
    const betaPts = isRegimeCorrect ? 500 : 0;

    // Eta accuracy score (up to 500 pts)
    const etaDiff = Math.abs(guessedEta - currentRound.trueEta);
    const etaAccuracyRatio = Math.max(0, 1 - etaDiff / currentRound.trueEta);
    const etaPts = Math.round(etaAccuracyRatio * 500);

    const totalRoundPts = betaPts + etaPts;

    const newScore = {
      round: currentRoundIndex + 1,
      regimeCorrect: isRegimeCorrect,
      betaPts,
      etaPts,
      totalPts: totalRoundPts
    };

    setRoundScores(prev => [...prev, newScore]);
    setIsEvaluated(true);
  };

  const handleNextRound = () => {
    if (currentRoundIndex + 1 < TOTAL_ROUNDS) {
      const nextRound = generateRoundData(currentRoundIndex + 2);
      setRounds(prev => [...prev, nextRound]);
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      // Game Over
      setIsGameOver(true);
      const totalScore = roundScores.reduce((sum, r) => sum + r.totalPts, 0) +
        (selectedRegime === currentRound.trueRegime ? 500 : 0) +
        Math.round(Math.max(0, 1 - Math.abs(guessedEta - currentRound.trueEta) / currentRound.trueEta) * 500);

      const maxScore = TOTAL_ROUNDS * 1000;
      const accuracyPct = Math.round((totalScore / maxScore) * 100);

      const updated = saveGuessBetaGame(totalScore, accuracyPct);
      setStats(updated);

      trackGameCompleted('guess_the_beta', totalScore, {
        accuracy: accuracyPct,
        roundsPlayed: TOTAL_ROUNDS
      });
    }
  };

  const handleRestart = () => {
    setCurrentRoundIndex(0);
    setRounds([generateRoundData(1)]);
    setSelectedRegime(null);
    setIsEvaluated(false);
    setRoundScores([]);
    setIsGameOver(false);
  };

  const totalCurrentScore = roundScores.reduce((acc, curr) => acc + curr.totalPts, 0);

  // Explanation text based on true beta
  const getExplanation = (round: RoundData) => {
    const beta = round.trueBeta;
    if (beta < 1.0) {
      return `True β = ${beta} signifies Infant Mortality (Early Failure phase). A decreasing hazard rate indicates that parts that survive initial operation are less likely to fail soon. Time-based preventive replacement is COUNTERPRODUCTIVE here because replacing aging parts with new parts introduces new infant mortality risks! Recommended actions: Supplier quality auditing, pre-commissioning run-in/burn-in testing, and precision alignment.`;
    }
    if (beta >= 0.95 && beta <= 1.15) {
      return `True β = ${beta} indicates Random Failures (Exponential Distribution). The failure rate is strictly constant. Equipment has no memory of its age; old components are just as likely to fail in the next hour as new ones. Preventive replacement yields zero reliability benefit. Recommended actions: Predictive condition monitoring (vibration, oil analysis), redundant standby design, and rapid-response spare parts stocking.`;
    }
    if (beta > 1.15 && beta <= 2.5) {
      return `True β = ${beta} indicates Moderate Wear-Out and Mechanical Fatigue. Typical of rolling-element bearings, mechanical seals, and shaft couplings. As operating hours accumulate, failure probability steadily rises. Recommended actions: Calculate B10 life, establish inspection-based maintenance, and optimize lube intervals.`;
    }
    return `True β = ${beta} represents Rapid Wear-Out & Severe Aging (steep Weibull curve). Characteristic of thermal degradation, corrosion, and high-stress wear components. Failure occurs in a narrow, predictable time band. Recommended actions: Scheduled Preventive Maintenance (PM) replacement prior to the characteristic life η = ${round.trueEta.toLocaleString()} hours is highly cost-effective!`;
  };

  const shareText = `Guess the Beta Score: ${totalCurrentScore} / 5000 pts! 📈\n` +
    `Can you estimate Weibull β shape parameters from simulated failure histograms?\n` +
    `Play: https://reliabilitytools.co.in/play/guess-the-beta`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      trackResultShared('copy_guess_beta', 'Guess the Beta');
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <SEO 
        title="Guess the Beta - Weibull Histogram Estimation Game | Reliability Tools"
        description="Estimate Weibull shape (β) and scale (η) parameters across 5 rounds of simulated equipment failure histograms."
        canonicalUrl="https://reliabilitytools.co.in/play/guess-the-beta/"
      />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link 
          to="/play" 
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Hub
        </Link>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            GUESS THE BETA
          </h1>
          <p className="text-[11px] text-slate-400">5-Round Weibull Histogram Physics Challenge</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-xl text-xs font-black">
            Round {Math.min(TOTAL_ROUNDS, currentRoundIndex + 1)} / {TOTAL_ROUNDS}
          </div>
          <div className="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-black">
            {totalCurrentScore} Pts
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          
          {/* Simulated Failure Histogram Card */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-500" /> Simulated Machinery Breakdown Histogram (Sample N = 70)
              </span>
              <span className="text-slate-400">
                Max Operating Time: ~{currentRound.maxTime.toLocaleString()} hrs
              </span>
            </div>

            {/* SVG Histogram Chart */}
            <div className="w-full h-56 bg-slate-950 rounded-xl p-4 flex flex-col justify-end relative overflow-hidden border border-slate-800 select-none">
              
              {/* Subtle Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                <div className="border-b border-cyan-500 w-full"></div>
                <div className="border-b border-cyan-500 w-full"></div>
                <div className="border-b border-cyan-500 w-full"></div>
              </div>

              {/* Bars */}
              <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-40 z-10">
                {currentRound.histogramBins.map((bin, bIdx) => {
                  const heightPct = (bin.count / currentRound.maxCount) * 100;
                  
                  return (
                    <div 
                      key={bIdx} 
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-20 border border-slate-700">
                        {bin.count} failures ({bin.xStart.toLocaleString()} - {bin.xEnd.toLocaleString()}h)
                      </div>

                      <div 
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isEvaluated 
                            ? 'bg-gradient-to-t from-purple-600 to-cyan-400 shadow-cyan-500/20 shadow-md' 
                            : 'bg-gradient-to-t from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300'
                        }`}
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                <span>0 hrs</span>
                <span>{Math.round(currentRound.maxTime * 0.5).toLocaleString()} hrs</span>
                <span>{currentRound.maxTime.toLocaleString()} hrs</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic text-center">
              Analyze the shape of failures: Are breakdowns clustered early? Uniformly spread? Or surging later as time passes?
            </p>
          </div>

          {/* Player Step 1: Guess Beta Regime */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Step 1: Choose the Failure Physics Regime (β-Range)
              </h2>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">+500 Points</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {REGIME_OPTIONS.map(opt => {
                const isSelected = selectedRegime === opt.id;
                let borderClass = 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/50';

                if (isEvaluated) {
                  if (opt.id === currentRound.trueRegime) {
                    borderClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100';
                  } else if (isSelected && opt.id !== currentRound.trueRegime) {
                    borderClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 opacity-70';
                  } else {
                    borderClass = 'opacity-40 border-slate-200 dark:border-slate-800';
                  }
                } else if (isSelected) {
                  borderClass = 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/40 shadow-sm';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isEvaluated}
                    onClick={() => setSelectedRegime(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${borderClass}`}
                  >
                    <span className="text-2xl select-none">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{opt.label}</span>
                        <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">{opt.rangeText}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Step 2: Estimate Characteristic Life (eta) */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Step 2: Estimate Characteristic Life (η in Hours)
                </h2>
                <p className="text-[11px] text-slate-500">The time at which approximately 63.2% of the population fails.</p>
              </div>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">Up to +500 Points</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">Estimated η:</span>
                <span className="text-base text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-300 dark:border-cyan-800">
                  {guessedEta.toLocaleString()} Hours
                </span>
              </div>

              <input
                type="range"
                disabled={isEvaluated}
                min={Math.round(currentRound.maxTime * 0.15)}
                max={Math.round(currentRound.maxTime * 0.95)}
                step={100}
                value={guessedEta}
                onChange={e => setGuessedEta(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{Math.round(currentRound.maxTime * 0.15).toLocaleString()}h</span>
                <span>{Math.round(currentRound.maxTime * 0.95).toLocaleString()}h</span>
              </div>
            </div>
          </div>

          {/* Evaluate & Action Bar */}
          {!isEvaluated ? (
            <button
              onClick={handleEvaluate}
              disabled={!selectedRegime}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Submit Estimates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            /* Round Results & Engineering Explanation */
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-white space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Round Evaluation</span>
                  <div className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                    {selectedRegime === currentRound.trueRegime ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5" /> Correct Regime!
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-5 h-5" /> Incorrect Regime
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">True β:</span>
                    <strong className="text-cyan-300 font-mono text-sm">{currentRound.trueBeta}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">True η:</span>
                    <strong className="text-cyan-300 font-mono text-sm">{currentRound.trueEta.toLocaleString()}h</strong>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-black">
                    +{roundScores[roundScores.length - 1]?.totalPts} Pts
                  </div>
                </div>
              </div>

              {/* Engineering Physics Explanation */}
              <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
                  ⚙️ Asset Physics & Maintenance Strategy
                </span>
                <p>{getExplanation(currentRound)}</p>
              </div>

              <button
                onClick={handleNextRound}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{currentRoundIndex + 1 < TOTAL_ROUNDS ? 'Proceed to Next Round' : 'View Final Game Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Game Over Summary */
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Challenge Completed</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              Final Score: <span className="text-cyan-600 dark:text-cyan-400">{totalCurrentScore}</span> / 5000
            </h2>
            <div className="inline-block mt-2 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold">
              {totalCurrentScore >= 4200 
                ? '🏆 Principal Reliability Fellow' 
                : totalCurrentScore >= 3400 
                ? '🥈 Senior Weibull Specialist' 
                : '🥉 Reliability Data Analyst'}
            </div>
          </div>

          {/* Round by Round Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <div className="grid grid-cols-4 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold text-slate-600 dark:text-slate-300">
              <span>Round</span>
              <span>Regime Guess</span>
              <span>η Accuracy</span>
              <span>Round Points</span>
            </div>
            {roundScores.map(r => (
              <div key={r.round} className="grid grid-cols-4 p-2.5 border-t border-slate-200 dark:border-slate-800/60 items-center text-slate-700 dark:text-slate-200">
                <span className="font-bold">Round {r.round}</span>
                <span>{r.regimeCorrect ? '✅ +500' : '❌ 0'}</span>
                <span>+{r.etaPts}</span>
                <strong className="text-cyan-600 dark:text-cyan-400 font-mono">+{r.totalPts}</strong>
              </div>
            ))}
          </div>

          {/* Social Share & Replay */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={copyShare}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedShare ? 'Copied Score Text!' : 'Share Score'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://reliabilitytools.co.in/play/guess-the-beta')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>

            <Link
              to="/play/leaderboard"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuessTheBeta;
