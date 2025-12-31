
import { WeibullDataPoint, WeibullResult } from '../types';

// Simple linear regression for Weibull parameter estimation (Rank Regression)
export const calculateWeibull = (times: number[]): WeibullResult => {
  const sortedTimes = [...times].sort((a, b) => a - b);
  const n = sortedTimes.length;
  
  const points: WeibullDataPoint[] = [];
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  let sumYY = 0; // Added for R-Squared calculation

  for (let i = 0; i < n; i++) {
    const rank = i + 1;
    // Benard's Approximation for Median Ranks (Standard Industry Method)
    const medianRank = (rank - 0.3) / (n + 0.4);
    const t = sortedTimes[i];
    if (t <= 0) continue;

    const x = Math.log(t); // ln(t)
    const y = Math.log(-Math.log(1 - medianRank)); // ln(-ln(1-R))

    points.push({ time: t, rank, medianRank });

    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  const count = points.length;
  if (count < 2) {
    return { beta: 0, eta: 0, rSquared: 0, points, linePoints: [], b10: 0 };
  }

  // Calculate Slope (Beta) and Intercept using Least Squares method
  const beta = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
  const intercept = (sumY - beta * sumX) / count;
  
  // Calculate Eta (Scale)
  // Intercept = -beta * ln(eta)  =>  ln(eta) = -Intercept/beta  => eta = exp(-Intercept/beta)
  const eta = Math.exp(-intercept / beta);
  
  // Calculate actual R-Squared (Coefficient of Determination)
  // Formula: (n*sumXY - sumX*sumY)^2 / ((n*sumXX - sumX^2)(n*sumYY - sumY^2))
  const numerator = (count * sumXY - sumX * sumY);
  const denominator = Math.sqrt((count * sumXX - sumX * sumX) * (count * sumYY - sumY * sumY));
  const rSquared = denominator !== 0 ? Math.pow(numerator / denominator, 2) : 0;

  // B10 Life Calculation: Time at which 10% of population fails (Reliability = 90%)
  // Formula: Eta * (-ln(0.9))^(1/Beta)
  const b10 = eta * Math.pow(-Math.log(0.9), 1 / beta);

  // Generate Regression Line points for plotting (Probability Plot)
  const minTime = points[0].time;
  const maxTime = points[points.length - 1].time;
  
  // We plot the line from slightly before min to slightly after max
  const startT = minTime * 0.5;
  const endT = maxTime * 1.5;

  const linePoints = [
    { time: startT, medianRank: 1 - Math.exp(-Math.pow(startT/eta, beta)) },
    { time: endT, medianRank: 1 - Math.exp(-Math.pow(endT/eta, beta)) }
  ];

  return { beta, eta, rSquared, points, linePoints, b10 };
};

// Generate data points for PDF, CDF, Reliability, and Hazard curves
export const generateWeibullCurves = (beta: number, eta: number, maxTime: number) => {
  const data = [];
  const steps = 100; // Increased resolution for smoother curves
  const stepSize = maxTime / steps;

  for (let i = 0; i <= steps; i++) {
    const t = i * stepSize;
    if (t === 0) {
      data.push({ t, pdf: 0, cdf: 0, reliability: 1, hazard: 0 });
      continue;
    }

    // Reliability R(t) = e^(-(t/eta)^beta)
    const reliability = Math.exp(-Math.pow(t / eta, beta));
    
    // CDF F(t) = 1 - R(t)
    const cdf = 1 - reliability;
    
    // PDF f(t) = (beta/eta) * (t/eta)^(beta-1) * e^(-(t/eta)^beta)
    const pdf = (beta / eta) * Math.pow(t / eta, beta - 1) * reliability;

    // Hazard Function h(t) = f(t) / R(t) = (beta/eta) * (t/eta)^(beta-1)
    const hazard = (beta / eta) * Math.pow(t / eta, beta - 1);

    data.push({
      t,
      pdf,
      cdf,
      reliability,
      hazard
    });
  }
  return data;
};

export const calculateMTBF = (totalTime: number, failures: number): number => {
  if (failures === 0) return totalTime; 
  return totalTime / failures;
};

export const calculateMTTR = (totalDowntime: number, repairs: number): number => {
  if (repairs === 0) return 0;
  return totalDowntime / repairs;
};

export const calculateAvailability = (mtbf: number, mttr: number): number => {
  if (mtbf + mttr === 0) return 0;
  // Inherent Availability (Ai) = MTBF / (MTBF + MTTR)
  return (mtbf / (mtbf + mttr)) * 100;
};

export const calculateParallelReliability = (reliabilities: number[]): number => {
  // R_parallel = 1 - product(1 - R_i)
  const unreliabilityProduct = reliabilities.reduce((acc, r) => acc * (1 - r), 1);
  return 1 - unreliabilityProduct;
};

export const calculateSeriesReliability = (reliabilities: number[]): number => {
  // R_series = product(R_i)
  return reliabilities.reduce((acc, r) => acc * r, 1);
};

export const calculateSpareParts = (
  mtbf: number, 
  annualUsageHours: number, 
  quantityInstalled: number, 
  leadTimeDays: number, 
  serviceLevelZ: number
) => {
  const lambda = 1 / mtbf;
  const annualDemand = lambda * annualUsageHours * quantityInstalled;
  
  const leadTimeYears = leadTimeDays / 365;
  const leadTimeDemand = annualDemand * leadTimeYears;
  
  // Safety Stock formula for variable demand with constant lead time (Poisson approximation)
  // SS = Z * sqrt(Lead Time Demand)
  const safetyStock = serviceLevelZ * Math.sqrt(leadTimeDemand);
  
  const reorderPoint = leadTimeDemand + safetyStock;
  
  return {
    annualDemand,
    leadTimeDemand,
    safetyStock: Math.ceil(safetyStock),
    reorderPoint: Math.ceil(reorderPoint)
  };
};

export const calculatePoissonDistribution = (lambda: number, maxK: number = 6) => {
  const data = [];
  let factorial = 1;
  for (let k = 0; k <= maxK; k++) {
    if (k > 0) factorial *= k;
    const probability = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial;
    data.push({ k, probability, percentage: probability * 100 });
  }
  return data;
};

export const calculateOEE = (
  shiftLengthMin: number,
  breaksMin: number,
  downtimeMin: number,
  idealCycleTimeSec: number,
  totalCount: number,
  rejectCount: number
) => {
  const plannedProductionTime = shiftLengthMin - breaksMin;
  const operatingTime = plannedProductionTime - downtimeMin;
  
  if (plannedProductionTime <= 0) return { availability: 0, performance: 0, quality: 0, oee: 0 };

  // Availability = Operating Time / Planned Production Time
  const availability = operatingTime / plannedProductionTime;

  // Performance: (Total Count * Ideal Cycle Time) / Operating Time
  // Convert Operating Time to seconds for calculation to match cycle time unit
  const operatingTimeSec = operatingTime * 60;
  
  // Standard OEE Performance calculation: (Total Count / Run Time) / Ideal Run Rate
  // Which simplifies to: (Total Count * Ideal Cycle Time) / Run Time
  const performance = operatingTimeSec > 0 ? (totalCount * idealCycleTimeSec) / operatingTimeSec : 0;

  const goodCount = totalCount - rejectCount;
  const quality = totalCount > 0 ? goodCount / totalCount : 0;

  const oee = availability * performance * quality;

  return {
    availability: Math.min(Math.max(availability, 0), 1), 
    performance: Math.min(Math.max(performance, 0), 1.5), // Performance can exceed 100% if ideal cycle time is set conservatively
    quality: Math.min(Math.max(quality, 0), 1),
    oee: Math.min(Math.max(oee, 0), 1.5)
  };
};

export const calculateLCC = (
  initialCost: number,
  annualEnergy: number,
  annualMaintenance: number,
  years: number,
  residualValue: number = 0,
  discountRatePct: number = 0
) => {
  if (discountRatePct === 0) {
    const totalOpex = (annualEnergy + annualMaintenance) * years;
    return initialCost + totalOpex - residualValue;
  }

  // Calculate NPV (Net Present Value) of costs
  // Formula: Sum(Cost / (1 + r)^t)
  const rate = discountRatePct / 100;
  let npvOpex = 0;
  
  for (let t = 1; t <= years; t++) {
    const annualCost = annualEnergy + annualMaintenance;
    npvOpex += annualCost / Math.pow(1 + rate, t);
  }

  // Discount the residual value back to present
  const pvResidual = residualValue / Math.pow(1 + rate, years);
  
  return initialCost + npvOpex - pvResidual;
};

// --- Test Planning Math ---

export const calculateTestTimeForMTBF = (targetMTBF: number, confidenceLevel: number): number => {
  const risk = 1 - confidenceLevel;
  return -targetMTBF * Math.log(risk);
};

export const calculateSuccessRunSampleSize = (targetReliability: number, confidenceLevel: number): number => {
  const risk = 1 - confidenceLevel;
  const lnRisk = Math.log(risk);
  const lnR = Math.log(targetReliability);
  
  if (lnR === 0) return 0;
  return Math.ceil(lnRisk / lnR);
};

// --- New Tools: Optimization & Risk ---

// 1. Economic Order Quantity (EOQ)
export const calculateEOQ = (annualDemand: number, orderingCost: number, holdingCost: number) => {
  if (holdingCost <= 0) return 0;
  return Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
};

// 2. FMEA RPN
export const calculateRPN = (severity: number, occurrence: number, detection: number) => {
  return severity * occurrence * detection;
};

// 3. SIL PFDavg (Simplified IEC 61508 formulas for low demand)
// LambdaDU should be in Failures Per Hour
// Test Interval (TI) in Hours
export const calculateSIL = (lambdaDU: number, testIntervalHours: number, architecture: '1oo1' | '1oo2' | '2oo2' | '2oo3') => {
  const t = testIntervalHours;
  const l = lambdaDU;
  let pfd = 0;

  switch(architecture) {
    case '1oo1':
      pfd = (l * t) / 2;
      break;
    case '1oo2':
      // Simplified: ((l*t)^2)/3
      pfd = (Math.pow(l * t, 2)) / 3;
      break;
    case '2oo2':
      // Simplified: l*t
      pfd = l * t;
      break;
    case '2oo3':
      // Simplified: (l*t)^2
      pfd = Math.pow(l * t, 2);
      break;
  }
  
  // Inverse Risk Reduction Factor
  const rrf = pfd > 0 ? 1 / pfd : 0;
  
  // Determine SIL Level based on PFDavg (Low Demand)
  let silLevel = 0;
  if (pfd >= 1e-5 && pfd < 1e-4) silLevel = 4;
  else if (pfd >= 1e-4 && pfd < 1e-3) silLevel = 3;
  else if (pfd >= 1e-3 && pfd < 1e-2) silLevel = 2;
  else if (pfd >= 1e-2 && pfd < 1e-1) silLevel = 1;

  return { pfd, rrf, silLevel };
};

// 4. Optimal Replacement Age (Weibull based)
// Returns the optimal time T to replace to minimize cost per unit time
export const calculateOptimalReplacementAge = (cp: number, cf: number, beta: number, eta: number) => {
  if (beta <= 1) return null; // No optimal age for random or infant mortality (Run to Failure is best)

  // We need to minimize Cost Rate C(t) = (Cp*R(t) + Cf*F(t)) / ExpectedCycleLength(t)
  // ExpectedCycleLength(t) = Integral(0 to t) of R(x) dx
  
  // Numerical Search
  const maxSearchTime = eta * 3;
  const steps = 500;
  const dt = maxSearchTime / steps;
  
  let bestTime = 0;
  let minCostRate = Infinity;
  let expectedCycleLength = 0; // Cumulative integral

  const results = [];

  for (let i = 1; i <= steps; i++) {
    const t = i * dt;
    const reliability = Math.exp(-Math.pow(t / eta, beta));
    const unreliability = 1 - reliability;
    
    // Trapezoidal rule integration for expected life
    const prevT = (i - 1) * dt;
    const prevReliability = Math.exp(-Math.pow(prevT / eta, beta));
    expectedCycleLength += ((reliability + prevReliability) / 2) * dt;

    const numerator = (cp * reliability) + (cf * unreliability);
    const costRate = numerator / expectedCycleLength;

    results.push({ t, costRate });

    if (costRate < minCostRate) {
      minCostRate = costRate;
      bestTime = t;
    }
  }

  // Also calculate Run-To-Failure Cost Rate (t -> Infinity)
  // Expected Life = Eta * Gamma(1 + 1/beta) approx.
  // Or just integrate far out.
  // RTF Cost Rate = Cf / MTTF
  // Just return the found minimum
  return { optimalTime: bestTime, minCostRate, curve: results };
};

// --- Statistical Functions for Confidence Intervals & K-out-of-N ---

/**
 * Inverse Normal Cumulative Distribution Function (Probit)
 * Acklam's algorithm approximation (standard in most stats packages)
 * Input p: probability (0 < p < 1)
 */
function normInv(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  const a1 = -3.969683028665376e+01;
  const a2 = 2.209460984245205e+02;
  const a3 = -2.759285104469687e+02;
  const a4 = 1.383577518672690e+02;
  const a5 = -3.066479806614716e+01;
  const a6 = 2.506628277459239e+00;

  const b1 = -5.447609879822406e+01;
  const b2 = 1.615858368580409e+02;
  const b3 = -1.556989798598866e+02;
  const b4 = 6.680131188771972e+01;
  const b5 = -1.328068155288572e+01;

  const c1 = -7.784894002430293e-03;
  const c2 = -3.223964580411365e-01;
  const c3 = -2.400758277161838e+00;
  const c4 = -2.549732539343734e+00;
  const c5 = 4.374664141464968e+00;
  const c6 = 2.938163982698783e+00;

  const d1 = 7.784695709041462e-03;
  const d2 = 3.224671290700398e-01;
  const d3 = 2.445134137142996e+00;
  const d4 = 3.754408661907416e+00;

  const p_low = 0.02425;
  const p_high = 1 - p_low;

  let q, r;

  if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
}

/**
 * Inverse Chi-Squared Distribution
 * Uses Wilson-Hilferty approximation.
 * xp approx = v * (1 - 2/(9v) + zp * sqrt(2/(9v)))^3
 * Accurate for df > 10, typically acceptable for engineering > 3.
 * p: probability (area to left), df: degrees of freedom
 */
function chi2Inv(p: number, df: number): number {
  if (df < 1) return 0;
  const zp = normInv(p);
  const term = 1 - (2 / (9 * df)) + (zp * Math.sqrt(2 / (9 * df)));
  return df * Math.pow(term, 3);
}

/**
 * Calculate MTBF Confidence Intervals
 * Based on Chi-Square distribution for Exponential Distribution (Constant Failure Rate)
 * IEC 60605-4
 */
export const calculateMTBFConfidence = (totalTime: number, failures: number, confidenceLevel: number) => {
  // Alpha is the risk. For 90% confidence, alpha = 0.10.
  const alpha = 1 - (confidenceLevel / 100);
  
  // Degrees of Freedom
  // Failure terminated test (Type II censoring) usually assumes 2r degrees of freedom.
  // Note: For Lower Limit, some standards use 2r+2 for time terminated, but 2r is standard for failure terminated.
  // We will assume failure terminated (2r) as it is conservative and standard for "observed failures".
  const df = 2 * failures;

  // If zero failures, we cannot calculate a two-sided interval with this method (division by zero or infinity).
  // Usually, one-sided lower limit is calculated using Chi2(alpha, 2) / 2 = approx 3.0 / 2 = 1.5 factor?
  // Let's handle failures > 0 only for two-sided.
  if (failures === 0) return null;

  // Upper Confidence Limit (of MTBF) uses Lower Chi-Square Value (alpha/2)
  // Lower Confidence Limit (of MTBF) uses Upper Chi-Square Value (1 - alpha/2)
  // Because MTBF is in denominator of Chi-Square formula: Chi2 = 2T / MTBF
  
  const probLower = alpha / 2;
  const probUpper = 1 - (alpha / 2);

  const chi2Lower = chi2Inv(probLower, df);
  const chi2Upper = chi2Inv(probUpper, df);

  const upperMTBF = (2 * totalTime) / chi2Lower;
  const lowerMTBF = (2 * totalTime) / chi2Upper;
  const meanMTBF = totalTime / failures;

  return {
    mean: meanMTBF,
    lower: lowerMTBF,
    upper: upperMTBF,
    df
  };
};

/**
 * K-out-of-N System Reliability
 * R_sys = Sum(i=k to n) of [ nCi * R^i * (1-R)^(n-i) ]
 */
function factorial(n: number): number {
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

export const calculateKOutOfN = (n: number, k: number, reliability: number) => {
  if (n < k) return 0;
  
  let systemReliability = 0;
  
  // Sum binomial probabilities from k successes up to n successes
  for (let i = k; i <= n; i++) {
    const ways = combinations(n, i);
    const prob = ways * Math.pow(reliability, i) * Math.pow(1 - reliability, n - i);
    systemReliability += prob;
  }
  
  return systemReliability;
};
