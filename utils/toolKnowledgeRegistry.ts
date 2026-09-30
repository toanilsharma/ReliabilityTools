/**
 * Tool Knowledge Registry
 * Provides authoritative formulas, engineering interpretations, standard references,
 * and key metric formats for all Reliability Engineering tools on ReliabilityTools.co.in.
 */

export interface ToolKnowledge {
  formula: string;
  formulaDescription: string;
  interpretation: string;
  standards: string[];
  keyMetricName: string;
}

export const TOOL_KNOWLEDGE_REGISTRY: Record<string, ToolKnowledge> = {
  'MTBF / MTTF Calculator': {
    formula: 'MTBF = \\frac{\\text{Total Operational Time (Hours)}}{\\text{Number of Failures (F)}} \\quad ; \\quad \\lambda = \\frac{1}{\\text{MTBF}}',
    formulaDescription: 'Mean Time Between Failures for repairable systems during the constant failure rate (exponential) phase of the bathtub curve.',
    interpretation: 'A higher MTBF reflects superior component reliability and lower unscheduled downtime. Compare your calculated MTBF with IEEE 493 or OREDA benchmarks. If MTBF is declining over time, investigate root causes using Weibull analysis to check for accelerated mechanical or thermal wear-out.',
    standards: ['IEEE 493', 'MIL-HDBK-217F', 'IEC 61709'],
    keyMetricName: 'Mean Time Between Failures'
  },
  'MTBF Calculator': {
    formula: 'MTBF = \\frac{\\text{Total Operating Hours}}{\\text{Total Failures}} \\quad ; \\quad \\lambda = \\frac{1}{\\text{MTBF}}',
    formulaDescription: 'MTBF calculation assuming an exponential failure distribution with constant hazard rate \u03BB.',
    interpretation: 'Indicates the expected average operating time between corrective maintenance interventions. Use this value to size maintenance crew readiness and establish stocking levels for high-turnover wear components.',
    standards: ['IEEE 493', 'ISO 14224'],
    keyMetricName: 'MTBF'
  },
  'MTBF Confidence Interval': {
    formula: '\\theta_L = \\frac{2T}{\\chi^2_{\\alpha/2, 2r+2}} \\le \\text{MTBF} \\le \\frac{2T}{\\chi^2_{1-\\alpha/2, 2r}} = \\theta_U',
    formulaDescription: 'Chi-Square (\u03C7\u00B2) distribution two-sided confidence bounds for Poisson process failure data.',
    interpretation: 'Provides statistical certainty on failure intervals. With small sample sizes, point MTBF can be deceptive; the lower confidence bound (MTBF_L) represents the conservative design baseline recommended for safety and contractual SLAs.',
    standards: ['IEC 60605', 'MIL-HDBK-338B'],
    keyMetricName: 'Lower MTBF Bound'
  },
  'Weibull Analysis': {
    formula: 'R(t) = \\exp\\left(-\\left(\\frac{t - \\gamma}{\\eta}\\right)^\\beta\\right) \\quad ; \\quad F(t) = 1 - R(t)',
    formulaDescription: '2-Parameter and 3-Parameter Weibull cumulative reliability function, where \u03B2 is shape, \u03B7 is characteristic life, and \u03B3 is failure-free time.',
    interpretation: '\u03B2 < 1 indicates infant mortality / burn-in issues (quality control, installation error); \u03B2 \u2248 1 indicates random failures (exponential distribution, PM replacement yields no benefit); \u03B2 > 1 indicates wear-out and fatigue aging where proactive time-based preventive replacement is economically justified.',
    standards: ['ISO 14224', 'IEC 61649', 'SAE JA1000'],
    keyMetricName: 'Shape Parameter (\u03B2)'
  },
  'Availability Calculator': {
    formula: 'A_o = \\frac{\\text{MTBF}}{\\text{MTBF} + \\text{MTTR}} = \\frac{\\text{Uptime}}{\\text{Total Scheduled Operating Time}}',
    formulaDescription: 'Operational / Inherent Availability ratio factoring mean uptime and mean restoration downtime.',
    interpretation: 'Measures the probability that the system is ready for operation at any random point in time. Achieving "three-nines" (99.9%) or higher requires both proactive failure prevention (elevating MTBF) and rapid diagnostic/restoration capabilities (minimizing MTTR).',
    standards: ['ISO 14224', 'IEEE Std 3006.5', 'MIL-STD-721C'],
    keyMetricName: 'System Availability'
  },
  'MTTR Calculator': {
    formula: '\\text{MTTR} = \\frac{\\sum (\\text{Downtime Hours})}{\\text{Total Repair Events}} = \\text{Diagnostic} + \\text{Active Repair} + \\text{Test Time}',
    formulaDescription: 'Mean Time To Repair measuring maintainability and active restoration efficiency.',
    interpretation: 'High MTTR values typically point to diagnostic delays, spare parts stockouts, or poor equipment maintainability design. Reducing MTTR by 20% often yields faster availability gains than doubling MTBF.',
    standards: ['MIL-HDBK-472', 'IEC 60706'],
    keyMetricName: 'Mean Time To Repair'
  },
  'OEE Calculator': {
    formula: '\\text{OEE} = \\text{Availability} \\times \\text{Performance} \\times \\text{Quality}',
    formulaDescription: 'Overall Equipment Effectiveness measuring total operational manufacturing productivity.',
    interpretation: 'A world-class benchmark is 85% or above (typically 90% Availability, 95% Performance, 99.9% Quality). Identifying whether availability loss (breakdowns), performance loss (speed throttling), or quality defects drive losses determines whether maintenance or operations lead improvement efforts.',
    standards: ['ISO 22400', 'SEMI E10'],
    keyMetricName: 'Overall Equipment Effectiveness'
  },
  'RBD Builder': {
    formula: 'R_{\\text{series}} = \\prod_{i=1}^n R_i \\quad ; \\quad R_{\\text{parallel}} = 1 - \\prod_{i=1}^n (1 - R_i)',
    formulaDescription: 'Reliability Block Diagram modeling system network topology using Boolean reliability algebra.',
    interpretation: 'Series components represent single points of failure (bottlenecks). Adding parallel or standby redundancy substantially increases system availability but must balance capital cost and common-cause failure vulnerabilities.',
    standards: ['IEC 61078', 'ISO 14224'],
    keyMetricName: 'System Reliability'
  },
  'Spare Part Estimator': {
    formula: 'N_{\\text{demand}} = \\lambda \\times N_{\\text{fleet}} \\times T_{\\text{lead}} \\quad ; \\quad \\text{Safety Stock} = Z \\times \\sigma_L',
    formulaDescription: 'Poisson-based spare part provisioning and safety stock model under lead-time uncertainty.',
    interpretation: 'Optimizes critical spare part holding quantities to safeguard production against prolonged downtime while preventing excessive inventory holding costs and obsolete spares dead-capital.',
    standards: ['ISO 55001', 'MIL-STD-1388'],
    keyMetricName: 'Recommended Stocking'
  },
  'PM Scheduler': {
    formula: 'T_{\\text{PM}} = \\eta \\times \\left( -\\ln(R_{\\text{target}}) \\right)^{1/\\beta} \\quad ; \\quad \\text{Cost Minimization}',
    formulaDescription: 'Optimal preventive maintenance interval calculation based on Weibull wear-out kinetics.',
    interpretation: 'Replaces calendar-based guessing with data-driven overhaul intervals. Scheduled PM is only effective when Weibull shape parameter \u03B2 > 1.2; otherwise, intrusive maintenance induces infant mortality.',
    standards: ['SAE JA1011 (RCM)', 'ISO 13374'],
    keyMetricName: 'Optimal PM Interval'
  },
  'Life Cycle Cost (LCC)': {
    formula: '\\text{LCC} = \\text{CapEx} + \\sum_{t=1}^N \\frac{\\text{OpEx}_t + \\text{Maint}_t + \\text{Downtime}_t + \\text{Decom}_t}{(1 + r)^t}',
    formulaDescription: 'Net Present Value (NPV) Life Cycle Cost analysis across procurement, maintenance, and disposal.',
    interpretation: 'Up to 70\u201380% of total asset cost is incurred after initial purchase. Choosing higher-reliability components with premium CapEx frequently yields massive discounted NPV savings by curtailing repetitive downtime losses.',
    standards: ['ISO 15663', 'IEC 60300-3-3', 'BS EN 60300'],
    keyMetricName: 'Total Life Cycle NPV'
  },
  'LCC Calculator': {
    formula: '\\text{NPV} = \\text{CapEx} + \\sum_{t=1}^N \\frac{C_t}{(1 + r)^t}',
    formulaDescription: 'Discounted Cash Flow (DCF) Life Cycle Cost model.',
    interpretation: 'Validates equipment investment decisions by identifying the breakeven horizon and lowest total life cycle cost between competitive options.',
    standards: ['ISO 15663'],
    keyMetricName: 'Life Cycle Cost'
  },
  'K-out-of-N Redundancy': {
    formula: 'R_{k/n} = \\sum_{i=k}^n \\binom{n}{i} R^i (1 - R)^{n-i}',
    formulaDescription: 'Binomial reliability model for voting and partial redundancy systems.',
    interpretation: 'Crucial for multi-pump cooling loops, avionic control surfaces, and generator banks where degraded multi-unit operation maintains full process continuity.',
    standards: ['IEC 61078', 'IEEE 352'],
    keyMetricName: 'Redundancy Reliability'
  },
  'Optimal Replacement Age': {
    formula: 'C(t_p) = \\frac{C_p \\cdot R(t_p) + C_f \\cdot (1 - R(t_p))}{\\int_0^{t_p} R(t) dt}',
    formulaDescription: 'Total cost per unit time model balancing planned preventive replacement (Cp) versus emergency breakdown cost (Cf).',
    interpretation: 'Determines the exact operational age at which parts should be scrapped or refurbished to minimize cost per running hour. Valid only for assets exhibiting wear-out (\u03B2 > 1).',
    standards: ['Jardine / Glasser Cost Models', 'SAE JA1012'],
    keyMetricName: 'Optimal Replacement Age'
  },
  'FMEA RPN Calculator': {
    formula: '\\text{RPN} = \\text{Severity (S)} \\times \\text{Occurrence (O)} \\times \\text{Detection (D)} \\quad (1 \\le \\text{RPN} \\le 1000)',
    formulaDescription: 'Failure Mode and Effects Analysis Risk Priority Number ranking methodology.',
    interpretation: 'Items with High Severity (9\u201310) must be addressed with design mitigation regardless of overall RPN score. Target high RPN failure modes with redesign, poka-yoke, or condition monitoring.',
    standards: ['AIAG & VDA FMEA Handbook', 'MIL-STD-1629A', 'ISO 14971'],
    keyMetricName: 'Risk Priority Number (RPN)'
  },
  'SIL Verification (PFD)': {
    formula: '\\text{PFD}_{\\text{avg}} = \\frac{1}{2} \\lambda_{DU} \\cdot TI + \\lambda_{DD} \\cdot MTTR \\quad ; \\quad \\text{RRF} = \\frac{1}{\\text{PFD}_{\\text{avg}}}',
    formulaDescription: 'Average Probability of Failure on Demand for Safety Instrumented Systems (Low Demand mode).',
    interpretation: 'Determines Safety Integrity Level: SIL 1 (PFD 10\u207B\u00B9 to 10\u207B\u00B2), SIL 2 (10\u207B\u00B2 to 10\u207B\u00B3), SIL 3 (10\u207B\u00B3 to 10\u207B\u2074). Shorter proof-test intervals (TI) and higher diagnostic coverage are primary levers to achieve target safety thresholds.',
    standards: ['IEC 61508', 'IEC 61511', 'ISA 84'],
    keyMetricName: 'PFDavg'
  },
  'EOQ Calculator': {
    formula: '\\text{EOQ} = \\sqrt{\\frac{2 \\cdot D \\cdot S}{H}} \\quad ; \\quad \\text{Total Cost} = \\frac{D}{Q} S + \\frac{Q}{2} H',
    formulaDescription: 'Wilson Economic Order Quantity formula minimizing the sum of order setup and holding carrying costs.',
    interpretation: 'Determines the optimal purchase lot size. Ordering below EOQ increases administrative setup burden; ordering above EOQ locks up working capital in warehouse inventory.',
    standards: ['APICS / ASCM Inventory Models'],
    keyMetricName: 'Optimal Order Quantity'
  },
  'Reliability Growth Modeling': {
    formula: 'N(t) = \\lambda t^\\beta \\quad ; \\quad \\text{MTBF}(t) = \\frac{1}{\\lambda \\beta} t^{1 - \\beta}',
    formulaDescription: 'Duane / Crow-AMSAA Non-Homogeneous Poisson Process (NHPP) model for reliability growth tracking.',
    interpretation: '\u03B2 < 1 signifies positive reliability growth (corrective engineering fixes are permanently eliminating failure modes); \u03B2 = 1 indicates stagnant reliability; \u03B2 > 1 indicates degradation.',
    standards: ['MIL-HDBK-189C', 'IEC 61164'],
    keyMetricName: 'Growth Parameter (\u03B2)'
  },
  'Reliability Growth': {
    formula: 'N(t) = \\lambda t^\\beta \\quad ; \\quad \\text{MTBF}(t) = \\frac{1}{\\lambda \\beta} t^{1 - \\beta}',
    formulaDescription: 'Crow-AMSAA power law tracking instantaneous and cumulative MTBF across test-fix-test phases.',
    interpretation: 'Validates whether product development interventions are yielding demonstrable reliability improvements prior to commercial deployment.',
    standards: ['MIL-HDBK-189C'],
    keyMetricName: 'Instantaneous MTBF'
  },
  'Warranty Cost Predictor': {
    formula: 'C_{\\text{warranty}} = N_{\\text{sold}} \\cdot F(T_{\\text{warranty}}) \\cdot (C_{\\text{repair}} + C_{\\text{claims}})',
    formulaDescription: 'Actuarial warranty exposure model based on early cumulative failure distributions.',
    interpretation: 'Forecasts balance sheet reserve liabilities. Reducing early infant mortality or extending proof-run burn-in delivers immediate bottom-line warranty claim savings.',
    standards: ['SAE G-11', 'ISO 9001:2015'],
    keyMetricName: 'Projected Warranty Liability'
  },
  'Cost-Risk Optimization': {
    formula: '\\text{Total Risk} = \\text{Preventive Cost} + P_{\\text{failure}} \\times \\text{Consequence Impact}',
    formulaDescription: 'ALARP (As Low As Reasonably Practicable) cost-benefit optimization curve.',
    interpretation: 'Finds the economic inflection point where further investment in maintenance preventive actions no longer produces compensatory reductions in risk exposure.',
    standards: ['ISO 31000', 'API 580 / API 581'],
    keyMetricName: 'Optimal Maintenance Cost'
  },
  'Downtime Cost Calculator': {
    formula: '\\text{Downtime Cost} = \\text{Downtime Hours} \\times (\\text{Lost Production Rate} \\times \\text{Unit Margin} + \\text{Idle Labor} + \\text{Fixed Overhead})',
    formulaDescription: 'Comprehensive industrial breakdown financial impact accounting model.',
    interpretation: 'Translates technical reliability downtime into financial language understood by executive management, building the ROI business case for asset modernization.',
    standards: ['ISO 55000', 'SMRP Best Practices'],
    keyMetricName: 'Total Downtime Cost'
  },
  'L10 Bearing Life Calculator (ISO 281)': {
    formula: 'L_{10} = \\left( \\frac{C}{P} \\right)^p \\times 10^6 \\text{ rev} \\quad ; \\quad L_{10h} = \\frac{10^6}{60 \\cdot n} \\left( \\frac{C}{P} \\right)^p',
    formulaDescription: 'ISO 281 Basic Rating Life for rolling element bearings, where p = 3 for ball bearings and 10/3 for roller bearings.',
    interpretation: 'L10 is the operating time reached by 90% of identical bearings before rolling-contact fatigue spalling begins. If calculated L10h is insufficient, reduce dynamic equivalent load P, improve lubrication, or upgrade to a bearing with higher dynamic capacity C.',
    standards: ['ISO 281', 'ANSI/ABMA 9 / 11'],
    keyMetricName: 'L10 Life (Hours)'
  },
  'Bearing Life Calculator': {
    formula: 'L_{10h} = \\frac{10^6}{60 \\cdot n} \\left( \\frac{C}{P} \\right)^p',
    formulaDescription: 'Standard ISO 281 bearing life calculation under constant radial/axial load.',
    interpretation: 'Specifies anticipated service lifespan in operating hours. Factor in operating viscosity ratio \u03BA and contamination factor e_C for modified life L_nm per ISO 281:2007.',
    standards: ['ISO 281'],
    keyMetricName: 'Rating Life L10h'
  },
  'Vibration Severity Checker (ISO 20816)': {
    formula: 'v_{\\text{RMS}} = \\sqrt{\\frac{1}{T} \\int_0^T v^2(t) dt} \\quad (\\text{mm/s or in/s})',
    formulaDescription: 'ISO 20816-1 / ISO 10816 machinery vibration velocity overall severity classification.',
    interpretation: 'Zone A: Newly commissioned machines. Zone B: Unrestricted continuous operation. Zone C: Unsatisfactory for long-term running; alert condition. Zone D: Dangerous vibration severity capable of imminent structural or bearing catastrophic failure; trip required.',
    standards: ['ISO 20816-1', 'ISO 10816-3', 'API 670'],
    keyMetricName: 'Vibration RMS Severity'
  },
  'Gearbox Reliability (AGMA)': {
    formula: 'Z_R = \\left( \\frac{2.5 - \\log_{10}(100 - R)}{1.5} \\right)^{0.6} \\quad ; \\quad \\sigma_F \\le \\frac{\\sigma_{FP} \\cdot Y_N}{S_F \\cdot Y_\\theta \\cdot Z_R}',
    formulaDescription: 'ANSI/AGMA 2001-D04 / ISO 6336 Gear tooth pitting and bending fatigue reliability factors.',
    interpretation: 'Guarantees gear tooth contact and root fillet stress safety margins against specified operational design lifetime requirements.',
    standards: ['ANSI/AGMA 2001-D04', 'ISO 6336'],
    keyMetricName: 'AGMA Reliability Factor'
  },
  'Lubricant Life Optimizer': {
    formula: 'k(T) = A \\cdot \\exp\\left(-\\frac{E_a}{R \\cdot T}\\right) \\quad ; \\quad \\text{RUL} = \\text{Base Life} \\cdot 2^{\\frac{T_{\\text{ref}} - T}{10}} \\cdot F_{\\text{contam}}',
    formulaDescription: 'Arrhenius oxidation reaction kinetics combined with ISO 4406 particulate and moisture degradation penalties.',
    interpretation: 'Every 10\u00B0C operating temperature rise above 65\u00B0C halves mineral oil useful life. Maintaining clean, dry lubricant extends hydraulic and gearbox component life by up to 300\u2013400%.',
    standards: ['ASTM D943', 'ISO 4406', 'ISO 12937'],
    keyMetricName: 'Remaining Useful Life'
  },
  'Hazard Rate Calculator': {
    formula: 'h(t) = \\frac{f(t)}{R(t)} = -\\frac{d}{dt} \\ln R(t)',
    formulaDescription: 'Instantaneous failure rate function over operating lifetime t.',
    interpretation: 'Determines whether the system failure behavior is constant (random), increasing (aging/wear), or decreasing (infant mortality), directly dictating maintenance strategy.',
    standards: ['IEEE Std 352', 'MIL-HDBK-338B'],
    keyMetricName: 'Hazard Rate h(t)'
  },
  'Reliability Test Planner': {
    formula: 'T_{\\text{test}} = \\frac{\\chi^2_{\\alpha, 2r+2}}{2} \\cdot \\frac{\\theta_{\\text{req}}}{n}',
    formulaDescription: 'Zero-failure and failure-terminated demonstration test sizing equations.',
    interpretation: 'Calculates the exact test duration and unit sample size required to statistically validate that a product achieves its target MTBF with the requested confidence level.',
    standards: ['IEC 61124', 'MIL-HDBK-781A'],
    keyMetricName: 'Required Test Duration'
  },
  'Fault Tree Analysis': {
    formula: 'P(\\text{AND}) = \\prod_{i=1}^n P_i \\quad ; \\quad P(\\text{OR}) = 1 - \\prod_{i=1}^n (1 - P_i)',
    formulaDescription: 'Boolean algebraic quantification of Top Event system failure probability through cut sets.',
    interpretation: 'Identifies Minimal Cut Sets (MCS). Single-component cut sets represent critical common-mode vulnerabilities that necessitate hardware diversity or redundant interlocks.',
    standards: ['IEC 61025', 'NUREG-0492'],
    keyMetricName: 'Top Event Probability'
  },
  'Markov Chain Analysis': {
    formula: '\\mathbf{P} \\cdot \\mathbf{v} = \\mathbf{v} \\quad ; \\quad A_{\\text{steady}} = \\sum_{s \\in \\text{Operational}} v_s',
    formulaDescription: 'Continuous-time Markov chain transition rate matrix and steady-state availability vector.',
    interpretation: 'Models multi-state degradations and shared repair resources that cannot be modeled by simple static Reliability Block Diagrams.',
    standards: ['IEC 61165', 'IEEE 352'],
    keyMetricName: 'Steady-State Availability'
  },
  'Duval Triangle DGA Calculator': {
    formula: '\\%\\text{CH}_4 = \\frac{\\text{CH}_4}{\\Sigma} \\times 100 \\quad ; \\quad \\%\\text{C}_2\\text{H}_4 = \\frac{\\text{C}_2\\text{H}_4}{\\Sigma} \\times 100 \\quad ; \\quad \\%\\text{C}_2\\text{H}_2 = \\frac{\\text{C}_2\\text{H}_2}{\\Sigma} \\times 100',
    formulaDescription: 'Ternary relative gas concentration coordinates per IEC 60599 and IEEE C57.104 for transformer dissolved gas analysis.',
    interpretation: 'Identifies electrical sparking (D1), high-energy power arcing (D2), partial discharges (PD), and thermal faults (T1: <300°C, T2: 300-700°C, T3: >700°C) in oil-filled transformers.',
    standards: ['IEC 60599', 'IEEE C57.104', 'ASTM D3612'],
    keyMetricName: 'Fault Diagnosis'
  },
  'LOPA & SIL Determination Calculator': {
    formula: 'f_i^C = f_i^I \\times \\prod_{j=1}^m \\text{PFD}_{ij} \\quad ; \\quad \\text{RRF} = \\frac{f_i^C}{f^{\\text{tolerable}}}',
    formulaDescription: 'Layer of Protection Analysis (LOPA) mitigated consequence frequency and Risk Reduction Factor per IEC 61511 and CCPS.',
    interpretation: 'Determines the target Safety Integrity Level (SIL 1 to SIL 4) required for Safety Instrumented Functions (SIFs) to reduce process risk below tolerable risk criteria.',
    standards: ['IEC 61511', 'IEC 61508', 'CCPS LOPA'],
    keyMetricName: 'Allocated SIL'
  },
  "Miner's Rule Cumulative Fatigue Calculator": {
    formula: 'D = \\sum_{i=1}^k \\frac{n_i}{N_i} \\le D_{\\text{crit}} \\quad ; \\quad \\text{Life Consumed} = D \\times 100\\%',
    formulaDescription: 'Palmgren-Miner linear cumulative fatigue damage sum under variable amplitude cyclical stress loading.',
    interpretation: 'When cumulative damage D reaches the critical limit (typically 1.0, or 0.5 for high-criticality offshore/aero structures), macroscopic fatigue crack initiation and failure occur.',
    standards: ['ISO 12107', 'ASTM E1049', 'BS 7608'],
    keyMetricName: 'Cumulative Damage (D)'
  },
  'Error Budget & SLO Calculator': {
    formula: '\\text{Error Budget} = 1 - \\text{SLO} \\quad ; \\quad \\text{Burn Rate} = \\frac{\\text{Budget Consumed} / \\text{Window Elapsed}}{\\text{Allowed Depletion Rate}}',
    formulaDescription: 'Site Reliability Engineering (SRE) multi-window error budget consumption and burn rate equations per Google SRE / ISO 25010.',
    interpretation: 'A burn rate of 1.0 consumes 100% of the error budget over the entire window. Burn rates > 14.4 (consuming 2% budget in 1 hour) warrant immediate on-call engineer paging.',
    standards: ['ISO 25010', 'IEEE 730', 'Google SRE'],
    keyMetricName: 'Remaining Budget'
  },
  'API 570 UT Remaining Life Calculator': {
    formula: 'C_r = \\frac{t_{\\text{prev}} - t_{\\text{act}}}{\\Delta T} \\quad ; \\quad \\text{RUL} = \\frac{t_{\\text{act}} - t_{\\text{min}}}{C_r} \\quad ; \\quad I_{\\text{half-life}} = \\min\\left(\\frac{\\text{RUL}}{2}, I_{\\text{max}}\\right)',
    formulaDescription: 'API 570 piping corrosion rate, remaining useful life, and statutory half-life inspection interval formulas.',
    interpretation: 'Calculates the years until pipe wall thickness reaches structural/pressure minimum limit t_min. Inspection must occur at or before half remaining life (capped at 5-10 years by service class).',
    standards: ['API 570', 'API 574', 'ASME B31.3'],
    keyMetricName: 'Remaining Life (Years)'
  },
  'NPSH Cavitation Calculator': {
    formula: '\\text{NPSHa} = \\frac{P_{\\text{suct}} - P_{\\text{vap}}}{\\rho \\cdot g} \\pm Z_s - h_f \\quad ; \\quad \\text{Margin Ratio} = \\frac{\\text{NPSHa}}{\\text{NPSHr}}',
    formulaDescription: 'Net Positive Suction Head Available (NPSHa) and Cavitation Margin Ratio per ANSI/HI 9.6.1 and API 610.',
    interpretation: 'NPSHa must exceed NPSHr by the recommended margin (1.1x for general water, 1.3-1.5x for hydrocarbons, 2.0x for slurries) to prevent impeller cavitation erosion and vibration.',
    standards: ['ANSI/HI 9.6.1', 'ISO 9906', 'API 610'],
    keyMetricName: 'Cavitation Margin'
  },
  'Parts-Count MTBF Reliability Prediction': {
    formula: '\\lambda_{\\text{equip}} = \\sum_{i=1}^n N_i \\cdot (\\lambda_{g,i} \\cdot \\pi_{Q,i}) \\cdot \\pi_E \\quad ; \\quad \\text{MTBF} = \\frac{10^9}{\\text{FITs}}',
    formulaDescription: 'MIL-HDBK-217F and Telcordia SR-332 parts-count reliability prediction method for electronic hardware systems.',
    interpretation: 'Predicts system failure rate based on bill of materials (BOM) component counts, operating environmental stress factors (Ground Benign, Airborne, Naval), and quality procurement grades.',
    standards: ['MIL-HDBK-217F', 'Telcordia SR-332', 'IEC 61709'],
    keyMetricName: 'Predicted MTBF'
  },
  'IEEE 762 EAF & EFOR Calculator': {
    formula: '\\text{EAF} = \\frac{\\text{SH} - (\\text{FOH} + \\text{POH} + \\text{MOH}) - (\\text{EFDH} + \\text{EPDH})}{\\text{PH}} \\times 100\\% \\quad ; \\quad \\text{EFOR} = \\frac{\\text{FOH} + \\text{EFDH}}{\\text{SH} + \\text{FOH} + \\text{EFDH}} \\times 100\\%',
    formulaDescription: 'Equivalent Availability Factor (EAF) and Equivalent Forced Outage Rate (EFOR) per IEEE Standard 762 and NERC GADS.',
    interpretation: 'EAF measures commercial generation availability accounting for both complete outages and partial capacity deratings. EFOR measures reliability risk during operating demand periods.',
    standards: ['IEEE 762', 'NERC GADS', 'ISO 3977'],
    keyMetricName: 'Equivalent Availability (EAF)'
  },
  'P-F Interval Optimization Calculator': {
    formula: 'T_{\\text{opt}} \\le \\frac{P\\text{-}F \\text{ Interval}}{n} \\quad ; \\quad \\text{Net Savings} = \\text{Avoided Failure Costs} - \\text{PdM Task Cost}',
    formulaDescription: 'Condition monitoring inspection frequency optimization along the P-F degradation curve per SAE JA1011 and SAE JA1012.',
    interpretation: 'Inspection frequency must be small enough (typically P-F/2 for non-critical, P-F/3 or P-F/4 for critical) to guarantee detection of potential failure (P) before functional breakdown (F).',
    standards: ['SAE JA1011', 'SAE JA1012', 'ISO 55000'],
    keyMetricName: 'Optimal Inspection Interval'
  },
  'CPM Turnaround & Shutdown Calculator': {
    formula: '\\text{ES} + D = \\text{EF} \\quad ; \\quad \\text{LF} - D = \\text{LS} \\quad ; \\quad \\text{Total Float} = \\text{LS} - \\text{ES} = \\text{LF} - \\text{EF}',
    formulaDescription: 'Critical Path Method (CPM) forward and backward pass equations for turnaround and overhaul outage scheduling.',
    interpretation: 'Activities with Total Float = 0 define the Critical Path. Any delay on these tasks directly prolongs total plant outage duration and accrues substantial daily downtime revenue losses.',
    standards: ['ISO 21500', 'PMI PMBOK', 'AACE International 29R-03'],
    keyMetricName: 'Project Duration'
  }
};

