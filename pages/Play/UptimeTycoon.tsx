import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  Award, 
  DollarSign, 
  Clock, 
  Activity, 
  Zap, 
  Cpu, 
  ArrowRight, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  HelpCircle, 
  ArrowLeft,
  ExternalLink,
  Info,
  Layers,
  Wrench,
  Radio,
  Sparkles,
  BarChart3,
  MessageCircle,
  Linkedin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { 
  PLANT_ASSETS, 
  PlantAssetConfig, 
  MaintenanceStrategy, 
  SIMULATION_CONSTANTS, 
  GameState, 
  AssetState, 
  TurnHistoryRecord 
} from '../../data/uptimeTycoonData';
import { trackGameCompleted, trackResultShared, trackStreakExtended } from '../../utils/analytics';
import { getPlayerProfile } from '../../utils/playStorage';

const STORAGE_KEY = 'rt_uptime_tycoon_save_v1';

// Initial state builder
function createInitialGameState(): GameState {
  const profile = getPlayerProfile();
  const initialAssets: Record<string, AssetState> = {};

  PLANT_ASSETS.forEach(asset => {
    initialAssets[asset.id] = {
      id: asset.id,
      strategy: 'RTF', // Default to Run to Failure
      operatingHours: asset.initialAgeHours,
      hasPdmSensor: false,
      hasRedesign: false,
      status: 'healthy',
      pmTimerMonths: 0,
      totalBreakdowns: 0,
      totalDowntimeHours: 0,
      totalMaintenanceCost: 0
    };
  });

  return {
    currentMonth: 1,
    cashBalance: SIMULATION_CONSTANTS.INITIAL_CASH_BALANCE,
    cumulativeProfit: 0,
    plantName: `${profile.name || 'Apex'} Industrial Processing Facility`,
    isGameOver: false,
    assets: initialAssets,
    history: [],
    pendingPfWarnings: []
  };
}

