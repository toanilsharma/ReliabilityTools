/**
 * Centralized SEO Configuration for Reliability Tools
 * Defines unique Title (50-60 chars ending with '| Reliability Tools'),
 * Description (120-155 chars), and Canonical URL for every page.
 */

export interface PageSeoConfig {
  title: string;
  description: string;
  canonical: string;
}

export const BASE_URL = 'https://reliabilitytools.co.in';

export const SEO_CONFIG: Record<string, PageSeoConfig> = {
  // Main Site Pages
  '/': {
    title: 'Industrial Reliability Engineering Tools | Reliability Tools',
    description: 'Free industrial reliability engineering calculators for MTBF, Weibull analysis, FMEA, OEE, Availability, RBD, and PM optimization.',
    canonical: `${BASE_URL}/`
  },
  '/tools': {
    title: 'All Reliability Engineering Calculators | Reliability Tools',
    description: 'Explore our complete library of free online reliability engineering tools, calculators, and risk assessment utilities.',
    canonical: `${BASE_URL}/tools/`
  },
  '/tools/': {
    title: 'All Reliability Engineering Calculators | Reliability Tools',
    description: 'Explore our complete library of free online reliability engineering tools, calculators, and risk assessment utilities.',
    canonical: `${BASE_URL}/tools/`
  },
  '/about': {
    title: 'About Us - Industrial Reliability Experts | Reliability Tools',
    description: 'Learn about Reliability Tools, built by industrial reliability experts to provide accessible, high-precision engineering calculators.',
    canonical: `${BASE_URL}/about/`
  },
  '/about/': {
    title: 'About Us - Industrial Reliability Experts | Reliability Tools',
    description: 'Learn about Reliability Tools, built by industrial reliability experts to provide accessible, high-precision engineering calculators.',
    canonical: `${BASE_URL}/about/`
  },
  '/contact': {
    title: 'Contact Us & Support - Reliability Tools | Reliability Tools',
    description: 'Get in touch with the Reliability Tools engineering team for technical inquiries, calculation feedback, feature requests, or support.',
    canonical: `${BASE_URL}/contact/`
  },
  '/contact/': {
    title: 'Contact Us & Support - Reliability Tools | Reliability Tools',
    description: 'Get in touch with the Reliability Tools engineering team for technical inquiries, calculation feedback, feature requests, or support.',
    canonical: `${BASE_URL}/contact/`
  },
  '/downloads': {
    title: 'Reliability Engineering Templates & Files | Reliability Tools',
    description: 'Download free reliability engineering templates, Excel spreadsheets, whitepapers, and asset maintenance planning files.',
    canonical: `${BASE_URL}/downloads/`
  },
  '/downloads/': {
    title: 'Reliability Engineering Templates & Files | Reliability Tools',
    description: 'Download free reliability engineering templates, Excel spreadsheets, whitepapers, and asset maintenance planning files.',
    canonical: `${BASE_URL}/downloads/`
  },
  '/professors': {
    title: 'Free Reliability Engineering Teaching Resources | Reliability Tools',
    description: 'Free university syllabus integration guide, downloadable formula cheat sheets, and LMS Canvas/Blackboard embed snippets for engineering educators.',
    canonical: `${BASE_URL}/professors/`
  },
  '/professors/': {
    title: 'Free Reliability Engineering Teaching Resources | Reliability Tools',
    description: 'Free university syllabus integration guide, downloadable formula cheat sheets, and LMS Canvas/Blackboard embed snippets for engineering educators.',
    canonical: `${BASE_URL}/professors/`
  },
  '/press': {
    title: 'Media & Press Kit - Reliability Tools | Reliability Tools',
    description: 'Official media assets, press backgrounder, platform statistics, brand guidelines, and press contact form for Reliability Tools.',
    canonical: `${BASE_URL}/press/`
  },
  '/press/': {
    title: 'Media & Press Kit - Reliability Tools | Reliability Tools',
    description: 'Official media assets, press backgrounder, platform statistics, brand guidelines, and press contact form for Reliability Tools.',
    canonical: `${BASE_URL}/press/`
  },
  '/industries': {
    title: 'Industry-Specific Reliability Engineering Tools | Reliability Tools',
    description: 'Explore targeted maintenance calculators and reliability tools tailored for Cement, Steel, Automotive, Pharma, FMCG, and Power Generation.',
    canonical: `${BASE_URL}/industries/`
  },
  '/industries/': {
    title: 'Industry-Specific Reliability Engineering Tools | Reliability Tools',
    description: 'Explore targeted maintenance calculators and reliability tools tailored for Cement, Steel, Automotive, Pharma, FMCG, and Power Generation.',
    canonical: `${BASE_URL}/industries/`
  },
  '/industries/cement': {
    title: 'Reliability Engineering for Cement & Building Materials | Reliability Tools',
    description: 'Calculators and maintenance tools for cement plants: L10 bearing life, clinker dust abrasion, kiln downtime cost, and gearbox reliability.',
    canonical: `${BASE_URL}/industries/cement/`
  },
  '/industries/cement/': {
    title: 'Reliability Engineering for Cement & Building Materials | Reliability Tools',
    description: 'Calculators and maintenance tools for cement plants: L10 bearing life, clinker dust abrasion, kiln downtime cost, and gearbox reliability.',
    canonical: `${BASE_URL}/industries/cement/`
  },
  '/industries/steel': {
    title: 'Reliability Engineering for Steel & Primary Metals | Reliability Tools',
    description: 'Calculators for steel plants: continuous caster bearing fatigue, hot strip mill downtime cost, hydraulic contamination, and OEE.',
    canonical: `${BASE_URL}/industries/steel/`
  },
  '/industries/steel/': {
    title: 'Reliability Engineering for Steel & Primary Metals | Reliability Tools',
    description: 'Calculators for steel plants: continuous caster bearing fatigue, hot strip mill downtime cost, hydraulic contamination, and OEE.',
    canonical: `${BASE_URL}/industries/steel/`
  },
  '/industries/automotive': {
    title: 'Reliability Engineering for Automotive OEMs | Reliability Tools',
    description: 'Automotive manufacturing tools: IATF 16949 FMEA worksheets, body shop line OEE, robotic cell MTTR, and downtime cost optimization.',
    canonical: `${BASE_URL}/industries/automotive/`
  },
  '/industries/automotive/': {
    title: 'Reliability Engineering for Automotive OEMs | Reliability Tools',
    description: 'Automotive manufacturing tools: IATF 16949 FMEA worksheets, body shop line OEE, robotic cell MTTR, and downtime cost optimization.',
    canonical: `${BASE_URL}/industries/automotive/`
  },
  '/industries/pharmaceuticals': {
    title: 'Reliability Engineering for Pharmaceuticals & Life Sciences | Reliability Tools',
    description: 'Pharma manufacturing tools: 21 CFR compliance, SIL verification, cleanroom HVAC uptime, lyophilizer PM scheduling, and FMEA.',
    canonical: `${BASE_URL}/industries/pharmaceuticals/`
  },
  '/industries/pharmaceuticals/': {
    title: 'Reliability Engineering for Pharmaceuticals & Life Sciences | Reliability Tools',
    description: 'Pharma manufacturing tools: 21 CFR compliance, SIL verification, cleanroom HVAC uptime, lyophilizer PM scheduling, and FMEA.',
    canonical: `${BASE_URL}/industries/pharmaceuticals/`
  },
  '/industries/fmcg': {
    title: 'Reliability Engineering for FMCG Packaging | Reliability Tools',
    description: 'FMCG packaging line tools: micro-stoppage OEE, MRO spares EOQ, changeover setup downtime, and optimal component replacement.',
    canonical: `${BASE_URL}/industries/fmcg/`
  },
  '/industries/fmcg/': {
    title: 'Reliability Engineering for FMCG Packaging | Reliability Tools',
    description: 'FMCG packaging line tools: micro-stoppage OEE, MRO spares EOQ, changeover setup downtime, and optimal component replacement.',
    canonical: `${BASE_URL}/industries/fmcg/`
  },
  '/industries/power-generation': {
    title: 'Reliability Engineering for Power Generation & Utilities | Reliability Tools',
    description: 'Power generation tools: base-load grid availability, IEC 61511 SIL verification, turbine bearing L10 life, and K-out-of-N redundancy.',
    canonical: `${BASE_URL}/industries/power-generation/`
  },
  '/industries/power-generation/': {
    title: 'Reliability Engineering for Power Generation & Utilities | Reliability Tools',
    description: 'Power generation tools: base-load grid availability, IEC 61511 SIL verification, turbine bearing L10 life, and K-out-of-N redundancy.',
    canonical: `${BASE_URL}/industries/power-generation/`
  },
  '/learning': {
    title: 'Reliability Engineering Guides & Articles | Reliability Tools',
    description: 'Comprehensive reliability engineering guides, tutorials, and case studies on Weibull analysis, MTBF, FMEA, and spare parts.',
    canonical: `${BASE_URL}/learning/`
  },
  '/learning/': {
    title: 'Reliability Engineering Guides & Articles | Reliability Tools',
    description: 'Comprehensive reliability engineering guides, tutorials, and case studies on Weibull analysis, MTBF, FMEA, and spare parts.',
    canonical: `${BASE_URL}/learning/`
  },
  '/knowledge-hub': {
    title: 'Reliability Engineering Knowledge Hub | Reliability Tools',
    description: 'Access curated reliability engineering reference materials, standards summaries, formulas, and technical calculation guides.',
    canonical: `${BASE_URL}/knowledge-hub/`
  },
  '/knowledge-hub/': {
    title: 'Reliability Engineering Knowledge Hub | Reliability Tools',
    description: 'Access curated reliability engineering reference materials, standards summaries, formulas, and technical calculation guides.',
    canonical: `${BASE_URL}/knowledge-hub/`
  },
  '/interactive-hub': {
    title: 'Interactive Reliability Engineering Hub | Reliability Tools',
    description: 'Explore interactive reliability engineering visualizers, system architecture simulation models, and educational tools.',
    canonical: `${BASE_URL}/interactive-hub/`
  },
  '/interactive-hub/': {
    title: 'Interactive Reliability Engineering Hub | Reliability Tools',
    description: 'Explore interactive reliability engineering visualizers, system architecture simulation models, and educational tools.',
    canonical: `${BASE_URL}/interactive-hub/`
  },
  '/faq': {
    title: 'Frequently Asked Questions - Reliability | Reliability Tools',
    description: 'Find answers to common questions about reliability calculations, MTBF vs MTTF definitions, Weibull parameters, and tools.',
    canonical: `${BASE_URL}/faq/`
  },
  '/faq/': {
    title: 'Frequently Asked Questions - Reliability | Reliability Tools',
    description: 'Find answers to common questions about reliability calculations, MTBF vs MTTF definitions, Weibull parameters, and tools.',
    canonical: `${BASE_URL}/faq/`
  },
  '/reliability-engineering-glossary': {
    title: 'Reliability Engineering Glossary & Terms | Reliability Tools',
    description: 'Search our comprehensive glossary of reliability engineering terminology, statistical definitions, and maintenance acronyms.',
    canonical: `${BASE_URL}/reliability-engineering-glossary/`
  },
  '/reliability-engineering-glossary/': {
    title: 'Reliability Engineering Glossary & Terms | Reliability Tools',
    description: 'Search our comprehensive glossary of reliability engineering terminology, statistical definitions, and maintenance acronyms.',
    canonical: `${BASE_URL}/reliability-engineering-glossary/`
  },
  '/methodology': {
    title: 'Reliability Engineering Math Methodology | Reliability Tools',
    description: 'Understand the mathematical foundations, statistical distributions, and algorithms powering our reliability calculators.',
    canonical: `${BASE_URL}/methodology/`
  },
  '/methodology/': {
    title: 'Reliability Engineering Math Methodology | Reliability Tools',
    description: 'Understand the mathematical foundations, statistical distributions, and algorithms powering our reliability calculators.',
    canonical: `${BASE_URL}/methodology/`
  },
  '/skill-test': {
    title: 'Reliability Engineering Skill Test Audit | Reliability Tools',
    description: 'Test your knowledge of industrial reliability engineering, maintenance strategies, Weibull statistics, and system design.',
    canonical: `${BASE_URL}/skill-test/`
  },
  '/skill-test/': {
    title: 'Reliability Engineering Skill Test Audit | Reliability Tools',
    description: 'Test your knowledge of industrial reliability engineering, maintenance strategies, Weibull statistics, and system design.',
    canonical: `${BASE_URL}/skill-test/`
  },
  '/legal/privacy': {
    title: 'Privacy Policy & Data Security Notice | Reliability Tools',
    description: 'Read our comprehensive privacy policy regarding data protection, analytics usage, user privacy rights, and security commitments.',
    canonical: `${BASE_URL}/legal/privacy/`
  },
  '/legal/privacy/': {
    title: 'Privacy Policy & Data Security Notice | Reliability Tools',
    description: 'Read our comprehensive privacy policy regarding data protection, analytics usage, user privacy rights, and security commitments.',
    canonical: `${BASE_URL}/legal/privacy/`
  },
  '/legal/terms': {
    title: 'Terms of Service & Usage Conditions | Reliability Tools',
    description: 'Review the terms of service, acceptable use guidelines, software disclaimers, and legal conditions for using Reliability Tools.',
    canonical: `${BASE_URL}/legal/terms/`
  },
  '/legal/terms/': {
    title: 'Terms of Service & Usage Conditions | Reliability Tools',
    description: 'Review the terms of service, acceptable use guidelines, software disclaimers, and legal conditions for using Reliability Tools.',
    canonical: `${BASE_URL}/legal/terms/`
  },
  '/legal/cookies': {
    title: 'Cookie Policy & Tracking Preferences | Reliability Tools',
    description: 'Understand how Reliability Tools uses essential cookies, local storage, and privacy preferences to improve your web experience.',
    canonical: `${BASE_URL}/legal/cookies/`
  },
  '/legal/cookies/': {
    title: 'Cookie Policy & Tracking Preferences | Reliability Tools',
    description: 'Understand how Reliability Tools uses essential cookies, local storage, and privacy preferences to improve your web experience.',
    canonical: `${BASE_URL}/legal/cookies/`
  },

  // 28 Tools (Canonical format: /tools/[slug]/)
  '/tools/mtbf': {
    title: 'Free MTBF & MTTF Calculator - Failure Rate | Reliability Tools',
    description: 'Calculate Mean Time Between Failures (MTBF) and failure rates for repairable equipment using operational hours and failure data.',
    canonical: `${BASE_URL}/tools/mtbf/`
  },
  '/tools/mtbf/': {
    title: 'Free MTBF & MTTF Calculator - Failure Rate | Reliability Tools',
    description: 'Calculate Mean Time Between Failures (MTBF) and failure rates for repairable equipment using operational hours and failure data.',
    canonical: `${BASE_URL}/tools/mtbf/`
  },
  '/tools/mttr': {
    title: 'Free MTTR Calculator - Mean Time To Repair | Reliability Tools',
    description: 'Calculate Mean Time To Repair (MTTR) to analyze maintenance efficiency, reduce downtime, and improve equipment availability.',
    canonical: `${BASE_URL}/tools/mttr/`
  },
  '/tools/mttr/': {
    title: 'Free MTTR Calculator - Mean Time To Repair | Reliability Tools',
    description: 'Calculate Mean Time To Repair (MTTR) to analyze maintenance efficiency, reduce downtime, and improve equipment availability.',
    canonical: `${BASE_URL}/tools/mttr/`
  },
  '/tools/weibull': {
    title: 'Weibull Analysis Calculator - Life Data Fit | Reliability Tools',
    description: 'Perform 2-parameter Weibull distribution analysis to fit failure data, calculate shape parameter Beta, and predict component lifespan.',
    canonical: `${BASE_URL}/tools/weibull/`
  },
  '/tools/weibull/': {
    title: 'Weibull Analysis Calculator - Life Data Fit | Reliability Tools',
    description: 'Perform 2-parameter Weibull distribution analysis to fit failure data, calculate shape parameter Beta, and predict component lifespan.',
    canonical: `${BASE_URL}/tools/weibull/`
  },
  '/tools/fmea': {
    title: 'FMEA RPN Calculator & Risk Assessment Tool | Reliability Tools',
    description: 'Calculate Risk Priority Numbers (RPN) using Severity, Occurrence, and Detection scores to prioritize failure modes in system audits.',
    canonical: `${BASE_URL}/tools/fmea/`
  },
  '/tools/fmea/': {
    title: 'FMEA RPN Calculator & Risk Assessment Tool | Reliability Tools',
    description: 'Calculate Risk Priority Numbers (RPN) using Severity, Occurrence, and Detection scores to prioritize failure modes in system audits.',
    canonical: `${BASE_URL}/tools/fmea/`
  },
  '/tools/oee': {
    title: 'OEE Calculator - Equipment Effectiveness | Reliability Tools',
    description: 'Calculate Overall Equipment Effectiveness (OEE) by combining Availability, Performance, and Quality ratios to boost productivity.',
    canonical: `${BASE_URL}/tools/oee/`
  },
  '/tools/oee/': {
    title: 'OEE Calculator - Equipment Effectiveness | Reliability Tools',
    description: 'Calculate Overall Equipment Effectiveness (OEE) by combining Availability, Performance, and Quality ratios to boost productivity.',
    canonical: `${BASE_URL}/tools/oee/`
  },
  '/tools/availability': {
    title: 'System Availability Calculator & Uptime | Reliability Tools',
    description: 'Determine operational system availability percentage based on MTBF and MTTR inputs to optimize plant uptime and maintenance.',
    canonical: `${BASE_URL}/tools/availability/`
  },
  '/tools/availability/': {
    title: 'System Availability Calculator & Uptime | Reliability Tools',
    description: 'Determine operational system availability percentage based on MTBF and MTTR inputs to optimize plant uptime and maintenance.',
    canonical: `${BASE_URL}/tools/availability/`
  },
  '/tools/rbd': {
    title: 'Reliability Block Diagram RBD Calculator | Reliability Tools',
    description: 'Build Reliability Block Diagrams (RBD) to evaluate series and parallel system reliability and identify potential single points of failure.',
    canonical: `${BASE_URL}/tools/rbd/`
  },
  '/tools/rbd/': {
    title: 'Reliability Block Diagram RBD Calculator | Reliability Tools',
    description: 'Build Reliability Block Diagrams (RBD) to evaluate series and parallel system reliability and identify potential single points of failure.',
    canonical: `${BASE_URL}/tools/rbd/`
  },
  '/tools/pm': {
    title: 'Preventive Maintenance PM Scheduler Tool | Reliability Tools',
    description: 'Schedule preventive maintenance intervals based on component failure distributions and operating hours to prevent unexpected breakdown.',
    canonical: `${BASE_URL}/tools/pm/`
  },
  '/tools/pm/': {
    title: 'Preventive Maintenance PM Scheduler Tool | Reliability Tools',
    description: 'Schedule preventive maintenance intervals based on component failure distributions and operating hours to prevent unexpected breakdown.',
    canonical: `${BASE_URL}/tools/pm/`
  },
  '/tools/spares': {
    title: 'Spare Part Estimator & Safety Stock Tool | Reliability Tools',
    description: 'Calculate optimal spare part stock levels, reorder points, and safety stock buffers using Poisson and normal distribution models.',
    canonical: `${BASE_URL}/tools/spares/`
  },
  '/tools/spares/': {
    title: 'Spare Part Estimator & Safety Stock Tool | Reliability Tools',
    description: 'Calculate optimal spare part stock levels, reorder points, and safety stock buffers using Poisson and normal distribution models.',
    canonical: `${BASE_URL}/tools/spares/`
  },
  '/tools/lcc': {
    title: 'Life Cycle Cost LCC Calculator For Assets | Reliability Tools',
    description: 'Evaluate total life cycle cost (LCC) for industrial assets combining Capex, Opex, and maintenance costs over operational lifespan.',
    canonical: `${BASE_URL}/tools/lcc/`
  },
  '/tools/lcc/': {
    title: 'Life Cycle Cost LCC Calculator For Assets | Reliability Tools',
    description: 'Evaluate total life cycle cost (LCC) for industrial assets combining Capex, Opex, and maintenance costs over operational lifespan.',
    canonical: `${BASE_URL}/tools/lcc/`
  },
  '/tools/test-planner': {
    title: 'Reliability Test Planner & Sample Size | Reliability Tools',
    description: 'Calculate sample size and test duration required for zero-failure reliability demonstration testing based on confidence levels.',
    canonical: `${BASE_URL}/tools/test-planner/`
  },
  '/tools/test-planner/': {
    title: 'Reliability Test Planner & Sample Size | Reliability Tools',
    description: 'Calculate sample size and test duration required for zero-failure reliability demonstration testing based on confidence levels.',
    canonical: `${BASE_URL}/tools/test-planner/`
  },
  '/tools/assessment': {
    title: 'Reliability Maturity Assessment Audit | Reliability Tools',
    description: 'Audit facility reliability culture and operational maturity across maintenance strategy, data collection, and RCA implementation.',
    canonical: `${BASE_URL}/tools/assessment/`
  },
  '/tools/assessment/': {
    title: 'Reliability Maturity Assessment Audit | Reliability Tools',
    description: 'Audit facility reliability culture and operational maturity across maintenance strategy, data collection, and RCA implementation.',
    canonical: `${BASE_URL}/tools/assessment/`
  },
  '/tools/converter': {
    title: 'Engineering Unit Converter For Reliability | Reliability Tools',
    description: 'Convert reliability engineering units including operating hours, failure rates, time units, pressure, temperature, and power metrics.',
    canonical: `${BASE_URL}/tools/converter/`
  },
  '/tools/converter/': {
    title: 'Engineering Unit Converter For Reliability | Reliability Tools',
    description: 'Convert reliability engineering units including operating hours, failure rates, time units, pressure, temperature, and power metrics.',
    canonical: `${BASE_URL}/tools/converter/`
  },
  '/tools/optimal-replacement': {
    title: 'Optimal Replacement Age Calculator Tool | Reliability Tools',
    description: 'Determine the cost-optimal age to preventively replace equipment by balancing preventive replacement cost against failure cost.',
    canonical: `${BASE_URL}/tools/optimal-replacement/`
  },
  '/tools/optimal-replacement/': {
    title: 'Optimal Replacement Age Calculator Tool | Reliability Tools',
    description: 'Determine the cost-optimal age to preventively replace equipment by balancing preventive replacement cost against failure cost.',
    canonical: `${BASE_URL}/tools/optimal-replacement/`
  },
  '/tools/eoq': {
    title: 'Economic Order Quantity EOQ Calculator | Reliability Tools',
    description: 'Calculate Economic Order Quantity (EOQ) for maintenance spare parts to minimize annual holding costs and ordering expenses.',
    canonical: `${BASE_URL}/tools/eoq/`
  },
  '/tools/eoq/': {
    title: 'Economic Order Quantity EOQ Calculator | Reliability Tools',
    description: 'Calculate Economic Order Quantity (EOQ) for maintenance spare parts to minimize annual holding costs and ordering expenses.',
    canonical: `${BASE_URL}/tools/eoq/`
  },
  '/tools/sil': {
    title: 'SIL Verification Calculator - PFDavg Tool | Reliability Tools',
    description: 'Calculate Probability of Failure on Demand (PFDavg) for Safety Instrumented Functions to determine SIL compliance levels.',
    canonical: `${BASE_URL}/tools/sil/`
  },
  '/tools/sil/': {
    title: 'SIL Verification Calculator - PFDavg Tool | Reliability Tools',
    description: 'Calculate Probability of Failure on Demand (PFDavg) for Safety Instrumented Functions to determine SIL compliance levels.',
    canonical: `${BASE_URL}/tools/sil/`
  },
  '/tools/confidence-interval': {
    title: 'MTBF Confidence Interval Chi-Square Tool | Reliability Tools',
    description: 'Compute statistical upper and lower confidence bounds for MTBF using Chi-Square distribution for time-censored failure data.',
    canonical: `${BASE_URL}/tools/confidence-interval/`
  },
  '/tools/confidence-interval/': {
    title: 'MTBF Confidence Interval Chi-Square Tool | Reliability Tools',
    description: 'Compute statistical upper and lower confidence bounds for MTBF using Chi-Square distribution for time-censored failure data.',
    canonical: `${BASE_URL}/tools/confidence-interval/`
  },
  '/tools/k-out-of-n': {
    title: 'K-out-of-N Redundancy Calculator Tool | Reliability Tools',
    description: 'Calculate system reliability for k-out-of-n redundant architectures where at least k active units are required for success.',
    canonical: `${BASE_URL}/tools/k-out-of-n/`
  },
  '/tools/k-out-of-n/': {
    title: 'K-out-of-N Redundancy Calculator Tool | Reliability Tools',
    description: 'Calculate system reliability for k-out-of-n redundant architectures where at least k active units are required for success.',
    canonical: `${BASE_URL}/tools/k-out-of-n/`
  },
  '/tools/hazard-rate': {
    title: 'Hazard Rate & Failure Rate Calculator | Reliability Tools',
    description: 'Calculate instantaneous failure rate and reliability curves across exponential, Weibull, and normal failure distributions.',
    canonical: `${BASE_URL}/tools/hazard-rate/`
  },
  '/tools/hazard-rate/': {
    title: 'Hazard Rate & Failure Rate Calculator | Reliability Tools',
    description: 'Calculate instantaneous failure rate and reliability curves across exponential, Weibull, and normal failure distributions.',
    canonical: `${BASE_URL}/tools/hazard-rate/`
  },
  '/tools/validator': {
    title: 'System Reliability Design Audit Validator | Reliability Tools',
    description: 'Validate complex engineering designs against reliability best practices, failure mode standards, and availability principles.',
    canonical: `${BASE_URL}/tools/validator/`
  },
  '/tools/validator/': {
    title: 'System Reliability Design Audit Validator | Reliability Tools',
    description: 'Validate complex engineering designs against reliability best practices, failure mode standards, and availability principles.',
    canonical: `${BASE_URL}/tools/validator/`
  },
  '/tools/fishbone': {
    title: 'Fishbone Diagram RCA Cause & Effect Tool | Reliability Tools',
    description: 'Generate interactive Ishikawa fishbone diagrams to analyze root causes across People, Process, Machine, and Material categories.',
    canonical: `${BASE_URL}/tools/fishbone/`
  },
  '/tools/fishbone/': {
    title: 'Fishbone Diagram RCA Cause & Effect Tool | Reliability Tools',
    description: 'Generate interactive Ishikawa fishbone diagrams to analyze root causes across People, Process, Machine, and Material categories.',
    canonical: `${BASE_URL}/tools/fishbone/`
  },
  '/tools/fta': {
    title: 'Fault Tree Analysis FTA Probability Tool | Reliability Tools',
    description: 'Construct Fault Tree Analysis (FTA) models with Boolean AND/OR logic gates to calculate top-event system failure probability.',
    canonical: `${BASE_URL}/tools/fta/`
  },
  '/tools/fta/': {
    title: 'Fault Tree Analysis FTA Probability Tool | Reliability Tools',
    description: 'Construct Fault Tree Analysis (FTA) models with Boolean AND/OR logic gates to calculate top-event system failure probability.',
    canonical: `${BASE_URL}/tools/fta/`
  },
  '/tools/markov': {
    title: 'Markov Chain Reliability & State Tool | Reliability Tools',
    description: 'Model complex repairable systems using Markov chain state transition matrices to calculate steady-state system availability.',
    canonical: `${BASE_URL}/tools/markov/`
  },
  '/tools/markov/': {
    title: 'Markov Chain Reliability & State Tool | Reliability Tools',
    description: 'Model complex repairable systems using Markov chain state transition matrices to calculate steady-state system availability.',
    canonical: `${BASE_URL}/tools/markov/`
  },
  '/tools/growth': {
    title: 'Reliability Growth Crow-AMSAA Calculator | Reliability Tools',
    description: 'Track reliability improvements over time during test-find-test cycles using Crow-AMSAA Non-Homogeneous Poisson Process models.',
    canonical: `${BASE_URL}/tools/growth/`
  },
  '/tools/growth/': {
    title: 'Reliability Growth Crow-AMSAA Calculator | Reliability Tools',
    description: 'Track reliability improvements over time during test-find-test cycles using Crow-AMSAA Non-Homogeneous Poisson Process models.',
    canonical: `${BASE_URL}/tools/growth/`
  },
  '/tools/warranty': {
    title: 'Warranty Cost & Claim Exposure Predictor | Reliability Tools',
    description: 'Predict future warranty claims, failure return rates, and financial risk exposure based on early field life failure tracking data.',
    canonical: `${BASE_URL}/tools/warranty/`
  },
  '/tools/warranty/': {
    title: 'Warranty Cost & Claim Exposure Predictor | Reliability Tools',
    description: 'Predict future warranty claims, failure return rates, and financial risk exposure based on early field life failure tracking data.',
    canonical: `${BASE_URL}/tools/warranty/`
  },
  '/tools/cost-risk': {
    title: 'Cost-Risk Maintenance Optimization Tool | Reliability Tools',
    description: 'Find the economic optimum for maintenance intervals by balancing preventive maintenance expenditure against unreliability risk.',
    canonical: `${BASE_URL}/tools/cost-risk/`
  },
  '/tools/cost-risk/': {
    title: 'Cost-Risk Maintenance Optimization Tool | Reliability Tools',
    description: 'Find the economic optimum for maintenance intervals by balancing preventive maintenance expenditure against unreliability risk.',
    canonical: `${BASE_URL}/tools/cost-risk/`
  },
  '/tools/downtime-cost': {
    title: 'Downtime Cost & Financial Impact Calculator | Reliability Tools',
    description: 'Calculate total financial impact of equipment downtime including lost margin, unabsorbed labor overhead, and payback recovery period.',
    canonical: `${BASE_URL}/tools/downtime-cost/`
  },
  '/tools/downtime-cost/': {
    title: 'Downtime Cost & Financial Impact Calculator | Reliability Tools',
    description: 'Calculate total financial impact of equipment downtime including lost margin, unabsorbed labor overhead, and payback recovery period.',
    canonical: `${BASE_URL}/tools/downtime-cost/`
  },
  '/tools/bearing-life': {
    title: 'L10 Bearing Life Calculator ISO 281 | Reliability Tools',
    description: 'Calculate ISO 281 Basic Rating Life (L10 in revolutions and L10h in hours) for ball and roller bearings under dynamic loading.',
    canonical: `${BASE_URL}/tools/bearing-life/`
  },
  '/tools/bearing-life/': {
    title: 'L10 Bearing Life Calculator ISO 281 | Reliability Tools',
    description: 'Calculate ISO 281 Basic Rating Life (L10 in revolutions and L10h in hours) for ball and roller bearings under dynamic loading.',
    canonical: `${BASE_URL}/tools/bearing-life/`
  },
  '/tools/vibration-severity': {
    title: 'Vibration Severity Checker ISO 20816 | Reliability Tools',
    description: 'Evaluate machinery vibration severity (RMS mm/s) per ISO 20816-1 / ISO 10816 standards with Zone A/B/C/D classification.',
    canonical: `${BASE_URL}/tools/vibration-severity/`
  },
  '/tools/vibration-severity/': {
    title: 'Vibration Severity Checker ISO 20816 | Reliability Tools',
    description: 'Evaluate machinery vibration severity (RMS mm/s) per ISO 20816-1 / ISO 10816 standards with Zone A/B/C/D classification.',
    canonical: `${BASE_URL}/tools/vibration-severity/`
  },
  '/tools/5-why': {
    title: '5-Why Root Cause Analysis Builder | Reliability Tools',
    description: 'Build structured 5-Why root cause analysis causal chains with countermeasures and export formatted RCA reports.',
    canonical: `${BASE_URL}/tools/5-why/`
  },
  '/tools/5-why/': {
    title: '5-Why Root Cause Analysis Builder | Reliability Tools',
    description: 'Build structured 5-Why root cause analysis causal chains with countermeasures and export formatted RCA reports.',
    canonical: `${BASE_URL}/tools/5-why/`
  },
  '/tools/pareto': {
    title: 'Pareto Chart Tool 80/20 Failure Analysis | Reliability Tools',
    description: 'Perform Pareto 80/20 analysis on failure modes and downtime events with dual-axis bar and cumulative percentage charts.',
    canonical: `${BASE_URL}/tools/pareto/`
  },
  '/tools/pareto/': {
    title: 'Pareto Chart Tool 80/20 Failure Analysis | Reliability Tools',
    description: 'Perform Pareto 80/20 analysis on failure modes and downtime events with dual-axis bar and cumulative percentage charts.',
    canonical: `${BASE_URL}/tools/pareto/`
  },
  '/tools/reliability-allocation': {
    title: 'Reliability Allocation Calculator | Reliability Tools',
    description: 'Apportion top-level system reliability targets and failure rate budgets to individual subsystems using Equal Apportionment and AGREE methods.',
    canonical: `${BASE_URL}/tools/reliability-allocation/`
  },
  '/tools/reliability-allocation/': {
    title: 'Reliability Allocation Calculator | Reliability Tools',
    description: 'Apportion top-level system reliability targets and failure rate budgets to individual subsystems using Equal Apportionment and AGREE methods.',
    canonical: `${BASE_URL}/tools/reliability-allocation/`
  },
  '/tools/spc': {
    title: 'SPC & Process Capability Calculator Cpk | Reliability Tools',
    description: 'Calculate X-bar control chart limits (UCL, CL, LCL) and process capability indices (Cp, Cpk) with visual control charts.',
    canonical: `${BASE_URL}/tools/spc/`
  },
  '/tools/spc/': {
    title: 'SPC & Process Capability Calculator Cpk | Reliability Tools',
    description: 'Calculate X-bar control chart limits (UCL, CL, LCL) and process capability indices (Cp, Cpk) with visual control charts.',
    canonical: `${BASE_URL}/tools/spc/`
  },
  '/tools/rcm-decision': {
    title: 'RCM Decision Wizard SAE JA1011 | Reliability Tools',
    description: 'Interactive 7-question Reliability-Centered Maintenance decision wizard to select optimal maintenance strategies per SAE JA1011.',
    canonical: `${BASE_URL}/tools/rcm-decision/`
  },
  '/tools/rcm-decision/': {
    title: 'RCM Decision Wizard SAE JA1011 | Reliability Tools',
    description: 'Interactive 7-question Reliability-Centered Maintenance decision wizard to select optimal maintenance strategies per SAE JA1011.',
    canonical: `${BASE_URL}/tools/rcm-decision/`
  },
  '/tools/gearbox': {
    title: 'Gearbox Reliability Calculator AGMA 2001 | Reliability Tools',
    description: 'Calculate gear reliability factors, contact stress limits, and failure probability based on ANSI/AGMA 2001-D04 design standards.',
    canonical: `${BASE_URL}/tools/gearbox/`
  },
  '/tools/gearbox/': {
    title: 'Gearbox Reliability Calculator AGMA 2001 | Reliability Tools',
    description: 'Calculate gear reliability factors, contact stress limits, and failure probability based on ANSI/AGMA 2001-D04 design standards.',
    canonical: `${BASE_URL}/tools/gearbox/`
  },
  '/tools/lubricant-life': {
    title: 'Lubricant Remaining Useful Life Optimizer | Reliability Tools',
    description: 'Estimate remaining useful lubricant life using Arrhenius temperature scaling, ISO 4406 cleanliness codes, and moisture levels.',
    canonical: `${BASE_URL}/tools/lubricant-life/`
  },
  '/tools/lubricant-life/': {
    title: 'Lubricant Remaining Useful Life Optimizer | Reliability Tools',
    description: 'Estimate remaining useful lubricant life using Arrhenius temperature scaling, ISO 4406 cleanliness codes, and moisture levels.',
    canonical: `${BASE_URL}/tools/lubricant-life/`
  }
};

