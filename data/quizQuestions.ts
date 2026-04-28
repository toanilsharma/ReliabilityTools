import { QuizQuestion } from '../types';
import { quizQuestions2 } from './quizQuestions2';
import { quizQuestionsMechanical } from './quizQuestionsMechanical';
import { quizQuestionsElectrical } from './quizQuestionsElectrical';
import { quizQuestionsInstrumentation } from './quizQuestionsInstrumentation';

const quizQuestions1: QuizQuestion[] = [
  // Easy (1-40)
  {
    id: 1,
    text: "What does MTBF stand for?",
    options: ["Mean Time Between Failures", "Maximum Time Before Failure", "Minimum Time Between Fixes", "Mean Time Before Fixing"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "MTBF stands for Mean Time Between Failures, a key reliability metric for repairable systems."
  },
  {
    id: 2,
    text: "What does MTTR stand for?",
    options: ["Mean Time To Restore", "Mean Time To Repair", "Maximum Time To Repair", "Both A and B"],
    correctAnswer: 3,
    difficulty: "easy",
    explanation: "MTTR can stand for Mean Time To Repair or Mean Time To Restore/Recover."
  },
  {
    id: 3,
    text: "Which of the following describes the 'Infant Mortality' phase of the Bathtub Curve?",
    options: ["Decreasing failure rate", "Constant failure rate", "Increasing failure rate", "Zero failure rate"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "The Infant Mortality phase is characterized by a decreasing failure rate as defective components fail early and are replaced."
  },
  {
    id: 4,
    text: "In the Bathtub Curve, the 'Useful Life' period has what kind of failure rate?",
    options: ["Increasing", "Decreasing", "Constant", "Exponential"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "The Useful Life period features a constant, random failure rate."
  },
  {
    id: 5,
    text: "What does FMEA stand for?",
    options: ["Failure Mode and Effects Analysis", "Fault Management and Evaluation Analysis", "Failure Method and Error Analysis", "Fault Mode and Effectiveness Analysis"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "FMEA stands for Failure Mode and Effects Analysis, a systematic method for evaluating possible failures."
  },
  {
    id: 6,
    text: "Which maintenance strategy involves fixing equipment only after it has broken down?",
    options: ["Preventive Maintenance", "Predictive Maintenance", "Reactive Maintenance", "Proactive Maintenance"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Reactive (or run-to-failure) maintenance means waiting for equipment to fail before repairing it."
  },
  {
    id: 7,
    text: "What does OEE stand for in manufacturing?",
    options: ["Overall Equipment Effectiveness", "Operational Equipment Efficiency", "Overall Engineering Effectiveness", "Optimal Equipment Efficiency"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "OEE stands for Overall Equipment Effectiveness, a standard for measuring manufacturing productivity."
  },
  {
    id: 8,
    text: "Which of the following is NOT a component of OEE?",
    options: ["Availability", "Performance", "Quality", "Safety"],
    correctAnswer: 3,
    difficulty: "easy",
    explanation: "OEE is calculated as Availability × Performance × Quality. Safety is not part of the OEE calculation."
  },
  {
    id: 9,
    text: "A component has a constant failure rate. Its reliability over time follows which distribution?",
    options: ["Normal", "Lognormal", "Exponential", "Weibull (beta > 1)"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "A constant failure rate corresponds to the exponential distribution."
  },
  {
    id: 10,
    text: "Which type of maintenance relies on condition monitoring (e.g., vibration analysis)?",
    options: ["Preventive Maintenance", "Predictive Maintenance", "Run-to-Failure", "Time-Based Maintenance"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Predictive Maintenance (PdM) uses condition monitoring to predict failures before they occur."
  },
  {
    id: 11,
    text: "In reliability block diagrams (RBD), components in series imply that:",
    options: ["All components must function for the system to function.", "Only one component must function.", "Failure of one component has no effect.", "The system is redundant."],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "In a series system, the failure of any single component causes the entire system to fail."
  },
  {
    id: 12,
    text: "What does RCA stand for?",
    options: ["Reliability Condition Analysis", "Root Cause Analysis", "Risk Control Assessment", "Reliability Centered Actions"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "RCA stands for Root Cause Analysis, a method of problem solving used for identifying the root causes of faults or problems."
  },
  {
    id: 13,
    text: "What is the primary goal of Reliability Centered Maintenance (RCM)?",
    options: ["To minimize maintenance costs", "To maximize equipment availability", "To preserve system function", "To eliminate all failures"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "RCM focuses on preserving system functions, rather than just keeping equipment running for the sake of it."
  },
  {
    id: 14,
    text: "Which ISO standard pertains to Asset Management?",
    options: ["ISO 9001", "ISO 14001", "ISO 55000", "ISO 31000"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "ISO 55000 is the international standard for Asset Management."
  },
  {
    id: 15,
    text: "What is the reciprocal of MTBF (for a constant failure rate)?",
    options: ["Reliability", "Availability", "Failure Rate (Lambda)", "MTTR"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Failure rate (λ) is the reciprocal of MTBF (λ = 1 / MTBF)."
  },
  {
    id: 16,
    text: "A system's ability to be retained in, or restored to, a specific state is called:",
    options: ["Reliability", "Maintainability", "Availability", "Durability"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Maintainability is the probability that a failed component will be restored to operational condition within a period of time."
  },
  {
    id: 17,
    text: "If a system is available 99% of the time, what is its Availability?",
    options: ["0.01", "0.99", "9.9", "99"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Availability is expressed as a ratio or probability, so 99% is 0.99."
  },
  {
    id: 18,
    text: "In the context of the P-F curve, what does 'P' stand for?",
    options: ["Potential failure", "Probability", "Performance", "Predictive"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "The 'P' stands for Potential failure, the point at which degradation is first detectable."
  },
  {
    id: 19,
    text: "In the P-F curve, what does 'F' stand for?",
    options: ["Frequency", "Functional failure", "Fault", "Fix"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "The 'F' stands for Functional failure, the point where the asset can no longer perform its intended function."
  },
  {
    id: 20,
    text: "Which of these is a common method for identifying root causes?",
    options: ["5 Whys", "Pareto Analysis", "Fishbone Diagram", "All of the above"],
    correctAnswer: 3,
    difficulty: "easy",
    explanation: "5 Whys, Pareto, and Fishbone (Ishikawa) are all common RCA tools."
  },
  {
    id: 21,
    text: "What does RPN stand for in FMEA?",
    options: ["Reliability Priority Number", "Risk Priority Number", "Relative Performance Number", "Risk Probability Number"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "RPN stands for Risk Priority Number, used to prioritize failure modes."
  },
  {
    id: 22,
    text: "How is RPN calculated?",
    options: ["Severity + Occurrence + Detection", "Severity × Occurrence × Detection", "Severity / Occurrence", "(Severity × Occurrence) / Detection"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "RPN = Severity × Occurrence × Detection."
  },
  {
    id: 23,
    text: "What does TPM stand for?",
    options: ["Total Productive Maintenance", "Time-Based Preventive Maintenance", "Total Plant Management", "Total Performance Metrics"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "TPM stands for Total Productive Maintenance, a holistic approach to equipment maintenance."
  },
  {
    id: 24,
    text: "Which of the following is NOT one of the 'Six Big Losses' in TPM?",
    options: ["Equipment Failure", "Setup and Adjustments", "Scheduled Maintenance", "Reduced Speed"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Scheduled Maintenance is planned downtime, not considered one of the Six Big Losses which hurt OEE."
  },
  {
    id: 25,
    text: "What is 'Availability' a measure of?",
    options: ["The probability a system will not fail", "The percentage of time a system is capable of performing its function", "The speed at which a system is repaired", "The total lifespan of an asset"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Availability is the proportion of time a system is in a functioning condition."
  },
  {
    id: 26,
    text: "If MTBF increases and MTTR remains the same, what happens to Availability?",
    options: ["Increases", "Decreases", "Stays the same", "Cannot be determined"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "Availability = MTBF / (MTBF + MTTR). Increasing MTBF increases Availability."
  },
  {
    id: 27,
    text: "If MTTR increases and MTBF remains the same, what happens to Availability?",
    options: ["Increases", "Decreases", "Stays the same", "Cannot be determined"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Availability = MTBF / (MTBF + MTTR). Increasing MTTR decreases Availability."
  },
  {
    id: 28,
    text: "Which analysis uses a top-down, deductive approach to find the causes of a system failure?",
    options: ["FMEA", "RCA", "Fault Tree Analysis (FTA)", "Weibull Analysis"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Fault Tree Analysis is a top-down deductive failure analysis using Boolean logic."
  },
  {
    id: 29,
    text: "What is the shape parameter denoted by in Weibull Analysis?",
    options: ["Alpha (α)", "Beta (β)", "Gamma (γ)", "Lambda (λ)"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "The shape parameter in Weibull analysis is denoted by Beta (β)."
  },
  {
    id: 30,
    text: "What does an Ishikawa diagram resemble?",
    options: ["A bathtub", "A tree", "A fishbone", "A pyramid"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Ishikawa diagrams are also known as Fishbone diagrams because of their shape."
  },
  {
    id: 31,
    text: "What does 'LCC' stand for in asset management?",
    options: ["Life Cycle Cost", "Low Component Cost", "Levelized Capital Cost", "Long-term Condition Control"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "Life Cycle Cost considers all costs from acquisition to disposal."
  },
  {
    id: 32,
    text: "Which type of failure is defined as a failure that cannot be detected by operators during normal duties?",
    options: ["Functional Failure", "Potential Failure", "Hidden Failure", "Catastrophic Failure"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Hidden failures are not evident to operating crew under normal circumstances."
  },
  {
    id: 33,
    text: "What is a 'run-to-failure' strategy most appropriate for?",
    options: ["Critical safety equipment", "High-cost capital assets", "Low-cost, easily replaceable, non-critical items", "Equipment with a high rate of wear-out"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Run-to-failure is suitable for non-critical, cheap assets where PM costs more than replacing upon failure."
  },
  {
    id: 34,
    text: "Reliability is defined as a probability over what?",
    options: ["Cost", "Time", "Distance", "Temperature"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Reliability is the probability that an item will perform its intended function for a specified time interval."
  },
  {
    id: 35,
    text: "Which standard governs the guidelines for Failure Mode and Effects Analysis?",
    options: ["IEC 60812", "ISO 9001", "ISO 14224", "IEEE 762"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "IEC 60812 describes FMEA and FMECA procedures."
  },
  {
    id: 36,
    text: "What does 'FRACAS' stand for?",
    options: ["Failure Reporting, Analysis, and Corrective Action System", "Fault Resolution and Condition Assessment System", "Failure Rate And Component Analysis System", "Functional Reliability And Control Assessment Standard"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "FRACAS is a closed-loop process used to identify and correct failures."
  },
  {
    id: 37,
    text: "A Pareto chart is based on what principle?",
    options: ["The 50/50 rule", "The 80/20 rule", "The Bathtub Curve", "The P-F Interval"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Pareto charts are based on the 80/20 rule, showing that roughly 80% of effects come from 20% of causes."
  },
  {
    id: 38,
    text: "Which of the following describes 'Active Redundancy'?",
    options: ["A backup unit that is turned off until needed", "A redundant unit operating simultaneously with the primary unit", "A unit that only monitors the primary unit", "A maintenance strategy"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "In active redundancy, redundant components are operating simultaneously and share the load."
  },
  {
    id: 39,
    text: "Which is a common method for condition monitoring of rotating equipment?",
    options: ["Oil Analysis", "Vibration Analysis", "Thermography", "All of the above"],
    correctAnswer: 3,
    difficulty: "easy",
    explanation: "Oil, vibration, and thermography are all standard condition monitoring techniques for rotating machinery."
  },
  {
    id: 40,
    text: "The 'Wear-out' phase of the Bathtub Curve is characterized by:",
    options: ["Decreasing failure rate", "Constant failure rate", "Increasing failure rate", "Zero failure rate"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "The wear-out phase features an increasing failure rate due to aging and degradation."
  },

  // Difficult (41-70)
  {
    id: 41,
    text: "In Weibull Analysis, a Beta (β) value of 1.0 indicates what?",
    options: ["Infant mortality", "Constant failure rate (random failures)", "Wear-out failures", "No failures"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "A shape parameter of β=1 indicates a constant failure rate, identical to the exponential distribution."
  },
  {
    id: 42,
    text: "In Weibull Analysis, a Beta (β) value less than 1.0 indicates:",
    options: ["Infant mortality (decreasing failure rate)", "Constant failure rate", "Wear-out", "Redundancy"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "β < 1 indicates a decreasing failure rate over time, typical of early-life or infant mortality."
  },
  {
    id: 43,
    text: "In Weibull Analysis, what does the Eta (η) parameter represent?",
    options: ["Shape Parameter", "Scale Parameter (Characteristic Life)", "Location Parameter", "Failure Rate"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Eta (η) is the scale parameter, representing the Characteristic Life, which is the time at which 63.2% of the population has failed."
  },
  {
    id: 44,
    text: "What is the formula for calculating Availability?",
    options: ["MTTR / MTBF", "MTBF / (MTBF + MTTR)", "MTBF + MTTR", "MTTR / (MTBF + MTTR)"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Inherent Availability = MTBF / (MTBF + MTTR)."
  },
  {
    id: 45,
    text: "If a system has two identical components in parallel (active redundancy), each with a reliability of 0.9, what is the system reliability?",
    options: ["0.81", "0.9", "0.99", "1.8"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "R_sys = 1 - (1 - R1)(1 - R2) = 1 - (0.1 × 0.1) = 1 - 0.01 = 0.99."
  },
  {
    id: 46,
    text: "If a system has two components in series, with reliabilities of 0.8 and 0.9, what is the system reliability?",
    options: ["0.72", "0.85", "0.98", "0.8"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "For series systems, R_sys = R1 × R2 = 0.8 × 0.9 = 0.72."
  },
  {
    id: 47,
    text: "What does the Gamma (γ) parameter in a 3-parameter Weibull distribution represent?",
    options: ["Shape", "Scale", "Location (Failure-free life)", "Variance"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "Gamma (γ) is the location parameter, indicating a guaranteed failure-free time before which no failures occur."
  },
  {
    id: 48,
    text: "Which of the following describes a '1-out-of-2' (1oo2) system?",
    options: ["Series system", "Parallel system", "Standby system", "K-out-of-N system where k=2"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "A 1oo2 system means only 1 component out of 2 needs to work for the system to work, which is a parallel configuration."
  },
  {
    id: 49,
    text: "In Fault Tree Analysis, an 'AND' gate means:",
    options: ["Any input event will cause the output event.", "All input events must occur simultaneously to cause the output event.", "Only one input event must occur.", "Inputs are mutually exclusive."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "An AND gate requires all input events to occur for the top event to occur."
  },
  {
    id: 50,
    text: "In Fault Tree Analysis, an 'OR' gate means:",
    options: ["All inputs must occur.", "Any single input event can cause the output event.", "Inputs occur sequentially.", "Inputs are highly correlated."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "An OR gate implies that the occurrence of any one input event will cause the output event."
  },
  {
    id: 51,
    text: "What is 'Inherent Availability'?",
    options: ["Availability considering all downtime (administrative, logistics).", "Availability considering only corrective maintenance downtime.", "Availability considering only preventive maintenance.", "Maximum possible uptime ignoring maintenance."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Inherent Availability (Ai = MTBF / (MTBF + MTTR)) considers only the design of the equipment (unscheduled corrective maintenance)."
  },
  {
    id: 52,
    text: "What is 'Operational Availability'?",
    options: ["Availability considering only repair time.", "Availability considering all downtime including delays, logistics, and admin time.", "Availability measured in a laboratory.", "Availability without scheduled maintenance."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Operational Availability (Ao) reflects the actual conditions in the field, including logistics, admin delays, and preventive maintenance."
  },
  {
    id: 53,
    text: "Which distribution is often used to model maintainability (repair times)?",
    options: ["Exponential", "Normal", "Lognormal", "Binomial"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "Repair times are generally right-skewed; thus, the Lognormal distribution is frequently used to model MTTR and maintainability."
  },
  {
    id: 54,
    text: "What is the P-F Interval?",
    options: ["The time between a potential failure and functional failure.", "The time between failures.", "The time to repair a failure.", "The time between inspections."],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "The P-F interval is the time elapsed between when a potential failure (detectable degradation) occurs and when the functional failure occurs."
  },
  {
    id: 55,
    text: "To effectively detect a failure before it occurs, how should the inspection frequency relate to the P-F interval?",
    options: ["Frequency > P-F interval", "Frequency = P-F interval", "Frequency < P-F interval (typically 1/2 the interval)", "It doesn't matter"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "To ensure you catch the degradation, inspections should occur at a frequency shorter than the P-F interval, often half the interval."
  },
  {
    id: 56,
    text: "If a component has an MTBF of 1,000 hours, what is its reliability for a 100-hour mission? (Assume exponential distribution)",
    options: ["~90.5%", "~95.0%", "~99.0%", "~10.0%"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "R(t) = e^(-t/MTBF) = e^(-100/1000) = e^(-0.1) ≈ 0.9048 or 90.5%."
  },
  {
    id: 57,
    text: "In RCM, a 'Hidden Failure' typically requires what kind of maintenance task?",
    options: ["Condition-based maintenance", "Run-to-failure", "Failure-finding task (proof testing)", "Time-based discard"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "Hidden failures (often protective devices) require regular failure-finding tasks to ensure they will work when called upon."
  },
  {
    id: 58,
    text: "What does MTBD stand for?",
    options: ["Mean Time Between Downtime", "Mean Time Between Demands", "Mean Time Before Degradation", "Mean Time Between Defects"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "MTBD stands for Mean Time Between Demands, often used in standby or protective systems."
  },
  {
    id: 59,
    text: "What is 'CBM+'?",
    options: ["Condition-Based Maintenance plus Predictive Analytics", "Cost-Based Maintenance", "Corrective Breakdown Maintenance", "Capital-Based Manufacturing"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "CBM+ integrates traditional CBM with predictive technologies, AI, and enterprise data."
  },
  {
    id: 60,
    text: "What is a 'Cut Set' in Fault Tree Analysis?",
    options: ["A path from the top event to the bottom.", "A set of basic events that, if they occur simultaneously, cause the top event.", "A method for pruning the fault tree.", "A successful path preventing failure."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "A cut set is a combination of basic events which will cause the top event to occur."
  },
  {
    id: 61,
    text: "What is a 'Minimal Cut Set'?",
    options: ["A cut set with the lowest probability.", "A cut set that cannot be reduced further without losing its ability to cause the top event.", "A single point of failure.", "The cheapest failure path."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "A minimal cut set is the smallest combination of basic events that causes the top event; removing any event means it's no longer a cut set."
  },
  {
    id: 62,
    text: "In FMECA, what does the 'C' stand for?",
    options: ["Criticality", "Control", "Condition", "Cost"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "FMECA stands for Failure Mode, Effects, and Criticality Analysis."
  },
  {
    id: 63,
    text: "What is the primary difference between FMEA and FMECA?",
    options: ["FMECA includes quantitative criticality analysis.", "FMEA is for software, FMECA is for hardware.", "FMECA is only used in aviation.", "There is no difference."],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "FMECA adds a quantitative Criticality Analysis step to the qualitative FMEA."
  },
  {
    id: 64,
    text: "If MTTF is 500 hours, what is the constant failure rate (λ) per hour?",
    options: ["0.02", "0.002", "0.05", "500"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "λ = 1 / MTTF = 1 / 500 = 0.002 failures per hour."
  },
  {
    id: 65,
    text: "What is the difference between MTTF and MTBF?",
    options: ["No difference.", "MTTF is for non-repairable items; MTBF is for repairable items.", "MTBF is for non-repairable items; MTTF is for repairable items.", "MTTF includes repair time."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "MTTF (Mean Time To Failure) applies to non-repairable items that are replaced upon failure. MTBF applies to repairable systems."
  },
  {
    id: 66,
    text: "Which of the following distributions is best for modeling fatigue failure?",
    options: ["Exponential", "Normal", "Lognormal or Weibull", "Poisson"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "Fatigue represents wear-out, so Lognormal or a Weibull with β > 1 is appropriate."
  },
  {
    id: 67,
    text: "In a K-out-of-N system, if N=3 and K=2, how many components must fail to cause system failure?",
    options: ["1", "2", "3", "0"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "If K=2 out of 3 must work, the system fails if 2 components fail (leaving only 1 working)."
  },
  {
    id: 68,
    text: "What is 'Standby Redundancy'?",
    options: ["All units run continuously.", "Redundant units are offline/unpowered until the primary fails.", "A system that requires manual restart.", "A system with no redundancy."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "In standby redundancy, secondary units are inactive (or idling) until the active unit fails."
  },
  {
    id: 69,
    text: "Which testing method accelerates failures by subjecting the product to stresses beyond its normal operational limits?",
    options: ["Burn-in", "HALT (Highly Accelerated Life Test)", "Environmental Stress Screening (ESS)", "Proof Testing"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "HALT uses extreme stresses to rapidly precipitate inherent design weaknesses."
  },
  {
    id: 70,
    text: "What is 'Burn-in' testing designed to achieve?",
    options: ["Determine the wear-out phase.", "Screen out infant mortality failures before shipment.", "Calculate exact MTBF.", "Find design flaws."],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Burn-in operates the product for a short period to cause weak units (infant mortality) to fail before reaching the customer."
  },

  // Very Difficult (71-100)
  {
    id: 71,
    text: "How is 'Reliability Growth' modeled?",
    options: ["Duane Model or Crow-AMSAA", "Weibull Distribution", "Normal Distribution", "Markov Chains"],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "Duane and Crow-AMSAA models track the improvement (growth) of reliability as design flaws are found and fixed during testing."
  },
  {
    id: 72,
    text: "In the Crow-AMSAA model, what does a shape parameter (β) less than 1 indicate?",
    options: ["Reliability decay", "Reliability growth (improving)", "Constant reliability", "Infant mortality"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "In the Non-Homogeneous Poisson Process (NHPP) used in Crow-AMSAA, β < 1 indicates that the failure intensity is decreasing, meaning reliability is growing."
  },
  {
    id: 73,
    text: "What does 'Common Cause Failure' (CCF) refer to?",
    options: ["Failures that happen often.", "Multiple components failing due to a single shared root cause.", "Failures caused by operator error.", "Failures that have a common symptom."],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "CCF occurs when a single event (like a power surge or environmental extreme) causes multiple redundant components to fail simultaneously, defeating redundancy."
  },
  {
    id: 74,
    text: "What is the 'Beta Factor' model used for?",
    options: ["Weibull shape estimation", "Estimating Common Cause Failures (CCF) in redundant systems", "Calculating confidence intervals", "Determining RPN"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The Beta Factor model is a standard way to quantify the fraction of failures in a redundant system that are due to common causes."
  },
  {
    id: 75,
    text: "If a system has 3 components with constant failure rates λ1, λ2, and λ3 in series, what is the system failure rate?",
    options: ["1 / (λ1 + λ2 + λ3)", "λ1 × λ2 × λ3", "λ1 + λ2 + λ3", "It cannot be calculated simply."],
    correctAnswer: 2,
    difficulty: "very_difficult",
    explanation: "For components in series with constant failure rates, the system failure rate is the sum of the individual failure rates."
  },
  {
    id: 76,
    text: "What is a 'Markov Chain' used for in reliability engineering?",
    options: ["Calculating RPNs.", "Modeling systems with complex repair strategies and multiple degraded states.", "Drawing fault trees.", "Estimating Weibull parameters."],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Markov models use transition probabilities to model systems moving between various states of operation, degradation, and repair over time."
  },
  {
    id: 77,
    text: "What does 'SIL' stand for in functional safety?",
    options: ["Safety Integrity Level", "System Incident Limit", "Standard Inspection Layer", "Safety Incident Log"],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "SIL (Safety Integrity Level) is a measurement of performance required for a Safety Instrumented Function (SIF)."
  },
  {
    id: 78,
    text: "How is SIL (Safety Integrity Level) primarily determined for low-demand mode systems?",
    options: ["MTBF", "Probability of Failure on Demand (PFDavg)", "Frequency of failures per hour (PFH)", "Risk Priority Number"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "For low demand systems, SIL is defined by the Probability of Failure on Demand (PFDavg)."
  },
  {
    id: 79,
    text: "If PFDavg is 10^-3, what is the corresponding Risk Reduction Factor (RRF)?",
    options: ["100", "1,000", "10,000", "0.001"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "RRF = 1 / PFDavg = 1 / 10^-3 = 1,000."
  },
  {
    id: 80,
    text: "In accelerated life testing, which model relates temperature to reaction rate/failure rate?",
    options: ["Weibull Model", "Arrhenius Model", "Inverse Power Law", "Duane Model"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The Arrhenius model is used to model temperature-dependent degradation processes."
  },
  {
    id: 81,
    text: "Which model is typically used to relate non-thermal stresses (like voltage or vibration) to life?",
    options: ["Arrhenius Model", "Eyring Model", "Inverse Power Law", "Coffin-Manson Model"],
    correctAnswer: 2,
    difficulty: "very_difficult",
    explanation: "The Inverse Power Law is commonly used for non-thermal stress acceleration."
  },
  {
    id: 82,
    text: "What is the Coffin-Manson model primarily used to analyze?",
    options: ["Thermal cycling and thermal fatigue", "Voltage stress", "Vibration fatigue", "Corrosion rates"],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "The Coffin-Manson relationship models fatigue failures induced by thermal cycling."
  },
  {
    id: 83,
    text: "What is 'Availability' for a standby system with perfect switching, given active MTBF (Ma), standby MTBF (Ms), and repair time (MTTR)?",
    options: ["It requires complex Markov modeling to find precisely.", "Ma / (Ma + MTTR)", "Ms / (Ms + MTTR)", "(Ma+Ms)/MTTR"],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "Standby availability, especially with imperfect switching or repairable units, typically requires state-transition (Markov) models to solve accurately."
  },
  {
    id: 84,
    text: "What is the formula for the reliability of an active parallel system of 2 identical components with constant failure rate λ? (Assume no repair)",
    options: ["e^(-2λt)", "2e^(-λt) - e^(-2λt)", "1 - e^(-λt)", "(e^(-λt))^2"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "R_sys = 1 - (1 - R1)(1 - R2) = 1 - (1 - e^-λt)^2 = 2e^-λt - e^-2λt."
  },
  {
    id: 85,
    text: "For a 2-out-of-3 (2oo3) system of identical components with reliability R, what is the system reliability formula?",
    options: ["3R^2 - 2R^3", "R^3 + 3R^2(1-R)", "R^3", "1 - (1-R)^3"],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "R_sys = R^3 + 3R^2(1-R) = R^3 + 3R^2 - 3R^3 = 3R^2 - 2R^3."
  },
  {
    id: 86,
    text: "What does Kaplan-Meier estimate?",
    options: ["Weibull parameters", "Non-parametric reliability function with censored data", "MTTR", "Availability"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The Kaplan-Meier estimator is a non-parametric statistic used to estimate the survival (reliability) function from lifetime data, easily handling right-censored data."
  },
  {
    id: 87,
    text: "What is 'Censored Data' in life data analysis?",
    options: ["Data that is confidential.", "Data where the exact failure time is unknown (e.g., unit survived past test time).", "Data containing errors.", "Data from accelerated testing."],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Censored data occurs when a unit does not fail during the observation period (right censored) or failed between inspections (interval censored)."
  },
  {
    id: 88,
    text: "Which plotting method is often used to calculate median ranks for Weibull plotting?",
    options: ["Benard's Approximation", "Newton-Raphson", "Monte Carlo", "Fourier Transform"],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "Benard's approximation, (i - 0.3) / (N + 0.4), is widely used to estimate the median ranks for plotting life data on probability paper."
  },
  {
    id: 89,
    text: "What does a 'B10 life' mean?",
    options: ["The time at which 10% of the population is expected to fail.", "The time at which 90% of the population is expected to fail.", "The time to 10 failures.", "The average life divided by 10."],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "B10 life (or L10 in bearings) is the time by which 10% of the units have failed (i.e., 90% reliability)."
  },
  {
    id: 90,
    text: "In bearing reliability, what standard defines the L10 life calculation?",
    options: ["ISO 9001", "ISO 281", "IEEE 762", "IEC 61508"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "ISO 281 provides the standard formula for calculating the basic rating life (L10) of rolling bearings."
  },
  {
    id: 91,
    text: "What does 'SFF' stand for in IEC 61508?",
    options: ["Safe Failure Fraction", "System Fault Frequency", "Safety Factor Function", "Standard Failure Format"],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "SFF (Safe Failure Fraction) is the ratio of safe + dangerous detected failures to total failures, used to determine architectural constraints for SIL."
  },
  {
    id: 92,
    text: "Which of these is a valid way to calculate Safe Failure Fraction (SFF)?",
    options: ["(λs + λdd) / λtotal", "λdd / λdu", "λs / λtotal", "(λdu + λdd) / λs"],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "SFF = (Safe Failures + Dangerous Detected Failures) / Total Failures = (λs + λdd) / (λs + λd)."
  },
  {
    id: 93,
    text: "In reliability demonstration testing, what are the 'Producer's Risk' (α) and 'Consumer's Risk' (β)?",
    options: ["α: Risk of rejecting a good product. β: Risk of accepting a bad product.", "α: Risk of accepting a bad product. β: Risk of rejecting a good product.", "α: Risk of injury. β: Risk of financial loss.", "There is no difference."],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "Producer's Risk (Type I error) is rejecting a system that meets the MTBF goal. Consumer's Risk (Type II error) is accepting a system that fails to meet the goal."
  },
  {
    id: 94,
    text: "What is 'Bayesian Reliability Analysis'?",
    options: ["Analysis using only failure data.", "Incorporating prior knowledge (e.g., expert opinion or old test data) with new test data to update reliability estimates.", "A graphical method for FTA.", "Analysis ignoring censored data."],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Bayesian methods use Bayes' theorem to combine prior distributions with current likelihood functions to form posterior estimates."
  },
  {
    id: 95,
    text: "If a system has a constant failure rate, the coefficient of variation of the time to failure is:",
    options: ["0", "0.5", "1", "Depends on MTBF"],
    correctAnswer: 2,
    difficulty: "very_difficult",
    explanation: "For the exponential distribution (constant failure rate), the standard deviation equals the mean, so the coefficient of variation (SD/Mean) is 1."
  },
  {
    id: 96,
    text: "What does 'Maintenance Free Operating Period' (MFOP) refer to?",
    options: ["A period during which an asset will not require any scheduled or unscheduled maintenance.", "The time it takes to fix an asset.", "The design life of a system.", "A warranty period."],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "MFOP is a requirement that the system operates without any maintenance interventions for a specified time period."
  },
  {
    id: 97,
    text: "In Maximum Likelihood Estimation (MLE) for Weibull parameters, how are the parameters found?",
    options: ["By drawing a line of best fit on probability paper.", "By finding parameter values that maximize the likelihood function of the observed data.", "By taking the mean and standard deviation.", "By guessing."],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "MLE uses calculus and numerical methods to find the parameters that make the observed data most mathematically probable."
  },
  {
    id: 98,
    text: "Which model is used to assess repairable systems with a changing failure rate over time (e.g., system aging)?",
    options: ["Homogeneous Poisson Process (HPP)", "Non-Homogeneous Poisson Process (NHPP)", "Binomial Distribution", "Hypergeometric Distribution"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "NHPP allows the intensity function (failure rate) to change over time, suitable for repairable systems experiencing wear-out or reliability growth."
  },
  {
    id: 99,
    text: "What does the 'Bathtub Curve' assume about repairs?",
    options: ["Repairs return the system to 'as good as new'.", "Repairs return the system to 'as bad as old'.", "Repairs make the system better than new.", "It is a model for non-repairable components."],
    correctAnswer: 3,
    difficulty: "very_difficult",
    explanation: "The classical Bathtub Curve strictly applies to non-repairable populations. For repairable systems, concepts like 'as bad as old' (minimal repair) usually apply, often modeled via NHPP."
  },
  {
    id: 100,
    text: "What is 'Proportional Hazards Modeling' (e.g., Cox model) used for in reliability?",
    options: ["To analyze the effect of multiple covariates (like temp, load, maintenance history) on the hazard rate.", "To draw fault trees.", "To calculate OEE.", "To optimize spare parts."],
    correctAnswer: 0,
    difficulty: "very_difficult",
    explanation: "The Cox Proportional Hazards model analyzes survival data while considering the influence of multiple explanatory variables (covariates) on the failure rate."
  }
];

export const quizQuestions: QuizQuestion[] = [
  ...quizQuestions1, 
  ...quizQuestions2,
  ...quizQuestionsMechanical,
  ...quizQuestionsElectrical,
  ...quizQuestionsInstrumentation
];
