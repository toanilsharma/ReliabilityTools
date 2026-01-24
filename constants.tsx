
import React from 'react';
import { ToolDefinition, FAQItem, LearningArticle } from './types';

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
    path: '/tools/mtbf',
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
    path: '/tools/fmea',
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
    path: '/tools/weibull',
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
    path: '/tools/oee',
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

export const ARTICLES: LearningArticle[] = [
  {
    id: 'asset-criticality',
    title: 'Asset Criticality Ranking: Stop Treating Every Machine the Same',
    summary: 'You have limited budget and time. Learn how to rank your assets (A, B, C) based on risk to focus your resources where they matter most.',
    date: 'December 20, 2025',
    author: AUTHOR_NAME,
    content: `A common mistake in maintenance is treating a bathroom exhaust fan with the same urgency as the main production conveyor. This is "Democratic Maintenance," and it is inefficient.
Reliability engineering is about **prioritization**.

## The ABC Classification
A robust criticality ranking system sorts assets into three buckets:

### Class A: Critical (Top 10-20%)
If this asset stops, the plant stops, or there is a major safety/environmental risk.
• **Strategy:** Predictive Maintenance (PdM), Root Cause Analysis (RCA) on *every* failure, complete spare parts kit on-site.
• **Monitoring:** Continuous or frequent (weekly).

### Class B: Essential (Next 30-40%)
Failure affects production rate or efficiency, but doesn't halt the plant immediately (perhaps there is a buffer).
• **Strategy:** Preventive Maintenance (PM), standard spares available at distributor.
• **Monitoring:** Periodic (Monthly/Quarterly).

### Class C: Non-Critical (Bottom 40%)
Failure has no immediate impact on safety or production.
• **Strategy:** Run-to-Failure (RTF). Fix it when it breaks.
• **Monitoring:** None.

## How to Calculate Criticality
Use a risk-based matrix: **Risk = Severity × Probability**.
1. **Safety Score (1-5):** 5 = Fatality likely, 1 = First aid only.
2. **Environmental Score (1-5):** 5 = Major spill/fine, 1 = None.
3. **Operational Score (1-5):** 5 = Full plant stop, 1 = Minor nuisance.

*Note:* Always take the HIGHEST score among categories, or use a weighted sum where Safety is weighted heaviest. You can download our [Criticality Matrix Template](/downloads) to get started.`
  },
  {
    id: 'pf-interval',
    title: 'Mastering the P-F Interval: Timing Your Maintenance',
    summary: 'The window of opportunity. Understanding the P-F curve is crucial for setting inspection frequencies in a Predictive Maintenance program.',
    date: 'December 12, 2025',
    author: AUTHOR_NAME,
    content: `In Predictive Maintenance (PdM), timing is everything. The **P-F Interval** is the technical term for the "warning time" you get before a breakdown.

## The Definition
• **Point P (Potential Failure):** The point in time when a defect can first be detected by a specific technique (e.g., vibration analysis detects a bearing defect).
• **Point F (Functional Failure):** The point when the asset actually breaks or fails to do its job.
• **The Interval:** The time between P and F.

## Why it Matters for Scheduling
If the P-F interval for a specific failure mode is 2 months, inspecting the machine every 3 months is useless. You could miss the entire failure development window.
**Rule of Thumb:** Your inspection frequency should be roughly **half the P-F Interval** to ensure you catch the failure.

## Typical P-F Intervals by Technology
1. **Oil Analysis:** Months to Years. (Detects wear particles early).
2. **Vibration Analysis:** Weeks to Months. (Detects physical damage).
3. **Infrared Thermography:** Days to Weeks. (Detects heat from friction/resistance).
4. **Audible Noise / Touch:** Minutes to Days. (Too late!).

By moving up this list (from Touch to Oil Analysis), you widen your window to plan the repair, order parts, and schedule downtime.`
  },
  {
    id: 'rcm-vs-pmo',
    title: 'RCM vs. PMO: Which Strategy Do You Need?',
    summary: 'Do you need a blank slate or a tune-up? Comparing Reliability Centered Maintenance (RCM) with Preventive Maintenance Optimization (PMO).',
    date: 'December 08, 2025',
    author: AUTHOR_NAME,
    content: `Two methodologies often confuse maintenance managers: RCM and PMO. Both aim to improve reliability, but they attack the problem from opposite ends.

## Reliability Centered Maintenance (RCM)
**Best for:** New equipment, complex systems, or high-risk assets where no history exists.
**Approach:** Zero-based. It assumes nothing and builds the maintenance plan from scratch by asking 7 questions (SAE JA1011), starting with "What are the functions?" and "How does it fail?".
**Pros:** Extremely thorough and defensible.
**Cons:** Time-consuming and resource-intensive.

## Preventive Maintenance Optimization (PMO)
**Best for:** Existing plants with a history of maintenance, "legacy" PM programs, or limited resources.
**Approach:** Review existing PM tasks and ask: "Does this task prevent a failure? Is it worth doing?". It looks at failure history to delete non-value-added tasks and adjust frequencies.
**Pros:** Fast ROI. Often reduces workload by 20-30% by eliminating "feel-good" maintenance.
**Cons:** Relies on past data, which might be poor.

## The "PM Death Spiral"
Many plants suffer from reactive PMs. A machine fails, so someone writes a PM to "check it weekly". Over 10 years, you end up with thousands of inspection hours that find nothing. **PMO** is the cure for this bloat.`
  },
  {
    id: 'fracas-explained',
    title: 'What is FRACAS? The Cycle of Continuous Improvement',
    summary: 'It is not just a logbook. Learn how a Failure Reporting, Analysis, and Corrective Action System turns breakdown data into reliability growth.',
    date: 'December 06, 2025',
    author: AUTHOR_NAME,
    content: `You fixed the machine. Great. But will it break again next week?
Unless you have a **FRACAS** (Failure Reporting, Analysis, and Corrective Action System), the answer is likely "Yes".

## The Closed-Loop System
FRACAS is the engine of reliability growth. It turns "unplanned downtime" into "intellectual property".

### Step 1: Failure Reporting (The Data)
Technicians must record accurate data. "Pump Broken" is not data.
We need: **Asset Tag**, **Failure Mode** (e.g., Leaking Seal), **Downtime Hours**, and **Parts Used**.

### Step 2: Analysis (The Insight)
Reliability Engineers review the top failures (using Pareto charts).
They apply tools like [Weibull Analysis](/tools/weibull) or Root Cause Analysis (RCA) to understand *why* it failed.

### Step 3: Corrective Action (The Fix)
This isn't just fixing the machine. It is fixing the *system*.
• Redesign the part?
• Change the PM frequency?
• Update the operator training?

### Step 4: Verification (The Check)
Did the fix work? You must track the asset for months to verify the failure rate has dropped.

Without FRACAS, you are just a hamster on a wheel, fixing the same things forever. With it, you are engineering a better plant.`
  },
  {
    id: 'oee-hidden-factory',
    title: 'Unlocking the Hidden Factory: A Practical Guide to OEE',
    summary: 'Your plant is capable of producing more without buying new machines. Learn how Overall Equipment Effectiveness (OEE) exposes the "Hidden Factory" of lost capacity due to minor stops and slow cycles.',
    date: 'December 05, 2025',
    author: AUTHOR_NAME,
    content: `If your plant is running 24/7 but only producing sellable product 60% of the time, you have a "Hidden Factory". This is the untapped capacity lost to stops, slow cycles, and defects. Unlocking this capacity is the cheapest way to increase production—far cheaper than building a new line.

## The OEE Standard
Overall Equipment Effectiveness (OEE) is the microscope we use to find this hidden capacity. It identifies the percentage of manufacturing time that is truly productive.
> **OEE = Availability × Performance × Quality**

| Factor | Measures | Typical Losses |
| :--- | :--- | :--- |
| **Availability** | Uptime | Breakdowns, Setup, Adjustments |
| **Performance** | Speed | Idling, Minor Stops, Reduced Speed |
| **Quality** | Yield | Scrap, Rework, Startup Defects |

## The 6 Big Losses
To improve OEE, you must attack the "Six Big Losses":
1. **Equipment Failure:** Unplanned downtime (breakdowns).
2. **Setup & Adjustments:** Planned downtime (changeovers, die changes).
3. **Idling & Minor Stops:** Stops < 5 minutes (often unrecorded, but they add up).
4. **Reduced Speed:** Running at 80% nameplate capacity due to age or caution.
5. **Process Defects:** Scrap produced during steady-state production.
6. **Reduced Yield:** Scrap produced during startup or warmup.

## World Class OEE
What should you aim for?
• **85% OEE** is generally considered World Class for discrete manufacturing.
• **60% OEE** is typical for average plants.
• **40% OEE** is surprisingly common for low-performing plants.

**The Math of Improvement:**
Increasing OEE from 60% to 70% is a **16% increase in capacity**. That is huge.
Use our [OEE Calculator](/tools/oee) to benchmark your line today.`
  },
  {
    id: 'rca-human-error',
    title: 'Root Cause Analysis: Why "Human Error" is Never the Root Cause',
    summary: 'If your investigations end with "Operator Error", you haven\'t fixed anything. Learn why blaming people fails and how to find systemic latent causes using the 5 Whys and Fishbone diagrams.',
    date: 'November 28, 2025',
    author: AUTHOR_NAME,
    content: `A pump runs dry. A valve is left open. A breaker is tripped.
The investigation concludes: *"Operator Error. Operator retrained."*
Case closed? **No.**

In modern reliability engineering, **Human Error is a symptom, not a cause.** If you stop at human error, you are leaving the trap open for the next person to fall into.

## The Swiss Cheese Model
James Reason's model suggests that a failure only occurs when "holes" in multiple layers of defense line up.
1. **Design:** The button was unguarded and easy to bump.
2. **Process:** There was no double-check step in the SOP.
3. **Culture:** The operator was fatigued due to mandatory overtime.

If you fire the operator, the holes in the design and process remain. The next operator will make the same mistake.

## The 5 Whys Technique
To get past the human error, ask "Why?" five times to drill down to the systemic issue.

**Problem:** Hydraulic System Overheated.
1. **Why?** Cooling pump stopped running.
2. **Why?** Circuit breaker tripped.
3. **Why?** Motor drew high current.
4. **Why?** Bearing seized.
5. **Why?** **Lack of lubrication.** (Root Cause)

*Corrective Action:* Implement auto-lubrication system or revise PM route.
*Wrong Action:* Reset breaker and restart.

## The Fishbone Diagram (Ishikawa)
For complex problems, use a Fishbone diagram to map causes into categories:
• **Man:** Training, fatigue, stress.
• **Machine:** Design, age, condition.
• **Material:** Quality, grade, defects.
• **Method:** Procedures, permits, standards.
• **Environment:** Heat, dust, humidity.

Download our [RCA Template](/downloads) to standardize your investigations and stop the blame game.`
  },
  {
    id: 'pdm-technologies',
    title: 'Predictive Maintenance (PdM) 101: Vibration, Ultrasound & Thermography',
    summary: 'Move from "Fail and Fix" to "Predict and Prevent". A starter guide to the three pillars of condition monitoring technologies and how they detect the onset of failure.',
    date: 'November 20, 2025',
    author: AUTHOR_NAME,
    content: `Preventive Maintenance (PM) is time-based (e.g., replace oil every year).
Predictive Maintenance (PdM) is condition-based (e.g., replace oil only when it degrades).
PdM uses technology to detect the onset of failure—Point "P" on the P-F curve—giving you months to plan a correction.

Here are the three pillars of industrial PdM:

## 1. Vibration Analysis (VA)
**Best for:** Rotating equipment (motors, pumps, fans, compressors).
**How it works:** Sensors measure the movement of the shaft.
**What it detects:** Imbalance, misalignment, bearing defects, looseness, and bent shafts.
**Insight:** A bearing typically shows specific vibration frequency spikes (harmonics) months before it seizes.

## 2. Infrared Thermography (IR)
**Best for:** Electrical panels, switchgear, steam traps, insulation.
**How it works:** Cameras detect infrared radiation (heat) invisible to the eye.
**What it detects:** High resistance connections ("hot spots"), overloaded circuits, blocked cooling fins, refractory breakdown.
**Insight:** In electricity, resistance generates heat. IR sees this heat before the component melts or catches fire.

## 3. Ultrasound (UE)
**Best for:** Air leaks, early stage bearing wear, electrical arcing/corona.
**How it works:** Microphones detect high-frequency sounds above human hearing.
**What it detects:** Gas turbulence (leaks), friction (lubrication issues).
**Insight:** Friction creates high-frequency noise. UE can hear a bearing "crying for grease" long before vibration analysis picks up physical damage.

## 4. Oil Analysis
**Best for:** Gearboxes, hydraulic systems, transformers.
**Detects:** Wear metals (iron, copper), water contamination, viscosity breakdown.
**Insight:** It is like a blood test for your machine. High iron counts mean gears are grinding. High silicon means dirt is getting in.

**Strategy:** Don't pick just one. A robust reliability program uses a mix of these technologies based on the [Asset Criticality](/downloads).`
  },
  {
    id: 'what-is-mtbf',
    title: 'MTBF Explained: Calculation, Misuse & Real-World Meaning',
    summary: 'A deep dive into Mean Time Between Failures. We debunk myths, explain the math, and show you why a 50-year MTBF does not mean your machine will last 50 years.',
    date: 'November 10, 2025',
    author: AUTHOR_NAME,
    content: `If you work in industrial maintenance, you see MTBF (Mean Time Between Failures) everywhere. It is on pump datasheets, in PLC manuals, and referenced in almost every reliability contract. You might see a centrifugal pump with an MTBF of 50,000 hours and think, "Great! This pump will last for 5.7 years without breaking."

**This is the single biggest misconception in reliability engineering.**

In this guide, we will strip away the marketing fluff and look at the raw statistics behind MTBF to understand what it really tells us about asset performance. You can try our [MTBF Calculator](/tools/mtbf) to run your own numbers while you read.

## 1. The Definition: What is it really?
MTBF is a statistical parameter derived from the **random failure rate** of a population of assets. It is calculated simply as:

> **MTBF = Total Operational Time / Total Number of Failures**

*Important Note: MTBF applies only to repairable systems. For items you throw away when they break (like light bulbs or fuses), the correct term is [MTTF (Mean Time To Failure)](/tools/mtbf).*

## 2. The "Lifetime" Myth Explained
Let’s use a human analogy to explain why MTBF is not a lifetime prediction.
Imagine a sample population of 1,000 humans who are all 25 years old.
In one year, statistics show that perhaps 1 person might die due to a random accident.
The failure rate ($\lambda$) is $1 / 1000 = 0.001$ failures per year.

If we calculate MTBF based on this:
$MTBF = 1 / \lambda = 1 / 0.001 = 1,000$ Years.

**Does this mean 25-year-old humans have a life expectancy of 1,000 years?**
Of course not. Biological wear-out (aging) kicks in long before that. The MTBF of 1,000 years simply describes the *low probability of random failure* during the "useful life" phase of a human.

Similarly, a piece of electronics with an MTBF of 1,000,000 hours will not last 114 years. It just means that between the time it is installed and the time it wears out (maybe 10 years later), the chance of it failing randomly is extremely low.

## 3. The Mathematics of Reliability
To truly understand your asset's risk, you need to calculate **Reliability $R(t)$**.
Reliability is the probability that a system will function without failure for a specific duration $t$.
Assuming a constant failure rate (the flat bottom of the Bathtub Curve), the formula is:

> **$R(t) = e^{-t / MTBF}$**

Let's plug in some real numbers. Suppose you have a motor with an MTBF of 20,000 hours. You want to know the probability it will survive for one year (8,760 hours).
$t = 8,760$
$MTBF = 20,000$
$R = e^{-8760 / 20000} = e^{-0.438} = 0.645$

**Result:** There is a **64.5%** chance the motor will survive the year without failure.
Conversely, there is a **35.5%** chance it will fail.

### The Rule of 37%
What happens if you run a machine for a time exactly equal to its MTBF?
$t = MTBF$
$R = e^{-1} \approx 0.367$

**Key Takeaway:** If you operate a fleet of assets for a duration equal to their MTBF, **only 37% of them will still be running.** The other 63% will have failed. This is why targeting an MTBF equal to your warranty period is a recipe for disaster.

## 4. When should you use MTBF?
If it doesn't predict life, is it useless? No. MTBF is a powerful metric for:

• **Spare Parts Forecasting:** If you have 100 motors with an MTBF of 50,000 hours, you can accurately predict you will need roughly 17 replacement motors per year. Use our [Spare Part Estimator](/tools/spares) for this.
• **System Design Comparison:** It allows you to objectively compare two components. A sensor with 200k hours MTBF is twice as reliable as one with 100k hours MTBF during the useful life phase.
• **Availability Calculations:** You cannot calculate uptime without it.

## 5. Summary
MTBF is a statistical average derived from the random failure rate. It is indispensable for logistics, inventory planning, and high-level system modeling. However, for predicting *when* a specific asset will wear out, you must use [Weibull Analysis](/tools/weibull).`
  },
  {
    id: 'pareto-bad-actors',
    title: 'The Pareto Principle in Maintenance: Killing the "Bad Actors"',
    summary: 'You have limited budget and limited time. You cannot fix everything. Learn how to use the 80/20 rule to identify the 20% of assets causing 80% of your downtime.',
    date: 'November 05, 2025',
    author: AUTHOR_NAME,
    content: `In the 19th century, Vilfredo Pareto observed that 80% of the land in Italy was owned by 20% of the population.
In maintenance, this distribution is even more extreme:
> **20% of your assets cause 80% of your downtime.**

These assets are your "Bad Actors". They consume your spare parts budget, burn out your technicians, and kill your production targets.

## Identifying Bad Actors
To apply this, you need data, not just "gut feeling".
1. Export your work order history (last 12 months).
2. Group data by **Asset ID**.
3. Sum the **Maintenance Cost** and **Downtime Hours** for each asset.
4. Sort the list descending.

You will almost always find that the top 10 items on a list of 100 assets account for more than half the total pain.

## The Strategy: Divide and Conquer
Once you have your list, apply different strategies to different groups:

### 1. The Top 20% (The Bad Actors)
**Strategy:** Aggressive Reliability Improvement.
These machines are broken. Do not just keep fixing them.
• Perform Root Cause Analysis (RCA) on every failure.
• Consider engineering redesigns (better seals, stronger shafts).
• Implement advanced PdM (vibration monitoring).
• **Goal:** Eliminate the defect.

### 2. The Middle 50%
**Strategy:** Standard Preventive Maintenance.
These assets are behaving normally.
• Follow OEM recommendations.
• Perform standard PMs (lubrication, filter changes).
• **Goal:** Maintain condition.

### 3. The Bottom 30%
**Strategy:** Run to Failure (RTF).
These assets rarely break or are non-critical (e.g., a bathroom exhaust fan).
• Do not spend money on PMs.
• Fix them only when they break.
• **Goal:** Minimize maintenance effort.

Use our [Maturity Assessment](/tools/assessment) to see if your facility is properly prioritizing work or just "fire-fighting" everything.`
  },
  {
    id: 'weibull-step-by-step',
    title: 'Weibull Analysis: Step-by-Step Rank Regression Guide',
    summary: 'Stop guessing when parts will fail. Learn how to perform rank regression on your failure data to calculate Beta and Eta, even without expensive software.',
    date: 'October 24, 2025',
    author: AUTHOR_NAME,
    content: `Reliability engineers often call Weibull Analysis the "Swiss Army Knife" of failure data. While MTBF gives you a single average number, Weibull Analysis gives you a curve that tells a story. It tells you *how* things are failing—whether it's due to quality defects, random stress, or old age wear-out.

In this guide, we will walk through the process of performing a 2-parameter Weibull analysis manually. You can also use our [Weibull Tool](/tools/weibull) to automate this.

## Why use Weibull?
Standard MTBF assumes the failure rate is constant. In reality, mechanical parts wear out. Bearings fatigue, seals degrade, and pipes erode. Weibull allows you to model this changing failure rate over time, which is critical for determining the optimal time to replace a part *before* it breaks.

## Step 1: Collect Your Data
You need a list of "Times-to-Failure". This could be hours, cycles, kilometers, or starts.
*Example Data (Hours):* 150, 320, 560, 890, 1100.
*Requirement:* You ideally need at least 5-6 failure points for a statistically significant result, though the math technically works with as few as 2.

## Step 2: Rank the Data
Sort your failure times from smallest to largest. Assign a rank order number ($i$) to each failure.
| Rank ($i$) | Time ($t$) |
| :--- | :--- |
| 1 | 150 |
| 2 | 320 |
| 3 | 560 |
| 4 | 890 |
| 5 | 1100 |

## Step 3: Calculate Median Ranks
We need to estimate the percentage of the population that has failed at each point. The standard method used in industry is "Benard's Approximation":

> **Median Rank (MR) = (i - 0.3) / (N + 0.4)**

*Where N is the total number of samples (5 in this case).*

For our first point ($i=1$):
$MR = (1 - 0.3) / (5 + 0.4) = 0.7 / 5.4 = 0.1296$ (or ~13%)
This means that at 150 hours, roughly 13% of the population is expected to fail.

## Step 4: Linearize the Equation
The Weibull formula is exponential. To solve it using simple linear regression ($y = mx + b$), we take the natural log twice.
• **X-axis:** $ln(t)$
• **Y-axis:** $ln(-ln(1 - MR))$

## Step 5: Interpret Beta ($\beta$) and Eta ($\eta$)
When you plot the X and Y values, the slope of the line is your Beta ($\beta$). This is the most important number in reliability.

| Beta ($\beta$) Value | Failure Mode | Interpretation | Action |
| :--- | :--- | :--- | :--- |
| **< 1.0** | Infant Mortality | Parts are failing early due to defects, poor installation, or startup issues. | Burn-in testing, improve Quality Control, check installation procedures. |
| **= 1.0** | Random | Failures are independent of time. This is the "Useful Life". | Condition monitoring. Preventive replacement is useless here. |
| **> 1.0** | Wear Out | The failure rate increases with time. Physical degradation is occurring. | Implement Preventive Maintenance (PM) just before the rapid rise in risk. |

**Eta ($\eta$)**, or Characteristic Life, is the time at which 63.2% of the units will have failed. It scales the curve horizontally.

## Conclusion
You don't need a PhD in statistics to use Weibull. You just need clean data. By plotting your failures, you stop guessing "why" things broke and start seeing the mathematical fingerprint of the failure mode. If you see a $\beta = 3.5$, you know for a fact that the part is wearing out, and you can confidently schedule a replacement.`
  },
  {
    id: 'mttr-vs-mtbf',
    title: 'MTTR vs. MTBF: Optimizing Availability Strategy',
    summary: 'Reliability vs. Maintainability. Understanding the tug-of-war between failure frequency and repair speed, and how they combine to define Availability.',
    date: 'October 15, 2025',
    author: AUTHOR_NAME,
    content: `In the world of asset management, two acronyms rule supreme: MTBF and MTTR. While they are often spoken in the same breath, they measure completely opposite forces in your plant.
One measures how strong your equipment is (**Reliability**).
The other measures how efficient your team is (**Maintainability**).

## The Core Definitions

### MTBF (Mean Time Between Failures)
This is your "Uptime" metric. It measures the average time the machine runs before it breaks.
• **Goal:** Make this number as HIGH as possible.
• **Ownership:** Reliability Engineers and Design Engineers.
• **Driven By:** Quality components, proper alignment, lubrication, and operating within design limits.

### MTTR (Mean Time To Repair)
This is your "Downtime" metric. It measures the average time to restore the machine to full function after a failure.
• **Goal:** Make this number as LOW as possible.
• **Ownership:** Maintenance Supervisors and Planners.
• **Driven By:** Spare parts availability, technician training, accessibility, and modular design.

## The Connection: Availability
The plant manager doesn't strictly care about MTBF or MTTR individually. They care about **Availability**—the percentage of time the machine is actually capable of making money.

> **Availability = MTBF / (MTBF + MTTR)**

You can visualize this interaction using our [Availability Calculator](/tools/availability).

### The Tale of Two Machines
Let's look at two scenarios to see why context matters.

| Scenario | MTBF (Reliability) | MTTR (Repair Speed) | Availability | Conclusion |
| :--- | :--- | :--- | :--- | :--- |
| **A: The Tank** | 10,000 Hours | 500 Hours | 95.2% | Fails rarely, but takes weeks to fix (e.g., waiting for parts from overseas). |
| **B: The F1 Car** | 1,000 Hours | 2 Hours | 99.8% | Fails often, but is fixed instantly (e.g., modular swap). |

**The Insight:** Scenario B is *more profitable* despite failing 10 times more often.
This illustrates a critical strategy: **World Class Maintenance organizations often focus on reducing MTTR** (kitting parts, writing better procedures) because it is often cheaper and faster than redesigning the machine to improve MTBF.

## Which Metric Should You Target?

### Focus on MTBF When:
• The asset is critical to safety (e.g., aircraft engines, relief valves).
• The asset is in a remote location (e.g., offshore wind turbine) where sending a repair crew is incredibly expensive.
• The cost of a failure event itself is massive (e.g., a batch of pharmaceuticals is ruined).

### Focus on MTTR When:
• The system has redundancy (e.g., you have a standby pump).
• The asset is a bottleneck, and every minute of downtime costs thousands of dollars.
• You cannot technically improve the reliability (e.g., consumable parts like brake pads).

## Summary
MTBF and MTTR are the Yin and Yang of uptime. You need to measure both. If you only track MTBF, you might ignore a terrible repair process. If you only track MTTR, you might be getting really good at fixing a machine that shouldn't be breaking in the first place.`
  },
  {
    id: 'reliability-formulas',
    title: 'Essential Reliability Formulas: Lambda, R(t), and OEE',
    summary: 'A cheat sheet for the aspiring Reliability Engineer. Lambda, R(t), Series/Parallel logic, and OEE calculations in one place.',
    date: 'September 28, 2025',
    author: AUTHOR_NAME,
    content: `Reliability engineering is a data-driven discipline. To make the jump from "I think" to "I know", you need to master the math.
Keep this page bookmarked. These are the core equations that drive data-driven maintenance decisions.

## 1. Failure Rate ($\lambda$)
The speed at which things break. It is the inverse of MTBF.
> **$\lambda = 1 / MTBF$**

*Example:* MTBF = 4,000 hours.
$\lambda = 1 / 4000 = 0.00025$ failures per hour.

## 2. Reliability Function $R(t)$
The probability that an item will survive for a specific time $t$. This assumes a constant failure rate (Exponential Distribution).
> **$R(t) = e^{-\lambda t}$**  or  **$e^{-t / MTBF}$**

*Example:* What is the chance a motor (MTBF 10k) lasts 2,000 hours?
$R = e^{-2000/10000} = e^{-0.2} = 0.818$
**Result:** 81.8% probability of success.

## 3. Unreliability $F(t)$
Also known as the Probability of Failure. It is simply the complement of Reliability.
> **$F(t) = 1 - R(t)$**

*From above:* Risk of failure = $1 - 0.818 = 0.182$ (18.2%)

## 4. System Reliability (RBD)
How components interact. You can model this with our [RBD Builder](/tools/rbd).

### Series System (The Chain)
If Component A **OR** Component B fails, the system fails.
> **$R_{system} = R_A \times R_B$**

*Insight:* The system is always *less* reliable than its weakest link.
$0.9 \times 0.9 = 0.81$

### Parallel System (Redundancy)
The system fails only if Component A **AND** Component B fail.
> **$R_{system} = 1 - [(1 - R_A) \times (1 - R_B)]$**

*Insight:* Redundancy dramatically boosts reliability.
$1 - [(0.1) \times (0.1)] = 1 - 0.01 = 0.99$

## 5. Availability (Inherent)
The percentage of time an asset is ready to run.
> **$A_i = MTBF / (MTBF + MTTR)$**

## 6. OEE (Overall Equipment Effectiveness)
The gold standard for manufacturing productivity. Calculate it [here](/tools/oee).
> **OEE = Availability $\times$ Performance $\times$ Quality**

| Metric | Formula | What it captures |
| :--- | :--- | :--- |
| **Availability** | Run Time / Planned Time | Breakdowns, Setup, Adjustments |
| **Performance** | (Total Parts / Run Time) / Ideal Rate | Slow Cycles, Minor Stops |
| **Quality** | Good Parts / Total Parts | Scrap, Rework, Yield Loss |

## 7. Weibull PDF
The mathematical shape of the failure curve.
> **$f(t) = (\beta/\eta) \times (t/\eta)^{\beta-1} \times e^{-(t/\eta)^\beta}$**

• **$\beta$ (Beta):** Shape Parameter (Slope). Tells you the failure mode (infant mortality, random, or wear-out).
• **$\eta$ (Eta):** Scale Parameter (Characteristic Life). The time at which 63.2% of units fail.`
  },
  {
    id: 'rbd-guide',
    title: 'Reliability Block Diagrams (RBD): Modeling Series & Parallel Logic',
    summary: 'How to model complex systems using blocks. Learn when to use Series vs. Parallel configurations to calculate total system reliability.',
    date: 'September 10, 2025',
    author: AUTHOR_NAME,
    content: `A Reliability Block Diagram (RBD) is a visual map of the reliability-wise relationship of components within a system. It answers the critical engineering question: *"If this specific part breaks, does the whole machine stop?"*

RBDs transform a complex schematic into a mathematical model, allowing you to calculate the overall probability of system success.

## The Building Blocks

### 1. Series Configuration (The "Weakest Link")
In a series configuration, components are connected in a line. If **ANY** block in the chain fails, the path is broken, and the system fails.

*   **Visual:** [Pump] -> [Valve] -> [Filter]
*   **Math:** $R_{total} = R_1 \times R_2 \times R_3$

**Real World Example:** A standard centrifugal pump skid.
You need the Motor **AND** the Coupling **AND** the Pump to work.
If the Motor is 95% reliable and the Pump is 95% reliable:
$System = 0.95 \times 0.95 = 0.9025$ (90.25%)

**Key Takeaway:** Adding complexity (more series parts) always *reduces* reliability. A system with 100 parts, each 99% reliable, has a total reliability of only 36.6%.

### 2. Parallel Configuration (Active Redundancy)
In a parallel configuration, the path splits. The system works as long as **AT LEAST ONE** path is open.

*   **Visual:** Two pumps side-by-side piping into the same header.
*   **Math:** $R_{total} = 1 - (U_1 \times U_2)$ where $U$ is Unreliability ($1-R$).

**Real World Example:** Dual Power Supplies in a Server.
Power Supply A is 90% reliable ($U=0.10$).
Power Supply B is 90% reliable ($U=0.10$).
Risk of BOTH failing simultaneously = $0.10 \times 0.10 = 0.01$ (1%).
$Reliability = 1 - 0.01 = 0.99$ (99%).

**Key Takeaway:** Redundancy is the most effective way to increase system reliability, but it doubles the cost (Capex) and maintenance load (Opex). You can calculate these trade-offs using our [LCC Calculator](/tools/lcc).

### 3. K-out-of-N Voting
This is a variation of parallel logic. You have N components, but you need K of them to work for the system to survive.
*   **Example:** A drone with 6 motors (Hexacopter). It can still fly if any 4 motors work.
*   **Logic:** It tolerates 2 failures, but a 3rd failure crashes the system.

## How to Build an RBD
1.  **Define the Goal:** What is "System Success"? (e.g., Maintaining 50 PSI at the outlet).
2.  **List Components:** Identify every part that can stop the flow.
3.  **Determine Logic:**
    • Does the system stop if X fails? -> **Series Block**.
    • Is there a backup for X? -> **Parallel Block**.
4.  **Assign Reliability Values:** Use MTBF data to calculate $R(t)$ for the mission time.
5.  **Calculate:** Collapse the diagram block by block using the math above.

## Why use RBDs?
RBDs allow you to perform "What-If" analysis before you spend money.
*"Boss, if we add a $5,000 backup pump, our risk of downtime drops from 10% to 1%. That saves us $50,000 in lost production."*
The RBD provides the mathematical proof for that financial argument. Start modeling now with our free [RBD Builder](/tools/rbd).`
  },
  {
    id: 'failure-data-analysis',
    title: 'Failure Data Analysis: Cleaning, Censoring & Categorization',
    summary: 'Garbage in, garbage out. How to collect, clean, and categorize failure data so your reliability analysis is actually valid.',
    date: 'August 22, 2025',
    author: AUTHOR_NAME,
    content: `The most sophisticated algorithms in the world cannot fix bad data. In Reliability Engineering, data quality is the biggest hurdle. Most CMMS (Computerized Maintenance Management System) data is messy, incomplete, or flat-out wrong. Work orders often just say "Pump Fix" with zero details.

Here is a practical guide to cleaning up your data to make it usable for analysis tools like [MTBF](/tools/mtbf) and [Weibull](/tools/weibull).

## 1. Define "Failure"
This sounds obvious, but it isn't. To analyze data, you must be binary: Did it fail, or not?
• **Functional Failure:** The asset is unable to perform its required function. (e.g., Pump stops moving fluid). **YES**, count this.
• **Potential Failure:** The asset is vibrating or getting hot, but still running. You stop it to align it. **MAYBE**.
    • *For MTBF:* Usually NO, unless it forced an unscheduled outage.
    • *For Cost Analysis:* YES, it consumed resources.

**Rule:** Be consistent. Most reliability metrics track *Unscheduled Functional Failures*.

## 2. The Survivor Trap: Censored Data
When running a Weibull analysis, you have two types of data points:
1.  **Failures (F):** The part broke at time $t$.
2.  **Suspensions (S):** The part is *still running* at time $t$, or it was removed for a non-failure reason (e.g., the factory closed).

**Crucial Concept:** You cannot ignore Suspensions.
Imagine you test 10 units for 1,000 hours. Only 1 unit fails.
If you ignore the other 9, your analysis thinks the part is terrible (1 failure in 1 sample).
If you include the 9 survivors (Right Censored data), the math understands that 90% of the population survived 1,000 hours, boosting the reliability score significantly.

## 3. Categorize by Failure Mode
Never lump all failures together.
• **Wrong:** "Pump Failures" (Seal leak + Bearing seizure + Motor burnout).
• **Right:** Analyze "Mechanical Seal Leaks" separately from "Bearing Seizures".

**Why?** Because they have different physics.
Seals might wear out ($\beta > 1$). Bearings might fail randomly due to lubrication issues ($\beta = 1$). If you mix them, your Weibull plot will look like noise. **Analyze one failure mode at a time.**

## 4. The Data Scrubbing Checklist
Before you open Excel or our [Weibull Tool](/tools/weibull), run this filter:

| Check | Action | Why? |
| :--- | :--- | :--- |
| **Remove PMs** | Filter out "Preventive Maintenance" work orders. | These are not failures; they are scheduled events. |
| **Remove Upgrades** | Filter out "Capital Projects" or "Mods". | Improvement work is not a reliability failure. |
| **Check Runtime** | Convert calendar time to operating hours. | If a machine runs 1 shift (8 hours), 1 day $\neq$ 24 hours. |
| **Verify Dates** | Use "Breakdown Date", not "WO Closed Date". | Technicians often close paperwork weeks after the fix. |

## Summary
Data analysis is 80% cleaning and 20% math. Treat your failure records like a crime scene—preserve the evidence, categorize the details, and only then try to solve the case.`
  }
];

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'General' | 'Statistics' | 'Maintenance';
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Asset Criticality', definition: 'A systematic method of assigning a risk rating to assets based on the probability and consequence of their failure. Used to prioritize maintenance tasks.', category: 'Maintenance' },
  { term: 'Availability', definition: 'The probability that a system is operating satisfactorily at any point in time. It is a function of reliability (MTBF) and maintainability (MTTR).', category: 'General' },
  { term: 'Bathtub Curve', definition: 'A hazard rate curve representing the lifecycle of an asset, characterized by three phases: Infant Mortality (decreasing failure rate), Useful Life (constant failure rate), and Wear-out (increasing failure rate).', category: 'General' },
  { term: 'Beta (β)', definition: 'The "Shape Parameter" in Weibull analysis. It indicates the physics of failure: β < 1 (Early Life), β = 1 (Random), β > 1 (Wear-out).', category: 'Statistics' },
  { term: 'B10 Life', definition: 'The time at which 10% of a population is expected to fail (or 90% reliability). Commonly used for bearings and warranty analysis.', category: 'Statistics' },
  { term: 'Censored Data', definition: 'Data points in a survival analysis where the unit has not failed yet (suspended) or failed due to a different cause. Critical for accurate Weibull results.', category: 'Statistics' },
  { term: 'Condition Monitoring (CbM)', definition: 'The process of monitoring a parameter of condition in machinery (vibration, temperature etc.) to identify a significant change which is indicative of a developing fault.', category: 'Maintenance' },
  { term: 'Eta (η)', definition: 'The "Scale Parameter" or Characteristic Life in Weibull analysis. It is the time at which 63.2% of the population will fail.', category: 'Statistics' },
  { term: 'FRACAS', definition: 'Failure Reporting, Analysis, and Corrective Action System. A closed-loop process for reporting failures, analyzing their root causes, and implementing corrective actions.', category: 'Maintenance' },
  { term: 'Hazard Rate', definition: 'The instantaneous probability of failure at a specific time t, given that the unit has survived until time t.', category: 'Statistics' },
  { term: 'Infant Mortality', definition: 'A period of high failure rate early in an asset\'s life, typically caused by manufacturing defects, poor installation, or startup issues.', category: 'Maintenance' },
  { term: 'LCC', definition: 'Life Cycle Cost. The total cost of ownership of an asset, including acquisition, operation, maintenance, and disposal costs over its entire life.', category: 'General' },
  { term: 'MTBF', definition: 'Mean Time Between Failures. The average expected time between repairable failures of a system during normal operation.', category: 'General' },
  { term: 'MTTF', definition: 'Mean Time To Failure. The average expected time to failure for a non-repairable component (e.g., a light bulb).', category: 'General' },
  { term: 'MTTR', definition: 'Mean Time To Repair. The average time required to troubleshoot and repair a failed component and return it to service.', category: 'General' },
  { term: 'OEE', definition: 'Overall Equipment Effectiveness. A hierarchy of metrics (Availability, Performance, Quality) that measures how effectively a manufacturing operation is utilized.', category: 'Maintenance' },
  { term: 'Pareto Principle', definition: 'The 80/20 rule. In maintenance, it typically observes that 20% of assets cause 80% of the downtime and costs.', category: 'General' },
  { term: 'P-F Interval', definition: 'The time interval between the detection of a potential failure (P) and the actual functional failure (F).', category: 'Maintenance' },
  { term: 'Preventive Maintenance (PM)', definition: 'Maintenance performed on a scheduled basis (time or cycle count) to reduce the probability of failure.', category: 'Maintenance' },
  { term: 'Predictive Maintenance (PdM)', definition: 'Maintenance techniques designed to help determine the condition of in-service equipment in order to estimate when maintenance should be performed.', category: 'Maintenance' },
  { term: 'RCM', definition: 'Reliability Centered Maintenance. A structured process to determine the maintenance strategies required to ensure physical assets continue to do what their users want them to do.', category: 'Maintenance' },
  { term: 'Reliability', definition: 'The probability that an item will perform its intended function for a specific interval under stated conditions.', category: 'General' },
  { term: 'Reliability Block Diagram (RBD)', definition: 'A graphical representation of the reliability-wise connection of components (Series/Parallel) needed for a system to operate.', category: 'Statistics' },
  { term: 'Root Cause Analysis (RCA)', definition: 'A method of problem solving used for identifying the root causes of faults or problems.', category: 'Maintenance' },
  { term: 'Failure Rate (λ)', definition: 'The frequency with which an engineered system or component fails, expressed in failures per unit of time. It is the inverse of MTBF (for constant failure rate systems).', category: 'Statistics' },
  { term: 'PFD', definition: 'Probability of Failure on Demand. A value that indicates the probability that a system will fail to perform a specified safety function when called upon.', category: 'Statistics' },
  { term: 'SIL', definition: 'Safety Integrity Level. A relative level of risk-reduction provided by a safety function, ranging from SIL 1 (lowest) to SIL 4 (highest).', category: 'General' },
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
