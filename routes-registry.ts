/**
 * Centralized Single Source of Truth Route Registry for Reliability Tools
 * EVERY route declares:
 *  - path, type, indexable, sitemapPriority, changefreq, schemaTypes[], titleTemplate, descriptionTemplate, breadcrumbs[]
 */

export type RouteType = 
  | 'tool' 
  | 'game' 
  | 'article' 
  | 'industry' 
  | 'ugc' 
  | 'event' 
  | 'utility' 
  | 'legal';

export type ChangeFreq = 
  | 'always' 
  | 'hourly' 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly' 
  | 'never';

export interface RouteBreadcrumb {
  name: string;
  path: string;
}

export interface RouteRegistryEntry {
  path: string;
  type: RouteType;
  indexable: boolean;
  sitemapPriority: number;
  changefreq: ChangeFreq;
  schemaTypes: string[];
  titleTemplate: string;
  descriptionTemplate: string;
  breadcrumbs: RouteBreadcrumb[];
}

export const BASE_URL: string = 'https://reliabilitytools.co.in';

export const ROUTES_REGISTRY: RouteRegistryEntry[] = [
  // ==========================================
  // 1. CORE & HUB PAGES (type: utility)
  // ==========================================
  {
    path: '/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 1.0,
    changefreq: 'weekly',
    schemaTypes: ['WebSite', 'Organization'],
    titleTemplate: 'Industrial Reliability Engineering Tools | Reliability Tools',
    descriptionTemplate: 'Free industrial reliability engineering calculators for MTBF, Weibull analysis, FMEA, OEE, Availability, RBD, and PM optimization.',
    breadcrumbs: [
      { name: 'Home', path: '/' }
    ]
  },
  {
    path: '/about/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.5,
    changefreq: 'monthly',
    schemaTypes: ['AboutPage', 'BreadcrumbList'],
    titleTemplate: 'About Us - Industrial Reliability Experts | Reliability Tools',
    descriptionTemplate: 'Learn about Reliability Tools, built by industrial reliability experts to provide accessible, high-precision engineering calculators.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about/' }
    ]
  },
  {
    path: '/contact/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.5,
    changefreq: 'monthly',
    schemaTypes: ['ContactPage', 'BreadcrumbList'],
    titleTemplate: 'Contact Us & Engineering Support | Reliability Tools',
    descriptionTemplate: 'Get in touch with the Reliability Tools engineering team for technical inquiries, calculation feedback, feature requests, or support.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact Us', path: '/contact/' }
    ]
  },
  {
    path: '/downloads/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.7,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering Templates & Files | Reliability Tools',
    descriptionTemplate: 'Download free reliability engineering templates, Excel spreadsheets, whitepapers, and asset maintenance planning files.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Downloads', path: '/downloads/' }
    ]
  },
  {
    path: '/faq/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.5,
    changefreq: 'monthly',
    schemaTypes: ['FAQPage', 'BreadcrumbList'],
    titleTemplate: 'Frequently Asked Questions & Standards | Reliability Tools',
    descriptionTemplate: 'Frequently asked questions regarding reliability engineering formulas, international standards (ISO, IEC, IEEE), and tool validation.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'FAQ', path: '/faq/' }
    ]
  },
  {
    path: '/reliability-engineering-glossary/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.7,
    changefreq: 'monthly',
    schemaTypes: ['DefinedTermSet', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering Terminology Glossary | Reliability Tools',
    descriptionTemplate: 'Searchable glossary of 50+ industrial reliability engineering terms, formulas, failure distributions, and maintenance definitions.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Glossary', path: '/reliability-engineering-glossary/' }
    ]
  },
  {
    path: '/methodology/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.5,
    changefreq: 'monthly',
    schemaTypes: ['WebPage', 'BreadcrumbList'],
    titleTemplate: 'Calculation Methodology & Validation | Reliability Tools',
    descriptionTemplate: 'Explore the mathematical algorithms, statistical models, and scientific literature underpinning our reliability calculators.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Methodology', path: '/methodology/' }
    ]
  },
  {
    path: '/professors/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['EducationalWebPage', 'BreadcrumbList'],
    titleTemplate: 'Free Reliability Engineering Teaching Resources | Reliability Tools',
    descriptionTemplate: 'Free university syllabus integration guide, downloadable formula cheat sheets, and LMS Canvas/Blackboard embed snippets for engineering educators.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Professors', path: '/professors/' }
    ]
  },
  {
    path: '/press/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.7,
    changefreq: 'monthly',
    schemaTypes: ['AboutPage', 'BreadcrumbList'],
    titleTemplate: 'Media & Press Kit - Reliability Tools | Reliability Tools',
    descriptionTemplate: 'Official media assets, press backgrounder, platform statistics, brand guidelines, and press contact form for Reliability Tools.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Press Kit', path: '/press/' }
    ]
  },
  {
    path: '/embed/',
    type: 'utility',
    indexable: false,
    sitemapPriority: 0.0,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'BreadcrumbList'],
    titleTemplate: 'Interactive Calculator Embed Builder | Reliability Tools',
    descriptionTemplate: 'Customize and generate responsive iframe code snippets to embed free reliability calculators into your intranet or website.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Embed Builder', path: '/embed/' }
    ]
  },

  // ==========================================
  // 2. TOOLS & CALCULATORS (type: tool)
  // ==========================================
  {
    path: '/tools/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'All Reliability Engineering Calculators | Reliability Tools',
    descriptionTemplate: 'Explore our complete library of free online reliability engineering tools, calculators, and risk assessment utilities.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' }
    ]
  },
  {
    path: '/tools/mtbf/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'MTBF & MTTF Calculator Online | Reliability Tools',
    descriptionTemplate: 'Free online MTBF / MTTF calculator. Calculate Mean Time Between Failures, failure rate (λ), and operational reliability over time.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'MTBF Calculator', path: '/tools/mtbf/' }
    ]
  },
  {
    path: '/tools/weibull/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Weibull Analysis Calculator (2-Parameter) | Reliability Tools',
    descriptionTemplate: 'Free 2-parameter Weibull distribution analysis tool. Estimate shape (β) and scale (η) parameters with median rank regression.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Weibull Analysis', path: '/tools/weibull/' }
    ]
  },
  {
    path: '/tools/rbd/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Reliability Block Diagram (RBD) Tool | Reliability Tools',
    descriptionTemplate: 'Model series, parallel, and standby system reliability configurations. Calculate equivalent MTBF and system failure rates online.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'RBD Tool', path: '/tools/rbd/' }
    ]
  },
  {
    path: '/tools/availability/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Equipment Availability Calculator | Reliability Tools',
    descriptionTemplate: 'Calculate Inherent, Achieved, and Operational equipment availability using MTBF, MTTR, and preventive maintenance downtime.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Availability Calculator', path: '/tools/availability/' }
    ]
  },
  {
    path: '/tools/mttr/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'MTTR Calculator & Maintainability Analysis | Reliability Tools',
    descriptionTemplate: 'Calculate Mean Time to Repair (MTTR), repair rate (μ), and maintainability probability M(t) with international benchmarks.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'MTTR Calculator', path: '/tools/mttr/' }
    ]
  },
  {
    path: '/tools/pm/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Preventive Maintenance Optimization Tool | Reliability Tools',
    descriptionTemplate: 'Determine optimal preventive maintenance overhaul intervals to minimize total lifecycle cost and avoid premature failures.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'PM Scheduler', path: '/tools/pm/' }
    ]
  },
  {
    path: '/tools/spares/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Spare Parts Provisioning Calculator (Poisson) | Reliability Tools',
    descriptionTemplate: 'Optimize critical spare parts stock levels using Poisson demand modeling, lead time, and targeted service levels.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Spares Provisioning', path: '/tools/spares/' }
    ]
  },
  {
    path: '/tools/lcc/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Life Cycle Cost (LCC) Analysis Tool | Reliability Tools',
    descriptionTemplate: 'Evaluate total cost of asset ownership: acquisition, operation, maintenance, and disposal with Net Present Value discounting.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'LCC Calculator', path: '/tools/lcc/' }
    ]
  },
  {
    path: '/tools/oee/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Overall Equipment Effectiveness (OEE) Calculator | Reliability Tools',
    descriptionTemplate: 'Calculate OEE, Availability, Performance, and Quality rates with Six Big Losses breakdown and world-class manufacturing targets.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'OEE Calculator', path: '/tools/oee/' }
    ]
  },
  {
    path: '/tools/test-planner/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Reliability Demonstration Test (RDT) Planner | Reliability Tools',
    descriptionTemplate: 'Plan zero-failure and failure-terminated reliability demonstration tests using binomial and Chi-Square distribution statistics.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Test Planner', path: '/tools/test-planner/' }
    ]
  },
  {
    path: '/tools/assessment/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Reliability Maturity Assessment Matrix | Reliability Tools',
    descriptionTemplate: 'Benchmark your maintenance organization across 5 maturity levels: Reactive, Planned, Proactive, Predictive, and World-Class.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Maturity Assessment', path: '/tools/assessment/' }
    ]
  },
  {
    path: '/tools/converter/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Reliability Units & Failure Rates Converter | Reliability Tools',
    descriptionTemplate: 'Convert between FIT (Failures in Time), failure rate (λ), MTBF (hours, years), and probability of failure instantaneously.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Unit Converter', path: '/tools/converter/' }
    ]
  },
  {
    path: '/tools/optimal-replacement/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Optimal Component Replacement Age Calculator | Reliability Tools',
    descriptionTemplate: 'Calculate the exact economic replacement age that balances preventive overhaul costs against emergency failure downtime.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Optimal Replacement', path: '/tools/optimal-replacement/' }
    ]
  },
  {
    path: '/tools/eoq/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Economic Order Quantity (EOQ) Spares Tool | Reliability Tools',
    descriptionTemplate: 'Determine optimal order size and reorder point (ROP) for spare parts to minimize total ordering and inventory holding costs.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'EOQ Calculator', path: '/tools/eoq/' }
    ]
  },
  {
    path: '/tools/sil/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Safety Integrity Level (SIL) Verification Tool | Reliability Tools',
    descriptionTemplate: 'IEC 61508 / 61511 compliance: calculate Average Probability of Failure on Demand (PFDavg) and verify SIL 1 through SIL 4 targets.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'SIL Verification', path: '/tools/sil/' }
    ]
  },
  {
    path: '/tools/fmea/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'FMEA RPN Calculator & Risk Matrix | Reliability Tools',
    descriptionTemplate: 'Calculate Risk Priority Numbers (Severity × Occurrence × Detection) and prioritize failure modes per AIAG-VDA FMEA standards.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'FMEA Calculator', path: '/tools/fmea/' }
    ]
  },
  {
    path: '/tools/confidence-interval/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'MTBF Confidence Interval Calculator (Chi-Square) | Reliability Tools',
    descriptionTemplate: 'Calculate two-sided and one-sided statistical lower and upper confidence bounds for MTBF using Chi-Square distribution tables.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Confidence Interval', path: '/tools/confidence-interval/' }
    ]
  },
  {
    path: '/tools/k-out-of-n/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'K-out-of-N System Redundancy Calculator | Reliability Tools',
    descriptionTemplate: 'Model parallel and voted redundant architectures where k out of n identical components must survive for system mission success.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'K-out-of-N Calculator', path: '/tools/k-out-of-n/' }
    ]
  },
  {
    path: '/tools/hazard-rate/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Hazard Rate & Bathtub Curve Calculator | Reliability Tools',
    descriptionTemplate: 'Analyze instantaneous failure rates h(t), cumulative hazard H(t), and model infant mortality, useful life, and wear-out phases.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Hazard Rate', path: '/tools/hazard-rate/' }
    ]
  },
  {
    path: '/tools/validator/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'System Reliability Validator & Model Checker | Reliability Tools',
    descriptionTemplate: 'Verify mathematical consistency of complex reliability models, failure rates, repair times, and availability predictions.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'System Validator', path: '/tools/validator/' }
    ]
  },
  {
    path: '/tools/fishbone/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Ishikawa Fishbone Diagram Generator | Reliability Tools',
    descriptionTemplate: 'Interactive cause-and-effect fishbone diagram builder with standard 6M manufacturing categories for root cause investigations.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Fishbone Diagram', path: '/tools/fishbone/' }
    ]
  },
  {
    path: '/tools/fta/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Fault Tree Analysis (FTA) Tool Online | Reliability Tools',
    descriptionTemplate: 'Construct deductive fault trees with AND/OR logic gates. Compute top event probability and identify minimal cut sets online.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Fault Tree Analysis', path: '/tools/fta/' }
    ]
  },
  {
    path: '/tools/markov/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Markov Chain Reliability & State Modeling | Reliability Tools',
    descriptionTemplate: 'Model multi-state degradable systems with constant transition rates. Compute steady-state availability and state probabilities.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Markov Chain', path: '/tools/markov/' }
    ]
  },
  {
    path: '/tools/growth/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Duane & Crow-AMSAA Reliability Growth Model | Reliability Tools',
    descriptionTemplate: 'Track reliability improvements during testing phases. Fit Duane and Crow-AMSAA non-homogeneous Poisson process (NHPP) models.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Reliability Growth', path: '/tools/growth/' }
    ]
  },
  {
    path: '/tools/warranty/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Warranty Claims & Return Prediction Tool | Reliability Tools',
    descriptionTemplate: 'Predict warranty claims volume and reserve fund requirements using Weibull time-to-failure distribution forecasts.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Warranty Prediction', path: '/tools/warranty/' }
    ]
  },
  {
    path: '/tools/cost-risk/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Cost-Risk Maintenance Optimization Tool | Reliability Tools',
    descriptionTemplate: 'Balance inspection frequencies against catastrophic failure risks to determine minimum total business cost operating points.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Cost-Risk Optimization', path: '/tools/cost-risk/' }
    ]
  },
  {
    path: '/tools/gearbox/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Industrial Gearbox Reliability & Life Calculator | Reliability Tools',
    descriptionTemplate: 'AGMA safety factor verification: calculate contact stress, bending endurance limits, and predicted gear set service life.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Gearbox Reliability', path: '/tools/gearbox/' }
    ]
  },
  {
    path: '/tools/lubricant-life/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Lubricant Remaining Useful Life Optimizer | Reliability Tools',
    descriptionTemplate: 'Estimate remaining useful lubricant life using Arrhenius temperature scaling, ISO 4406 cleanliness codes, and moisture levels.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Lubricant Optimizer', path: '/tools/lubricant-life/' }
    ]
  },
  {
    path: '/tools/downtime-cost/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Unplanned Downtime Cost Calculator | Reliability Tools',
    descriptionTemplate: 'Quantify true cost of downtime: unabsorbed overhead, lost production revenue, idle labor, and scrap product expenses.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Downtime Cost Calculator', path: '/tools/downtime-cost/' }
    ]
  },
  {
    path: '/tools/bearing-life/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Bearing L10 & ISO 281 Rating Life Calculator | Reliability Tools',
    descriptionTemplate: 'Calculate L10 bearing fatigue life in hours and revolutions with ISO 281 lubrication viscosity and contamination adjustment factors.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Bearing Life Calculator', path: '/tools/bearing-life/' }
    ]
  },
  {
    path: '/tools/vibration-severity/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Vibration Severity Checker (ISO 10816 / 20816) | Reliability Tools',
    descriptionTemplate: 'Assess machine vibration velocity against ISO 10816 / 20816 vibration severity zones A (Good), B (Acceptable), C (Alert), and D (Danger).',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Vibration Severity', path: '/tools/vibration-severity/' }
    ]
  },
  {
    path: '/tools/5-why/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: '5-Why Root Cause Analysis (RCA) Tool | Reliability Tools',
    descriptionTemplate: 'Interactive 5-Why problem solving worksheet. Drill down through root causal chains to prevent problem recurrence in industrial plants.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: '5-Why RCA Tool', path: '/tools/5-why/' }
    ]
  },
  {
    path: '/tools/pareto/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Pareto Chart 80/20 Maintenance Analysis | Reliability Tools',
    descriptionTemplate: 'Generate interactive 80/20 Pareto breakdown charts to identify the vital few failure modes driving 80% of maintenance downtime.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Pareto Chart Tool', path: '/tools/pareto/' }
    ]
  },
  {
    path: '/tools/reliability-allocation/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Reliability Allocation Calculator (AGREE / ARINC) | Reliability Tools',
    descriptionTemplate: 'Allocate overall system reliability targets down to sub-systems using AGREE, ARINC, and equal allocation engineering methods.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'Reliability Allocation', path: '/tools/reliability-allocation/' }
    ]
  },
  {
    path: '/tools/spc/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Statistical Process Control (SPC) X-bar & R Chart | Reliability Tools',
    descriptionTemplate: 'Generate X-bar and R control charts with Nelson run rules and Cp/Cpk capability index calculations for quality control.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'SPC Calculator', path: '/tools/spc/' }
    ]
  },
  {
    path: '/tools/rcm-decision/',
    type: 'tool',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['WebApplication', 'SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Reliability-Centered Maintenance (RCM) Decision Tree | Reliability Tools',
    descriptionTemplate: 'Navigate the JA1011 RCM logic decision diagram to assign failure modes to predictive, preventive, or run-to-failure strategies.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/' },
      { name: 'RCM Decision Wizard', path: '/tools/rcm-decision/' }
    ]
  },

  // ==========================================
  // 3. GAMES & PUZZLES (type: game)
  // ==========================================
  {
    path: '/play/',
    type: 'game',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'weekly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Play Hub - Reliability Engineering Games & Puzzles | Reliability Tools',
    descriptionTemplate: 'Master reliability physics, failure distributions, and terminology through daily puzzles, Weibull histogram estimation, and spaced repetition flashcards.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Play Hub', path: '/play/' }
    ]
  },
  {
    path: '/play/uptime-tycoon/',
    type: 'game',
    indexable: true,
    sitemapPriority: 0.9,
    changefreq: 'weekly',
    schemaTypes: ['SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Uptime Tycoon - Plant Reliability Simulation Game | Reliability Tools',
    descriptionTemplate: 'Command a 10-asset manufacturing plant across 24 simulated months. Master Weibull failure physics, solve P-F warnings, and maximize cumulative profit.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Play Hub', path: '/play/' },
      { name: 'Uptime Tycoon', path: '/play/uptime-tycoon/' }
    ]
  },
  {
    path: '/play/termle/',
    type: 'game',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'daily',
    schemaTypes: ['SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Termle - Daily Reliability Word Guesser | Reliability Tools',
    descriptionTemplate: 'Test your reliability engineering vocabulary daily. Guess the 4-to-7 letter reliability engineering term in 6 attempts with glossary clues.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Play Hub', path: '/play/' },
      { name: 'Termle', path: '/play/termle/' }
    ]
  },
  {
    path: '/play/guess-the-beta/',
    type: 'game',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Guess the Beta - Weibull Histogram Estimation Game | Reliability Tools',
    descriptionTemplate: 'Estimate Weibull shape (β) and scale (η) parameters across 5 rounds of simulated equipment failure histograms with failure physics explanations.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Play Hub', path: '/play/' },
      { name: 'Guess the Beta', path: '/play/guess-the-beta/' }
    ]
  },
  {
    path: '/play/flashcards/',
    type: 'game',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['SoftwareApplication', 'BreadcrumbList'],
    titleTemplate: 'Reliability Glossary Flashcards - Spaced Repetition | Reliability Tools',
    descriptionTemplate: 'Master 50+ industrial reliability engineering terms with SuperMemo SM-2 spaced repetition flashcards and daily study streaks.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Play Hub', path: '/play/' },
      { name: 'Flashcards', path: '/play/flashcards/' }
    ]
  },
  {
    path: '/play/leaderboard/',
    type: 'game',
    indexable: false,
    sitemapPriority: 0.0,
    changefreq: 'weekly',
    schemaTypes: ['WebPage', 'BreadcrumbList'],
    titleTemplate: 'Play Hub Leaderboard - Personal Best Records | Reliability Tools',
    descriptionTemplate: 'Personal best scores, streaks, and achievements across Termle, Guess the Beta, and Flashcards.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Play Hub', path: '/play/' },
      { name: 'Leaderboard', path: '/play/leaderboard/' }
    ]
  },

  // ==========================================
  // 4. LEARNING & ARTICLES (type: article)
  // ==========================================
  {
    path: '/learning/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering Guides & Articles | Reliability Tools',
    descriptionTemplate: 'Comprehensive reliability engineering guides, tutorials, and case studies on Weibull analysis, MTBF, FMEA, and spare parts.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Learning Center', path: '/learning/' }
    ]
  },
  {
    path: '/knowledge-hub/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.7,
    changefreq: 'weekly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Industrial Knowledge Hub & Standards | Reliability Tools',
    descriptionTemplate: 'Curated technical reference repository for maintenance engineers, including international reliability standards and calculation workflows.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Knowledge Hub', path: '/knowledge-hub/' }
    ]
  },
  {
    path: '/interactive-hub/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.7,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Interactive Hub & System Architectures | Reliability Tools',
    descriptionTemplate: 'Interactive visual architectures for industrial maintenance, condition monitoring sensor networks, and asset reliability engineering.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Interactive Hub', path: '/interactive-hub/' }
    ]
  },
  {
    path: '/learning/mtbf-guide/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['Article', 'BreadcrumbList'],
    titleTemplate: 'What is MTBF? Complete Calculation Guide & Examples | Reliability Tools',
    descriptionTemplate: 'Master Mean Time Between Failures calculation, its impact on maintenance scheduling, and how it differs from MTTF with practical industrial examples.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Learning Center', path: '/learning/' },
      { name: 'MTBF Guide', path: '/learning/mtbf-guide/' }
    ]
  },
  {
    path: '/learning/weibull-guide/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['Article', 'BreadcrumbList'],
    titleTemplate: 'Weibull Analysis Guide: Shape & Scale Parameters | Reliability Tools',
    descriptionTemplate: 'Learn how to interpret the Weibull shape parameter (β) to distinguish infant mortality, random failures, and wear-out degradation modes.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Learning Center', path: '/learning/' },
      { name: 'Weibull Analysis Guide', path: '/learning/weibull-guide/' }
    ]
  },
  {
    path: '/learning/fmea-guide/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['Article', 'BreadcrumbList'],
    titleTemplate: 'FMEA Step-by-Step Guide with RPN Scoring Tables | Reliability Tools',
    descriptionTemplate: 'Execute a thorough Failure Mode and Effects Analysis. Learn how to score Severity, Occurrence, and Detection with AIAG-VDA risk priority tables.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Learning Center', path: '/learning/' },
      { name: 'FMEA Guide', path: '/learning/fmea-guide/' }
    ]
  },
  {
    path: '/learning/oee-guide/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['Article', 'BreadcrumbList'],
    titleTemplate: 'OEE Calculation Guide & Six Big Losses Elimination | Reliability Tools',
    descriptionTemplate: 'Comprehensive guide to calculating Overall Equipment Effectiveness (OEE) and eliminating the Six Big Losses in industrial manufacturing plants.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Learning Center', path: '/learning/' },
      { name: 'OEE Guide', path: '/learning/oee-guide/' }
    ]
  },
  {
    path: '/learning/spare-parts-optimization-guide/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['Article', 'BreadcrumbList'],
    titleTemplate: 'Spare Parts Inventory Optimization Guide | Reliability Tools',
    descriptionTemplate: 'Master Poisson stock calculations, lead-time variance buffers, and safety stock formulas for critical industrial maintenance spares.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Learning Center', path: '/learning/' },
      { name: 'Spare Parts Guide', path: '/learning/spare-parts-optimization-guide/' }
    ]
  },
  {
    path: '/learning/mtbf-vs-mttf-vs-mttr-guide/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['Article', 'BreadcrumbList'],
    titleTemplate: 'MTBF vs MTTF vs MTTR: Differences & Formulas | Reliability Tools',
    descriptionTemplate: 'Clear comparison of MTBF, MTTF, and MTTR. Understand repairable vs non-repairable asset distinctions with practical engineering formulas.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Learning Center', path: '/learning/' },
      { name: 'MTBF vs MTTF vs MTTR', path: '/learning/mtbf-vs-mttf-vs-mttr-guide/' }
    ]
  },
  {
    path: '/learning/weibull-analysis-spinning-machines-case-study/',
    type: 'article',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['Article', 'BreadcrumbList'],
    titleTemplate: 'Weibull Analysis Case Study: Spinning Machines | Reliability Tools',
    descriptionTemplate: 'Real-world case study applying 2-parameter Weibull distribution analysis to textile spinning machines to prevent bearing race fatigue failures.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Learning Center', path: '/learning/' },
      { name: 'Spinning Machines Case Study', path: '/learning/weibull-analysis-spinning-machines-case-study/' }
    ]
  },

  // ==========================================
  // 5. INDUSTRY LANDING PAGES (type: industry)
  // ==========================================
  {
    path: '/industries/',
    type: 'industry',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'weekly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Industry-Specific Reliability Engineering Tools | Reliability Tools',
    descriptionTemplate: 'Explore targeted maintenance calculators and reliability tools tailored for Cement, Steel, Automotive, Pharma, FMCG, and Power Generation.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries/' }
    ]
  },
  {
    path: '/industries/cement/',
    type: 'industry',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering for Cement & Building Materials | Reliability Tools',
    descriptionTemplate: 'Calculators and maintenance tools for cement plants: L10 bearing life, clinker dust abrasion, kiln downtime cost, and gearbox reliability.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries/' },
      { name: 'Cement & Building Materials', path: '/industries/cement/' }
    ]
  },
  {
    path: '/industries/steel/',
    type: 'industry',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering for Steel & Primary Metals | Reliability Tools',
    descriptionTemplate: 'Calculators for steel plants: continuous caster bearing fatigue, hot strip mill downtime cost, hydraulic contamination, and OEE.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries/' },
      { name: 'Steel & Primary Metals', path: '/industries/steel/' }
    ]
  },
  {
    path: '/industries/automotive/',
    type: 'industry',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering for Automotive OEMs | Reliability Tools',
    descriptionTemplate: 'Automotive manufacturing tools: IATF 16949 FMEA worksheets, body shop line OEE, robotic cell MTTR, and downtime cost optimization.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries/' },
      { name: 'Automotive OEMs', path: '/industries/automotive/' }
    ]
  },
  {
    path: '/industries/pharmaceuticals/',
    type: 'industry',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering for Pharmaceuticals & Life Sciences | Reliability Tools',
    descriptionTemplate: 'Pharma manufacturing tools: 21 CFR compliance, SIL verification, cleanroom HVAC uptime, lyophilizer PM scheduling, and FMEA.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries/' },
      { name: 'Pharmaceuticals & Life Sciences', path: '/industries/pharmaceuticals/' }
    ]
  },
  {
    path: '/industries/fmcg/',
    type: 'industry',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering for FMCG Packaging | Reliability Tools',
    descriptionTemplate: 'FMCG packaging line tools: micro-stoppage OEE, MRO spares EOQ, changeover setup downtime, and optimal component replacement.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries/' },
      { name: 'FMCG Packaging', path: '/industries/fmcg/' }
    ]
  },
  {
    path: '/industries/power-generation/',
    type: 'industry',
    indexable: true,
    sitemapPriority: 0.8,
    changefreq: 'monthly',
    schemaTypes: ['CollectionPage', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineering for Power Generation & Utilities | Reliability Tools',
    descriptionTemplate: 'Power generation tools: base-load grid availability, IEC 61511 SIL verification, turbine bearing L10 life, and K-out-of-N redundancy.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries/' },
      { name: 'Power Generation & Utilities', path: '/industries/power-generation/' }
    ]
  },

  // ==========================================
  // 6. SKILL TEST & CERTIFICATION (type: utility)
  // ==========================================
  {
    path: '/skill-test/',
    type: 'utility',
    indexable: true,
    sitemapPriority: 0.5,
    changefreq: 'monthly',
    schemaTypes: ['Quiz', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineer Skill Assessment Test | Reliability Tools',
    descriptionTemplate: 'Test your reliability engineering knowledge across Weibull analysis, MTBF calculations, FMEA, RBD, and maintenance strategy.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Skill Test', path: '/skill-test/' }
    ]
  },
  {
    path: '/skill-test/quiz/',
    type: 'utility',
    indexable: false,
    sitemapPriority: 0.0,
    changefreq: 'monthly',
    schemaTypes: ['Quiz', 'BreadcrumbList'],
    titleTemplate: 'Interactive Reliability Exam In Progress | Reliability Tools',
    descriptionTemplate: 'Take the interactive 20-question reliability engineering certification quiz and evaluate your diagnostic competence.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Skill Test', path: '/skill-test/' },
      { name: 'Quiz', path: '/skill-test/quiz/' }
    ]
  },
  {
    path: '/skill-test/results/',
    type: 'utility',
    indexable: false,
    sitemapPriority: 0.0,
    changefreq: 'monthly',
    schemaTypes: ['Quiz', 'BreadcrumbList'],
    titleTemplate: 'Reliability Engineer Exam Results & Scorecard | Reliability Tools',
    descriptionTemplate: 'View your reliability engineering quiz score, detailed answers breakdown, and personalized learning recommendations.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Skill Test', path: '/skill-test/' },
      { name: 'Results', path: '/skill-test/results/' }
    ]
  },

  // ==========================================
  // 7. LEGAL & COMPLIANCE (type: legal)
  // ==========================================
  {
    path: '/legal/privacy/',
    type: 'legal',
    indexable: true,
    sitemapPriority: 0.3,
    changefreq: 'monthly',
    schemaTypes: ['WebPage', 'BreadcrumbList'],
    titleTemplate: 'Privacy Policy & Data Security | Reliability Tools',
    descriptionTemplate: 'Read our privacy policy. Learn how Reliability Tools handles local browser storage, analytics data, and respects user privacy.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Legal', path: '/legal/privacy/' },
      { name: 'Privacy Policy', path: '/legal/privacy/' }
    ]
  },
  {
    path: '/legal/terms/',
    type: 'legal',
    indexable: true,
    sitemapPriority: 0.3,
    changefreq: 'monthly',
    schemaTypes: ['WebPage', 'BreadcrumbList'],
    titleTemplate: 'Terms of Service & Usage Agreement | Reliability Tools',
    descriptionTemplate: 'Terms of service, engineering calculation disclaimers, intellectual property rights, and fair usage guidelines for Reliability Tools.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Legal', path: '/legal/terms/' },
      { name: 'Terms of Service', path: '/legal/terms/' }
    ]
  },
  {
    path: '/legal/cookies/',
    type: 'legal',
    indexable: true,
    sitemapPriority: 0.3,
    changefreq: 'monthly',
    schemaTypes: ['WebPage', 'BreadcrumbList'],
    titleTemplate: 'Cookie Policy & Local Storage Notice | Reliability Tools',
    descriptionTemplate: 'Learn about our cookie usage, local client-side calculation caching, and Google Analytics tracking policies.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Legal', path: '/legal/cookies/' },
      { name: 'Cookie Policy', path: '/legal/cookies/' }
    ]
  }
];
/**
 * Normalizes any route string: ensures lowercase and trailing slash (except root)
 */
