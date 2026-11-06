/**
 * Programmatic Topic Cluster Data for Industry Solutions Landing Pages
 * Used for PageRank distribution, topical authority, and crawler navigation.
 */

export interface SolutionToolRef {
  slug: string;
  name: string;
  path: string;
  badge: string;
  description: string;
  standard: string;
}

export interface SolutionWorkflowStep {
  stepNumber: number;
  title: string;
  toolSlug: string;
  toolName: string;
  toolPath: string;
  objective: string;
  inputMetric: string;
  outputMetric: string;
}

export interface SolutionData {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  standards: string[];
  heroDescription: string;
  executiveSummary: string;
  workflowSteps: SolutionWorkflowStep[];
  recommendedToolSlugs: string[];
  keyOutcomes: string[];
}

export const SOLUTIONS: SolutionData[] = [
  {
    slug: 'maintenance-optimization',
    name: 'Maintenance Optimization & Plant Asset Availability',
    shortName: 'Maintenance & Availability',
    tagline: 'Connect MTBF, MTTR, PM scheduling, and spare parts into a unified reliability loop.',
    metaTitle: 'Plant Maintenance & Asset Availability Solutions | Reliability Tools',
    metaDescription: 'Master industrial maintenance scheduling, MTBF, MTTR, availability modeling, and spare part optimization per ISO 14224 and SMRP standards.',
    standards: ['ISO 14224', 'SMRP Best Practices', 'DIN 31051', 'SAE JA1011'],
    heroDescription: 'Transform uncoordinated reactive firefighting into an engineered maintenance program. Systematically quantify Mean Time Between Failures (MTBF), eliminate logistics delay waste in MTTR, simulate preventive maintenance overhaul intervals, and balance spare part inventory holding costs against plant downtime risks.',
    executiveSummary: 'In continuous process operations and modern discrete manufacturing, maintenance costs typically represent 15% to 40% of total operational expenditure (OPEX). Without mathematically grounded failure analysis, maintenance teams default to calendar-based overhauls that either waste budget on healthy components or allow infant-mortality degradation to trigger catastrophic production outages. This solution framework bridges the entire asset lifecycle: tracking running hours, isolating wrench-time bottlenecks, timing PM interventions along the P-F curve, and holding optimal safety stock.',
    workflowSteps: [
      {
        stepNumber: 1,
        title: 'Establish Baseline Reliability Metrics',
        toolSlug: 'mtbf',
        toolName: 'MTBF Calculator',
        toolPath: '/tools/mtbf/',
        objective: 'Determine active operating hours between unscheduled breakdowns across machinery fleets.',
        inputMetric: 'Operating hours, failure counts',
        outputMetric: 'MTBF, Failure rate (lambda)'
      },
      {
        stepNumber: 2,
        title: 'Decompose Outage Time & Eliminate Waiting',
        toolSlug: 'mttr',
        toolName: 'MTTR Calculator',
        toolPath: '/tools/mttr/',
        objective: 'Separate hands-on wrench time from logistics and permit wait times to compute maintenance efficiency.',
        inputMetric: 'Diagnosis, logistics delay, wrench time, testing',
        outputMetric: 'MTTR, MDT, Wrench Time Efficiency %'
      },
      {
        stepNumber: 3,
        title: 'Model Inherent vs. Operational Availability',
        toolSlug: 'availability',
        toolName: 'System Availability Calculator',
        toolPath: '/tools/availability/',
        objective: 'Quantify annual downtime hours and evaluate logistics delay revenue penalties.',
        inputMetric: 'MTBF, MTTR, MDT, hourly downtime value',
        outputMetric: 'Inherent Ai %, Operational Ao %, Lost Revenue ($/yr)'
      },
      {
        stepNumber: 4,
        title: 'Calibrate Condition Monitoring Intervals',
        toolSlug: 'pf-interval-optimizer',
        toolName: 'P-F Interval Optimizer',
        toolPath: '/tools/pf-interval-optimizer/',
        objective: 'Determine inspection frequencies to detect impending failures before functional collapse.',
        inputMetric: 'P-F interval duration, inspection cost, failure cost',
        outputMetric: 'Optimal inspection cycle, Net financial savings'
      },
      {
        stepNumber: 5,
        title: 'Calculate Poisson Spare Part Reorder Points',
        toolSlug: 'spares',
        toolName: 'Spare Part Estimator',
        toolPath: '/tools/spares/',
        objective: 'Protect against stockouts without over-capitalizing warehouse inventory.',
        inputMetric: 'Fleet size, MTBF, procurement lead time, target service level',
        outputMetric: 'Lead time demand, Poisson safety stock, Reorder point (ROP)'
      },
      {
        stepNumber: 6,
        title: 'Evaluate Lifecycle Total Cost of Ownership (TCO)',
        toolSlug: 'lcc',
        toolName: 'Life Cycle Cost (LCC) Calculator',
        toolPath: '/tools/lcc/',
        objective: 'Justify premium component reliability investments through discounted 15-to-20 year cash flows.',
        inputMetric: 'CAPEX, annual energy, maintenance OPEX, discount rate',
        outputMetric: 'Net Present Value (NPV), Payback period, Optimal option'
      }
    ],
    recommendedToolSlugs: ['mtbf', 'mttr', 'availability', 'pm', 'spares', 'lcc', 'optimal-replacement', 'pf-interval-optimizer', 'cpm-turnaround'],
    keyOutcomes: [
      'Eliminate up to 65% of logistical delay downtime through structured kitting and stockout elimination.',
      'Achieve 98.5%+ Operational Availability (Ao) on bottleneck production assets.',
      'Reduce unnecessary calendar preventive maintenance interventions on random-failure equipment.',
      'Quantify multi-year NPV payback for high-efficiency motors, premium seals, and VFD upgrades.'
    ]
  },
  {
    slug: 'process-safety-sil',
    name: 'Functional Safety & Quantitative Process Risk (SIL / SIS)',
    shortName: 'Functional Safety & SIL',
    tagline: 'Validate Safety Instrumented Functions (SIFs), LOPA credits, and mechanical integrity.',
    metaTitle: 'Functional Safety & Process Risk Solutions (SIL / IEC 61508) | Reliability Tools',
    metaDescription: 'Verify Safety Integrity Levels (SIL), calculate PFDavg, perform LOPA and Fault Tree Analysis compliant with IEC 61508, IEC 61511, and API 570.',
    standards: ['IEC 61508', 'IEC 61511', 'API 570', 'API 510', 'CCPS LOPA', 'ANSI/ISA-84'],
    heroDescription: 'Achieve auditable functional safety compliance across oil & gas, chemical processing, and power generation facilities. Calculate Average Probability of Failure on Demand (PFDavg) across 1oo1, 1oo2, 2oo2, and 2oo3 voting architectures, evaluate Independent Protection Layers (IPLs) in LOPA, and calculate piping wall remaining life under API 570.',
    executiveSummary: 'In high-hazard process industries, safety cannot be assumed—it must be quantitatively validated. Major regulatory bodies (OSHA PSM, Seveso III, COMAH) require certified verification that Safety Instrumented Systems (SIS) reduce risk As Low As Reasonably Practicable (ALARP). Our functional safety solution suite connects hazard identification (HAZOP), risk reduction budgeting (LOPA), voting architecture reliability modeling (SIL Verification), and mechanical corrosion retirement limits (API 570).',
    workflowSteps: [
      {
        stepNumber: 1,
        title: 'Quantify Initiating Event Frequency & IPLs',
        toolSlug: 'lopa',
        toolName: 'LOPA Risk Calculator',
        toolPath: '/tools/lopa/',
        objective: 'Evaluate whether basic process control systems, relief valves, and operator alarms provide sufficient risk reduction.',
        inputMetric: 'Initiating event frequency, consequence category, IPL PFDs',
        outputMetric: 'Mitigated event frequency, Required SIF RRF target'
      },
      {
        stepNumber: 2,
        title: 'Verify Hardware Voting Architecture & SIL Rating',
        toolSlug: 'sil',
        toolName: 'SIL Verification Calculator',
        toolPath: '/tools/sil/',
        objective: 'Compute PFDavg and verify SIL 1 through SIL 4 compliance per IEC 61508 / 61511 low-demand requirements.',
        inputMetric: 'Dangerous undetected failure rate (lambda DU), Proof test interval (TI), Voting logic',
        outputMetric: 'PFDavg, Risk Reduction Factor (RRF), Certified SIL level'
      },
      {
        stepNumber: 3,
        title: 'Model Complex System Safety Failure Paths',
        toolSlug: 'fta',
        toolName: 'Fault Tree Analysis (FTA)',
        toolPath: '/tools/fta/',
        objective: 'Construct top-down deductive logic gates to determine minimal cut sets leading to hazardous top events.',
        inputMetric: 'Primary component failure probabilities, AND / OR logic gates',
        outputMetric: 'Top event probability, Critical path component ranking'
      },
      {
        stepNumber: 4,
        title: 'Inspect Piping Ultrasonic Thickness & Corrosion Allowance',
        toolSlug: 'api-570-remaining-life',
        toolName: 'API 570 Piping Remaining Life Calculator',
        toolPath: '/tools/api-570-remaining-life/',
        objective: 'Calculate short-term vs. long-term corrosion rates and schedule next ultrasonic inspections per half-life rules.',
        inputMetric: 'Initial, previous, and actual wall thickness (mm), inspection years, piping class',
        outputMetric: 'Governing corrosion rate, Remaining life (years), Next inspection due date'
      },
      {
        stepNumber: 5,
        title: 'Diagnose Incipient High-Voltage Transformer Faults',
        toolSlug: 'duval-triangle',
        toolName: 'Duval Triangle DGA Analyzer',
        toolPath: '/tools/duval-triangle/',
        objective: 'Plot dissolved gas analysis concentrations to identify thermal faults and high-energy electrical arcing.',
        inputMetric: 'CH4, C2H4, C2H2 ppm gas readings',
        outputMetric: 'Triangular coordinates, Diagnostic fault zone (PD, T1-T3, D1-D2)'
      }
    ],
    recommendedToolSlugs: ['sil', 'lopa', 'api-570-remaining-life', 'fta', 'fmea', 'hazard-rate', 'duval-triangle', 'npsh-cavitation'],
    keyOutcomes: [
      'Certify compliance with IEC 61508 / 61511 standards with verifiable PFDavg proofs.',
      'Eliminate spurious process trips through optimized 2oo3 and 2oo2 voting configurations.',
      'Prevent catastrophic piping loss of primary containment (LOPC) through API 570 half-life scheduling.',
      'Satisfy corporate insurance underwriting and regulatory OSHA PSM audit requirements.'
    ]
  },
  {
    slug: 'manufacturing-oee',
    name: 'Manufacturing Excellence & Downtime Reduction (OEE)',
    shortName: 'Manufacturing OEE & Downtime',
    tagline: 'Isolate Six Big Losses, calculate hourly financial bleeding, and execute 5-Why root cause actions.',
    metaTitle: 'Manufacturing OEE & Downtime Reduction Solutions | Reliability Tools',
    metaDescription: 'Eliminate production bottlenecks, quantify breakdown financial costs, and optimize Overall Equipment Effectiveness (OEE) per JIPM and ISO 22400.',
    standards: ['JIPM TPM Standards', 'ISO 22400', 'AIAG & VDA', 'Six Sigma DMAIC'],
    heroDescription: 'Transform operational productivity in high-speed manufacturing, packaging, and assembly operations. Calculate Overall Equipment Effectiveness (OEE) across Availability, Performance, and Quality dimensions, translate machine stoppages into exact dollar losses, and isolate chronic defects using Pareto 80/20 and Ishikawa root-cause workflows.',
    executiveSummary: 'Many production facilities operate under the illusion of high productivity while losing 20% to 40% of their theoretical capacity to micro-stoppages, slow running speeds, changeover delays, and rework scrap. This solution package arms plant managers, continuous improvement (CI) leaders, and maintenance directors with the tools needed to expose the "Hidden Plant", isolate the vital few root causes, and build an airtight financial business case for corrective reliability projects.',
    workflowSteps: [
      {
        stepNumber: 1,
        title: 'Calculate Production Line OEE & Loss Decomposition',
        toolSlug: 'oee',
        toolName: 'OEE Calculator',
        toolPath: '/tools/oee/',
        objective: 'Measure Overall Equipment Effectiveness and isolate losses across Availability, Performance, and Quality.',
        inputMetric: 'Planned time, downtime hours, ideal cycle time, total units, defective units',
        outputMetric: 'Availability %, Performance %, Quality %, Overall OEE %'
      },
      {
        stepNumber: 2,
        title: 'Quantify Total Hourly Breakdown Financial Losses',
        toolSlug: 'downtime-cost',
        toolName: 'Downtime Cost Calculator',
        toolPath: '/tools/downtime-cost/',
        objective: 'Calculate the true financial loss combining lost contribution margin and unabsorbed labor overhead.',
        inputMetric: 'Downtime duration, production rate, profit/margin per unit, labor & overhead rate',
        outputMetric: 'Total outage loss ($), Hourly cost rate ($/hr), Payback recovery period'
      },
      {
        stepNumber: 3,
        title: 'Isolate the Vital Few Downtime Causes (80/20)',
        toolSlug: 'pareto',
        toolName: 'Pareto Chart Analysis Tool',
        toolPath: '/tools/pareto/',
        objective: 'Sort loss categories by cumulative impact to concentrate engineering focus on the top 20% of problems.',
        inputMetric: 'Failure categories and event hours/counts',
        outputMetric: 'Ranked Pareto distribution, 80% cutoff line'
      },
      {
        stepNumber: 4,
        title: 'Brainstorm Root Causes Across the 6 Ms',
        toolSlug: 'fishbone',
        toolName: 'Fishbone Diagram Generator',
        toolPath: '/tools/fishbone/',
        objective: 'Map all potential causes across Man, Machine, Material, Method, Measurement, and Milieu.',
        inputMetric: 'Problem statement, brainstorming inputs across 6 categories',
        outputMetric: 'Interactive Ishikawa diagram, exportable visual report'
      },
      {
        stepNumber: 5,
        title: 'Execute Iterative 5-Why Root Cause Diagnosis',
        toolSlug: '5-why',
        toolName: '5-Why Problem Solving Tool',
        toolPath: '/tools/5-why/',
        objective: 'Drill down past physical symptoms to identify the systemic organizational and human root causes.',
        inputMetric: 'Initial failure incident, consecutive "Why" deductions',
        outputMetric: 'Validated root cause, Corrective Action Plan (CAPA)'
      }
    ],
    recommendedToolSlugs: ['oee', 'downtime-cost', 'pareto', 'fishbone', '5-why', 'spc', 'error-budget', 'assessment'],
    keyOutcomes: [
      'Elevate plant OEE from average industry baseline (60-65%) toward world-class 85%+ benchmark.',
      'Identify and reclaim unabsorbed capacity, postponing expensive CAPEX equipment expansions.',
      'Provide corporate executive leadership with indisputable dollar figures on downtime ROI.',
      'Eliminate chronic recurring nuisance alarms and speed deratings.'
    ]
  },
  {
    slug: 'statistical-life-data',
    name: 'Statistical Life Data Analysis & Reliability Modeling',
    shortName: 'Life Data & Weibull Analysis',
    tagline: 'Transform raw failure records into predictive Weibull curves, confidence intervals, and system RBDs.',
    metaTitle: 'Statistical Life Data Analysis & Weibull Modeling Solutions | Reliability Tools',
    metaDescription: 'Perform Weibull 2P/3P regression, calculate MTBF confidence intervals, and model complex system reliability block diagrams per IEC 61649.',
    standards: ['IEC 61649', 'MIL-HDBK-217F', 'Telcordia SR-332', 'ISO 281'],
    heroDescription: 'Apply advanced statistical reliability engineering to equipment life data. Fit 2-Parameter and 3-Parameter Weibull distributions, handle right-censored suspensions with the Johnson Method, compute Chi-Square MTBF confidence bounds, and simulate complex series-parallel-standby networks using Reliability Block Diagrams (RBD).',
    executiveSummary: 'Reliability is a probability, not a deterministic certainty. When rotating equipment, electronics, or mechanical assemblies fail, relying strictly on an average number (MTBF) masks whether failures are caused by infant mortality, random stress, or predictable mechanical wear. Our statistical analysis framework provides the rigorous mathematical apparatus needed to diagnose failure mechanisms, determine component B10 life, and model system survival curves.',
    workflowSteps: [
      {
        stepNumber: 1,
        title: 'Fit Life Data & Extract Weibull Parameters',
        toolSlug: 'weibull',
        toolName: 'Weibull Analysis Tool',
        toolPath: '/tools/weibull/',
        objective: 'Perform median rank regression to extract shape (Beta) and scale (Eta) parameters from failure and suspended units.',
        inputMetric: 'Time to failure hours, suspension markers (+), competing failure modes',
        outputMetric: 'Beta (slope), Eta (characteristic life), B10 life, Goodness of fit (R^2)'
      },
      {
        stepNumber: 2,
        title: 'Compute Statistical MTBF Confidence Intervals',
        toolSlug: 'confidence-interval',
        toolName: 'MTBF Confidence Interval Calculator',
        toolPath: '/tools/confidence-interval/',
        objective: 'Determine lower and upper confidence limits on MTBF using Chi-Square distributions for small sample sets.',
        inputMetric: 'Operating time, failures count, confidence level (90%, 95%, 99%), test type',
        outputMetric: 'Lower bound MTBF, Upper bound MTBF, Survival probability'
      },
      {
        stepNumber: 3,
        title: 'Model Complex Multi-Component System Networks',
        toolSlug: 'rbd',
        toolName: 'Reliability Block Diagram (RBD) Tool',
        toolPath: '/tools/rbd/',
        objective: 'Model series, parallel redundant, and standby configurations to predict overall system reliability.',
        inputMetric: 'Component failure rates (lambda), network topology, mission duration',
        outputMetric: 'System reliability R(t), System MTBF, Critical component ranking'
      },
      {
        stepNumber: 4,
        title: 'Evaluate K-out-of-N Redundancy Trade-offs',
        toolSlug: 'k-out-of-n',
        toolName: 'K-out-of-N Redundancy Calculator',
        toolPath: '/tools/k-out-of-n/',
        objective: 'Calculate reliability of voting clusters (e.g. 2 out of 3 pumps running, 3 out of 4 generators active).',
        inputMetric: 'Total units (n), Required units (k), Individual unit reliability',
        outputMetric: 'Cluster reliability, Probability of failure, Redundancy gain'
      },
      {
        stepNumber: 5,
        title: 'Predict Rolling Element Bearing Fatigue Life',
        toolSlug: 'bearing-life',
        toolName: 'ISO 281 Bearing Life Calculator',
        toolPath: '/tools/bearing-life/',
        objective: 'Calculate L10 rating life in millions of revolutions and operating hours for ball and roller bearings.',
        inputMetric: 'Dynamic load rating C (kN), Equivalent dynamic load P (kN), Speed (RPM), Bearing type',
        outputMetric: 'L10 million revolutions, L10h operating hours, Service life (years)'
      }
    ],
    recommendedToolSlugs: ['weibull', 'confidence-interval', 'rbd', 'k-out-of-n', 'growth', 'miners-rule', 'parts-count-mtbf', 'markov'],
    keyOutcomes: [
      'Accurately distinguish infant mortality (Beta < 1) from random events (Beta = 1) and mechanical wear (Beta > 1).',
      'Target preventive maintenance overhauls at precise B10 fatigue life thresholds.',
      'Model system availability for multi-million-dollar capital project bid proposals.',
      'Eliminate costly over-design through calculated redundant voting architectures.'
    ]
  }
];

export function getSolutionBySlug(slug: string): SolutionData | undefined {
  return SOLUTIONS.find(s => s.slug === slug);
}

