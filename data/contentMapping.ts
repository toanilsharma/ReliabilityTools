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
