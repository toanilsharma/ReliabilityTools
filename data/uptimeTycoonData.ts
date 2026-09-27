/**
 * Uptime Tycoon - Industrial Plant Asset Definitions & Simulation Constants
 */

export type MaintenanceStrategy = 'RTF' | 'PM' | 'PDM' | 'REDESIGN';

export interface PlantAssetConfig {
  id: string;
  name: string;
  category: 'Mechanical' | 'Electrical' | 'Rotating' | 'Fluid Power';
  criticality: 'High' | 'Medium' | 'Critical Bottleneck';
  initialAgeHours: number;
  // Hidden Weibull ground truth
  beta: number; // Shape parameter
  eta: number;  // Characteristic life (hours)
  // Financial parameters
  hourlyDowntimeCost: number; // Lost production revenue ($/hr)
  catastrophicRepairCost: number; // Cost of emergency breakdown repair ($)
  catastrophicDowntimeHours: number; // Downtime on catastrophic failure (hrs)
  // Preventive Maintenance (PM)
  pmCost: number; // Cost per PM event ($)
  pmIntervalMonths: number; // e.g. every 3, 6, or 12 months
  pmDowntimeHours: number; // Planned downtime during PM (hrs)
  // Predictive Maintenance (PdM)
  pdmSensorCapEx: number; // One-time sensor hardware + install ($)
  pdmMonthlyFee: number; // Telemetry & cloud diagnostics ($/month)
  pdmPlannedInterventionCost: number; // Cost when repaired on P-F warning ($)
  pdmPlannedDowntimeHours: number; // Downtime when repaired on P-F warning (hrs)
  // Engineering Redesign
  redesignCapEx: number; // One-time redesign upgrade ($)
  upgradedBeta: number; // New beta after redesign
  upgradedEta: number; // New eta after redesign
  // Description & Debrief
  description: string;
  debriefAdvice: string;
  recommendedStrategy: MaintenanceStrategy;
}