const UptimeTycoon: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Could not restore game state', e);
      }
    }
    return createInitialGameState();
  });

  const [activeTab, setActiveTab] = useState<'fleet' | 'dashboard' | 'finance'>('fleet');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [selectedAssetForInfo, setSelectedAssetForInfo] = useState<PlantAssetConfig | null>(null);
  const [turnToast, setTurnToast] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const certCanvasRef = useRef<HTMLCanvasElement>(null);
  const [certDataUrl, setCertDataUrl] = useState<string | null>(null);

  // Auto-save state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      } catch (e) {
        console.warn('Failed to save game state', e);
      }
    }
  }, [gameState]);

  // Trigger Toast
  const notify = (msg: string) => {
    setTurnToast(msg);
    setTimeout(() => setTurnToast(null), 3500);
  };

  // Strategy change handler
  const handleStrategyChange = (assetId: string, newStrategy: MaintenanceStrategy) => {
    if (gameState.isGameOver) return;
    const assetCfg = PLANT_ASSETS.find(a => a.id === assetId);
    if (!assetCfg) return;

    setGameState(prev => {
      const current = prev.assets[assetId];
      let newCash = prev.cashBalance;
      let hasPdm = current.hasPdmSensor;
      let hasRedesign = current.hasRedesign;

      // Purchasing PdM sensor if not already owned
      if (newStrategy === 'PDM' && !hasPdm) {
        if (newCash < assetCfg.pdmSensorCapEx) {
          notify(`Insufficient cash ($${newCash.toLocaleString()}) for PdM Sensor ($${assetCfg.pdmSensorCapEx.toLocaleString()})!`);
          return prev;
        }
        newCash -= assetCfg.pdmSensorCapEx;
        hasPdm = true;
        notify(`Purchased PdM Telemetry Sensors for ${assetCfg.name} (-$${assetCfg.pdmSensorCapEx.toLocaleString()})`);
      }

      // Purchasing Engineering Redesign if not already upgraded
      if (newStrategy === 'REDESIGN' && !hasRedesign) {
        if (newCash < assetCfg.redesignCapEx) {
          notify(`Insufficient cash for Engineering Redesign ($${assetCfg.redesignCapEx.toLocaleString()})!`);
          return prev;
        }
        newCash -= assetCfg.redesignCapEx;
        hasRedesign = true;
        notify(`Commissioned Engineering Redesign for ${assetCfg.name} (-$${assetCfg.redesignCapEx.toLocaleString()})`);
      }

      return {
        ...prev,
        cashBalance: newCash,
        assets: {
          ...prev.assets,
          [assetId]: {
            ...current,
            strategy: newStrategy,
            hasPdmSensor: hasPdm,
            hasRedesign: hasRedesign,
            pmTimerMonths: 0
          }
        }
      };
    });
  };

  // Resolve P-F Warning (Planned early intervention before catastrophic breakdown)
  const handleResolvePfWarning = (assetId: string, scheduleIntervention: boolean) => {
    const assetCfg = PLANT_ASSETS.find(a => a.id === assetId);
    if (!assetCfg) return;

    setGameState(prev => {
      const current = prev.assets[assetId];
      const pending = prev.pendingPfWarnings.filter(w => w.assetId !== assetId);

      if (scheduleIntervention) {
        const cost = assetCfg.pdmPlannedInterventionCost;
        const downtime = assetCfg.pdmPlannedDowntimeHours;

        notify(`Planned PdM Intervention completed on ${assetCfg.name}! Catastrophic failure prevented.`);

        return {
          ...prev,
          cashBalance: prev.cashBalance - cost,
          pendingPfWarnings: pending,
          assets: {
            ...prev.assets,
            [assetId]: {
              ...current,
              status: 'maintained',
              operatingHours: Math.round(current.operatingHours * 0.2), // Rejuvenate
              totalMaintenanceCost: current.totalMaintenanceCost + cost,
              totalDowntimeHours: current.totalDowntimeHours + downtime
            }
          }
        };
      } else {
        notify(`P-F Warning deferred for ${assetCfg.name}. High risk of catastrophic seizure!`);
        return {
          ...prev,
          pendingPfWarnings: pending
        };
      }
    });
  };

  // Monte-Carlo Turn Engine: Advances 1 Month (720 operating hours)
  const handleSimulateTurn = () => {
    if (gameState.isGameOver || isSimulating) return;
    setIsSimulating(true);

    setTimeout(() => {
      setGameState(prev => {
        const currentMonth = prev.currentMonth;
        const updatedAssets = { ...prev.assets };
        const newBreakdowns: { assetName: string; cost: number; downtimeHours: number }[] = [];
        const newPfWarnings: { assetId: string; assetName: string; cost: number; downtimeHours: number }[] = [];

        let totalTurnDowntime = 0;
        let totalTurnMaintCost = 0;
        let totalTurnDowntimeLoss = 0;

        // Process each of the 10 assets
        PLANT_ASSETS.forEach(assetCfg => {
          const state = { ...updatedAssets[assetCfg.id] };
          const dt = SIMULATION_CONSTANTS.HOURS_PER_MONTH;
          const currentAge = state.operatingHours;

          // Effective beta and eta (modified if redesigned)
          const effBeta = state.hasRedesign ? assetCfg.upgradedBeta : assetCfg.beta;
          const effEta = state.hasRedesign ? assetCfg.upgradedEta : assetCfg.eta;

          // Calculate conditional Weibull probability of failure in [t, t + dt]
          // P(fail | T > t) = 1 - exp(-((t + dt)/eta)^beta + (t/eta)^beta)
          const hazardTerm = Math.pow((currentAge + dt) / effEta, effBeta) - Math.pow(currentAge / effEta, effBeta);
          const failureProb = 1 - Math.exp(-Math.max(0, hazardTerm));

          const randomRoll = Math.random();
          let isDownThisTurn = false;
          state.status = 'healthy';

          // 1. Time-Based PM Check
          if (state.strategy === 'PM') {
            state.pmTimerMonths += 1;
            if (state.pmTimerMonths >= assetCfg.pmIntervalMonths) {
              // Execute scheduled PM
              const pmCost = assetCfg.pmCost;
              const pmDowntime = assetCfg.pmDowntimeHours;
              totalTurnMaintCost += pmCost;
              totalTurnDowntime += pmDowntime;
              totalTurnDowntimeLoss += pmDowntime * assetCfg.hourlyDowntimeCost;

              state.totalMaintenanceCost += pmCost;
              state.totalDowntimeHours += pmDowntime;
              state.operatingHours = Math.round(state.operatingHours * 0.15); // PM overhaul rejuvenation
              state.pmTimerMonths = 0;
              state.status = 'maintained';

              // If asset has Infant Mortality (beta < 1), 18% chance of intrusive PM inducing early failure!
              if (effBeta < 1.0 && Math.random() < 0.18) {
                const inducedCost = assetCfg.catastrophicRepairCost * 0.5;
                const inducedDt = 8;
                totalTurnMaintCost += inducedCost;
                totalTurnDowntime += inducedDt;
                state.totalBreakdowns += 1;
                newBreakdowns.push({
                  assetName: `${assetCfg.name} (PM-Induced Infant Defect)`,
                  cost: inducedCost,
                  downtimeHours: inducedDt
                });
              }
            }
          }

          // 2. Predictive Maintenance Telemetry Fee
          if (state.strategy === 'PDM') {
            totalTurnMaintCost += assetCfg.pdmMonthlyFee;
            state.totalMaintenanceCost += assetCfg.pdmMonthlyFee;
          }

          // 3. Monte Carlo Failure Check
          if (randomRoll < failureProb) {
            // Failure condition reached!
            if (state.strategy === 'PDM') {
              // PdM sensors detect anomalous P-F degradation with 92% sensitivity
              if (Math.random() < 0.92) {
                state.status = 'pf_warning';
                newPfWarnings.push({
                  assetId: assetCfg.id,
                  assetName: assetCfg.name,
                  cost: assetCfg.pdmPlannedInterventionCost,
                  downtimeHours: assetCfg.pdmPlannedDowntimeHours
                });
              } else {
                // Sensor miss (8% probability) -> Catastrophic breakdown
                isDownThisTurn = true;
              }
            } else {
              // RTF or uninspected failure -> Catastrophic Breakdown!
              isDownThisTurn = true;
            }
          }

          // Handle Catastrophic Breakdown if triggered
          if (isDownThisTurn) {
            const repairCost = assetCfg.catastrophicRepairCost;
            const downHours = assetCfg.catastrophicDowntimeHours;
            const downLoss = downHours * assetCfg.hourlyDowntimeCost;

            totalTurnMaintCost += repairCost;
            totalTurnDowntime += downHours;
            totalTurnDowntimeLoss += downLoss;

            state.status = 'breakdown';
            state.totalBreakdowns += 1;
            state.totalDowntimeHours += downHours;
            state.totalMaintenanceCost += repairCost;
            state.operatingHours = 0; // Reset after full overhaul

            newBreakdowns.push({
              assetName: assetCfg.name,
              cost: repairCost,
              downtimeHours: downHours
            });
          } else if (state.status !== 'maintained') {
            state.operatingHours += dt;
          }

          updatedAssets[assetCfg.id] = state;
        });

        // Financial & KPI Calculations for this Month
        const totalPlantHours = SIMULATION_CONSTANTS.HOURS_PER_MONTH * PLANT_ASSETS.length; // 7,200 hrs
        const plantAvailability = Math.max(0, Math.min(100, Number(((totalPlantHours - totalTurnDowntime) / totalPlantHours * 100).toFixed(2))));
        const plantOee = Number((plantAvailability * 0.96 * 0.98).toFixed(1)); // factoring speed & quality

        const grossRevenue = Math.round(SIMULATION_CONSTANTS.BASE_MONTHLY_REVENUE * (plantAvailability / 100));
        const netProfitThisMonth = grossRevenue - totalTurnMaintCost - totalTurnDowntimeLoss - SIMULATION_CONSTANTS.FIXED_OVERHEAD_PER_MONTH;
        const newCumulativeProfit = prev.cumulativeProfit + netProfitThisMonth;
        const newCash = prev.cashBalance + netProfitThisMonth;

        const nextMonth = currentMonth + 1;
        const isFinished = nextMonth > SIMULATION_CONSTANTS.TOTAL_MONTHS;

        const historyRecord: TurnHistoryRecord = {
          month: currentMonth,
          revenue: grossRevenue,
          maintenanceCost: totalTurnMaintCost,
          downtimeLoss: totalTurnDowntimeLoss,
          netProfit: netProfitThisMonth,
          cumulativeProfit: newCumulativeProfit,
          availability: plantAvailability,
          oee: plantOee,
          breakdownEvents: newBreakdowns,
          pfAlertEvents: newPfWarnings.map(w => ({ assetName: w.assetName, resolved: false }))
        };

        if (isFinished) {
          trackGameCompleted('uptime_tycoon', newCumulativeProfit, {
            finalAvailability: plantAvailability,
            finalOee: plantOee
          });
          trackStreakExtended(2, 'uptime_tycoon');
        }

        if (newBreakdowns.length > 0) {
          notify(`⚠️ Month ${currentMonth}: ${newBreakdowns.length} catastrophic breakdown(s) occurred! Total loss: $${(totalTurnMaintCost + totalTurnDowntimeLoss).toLocaleString()}`);
        } else if (newPfWarnings.length > 0) {
          notify(`🔔 Month ${currentMonth}: ${newPfWarnings.length} P-F Warning(s) detected by PdM sensors!`);
        } else {
          notify(`✅ Month ${currentMonth} completed smoothly. Net profit: +$${netProfitThisMonth.toLocaleString()}`);
        }

        return {
          ...prev,
          currentMonth: Math.min(SIMULATION_CONSTANTS.TOTAL_MONTHS, nextMonth),
          cashBalance: newCash,
          cumulativeProfit: newCumulativeProfit,
          isGameOver: isFinished,
          assets: updatedAssets,
          history: [...prev.history, historyRecord],
          pendingPfWarnings: [...prev.pendingPfWarnings, ...newPfWarnings]
        };
      });

      setIsSimulating(false);
    }, 400);
  };

  // Reset / New Simulation
  const handleResetGame = () => {
    if (window.confirm('Reset plant simulation to Month 1 with a fresh initial state?')) {
      const fresh = createInitialGameState();
      setGameState(fresh);
      setCertDataUrl(null);
      notify('Simulation reset to Month 1.');
    }
  };

  // Determine Performance Grade
  const getPerformanceGrade = () => {
    const profit = gameState.cumulativeProfit;
    const avgAvail = gameState.history.length > 0
      ? gameState.history.reduce((a, b) => a + b.availability, 0) / gameState.history.length
      : 95;

    if (profit >= 1800000 && avgAvail >= 95) {
      return { tier: 'S-Tier', title: 'World-Class Uptime Tycoon 👑', color: 'text-amber-400', badge: 'bg-amber-500/20 border-amber-500' };
    }
    if (profit >= 1300000 && avgAvail >= 92) {
      return { tier: 'A-Tier', title: 'Reliability Engineering Master 🥈', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500' };
    }
    if (profit >= 800000 && avgAvail >= 87) {
      return { tier: 'B-Tier', title: 'Competent Plant Manager 🥉', color: 'text-cyan-400', badge: 'bg-cyan-500/20 border-cyan-500' };
    }
    if (profit >= 200000) {
      return { tier: 'C-Tier', title: 'Reactive Firefighter 🚒', color: 'text-orange-400', badge: 'bg-orange-500/20 border-orange-500' };
    }
    return { tier: 'F-Tier', title: 'Plant Bankruptcy / Critical Outage ⚠️', color: 'text-rose-400', badge: 'bg-rose-500/20 border-rose-500' };
  };

  // Generate 1200x630 Certificate Card on Canvas
  const generateCertificateCard = () => {
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Dark slate background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Glowing radial accents
    const glow = ctx.createRadialGradient(1050, 120, 10, 1050, 120, 500);
    glow.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
    glow.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);

    // Outer border & corner accents
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 550);

    // Title & Logo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Inter", system-ui, sans-serif';
    ctx.fillText('Reliability', 70, 95);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('Tools', 215, 95);
    ctx.fillStyle = '#64748b';
    ctx.font = 'normal 18px "Inter", system-ui, sans-serif';
    ctx.fillText('.co.in  •  OFFICIAL CERTIFICATE OF PERFORMANCE', 295, 95);

    // Main Heading
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 44px "Inter", system-ui, sans-serif';
    ctx.fillText('UPTIME TYCOON SIMULATION', 70, 165);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Inter", system-ui, sans-serif';
    ctx.fillText(`Presented to: ${gameState.plantName}`, 70, 200);

    // Performance Grade Card
    const grade = getPerformanceGrade();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.fillRect(70, 230, 1060, 220);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.strokeRect(70, 230, 1060, 220);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px "Inter", system-ui, sans-serif';
    ctx.fillText(`ACHIEVEMENT RANK: ${grade.tier} (${grade.title})`, 100, 280);

    const avgAvail = gameState.history.length > 0
      ? (gameState.history.reduce((a, b) => a + b.availability, 0) / gameState.history.length).toFixed(1)
      : '95.0';

    const avgOee = gameState.history.length > 0
      ? (gameState.history.reduce((a, b) => a + b.oee, 0) / gameState.history.length).toFixed(1)
      : '88.5';

    ctx.fillStyle = '#ffffff';
    ctx.font = 'normal 18px "Inter", system-ui, sans-serif';
    ctx.fillText(`Cumulative Profit: $${gameState.cumulativeProfit.toLocaleString()}`, 100, 330);
    ctx.fillText(`Average Plant Availability: ${avgAvail}%`, 100, 370);
    ctx.fillText(`Overall Equipment Effectiveness (OEE): ${avgOee}%`, 100, 410);

    ctx.fillText(`Evaluation Period: 24 Months (17,280 Operational Hours)`, 620, 330);
    ctx.fillText(`Asset Fleet Size: 10 Industrial Continuous Production Units`, 620, 370);
    ctx.fillText(`Weibull Monte-Carlo Verification: IEEE / ISO 14224 Models`, 620, 410);

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = 'normal 14px "Inter", system-ui, sans-serif';
    ctx.fillText(`Generated: ${new Date().toLocaleDateString()} • Verified on ReliabilityTools.co.in/play/uptime-tycoon/`, 70, 545);

    const dataUrl = canvas.toDataURL('image/png');
    setCertDataUrl(dataUrl);
  };

  useEffect(() => {
    if (gameState.isGameOver) {
      setTimeout(generateCertificateCard, 300);
    }
  }, [gameState.isGameOver]);

  const latestHistory = gameState.history[gameState.history.length - 1];
  const currentAvailability = latestHistory ? latestHistory.availability : 100;
  const currentOee = latestHistory ? latestHistory.oee : 94.1;

  const shareText = `🏭 Uptime Tycoon Simulation: Finished 24 Months!\n` +
    `Plant: ${gameState.plantName}\n` +
    `Grade: ${getPerformanceGrade().tier} (${getPerformanceGrade().title})\n` +
    `Cumulative Profit: $${gameState.cumulativeProfit.toLocaleString()}\n` +
    `Availability: ${currentAvailability}%\n` +
    `Play: https://reliabilitytools.co.in/play/uptime-tycoon/`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      trackResultShared('copy_uptime_tycoon', 'Uptime Tycoon');
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <SEO 
        title="Uptime Tycoon - Industrial Plant Reliability Simulation Game | Reliability Tools"
        description="Manage 10 industrial plant assets across 24 monthly turns. Choose between RTF, Time-Based PM, PdM with P-F warnings, and Redesign using Monte-Carlo Weibull physics."
        canonicalUrl="https://reliabilitytools.co.in/play/uptime-tycoon/"
      />

      {/* Hidden Certificate Canvas */}
      <canvas ref={certCanvasRef} className="hidden" />

      {/* Floating Turn Toast Notification */}
      {turnToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-cyan-500/40 text-xs font-bold animate-fadeIn">
          {turnToast}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/play" 
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-cyan-500 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏭</span>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                UPTIME TYCOON
              </h1>
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-full text-[10px] font-black uppercase">
                Plant Simulator
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage 10 industrial continuous assets through 24 monthly operational cycles.
            </p>
          </div>
        </div>

        {/* Turn Progression Bar & CTA Button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Simulation Horizon
            </span>
            <div className="text-sm font-black text-slate-900 dark:text-white font-mono">
              Month {gameState.currentMonth} <span className="text-slate-400">/ {SIMULATION_CONSTANTS.TOTAL_MONTHS}</span>
            </div>
          </div>

          {!gameState.isGameOver ? (
            <button
              onClick={handleSimulateTurn}
              disabled={isSimulating}
              className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-2xl transition-all shadow-md hover:shadow-cyan-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>{isSimulating ? 'Simulating Physics...' : `Simulate Month ${gameState.currentMonth}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="px-4 py-2 bg-amber-500/20 text-amber-500 border border-amber-500/40 rounded-2xl text-xs font-black">
              Simulation Completed
            </div>
          )}

          <button
            onClick={handleResetGame}
            className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Reset Simulation to Month 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Dashboard Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plant Availability</span>
          <div className="text-2xl font-black text-emerald-500 font-mono mt-1">
            {currentAvailability}%
          </div>
          <span className="text-[10px] text-slate-400">Uptime vs Scheduled</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plant OEE</span>
          <div className="text-2xl font-black text-cyan-500 font-mono mt-1">
            {currentOee}%
          </div>
          <span className="text-[10px] text-slate-400">Avail × Perf × Qual</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cash Balance</span>
          <div className={`text-2xl font-black font-mono mt-1 ${gameState.cashBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
            ${Math.round(gameState.cashBalance).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Operating Liquidity</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cumulative Profit</span>
          <div className={`text-2xl font-black font-mono mt-1 ${gameState.cumulativeProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            ${Math.round(gameState.cumulativeProfit).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Net after downtime & PM</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Fleet</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            10 <span className="text-xs text-slate-400 font-normal">Units</span>
          </div>
          <span className="text-[10px] text-slate-400">720 hrs/month operating</span>
        </div>
      </div>

      {/* P-F WARNING INTERACTIVE RESOLVER BANNER */}
      {gameState.pendingPfWarnings.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-amber-950/40 border-2 border-amber-500/60 rounded-3xl space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-black">
            <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
            <span>CRITICAL P-F WARNINGS DETECTED BY CONDITION MONITORING (PdM)</span>
          </div>
          <p className="text-xs text-amber-200 leading-relaxed">
            Predictive sensors detected anomalous sub-surface degradation in the P-F interval! You can perform a planned component rebuild now for a fraction of the downtime and emergency replacement cost:
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {gameState.pendingPfWarnings.map(warning => (
              <div 
                key={warning.assetId} 
                className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl flex flex-col justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-black text-white">{warning.assetName}</h4>
                  <div className="text-[11px] text-slate-300 mt-1">
                    Planned Intervention: <strong>${warning.cost.toLocaleString()}</strong> ({warning.downtimeHours}h downtime)
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolvePfWarning(warning.assetId, true)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-colors"
                  >
                    Schedule Planned Rebuild
                  </button>
                  <button
                    onClick={() => handleResolvePfWarning(warning.assetId, false)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    Defer (Risk Failure)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-xl transition-colors ${activeTab === 'fleet' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Fleet Strategy Manager (10 Assets)
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Performance Trends & Breakdown Log
        </button>
      </div>

      {/* TAB 1: FLEET STRATEGY MANAGER */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {PLANT_ASSETS.map(asset => {
              const state = gameState.assets[asset.id];
              let statusBadge = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
              let statusText = 'Normal Running';

              if (state.status === 'breakdown') {
                statusBadge = 'bg-rose-500/20 text-rose-500 border-rose-500/40 animate-pulse';
                statusText = 'Unscheduled Breakdown!';
              } else if (state.status === 'pf_warning') {
                statusBadge = 'bg-amber-500/20 text-amber-500 border-amber-500/40 animate-pulse';
                statusText = 'P-F Degradation Alert';
              } else if (state.status === 'maintained') {
                statusBadge = 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30';
                statusText = 'Recent PM Performed';
              }

              return (
                <div 
                  key={asset.id} 
                  className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {asset.category} • {asset.criticality}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                        {statusText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{asset.name}</h3>
                      <button 
                        onClick={() => setSelectedAssetForInfo(asset)}
                        className="text-slate-400 hover:text-cyan-500 p-1"
                        title="View Asset Details & Engineering Specs"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {asset.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Operating Age</span>
                        <strong className="font-mono">{state.operatingHours.toLocaleString()}h</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Downtime Cost</span>
                        <strong className="font-mono text-rose-500">${asset.hourlyDowntimeCost}/h</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Breakdowns</span>
                        <strong className="font-mono text-amber-500">{state.totalBreakdowns}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Strategy Choice Selector */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-400 uppercase tracking-wide">Selected Strategy:</span>
                      <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400">
                        {state.strategy === 'PM' && `Every ${asset.pmIntervalMonths} mo ($${asset.pmCost.toLocaleString()})`}
                        {state.strategy === 'PDM' && (state.hasPdmSensor ? 'Sensor Active ($' + asset.pdmMonthlyFee + '/mo)' : 'Requires Sensor ($' + asset.pdmSensorCapEx.toLocaleString() + ')')}
                        {state.strategy === 'REDESIGN' && (state.hasRedesign ? 'Upgraded Design Active' : 'Requires CapEx ($' + asset.redesignCapEx.toLocaleString() + ')')}
                        {state.strategy === 'RTF' && 'Zero PM Cost (High Risk)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => handleStrategyChange(asset.id, 'RTF')}
                        className={`py-2 px-1 text-[11px] font-black rounded-xl border transition-all text-center ${
                          state.strategy === 'RTF'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                        title="Run to Failure (RTF): No proactive maintenance. Catastrophic breakdowns occur without warning."
                      >
                        RTF
                      </button>

                      <button
                        onClick={() => handleStrategyChange(asset.id, 'PM')}
                        className={`py-2 px-1 text-[11px] font-black rounded-xl border transition-all text-center ${
                          state.strategy === 'PM'
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                        title={`Time-Based PM: Scheduled overhaul every ${asset.pmIntervalMonths} months ($${asset.pmCost.toLocaleString()}).`}
                      >
                        Time PM
                      </button>

                      <button
                        onClick={() => handleStrategyChange(asset.id, 'PDM')}
                        className={`py-2 px-1 text-[11px] font-black rounded-xl border transition-all text-center ${
                          state.strategy === 'PDM'
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                        title="Condition-Based PdM: Sensors detect P-F degradation before catastrophic failure!"
                      >
                        {state.hasPdmSensor ? 'PdM Active' : 'Buy PdM'}
                      </button>

                      <button
                        onClick={() => handleStrategyChange(asset.id, 'REDESIGN')}
                        className={`py-2 px-1 text-[11px] font-black rounded-xl border transition-all text-center ${
                          state.strategy === 'REDESIGN'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                        title="Engineering Redesign: Substantial CapEx to permanently elevate reliability physics."
                      >
                        {state.hasRedesign ? 'Upgraded' : 'Redesign'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PERFORMANCE TRENDS & BREAKDOWN LOG */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Profit History */}
            <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Cumulative Net Profit Trend ($)
              </h3>
              <div className="h-44 flex items-end gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
                {gameState.history.map(h => {
                  const maxProf = 2000000;
                  const height = Math.max(4, Math.min(100, (h.cumulativeProfit / maxProf) * 100));
                  return (
                    <div key={h.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">
                        M{h.month}: ${Math.round(h.cumulativeProfit).toLocaleString()}
                      </div>
                      <div 
                        className={`w-full rounded-t-sm transition-all ${h.cumulativeProfit >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ height: `${Math.abs(height)}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Month 1</span>
                <span>Month 12</span>
                <span>Month 24</span>
              </div>
            </div>

            {/* Availability History */}
            <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500" /> Monthly Availability Trend (%)
              </h3>
              <div className="h-44 flex items-end gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
                {gameState.history.map(h => {
                  const height = Math.max(5, h.availability);
                  return (
                    <div key={h.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">
                        M{h.month}: {h.availability}%
                      </div>
                      <div 
                        className="w-full bg-cyan-500 rounded-t-sm transition-all"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Month 1</span>
                <span>Target: 95%</span>
                <span>Month 24</span>
              </div>
            </div>
          </div>

          {/* Breakdown Event Log */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Incident & Breakdown History Log
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
              {gameState.history.filter(h => h.breakdownEvents.length > 0).map(h => (
                <div key={h.month} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-rose-500">Month {h.month} Breakdown Incident</span>
                    <span className="text-slate-400 font-mono">{h.availability}% Avail</span>
                  </div>
                  {h.breakdownEvents.map((b, bIdx) => (
                    <div key={bIdx} className="text-slate-600 dark:text-slate-300 text-[11px] flex justify-between">
                      <span>• {b.assetName} (Downtime: {b.downtimeHours} hrs)</span>
                      <strong className="text-rose-500">-${b.cost.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              ))}
              {gameState.history.filter(h => h.breakdownEvents.length > 0).length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Zero catastrophic breakdowns recorded yet! Proactive maintenance strategy is working.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MONTH 24 END-OF-GAME COMPREHENSIVE DEBRIEF MODAL */}
      {gameState.isGameOver && (
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-8 border-2 border-cyan-500 shadow-2xl space-y-8 animate-fadeIn">
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                24-Month Management Review
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                {getPerformanceGrade().title}
              </h2>
              <div className="inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-black border bg-slate-900 text-cyan-400 border-cyan-500">
                Final Grade: {getPerformanceGrade().tier}
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
              You navigated 24 months of industrial equipment aging, operational shocks, and maintenance trade-offs. Here is the mathematical debrief revealing the hidden physics of your plant:
            </p>
          </div>

          {/* Performance Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Cumulative Profit</span>
              <div className="text-xl font-black text-emerald-500 font-mono mt-0.5">
                ${Math.round(gameState.cumulativeProfit).toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Final Availability</span>
              <div className="text-xl font-black text-cyan-500 font-mono mt-0.5">
                {currentAvailability}%
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Breakdowns</span>
              <div className="text-xl font-black text-rose-500 font-mono mt-0.5">
                {Object.values(gameState.assets).reduce((a, b) => a + b.totalBreakdowns, 0)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Cash Remaining</span>
              <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                ${Math.round(gameState.cashBalance).toLocaleString()}
              </div>
            </div>
          </div>

          {/* ASSET-BY-ASSET DEBRIEF & WEIBULL PARAMETER REVEAL */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Layers className="w-5 h-5 text-cyan-500" />
              Asset Failure Physics Debrief: True Weibull Parameters Revealed
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              {PLANT_ASSETS.map(asset => {
                const state = gameState.assets[asset.id];
                const matchedIdeal = state.strategy === asset.recommendedStrategy;

                return (
                  <div 
                    key={asset.id}
                    className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white text-xs">{asset.name}</strong>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        matchedIdeal ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {matchedIdeal ? 'Optimal Strategy Chosen' : 'Sub-Optimal Choice'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                      <span>True β = {asset.beta} ({asset.beta < 1 ? 'Infant Mortality' : asset.beta > 2.5 ? 'Rapid Wear' : 'Fatigue / Random'})</span>
                      <span>True η = {asset.eta.toLocaleString()}h</span>
                    </div>

                    <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {asset.debriefAdvice}
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      Your Strategy: <strong className="text-slate-800 dark:text-white">{state.strategy}</strong> • Breakdowns Suffered: <strong className="text-rose-500">{state.totalBreakdowns}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EDUCATIONAL TOOL & ARTICLE LINKS */}
          <div className="p-5 bg-gradient-to-r from-cyan-950/40 to-slate-900 rounded-2xl border border-cyan-800/40 space-y-3">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Deepen Your Reliability Engineering Expertise
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore the real industrial engineering calculators and peer-reviewed guides behind Uptime Tycoon's Monte Carlo physics engine:
            </p>

            <div className="grid sm:grid-cols-3 gap-2 pt-1 text-xs">
              <Link 
                to="/tools/weibull/" 
                className="p-2.5 bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 rounded-xl text-slate-200 font-bold transition-colors flex items-center justify-between"
              >
                <span>Weibull Analysis Tool</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
              <Link 
                to="/tools/optimal-replacement/" 
                className="p-2.5 bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 rounded-xl text-slate-200 font-bold transition-colors flex items-center justify-between"
              >
                <span>Optimal Replacement Age</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
              <Link 
                to="/tools/rcm-decision/" 
                className="p-2.5 bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 rounded-xl text-slate-200 font-bold transition-colors flex items-center justify-between"
              >
                <span>RCM Decision Wizard</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
              <Link 
                to="/tools/oee/" 
                className="p-2.5 bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 rounded-xl text-slate-200 font-bold transition-colors flex items-center justify-between"
              >
                <span>OEE Calculator</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
              <Link 
                to="/tools/downtime-cost/" 
                className="p-2.5 bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 rounded-xl text-slate-200 font-bold transition-colors flex items-center justify-between"
              >
                <span>Downtime Cost Calculator</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
              <Link 
                to="/learning/" 
                className="p-2.5 bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 rounded-xl text-slate-200 font-bold transition-colors flex items-center justify-between"
              >
                <span>Learning Hub Articles</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
            </div>
          </div>

          {/* SHAREABLE CERTIFICATE & SOCIAL INTEGRATION */}
          <div className="space-y-4 text-center">
            {certDataUrl && (
              <div className="max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                <img src={certDataUrl} alt="Uptime Tycoon Certificate" className="w-full h-auto" />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {certDataUrl && (
                <a
                  href={certDataUrl}
                  download="Uptime-Tycoon-Certificate.png"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certificate (PNG)</span>
                </a>
              )}

              <button
                onClick={copyShare}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedShare ? 'Copied Summary!' : 'Copy Result'}</span>
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
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://reliabilitytools.co.in/play/uptime-tycoon/')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <button
                onClick={handleResetGame}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Start New Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSET DETAILS MODAL */}
      {selectedAssetForInfo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedAssetForInfo(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {selectedAssetForInfo.category} • {selectedAssetForInfo.criticality}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedAssetForInfo.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAssetForInfo(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedAssetForInfo.description}
            </p>

            <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400">Hourly Downtime Penalty:</span>
                <strong className="text-rose-500 font-mono">${selectedAssetForInfo.hourlyDowntimeCost}/hr</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400">Catastrophic Failure Repair:</span>
                <strong className="text-slate-800 dark:text-white font-mono">${selectedAssetForInfo.catastrophicRepairCost.toLocaleString()} ({selectedAssetForInfo.catastrophicDowntimeHours}h MTTR)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400">Time-Based PM Cycle:</span>
                <strong className="text-amber-500 font-mono">${selectedAssetForInfo.pmCost.toLocaleString()} every {selectedAssetForInfo.pmIntervalMonths} mo</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400">PdM Sensor Package:</span>
                <strong className="text-cyan-500 font-mono">${selectedAssetForInfo.pdmSensorCapEx.toLocaleString()} CapEx + ${selectedAssetForInfo.pdmMonthlyFee}/mo</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Engineering Redesign:</span>
                <strong className="text-purple-500 font-mono">${selectedAssetForInfo.redesignCapEx.toLocaleString()} CapEx</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedAssetForInfo(null)}
              className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl"
            >
              Close Specifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UptimeTycoon;
