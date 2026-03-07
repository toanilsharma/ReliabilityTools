
import React from 'react';
import { NavigationItem, ToolDefinition, FAQItem, LearningArticle } from './types';
import { ARTICLES as dataArticles } from './data/articles';

export const AUTHOR_NAME = "Anil Sharma";
export const AUTHOR_BIO = "Technical professional with over 25 years of experience in improving system reliability, predictive maintenance and lifecycle analysis for industrial applications.";
export const CONTACT_EMAIL = "info.onesharma@gmail.com";

export const SERVICE_LEVELS = [
  { label: '90%', z: 1.28 },
  { label: '95%', z: 1.645 },
  { label: '98%', z: 2.05 },
  { label: '99%', z: 2.33 },
  { label: '99.9%', z: 3.09 },
];

export const TOOLS: ToolDefinition[] = [
  {
    id: 'mtbf',
    name: 'MTBF / MTTF Calculator',
    description: 'Calculate Mean Time Between Failures based on operational hours and failure counts.',
    path: '/mtbf-calculator',
    category: 'Calculator'
  },
  {
    id: 'confidence-interval',
    name: 'MTBF Confidence Interval',
    description: 'Calculate the statistical range (Lower/Upper bounds) of your MTBF using Chi-Square distribution.',
    path: '/tools/confidence-interval',
    category: 'Analysis'
  },
  {
    id: 'k-out-of-n',
    name: 'K-out-of-N Redundancy',
    description: 'Calculate reliability for complex redundancy systems where k units out of n must operate.',
    path: '/tools/k-out-of-n',
    category: 'Analysis'
  },
  {
    id: 'optimal-replacement',
    name: 'Optimal Replacement Age',
    description: 'Calculate the exact time to preventively replace a part to minimize total cost (Cp vs Cf).',
    path: '/tools/optimal-replacement',
    category: 'Planning'
  },
  {
    id: 'fmea-calculator',
    name: 'FMEA RPN Calculator',
    description: 'Quickly calculate Risk Priority Numbers (Severity × Occurrence × Detection) with risk highlighting.',
    path: '/fmea-tool',
    category: 'Analysis'
  },
  {
    id: 'sil-verification',
    name: 'SIL Verification (PFD)',
    description: 'Calculate Probability of Failure on Demand (PFDavg) for Safety Instrumented Functions.',
    path: '/tools/sil',
    category: 'Analysis'
  },
  {
    id: 'eoq',
    name: 'EOQ Calculator',
    description: 'Determine the Economic Order Quantity for spares to balance holding and ordering costs.',
    path: '/tools/eoq',
    category: 'Planning'
  },
  {
    id: 'weibull',
    name: 'Weibull Analysis',
    description: 'Fit life data to a Weibull distribution to determine characteristic life and failure modes.',
    path: '/weibull-analysis',
    category: 'Analysis'
  },
  {
    id: 'converter',
    name: 'Engineering Unit Converter',
    description: 'Quick conversions for Reliability (Hours/Years), Temperature, Pressure, and Power.',
    path: '/tools/converter',
    category: 'Calculator'
  },
  {
    id: 'availability',
    name: 'Availability Calculator',
    description: 'Determine system availability using MTBF and MTTR inputs.',
    path: '/tools/availability',
    category: 'Calculator'
  },
  {
    id: 'mttr',
    name: 'MTTR Calculator',
    description: 'Calculate Mean Time To Repair and analyze the impact on production uptime.',
    path: '/tools/mttr',
    category: 'Calculator'
  },
  {
    id: 'lcc',
    name: 'Life Cycle Cost (LCC)',
    description: 'Compare the Total Cost of Ownership (Capex + Opex) of assets over their lifespan.',
    path: '/tools/lcc',
    category: 'Planning'
  },
  {
    id: 'oee',
    name: 'OEE Calculator',
    description: 'Calculate Overall Equipment Effectiveness (Availability × Performance × Quality).',
    path: '/oee-calculator',
    category: 'Calculator'
  },
  {
    id: 'rbd',
    name: 'RBD Builder',
    description: 'Reliability Block Diagram tool to model complex system reliability (Series/Parallel).',
    path: '/tools/rbd',
    category: 'Analysis'
  },
  {
    id: 'spares',
    name: 'Spare Part Estimator',
    description: 'Estimate spare part consumption and reorder points based on failure rates.',
    path: '/tools/spares',
    category: 'Planning'
  },
  {
    id: 'pm',
    name: 'PM Scheduler',
    description: 'Simple Preventive Maintenance scheduling tool based on usage intervals.',
    path: '/tools/pm',
    category: 'Planning'
  },
  {
    id: 'test-planner',
    name: 'Reliability Test Planner',
    description: 'Calculate required sample sizes and test durations to demonstrate reliability targets (Zero-Failure).',
    path: '/tools/test-planner',
    category: 'Planning'
  },
  {
    id: 'assessment',
    name: 'Maturity Assessment',
    description: 'Interactive audit tool to score your facility\'s reliability culture and processes.',
    path: '/tools/assessment',
    category: 'Analysis'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "What is the difference between MTBF and MTTF?",
    answer: "MTBF (Mean Time Between Failures) is used for repairable systems, indicating the average time between breakdowns. MTTF (Mean Time To Failure) is used for non-repairable items (like light bulbs), indicating the average time until the item fails permanently."
  },
  {
    question: "How do I interpret the Weibull Beta shape parameter?",
    answer: "A Beta < 1 indicates infant mortality (early failures). Beta = 1 indicates random/constant failure rate (useful life). Beta > 1 indicates wear-out failures (end of life)."
  },
  {
    question: "Why is my system availability lower than expected?",
    answer: "Availability is heavily influenced by MTTR (Mean Time To Repair). Even with a high MTBF, if it takes a long time to repair the asset, availability drops significantly. Focus on logistics and technician training to reduce MTTR."
  },
  {
    question: "Can I use these tools for safety-critical calculations?",
    answer: "No. These tools are for educational and informational purposes only. Safety-critical systems require certified software and rigorous validation processes that web-based calculators cannot guarantee."
  },
  {
    question: "What distribution is best for spare parts?",
    answer: "For slow-moving spare parts, the Poisson distribution is often used. For fast-moving consumables, the Normal distribution is generally acceptable. Our estimator uses a Normal approximation for simplicity but includes a safety stock buffer."
  }
];