export const PLANT_ASSETS: PlantAssetConfig[] = [
  {
    id: 'primary-crusher',
    name: 'Primary Jaw Crusher 400kW',
    category: 'Mechanical',
    criticality: 'Critical Bottleneck',
    initialAgeHours: 3200,
    beta: 2.9, // Steep wear-out on jaw dies & eccentric shaft
    eta: 9500,
    hourlyDowntimeCost: 3200,
    catastrophicRepairCost: 38000,
    catastrophicDowntimeHours: 24,
    pmCost: 5500,
    pmIntervalMonths: 6,
    pmDowntimeHours: 4,
    pdmSensorCapEx: 8500,
    pdmMonthlyFee: 350,
    pdmPlannedInterventionCost: 7500,
    pdmPlannedDowntimeHours: 5,
    redesignCapEx: 48000,
    upgradedBeta: 1.8,
    upgradedEta: 19000,
    description: 'Heavy ore crusher feeding the entire processing plant. Extreme impact forces and abrasive wear.',
    debriefAdvice: 'With β = 2.9 (severe wear-out) and $3,200/hr downtime, Run-to-Failure (RTF) is suicidal. Either Time-Based PM every 6 months or PdM sensor monitoring wins decisively. Redesign pays back within 14 months.',
    recommendedStrategy: 'PDM'
  },
  {
    id: 'boiler-feed-pump',
    name: 'Boiler Feed Pump Train A',
    category: 'Rotating',
    criticality: 'Critical Bottleneck',
    initialAgeHours: 4500,
    beta: 1.7, // Cavitation erosion and mechanical seal wear
    eta: 13500,
    hourlyDowntimeCost: 3500,
    catastrophicRepairCost: 44000,
    catastrophicDowntimeHours: 22,
    pmCost: 7000,
    pmIntervalMonths: 12,
    pmDowntimeHours: 6,
    pdmSensorCapEx: 9500,
    pdmMonthlyFee: 400,
    pdmPlannedInterventionCost: 9000,
    pdmPlannedDowntimeHours: 5,
    redesignCapEx: 58000,
    upgradedBeta: 1.9,
    upgradedEta: 28000,
    description: 'High-pressure multi-stage boiler feed pump. Single point of failure for steam header pressure.',
    debriefAdvice: 'High downtime penalty ($3,500/hr) makes PdM acoustic/vibration sensors the optimal choice. Catching seal weepage in the P-F window saves over $35,000 per breakdown.',
    recommendedStrategy: 'PDM'
  },
  {
    id: 'compressor-train',
    name: 'Centrifugal Air Compressor 250kW',
    category: 'Rotating',
    criticality: 'High',
    initialAgeHours: 2100,
    beta: 1.05, // Near-random exponential failures (intercooler fouling & solenoid drops)
    eta: 16000,
    hourlyDowntimeCost: 1900,
    catastrophicRepairCost: 22000,
    catastrophicDowntimeHours: 14,
    pmCost: 4200,
    pmIntervalMonths: 6,
    pmDowntimeHours: 3,
    pdmSensorCapEx: 6500,
    pdmMonthlyFee: 260,
    pdmPlannedInterventionCost: 5200,
    pdmPlannedDowntimeHours: 4,
    redesignCapEx: 28000,
    upgradedBeta: 1.3,
    upgradedEta: 26000,
    description: 'Supplies dry instrument air across all pneumatic control valves and robotic actuators.',
    debriefAdvice: 'Because β ≈ 1.0, failures are largely RANDOM with a constant hazard rate. Traditional time-based PM delivers minimal reliability gain; PdM oil/differential telemetry or RTF with pre-staged spares is mathematically superior.',
    recommendedStrategy: 'PDM'
  },
  {
    id: 'vfd-control-cabinet',
    name: 'Kiln Drive VFD Inverter Cabinet',
    category: 'Electrical',
    criticality: 'High',
    initialAgeHours: 800,
    beta: 0.68, // Infant Mortality (capacitor burn-in, gate driver solder fatigue, humidity flash)
    eta: 22000,
    hourlyDowntimeCost: 2500,
    catastrophicRepairCost: 19000,
    catastrophicDowntimeHours: 12,
    pmCost: 3200,
    pmIntervalMonths: 6,
    pmDowntimeHours: 2,
    pdmSensorCapEx: 5000,
    pdmMonthlyFee: 200,
    pdmPlannedInterventionCost: 4000,
    pdmPlannedDowntimeHours: 3,
    redesignCapEx: 24000,
    upgradedBeta: 1.4,
    upgradedEta: 32000,
    description: 'Solid-state inverter drive with sensitive DC bus electrolytic capacitors and IGBT modules.',
    debriefAdvice: 'TRAP ASSET! With β = 0.68 (Infant Mortality), frequent time-based PM replacements actually INCREASE failure probability due to maintenance-induced defects. Redesign (positive-pressure HVAC cabinet) or PdM thermography wins.',
    recommendedStrategy: 'REDESIGN'
  },
  {
    id: 'apron-conveyor',
    name: 'Overhead Apron Feeder Conveyor',
    category: 'Mechanical',
    criticality: 'Medium',
    initialAgeHours: 5800,
    beta: 3.5, // Rapid wear-out on link chain bushings and head sprockets
    eta: 10500,
    hourlyDowntimeCost: 1600,
    catastrophicRepairCost: 24000,
    catastrophicDowntimeHours: 18,
    pmCost: 3800,
    pmIntervalMonths: 4,
    pmDowntimeHours: 4,
    pdmSensorCapEx: 6000,
    pdmMonthlyFee: 240,
    pdmPlannedInterventionCost: 4500,
    pdmPlannedDowntimeHours: 4,
    redesignCapEx: 34000,
    upgradedBeta: 2.1,
    upgradedEta: 22000,
    description: 'Heavy steel pan conveyor handling abrasive clinker at 120°C.',
    debriefAdvice: 'With β = 3.5, failure is guaranteed in a tight aging band. Time-based PM overhaul every 4 months is textbook RCM best practice and yields massive savings over emergency chain breakages.',
    recommendedStrategy: 'PM'
  },
  {
    id: 'slurry-pump',
    name: 'Tailings Slurry Recirculation Pump',
    category: 'Fluid Power',
    criticality: 'Medium',
    initialAgeHours: 1600,
    beta: 2.2, // Continuous scouring erosion of impeller vanes
    eta: 8000,
    hourlyDowntimeCost: 1400,
    catastrophicRepairCost: 15000,
    catastrophicDowntimeHours: 16,
    pmCost: 2800,
    pmIntervalMonths: 3,
    pmDowntimeHours: 3,
    pdmSensorCapEx: 5500,
    pdmMonthlyFee: 220,
    pdmPlannedInterventionCost: 3400,
    pdmPlannedDowntimeHours: 3,
    redesignCapEx: 26000,
    upgradedBeta: 1.8,
    upgradedEta: 18000,
    description: 'Pumps 45% solids abrasive quartz slurry. Casing cut-through threatens environmental spill fines.',
    debriefAdvice: 'High wear rate (η = 8,000h). Redesign with high-chrome ceramic inserts or regular 3-month wet-end PM rebuilds drastically curtails emergency cleanup downtime.',
    recommendedStrategy: 'PM'
  },
  {
    id: 'heavy-gearbox',
    name: 'Extruder Drive Heavy Helical Gearbox',
    category: 'Mechanical',
    criticality: 'Critical Bottleneck',
    initialAgeHours: 8500,
    beta: 1.95, // Sub-surface rolling contact fatigue on pinion bearings
    eta: 21000,
    hourlyDowntimeCost: 2900,
    catastrophicRepairCost: 52000,
    catastrophicDowntimeHours: 36,
    pmCost: 8000,
    pmIntervalMonths: 12,
    pmDowntimeHours: 8,
    pdmSensorCapEx: 11000,
    pdmMonthlyFee: 450,
    pdmPlannedInterventionCost: 12000,
    pdmPlannedDowntimeHours: 8,
    redesignCapEx: 62000,
    upgradedBeta: 1.8,
    upgradedEta: 42000,
    description: 'Transfers 1,200kW torque. Replacement gearset has a 6-week factory machining lead time.',
    debriefAdvice: 'Catastrophic downtime is 36 hours ($104,400 production loss!). PdM online oil debris & high-frequency vibration sensors pay for themselves immediately upon detecting first micropitting.',
    recommendedStrategy: 'PDM'
  },
  {
    id: 'cooling-tower-fan',
    name: 'Induced Draft Cooling Fan Unit 3',
    category: 'Rotating',
    criticality: 'Medium',
    initialAgeHours: 3400,
    beta: 1.0, // Random belt snags and external motor winding shorts
    eta: 15500,
    hourlyDowntimeCost: 1100,
    catastrophicRepairCost: 11000,
    catastrophicDowntimeHours: 10,
    pmCost: 2000,
    pmIntervalMonths: 6,
    pmDowntimeHours: 2,
    pdmSensorCapEx: 4000,
    pdmMonthlyFee: 180,
    pdmPlannedInterventionCost: 2600,
    pdmPlannedDowntimeHours: 3,
    redesignCapEx: 17000,
    upgradedBeta: 1.3,
    upgradedEta: 28000,
    description: 'Elevated fiberglass fan blades cooling plant condenser water.',
    debriefAdvice: 'Low consequence and constant hazard rate (β = 1.0). RTF or simple low-cost PdM vibration switch is most economical; expensive PM inspections waste technician bandwidth.',
    recommendedStrategy: 'RTF'
  },
  {
    id: 'hydraulic-hpu',
    name: 'Main Furnace Tilt Hydraulic Unit',
    category: 'Fluid Power',
    criticality: 'High',
    initialAgeHours: 2900,
    beta: 1.75, // Particulate contamination silt-locking servo valves
    eta: 13000,
    hourlyDowntimeCost: 2600,
    catastrophicRepairCost: 28000,
    catastrophicDowntimeHours: 15,
    pmCost: 3800,
    pmIntervalMonths: 6,
    pmDowntimeHours: 3,
    pdmSensorCapEx: 7500,
    pdmMonthlyFee: 280,
    pdmPlannedInterventionCost: 5500,
    pdmPlannedDowntimeHours: 4,
    redesignCapEx: 31000,
    upgradedBeta: 1.6,
    upgradedEta: 27000,
    description: 'High-pressure 280 bar hydraulic system tilting the ladle. Unscheduled freeze risks frozen melt.',
    debriefAdvice: 'Hydraulic systems are sensitive to ISO 4406 fluid cleanliness. Redesign with kidney-loop 3-micron filtration or PdM laser particle counter keeps uptime above 99%.',
    recommendedStrategy: 'REDESIGN'
  },
  {
    id: 'emergency-genset',
    name: 'Black-Start Standby Diesel Generator',
    category: 'Electrical',
    criticality: 'High',
    initialAgeHours: 600,
    beta: 0.88, // Standby dormancy degradation (starter battery decay, gummed fuel rack)
    eta: 17500,
    hourlyDowntimeCost: 3600,
    catastrophicRepairCost: 30000,
    catastrophicDowntimeHours: 18,
    pmCost: 2500,
    pmIntervalMonths: 3,
    pmDowntimeHours: 1,
    pdmSensorCapEx: 5000,
    pdmMonthlyFee: 200,
    pdmPlannedInterventionCost: 4000,
    pdmPlannedDowntimeHours: 2,
    redesignCapEx: 22000,
    upgradedBeta: 1.5,
    upgradedEta: 29000,
    description: 'Emergency emergency generator providing backup power to safety cooling and DCS systems.',
    debriefAdvice: 'Standby assets degrade while idle (β < 1.0). Proof-testing via automated telemetry load tests prevents hidden standby failures on demand.',
    recommendedStrategy: 'PDM'
  }
];