/**
 * Resolves SEO metadata for any pathname, including static pages, tools, and dynamic article routes.
 */
export function getSeoMetadata(pathname: string): PageSeoConfig {
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  const pathWithSlash = normalizedPath === '/' ? '/' : `${normalizedPath}/`;

  // 1. Direct match in SEO_CONFIG
  if (SEO_CONFIG[pathWithSlash]) {
    return SEO_CONFIG[pathWithSlash];
  }
  if (SEO_CONFIG[normalizedPath]) {
    return SEO_CONFIG[normalizedPath];
  }

  // 2. Dynamic Learning / Article routes (e.g. /learning/:articleId or /articles/:articleId)
  if (normalizedPath.startsWith('/learning/') || normalizedPath.startsWith('/articles/') || normalizedPath.startsWith('/blog/')) {
    const segments = normalizedPath.split('/');
    const articleSlug = segments[segments.length - 1];
    const formattedTitle = articleSlug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    
    // Ensure title ends with '| Reliability Tools' and stays between 50-60 chars
    let title = `${formattedTitle} | Reliability Tools`;
    if (title.length < 50) {
      title = `${formattedTitle} Guide | Reliability Tools`;
    }
    if (title.length > 60) {
      title = `${formattedTitle.slice(0, 37)}... | Reliability Tools`;
    }

    return {
      title,
      description: `Read our comprehensive guide on ${formattedTitle} for reliability engineers, maintenance managers, and statistical analysts.`,
      canonical: `${BASE_URL}/learning/${articleSlug}/`
    };
  }

  // 3. Fallback for any other route
  return {
    title: 'Industrial Reliability Engineering Tools | Reliability Tools',
    description: 'Free industrial reliability engineering calculators for MTBF, Weibull analysis, FMEA, OEE, Availability, RBD, and PM optimization.',
    canonical: `${BASE_URL}${pathWithSlash}`
  };
}
