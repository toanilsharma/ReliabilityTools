/**
 * Curated list of Reliability Engineering Terms for Termle
 * Each word includes length, clue/hint, and glossary definition reference.
 */

export interface TermleWord {
  word: string; // Uppercase
  clue: string;
  category: 'General' | 'Statistics' | 'Maintenance';
  definition: string;
}

export const TERMLE_WORDS: TermleWord[] = [
  {
    word: 'MTBF',
    clue: 'Foundational repairable metric: mean time between breakdowns.',
    category: 'General',
    definition: 'Mean Time Between Failures: average operational time between consecutive failures in repairable assets.'
  },
  {
    word: 'MTTR',
    clue: 'Maintainability measure: mean time to restore and repair.',
    category: 'General',
    definition: 'Mean Time To Repair: the average elapsed time required to troubleshoot, repair, and recommission an asset.'
  },
  {
    word: 'MTTF',
    clue: 'Disposable life: mean time to failure for non-repairables.',
    category: 'General',
    definition: 'Mean Time To Failure: expected service lifespan for disposable, non-repairable components like light bulbs.'
  },
  {
    word: 'BETA',
    clue: 'Weibull shape parameter: dictates wear-out vs infant mortality.',
    category: 'Statistics',
    definition: 'The shape parameter (β) in Weibull life data modeling indicating failure physics (β<1 infant, β=1 random, β>1 wear).'
  },
  {
    word: 'FMEA',
    clue: 'Proactive qualitative risk methodology analyzing failure modes.',
    category: 'Maintenance',
    definition: 'Failure Modes and Effects Analysis: systematic procedure to evaluate potential failure modes and severity.'
  },
  {
    word: 'ALARP',
    clue: 'Risk principle: as low as reasonably practicable.',
    category: 'Statistics',
    definition: 'A principle stating that residual operational risk must be reduced until the cost of further reduction is disproportionate.'
  },
  {
    word: 'SPARE',
    clue: 'Provisioned backup component kept in inventory.',
    category: 'Maintenance',
    definition: 'A replacement part held in stock to minimize downtime when an operating component fails.'
  },
  {
    word: 'AVAIL',
    clue: 'System readiness ratio: uptime divided by total scheduled time.',
    category: 'General',
    definition: 'Availability: probability that a system is operable and in an operable state at any given point in time.'
  },
  {
    word: 'WEIBULL',
    clue: 'Versatile probability distribution used across all life data analysis.',
    category: 'Statistics',
    definition: 'Continuous probability distribution introduced by Waloddi Weibull to model aging, fatigue, and reliability.'
  },
  {
    word: 'PARETO',
    clue: 'The 80/20 rule: vital few causes drive most downtime.',
    category: 'General',
    definition: 'Pareto Principle stating that roughly 80% of consequences come from 20% of causes.'
  },
  {
    word: 'HAZARD',
    clue: 'Instantaneous failure rate function over time: h(t).',
    category: 'Statistics',
    definition: 'Hazard Rate: conditional probability of failure given survival up to time t.'
  },
  {
    word: 'FRACAS',
    clue: 'Closed-loop failure reporting, analysis, and corrective action system.',
    category: 'Maintenance',
    definition: 'Failure Reporting, Analysis, and Corrective Action System used to iteratively eliminate systemic defects.'
  },
  {
    word: 'SERIES',
    clue: 'System topology where failure of any single component breaks the system.',
    category: 'Statistics',
    definition: 'Reliability configuration where all components must function for system success; no redundancy.'
  },
  {
    word: 'MARKOV',
    clue: 'Stochastic model with memoryless state transitions.',
    category: 'Statistics',
    definition: 'Mathematical system that transitions from one state to another on a state space with memoryless property.'
  },
  {
    word: 'CENSOR',
    clue: 'Data where failure has not occurred yet (suspended survival test).',
    category: 'Statistics',
    definition: 'Censored Life Data: units surviving the observation window without failing; critical for unbiased Weibull fitting.'
  },
  {
    word: 'UPTIME',
    clue: 'The duration or percentage of time equipment operates without failure.',
    category: 'General',
    definition: 'The net active operating time when an asset is running and capable of production.'
  },
  {
    word: 'REPAIR',
    clue: 'Action taken to restore a failed item to working condition.',
    category: 'Maintenance',
    definition: 'Maintenance activity undertaken to restore an item to operational standard following degradation or fault.'
  },
  {
    word: 'SAFETY',
    clue: 'Protection of personnel, assets, and environment from catastrophic harm.',
    category: 'General',
    definition: 'Condition of being protected from or unlikely to cause danger, risk, or injury.'
  },
  {
    word: 'SYSTEM',
    clue: 'Interconnected assembly of components working towards a function.',
    category: 'General',
    definition: 'A regularly interacting or interdependent group of items forming an integrated operational whole.'
  },
  {
    word: 'INFANT',
    clue: 'Early failure phase caused by manufacturing or installation defects.',
    category: 'Maintenance',
    definition: 'Infant Mortality: decreasing failure rate region at the beginning of the bathtub curve.'
  },
  {
    word: 'BATHTUB',
    clue: 'Three-phase hazard curve: infant mortality, useful life, and wear-out.',
    category: 'General',
    definition: 'Iconic visual representation of failure rate over equipment lifecycle from commissioning to wear-out.'
  },
  {
    word: 'FAILURE',
    clue: 'Termination of an item\'s ability to perform its specified function.',
    category: 'General',
    definition: 'Functional failure: state where an asset cannot deliver required operational capability or throughput.'
  },
  {
    word: 'CRITICAL',
    clue: 'Asset classification where outage imposes extreme safety or financial loss.',
    category: 'Maintenance',
    definition: 'High-consequence asset whose unexpected failure halts entire plant operations or violates safety standards.'
  },
  {
    word: 'POISSON',
    clue: 'Discrete distribution modeling random event counts over fixed intervals.',
    category: 'Statistics',
    definition: 'Probability distribution expressing the probability of a given number of events occurring in a fixed interval.'
  },
  {
    word: 'REDUCED',
    clue: 'Lowered operational risk achieved via proactive maintenance.',
    category: 'Maintenance',
    definition: 'Mitigation of failure severity or occurrence through preventive intervention.'
  }
];