/**
 * Helper to retrieve knowledge by tool name or path
 */
export function getToolKnowledge(toolName?: string): ToolKnowledge {
  const fallback: ToolKnowledge = {
    formula: 'R(t) = \\exp\\left(-\\int_0^t \\lambda(u) du\\right) \\quad ; \\quad \\text{Reliability Engineering Model}',
    formulaDescription: 'Standard mathematical formulation conforming to industrial reliability engineering principles.',
    interpretation: 'The calculated metrics provide direct technical insight into component and system performance under active operational conditions. Review historical failure records and asset maintenance logs to benchmark outcomes against target KPIs.',
    standards: ['ISO 14224', 'IEC 60300', 'IEEE Standards'],
    keyMetricName: 'Calculated Metric'
  };

  if (!toolName || typeof toolName !== 'string') {
    return fallback;
  }

  if (TOOL_KNOWLEDGE_REGISTRY[toolName]) {
    return TOOL_KNOWLEDGE_REGISTRY[toolName];
  }

  // Attempt fuzzy match
  const normalized = toolName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!normalized) {
    return fallback;
  }

  for (const [key, val] of Object.entries(TOOL_KNOWLEDGE_REGISTRY)) {
    const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized.includes(keyNorm) || keyNorm.includes(normalized)) {
      return val;
    }
  }

  return fallback;
}
