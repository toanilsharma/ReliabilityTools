/**
 * Bi-Directional Content Mapping
 * Connects Reliability Calculators (/tools/[slug]/) to Learning Hub Articles (/learning/[articleId]/)
 */

export interface ContentPair {
  toolSlug: string;
  toolPath: string;
  toolName: string;
  articleId: string;
  articlePath: string;
  articleTitle: string;
  articleSummary: string;
}

export const CONTENT_MAPPINGS: ContentPair[] = [
  {
    toolSlug: 'mtbf',
    toolPath: '/tools/mtbf/',
    toolName: 'MTBF / MTTF Calculator',
    articleId: 'mtbf-guide',
    articlePath: '/learning/mtbf-guide/',
    articleTitle: 'What is MTBF? Complete Guide with Examples and Calculator',
    articleSummary: 'Master the Mean Time Between Failures calculation, its impact on maintenance scheduling, and how it differs from MTTF.'
  },
  {
    toolSlug: 'mttr',
    toolPath: '/tools/mttr/',
    toolName: 'MTTR Calculator',
    articleId: 'mtbf-guide',
    articlePath: '/learning/mtbf-guide/',
    articleTitle: 'What is MTBF & MTTR? Complete Engineering Guide',
    articleSummary: 'Analyze Mean Time To Repair (MTTR) and Mean Time Between Failures (MTBF) to minimize total plant downtime.'
  },
  {
    toolSlug: 'weibull',
    toolPath: '/tools/weibull/',
    toolName: 'Weibull Analysis',
    articleId: 'weibull-analysis-explained',
    articlePath: '/learning/weibull-analysis-explained/',
    articleTitle: 'Weibull Analysis Explained: Step-by-Step with Examples',
    articleSummary: 'A deep dive into Weibull analysis, the Shape (Beta) and Scale (Eta) parameters, and how to predict equipment life.'
  },
  {
    toolSlug: 'oee',
    toolPath: '/tools/oee/',
    toolName: 'OEE Calculator',
    articleId: 'oee-benchmarks',
    articlePath: '/learning/oee-benchmarks/',
    articleTitle: 'OEE Explained: Formula, Benchmarks, and How to Improve It',
    articleSummary: 'Discover how to measure Overall Equipment Effectiveness (OEE) and uncover the "Hidden Factory" of lost production time.'
  },
  {
    toolSlug: 'fmea',
    toolPath: '/tools/fmea/',
    toolName: 'FMEA RPN Calculator',
    articleId: 'fmea-step-by-step',
    articlePath: '/learning/fmea-step-by-step/',
    articleTitle: 'FMEA Guide: How to Perform Failure Mode and Effects Analysis',
    articleSummary: 'Learn how to identify risks, calculate Risk Priority Numbers (RPN), and implement FMEA in your organization.'
  },
  {
    toolSlug: 'availability',
    toolPath: '/tools/availability/',
    toolName: 'Availability Calculator',
    articleId: 'rcm-complete-guide',
    articlePath: '/learning/rcm-complete-guide/',
    articleTitle: 'Reliability Centered Maintenance (RCM): The Complete Guide',
    articleSummary: 'Learn how Reliability Centered Maintenance uses structured decision logic to choose the right maintenance strategy.'
  },
  {
    toolSlug: 'sil',
    toolPath: '/tools/sil/',
    toolName: 'SIL Verification (PFD)',
    articleId: 'rcm-complete-guide',
    articlePath: '/learning/rcm-complete-guide/',
    articleTitle: 'Reliability Centered Maintenance (RCM): The Complete Guide',
    articleSummary: 'Explore Safety Instrumented Functions and PFDavg calculations in process safety environments.'
  },
  {
    toolSlug: 'rbd',
    toolPath: '/tools/rbd/',
    toolName: 'RBD Builder',
    articleId: 'rcm-complete-guide',
    articlePath: '/learning/rcm-complete-guide/',
    articleTitle: 'Reliability Centered Maintenance (RCM): The Complete Guide',
    articleSummary: 'Model complex system reliability block diagrams (Series & Parallel configurations).'
  },
  {
    toolSlug: 'pm',
    toolPath: '/tools/pm/',
    toolName: 'PM Scheduler',
    articleId: 'preventive-vs-predictive-maintenance',
    articlePath: '/learning/preventive-vs-predictive-maintenance/',
    articleTitle: 'Preventive vs Predictive Maintenance: Which Strategy Is Right?',
    articleSummary: 'A practical comparison of Preventive Maintenance (PM) and Predictive Maintenance (PdM) strategies.'
  },
  {
    toolSlug: 'hazard-rate',
    toolPath: '/tools/hazard-rate/',
    toolName: 'Hazard Rate Calculator',
    articleId: 'bathtub-curve',
    articlePath: '/learning/bathtub-curve/',
    articleTitle: 'Bathtub Curve in Reliability Engineering: What It Means',
    articleSummary: 'Understand the three phases of asset life—Infant Mortality, Useful Life, and Wear-Out.'
  },
  {
    toolSlug: 'optimal-replacement',
    toolPath: '/tools/optimal-replacement/',
    toolName: 'Optimal Replacement Age',
    articleId: 'preventive-vs-predictive-maintenance',
    articlePath: '/learning/preventive-vs-predictive-maintenance/',
    articleTitle: 'Preventive vs Predictive Maintenance: Which Strategy Is Right?',
    articleSummary: 'Learn how to balance preventive replacement costs against failure costs to find the optimal replacement age.'
  },
  {
    toolSlug: 'spares',
    toolPath: '/tools/spares/',
    toolName: 'Spare Part Estimator',
    articleId: 'preventive-vs-predictive-maintenance',
    articlePath: '/learning/preventive-vs-predictive-maintenance/',
    articleTitle: 'Preventive vs Predictive Maintenance: Which Strategy Is Right?',
    articleSummary: 'Optimize spare part stock levels and reorder points based on failure rates.'
  },
  {
    toolSlug: 'fishbone',
    toolPath: '/tools/fishbone/',
    toolName: 'Fishbone Diagram (RCA)',
    articleId: 'fmea-india-guide',
    articlePath: '/learning/fmea-india-guide/',
    articleTitle: 'FMEA in Indian Manufacturing: Practical Step-by-Step Guide',
    articleSummary: 'Combine Ishikawa Fishbone diagrams with FMEA to conduct thorough root cause analysis.'
  },
  {
    toolSlug: 'downtime-cost',
    toolPath: '/tools/downtime-cost/',
    toolName: 'Downtime Cost Calculator',
    articleId: 'preventive-vs-predictive-maintenance',
    articlePath: '/learning/preventive-vs-predictive-maintenance/',
    articleTitle: 'Preventive vs Predictive Maintenance: Which Strategy Is Right?',
    articleSummary: 'A practical comparison of Preventive Maintenance and Predictive Maintenance strategies to minimize downtime cost.'
  },
  {
    toolSlug: 'bearing-life',
    toolPath: '/tools/bearing-life/',
    toolName: 'L10 Bearing Life Calculator',
    articleId: 'weibull-analysis-explained',
    articlePath: '/learning/weibull-analysis-explained/',
    articleTitle: 'Weibull Analysis Explained: Step-by-Step with Examples',
    articleSummary: 'A deep dive into fatigue life data analysis, Weibull parameters, and bearing life modeling.'
  },
  {
    toolSlug: 'vibration-severity',
    toolPath: '/tools/vibration-severity/',
    toolName: 'Vibration Severity Checker',
    articleId: 'preventive-vs-predictive-maintenance',
    articlePath: '/learning/preventive-vs-predictive-maintenance/',
    articleTitle: 'Preventive vs Predictive Maintenance: Which Strategy Is Right?',
    articleSummary: 'Learn how vibration analysis forms the cornerstone of predictive maintenance (PdM) programs.'
  },
  {
    toolSlug: '5-why',
    toolPath: '/tools/5-why/',
    toolName: '5-Why RCA Builder',
    articleId: 'fmea-india-guide',
    articlePath: '/learning/fmea-india-guide/',
    articleTitle: 'FMEA in Indian Manufacturing: Practical Step-by-Step Guide',
    articleSummary: 'Combine 5-Why root cause analysis with FMEA risk priorities to eliminate recurring equipment defects.'
  },
  {
    toolSlug: 'pareto',
    toolPath: '/tools/pareto/',
    toolName: 'Pareto Chart Tool',
    articleId: 'spare-parts-optimization-guide',
    articlePath: '/learning/spare-parts-optimization-guide/',
    articleTitle: 'Spare Parts Inventory Optimization: A Complete Guide',
    articleSummary: 'Use 80/20 Pareto principles to prioritize critical equipment spare parts and inventory investment.'
  },
  {
    toolSlug: 'reliability-allocation',
    toolPath: '/tools/reliability-allocation/',
    toolName: 'Reliability Allocation Calculator',
    articleId: 'weibull-analysis-explained',
    articlePath: '/learning/weibull-analysis-explained/',
    articleTitle: 'Weibull Analysis Explained: Step-by-Step with Examples',
    articleSummary: 'Understand system reliability budgeting, apportionment models, and target failure rate allocations.'
  },
  {
    toolSlug: 'spc',
    toolPath: '/tools/spc/',
    toolName: 'SPC & Process Capability Calculator',
    articleId: 'fmea-india-guide',
    articlePath: '/learning/fmea-india-guide/',
    articleTitle: 'FMEA in Indian Manufacturing: Practical Step-by-Step Guide',
    articleSummary: 'Integrate Statistical Process Control (SPC) and Cpk capability analysis with FMEA process controls.'
  },
  {
    toolSlug: 'rcm-decision',
    toolPath: '/tools/rcm-decision/',
    toolName: 'RCM Decision Wizard',
    articleId: 'rcm-complete-guide',
    articlePath: '/learning/rcm-complete-guide/',
    articleTitle: 'Reliability Centered Maintenance (RCM): Complete Step-by-Step Implementation Guide',
    articleSummary: 'Master SAE JA1011 RCM decision logic trees, task selection, and PM program optimization.'
  },
  {
    toolSlug: 'duval-triangle',
    toolPath: '/tools/duval-triangle/',
    toolName: 'Duval Triangle Calculator',
    articleId: 'duval-triangle-guide',
    articlePath: '/learning/duval-triangle-guide/',
    articleTitle: 'Duval Triangle DGA Guide: Interpreting Transformer Dissolved Gases',
    articleSummary: 'Classify power transformer thermal, discharge, and arcing faults using the IEC 60599 and IEEE C57.104 Duval Triangle 1 method.'
  },
  {
    toolSlug: 'lopa',
    toolPath: '/tools/lopa/',
    toolName: 'LOPA & SIL Calculator',
    articleId: 'lopa-sil-determination-guide',
    articlePath: '/learning/lopa-sil-determination-guide/',
    articleTitle: 'Layer of Protection Analysis (LOPA): Complete Engineering Guide',
    articleSummary: 'Perform semi-quantitative process risk assessments and determine target SIL safety integrity levels per IEC 61511 and CCPS.'
  },
  {
    toolSlug: 'miners-rule',
    toolPath: '/tools/miners-rule/',
    toolName: "Miner's Rule Fatigue Calculator",
    articleId: 'miners-rule-fatigue-guide',
    articlePath: '/learning/miners-rule-fatigue-guide/',
    articleTitle: "Palmgren-Miner's Rule Guide: Cumulative Fatigue Damage Modeling",
    articleSummary: 'Calculate cumulative structural fatigue damage, stress cycles, and consumed endurance life per ISO 12107 and ASTM E1049.'
  },
  {
    toolSlug: 'error-budget',
    toolPath: '/tools/error-budget/',
    toolName: 'Error Budget SLO Calculator',
    articleId: 'error-budget-slo-guide',
    articlePath: '/learning/error-budget-slo-guide/',
    articleTitle: 'Error Budgets and SLOs: Site Reliability Engineering Guide',
    articleSummary: 'Master SRE reliability budgets, multi-window burn rate alerts, and allowable downtime limits per ISO 25010 and IEEE 730.'
  },
  {
    toolSlug: 'api-570-remaining-life',
    toolPath: '/tools/api-570-remaining-life/',
    toolName: 'API 570 UT Remaining Life',
    articleId: 'api-570-pipe-inspection-guide',
    articlePath: '/learning/api-570-pipe-inspection-guide/',
    articleTitle: 'API 570 Piping Inspection Guide: UT Thickness & Corrosion Rates',
    articleSummary: 'Evaluate process piping ultrasonic thickness inspections, corrosion rates, remaining life, and half-life intervals per API 570.'
  },
  {
    toolSlug: 'npsh-cavitation',
    toolPath: '/tools/npsh-cavitation/',
    toolName: 'NPSH Cavitation Calculator',
    articleId: 'npsh-pump-cavitation-guide',
    articlePath: '/learning/npsh-pump-cavitation-guide/',
    articleTitle: 'NPSH and Cavitation Prevention Guide for Centrifugal Pumps',
    articleSummary: 'Calculate Net Positive Suction Head available (NPSHa) and enforce ANSI/HI 9.6.1 and API 610 cavitation safety margins.'
  },
  {
    toolSlug: 'parts-count-mtbf',
    toolPath: '/tools/parts-count-mtbf/',
    toolName: 'Parts-Count MTBF (MIL-217)',
    articleId: 'mil-hdbk-217-parts-count-guide',
    articlePath: '/learning/mil-hdbk-217-parts-count-guide/',
    articleTitle: 'MIL-HDBK-217F Parts-Count Reliability Prediction Guide',
    articleSummary: 'Predict electronic component failure rates, FITs, and hardware assembly MTBF using MIL-HDBK-217F and Telcordia SR-332.'
  },
  {
    toolSlug: 'eafor',
    toolPath: '/tools/eafor/',
    toolName: 'EAF & EFOR Availability',
    articleId: 'ieee-762-eaf-efor-guide',
    articlePath: '/learning/ieee-762-eaf-efor-guide/',
    articleTitle: 'IEEE 762 & NERC GADS Guide: Power Plant EAF and EFOR Metrics',
    articleSummary: 'Master electric utility generation metrics: Equivalent Availability Factor, Equivalent Forced Outage Rate, and derated hours.'
  },
  {
    toolSlug: 'pf-interval-optimizer',
    toolPath: '/tools/pf-interval-optimizer/',
    toolName: 'P-F Interval Optimizer',
    articleId: 'pf-interval-optimization-guide',
    articlePath: '/learning/pf-interval-optimization-guide/',
    articleTitle: 'P-F Interval Optimization Guide: Condition Monitoring Frequencies',
    articleSummary: 'Determine optimal predictive maintenance inspection frequencies along the P-F curve per SAE JA1011, JA1012, and ISO 55000.'
  },
  {
    toolSlug: 'cpm-turnaround',
    toolPath: '/tools/cpm-turnaround/',
    toolName: 'CPM Turnaround Scheduler',
    articleId: 'cpm-turnaround-scheduling-guide',
    articlePath: '/learning/cpm-turnaround-scheduling-guide/',
    articleTitle: 'Critical Path Method (CPM) Guide for Plant Overhauls & Turnarounds',
    articleSummary: 'Optimize shutdown network logic, total float, and critical path activities for industrial maintenance turnarounds per ISO 21500.'
  }
];

/**
 * Get corresponding article mapping for a given tool path or slug
 */
export function getArticleForTool(toolPathOrSlug: string): ContentPair | null {
  const normalized = toolPathOrSlug.replace(/^\/tools\//, '').replace(/\/$/, '').trim();
  return CONTENT_MAPPINGS.find(m => m.toolSlug === normalized || m.toolPath.includes(normalized)) || CONTENT_MAPPINGS[0];
}

/**
 * Get corresponding tool mapping for a given article ID or path
 */
export function getToolForArticle(articleIdOrPath: string): ContentPair | null {
  const normalized = articleIdOrPath.replace(/^\/learning\//, '').replace(/\/$/, '').trim();
  return CONTENT_MAPPINGS.find(m => m.articleId === normalized || m.articlePath.includes(normalized)) || CONTENT_MAPPINGS[0];
}