export const ARTICLES: LearningArticle[] = dataArticles;

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'General' | 'Statistics' | 'Maintenance';
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'ALARP', definition: 'As Low As Reasonably Practicable. A principle establishing that a risk is only acceptable if it is impractical or too costly to reduce it further.', category: 'Statistics' },
  { term: 'Asset Criticality', definition: 'A systematic method of assigning a risk rating to assets based on the probability and consequence of their failure. Used to prioritize maintenance tasks.', category: 'Maintenance' },
  { term: 'Availability', definition: 'The probability that a system is operating satisfactorily at any point in time. It is a function of reliability (MTBF) and maintainability (MTTR).', category: 'General' },
  { term: 'Bathtub Curve', definition: 'A hazard rate curve representing the lifecycle of an asset, characterized by three phases: Infant Mortality (decreasing failure rate), Useful Life (constant failure rate), and Wear-out (increasing failure rate).', category: 'General' },
  { term: 'Beta (β)', definition: 'The "Shape Parameter" in Weibull analysis. It indicates the physics of failure: β < 1 (Early Life), β = 1 (Random), β > 1 (Wear-out).', category: 'Statistics' },
  { term: 'B10 Life', definition: 'The time at which 10% of a population is expected to fail (or 90% reliability). Commonly used for bearings and warranty analysis.', category: 'Statistics' },
  { term: 'BOM', definition: 'Bill of Materials. A comprehensive list of parts, items, assemblies, and other materials required to create a product or repair an asset.', category: 'General' },
  { term: 'Censored Data', definition: 'Data points in a survival analysis where the unit has not failed yet (suspended) or failed due to a different cause. Critical for accurate Weibull results.', category: 'Statistics' },
  { term: 'CM', definition: 'Corrective Maintenance. Maintenance performed after a fault or failure has occurred, intended to restore an asset to an operational condition.', category: 'Maintenance' },
  { term: 'CMMS', definition: 'Computerized Maintenance Management System. Software used to track maintenance, manage work orders, and organize maintenance operations.', category: 'Maintenance' },
  { term: 'COF', definition: 'Consequence of Failure. An evaluation of the impact an asset failure has on safety, environment, production, and maintenance costs.', category: 'Maintenance' },
  { term: 'Condition Monitoring (CbM)', definition: 'The process of monitoring a parameter of condition in machinery (vibration, temperature etc.) to identify a significant change which is indicative of a developing fault.', category: 'Maintenance' },
  { term: 'EAM', definition: 'Enterprise Asset Management. Holistic management of physical assets throughout their lifecycle, often extending beyond maintenance to include procurement and operations.', category: 'Maintenance' },
  { term: 'ETA', definition: 'Event Tree Analysis. A forward, top-down, logical modeling technique for exploring responses through a single initiating event and laying out possible outcomes.', category: 'Statistics' },
  { term: 'Failure Rate (λ)', definition: 'The frequency with which an engineered system or component fails, expressed in failures per unit of time. It is the inverse of MTBF (for constant failure rate systems).', category: 'Statistics' },
  { term: 'FMEA', definition: 'Failure Modes and Effects Analysis. A systematic, proactive method for evaluating a process to identify where and how it might fail and assessing the relative impact of different failures.', category: 'Maintenance' },
  { term: 'FMECA', definition: 'Failure Modes, Effects, and Criticality Analysis. An extension of FMEA that includes a criticality analysis to chart the probability of failure modes against the severity of their consequences.', category: 'Maintenance' },
  { term: 'FRACAS', definition: 'Failure Reporting, Analysis, and Corrective Action System. A closed-loop process for reporting failures, analyzing their root causes, and implementing corrective actions.', category: 'Maintenance' },
  { term: 'FTA', definition: 'Fault Tree Analysis. A top-down, deductive failure analysis in which an undesired state of a system is analyzed using Boolean logic to combine a series of lower-level events.', category: 'Statistics' },
  { term: 'Hazard Rate', definition: 'The instantaneous probability of failure at a specific time t, given that the unit has survived until time t.', category: 'Statistics' },
  { term: 'Infant Mortality', definition: 'A period of high failure rate early in an asset\'s life, typically caused by manufacturing defects, poor installation, or startup issues.', category: 'Maintenance' },
  { term: 'LCC', definition: 'Life Cycle Cost. The total cost of ownership of an asset, including acquisition, operation, maintenance, and disposal costs over its entire life.', category: 'General' },
  { term: 'LOTO', definition: 'Lockout/Tagout. Safety procedures to ensure that equipment is properly shut off and not able to be started up again prior to the completion of maintenance or repair work.', category: 'General' },
  { term: 'MTBC', definition: 'Mean Time Between Crashes. Typically used in software reliability equivalent to MTBF for hardware.', category: 'General' },
  { term: 'MTBF', definition: 'Mean Time Between Failures. The average expected time between repairable failures of a system during normal operation.', category: 'General' },
  { term: 'MTTF', definition: 'Mean Time To Failure. The average expected time to failure for a non-repairable component (e.g., a light bulb).', category: 'General' },
  { term: 'MTTR', definition: 'Mean Time To Repair. The average time required to troubleshoot and repair a failed component and return it to service.', category: 'General' },
  { term: 'NDT', definition: 'Non-Destructive Testing. Inspection methods used to evaluate the properties of a material, component, or system without causing damage.', category: 'Maintenance' },
  { term: 'OEM', definition: 'Original Equipment Manufacturer. The company that originally manufactured the equipment or its components.', category: 'General' },
  { term: 'OEE', definition: 'Overall Equipment Effectiveness. A hierarchy of metrics (Availability, Performance, Quality) that measures how effectively a manufacturing operation is utilized.', category: 'Maintenance' },
  { term: 'O&M', definition: 'Operations and Maintenance. The functions, duties, and labor associated with daily operations and normal repairs.', category: 'Maintenance' },
  { term: 'Pareto Principle', definition: 'The 80/20 rule. In maintenance, it typically observes that 20% of assets cause 80% of the downtime and costs.', category: 'General' },
  { term: 'P-F Interval', definition: 'The time interval between the detection of a potential failure (P) and the actual functional failure (F).', category: 'Maintenance' },
  { term: 'PFD', definition: 'Probability of Failure on Demand. A value that indicates the probability that a system will fail to perform a specified safety function when called upon.', category: 'Statistics' },
  { term: 'POF', definition: 'Probability of Failure. The likelihood that an asset will fail within a specified timeframe.', category: 'Maintenance' },
  { term: 'Preventive Maintenance (PM)', definition: 'Maintenance performed on a scheduled basis (time or cycle count) to reduce the probability of failure.', category: 'Maintenance' },
  { term: 'Predictive Maintenance (PdM)', definition: 'Maintenance techniques designed to help determine the condition of in-service equipment in order to estimate when maintenance should be performed.', category: 'Maintenance' },
  { term: 'RAMS', definition: 'Reliability, Availability, Maintainability, and Safety. A unified engineering discipline integrating all these aspects to ensure a system meets operational requirements safely.', category: 'General' },
  { term: 'RBM', definition: 'Risk-Based Maintenance. A methodology where maintenance resources are directed toward assets that have the highest combination of failure probability and failure consequence.', category: 'Maintenance' },
  { term: 'RBD', definition: 'Reliability Block Diagram. A graphical representation of the reliability-wise connection of components (Series/Parallel) needed for a system to operate.', category: 'Statistics' },
  { term: 'RCA', definition: 'Root Cause Analysis. A method of problem solving used for identifying the root causes of faults or problems.', category: 'Maintenance' },
  { term: 'RCM', definition: 'Reliability Centered Maintenance. A structured process to determine the maintenance strategies required to ensure physical assets continue to do what their users want them to do.', category: 'Maintenance' },
  { term: 'Reliability', definition: 'The probability that an item will perform its intended function for a specific interval under stated conditions.', category: 'General' },
  { term: 'RPN', definition: 'Risk Priority Number. A numeric assessment of risk assigned to a process, or steps in a process, as part of FMEA (Severity × Occurrence × Detection).', category: 'General' },
  { term: 'RTF', definition: 'Run to Failure. A maintenance strategy where no deliberate maintenance is performed and the equipment is allowed to fail before repair or replacement happens.', category: 'Maintenance' },
  { term: 'SCADA', definition: 'Supervisory Control and Data Acquisition. A control system architecture comprising computers, networked data communications, and GUIs for high-level process supervisory management.', category: 'Maintenance' },
  { term: 'SIL', definition: 'Safety Integrity Level. A relative level of risk-reduction provided by a safety function, ranging from SIL 1 (lowest) to SIL 4 (highest).', category: 'General' },
  { term: 'TBM', definition: 'Time-Based Maintenance. A form of preventive maintenance in which servicing of machinery occurs at calendar or runtime intervals.', category: 'Maintenance' },
  { term: 'TPM', definition: 'Total Productive Maintenance. A system of maintaining and improving the integrity of production and quality systems through the machines, equipment, processes, and employees.', category: 'Maintenance' },
  { term: 'Weibull Distribution', definition: 'A continuous probability distribution used to analyze life data and determine failure modes, capable of modeling infant mortality, random failures, and wear-out.', category: 'Statistics' },
  { term: 'Weibull Analysis', definition: 'A statistical method used to interpret life data (failures and running times) to forecast failure trends and determine the optimal replacement time for parts.', category: 'Statistics' },
];

export const ASSET_BENCHMARKS = {
  'Centrifugal Pump': { range: '17,500 - 35,000 Hours', note: 'Highly dependent on seal and bearing application.' },
  'Electric Motor (AC)': { range: '30,000 - 50,000 Hours', note: 'Varies by insulation class, load, and temperature.' },
  'VFD (Variable Freq Drive)': { range: '40,000 - 80,000 Hours', note: 'DC Bus capacitor aging is the primary driver.' },
  'Transformer (Dry Type)': { range: '80,000 - 120,000 Hours', note: 'Temperature is the key stressor for insulation.' },
  'PLC Module': { range: '100,000+ Hours', note: 'Solid state electronics are generally highly reliable.' },
  'Control Valve': { range: '10,000 - 25,000 Hours', note: 'Diaphragm and positioner wear reduces life.' }
};