export function normalizeRoutePath(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  const clean = rawPath.toLowerCase().trim().replace(/\/+$/, '');
  return `${clean}/`;
}

/**
 * Look up a route entry by path, handling aliases (e.g. /articles/ or /blog/)
 */
export function getRouteByPath(inputPath: string): RouteRegistryEntry | undefined {
  if (!inputPath) return undefined;
  let normalized = normalizeRoutePath(inputPath);

  // Direct match
  const exact = ROUTES_REGISTRY.find(r => r.path === normalized);
  if (exact) return exact;

  // Handle article aliases: /articles/... or /blog/... -> /learning/...
  if (normalized.startsWith('/articles/') || normalized.startsWith('/blog/')) {
    const slug = normalized.split('/').filter(Boolean)[1];
    if (slug) {
      const learningPath = `/learning/${slug}/`;
      const articleMatch = ROUTES_REGISTRY.find(r => r.path === learningPath);
      if (articleMatch) return articleMatch;
    }
  }

  // Handle dynamic article route fallback if not statically registered
  if (normalized.startsWith('/learning/')) {
    const segments = normalized.split('/').filter(Boolean);
    const slug = segments[segments.length - 1];
    const formattedTitle = slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      path: normalized,
      type: 'article',
      indexable: true,
      sitemapPriority: 0.8,
      changefreq: 'weekly',
      schemaTypes: ['Article', 'BreadcrumbList'],
      titleTemplate: `${formattedTitle} | Reliability Tools`,
      descriptionTemplate: `Read our comprehensive guide on ${formattedTitle} for reliability engineers, maintenance managers, and statistical analysts.`,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Learning Center', path: '/learning/' },
        { name: formattedTitle, path: normalized }
      ]
    };
  }

  return undefined;
}

export function getIndexableRoutes(): RouteRegistryEntry[] {
  return ROUTES_REGISTRY.filter(r => r.indexable);
}

export function getCanonicalUrl(path: string): string {
  const norm = normalizeRoutePath(path);
  return `${BASE_URL}${norm}`;
}
