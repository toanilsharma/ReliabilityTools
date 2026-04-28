import { QuizQuestion } from '../types';

export const quizQuestionsElectrical: QuizQuestion[] = [
  // Easy (1-12)
  {
    id: 401,
    text: "What does an insulation resistance (IR) test (Megger) measure?",
    options: ["The resistance of the copper wire", "The integrity and resistance of the electrical insulation", "The voltage of the system", "The power factor"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "An IR test measures the high resistance of the insulation surrounding a conductor to check for degradation or moisture.",
    discipline: "electrical"
  },
  {
    id: 402,
    text: "What is the primary function of an Uninterruptible Power Supply (UPS)?",
    options: ["To increase line voltage", "To provide backup power instantly during a mains failure", "To convert DC to DC", "To cool server racks"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "A UPS provides continuous, uninterrupted power to critical loads during utility power outages using batteries.",
    discipline: "electrical"
  },
  {
    id: 403,
    text: "In AC power, what is 'Power Factor'?",
    options: ["The ratio of working power (kW) to apparent power (kVA)", "The total voltage", "The speed of the motor", "The resistance of the wire"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "Power factor is a measure of how effectively electrical power is being converted into useful work output (kW/kVA).",
    discipline: "electrical"
  },
  {
    id: 404,
    text: "What is the purpose of a protective relay in a power system?",
    options: ["To generate electricity", "To detect abnormal conditions and trip circuit breakers", "To step up voltage", "To store energy"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Protective relays monitor electrical parameters and initiate the opening of circuit breakers to isolate faults.",
    discipline: "electrical"
  },
  {
    id: 405,
    text: "What type of maintenance is thermography (infrared scanning) commonly used for in electrical panels?",
    options: ["Reactive maintenance", "Condition-based (predictive) maintenance", "Run-to-failure", "Time-based preventive maintenance"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Thermography is a predictive tool used to find loose connections or overloaded circuits by detecting excess heat.",
    discipline: "electrical"
  },
  {
    id: 406,
    text: "What is a 'VFD'?",
    options: ["Variable Frequency Drive", "Voltage Flow Detector", "Virtual Force Device", "Velocity Friction Damper"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "A Variable Frequency Drive controls the speed of an AC motor by varying the frequency and voltage of its power supply.",
    discipline: "electrical"
  },
  {
    id: 407,
    text: "Which of the following is the most common cause of electrical motor failure?",
    options: ["Winding insulation failure", "Bearing failure", "Shaft breakage", "Cooling fan loss"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Statistically, mechanical bearing failures account for over 50% of all electric motor failures.",
    discipline: "electrical"
  },
  {
    id: 408,
    text: "What is the standard unit of electrical capacitance?",
    options: ["Ohm", "Henry", "Farad", "Ampere"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "The Farad is the SI unit of electrical capacitance.",
    discipline: "electrical"
  },
  {
    id: 409,
    text: "What does 'Grounding' or 'Earthing' an electrical system do?",
    options: ["Increases the voltage", "Provides a safe path for fault current to the earth", "Reduces power consumption", "Converts AC to DC"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Grounding provides a low-resistance path to earth to safely dissipate fault currents and protect personnel from shock.",
    discipline: "electrical"
  },
  {
    id: 410,
    text: "What instrument is used to measure the current flowing through a wire without disconnecting it?",
    options: ["Voltmeter", "Clamp meter (Amprobe)", "Megger", "Oscilloscope"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "A clamp meter uses a current transformer jaw to measure magnetic fields and determine current without breaking the circuit.",
    discipline: "electrical"
  },
  {
    id: 411,
    text: "What is 'Harmonic Distortion' in an electrical system?",
    options: ["Voltage drops over long cables", "Current leakage to ground", "Distortion of the pure sine wave caused by non-linear loads", "A short circuit"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Harmonics are multiples of the fundamental frequency caused by non-linear loads (like VFDs or computers), distorting the sine wave.",
    discipline: "electrical"
  },
  {
    id: 412,
    text: "What is a 'transfer switch' used for in power reliability?",
    options: ["To turn on lights", "To switch a load between a primary power source and a backup generator", "To change voltage levels", "To isolate a motor"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Transfer switches safely transfer a critical electrical load from the utility grid to a backup generator during an outage.",
    discipline: "electrical"
  },

  // Difficult (13-21)
  {
    id: 413,
    text: "What does a Polarization Index (PI) test evaluate?",
    options: ["The magnetic alignment of a stator", "The ratio of 10-minute to 1-minute insulation resistance to evaluate winding contamination/moisture", "The power factor of a capacitor", "The impedance of a transformer"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "PI is an IR ratio test. A low PI (< 1.5) usually indicates moisture or contamination in the motor windings.",
    discipline: "electrical"
  },
  {
    id: 414,
    text: "In dissolved gas analysis (DGA) of transformer oil, a high level of Acetylene (C2H2) specifically indicates:",
    options: ["Normal aging", "Low-temperature thermal fault", "High-energy arcing", "Moisture ingress"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "Acetylene requires extremely high temperatures to form, making it the primary indicator of high-energy arcing within a transformer.",
    discipline: "electrical"
  },
  {
    id: 415,
    text: "What is the primary cause of 'Corona Discharge' in high voltage systems?",
    options: ["Low voltage", "Ionization of the air surrounding a conductor due to a high electric field gradient", "Galvanic corrosion", "Resonance"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Corona is a luminous discharge caused by the ionization of air when the electric field gradient exceeds the breakdown strength of air.",
    discipline: "electrical"
  },
  {
    id: 416,
    text: "What condition does 'Partial Discharge' (PD) monitoring detect?",
    options: ["Broken shafts", "Localized dielectric breakdowns in a small portion of solid or fluid electrical insulation", "Overloaded breakers", "Harmonic resonance"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "PD is a localized electrical discharge that only partially bridges the insulation. It progressively degrades HV insulation over time.",
    discipline: "electrical"
  },
  {
    id: 417,
    text: "In electrical protection, what is 'Selectivity' or 'Coordination'?",
    options: ["Ensuring all breakers trip at the same time", "Ensuring only the breaker closest to the fault trips, leaving the rest of the system online", "Matching the color of the wires", "Balancing the 3 phases"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Selectivity ensures that in the event of a fault, the protective device nearest the fault isolates it, minimizing the outage area.",
    discipline: "electrical"
  },
  {
    id: 418,
    text: "What does the 'K-factor' of a transformer indicate?",
    options: ["Its physical size", "Its ability to supply non-linear loads and withstand the heating effects of harmonic currents", "Its voltage ratio", "Its efficiency rating"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "K-factor rated transformers are designed with extra thermal capacity and specific windings to handle harmonic-rich non-linear loads.",
    discipline: "electrical"
  },
  {
    id: 419,
    text: "What is a 'Symmetrical Fault'?",
    options: ["A fault affecting only one phase", "A three-phase fault where all phases are affected equally", "A fault with zero current", "A mechanical alignment issue"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "A symmetrical (or balanced) fault involves all three phases shorted together simultaneously.",
    discipline: "electrical"
  },
  {
    id: 420,
    text: "What is the purpose of 'Motor Current Signature Analysis' (MCSA)?",
    options: ["To measure cable length", "To analyze the stator current spectrum to detect rotor bar damage or eccentricity", "To check phase rotation", "To measure insulation resistance"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "MCSA analyzes the frequency spectrum of motor current. Broken rotor bars create distinct sidebands around the line frequency.",
    discipline: "electrical"
  },
  {
    id: 421,
    text: "What is 'Arc Flash'?",
    options: ["A type of lightbulb", "An explosive release of energy caused by an electrical arc, posing severe burn hazards", "A method of welding", "A static discharge"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "An arc flash is a dangerous, explosive release of radiant and convective energy caused by an electrical short circuit through the air.",
    discipline: "electrical"
  },

  // Very Difficult (22-30)
  {
    id: 422,
    text: "In a power system, what happens during 'Ferroresonance'?",
    options: ["The system trips offline safely", "A non-linear resonance between system capacitance and the saturable magnetizing inductance of a transformer, causing massive overvoltages", "Current drops to zero", "Power factor improves to 1.0"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Ferroresonance is a complex, non-linear phenomenon that can cause sustained overvoltages and destroy transformers, often triggered by single-phase switching.",
    discipline: "electrical"
  },
  {
    id: 423,
    text: "When analyzing a VFD-driven motor, what is the 'common mode voltage' phenomenon?",
    options: ["A voltage that is zero at all times", "A high-frequency voltage present on all three phases simultaneously with respect to ground, which can cause bearing currents", "The line-to-line 50/60Hz voltage", "A voltage drop across the cable"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The fast switching of IGBTs in a VFD creates common mode voltages that do not sum to zero, driving destructive high-frequency currents through the motor bearings.",
    discipline: "electrical"
  },
  {
    id: 424,
    text: "What is the function of an 'ANSI 87' relay?",
    options: ["Time overcurrent", "Differential protection", "Under-voltage", "Distance/Impedance protection"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "In the ANSI device numbers standard, 87 is the designation for a Differential protective relay, which compares current entering and leaving a zone.",
    discipline: "electrical"
  },
  {
    id: 425,
    text: "In transformer DGA, what does a Duval Triangle analyze?",
    options: ["The physical shape of the core", "The relative percentages of CH4, C2H4, and C2H2 to pinpoint the specific type of electrical/thermal fault", "The voltage vectors", "The delta-wye connection"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The Duval Triangle plots the ratios of Methane, Ethylene, and Acetylene to accurately classify fault types (e.g., partial discharge, arcing, hot spots) in transformers.",
    discipline: "electrical"
  },
  {
    id: 426,
    text: "What characterizes a 'Zero Sequence' current in a three-phase system?",
    options: ["It only exists in balanced systems", "It is a set of three in-phase currents that only flow during unsymmetrical ground faults", "It is the reactive current", "It is the starting inrush current"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Zero sequence currents are equal in magnitude and strictly in phase with each other. They sum together and flow through the neutral/ground path during earth faults.",
    discipline: "electrical"
  },
  {
    id: 427,
    text: "Why is 'Transient Recovery Voltage' (TRV) critical for high-voltage circuit breakers?",
    options: ["It improves power factor", "It is the voltage across the breaker contacts immediately after arc interruption; if it rises faster than the dielectric recovers, the arc re-strikes", "It helps the breaker close faster", "It measures the battery voltage"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "TRV determines whether a breaker successfully clears a fault. If the system TRV exceeds the breaker's dielectric recovery strength, a dangerous re-strike occurs.",
    discipline: "electrical"
  },
  {
    id: 428,
    text: "In battery reliability (e.g., for UPS), what does 'Internal Ohmic Testing' (Impedance/Conductance) evaluate?",
    options: ["The color of the acid", "The internal degradation (like grid corrosion or plate sulfation) before a total capacity failure occurs", "The room temperature", "The AC ripple voltage"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Internal resistance/impedance testing tracks the state of health of VRLA batteries by measuring internal electrical pathways, identifying degrading cells without full discharge tests.",
    discipline: "electrical"
  },
  {
    id: 429,
    text: "What causes 'Skin Effect' in electrical conductors?",
    options: ["Sunlight degradation of insulation", "Alternating current tending to flow near the outer surface of a conductor due to self-inductance, increasing effective resistance", "Oxidation of the copper", "High ambient temperatures"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Skin effect is the tendency of AC to concentrate near the conductor's surface at higher frequencies, reducing the effective cross-sectional area and increasing AC resistance.",
    discipline: "electrical"
  },
  {
    id: 430,
    text: "What is an 'Islanding' condition in distributed generation?",
    options: ["A solar panel placed on an island", "When a distributed generator continues to power a portion of the grid even though power from the main utility is no longer present", "Isolating a fault with a breaker", "Using a standalone generator for a single motor"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Islanding is a dangerous condition where a local generator (like solar/wind) unintentionally keeps a grid segment energized after a utility blackout, endangering line workers.",
    discipline: "electrical"
  }
];