export const SIMULATION_CONSTANTS = {
  TOTAL_MONTHS: 24,
  HOURS_PER_MONTH: 720,
  BASE_MONTHLY_REVENUE: 195000, // at 100% availability
  FIXED_OVERHEAD_PER_MONTH: 22000,
  INITIAL_CASH_BALANCE: 150000
};

export interface AssetState {
  id: string;
  strategy: MaintenanceStrategy;
  operatingHours: number;
  hasPdmSensor: boolean;
  hasRedesign: boolean;
  status: 'healthy' | 'pf_warning' | 'breakdown' | 'maintained';
  pmTimerMonths: number;
  totalBreakdowns: number;
  totalDowntimeHours: number;
  totalMaintenanceCost: number;
  pdmAlertPending?: boolean;
}

export interface TurnHistoryRecord {
  month: number;
  revenue: number;
  maintenanceCost: number;
  downtimeLoss: number;
  netProfit: number;
  cumulativeProfit: number;
  availability: number;
  oee: number;
  breakdownEvents: { assetName: string; cost: number; downtimeHours: number }[];
  pfAlertEvents: { assetName: string; resolved: boolean }[];
}

export interface GameState {
  currentMonth: number; // 1 to 24
  cashBalance: number;
  cumulativeProfit: number;
  plantName: string;
  isGameOver: boolean;
  assets: Record<string, AssetState>;
  history: TurnHistoryRecord[];
  pendingPfWarnings: { assetId: string; assetName: string; cost: number; downtimeHours: number }[];
}