// Valid words accepted as guesses (includes target words + standard English terms)
export const VALID_GUESSES = new Set([
  ...TERMLE_WORDS.map(t => t.word),
  'ALARP', 'ASSET', 'AVAIL', 'BATCH', 'BEARING', 'BETA', 'BLOCK', 'BOILER', 'BREAK',
  'CENSOR', 'CHAIN', 'CHART', 'CHECK', 'CLEAN', 'CMMS', 'COUNT', 'CRACK', 'CYCLE',
  'DECAY', 'DEFECT', 'DELAY', 'DELTA', 'DIAG', 'DRIFT', 'DRIVE', 'DUAL', 'DUTY',
  'EARLY', 'EFFORT', 'ENGINE', 'EVENT', 'FAULT', 'FMEA', 'FMECA', 'FORCE', 'FRACAS',
  'GASKET', 'GAUGE', 'GEAR', 'GRADE', 'GRAPH', 'GREASE', 'GRID', 'GROWTH',
  'HAZARD', 'HEALTH', 'HEAT', 'HOURS', 'HYDRAULIC', 'IMPACT', 'INFANT', 'INSPECT',
  'LEAD', 'LEAK', 'LEVEL', 'LIFE', 'LIMIT', 'LOAD', 'LOGIC', 'LOSS', 'LUBE',
  'MARKOV', 'MATRIX', 'MEAN', 'METRIC', 'MODEL', 'MOTOR', 'MTBC', 'MTBF', 'MTTF', 'MTTR',
  'NORMAL', 'NOZZLE', 'NOISE', 'NUMBER', 'OEE', 'OPERATE', 'ORDER', 'OUTAGE',
  'PARETO', 'PART', 'PARALLEL', 'PEAK', 'PERIOD', 'PHASE', 'PISTON', 'PLANT', 'PLOT',
  'PM', 'POISSON', 'POLICY', 'POWER', 'PREDICT', 'PROB', 'PUMP',
  'RANDOM', 'RANGE', 'RANK', 'RATE', 'RBD', 'RCA', 'RCM', 'REDUCE', 'REPAIR', 'RESET',
  'RISK', 'ROBOT', 'ROTARY', 'ROTOR', 'RPN', 'RUL',
  'SAFETY', 'SAMPLE', 'SCALE', 'SENSOR', 'SERIES', 'SEVER', 'SHAFT', 'SHIFT', 'SHOCK',
  'SIGNAL', 'SIL', 'SIZE', 'SLOPE', 'SPARE', 'SPEED', 'STRESS', 'SYSTEM',
  'TARGET', 'TASK', 'TEMP', 'TEST', 'TIME', 'TOTAL', 'TRAIN', 'TREND',
  'UNITS', 'UPTIME', 'USAGE', 'VALVE', 'VARY', 'VIBRATION', 'VOLUME',
  'WEAR', 'WEIBULL', 'WEIGHT', 'WIRE', 'YIELD', 'ZERO', 'ZONE'
]);

/**
 * Returns the daily term based on date offset from a fixed epoch
 */
export function getDailyTerm(date: Date = new Date()): { term: TermleWord; dayNumber: number } {
  // Epoch: Jan 1, 2026
  const epoch = new Date(2026, 0, 1).getTime();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.max(0, Math.floor((today - epoch) / (1000 * 60 * 60 * 24)));
  
  const index = diffDays % TERMLE_WORDS.length;
  return {
    term: TERMLE_WORDS[index],
    dayNumber: diffDays + 1
  };
}
